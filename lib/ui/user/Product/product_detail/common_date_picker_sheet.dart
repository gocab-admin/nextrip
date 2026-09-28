import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/viewModel/user/product_detail_view_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:syncfusion_flutter_datepicker/datepicker.dart';

import '../../../../commonWidgets/button_widgets/common_elevated_button.dart';
import '../../../../viewModel/base_view_model/base_view_model.dart';
import '../../../../viewModel/user/listing_view_model.dart';
import '../../checkAvailability/check_availability_screen.dart';
import 'package:airstar_flutter/commonWidgets/widget/widget.dart';
import 'package:airstar_flutter/utils/utils.dart';

Widget commonDatePickerSheet(
    {required DateTime? startDate,
    required DateTime? endDate,
    required bool isDayMode,
    required ProductDetailViewModel productDetailViewModel,
    required int maximumNight,
    required String listingId,
    required String bookingType,
    required BuildContext context}) {
  fetchEstimation(
      {required String type,
      DateTime? startDate,
      DateTime? endDate,
      TimeOfDay? startTime,
      TimeOfDay? endTime,
      required Function() onSuccessRes}) {
    if (startDate != null && endDate != null) {
      Logger.appLogs("estimating>>>>>>");
      Logger.appLogs("startDate>>>>>> $startDate");
      Logger.appLogs("endDate>>>>>> $endDate");
      Logger.appLogs("StartTime>>>>> $startTime");
      Logger.appLogs("EndTime>>>>>  $endTime");
      if (type == Strings.hour) {
        if (startTime != null && endTime != null) {
          DateTime startdate = DateTime(
            startDate.year,
            startDate.month,
            startDate.day,
            startTime.hour,
            startTime.minute,
          );

          DateTime enddate = DateTime(
            endDate.year,
            endDate.month,
            endDate.day,
            endTime.hour,
            endTime.minute,
          );

          productDetailViewModel.fetchEstimation(
              id: listingId,
              bookingType: type,
              startDate: startdate,
              endDate: enddate,
              onSuccessRes: onSuccessRes);
        } else {
          print("time is null");
        }
      } else {
        productDetailViewModel.fetchEstimation(
            id: listingId,
            bookingType: type,
            startDate: startDate,
            endDate: endDate,
            onSuccessRes: onSuccessRes);
      }
    }
  }

  bool isSaveEnabled() {
    if (startDate != null && endDate != null) {
      return true;
    }
    return true;
  }

  void _onSelectionChanged(DateRangePickerSelectionChangedArgs args) {
    PickerDateRange range = args.value;
    productDetailViewModel.calculateRange(range.startDate!, maximumNight);
  }

  Future<void> _saveDateRange(
      BuildContext context, DateTimeRange picked) async {
    startDate = picked.start;
    endDate = picked.end;

    if (isDayMode) {
      fetchEstimation(
          type: bookingType,
          onSuccessRes: () {
            Navigator.pop(context);
          },
          startDate: startDate,
          endDate: endDate);
    }
  }

  confirmDateRange(PickerDateRange args) {
    PickerDateRange range = args;

    if (range.startDate != null && range.endDate != null) {
      DateTimeRange picked =
          DateTimeRange(start: range.startDate!, end: range.endDate!);
      _saveDateRange(context, picked);
      // _selectedDateRange = picked;
    } else if (range.startDate != null) {
      DateTimeRange picked =
          DateTimeRange(start: range.startDate!, end: range.startDate!);
      // _selectedDateRange = picked;
      _saveDateRange(context, picked);
    }
  }

  if (isDayMode) {
    return Consumer2<ProductListingViewModel, ProductDetailViewModel>(
      builder: (context, productValue, value, child) {
        return Padding(
          padding: horizontalPadding(vertical: 20),
          child: CommonCardWidget(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Expanded(
                  child: CommonSyncfusionRangePicker(
                    onSelectionChanged: _onSelectionChanged,
                    blackoutDates: value.getBlockedDates(),
                    maxDate: value.limitedEndDate,
                    initialSelectedRange: PickerDateRange(startDate, endDate),
                    controller: value.dateRangeController,
                    minDate: value.selectedStartDate,
                  ),
                ),
                SizedBox(
                  height: 10,
                ),
                Align(
                  alignment: Alignment.bottomCenter,
                  child: Container(
                    padding: EdgeInsets.all(5),
                    width: MediaQuery.of(context).size.width * 0.8,
                    height: MediaQuery.of(context).size.height * 0.10,
                    decoration: BoxDecoration(
                        border: Border(
                            top: BorderSide(color: AppColorData.dividerColor))),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        TextButton(
                          onPressed: () {
                            value.clearDates();
                            value.clearSelectedDate(listingId: listingId);
                            productValue.excludeListingFromFilteredDates(listingId);
                            Navigator.pop(context);
                            value.notify();
                          },
                          child: CommonText(
                            isUnderline: true,
                            text: "clear",
                            style: AppTextStyle.subBodyStyle,
                          ),
                        ),
                        CommonElevatedButton(
                          isLoad: value.state == ViewState.secondaryLoader ? true : false,
                          showLoader: true,
                          width: MediaQuery.of(context).size.width * 0.3,
                          onTap: () {
                            if (isSaveEnabled()) {
                              confirmDateRange(
                                  value.dateRangeController.selectedRange!);
                            }
                          },
                          elevatedButtonName: "save",
                          elevatedButtonNameColor:
                              AppColorData.appSecondaryColor,
                          elevatedButtonColor: AppColorData.blackButtonClr,
                        ),
                      ],
                    ),
                  ),
                )
              ],
            ),
          ),
        );
      },
    );
  } else {
    // listingViewModel.toggleDatePicker();
    return Consumer2<ProductListingViewModel, ProductDetailViewModel>(
      builder: (context, productValue, value, child) {
        return Padding(
          padding: horizontalPadding(),
          child: Column(
            children: [
              CommonCardWidget(
                  isShadowSpread: value.isExpandDatePicker,
                  child: value.isExpandDatePicker
                      ? Column(
                          children: [
                            CommonSyncfusionRangePicker(
                              onSelectionChanged: _onSelectionChanged,
                              blackoutDates: value.getBlockedDates(),
                              initialSelectedRange:
                                  PickerDateRange(startDate, endDate),
                              maxDate: value.limitedEndDate,
                              controller: value.dateRangeController,
                              minDate: value.selectedStartDate,
                            ),
                            Align(
                              alignment: Alignment.bottomCenter,
                              child: Container(
                                  padding: EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                      border: Border(
                                          top: BorderSide(
                                              color:
                                                  AppColorData.dividerColor))),
                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      CommonElevatedButton(
                                        isTextBtn: true,
                                        onTap: () {
                                          value.clearDates();
                                          value.notify();
                                        },
                                        elevatedButtonName: "clear",
                                        style: AppTextStyle.bodyTextStyle,
                                      ),
                                      CommonElevatedButton(
                                        width:
                                            MediaQuery.of(context).size.width *
                                                0.3,
                                        onTap: () {
                                          if (isSaveEnabled() &&
                                              value
                                                      .dateRangeController
                                                      .selectedRange
                                                      ?.startDate !=
                                                  null &&
                                              value.dateRangeController
                                                      .selectedRange?.endDate !=
                                                  null) {
                                            // Ensure both date and time are considered
                                            confirmDateRange(value
                                                .dateRangeController
                                                .selectedRange!);

                                            value.toggleTimePicker(
                                                resetTime: false);
                                          }
                                        },
                                        elevatedButtonName: "next",
                                        elevatedButtonNameColor:
                                            AppColorData.appSecondaryColor,
                                        elevatedButtonColor:
                                            AppColorData.blackButtonClr,
                                      )
                                    ],
                                  )),
                            )
                          ],
                        )
                      : GestureDetector(
                          onTap: () {
                            value.isExpandDatePicker = true;
                            value.isExpandTimePicker = false;
                            value.notify();
                          },
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              CommonText(
                                text: "selectedDate",
                                style: AppTextStyle.headerStyle,
                              ),
                              SizedBox(width: 5),
                              startDate != null && endDate != null
                                  ? Flexible(
                                      child: CommonText(
                                          overflow: TextOverflow.ellipsis,
                                          text:
                                              "${formatDateMonthRange(startDate!, endDate!)}"),
                                    )
                                  : CommonText(text: "undefined")
                            ],
                          ),
                        )),
              SizedBox(
                height: 20,
              ),
              CommonCardWidget(
                  isShadowSpread: value.isExpandTimePicker,
                  child: value.isExpandTimePicker
                      ? ContainerTimePicker(
                          endDate: endDate,
                          startDate: startDate,
                          productDetailViewModel: value,
                          resetOnTap: () {
                            TimeOfDay now = TimeOfDay.now();
                            int hour = now.hour;
                            int minute = now.minute;

                            // Logic to round minutes
                            if (minute > 0 && minute <= 29) {
                              minute = 30;
                            } else if (minute > 29) {
                              hour = (hour + 1) %
                                  24; // Increment hour and wrap around 24 hours if needed
                              minute = 0;
                            }

                            // Update the check-in and check-out times
                            value.checkIntime =
                                TimeOfDay(hour: hour, minute: minute);
                            value.checkOuttime =
                                TimeOfDay(hour: hour, minute: minute);
                            value.isEstimationVisible = false;
                            value.clearSelectedDate(listingId: listingId);
                            Navigator.pop(context);
                            value.notify();
                          },
                          onSave: () {
                            Logger.appLogs(
                                "${value.checkIntime} - ${value.checkOuttime}");
                            var _startDate = DateTime(
                              startDate!.year,
                              startDate!.month,
                              startDate!.day,
                              value.checkIntime.hour,
                              value.checkIntime.minute,
                            );

                            var _endDate = DateTime(
                              endDate!.year,
                              endDate!.month,
                              endDate!.day,
                              value.checkOuttime.hour,
                              value.checkOuttime.minute,
                            );

                            // _startDate = startDate;
                            // _endDate = endDate;

                            fetchEstimation(
                              type: bookingType,
                              startDate: _startDate,
                              endDate: _endDate,
                              startTime: convertTimeOfDayRoundUpTo30(
                                  value.checkIntime),
                              endTime: convertTimeOfDayRoundUpTo30(
                                  value.checkOuttime),
                              onSuccessRes: () {
                                value.isExpandDatePicker = true;
                                value.isExpandTimePicker = false;
                                value.notify();
                                Navigator.pop(context);
                              },
                            );
                          },
                        )
                      : GestureDetector(
                          onTap: () {
                            value.isExpandDatePicker = false;
                            value.isExpandTimePicker = true;
                            value.notify();
                          },
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              CommonText(
                                text: "selectedTime",
                                style: AppTextStyle.headerStyle,
                              ),
                              CommonText(
                                  text:
                                      "${(convertTimeOfDayRoundUpTo30(converterTimeOfDay(startDate) ?? value.checkIntime).format(context))} - ${convertTimeOfDayRoundUpTo30(converterTimeOfDay(endDate) ?? value.checkOuttime).format(context)}")
                            ],
                          ),
                        )),
            ],
          ),
        );
      },
    );
  }
}
