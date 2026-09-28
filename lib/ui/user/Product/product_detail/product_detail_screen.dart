import 'dart:convert';
import 'dart:ui';

import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/user/estimation_response_model.dart';
import 'package:airstar_flutter/data/models/user/listing_response_model.dart';
import 'package:airstar_flutter/ui/user/Product/mapview.dart';
import 'package:airstar_flutter/ui/user/Product/product_detail/amenities_and_details.dart';
import 'package:airstar_flutter/ui/user/Product/product_detail/common_date_picker_card.dart';
import 'package:airstar_flutter/ui/user/Product/product_detail/review_details.dart';
import 'package:airstar_flutter/ui/user/Product/product_list.dart';
import 'package:airstar_flutter/ui/user/dashBoard/product_detail_loader.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:provider/provider.dart';

import '../../../../data/models/guest_count_model/guest_count_models.dart';
import '../../../../data/models/user/category_response_model.dart';
import '../../../../routes/router_name.dart';
import '../sub_widgets/debounce_share_button.dart';
import 'meet_host_view.dart';

class ProductDetailScreen extends StatefulWidget {
  final String listingId;
  final bool wishlist;
  final ApprovedListing? approvedListing;
  final List<String> images;
  final bool? isIndexPage;

  ProductDetailScreen({
    super.key,
    this.approvedListing,
    required this.listingId,
    required this.wishlist,
    required this.images,
    this.isIndexPage = false,
  });

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  ProductListingViewModel? listingViewModel;
  ProductDetailViewModel? listingDetailViewModel;
  CommonViewModel? commonViewModel;

  WishlistViewModel? wishlistViewModel;
  List<Category> categories = [];
  String? token;
  bool isRequestButtonLoading = false;

  String? userId;

  int index = 1;

  final ScrollController _scrollController = ScrollController();
  bool _isScrolled = false;

