import 'package:airstar_flutter/viewModel/user/product_detail_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../utils/utils.dart';
class TimeCardListWidget extends StatefulWidget {
  final DateTime? defaultSelectedTime;
  final Function(DateTime? value) onSelect;
  final DateTime? startDate;
  final DateTime? endDate;
  final bool? isBlocked;
  final DateTime? minimumTime;
  final bool isCheckInPicker;

  const TimeCardListWidget({
    super.key,
    this.defaultSelectedTime,
    required this.onSelect,
    this.startDate,
    this.endDate,
    this.isBlocked = false,
    this.minimumTime,
    required this.isCheckInPicker,
  });

  @override
  State<TimeCardListWidget> createState() => _TimeCardListWidgetState();
}

class _TimeCardListWidgetState extends State<TimeCardListWidget> {
  late List<DateTime> timeSlots;
  DateTime? selectedTime;
  late ScrollController scrollController;
  final DateTime currentDate = DateTime.now();
  ProductDetailViewModel? productDetailViewModel;

  @override
  void initState() {
    super.initState();
    scrollController = ScrollController();
    timeSlots = _generateTimeSlots();
    productDetailViewModel = Provider.of<ProductDetailViewModel>(context, listen: false);
    _initializeSelectedTime();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scrollToSelected();
    });
  }

  void _initializeSelectedTime() {
    if (productDetailViewModel?.isActivelySelecting == true) {
      selectedTime = widget.defaultSelectedTime ?? DateTime(0, 1, 1, 12, 0);
    } else {
      DateTime? timeSource = widget.isCheckInPicker ? widget.startDate : widget.endDate;

      if (timeSource != null) {
        selectedTime = DateTime(0, 1, 1, timeSource.hour, timeSource.minute);
      } else {
        selectedTime = DateTime(0, 1, 1, 12, 0);
      }
    }
  }

  @override
  void dispose() {
    scrollController.dispose();
    super.dispose();
  }

  void _scrollToSelected() {
    final index = timeSlots.indexOf(selectedTime!);
    if (index != -1) {
      final itemWidth = 105.0;
      final scrollOffset = (index * itemWidth) - (scrollController.position.viewportDimension / 2) + (itemWidth / 2);
      scrollController.animateTo(
        scrollOffset,
        duration: const Duration(milliseconds: 500),
        curve: Curves.easeInOut,
      );
    }
  }

  List<DateTime> _generateTimeSlots() {
    List<DateTime> slots = [];
    DateTime startTime = DateTime(0, 1, 1, 0, 0);
    DateTime endTime = DateTime(0, 1, 1, 23, 59);

    while (startTime.isBefore(endTime)) {
      slots.add(startTime);
      startTime = startTime.add(const Duration(minutes: 30));
    }
    return slots;
  }

  bool isPastTime(DateTime timeSlot) {
    return (widget.startDate != null &&
        widget.startDate!.year == currentDate.year &&
        widget.startDate!.month == currentDate.month &&
        widget.startDate!.day == currentDate.day &&
        timeSlot.isBefore(DateTime(0, 1, 1, currentDate.hour, currentDate.minute))) ||
        (widget.minimumTime != null && timeSlot.isBefore(widget.minimumTime!));
  }

  bool isTimeSlotSelected(DateTime timeSlot) {
    final sourceDate = widget.isCheckInPicker ? widget.startDate : widget.endDate;
    if (sourceDate == null) return false;
    return timeSlot.hour == sourceDate.hour && timeSlot.minute == sourceDate.minute;

  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ProductDetailViewModel>(builder: (context, value, child) {
      return Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: scrollController,
              scrollDirection: Axis.horizontal,
              itemCount: timeSlots.length,
              itemBuilder: (context, index) {
                DateTime timeSlot = timeSlots[index];
                String formattedTime = DateFormat('h:mm a').format(timeSlot);
                bool pastTime = isPastTime(timeSlot);
                bool isSelected = isTimeSlotSelected(timeSlot);
                bool isCurrentlySelected = selectedTime == timeSlot;
                bool shouldHighlight = value.isActivelySelecting ? isCurrentlySelected : isSelected;

                return GestureDetector(
                  onTap: pastTime && widget.isBlocked == true
                      ? null
                      : () {
                    value.isActivelySelecting = true;
                    selectedTime = timeSlot;
                    value.notify();
                    widget.onSelect(selectedTime);
                    _scrollToSelected();
                  },
                  child: Container(
                    width: 90,
                    margin: const EdgeInsets.symmetric(horizontal: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 0),
                    decoration: BoxDecoration(
                      color: shouldHighlight
                          ? AppColorData.blackButtonClr
                          : AppColorData.appSecondaryColor,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColorData.dividerColor),
                    ),
                    child: Stack(
                      children: [
                        Center(
                          child: Text(
                            formattedTime,
                            style: AppTextStyle.subBodyStyle.copyWith(
                              color: shouldHighlight
                                  ? AppColorData.appSecondaryColor
                                  : AppColorData.blackButtonClr,
                            ),
                          ),
                        ),
                        if (pastTime && widget.isBlocked == true)
                          Positioned.fill(
                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.6),
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      );
    });
  }
}
