import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/guest_count_model/guest_count_models.dart';
import 'package:airstar_flutter/ui/user/checkAvailability/check_availability_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/user/common_viewmodel.dart';
import 'package:airstar_flutter/viewModel/user/listing_view_model.dart';
import 'package:airstar_flutter/viewModel/user/product_detail_view_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:syncfusion_flutter_datepicker/datepicker.dart';

import '../../../../commonWidgets/widget/custom_toggle.dart';
import '../../../../viewModel/base_view_model/base_view_model.dart';

class CommonDatePickerCard extends StatefulWidget {
  final DateTime? startDate;
  final DateTime? endDate;
  final bool isBottomSheet;
  final bool? isDayMode;
  final bool isReservationPage;
  final int maximumNight;
  final int minimumNight;
  final String listingId;

  CommonDatePickerCard({
    super.key,
    this.isBottomSheet = true,
    this.isReservationPage = false,
    this.startDate,
    this.endDate,
    this.isDayMode,
    required this.maximumNight,
    required this.minimumNight,
    required this.listingId,
  });

  @override
  State<CommonDatePickerCard> createState() => _CommonDatePickerCardState();
}

class _CommonDatePickerCardState extends State<CommonDatePickerCard> {
  ProductDetailViewModel? productDetailViewModel;
  ProductListingViewModel? listingViewModel;
  bool isDatePickerOpened = false;
  bool isDayMode = true;
  DateTime? startDate;
  DateTime? endDate;

  @override
  void initState() {
    productDetailViewModel = Provider.of<ProductDetailViewModel>(context, listen: false);
    listingViewModel = Provider.of<ProductListingViewModel>(context, listen: false);
    isDayMode = widget.isDayMode ?? true;
    startDate = widget.isBottomSheet ? widget.startDate : startDate;
    endDate = widget.isBottomSheet ? widget.endDate : endDate;
    if (widget.isDayMode == "Day" || (widget.isDayMode == true)) {
      productDetailViewModel?.isActivelySelecting = true;
    } else {
      productDetailViewModel?.isActivelySelecting = false;
    }
    super.initState();
  }

  fetchEstimation({
    required String type,
    DateTime? startDate,
    DateTime? endDate,
    TimeOfDay? startTime,
    TimeOfDay? endTime,
    required Function() onSuccessRes,
  }) async {
    GuestCount? guestCounts = productDetailViewModel?.buildGuestCountParams(
      listingId: widget.listingId,
      listingModel: listingViewModel,
      useListingModel: listingViewModel?.getGuestCountText() != null,
    );

    if (startDate != null && endDate != null) {
      if (type == Strings.hour) {
        if (startTime != null && endTime != null) {
          DateTime startdate = DateTime(
            startDate.year,
            startDate.month,
            startDate.day,
            startTime.hour,
            startTime.minute,
          );
          DateTime enddate = DateTime(endDate.year, endDate.month, endDate.day, endTime.hour, endTime.minute);

          await productDetailViewModel!.fetchEstimation(
            id: widget.listingId,
            bookingType: type,
            startDate: startdate,
            endDate: enddate,
            adults: guestCounts?.adult,
            childrens: guestCounts?.children,
            pet: guestCounts?.pets,
            onSuccessRes: onSuccessRes,
          );
        } else {}
      } else {
        await productDetailViewModel!.fetchEstimation(
          id: widget.listingId,
          bookingType: type,
          startDate: startDate,
          endDate: endDate,
          adults: guestCounts?.adult,
          childrens: guestCounts?.children,
          pet: guestCounts?.pets,
          onSuccessRes: onSuccessRes,
        );
      }
    }
  }

  void _onSelectionChanged(DateRangePickerSelectionChangedArgs args) {
    PickerDateRange range = args.value;
    productDetailViewModel?.calculateRange(range.startDate!, widget.maximumNight);
  }

  bool isSaveEnabled() {
    if (startDate != null && endDate != null) {
      return true;
    }
    return true;
  }

  String getBookingType() {
    return isDayMode ? "Day" : "Hour";
  }

  confirmDateRange(PickerDateRange args) {
    PickerDateRange range = args;

    if (range.startDate != null && range.endDate != null) {
      DateTimeRange picked = DateTimeRange(start: range.startDate!, end: range.endDate!);
      _saveDateRange(context, picked);
    } else if (isDayMode == false && range.startDate != null) {
      DateTimeRange picked = DateTimeRange(start: range.startDate!, end: range.startDate!);
      _saveDateRange(context, picked);
    }
  }

