import 'dart:convert';
import 'dart:developer';
import 'dart:ui';
import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/user/estimation_response_model.dart';
import 'package:airstar_flutter/data/models/user/listing_detail_response_model.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:get/route_manager.dart';
import 'package:provider/provider.dart';
import 'package:airstar_flutter/viewModel/view_model.dart';
import '../../../routes/routes.dart';
import '../Product/product_detail/common_date_picker_card.dart';

class CheckAvailabilityScreen extends StatefulWidget {
  final String priceText;
  final String listingId;
  final ListingDetailResponseModel model;

  const CheckAvailabilityScreen(
      {Key? key,
        required this.priceText,
        required this.model,
        required this.listingId})
      : super(key: key);

  @override
  State<CheckAvailabilityScreen> createState() =>
      _CheckAvailabilityScreenState();
}

class _CheckAvailabilityScreenState extends State<CheckAvailabilityScreen> {
  String result = '';
  DateTime? startDate;
  DateTime? endDate;
  ProductListingViewModel? listingViewModel;
  ProductDetailViewModel? productDetailViewModel;
  CommonViewModel? commonViewModel;
  ScrollController scrollController = ScrollController();

  bool isDatePickerOpened = false;

  bool isDayMode = true;
  String? bookingType = "Both";

  @override
  void initState() {
    listingViewModel =
        Provider.of<ProductListingViewModel>(context, listen: false);
    commonViewModel = Provider.of<CommonViewModel>(context, listen: false);
    productDetailViewModel =
        Provider.of<ProductDetailViewModel>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      resetOnTap();
      productDetailViewModel!.resetEstimationResponseModel(widget.listingId);
      productDetailViewModel?.isActivelySelecting = true;
    });

    absSettings();
    super.initState();
  }

  absSettings() async {
    var storage = AppSecureStorage.getInstance();
    var key = await storage.readSecureData(PrefConstant.booking_type);
    bookingType = key;
    if (bookingType == "Hour") {
      isDayMode = false;
    }
    print("key :: $key");
  }

  void resetOnTap() {
    TimeOfDay now = TimeOfDay.now();
    int hour = now.hour;
    int minute = now.minute;

    // Logic to round minutes
    if (minute > 0 && minute <= 29) {
      minute = 30;
    } else if (minute > 29) {
      hour = (hour + 1) % 24;
      minute = 0;
    }

    // Update the check-in and check-out times
    productDetailViewModel?.checkIntime = TimeOfDay(hour: hour, minute: minute);
    productDetailViewModel?.checkOuttime =
        TimeOfDay(hour: hour, minute: minute);
    productDetailViewModel?.isEstimationVisible = false;
    productDetailViewModel?.clearDates();
    productDetailViewModel?.notify();
  }

  void dispose() {
    scrollController.dispose();
    // Clear the selected date range when the page is disposed
    productDetailViewModel?.clearDates();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // var listingData = widget.model.data!.listing!.first;

    return Stack(
      children: [
        Scaffold(
          appBar: CommonAppBar(
            leading: IconButton(
              onPressed: () {
                Navigator.pop(context);
              },
              icon: Icon(Icons.close),
            ),
          ),
          backgroundColor: AppColorData.appSecondaryColor,
          body: Padding(
              padding: horizontalPadding(),
              child: Consumer2<ProductListingViewModel, ProductDetailViewModel>(
                builder: (context, productValue, value, child) {
                  return SingleChildScrollView(
                    controller: scrollController,
                    child: Container(
                      width: MediaQuery.of(context).size.width,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          CommonDatePickerCard(
                            isBottomSheet: false,
                            listingId: widget.listingId,
                            maximumNight: widget.model.data?.listing?.first.priceData?.first
                                .bookingType?.maximumNight ?? 0,
                            minimumNight: widget.model.data?.listing?.first.priceData?.first
                                .bookingType?.minimumNight ?? 0 ,
                          ),
                          SizedBox(
                            height: 30,
                          ),
                          value.state == ViewState.success
                              ? EstimationContainer(
                              value.estimationResponseModel, value)
                              : value.state == ViewState.busy
                              ? Loader()
                              : SizedBox(),
                        ],
                      ),
                    ),
                  );
                },
              )),
        ),
        Consumer<ProductDetailViewModel>(builder: (context, viewModel, child) {
          return Visibility(
            visible: viewModel.isPageLoader,
            child: Dialog(
              insetPadding: EdgeInsets.zero,
              backgroundColor: AppColorData.transparent,
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 1.5, sigmaY: 1.5),
                child: Container(
                  child: Loader(
                    color: AppColorData.blackClr,
                  ),
                ),
              ),
            ),
          );
        })
      ],
    );
  }

  Widget EstimationContainer(
      EstimationResponseModel? model, ProductDetailViewModel viewModel) {
    if (model?.data == null) {
      return SizedBox();
    } else {
      var data = model?.data!.estimation;
      var isDiscountAvailable = (data?.discountedPrice ?? 0) > 0;
      String currency = model!.data!.multipleCurrency!.toSymbol!;
      return Visibility(
        visible: viewModel.isEstimationVisible,
        child: Consumer<EditProfileViewModel>(
            builder: (context, editModel, child) {
              return Column(
                children: [
                  CommonElevatedButton(
                      elevatedButtonName: "reserve",
                      elevatedButtonColor: AppColorData.appPrimaryColor,
                      onTap: () {
                        Get.toNamed(RouterName.reservationScreen, arguments: {
                          RouterArguments.bookingType: model.data?.estimation?.bookingType ?? "Day",
                        }, parameters: {
                          RouterArguments.detailModel:
                          jsonEncode(widget.model.toJson()),
                          RouterArguments.estimationModel: jsonEncode(model.toJson()),
                        });
                        Future.delayed(Duration.zero, () {
                          log("RouterArguments.detailModel :: ${Get.parameters[RouterArguments.detailModel]} \n data ::${widget.model}");
                          log("RouterArguments.estimationModel :: ${Get.parameters[RouterArguments.estimationModel]} \n data ::${model}");
                        });
                      }),
                  SizedBox(
                    height: 40,
                  ),
                  if (data?.nights != null && data?.nights != 0)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        CommonText(
                            text: "$currency${isDiscountAvailable ? editModel.convertPrice(data?.discountedPrice.toString()): editModel.convertPrice(data!.perDay.toString())} x ${data?.nights} ${tr("night")}",
                            style: AppTextStyle.headerStyle),
                        CommonText(
                            text: "$currency${editModel.convertPrice(data?.dayFare.toString())}",
                            style: AppTextStyle.headerStyle),
                      ],
                    ),
                  if (data?.hours != 0)
                    Column(
                      children: [
                        doubleSpacer(),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            CommonText(
                                text: "$currency${editModel.convertPrice(data?.perHour.toString())} x ${data?.hours} ${tr("hour")}",
                                style: AppTextStyle.headerStyle),
                            CommonText(
                                text: "$currency${editModel.convertPrice(data?.hourFare.toString())}",
                                style: AppTextStyle.headerStyle),
                          ],
                        ),
                      ],
                    ),
                  doubleSpacer(),
                  Visibility(
                    visible: data?.taxPercentage == 0 ? false : true,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        CommonText(
                            text: "${tr("tax")} (${data?.taxPercentage}%)",
                            style: AppTextStyle.headerStyle),
                        CommonText(
                            text: '${currency}${editModel.convertPrice(data?.taxAmount.toString())}',
                            style: AppTextStyle.headerStyle),
                      ],
                    ),
                  ),
                  if (data?.taxPercentage != 0) spacer(),
                  CustomDivider(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      CommonText(text: "total", style: AppTextStyle.titleStyle),
                      CommonText(
                          text: "${currency}${editModel.convertPrice(data?.fareAmount.toString())}",
                          style: AppTextStyle.headerStyle),
                    ],
                  ),
                  SizedBox(
                    height: 20,
                  )
                ],
              );
            }
        ),
      );
    }
  }
}

