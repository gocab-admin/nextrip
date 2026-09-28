import 'package:airstar_flutter/utils/components/color/colors.dart';
import 'package:airstar_flutter/utils/constants/textstyle.dart';
import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_datepicker/datepicker.dart';

import '../../utils/components/color/app_color.dart';
import '../../utils/config/debugger/logger.dart';

class CommonSyncfusionRangePicker extends StatefulWidget {
  final DateRangePickerSelectionMode selectionMode;
  final Color startRangeSelectionColor;
  final Color endRangeSelectionColor;
  final Color rangeSelectionColor;
 final DateRangePickerController? controller;
  final DateTime? maxDate;
  final DateTime? minDate;
  final Function(DateRangePickerSelectionChangedArgs)? onSelectionChanged;
  final PickerDateRange? initialSelectedRange;
 final List<DateTime>? blackoutDates;

  CommonSyncfusionRangePicker(
      {Key? key,
      this.selectionMode = DateRangePickerSelectionMode.range,
      this.startRangeSelectionColor = Colors.black,
      this.endRangeSelectionColor = Colors.black,
      this.rangeSelectionColor = Colors.grey,
      this.onSelectionChanged,
      this.initialSelectedRange,
      this.blackoutDates,
      this.maxDate,
      this.minDate,
      this.controller})
      : super(key: key);

  @override
  _CommonSyncfusionRangePickerState createState() =>
      _CommonSyncfusionRangePickerState();
}

class _CommonSyncfusionRangePickerState
    extends State<CommonSyncfusionRangePicker> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    Logger.appLogs("estimating>>>>>>");
    Logger.appLogs("startDate>>>>>> ${widget.initialSelectedRange?.startDate}");
    Logger.appLogs("endDate>>>>>> ${widget.initialSelectedRange?.endDate}");
  }
  @override
  Widget build(BuildContext context) {
    return SfDateRangePicker(
      headerHeight: 70,
      controller: widget.controller,
      // enableMultiView: true,
      viewSpacing: 20,
      headerStyle: DateRangePickerHeaderStyle(
        textStyle: AppTextStyle.headerStyle,
        backgroundColor:
            AppColorData.appSecondaryColor, // Example of static color
        textAlign: TextAlign.start,
      ),
      maxDate: widget.maxDate,
      minDate: widget.minDate,
      navigationMode: DateRangePickerNavigationMode.scroll,
      navigationDirection: DateRangePickerNavigationDirection.vertical,
      toggleDaySelection: true,
      backgroundColor:
          AppColorData.appSecondaryColor, // Example of static color
      todayHighlightColor: AppColorData.transparent, // Example of static color
      selectionColor: AppColorData.blackClr, // Example of static color
      view: DateRangePickerView.month,
      selectionMode: widget.selectionMode,
      enablePastDates: false,

      monthViewSettings: DateRangePickerMonthViewSettings(
        viewHeaderHeight: 50,
        blackoutDates: widget.blackoutDates,
        dayFormat: 'EE',
      ),
      monthCellStyle: DateRangePickerMonthCellStyle(
        blackoutDateTextStyle: TextStyle(
          color: Colors.grey.shade300,
        ),
        todayTextStyle: TextStyle(color: AppColorData.bodyTextColor),
      ),
      startRangeSelectionColor: widget.startRangeSelectionColor,
      endRangeSelectionColor: widget.endRangeSelectionColor,
      rangeSelectionColor: AppColorData.shadowClr,
      initialSelectedRange: widget.initialSelectedRange,
      onSelectionChanged: widget.onSelectionChanged,
    );
  }
}