  Future<void> _saveDateRange(BuildContext context, DateTimeRange picked) async {
    var totalNights = picked.end.difference(picked.start).inDays;

    print("totalNights :: $totalNights");
    if (totalNights >= widget.minimumNight) {
      if (totalNights <= widget.maximumNight) {
        startDate = picked.start;
        endDate = picked.end;
      }
    } else {
      startDate = picked.start;
      endDate = picked.end;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<ProductDetailViewModel, CommonViewModel>(
      builder: (context, value, commonModel, child) {
        var hourlyBook = commonModel.settingsResponseModel?.data?.hiddenSettings?.hourlyBooking;
        return SingleChildScrollView(
          child: Column(
            spacing: 20,
            children: [
              buildToggleButton(commonModel, value),
              const SizedBox(),
              (isDayMode || isDatePickerOpened == true)
                  ? CommonCardWidget(child: datePickerCard(value, commonModel))
                  : GestureDetector(
                      onTap: () {
                        value.toggleDatePicker();
                        value.notify();
                      },
                      child: CommonCardWidget(
                        isShadowSpread: value.isExpandDatePicker,
                        child: value.isExpandDatePicker
                            ? datePickerCard(value, commonModel)
                            : Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: CommonText(
                                      overflow: TextOverflow.ellipsis,
                                      text: "selectedDate",
                                      style: AppTextStyle.headerStyle,
                                    ),
                                  ),
                                  startDate != null
                                      ? CommonText(text: "${formatDateMonthRange(startDate!, endDate!)}")
                                      : CommonText(text: "undefined"),
                                ],
                              ),
                      ),
                    ),
              if (!isDayMode || hourlyBook == "Hour") timePicker(value),
            ],
          ),
        );
      },
    );
  }

  Widget buildToggleButton(CommonViewModel commonModel, ProductDetailViewModel value) {
    var hourlyBook = commonModel.settingsResponseModel?.data?.hiddenSettings?.hourlyBooking;
    return Column(
      children: [
        if (hourlyBook == "Both")
          CustomToggle(
            initialValue: isDayMode,
            toggle1: "day",
            toggle2: "hour",
            onToggle: (val) {
              isDayMode = val;
              if (!widget.isBottomSheet) {
                value.resetEstimationResponseModel(widget.listingId);
              }
              value.toggleDatePicker();
              value..notify();
            },
          ),
        if (hourlyBook == "Day" || hourlyBook == "Hour")
          Center(
            child: Container(
              width: 260,
              padding: EdgeInsets.symmetric(vertical: 10.0),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(30),
                color: Colors.grey[300], // Grey background
              ),
              child: CommonText(
                textAlign: TextAlign.center,
                text: hourlyBook == "Day" ? Strings.Day : Strings.hour,
                style: AppTextStyle.titleStyle.copyWith(fontWeight: FontWeight.bold),
              ),
            ),
          ),
      ],
    );
  }

  Widget datePickerCard(ProductDetailViewModel value, CommonViewModel commonModel) {
    isDatePickerOpened = true;
    return Column(
      children: [
        CommonSyncfusionRangePicker(
          minDate: value.selectedStartDate,
          maxDate: value.limitedEndDate,
          initialSelectedRange: PickerDateRange(startDate, endDate),
          controller: value.dateRangeController,
          blackoutDates: value.getBlockedDates(),
          onSelectionChanged: _onSelectionChanged,
        ),
        _actionButton(),
      ],
    );
  }

  Widget _actionButton() {
    return Consumer<ProductDetailViewModel>(
      builder: (context, value, child) {
        return Align(
          alignment: Alignment.bottomCenter,
          child: Container(
            padding: EdgeInsets.all(10),
            decoration: BoxDecoration(
              border: Border(top: BorderSide(color: AppColorData.dividerColor)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                (!widget.isReservationPage)
                    ? CommonElevatedButton(
                        isTextBtn: true,
                        elevatedButtonName: "clear",
                        onTap: () {
                          if (value.dateRangeController.selectedRange?.startDate != null) {
                            print("Date range :: ${value.dateRangeController.selectedRange}");

                            value.clearDates();
                            value.clearSelectedDate(listingId: widget.listingId);
                            listingViewModel?.excludeListingFromFilteredDates(widget.listingId);

                            if (widget.isBottomSheet) {
                              Navigator.pop(context);
                            }

                            value.notify();
                          }
                        },
                        style: AppTextStyle.bodyTextStyle.copyWith(
                          decorationColor: (value.dateRangeController.selectedRange?.startDate == null)
                              ? AppColorData.disableButtonClr
                              : null,
                        ),
                        elevatedButtonNameColor: (value.dateRangeController.selectedRange?.startDate == null)
                            ? AppColorData.disableButtonClr
                            : null,
                      )
                    : SizedBox(),
                (isDayMode)
                    ? CommonElevatedButton(
                        isLoad: value.state == ViewState.secondaryLoader ? true : false,
                        width: MediaQuery.of(context).size.width * 0.3,
                        elevatedButtonName: "save",
                        onTap: () async {
                          print(
                            "isSaveEnabled() :: ${isSaveEnabled()} :: value.dateRangeController.selectedRange :: ${value.dateRangeController.selectedRange}",
                          );
                          if (isSaveEnabled() && value.dateRangeController.selectedRange != null) {
                            confirmDateRange(value.dateRangeController.selectedRange!);

                            await fetchEstimation(
                              type: getBookingType(),
                              startDate: startDate,
                              endDate: endDate,
                              startTime: value.checkIntime,
                              endTime: value.checkOuttime,
                              onSuccessRes: () {
                                value.isEstimationVisible = true;

                                if (widget.isBottomSheet) {
                                  Navigator.pop(context);
                                }
                              },
                            );
                          }
                        },
                        elevatedButtonNameColor: AppColorData.appSecondaryColor,
                        elevatedButtonColor: isSaveEnabled()
                            ? AppColorData.blackButtonClr
                            : AppColorData.disableButtonClr,
                      )
                    : CommonElevatedButton(
                        width: MediaQuery.of(context).size.width * 0.3,
                        elevatedButtonName: "next",
                        onTap: () {
                          print(
                            "isSaveEnabled() :: ${isSaveEnabled()} :: value.dateRangeController.selectedRange :: ${value.dateRangeController.selectedRange}",
                          );
                          if (isSaveEnabled() && value.dateRangeController.selectedRange != null) {
                            confirmDateRange(value.dateRangeController.selectedRange!);
                            isDatePickerOpened = false;

                            if (widget.isBottomSheet) {
                              value.toggleTimePicker(resetTime: false);
                            } else {
                              value.toggleTimePicker();
                            }
                          }
                        },
                        elevatedButtonNameColor: AppColorData.appSecondaryColor,
                        elevatedButtonColor: AppColorData.blackButtonClr,
                      ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget timePicker(ProductDetailViewModel value) {
    return GestureDetector(
      onTap: () {
        print("Date range :: ${value.dateRangeController.selectedRange}");
        if (startDate != null && endDate != null && widget.isBottomSheet) {
          value.toggleTimePicker(resetTime: false);
          isDatePickerOpened = false;
        }
      },
      child: CommonCardWidget(
        isShadowSpread: value.isExpandTimePicker,
        child: (startDate != null && endDate != null && value.isExpandTimePicker)
            ? ContainerTimePicker(
                startDate: widget.isBottomSheet ? widget.startDate : startDate,
                endDate: widget.isBottomSheet ? widget.endDate : endDate,
                productDetailViewModel: productDetailViewModel!,
                onSave: () {
                  fetchEstimation(
                    type: getBookingType(),
                    startDate: startDate,
                    endDate: endDate,
                    startTime: convertTimeOfDayRoundUpTo30(value.checkIntime),
                    endTime: convertTimeOfDayRoundUpTo30(value.checkOuttime),
                    onSuccessRes: () {
                      value.isEstimationVisible = true;
                      if (widget.isBottomSheet) {
                        Navigator.pop(context);
                      }
                    },
                  );
                },
                resetOnTap: () {
                  value.isEstimationVisible = false;
                  if (!widget.isReservationPage) {
                    value.toggleDatePicker();
                    value.clearDates();
                    value.clearSelectedDate(listingId: widget.listingId);
                    listingViewModel?.excludeListingFromFilteredDates(widget.listingId);
                    value.notify();
                  }
                  if (widget.isBottomSheet) {
                    Navigator.pop(context);
                  }
                },
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: CommonText(
                      overflow: TextOverflow.ellipsis,
                      text: "selectedTime",
                      style: AppTextStyle.headerStyle,
                    ),
                  ),
                  CommonText(
                    text: (widget.isDayMode == false && widget.isBottomSheet)
                        ? "${convertDatetoTime(widget.startDate ?? DateTime.now())} - ${convertDatetoTime(widget.endDate ?? DateTime.now())}"
                        : "${value.checkIntime.format(context)} - ${value.checkOuttime.format(context)}",
                  ),
                ],
              ),
      ),
    );
  }
}