guestAddonName(title) {
  switch (title) {
    case GuestMode.Adult:
      return tr("adults");
    case GuestMode.Children:
      return tr("children");
    case GuestMode.Pets:
      return tr("pets");
  }
}

int guestAddonValue(GuestMode title, ProductDetailViewModel model, String listingId) {
  switch (title) {
    case GuestMode.Adult:
      return model.getGuestCount(listingId, GuestMode.Adult);
    case GuestMode.Children:
      return model.getGuestCount(listingId, GuestMode.Children);
    case GuestMode.Pets:
      return model.getGuestCount(listingId, GuestMode.Pets);
  }
  return 0;
}

Widget GuestAddon(
    {required GuestMode title,
      required int limit,
      required ProductDetailViewModel model,
      required String listingId,
      required VoidCallback onUpdate}) {
  var val = guestAddonValue(title, model, listingId);
  Logger.appLogs("val for listing $listingId>>>>>>>> ${val}");

  return Consumer<ProductDetailViewModel>(
    builder: (context, viewModel, child) {
      bool isGreater = guestAddonValue(title, model, listingId) > 0 && val > 0;
      bool isLesser = guestAddonValue(title, model, listingId) < limit;

      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 10),
              child: CommonText(text: guestAddonName(title)),
            ),
            Row(
              children: [
                IconButton(
                    onPressed: () {
                      if (isGreater) {
                        val--;
                        viewModel.updateGuest(
                          listingId: listingId,
                          value: val,
                          title: title,
                        );
                        onUpdate();
                      } else {
                        Logger.appLogs("${title} - ${limit}  value = ${val}");
                      }
                    },
                    icon: Container(
                      padding: EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        border: Border.all(color:isGreater? Colors.grey :Colors.grey.shade300),
                        borderRadius: BorderRadius.circular(40)
                      ),
                      child: Icon(
                        Icons.remove,
                        color: isGreater ? Colors.black : Colors.grey.shade300,
                        size: 20,
                      ),
                    )),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 10),
                  child: CommonText(text: "${guestAddonValue(title, model, listingId)}"),
                ),
                IconButton(
                    onPressed: () {
                      if (isLesser) {
                        val++;
                        viewModel.updateGuest(
                          listingId: listingId,
                          value: val,
                          title: title,
                        );
                        onUpdate();
                      } else {
                        Logger.appLogs("${title} - ${limit}");
                      }
                    },
                    icon: Container(
                      padding: EdgeInsets.all(4),
                      decoration: BoxDecoration(
                          border: Border.all(color: isLesser? Colors.grey  : Colors.grey.shade300),
                          borderRadius: BorderRadius.circular(40)
                      ),
                      child: Icon(
                        Icons.add,
                        color: isLesser ? Colors.black : Colors.grey.shade300,
                        size: 20,
                      ),
                    )),
              ],
            )
          ],
        ),
      );
    },
  );
}

