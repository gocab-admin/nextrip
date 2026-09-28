import 'dart:ui';

import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/user/estimation_response_model.dart';
import 'package:airstar_flutter/data/models/user/listing_detail_response_model.dart';
import 'package:airstar_flutter/payment_gateway_services/stripe_service.dart';
import 'package:airstar_flutter/ui/user/Product/product_detail/common_date_picker_card.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:get/route_manager.dart';
import 'package:provider/provider.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';

import '../../../payment_gateway_services/phonepe_services.dart';
import '../../../payment_gateway_services/razorpay_service.dart';
import '../../../routes/routes.dart';
import '../Product/product_detail/product_detail_screen.dart';
import 'check_availability_screen.dart';

class ReservationScreen extends StatefulWidget {
  final ListingDetailResponseModel? detailmodel;
  final EstimationResponseModel? estimationModel;
  final String bookingType;

  const ReservationScreen({
    Key? key,
    required this.detailmodel,
    required this.estimationModel,
    required this.bookingType,
  }) : super(key: key);

  @override
  State<ReservationScreen> createState() => _ReservationScreenState();
}

class _ReservationScreenState extends State<ReservationScreen> {
  BookingViewModel? bookingViewModel;
  LoginViewModel? loginViewModel;
  EditProfileViewModel? editProfileViewModel;
  CommonViewModel? commonViewModel;
  ProductListingViewModel? listingViewModel;
  ProductDetailViewModel? productDetailViewModel;
  late RazorpayService razorpayService;
  late StripeService stripeService;
  late PhonePeService _phonePeService;

  List<PriceDetails> priceDetails = [PriceDetails(title: "taxes", subTitle: "taxesSub")];

  String? token;

  @override
  void initState() {
    getToken();
    bookingViewModel = Provider.of<BookingViewModel>(context, listen: false);
    loginViewModel = Provider.of<LoginViewModel>(context, listen: false);
    commonViewModel = Provider.of<CommonViewModel>(context, listen: false);
    productDetailViewModel = Provider.of<ProductDetailViewModel>(context, listen: false);
    editProfileViewModel = Provider.of<EditProfileViewModel>(context, listen: false);
    listingViewModel = Provider.of<ProductListingViewModel>(context, listen: false);
    initPaymentService();
    super.initState();
  }

  initPaymentService() {
    razorpayService = RazorpayService(
      editProfileViewModel: editProfileViewModel!,
      checkPaymentStatus: (val) {
        checkPaymentStatus(AppConstant.paymentMethod[0], response: val);
      },
    );
    stripeService = StripeService(
      getPaymentStatus: () {
        checkPaymentStatus(AppConstant.paymentMethod[1]);
      },
    );
    razorpayService.initialize();
    bookingViewModel?.selectedPaymentType = "stripe";
  }

  Future getToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    token = prefs.getString(PrefConstant.authToken);

