import 'package:airstar_flutter/commonWidgets/widget/widget.dart';
import 'package:airstar_flutter/routes/router_name.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/view_model.dart';
import 'package:flutter/material.dart';
import 'package:get/route_manager.dart';
import 'package:provider/provider.dart';

class BookingHistoryScreen extends StatefulWidget {
  final String status;

  BookingHistoryScreen({super.key, required this.status});

  @override
  State<BookingHistoryScreen> createState() => _BookingHistoryScreenState();
}

class _BookingHistoryScreenState extends State<BookingHistoryScreen> {
  late String _currentStatus; // Declare a mutable state variable
  CommonViewModel? commonViewModel;

  @override
  void initState() {
    super.initState();
    _currentStatus =
        widget.status; // Initialize the state variable with the passed status
    commonViewModel = Provider.of<CommonViewModel>(context, listen: false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: CommonAppBar(
          titleText: "Booking History",
          actions: [
            IconButton(
                onPressed: () {
                  showCustomModalBottomSheet(
                    title: "Booking status",
                    context: context,
                    backgroundColor: AppColorData.appSecondaryColor,
                    builder: (context) => Padding(
                      padding: horizontalPadding(),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          statusWidget(
                              onTap: () {
                                _currentStatus = "pending";

                                Navigator.pop(context);
                                setState(() {});
                              },
                              isSelected: _currentStatus == "pending",
                              icon: Icons.calendar_month_rounded,
                              status: "upcoming"),
                          CustomDivider(),
                          statusWidget(
                              onTap: () {
                                _currentStatus = "checkOut";

                                Navigator.pop(context);
                                setState(() {});
                              },
                              isSelected: _currentStatus == "checkOut",
                              icon: Icons.check_circle_outline_outlined,
                              status: "completed"),
                          CustomDivider(),
                          statusWidget(
                              onTap: () {
                                _currentStatus = "booked";

                                Navigator.pop(context);
                                setState(() {});
                              },
                              isSelected: _currentStatus == "booked",
                              icon: Icons.add_task_rounded,
                              status: "accepted"),
                          CustomDivider(),
                          statusWidget(
                              onTap: () {
                                _currentStatus = "cancelled";

                                Navigator.pop(context);
                                setState(() {});
                              },
                              isSelected: _currentStatus == "cancelled",
                              icon: Icons.highlight_remove_sharp,
                              status: "cancelled"),
                          CustomDivider(),
                          statusWidget(
                              onTap: () {
                                _currentStatus = "all";

                                Navigator.pop(context);
                                setState(() {});
                              },
                              isSelected: _currentStatus == "all",
                              icon: Icons.dashboard,
                              status: "All"),
                          SizedBox(
                            height: 20,
                          )
                        ],
                      ),
                    ),
                  );
                },
                icon: Icon(
                  Icons.tune,
                  color: AppColorData.appIconBlack,
                ))
          ],
        ),
        body: Padding(
          padding: horizontalPadding(vertical: 14),
          child: Consumer<TripViewModel>(
            builder: (context, value, child) {
              var apiDateFormat = commonViewModel
                  ?.settingsResponseModel?.data?.hiddenSettings?.dateFormat;
              if (value.getBookinghistory(_currentStatus).isEmpty)
                return Center(
                  child: Text("No matching data.."),
                );
              return ListView.builder(
                itemCount: value.getBookinghistory(_currentStatus).length,
                itemBuilder: (context, index) {
                  var data = value.getBookinghistory(_currentStatus)[index];
                  return GestureDetector(
                    onTap: () {
                      Get.toNamed(RouterName.tripDetailScreen, arguments: {
                        RouterArguments.data: data,
                        RouterArguments.tripViewModel: value,
                      });
                      /* Navigator.push(context, MaterialPageRoute(
                        builder: (context) {
                          return TripDetailScreen(
                            data: data,
                            tripViewModel: value,
                          );
                        },
                      ));*/
                    },
                    child: Container(
                      width: double.maxFinite,
                      height: 120,
                      margin: EdgeInsets.only(bottom: 20),
                      decoration: BoxDecoration(
                          color: AppColorData.appSecondaryColor,
                          borderRadius: BorderRadius.circular(5),
                          boxShadow: commonBoxShadows(),
                          border: Border.all(
                              width: 1, color: AppColorData.dividerColor)),
                      child: Row(
                        children: [
                          SizedBox(
                            width: MediaQuery.of(context).size.width * 0.3,
                            height: double.maxFinite,
                            child: ClipRRect(
                              borderRadius: BorderRadius.horizontal(
                                  left: Radius.circular(5)),
                              child: CacheImageWidget(
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, url, error) {
                                    return ErrorImage(
                                      isSquare: true,
                                    );
                                  },
                                  imageUrl: data.listingImages?.coverImage ?? ""),
                            ),
                          ),
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Column(
                                // mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    data.propertyName!,
                                    style: AppTextStyle.headerStyle,
                                  ),
                                  SizedBox(
                                    height: 10,
                                  ),
                                  Text("Hosted by "),
                                  Spacer(),
                                  Text(DateFormatterUtil.formatDateRange(
                                      data.bookingdata!.bookedDates!.start!
                                          .toString(),
                                      data.bookingdata!.bookedDates!.end!
                                          .toString(),
                                      apiDateFormat))
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
            },
          ),
        ));
  }

  Widget statusWidget(
      {required IconData icon,
      required String status,
      required bool isSelected,
      required Function()? onTap}) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 10),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: isSelected ? AppColorData.appPrimaryColor : null,
            ),
            SizedBox(
              width: 5,
            ),
            CommonText(
              text: status,
              style: AppTextStyle.headerStyle.copyWith(
                  color: isSelected ? AppColorData.appPrimaryColor : null),
            )
          ],
        ),
      ),
    );
  }
}