class ContainerTimePicker extends StatefulWidget {
  final ProductDetailViewModel productDetailViewModel;
  final VoidCallback onSave;
  final VoidCallback resetOnTap;
  final DateTime? startDate;
  final DateTime? endDate;

  const ContainerTimePicker(
      {super.key,
        required this.productDetailViewModel,
        required this.onSave,
        required this.resetOnTap,
        this.startDate,
        this.endDate});

  @override
  _ContainerTimePickerState createState() => _ContainerTimePickerState();
}

class _ContainerTimePickerState extends State<ContainerTimePicker> {

  @override
  void initState() {
    super.initState();

    if (widget.startDate == widget.endDate)
      widget.productDetailViewModel.checkOuttime = TimeOfDay(
          hour: roundUpTo30Minutes(DateTime(
              0,
              1,
              1,
              widget.productDetailViewModel.checkOuttime.hour,
              widget.productDetailViewModel.checkOuttime.minute)
              .add(Duration(hours: 1)))
              .hour,
          minute: roundUpTo30Minutes(DateTime(
              0,
              1,
              1,
              widget.productDetailViewModel.checkOuttime.hour,
              widget.productDetailViewModel.checkOuttime.minute))
              .minute);
    print("object :: ${widget.productDetailViewModel.checkOuttime}");
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: 20,
        ),
        Align(
          alignment: Alignment.topLeft,
          child: CommonText(
            text: "checkInTime",
            style: AppTextStyle.headerStyle,
          ),
        ),
        SizedBox(
          height: 20,
        ),
        Container(
          // color:Colors.red,
            height: 40,
            child: TimeCardListWidget(
              isCheckInPicker: true,
              startDate: widget.startDate,
              endDate: widget.endDate,
              isBlocked: true,
              defaultSelectedTime: roundUpTo30Minutes(DateTime(
                  0,
                  1,
                  1,
                  widget.productDetailViewModel.checkIntime.hour,
                  widget.productDetailViewModel.checkIntime.minute)),
              onSelect: (val) {
                print("Selected date start :: $val");

                widget.productDetailViewModel.checkIntime =
                    TimeOfDay(hour: val!.hour, minute: val.minute);
                widget.productDetailViewModel.notify();
              },
            )),
        SizedBox(
          height: 20,
        ),
        Align(
          alignment: Alignment.topLeft,
          child: CommonText(
            text: "checkOutTime",
            style: AppTextStyle.headerStyle,
          ),
        ),
        SizedBox(
          height: 20,
        ),
        Container(
          height: 40,
          child: TimeCardListWidget(
            isCheckInPicker: false,
            startDate: widget.startDate,
            endDate: widget.endDate,
            isBlocked: widget.startDate == widget.endDate,
            defaultSelectedTime: roundUpTo30Minutes(DateTime(
                0,
                1,
                1,
                widget.productDetailViewModel.checkOuttime.hour,
                widget.productDetailViewModel.checkOuttime.minute)),
            minimumTime: widget.startDate == widget.endDate
                ? roundUpTo30Minutes(
              DateTime(
                  0,
                  1,
                  1,
                  widget.productDetailViewModel.checkIntime.hour,
                  widget.productDetailViewModel.checkIntime.minute)
                  .add(Duration(minutes: 30)),
            )
                : null,
            onSelect: (val) {
              print("Selected date end :: $val");

              widget.productDetailViewModel.checkOuttime =
                  TimeOfDay(hour: val!.hour, minute: val.minute);
              widget.productDetailViewModel.notify();
            },
          ),
        ),
        SizedBox(
          height: 20,
        ),
        Container(
          padding: EdgeInsets.symmetric(vertical: 20),
          decoration: BoxDecoration(
            border: Border(top: BorderSide(color: AppColorData.dividerColor)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              CommonElevatedButton(
                isTextBtn: true,
                onTap: () {
                  widget.resetOnTap();
                },
                elevatedButtonName: "reset",
                style: AppTextStyle.bodyTextStyle,
              ),
              CommonElevatedButton(
                isLoad: widget.productDetailViewModel.state ==
                    ViewState.secondaryLoader
                    ? true
                    : false,
                width: MediaQuery.of(context).size.width * 0.3,
                onTap: () {
                  widget.productDetailViewModel
                      .toggleTimePicker(resetTime: false);

                  widget.onSave();
                },
                elevatedButtonName: "save",
                elevatedButtonNameColor: AppColorData.appSecondaryColor,
                elevatedButtonColor: AppColorData.blackButtonClr,
              )
            ],
          ),
        ),
      ],
    );
  }
}