    if (token == null) {
      loginViewModel?.clearUserId();
      loginViewModel?.notify();
    }
    listingViewModel?.notify();
  }

  @override
  void dispose() {
    razorpayService.dispose();
    super.dispose();
  }

  void handleReserveButtonTap({
    required BuildContext context,
    required BookingViewModel value,
    required LoginViewModel loginValue,
    required ProductDetailViewModel productDetailModel,
  }) async {
    await getToken();
    if (token != null) {
      final detailData = widget.detailmodel?.data?.listing?.first;
      final Estimation? estimationData =
          productDetailModel.estimationResponseModel?.data?.estimation ??
          widget.estimationModel?.data?.estimation;

      // Prevent booking own listing
      if (loginValue.userId == detailData?.providerData?.id) return;

      if (productDetailModel.currentCard && estimationData != null) {
        if (value.selectedPaymentType == "payAtHotel") {
          ToastUtil.showMessage("bookingProgressMsg");
        } else {
          ToastUtil.showMessage("paymentProgressMsg");
        }

        final isOnlinePayment = value.selectedPaymentType != "payAtHotel";

        value
            .fetchBooking(
              id: estimationData.listingId ?? '',
              bookingType: estimationData.bookingType!,
              startDate: estimationData.startDate!,
              endDate: estimationData.endDate!,
              paymentMode: isOnlinePayment ? 'card' : 'cash',
              adults: estimationData.adult!,
              children: estimationData.children!,
              pets: estimationData.pets!,
              paymentMethod: isOnlinePayment ? value.selectedPaymentType.toLowerCase() : null,
              currency: productDetailModel.estimationResponseModel?.data!.multipleCurrency!.toCode ?? '',
            )
            .then((val) {
              if (val == true) {
                if (value.selectedPaymentType == "payAtHotel") {
                  productDetailModel.clearSelectedDate(listingId: estimationData.listingId ?? '');
                  Get.toNamed(RouterName.bookingScreen);
                } else if (value.selectedPaymentType == AppConstant.paymentMethod[1]) {
                  var secret = bookingViewModel!.bookingResponseModel!.data!.booking!.payment!.clientSecret;
                  Logger.appLogs("client secret $secret");
                  stripeService.initStripe(secret!, context: context);
                } else if (value.selectedPaymentType == AppConstant.paymentMethod[0]) {
                  var razorpayDetail = bookingViewModel?.bookingResponseModel?.data?.booking?.payment;
                  Logger.appLogs(
                    "Opening Razorpay payment with amount: ${razorpayDetail?.amount?.toInt()} and orderId: ${razorpayDetail?.id}",
                  );
                  razorpayService.openCheckOut(razorpayDetail!.amount!.toInt(), "${razorpayDetail.id}");
                } else if (value.selectedPaymentType == AppConstant.paymentMethod[2]) {
                  _phonePeService = PhonePeService(
                    isProduction: true,
                    merchantId:
                        bookingViewModel?.bookingResponseModel?.data?.booking?.payment?.merchantOrderId ?? '',
                  );
                  _phonePeService.initPhonePeSdk().then((onValue) {
                    _phonePeService
                        .startTransaction(
                          bookingViewModel?.bookingResponseModel?.data?.booking?.payment?.orderId ?? '',
                          bookingViewModel?.bookingResponseModel?.data?.booking?.payment?.token ?? '',
                          "",
                        )
                        .then((onValue) {
                          Logger.appLogs("_phonePeService onValue:: $onValue");
                          if (onValue) checkPaymentStatus(AppConstant.paymentMethod[2]);
                        });
                  });
                }
              }
            });
      } else {
        ToastUtil.showMessage("selectPymntMethd");
      }
    } else {
      showCustomModalBottomSheet(
        showDivider: false,
        showIcon: false,
        isDismissible: false,
        enableDrag: false,
        backgroundColor: AppColorData.appSecondaryColor,
        context: context,
        builder: (context) => LoginScreen(isBottomSheet: true),
      );
    }
  }

  checkPaymentStatus(String paymentMethod, {PaymentSuccessResponse? response}) {
    bookingViewModel
        ?.paymentStatus(
          paymentMethod: paymentMethod,
          paymentId: bookingViewModel?.bookingResponseModel?.data?.booking?.payment?.id ?? "",
          invoiceId: bookingViewModel?.bookingResponseModel?.data?.booking?.invoiceId ?? "",
          razorpayOrderId: response?.orderId ?? "",
          razorpayPaymentId: response?.paymentId ?? "",
          razorpaySignature: response?.signature ?? "",
          phonePeMerchantOrderId: (paymentMethod == AppConstant.paymentMethod[2])
              ? bookingViewModel?.bookingResponseModel?.data?.booking?.payment?.merchantOrderId
              : null,
        )
        .then((val) {
          if (val == true) {
            productDetailViewModel?.clearSelectedDate(
              listingId: productDetailViewModel?.estimationResponseModel?.data?.estimation?.listingId ?? '',
            );
            Get.toNamed(RouterName.bookingScreen);
          }
        });
  }

  @override
  Widget build(BuildContext context) {
    final detailData = widget.detailmodel?.data?.listing?.first;
    return Consumer<LoginViewModel>(
      builder: (context, loginValue, child) {
        return WillPopScope(
          onWillPop: () async {
            await loginValue.getToken();
            if (loginValue.userId == detailData?.providerData?.id) {
              Get.offAllNamed(RouterName.dashBoard);
              return false;
            }
            return true;
          },
          child: Stack(
            children: [
              Scaffold(
                backgroundColor: AppColorData.appSecondaryColor,
                appBar: CommonAppBar(
                  onTap: () async {
                    await loginValue.getToken();
                    if (loginValue.userId == detailData?.providerData?.id) {
                      Get.offAllNamed(RouterName.dashBoard);
                      return false;
                    } else {
                      Get.back();
                    }
                  },
                  titleText: "requestToBook",
                ),
                body: Consumer2<ProductListingViewModel, ProductDetailViewModel>(
                  builder: (context, value, listingDetailModel, child) {
                    Estimation? estimationData =
                        listingDetailModel.estimationResponseModel?.data?.estimation ??
                        widget.estimationModel?.data!.estimation!;
                    final currency =
                        listingDetailModel.estimationResponseModel?.data?.multipleCurrency?.toSymbol;
                    var isDiscountAvailable = (estimationData?.discountedPrice ?? 0) > 0;
                    return Padding(
                      padding: horizontalPadding(vertical: 16, horizontal: 20),
                      child: Column(
                        children: [
                          Expanded(
                            child: ListView(
                              children: [
                                ListingDetailsCardWidget(
                                  detailModel: widget.detailmodel,
                                  detailData: detailData,
                                  estimationData: estimationData,
                                  isDiscountAvailable: isDiscountAvailable,
                                  currency: "$currency",
                                ),
                                SizedBox(height: 40),
                                // Your trip content--------------
                                TripDetailsCardWidget(
                                  detailData: detailData,
                                  bookingType: widget.bookingType,
                                ),
                                // Price Details content-------------
                                PriceDetailsCardWidget(
                                  estimationData: estimationData,
                                  currency: "$currency",
                                  isDiscountAvailable: isDiscountAvailable,
                                ),
                                PaymentDetailsCardWidget(),
                                TextSpanCardWidget(),
                                doubleSpacer(),
                              ],
                            ),
                          ),
                          Consumer2<BookingViewModel, LoginViewModel>(
                            builder: (context, value, loginValue, child) {
                              return CommonElevatedButton(
                                // showLoader: true,
                                elevatedButtonColor: value.getReserveButtonColor(
                                  loginValue.userId ?? "",
                                  detailData?.providerData?.id,
                                ),
                                elevatedButtonName: value.getReserveButtonName(
                                  loginValue.userId ?? "",
                                  detailData?.providerData?.id,
                                ),
                                isLoad: value.state == ViewState.secondaryLoader ? true : false,
                                onTap: () async {
                                  handleReserveButtonTap(
                                    context: context,
                                    value: value,
                                    loginValue: loginValue,
                                    productDetailModel: listingDetailModel,
                                  );
                                },
                              );
                            },
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
              Consumer<BookingViewModel>(
                builder: (context, value, child) {
                  return Visibility(
                    visible: value.state == ViewState.secondaryLoader ? true : false,
                    child: Dialog(
                      insetPadding: EdgeInsets.zero,
                      backgroundColor: AppColorData.transparent,
                      child: BackdropFilter(
                        filter: ImageFilter.blur(sigmaX: 1.5, sigmaY: 1.5),
                        child: Container(child: Loader(color: AppColorData.blackClr)),
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }
}

class ListingDetailsCardWidget extends StatelessWidget {
  final ListingDetailResponseModel? detailModel;
  final dynamic detailData;
  final dynamic estimationData;
  final String? currency;
  final bool isDiscountAvailable;

  const ListingDetailsCardWidget({
    super.key,
    required this.detailModel,
    required this.detailData,
    required this.estimationData,
    required this.isDiscountAvailable,
    this.currency,
  });

  @override
  Widget build(BuildContext context) {
    final attachmentData = detailData?.attachmentData;
    final coverImage = (attachmentData != null && attachmentData.isNotEmpty)
        ? attachmentData.first.image?.coverImage ?? ""
        : "";
    return Row(
      spacing: 10,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 150,
          height: MediaQuery.of(context).size.height * 0.14,
          decoration: BoxDecoration(borderRadius: BorderRadius.circular(10)),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: coverImage.isEmpty
                ? ErrorImage()
                : CacheImageWidget(
                    imageUrl: "${coverImage}",
                    //  imageUrl: detailData?.attachmentData?.first.image?.coverImage ?? "",
                    errorBuilder: (context, url, error) {
                      return ErrorImage();
                    },
                    fit: BoxFit.fill,
                  ),
          ),
        ),
        Flexible(
          child: Column(
            spacing: 2,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CommonText(
                text: detailData?.propertyName,
                style: AppTextStyle.bodyTextStyle.copyWith(fontWeight: FontWeight.w600),
              ),
              CommonText(
                text: "${detailData?.address?.city.toString()},${detailData?.address?.country.toString()} ",
                style: AppTextStyle.subBodyStyle.copyWith(fontWeight: FontWeight.w100),
              ),
              if (isDiscountAvailable) ...[
                CommonDiscountPriceText(
                  isReservationScreen: true,
                  currencySymbol: currency,
                  originalPrice: "${estimationData?.perDay}",
                  discountedPrice: estimationData?.discountedPrice,
                  discountPercentage: "${estimationData?.discountPercentage}",
                ),
                CommonText(
                  text: "discountSub",
                  style: AppTextStyle.contentStyle.copyWith(color: AppColorData.subBodyTextClr),
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }
}

class TripDetailsCardWidget extends StatelessWidget {
  final Listing? detailData;
  final String bookingType;

  const TripDetailsCardWidget({super.key, this.detailData, required this.bookingType});

  @override
  Widget build(BuildContext context) {
    return Consumer2<ProductDetailViewModel, CommonViewModel>(
      builder: (context, value, commonValue, child) {
        final estimationData = value.estimationResponseModel?.data?.estimation;
        var apiDateFormat = commonValue.settingsResponseModel?.data?.hiddenSettings?.dateFormat;
        bool isDayMode = estimationData?.bookingType == "Day";

        getGuestCount() {
          return int.parse(estimationData?.adult ?? "1") + int.parse(estimationData?.children ?? "0");
        }

        return Column(
          // spacing: 10,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CommonText(text: "yourTrip", style: AppTextStyle.titleStyle),
            spacer(),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                CommonText(text: "dates", style: AppTextStyle.headerStyle),
                CommonElevatedButton(
                  isTextBtn: true,
                  onTap: () {
                    value.isExpandDatePicker = true;
                    value.isExpandTimePicker = false;
                    value.isActivelySelecting = false;
                    value.notify();
                    value.prepareRangePickerForListing(estimationData!.listingId!);
                    showCustomModalBottomSheet(
                      title: "dates",
                      backgroundColor: AppColorData.appSecondaryColor,
                      context: context,
                      builder: (context) {
                        return Padding(
                          padding: horizontalPadding(vertical: 20),
                          child: CommonDatePickerCard(
                            isReservationPage: true,
                            startDate: estimationData.startDate,
                            endDate: estimationData.endDate,
                            maximumNight: detailData?.priceData?.first.bookingType?.maximumNight ?? 0,
                            minimumNight: detailData?.priceData?.first.bookingType?.minimumNight ?? 0,
                            listingId: estimationData.listingId!,
                            isDayMode: isDayMode,
                          ),
                        );
                      },
                    );
                  },
                  elevatedButtonName: "edit",
                ),
              ],
            ),
            CommonText(
              text: isDayMode
                  ? DateFormatterUtil.formatDateRange(
                      estimationData?.startDate?.toString() ?? '',
                      estimationData?.endDate?.toString() ?? '',
                      apiDateFormat,
                    )
                  : DateFormatterUtil.formatDateTimeRange(
                      estimationData?.startDate?.toString() ?? '',
                      estimationData?.endDate?.toString() ?? '',
                      apiDateFormat,
                    ),
              style: AppTextStyle.bodyTextStyle,
            ),
            spacer(),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                CommonText(text: "guests", style: AppTextStyle.headerStyle),
                CommonElevatedButton(
                  isTextBtn: true,
                  onTap: () {
                    showCustomModalBottomSheet(
                      backgroundColor: AppColorData.appSecondaryColor,
                      title: "guests",
                      context: context,
                      builder: (context) {
                        return GuestDetailsBottomSheet(
                          productDetailModel: value,
                          estimation: estimationData!,
                          listingData: detailData!,
                          bookingType: bookingType,
                        );
                      },
                    );
                  },
                  elevatedButtonName: "edit",
                ),
              ],
            ),
            CommonText(
              text: "${getGuestCount()} ${tr("guest")}",
              style: AppTextStyle.bodyTextStyle.copyWith(fontWeight: FontWeight.w400),
            ),
            divider(height: 60, thickness: 8, color: AppColorData.boxBorder.withOpacity(0.4)),
          ],
        );
      },
    );
  }
}

class PriceDetailsCardWidget extends StatelessWidget {
  final dynamic estimationData;
  final String currency;
  final bool isDiscountAvailable;
  final bool? isBottomSheet;
  final TextStyle? textStyle;

  const PriceDetailsCardWidget({
    super.key,
    required this.estimationData,
    required this.currency,
    required this.isDiscountAvailable,
    this.isBottomSheet = false,
    this.textStyle,
  });

  @override
  Widget build(BuildContext context) {
    return Consumer<EditProfileViewModel>(
      builder: (context, editModel, child) {
        return Column(
          spacing: 18,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (isBottomSheet == false) CommonText(text: "priceDetails", style: AppTextStyle.headerStyle),
            if (estimationData?.nights != null && estimationData?.nights != 0)
              CommonPriceRowWidget(
                prefixText:
                    "$currency${isDiscountAvailable ? editModel.convertPrice(estimationData?.discountedPrice.toString()) : editModel.convertPrice(estimationData?.perDay.toString())} * ${estimationData?.nights} ${tr("night")}",
                suffixText: editModel.convertPrice(estimationData?.dayFare.toString()),
                currency: currency,
              ),
            if (estimationData?.hours != 0)
              CommonPriceRowWidget(
                prefixText:
                    "$currency${editModel.convertPrice(estimationData?.perHour.toString())} * ${estimationData?.hours} ${tr("hour")}",
                suffixText: editModel.convertPrice(estimationData?.hourFare.toString()),
                currency: currency,
              ),
            if (estimationData?.discountData != null)
              CommonPriceRowWidget(
                prefixText: "longStayDiscount",
                suffixText: "${estimationData?.discountData}",
                currency: currency,
              ),
            if (estimationData?.taxPercentage != 0)
              CommonPriceRowWidget(
                prefixText: "${tr("tax")} (${estimationData?.taxPercentage}%)",
                suffixText: editModel.convertPrice(estimationData?.taxAmount.toString()),
                currency: currency,
              ),
            if (isBottomSheet == true) CustomDivider(),
            CommonPriceRowWidget(
              prefixText: "total",
              suffixText: editModel.convertPrice(estimationData?.fareAmount.toString()),
              currency: currency,
              textStyle: textStyle ?? AppTextStyle.headerStyle,
            ),
            if (isBottomSheet == false) ...[
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  GestureDetector(
                    onTap: () {
                      showCustomModalBottomSheet(
                        title: "priceDetails",
                        backgroundColor: AppColorData.appSecondaryColor,
                        context: context,
                        builder: (context) {
                          return MoreInfoBottomSheet();
                        },
                      );
                    },
                    child: CommonText(isUnderline: true, text: "moreInfo", style: AppTextStyle.bodyTextStyle),
                  ),
                ],
              ),
              divider(height: 40, thickness: 8, color: AppColorData.boxBorder.withOpacity(0.4)),
            ],
          ],
        );
      },
    );
  }
}

class CommonPriceRowWidget extends StatelessWidget {
  final String? prefixText;
  final String? suffixText;
  final String? currency;
  final TextStyle? textStyle;
  final bool? isSuffixWidget;
  final Widget? suffixWidget;

  const CommonPriceRowWidget({
    super.key,
    this.prefixText,
    this.suffixText,
    this.currency,
    this.textStyle,
    this.isSuffixWidget = false,
    this.suffixWidget,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        CommonText(
          text: prefixText,
          style: textStyle ?? AppTextStyle.subBodyStyle.copyWith(fontWeight: FontWeight.w400),
        ),
        isSuffixWidget == true
            ? (suffixWidget ?? SizedBox.shrink())
            : CommonText(
                text: "$currency$suffixText",
                style: textStyle ?? AppTextStyle.bodyTextStyle.copyWith(fontWeight: FontWeight.w400),
              ),
      ],
    );
  }
}

class PaymentDetailsCardWidget extends StatelessWidget {
  const PaymentDetailsCardWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer2<BookingViewModel, CommonViewModel>(
      builder: (context, value, commonValue, child) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CommonText(text: "payWith", style: AppTextStyle.titleStyle),
            doubleSpacer(height: 5),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Flexible(
                  flex: 2,
                  child: CommonText(
                    text: "choosePaymentUsing",
                    style: AppTextStyle.bodyTextStyle.copyWith(fontWeight: FontWeight.w400),
                  ),
                ),
                //Spacer(),
                SizedBox(width: 5),
                Flexible(
                  flex: 1,
                  child: TextButton(
                    onPressed: () {
                      showCustomModalBottomSheet(
                        showIcon: false,
                        showDivider: false,
                        context: context,
                        builder: (context) {
                          return paymentOptions();
                        },
                      );
                    },
                    child: FittedBox(
                      child: CommonText(
                        style: AppTextStyle.buttonTextStyle.copyWith(color: AppColorData.appPrimaryColor),
                        text: value.selectedPaymentType,
                        isUnderline: true,
                        underLineColor: AppColorData.appPrimaryColor,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            divider(height: 60, thickness: 8, color: AppColorData.boxBorder.withOpacity(0.4)),
          ],
        );
      },
    );
  }

  Widget paymentOptions() {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 14.0, horizontal: 20.0),
      child: Consumer2<BookingViewModel, CommonViewModel>(
        builder: (context, value, commonValue, child) {
          final paymentOptions = value.paymentOptions(commonValue);
          return Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CommonText(text: "choosePaymentUsing", style: AppTextStyle.titleStyle),
              SizedBox(height: 12),
              ...paymentOptions.map((payment) {
                final isSelected = value.selectedPaymentType == payment;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: CommonElevatedButton(
                    elevatedButtonName: tr(payment),
                    onTap: () {
                      value.selectPaymentType(payment);
                      Get.back();
                    },
                    elevatedButtonColor: isSelected ? AppColorData.appPrimaryColor : AppColorData.grey06,
                    elevatedButtonNameColor: isSelected ? AppColorData.whiteClr : AppColorData.bodyTextColor,
                  ),
                );
              }).toList(),
            ],
          );
        },
      ),
    );
  }
}

class TextSpanCardWidget extends StatelessWidget {
  const TextSpanCardWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Text.rich(
      TextSpan(
        text: tr("selectBtn"),
        style: AppTextStyle.contentStyle,
        children: [
          TextSpan(
            text: tr("hostHouseRul"),
            style: AppTextStyle.contentStyle.copyWith(
              fontWeight: FontWeight.w700,
              decoration: TextDecoration.underline,
            ),
          ),
          TextSpan(
            text: tr("groundRules"),
            style: AppTextStyle.contentStyle.copyWith(
              fontWeight: FontWeight.w700,
              decoration: TextDecoration.underline,
            ),
          ),

          TextSpan(
            text: tr("airstarRebooking", namedArgs: {"appName": Strings.appName}),
            style: AppTextStyle.contentStyle.copyWith(
              fontWeight: FontWeight.w700,
              decoration: TextDecoration.underline,
            ),
          ),
          TextSpan(
            text: tr("andThatAir", namedArgs: {"appName": Strings.appName}),
            style: AppTextStyle.subBodyStyle,
          ),
          TextSpan(
            text: tr("chargePermntMthd"),
            style: AppTextStyle.contentStyle.copyWith(
              fontWeight: FontWeight.w700,
              decoration: TextDecoration.underline,
            ),
          ),
          TextSpan(text: tr("ImRespnsFrDmg"), style: AppTextStyle.contentStyle),
          // TextSpan(text: Strings.privacy, style:AppTextStyle.subUnderlinedText),
        ],
      ),
    );
  }
}

class MoreInfoBottomSheet extends StatelessWidget {
  const MoreInfoBottomSheet({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<ProductDetailViewModel>(
      builder: (context, value, child) {
        final estimationData = value.estimationResponseModel!.data!.estimation;
        var currency = value.estimationResponseModel?.data!.multipleCurrency!.toSymbol;
        var isDiscountAvailable = (estimationData?.discountedPrice ?? 0) > 0;
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              PriceDetailsCardWidget(
                isBottomSheet: true,
                estimationData: estimationData,
                currency: "$currency",
                isDiscountAvailable: isDiscountAvailable,
                textStyle: AppTextStyle.bodyTextStyle.copyWith(fontWeight: FontWeight.w700),
              ),
              SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }
}

class GuestDetails {
  GuestDetails({required this.title, required this.subtitle, this.count});

  final String title;
  final String subtitle;
  int? count;
}

class PriceDetails {
  const PriceDetails({required this.title, required this.subTitle, this.amount});

  final String title;
  final String subTitle;
  final String? amount;
}

class GuestDetailsBottomSheet extends StatelessWidget {
  final ProductDetailViewModel productDetailModel;
  final Estimation estimation;
  final Listing listingData;
  final String bookingType;

  const GuestDetailsBottomSheet({
    super.key,
    required this.productDetailModel,
    required this.estimation,
    required this.listingData,
    required this.bookingType,
  });

  @override
  Widget build(BuildContext context) {
    int maxGuestAllowed = int.parse("${listingData.guest?.adult}");
    int pets = int.parse("${listingData.guest?.pets}");

    return Consumer<BookingViewModel>(
      builder: (context, model, child) {
        return Padding(
          padding: const EdgeInsets.fromLTRB(14, 0, 14, 14),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              RichText(
                text: TextSpan(
                  children: [
                    TextSpan(
                      text: tr("${tr("thisPlaceHasmax")} $maxGuestAllowed ${tr("guestNotIncludInfant")}"),
                      style: AppTextStyle.subBodyStyle,
                    ),
                    if (pets == 0) TextSpan(text: tr("petsArentAlwd"), style: AppTextStyle.subBodyStyle),
                  ],
                ),
              ),
              doubleSpacer(),
              GuestAddon(
                title: GuestMode.Adult,
                limit: int.parse("${listingData.guest?.adult}"),
                model: productDetailModel,
                listingId: listingData.id ?? '',
                onUpdate: () {},
              ),
              GuestAddon(
                title: GuestMode.Children,
                limit: int.parse("${listingData.guest?.children}"),
                model: productDetailModel,
                listingId: listingData.id ?? '',
                onUpdate: () {},
              ),
              GuestAddon(
                title: GuestMode.Pets,
                limit: int.parse("${listingData.guest?.pets}"),
                model: productDetailModel,
                listingId: listingData.id ?? '',
                onUpdate: () {},
              ),
              CustomDivider(),
              Padding(
                padding: const EdgeInsets.all(6.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    TextButton(
                      onPressed: () {
                        productDetailModel.resetGuest(listingData.id ?? '');
                        productDetailModel.fetchEstimation(
                          id: listingData.id ?? '',
                          bookingType: bookingType,
                          startDate: estimation.startDate!,
                          endDate: estimation.endDate!,
                          onSuccessRes: () {
                            Navigator.pop(context);
                          },
                        );
                        productDetailModel.notify();
                      },
                      child: CommonText(isUnderline: true, text: "clear", style: AppTextStyle.subBodyStyle),
                    ),
                    Consumer<ProductDetailViewModel>(
                      builder: (context, value, child) {
                        return CommonElevatedButton(
                          isLoad: value.state == ViewState.secondaryLoader,
                          showLoader: true,
                          width: MediaQuery.of(context).size.width * 0.3,
                          onTap: () {
                            value.fetchEstimation(
                              id: listingData.id ?? '',
                              bookingType: bookingType,
                              startDate: estimation.startDate!,
                              endDate: estimation.endDate!,
                              onSuccessRes: () {
                                Navigator.pop(context);
                              },
                            );
                          },
                          elevatedButtonName: "save",
                          elevatedButtonNameColor: AppColorData.appSecondaryColor,
                          elevatedButtonColor: AppColorData.blackButtonClr,
                        );
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

DropdownMenuItem<String> buildPaymentDropdownItem({
  required String value,
  required String selectedValue,
  required String paymentType,
}) {
  return DropdownMenuItem(
    value: value,
    child: FittedBox(
      child: CommonText(
        text: paymentType,
        style: AppTextStyle.buttonTextStyle.copyWith(
          color: value == selectedValue ? AppColorData.appPrimaryColor : AppColorData.bodyTextColor,
        ),
      ),
    ),
  );
}