  @override
  void initState() {
    getToken();
    listingViewModel = Provider.of<ProductListingViewModel>(context, listen: false);
    listingDetailViewModel = Provider.of<ProductDetailViewModel>(context, listen: false);
    wishlistViewModel = Provider.of<WishlistViewModel>(context, listen: false);
    commonViewModel = Provider.of<CommonViewModel>(context, listen: false);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      listingDetailViewModel!.fetchListingDetail(
        id: widget.listingId,
        successResFun: () {
          listingDetailViewModel!.fetchReviewsAndRating(id: widget.listingId);
        },
      );
      listingViewModel!.selectedBedroom = 1;
    });

    scrollFun();

    super.initState();
  }

  Future getToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    userId = await PreferenceHelper.getString(PrefConstant.userId);
    token = prefs.getString(PrefConstant.authToken);
    print("userId :: $userId");
    listingViewModel?.notify();
  }

  scrollFun() {
    _scrollController.addListener(() {
      // Check if the user has scrolled past a certain point (e.g., 10 pixels)
      if (_scrollController.offset > 10 && !_isScrolled) {
        _isScrolled = true;
        listingDetailViewModel?.notify();
      } else if (_scrollController.offset <= 10 && _isScrolled) {
        _isScrolled = false;
        listingDetailViewModel?.notify();
      }
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColorData.appSecondaryColor,
      extendBodyBehindAppBar: true,
      body: Stack(
        children: [
          NestedScrollView(
            controller: _scrollController,
            headerSliverBuilder: (context, innerBoxIsScrolled) => [
              SliverAppBar(
                systemOverlayStyle: SystemUiOverlayStyle(
                  statusBarIconBrightness: Brightness.light,
                  statusBarColor: AppColorData.transparent,
                ),
                expandedHeight: MediaQuery.of(context).size.height * 0.4,
                backgroundColor: AppColorData.transparent,
                elevation: 0,
                leadingWidth: 50,
                leading: GestureDetector(
                  onTap: () {
                    Navigator.pop(context);
                  },
                  child: Padding(
                    padding: const EdgeInsets.only(left: 15).toLTRAware(context),
                    child: CircleAvatar(
                      backgroundColor: AppColorData.appSecondaryColor,
                      // radius: 18,
                      child: Icon(Icons.arrow_back, size: 20, color: AppColorData.appIconBlack),
                    ),
                  ),
                ),
                actions: [
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 14.0),
                    child: Consumer2<ProductListingViewModel, ProductDetailViewModel>(
                      builder: (context, value, productDetailModel, child) {
                        return DebouncedShareButton(viewModel: value, productDetailModel: productDetailModel);
                      },
                    ),
                  ),
                  Consumer2<ProductListingViewModel, ProductDetailViewModel>(
                    builder: (context, value, listingDetailModel, child) {
                      return listingDetailModel.state == ViewState.busy
                          ? SizedBox()
                          : Padding(
                              padding: const EdgeInsets.only(right: 14.0).toLTRAware(context),
                              child: CircleAvatar(
                                // maxRadius: 18,
                                radius: 18,
                                backgroundColor: AppColorData.appSecondaryColor,
                                child: IconButton(
                                  onPressed: () {
                                    if (token != null) {
                                      if (listingDetailModel
                                              .listingDetailResponseModel
                                              ?.data
                                              ?.listing
                                              ?.first
                                              .wishlist ??
                                          false) {
                                        wishlistViewModel!.removeWishlist(listingId: widget.listingId).then((
                                          val,
                                        ) {
                                          listingDetailModel.fetchListingDetail(
                                            id: widget.listingId,
                                            loader: false,
                                          );
                                          value.updateHomePageWishlistStatus(widget.listingId, false);
                                        });
                                      } else {
                                        wishListBtmSht(
                                          listingId: widget.listingId,
                                          context: context,
                                          from: "detail",
                                          wishListModel: wishlistViewModel!,
                                          viewModel: value,
                                          categoryId: value.categoryId,
                                          listingDetailViewModel: listingDetailModel,
                                        );
                                      }
                                    } else {
                                      Get.toNamed(RouterName.loginScreen);
                                      /* Navigator.of(context).push(
                                                    MaterialPageRoute(
                                                        builder: (context) =>
                                                            LoginScreen()),
                                                  );*/
                                    }
                                  },
                                  icon:
                                      listingDetailModel
                                              .listingDetailResponseModel
                                              ?.data
                                              ?.listing
                                              ?.first
                                              .wishlist ??
                                          false
                                      ? Icon(
                                          Icons.favorite,
                                          size: 20,
                                          color: AppColorData.appPrimaryColor.withOpacity(0.8),
                                        )
                                      : Icon(
                                          Icons.favorite_border_rounded,
                                          color: AppColorData.appIconBlack,
                                          size: 20,
                                        ),
                                ),
                              ),
                            );
                    },
                  ),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  background: SizedBox(
                    width: double.maxFinite,
                    child: Consumer<ProductDetailViewModel>(
                      builder: (context, listingDetailModel, child) {
                        if (listingDetailModel.state == ViewState.busy) {
                          return const SizedBox();
                        }

                        final listing = listingDetailModel.listingDetailResponseModel?.data?.listing;

                        if (listing == null || listing.isEmpty) {
                          return const ErrorImage(isSquare: true);
                        }

                        final attachmentData = listing.first.attachmentData;

                        if (attachmentData == null || attachmentData.isEmpty) {
                          return const ErrorImage(isSquare: true);
                        }

                        final imageData = attachmentData.first.image;
                        final coverImage = imageData?.coverImage;
                        final groupImage = imageData?.groupImage ?? [];

                        var data = listingDetailModel.listingDetailResponseModel?.data?.listing?.first;
                        return listingDetailModel.state == ViewState.busy
                            ? SizedBox()
                            : Stack(
                                children: [
                                  PageView(
                                    children: [
                                      ClipRRect(
                                        borderRadius: BorderRadius.only(
                                          bottomLeft: Radius.circular(10),
                                          bottomRight: Radius.circular(10),
                                        ),
                                        child: CacheImageWidget(
                                          errorBuilder: (context, url, error) {
                                            return ErrorImage(isSquare: true);
                                          },
                                          imageUrl: "${coverImage}",
                                          //imageUrl: "${listingDetailModel.listingDetailResponseModel?.data?.listing?.first.attachmentData?.first.image?.coverImage}",
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                      ...groupImage
                                          .where((item) => item != null && item['imagePath'] != null)
                                          .map((item) {
                                            return ClipRRect(
                                              borderRadius: BorderRadius.only(
                                                bottomLeft: Radius.circular(10),
                                                bottomRight: Radius.circular(10),
                                              ),
                                              child: CacheImageWidget(
                                                errorBuilder: (context, url, error) {
                                                  return ErrorImage(isSquare: true);
                                                },
                                                imageUrl: "${item['imagePath']}",
                                                fit: BoxFit.cover,
                                              ),
                                            );
                                          })
                                          .toList(),
                                    ],
                                  ),
                                  if (data?.priceData?.first.pricing?.discountPercentage != null &&
                                      data!.priceData!.first.pricing!.discountPercentage! > 0)
                                    Positioned(
                                      left: 14,
                                      bottom: 14,
                                      child: discountPriceCardWidget(
                                        discountAmount:
                                            "${data.priceData?.first.pricing?.discountPercentage}",
                                      ),
                                    ),
                                ],
                              );
                      },
                    ),
                  ),
                ),
              ),
            ],
            body: Column(
              children: [
                Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      children: [
                        Padding(
                          padding: horizontalPadding(vertical: 20),
                          child: Consumer2<ProductListingViewModel, ProductDetailViewModel>(
                            builder: (context, value, listingDetailModel, child) {
                              var data = listingDetailModel.listingDetailResponseModel?.data?.listing?.first;
                              if (listingDetailModel.listingDetailResponseModel == null) {
                                return CircularProgressIndicator();
                              }
                              return Column(
                                children: [
                                  AmenitiesAndDetails(approvedListing: widget.approvedListing),
                                  if (data?.address?.coordinates?.first != null &&
                                      data?.address?.coordinates?.last != null &&
                                      data?.id == widget.listingId)
                                    MapView(
                                      listingDetailResponseModel:
                                          listingDetailModel.listingDetailResponseModel!,
                                      mapIcon: value.mapIcon ?? BitmapDescriptor.defaultMarker,
                                    ),
                                  CustomDivider(),
                                  if (userId != data?.providerData?.id)
                                    MeetHostView(
                                      viewModel: listingDetailModel,
                                      listingId: widget.listingId,
                                      model: listingDetailModel.listingDetailResponseModel!,
                                      isIndexPage: widget.isIndexPage,
                                      getToken: getToken,
                                      token: token,
                                    ),
                                  CustomDivider(),
                                  ReviewDetails(),
                                ],
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Consumer2<CommonViewModel, ProductDetailViewModel>(
                  builder: (context, commonModel, listingDetailModel, child) {
                    return listingDetailModel.state == ViewState.busy
                        ? SizedBox()
                        : CheckoutButton(commonModel, listingDetailModel, listingViewModel!);
                  },
                ),
              ],
            ),
          ),
          Consumer<ProductDetailViewModel>(
            builder: (context, listingDetailModel, child) {
              return listingDetailModel.state == ViewState.busy ||
                      listingDetailModel.listingDetailResponseModel == null
                  ? Container(
                      color: AppColorData.appSecondaryColor,
                      child: ProductDetailLoader(),
                      //  ProgressLoader()
                    )
                  : SizedBox();
            },
          ),
          if (_isScrolled)
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              child: ClipRect(
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Container(
                    height: MediaQuery.of(context).padding.top,
                    color: Colors.black.withOpacity(0.2),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Container CheckoutButton(
    CommonViewModel commonModel,
    ProductDetailViewModel value,
    ProductListingViewModel listingModel,
  ) {
    var data = value.listingDetailResponseModel?.data?.listing?.first;
    EstimationResponseModel? estimationResponseModel = value.listingSelectedDates[widget.listingId];
    var apiDateFormat = commonViewModel?.settingsResponseModel?.data?.hiddenSettings?.dateFormat;

    var hourlyBooking = commonViewModel?.settingsResponseModel?.data?.hiddenSettings?.hourlyBooking;
    var isFilteredDatePresent =
        estimationResponseModel == null &&
        (listingModel.startDate != null && listingModel.endDate != null) &&
        listingModel.isListingUsingFilteredDates(widget.listingId);
    var estimationData = estimationResponseModel?.data?.estimation;
    final shouldShowHourCount =
        (estimationResponseModel == null ||
        (estimationData?.hours != null && (estimationData?.hours ?? 0) > 0));
    print("estimationResponseModel :: ${estimationResponseModel?.data?.estimation?.startDate}");
    return Container(
      decoration: BoxDecoration(
        color: AppColorData.appSecondaryColor,
        border: Border.all(color: AppColorData.dividerColor),
      ),
      child: Consumer<EditProfileViewModel>(
        builder: (context, editModel, child) {
          return Padding(
            padding: horizontalPadding(vertical: 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              mainAxisSize: MainAxisSize.max,
              children: [
                if (userId != data?.providerData?.id)
                  Flexible(
                    child: Column(
                      spacing: 2,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (hourlyBooking == "Day" || hourlyBooking == "Both")
                          CommonDiscountPriceText(
                            currencySymbol:
                                "${value.listingDetailResponseModel?.data?.multipleCurrency?.toSymbol}",
                            originalPrice: "${data?.priceData?.first.pricing?.perDay}",
                            discountedPrice: int.parse(
                              "${data?.priceData?.first.pricing?.discountedPrice?.toInt()}",
                            ),
                            nightText: "night",
                            nightsCount: estimationData?.nights != null && (estimationData?.nights ?? 0) > 0
                                ? "x ${estimationData?.nights} "
                                : (estimationResponseModel == null && listingModel.totalNights > 0)
                                ? "x ${listingModel.totalNights} "
                                : null,
                          ),
                        if (hourlyBooking == "Hour" || hourlyBooking == "Both")
                          if (shouldShowHourCount)
                            RichText(
                              text: TextSpan(
                                children: [
                                  TextSpan(
                                    text:
                                        "${value.listingDetailResponseModel?.data?.multipleCurrency?.toSymbol}"
                                        "${editModel.convertPrice(data?.priceData?.first.pricing?.perHour.toString())} ",
                                    style: AppTextStyle.headerStyle,
                                  ),
                                  if (estimationData?.hours != null && (estimationData?.hours ?? 0) > 0)
                                    TextSpan(
                                      text: "x ${estimationData?.hours} ",
                                      style: AppTextStyle.bodyTextStyle,
                                    ),
                                  TextSpan(
                                    text: tr("hours").capitalizeFirst,
                                    style: AppTextStyle.subBodyStyle.copyWith(
                                      color: AppColorData.subBodyTextClr,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                        if (estimationResponseModel != null || isFilteredDatePresent)
                          InkWell(
                            onTap: () {
                              value.isExpandDatePicker = true;
                              value.isExpandTimePicker = false;
                              value.isActivelySelecting = true;
                              value.notify();
                              value.prepareRangePickerForListing(
                                isFilteredDatePresent
                                    ? widget.listingId
                                    : estimationResponseModel!.data!.estimation!.listingId!,
                              );
                              showCustomModalBottomSheet(
                                title: "dates",
                                backgroundColor: AppColorData.appSecondaryColor,
                                context: context,
                                builder: (context) {
                                  return Padding(
                                    padding: horizontalPadding(vertical: 20),
                                    child: CommonDatePickerCard(
                                      startDate: isFilteredDatePresent
                                          ? listingModel.startDate
                                          : estimationData?.startDate,
                                      endDate: isFilteredDatePresent
                                          ? listingModel.endDate
                                          : estimationData?.endDate,
                                      maximumNight:
                                          value
                                              .listingDetailResponseModel
                                              ?.data
                                              ?.listing
                                              ?.first
                                              .priceData
                                              ?.first
                                              .bookingType
                                              ?.maximumNight ??
                                          0,
                                      minimumNight:
                                          value
                                              .listingDetailResponseModel
                                              ?.data
                                              ?.listing
                                              ?.first
                                              .priceData
                                              ?.first
                                              .bookingType
                                              ?.minimumNight ??
                                          0,
                                      isDayMode: isFilteredDatePresent
                                          ? true
                                          : estimationResponseModel?.data?.estimation?.bookingType == "Day",
                                      listingId: widget.listingId,
                                    ),
                                  );
                                },
                              );
                            },
                            child: Text(
                              overflow: TextOverflow.ellipsis,
                              estimationResponseModel?.data!.estimation!.bookingType == "Day"
                                  ? DateFormatterUtil.formatDateRange(
                                      (estimationData?.startDate ?? listingModel.startDate)?.toString() ?? '',
                                      (estimationData?.endDate ?? listingModel.endDate)?.toString() ?? '',
                                      apiDateFormat,
                                    )
                                  : DateFormatterUtil.formatDateRangeWithTime(
                                      (estimationData?.startDate ?? listingModel.startDate)?.toString() ?? '',
                                      (estimationData?.endDate ?? listingModel.endDate)?.toString() ?? '',
                                      apiDateFormat,
                                    ),
                              style: TextStyle(decoration: TextDecoration.underline),
                            ),
                          ),
                      ],
                    ),
                  ),
                (estimationResponseModel != null || (isFilteredDatePresent))
                    ? CommonElevatedButton(
                        isLoad: value.state == ViewState.tertiaryLoader,
                        width: (userId == data?.providerData?.id)
                            ? MediaQuery.of(context).size.width * 0.88
                            : MediaQuery.of(context).size.width * 0.4,
                        elevatedButtonColor: (userId == data?.providerData?.id)
                            ? AppColorData.disableButtonClr
                            : AppColorData.appPrimaryColor,
                        elevatedButtonName: token != null
                            ? (userId == data?.providerData?.id)
                                  ? "cantReserveYourOwnListings"
                                  : "reserve"
                            : "request",
                        onTap: () {
                          if (userId == data?.providerData?.id) {
                            return;
                          }
                          GuestCount guestCounts = value.buildGuestCountParams(
                            listingId: estimationResponseModel == null
                                ? widget.listingId
                                : estimationResponseModel.data!.estimation!.listingId!,
                            listingModel: listingModel,
                            useListingModel: estimationResponseModel == null,
                          );
                          value.fetchEstimation(
                            from: "detail",
                            id: isFilteredDatePresent
                                ? widget.listingId
                                : estimationResponseModel!.data!.estimation!.listingId!,
                            bookingType: isFilteredDatePresent
                                ? "Day"
                                : estimationResponseModel!.data!.estimation!.bookingType!,
                            startDate: isFilteredDatePresent
                                ? listingModel.startDate!
                                : estimationResponseModel!.data!.estimation!.startDate!,
                            endDate: isFilteredDatePresent
                                ? listingModel.endDate!
                                : estimationResponseModel!.data!.estimation!.endDate!,
                            adults: guestCounts.adult,
                            childrens: guestCounts.children,
                            pet: guestCounts.pets,
                            onSuccessRes: () {
                              Get.toNamed(
                                RouterName.reservationScreen,
                                arguments: {
                                  // RouterArguments.detailModel:value
                                  //     .listingDetailResponseModel!,
                                  RouterArguments.bookingType: isFilteredDatePresent
                                      ? "Day"
                                      : estimationResponseModel!.data!.estimation!.bookingType!,
                                  // RouterArguments.estimationModel:
                                  // estimationResponseModel,
                                },
                                parameters: {
                                  RouterArguments.detailModel: jsonEncode(
                                    value.listingDetailResponseModel!.toJson(),
                                  ),
                                  RouterArguments.estimationModel: jsonEncode(
                                    estimationResponseModel?.toJson() ?? {},
                                  ),
                                },
                              );
                            },
                          );
                        },
                      )
                    : CommonElevatedButton(
                        width: (userId == data?.providerData?.id)
                            ? MediaQuery.of(context).size.width * 0.88
                            : MediaQuery.of(context).size.width * 0.45,
                        isLoad: (userId == data?.providerData?.id),
                        elevatedButtonColor: (userId == data?.providerData?.id)
                            ? AppColorData.disableButtonClr
                            : AppColorData.appPrimaryColor,
                        elevatedButtonName: token != null
                            ? (userId == data?.providerData?.id)
                                  ? "cantReserveYourOwnListings"
                                  : "checkAvailability"
                            : "request",
                        onTap: () {
                          if (userId == data?.providerData?.id) {
                            return;
                          }

                          Get.toNamed(
                            RouterName.checkAvailabilityScreen,
                            arguments: {
                              RouterArguments.listingId: widget.listingId,
                              RouterArguments.priceText:
                                  "${value.listingDetailResponseModel!.data?.multipleCurrency?.toSymbol}${data?.priceData?.first.pricing?.perDay}",
                              RouterArguments.model: value.listingDetailResponseModel!,
                            },
                          );
                        },
                      ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class CommonDiscountPriceText extends StatelessWidget {
  final bool isReservationScreen;
  final String? originalPrice;
  final String? discountPercentage;
  final num? discountedPrice;
  final String? currencySymbol;
  final String nightText;
  final String? nightsCount;

  const CommonDiscountPriceText({
    Key? key,
    this.isReservationScreen = false,
    required this.originalPrice,
    this.discountPercentage,
    required this.discountedPrice,
    this.currencySymbol,
    this.nightText = "",
    this.nightsCount,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final bool isDiscountAvailable = (discountedPrice ?? 0) > 0;

    return Consumer<EditProfileViewModel>(
      builder: (context, editModel, child) {
        return RichText(
          text: TextSpan(
            children: [
              TextSpan(
                text:
                    "$currencySymbol${isDiscountAvailable ? editModel.convertPrice(discountedPrice.toString()) : editModel.convertPrice(originalPrice)}",
                style: AppTextStyle.headerStyle,
              ),
              if (isDiscountAvailable && originalPrice != null)
                TextSpan(
                  text: "${editModel.convertPrice(originalPrice)} ",
                  style: AppTextStyle.subBodyStyle.copyWith(
                    decoration: TextDecoration.lineThrough,
                    color: AppColorData.subBodyTextClr,
                  ),
                ),
              const WidgetSpan(child: SizedBox(width: 4)),
              if (isReservationScreen == true)
                TextSpan(
                  text: "${formatPrice(discountPercentage)}% ${tr("off")}",
                  style: AppTextStyle.subBodyStyle.copyWith(color: AppColorData.appPrimaryColor),
                ),
              if (nightsCount != null) TextSpan(text: "$nightsCount", style: AppTextStyle.bodyTextStyle),
              if (nightText.isNotEmpty)
                TextSpan(
                  text: tr(nightText).capitalizeFirst,
                  style: AppTextStyle.subBodyStyle.copyWith(color: AppColorData.subBodyTextClr),
                ),
            ],
          ),
        );
      },
    );
  }
}
