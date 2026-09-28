import 'package:airstar_flutter/commonWidgets/widget/common_padding_alignment.dart';
import 'package:airstar_flutter/ui/host/bottom_bar_screens/subwidgets/common_black_container.dart';
import 'package:airstar_flutter/ui/host/bottom_bar_screens/subwidgets/common_radio_tile.dart';
import 'package:airstar_flutter/utils/components/color/app_color.dart';
import 'package:airstar_flutter/utils/constants/constants.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/host/host_listing_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

import '../../../commonWidgets/button_widgets/common_elevated_button.dart';
import '../../../commonWidgets/widget/common_bottom_sheet_widget.dart';
import '../../../utils/commonFunctions/app_common_functions.dart';
import '../../../viewModel/user/common_viewmodel.dart';

class CalendarPage extends StatefulWidget {
  const CalendarPage({super.key});

  @override
  State<CalendarPage> createState() => _CalendarPageState();
}

class _CalendarPageState extends State<CalendarPage> with SingleTickerProviderStateMixin {

  HostListingViewModel? hostListingViewModel;

  @override
  void initState() {
    super.initState();
    hostListingViewModel = Provider.of<HostListingViewModel>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      hostListingViewModel?.initializeAnimations(this);
      _fetchInitialListing();
    });

  }

  void _fetchInitialListing() async {
    var listings = hostListingViewModel?.userListingsResponseModel?.data?.providerListings ?? [];

    if(listings.isNotEmpty) {
     await hostListingViewModel?.setDefaultCalendarListing(listings);
     if (hostListingViewModel?.selectedCalendarListingId != null) {
       hostListingViewModel?.fetchHostListing(
           hostListingViewModel!.selectedCalendarListingId!);
     }
    }
  }

  @override
  void dispose() {
    hostListingViewModel?.disposeAnimations();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return CommonPadding(
        child: Consumer<HostListingViewModel>(
            builder: (context, value, child) {
              var listings = value.userListingsResponseModel?.data?.providerListings ?? [];
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  (listings.isNotEmpty)
                  ? Row(
                    spacing: 14,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      _listingCard(value),
                      // Container(
                      //   margin: EdgeInsets.only(top: 20.0),
                      //   decoration: BoxDecoration(
                      //       shape: BoxShape.circle,
                      //       color: AppColorData.dividerColor
                      //   ),
                      //   child: IconButton(
                      //       onPressed: () {},
                      //       icon: Icon(Icons.calendar_today_outlined)),
                      // ),
                    ],
                  ) : Padding(
                    padding: const EdgeInsets.only(top: 60.0),
                    child:  CommonText(text: "calendar",style: AppTextStyle.loginHeadingStyle,)),
                  Expanded(
                      child: (listings.isNotEmpty)
                          ? CalendarCardWidget(value: value)
                          : _emptyCalendarText()
                  )
                ],
              );
            }
        )
    );
  }

  Widget _listingCard(HostListingViewModel value ) {
    var listing = value.selectedCalendarListingName
        ?? value.userListingsResponseModel?.data?.providerListings?.first.propertyName;
    return  GestureDetector(
      onTap: () {
        showCustomModalBottomSheet(
            title: "selectAListing",
            context: context,
            builder: (context) => _listingViewSheet());
      },
      child: Container(
        margin: EdgeInsets.only(top: 20.0),
        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: AppColorData.blackClr,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          spacing: 10,
          children: [
            CommonText(
              text: '${listing?.capitalizeFirst}',
              style: AppTextStyle.bodyTextStyle.copyWith(
                  color: AppColorData.whiteClr
              ),
            ),
            Icon(
              Icons.keyboard_arrow_down_outlined,
              color: AppColorData.whiteClr,
            )
          ],
        ),
      ),
    );
  }


  Widget _listingViewSheet() {
    return CommonPadding(
      child: SingleChildScrollView(
        child: Consumer<HostListingViewModel>(
            builder: (context, value, child) {
              var listings = value.userListingsResponseModel?.data?.providerListings ?? [];
              WidgetsBinding.instance.addPersistentFrameCallback((_){
                hostListingViewModel?.setDefaultCalendarListing(listings);
              });

              return ListView.builder(
                  physics: NeverScrollableScrollPhysics(),
                  shrinkWrap: true,
                  itemCount: listings.length,
                  itemBuilder: (context, index) {
                    var data = listings[index];
                    return CommonRadioTile(
                      value: data.id ?? '',
                      groupValue: value.selectedCalendarListingId,
                      title: data.propertyName ?? '',
                      imageUrl: data.coverImage == null
                          ? null
                          : "${EndPointConstants.baseurl}/${data.coverImage}",
                      onChanged: (newValue) {
                        value.selectCalendarListing(newValue!, data.propertyName ?? '');
                        value.fetchCalendarRecords();
                        value.fetchHostListing(newValue).then((_) {
                          Get.back();
                        });
                      },
                    );
                  }
              );
            }
        ),
      ),
    );
  }

  Widget _emptyCalendarText() {
    return Center(
      child: CommonText(
        textAlign: TextAlign.center,
        text: "editYourCalendar",
        style: AppTextStyle.bodyTextStyle,
      ),
    );
  }
}

class CalendarCardWidget extends StatelessWidget {
  final HostListingViewModel value;
  const CalendarCardWidget({super.key, required this.value});

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.bottomCenter,
      children: [
        SingleChildScrollView(
          child: Column(
            children: [
              Container(
                height: 660,
                child: SfCalendar(
                  allowViewNavigation: true,
                  headerHeight: 70,
                  headerStyle: CalendarHeaderStyle(
                      textStyle: AppTextStyle.headingStyle,
                      backgroundColor: AppColorData.whiteClr
                  ),
                  view: CalendarView.month,
                  controller: value.calendarController,
                  initialDisplayDate: DateTime.now(),
                  selectionDecoration: BoxDecoration(
                      color: AppColorData.transparent,
                      border: Border.all(color: AppColorData.transparent)
                  ),
                  dataSource: _getCalendarDataSource(value),
                  monthViewSettings: MonthViewSettings(
                    navigationDirection: MonthNavigationDirection.horizontal,
                    appointmentDisplayMode: MonthAppointmentDisplayMode.appointment,
                    appointmentDisplayCount: 2,
                    showTrailingAndLeadingDates: false,
                  ),
                  appointmentBuilder: (context, details) {
                    final Appointment appointment = details.appointments.first;

                    return GestureDetector(
                      onTap: () {
                        value.selectAppointment(appointment);
                      },
                      child: Container(
                        margin: EdgeInsets.symmetric(horizontal: 6.0),
                        padding: EdgeInsets.symmetric(vertical: 2.0),
                        decoration: BoxDecoration(
                          color: appointment.color,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Center(
                          child: CommonText(
                            text: appointment.subject,
                            style: AppTextStyle.subBodyStyle.copyWith(
                                color: AppColorData.whiteClr
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ),
                    );
                  },
                  onTap: (CalendarTapDetails details) {
                    if (details.targetElement == CalendarElement.calendarCell) {
                      value.selectDate(details.date!);
                    }
                  },
                  monthCellBuilder: (BuildContext context, MonthCellDetails details) {
                    final DateTime date = details.date;
                    final bool isToday = date.isSameDate(DateTime.now());
                    final bool isSelected = value.isDateSelected(date);
                    final bool isInRange = value.isDateInRange(date);
                    final bool isPast = date.isBefore(DateTime.now());
                    final bool isRangeStart = value.isRangeStart(date);
                    final bool isRangeEnd = value.isRangeEnd(date);


                    Color backgroundClr = AppColorData.whiteClr;
                    Color textColor = AppColorData.bodyTextColor;

                    if (isPast ) {
                      backgroundClr = AppColorData.dividerColor;
                      textColor = AppColorData.boxBorder;
                    } else if(isSelected || isInRange || isRangeStart || isRangeEnd) {
                      backgroundClr = AppColorData.blackClr;
                      textColor = AppColorData.whiteClr;
                    }
                    if (isToday) {
                      backgroundClr = isSelected
                          ? AppColorData.blackClr
                          : AppColorData.whiteClr;
                      textColor = isSelected
                          ? AppColorData.bodyTextColor
                          : AppColorData.whiteClr;
                    }

                    return GestureDetector(
                      onTap: () {
                        if (isPast) return;

                        if (!value.isBlockedOrBooked(date)) {
                          value.clearSelectedAppointment();
                          value.selectDate(date);
                        }
                      },
                      child: Container(
                        padding: EdgeInsets.only(bottom: 34),
                        margin: EdgeInsets.all(2),
                        decoration: BoxDecoration(
                          color: backgroundClr,
                          border: Border.all(color: AppColorData.boxBorder),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Center(
                          child: CircleAvatar(
                            radius: 15,
                            backgroundColor: isToday
                                ?  (isSelected ? AppColorData.whiteClr : AppColorData.appPrimaryColor)
                                : AppColorData.transparent,
                            child: CommonText(
                              text: date.day.toString(),
                              style: AppTextStyle.bodyTextStyle.copyWith(
                                  color: textColor
                              ),
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
              SizedBox(height: 150,)
            ],
          ),
        ),
        if(value.hasSelection)
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: AnimatedBuilder(
                animation: value.animationController,
                builder: (context, child) {
                  return Transform.translate(
                    offset: Offset(0, value.slideAnimation.value),
                    child: Opacity(
                      opacity: value.fadeAnimation.value,
                      child: child,
                    ),
                  );
                },
                child: SelectedDateDetails(value: value)),
          ),
      ],
    );
  }

  CalendarDataSource _getCalendarDataSource(HostListingViewModel value) {
    final List<Appointment> appointments = [];
    final now = DateTime.now();

    for(var item in value.calendarResponseModel?.data ?? []) {
      DateTime start = DateTime.parse(item.start);
      DateTime end = DateTime.parse(item.end);

      // ignore for the expired blocks/bookings
      if (end.isBefore(now)) continue;

      if (start.isBefore(now)) {
        start = DateTime(now.year, now.month, now.day); // midnight today
      }


      final isBlocked = item.categories?.any((c) => c.name == "Blocked") ?? false;

      appointments.add(
          Appointment(
            id: item.id,
              startTime: start,
              endTime: end,
              subject: isBlocked
                  ? "blockedDates"
                  : "bookedDates",
              notes: item.summary,
              recurrenceId: item.description,
              color:isBlocked ?  AppColorData.appPrimaryColor : AppColorData.grey03,
              isAllDay: true
          )
      );
    }
    return AppointmentDataSource(appointments);
  }
}

class AppointmentDataSource extends CalendarDataSource{
  AppointmentDataSource(List<Appointment> source) {
    appointments = source;
  }
}

class SelectedDateDetails extends StatelessWidget {
  final HostListingViewModel value;
  const SelectedDateDetails({super.key, required this.value});

  @override
  Widget build(BuildContext context) {

    return Consumer<CommonViewModel>(
        builder: (context, commonModel, child) {
          var listing =  value.userListingsResponseModel?.data?.providerListings?.first;
          var listingId = (value.selectedCalendarListingId == null ) ? listing?.id : value.selectedCalendarListingId;
          final appointment = value.selectedAppointment;
          return Container(
            decoration: BoxDecoration(
              color: AppColorData.transparent,
            ),
            child: Column(
              spacing: 10,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: 10,
                  children: [
                    Container(
                      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppColorData.blackClr,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: CommonText(
                        text: '${ value.selectedCalendarListingName
                            ?? listing?.propertyName?.capitalizeFirst}',
                        style: AppTextStyle.bodyTextStyle.copyWith(
                            color: AppColorData.whiteClr
                        ),
                      ),
                    ),
                    GestureDetector(
                      onTap: () => value.clearSelectedDates(),
                      child: CircleAvatar(
                        backgroundColor: AppColorData.blackClr,
                        child: Icon(Icons.close,
                          color: AppColorData.whiteClr,size: 20,),
                      ),
                    )
                  ],
                ),
                IntrinsicHeight(
                  child: Row(
                    spacing: 6,
                    children: [
                      Expanded(
                          child: CommonBlackContainer(
                            child: Column(
                              spacing: 6,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                blockedListingDetails(value),
                              ],
                            ),
                          )),
                      Expanded(
                          child: CommonBlackContainer(
                            child: Column(
                              spacing: 6,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                blockedDateView(value, commonModel),
                              ],
                            ),
                          )),
                      // Expanded(
                      //     child: Column(
                      //       spacing: 5,
                      //       children: [
                      //         CommonBlackContainer(
                      //           padding: EdgeInsets.all(18),
                      //           child: blockedDateView(value, commonModel),
                      //         ),
                      //         // GestureDetector(
                      //         //   onTap: () {
                      //         //     value.toggleCustomSettings();
                      //         //   },
                      //         //   child: CommonBlackContainer(
                      //         //     padding: EdgeInsets.all(18),
                      //         //     child: Row(
                      //         //       mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      //         //       children: [
                      //         //         CommonText(
                      //         //           text: Strings.customSettings,
                      //         //           style: AppTextStyle.subBodyStyle.copyWith(
                      //         //               color: AppColorData.whiteClr
                      //         //           ),
                      //         //         ),
                      //         //         Icon(Icons.add,size: 20,color: AppColorData.whiteClr,)
                      //         //       ],
                      //         //     ),
                      //         //   ),
                      //         // )
                      //       ],
                      //     )
                      // )
                    ],
                  ),
                ),
                CommonElevatedButton(
                  showLoader: true,
                  isLoad: value.state == ViewState.secondaryLoader,
                    borderRadius: 20,
                    elevatedButtonColor: AppColorData.blackClr,
                    elevatedButtonName: appointment != null ? "delete" : "submit",
                    onTap: (){
                      if(appointment != null) {
                        value.deleteBlockDates(listingId: '${listingId}').then((val){
                          if(val == true) {
                            value.fetchCalendarRecords();
                            value.clearSelectedDates();
                          }
                        });
                      } else {
                        value.updateBlockDates(listingId: '${listingId}').then((val){
                          if(val == true) {
                            value.fetchCalendarRecords();
                            value.clearSelectedDates();
                          }
                        });
                      }

                    })
              ],
            ),
          );
        }
    );
  }

  Widget blockedListingDetails(HostListingViewModel value) {
    final appointment = value.selectedAppointment;


    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: 3,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            CommonText(
              text: appointment != null ? tr("unavailable") : tr("available"),
              style: AppTextStyle.bodyTextStyle.copyWith(
                  color: AppColorData.whiteClr.withOpacity(0.7)
              ),
            ),
            CircleAvatar(
              radius: 4,
              backgroundColor: appointment != null ? AppColorData.appPrimaryColor : AppColorData.tripAcptTxtClr,
            )
          ],
        ),
        const SizedBox(height: 2,),
        if(appointment != null) ...[
          CommonText(
            text: value.selectedSummary ?? '',
            style: AppTextStyle.subBodyStyle.copyWith(
              color: AppColorData.whiteClr,
            ),
          ),
          // CommonText(
          //   text: Strings.description,
          //   style: AppTextStyle.bodyTextStyle.copyWith(
          //       color: AppColorData.whiteClr.withOpacity(0.7)
          //   ),
          // ),
          // CommonText(
          //   text: value.selectedDescription ?? '',
          //   style: AppTextStyle.subBodyStyle.copyWith(
          //     color: AppColorData.whiteClr,
          //   ),
          // ),
        ]
        else ... [
          CommonText(
            text: "blockedDatesSUb",
            style: AppTextStyle.subBodyStyle.copyWith(
              color: AppColorData.whiteClr
            ),
          )
        ]
      ],
    );
  }

  Widget blockedDateView(HostListingViewModel value, CommonViewModel commonModel) {
    var apiDateFormat = commonModel.settingsResponseModel?.data?.hiddenSettings?.dateFormat;
    final appointment = value.selectedAppointment;

    return Column(
      spacing: 6,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CommonText(
            text: "selectedDate",
            style: AppTextStyle.bodyTextStyle.copyWith(
                color: AppColorData.whiteClr.withOpacity(0.7)
            )
        ),
       ( appointment != null)
           ?  CommonText(
         text:DateFormatterUtil.formatDateRange(appointment.startTime.toString(), appointment.endTime.toString(), apiDateFormat),
         style: AppTextStyle.bodyTextStyle.copyWith(
           color: AppColorData.whiteClr,
         ),
       )
        : CommonText(
          text: value.selectedDate != null
              ? DateFormatterUtil.formatDate(value.selectedDate.toString(), apiDateFormat)
              : DateFormatterUtil.formatDateRange(value.rangeStartDate.toString(), value.rangeEndDate.toString(), apiDateFormat),
          style: AppTextStyle.bodyTextStyle.copyWith(
            color: AppColorData.whiteClr,
          ),
        ),
      ],
    );
  }
}

extension DateUtils on DateTime {
  bool isSameDate(DateTime other) {
    return year == other.year && month == other.month && day == other.day;
  }

  bool isBefore(DateTime other) {
    return difference(other).isNegative;
  }

  bool isAfter(DateTime other) {
    return other.difference(this).isNegative;
  }
}




