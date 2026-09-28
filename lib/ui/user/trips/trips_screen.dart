import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/user/common_viewmodel.dart';
import 'package:airstar_flutter/viewModel/user/trips_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:get/route_manager.dart';
import 'package:provider/provider.dart';

import '../../../routes/routes.dart';
import '../login_and_signup/login_screen.dart';

class TripsScreen extends StatefulWidget {
  final String? token;
  const TripsScreen({super.key, required this.token});

  @override
  State<TripsScreen> createState() => _TripsScreenState();
}

class _TripsScreenState extends State<TripsScreen> {
  CommonViewModel? commonViewModel;

  @override
  void initState() {
    commonViewModel = Provider.of<CommonViewModel>(context, listen: false);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: CustomScrollView(
      slivers: [
        SliverAppBar(
          automaticallyImplyLeading: false,
          pinned: true,
          floating: false,
          expandedHeight: 120,
          flexibleSpace: CommonSliverAppBar(
            isBackArrowPresent: false,
            title: "trips",
          ),
        ),
        SliverList(
            delegate: SliverChildListDelegate([
          widget.token != null && widget.token!.isNotEmpty
              ? Consumer<TripViewModel>(
                  builder: (context, viewModel, child) {
                    if (viewModel.state == ViewState.busy) {
                      return SizedBox(height: 600, child: TripScreenLoader());
                    } else if (viewModel.tripResponseModel?.data?.bookingHistory
                            ?.isNotEmpty ??
                        false) {
                      return _bookedTripScreen(viewModel);
                    } else {
                      return _renderBody();
                    }
                  },
                )
              : _loginTripsView(),
        ]))
      ],
    ));
  }

  Widget _renderBody() {
    return Padding(
      padding: horizontalPadding(vertical: 14).toLTRAware(context),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CustomDivider(),
          SizedBox(
            height: 20,
          ),
          CommonText(
            text: "noTripsBooked",
            style: AppTextStyle.titleStyle,
          ),
          SizedBox(
            height: 10,
          ),
          CommonText(
            text: "timeToDustOff",
            style: AppTextStyle.bodyTextStyle
                .copyWith(fontWeight: FontWeight.w400),
          ),
          SizedBox(
            height: 15,
          ),
          CommonElevatedButton(
            width: MediaQuery.of(context).size.width * 0.40,
            border: Border.all(color: AppColorData.blackBorderClr),
            elevatedButtonColor: AppColorData.appSecondaryColor,
            elevatedButtonNameColor: AppColorData.bodyTextColor,
            elevatedButtonName: "startSearching",
            onTap: () {
              Get.offAllNamed(
                RouterName.dashBoard,
              );
            },
          ),
          SizedBox(
            height: 40,
          ),
          CustomDivider(),
          doubleSpacer(),
          RichText(
            text: TextSpan(
                text: tr("cantFindReserve"),
                style: AppTextStyle.subBodyHintTextStyle
                    .copyWith(color: AppColorData.subBodyTextClr),
                children: [
                  TextSpan(text: " "),
                  TextSpan(
                      text: tr("visitHelpCenter"),
                      style: AppTextStyle.subBodyStyle.copyWith(
                          fontWeight: FontWeight.w600,
                          decoration: TextDecoration.underline)),
                ]),
          )
        ],
      ),
    );
  }

  Widget _bookedTripScreen(TripViewModel viewModel) {
    var apiDateFormat = commonViewModel
        ?.settingsResponseModel?.data?.hiddenSettings?.dateFormat;
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 20),
      child: SingleChildScrollView(
        child: viewModel.tripResponseModel == null
            ? Column(
                children: [],
              )
            : Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ListView.builder(
                      physics: ScrollPhysics(),
                      shrinkWrap: true,
                      itemCount: viewModel.getBookinghistory("pending").length,
                      itemBuilder: (context, index) {
                        var data =
                            viewModel.getBookinghistory("pending")[index];

                        return GestureDetector(
                          onTap: () {
                            Get.toNamed(RouterName.tripDetailScreen,
                                arguments: {
                                  RouterArguments.data: data,
                                  // RouterArguments.tripViewModel: viewModel,
                                });
                          },
                          child: Container(
                            margin: EdgeInsets.only(
                                bottom: 40, left: 20, right: 20),
                            decoration: BoxDecoration(
                                color: AppColorData.appSecondaryColor,
                                borderRadius: BorderRadius.circular(10),
                                boxShadow: commonBoxShadows()),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Stack(
                                  children: [
                                    SizedBox(
                                        height: 250,
                                        width: double.maxFinite,
                                        child: ClipRRect(
                                            borderRadius: BorderRadius.vertical(
                                                top: Radius.circular(8)),
                                            child: CacheImageWidget(
                                              imageUrl: data.listingImages
                                                      ?.coverImage ??
                                                  "",
                                              fit: BoxFit.fill,
                                              errorBuilder:
                                                  (context, url, error) {
                                                return ErrorImage(
                                                  isSquare: true,
                                                );
                                              },
                                            ))),
                                    Padding(
                                      padding: const EdgeInsets.all(8.0),
                                      child: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          Container(
                                            padding: EdgeInsets.symmetric(
                                                horizontal: 5, vertical: 3),
                                            decoration: BoxDecoration(
                                                color: AppColorData
                                                    .appSecondaryColor,
                                                borderRadius:
                                                    BorderRadius.circular(5)),
                                            child: CommonText(
                                              text: calculateDateDifference(
                                                          DateTime.now(),
                                                          data
                                                              .bookingdata!
                                                              .bookedDates!
                                                              .start!) ==
                                                      0
                                                  ? "Today"
                                                  : "${tr("In")} ${calculateDateDifference(DateTime.now(), data.bookingdata!.bookedDates!.start!)} ${tr("days")}",
                                              style: AppTextStyle.subBodyStyle,
                                            ),
                                          ),
                                          Container(
                                            padding: EdgeInsets.symmetric(
                                                horizontal: 5, vertical: 3),
                                            decoration: BoxDecoration(
                                                color: AppColorData
                                                    .tripProcesBgClr
                                                    .withOpacity(0.9),
                                                borderRadius:
                                                    BorderRadius.circular(5)),
                                            child: CommonText(
                                                text: data.bookingdata!.status,
                                                style: AppTextStyle.contentStyle
                                                    .copyWith(
                                                        color: AppColorData
                                                            .tripProcesTxtClr)),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(14.0),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      CommonText(
                                        text: data.propertyName!,
                                        style: AppTextStyle.headerStyle,
                                      ),
                                      CustomDivider(),
                                      SizedBox(
                                        height: 80,
                                        child: Row(
                                          children: [
                                            SizedBox(
                                              width: 60,
                                              child: CommonText(
                                                //  overflow: TextOverflow.ellipsis,
                                                text: DateFormatterUtil
                                                    .formatDateRange(
                                                        data.bookingdata!
                                                            .bookedDates!.start!
                                                            .toString(),
                                                        data.bookingdata!
                                                            .bookedDates!.end!
                                                            .toString(),
                                                        apiDateFormat),
                                                style:
                                                    AppTextStyle.subBodyStyle,
                                              ),
                                            ),
                                            Padding(
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                      vertical: 15),
                                              child: VerticalDivider(
                                                color:
                                                    AppColorData.dividerColor,
                                                width: 50,
                                              ),
                                            ),
                                            Expanded(
                                              child: Column(
                                                mainAxisAlignment:
                                                    MainAxisAlignment.center,
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.start,
                                                children: [
                                                  Flexible(
                                                      child: RichText(
                                                    text: TextSpan(
                                                      children: [
                                                        TextSpan(
                                                          text:
                                                              "${data.address!.city!} "
                                                                  .tr(),
                                                          style: AppTextStyle
                                                              .headerStyle,
                                                        ),
                                                        if (data.address
                                                                ?.state !=
                                                            null)
                                                          TextSpan(
                                                            text:
                                                                "${data.address?.state ?? ''}"
                                                                    .tr(),
                                                            style: AppTextStyle
                                                                .bodyTextStyle,
                                                          ),
                                                      ],
                                                    ),
                                                  )),
                                                  CommonText(
                                                    text:
                                                        "${data.address!.country!}",
                                                    style: AppTextStyle
                                                        .subBodyStyle,
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      if (dateContainsTime(data.bookingdata!
                                              .bookedDates!.start!) &&
                                          dateContainsTime(data
                                              .bookingdata!.bookedDates!.end!))
                                        Column(
                                          children: [
                                            CustomDivider(),
                                            Row(
                                              mainAxisAlignment:
                                                  MainAxisAlignment
                                                      .spaceBetween,
                                              children: [
                                                Column(
                                                  crossAxisAlignment:
                                                      CrossAxisAlignment.start,
                                                  children: [
                                                    CommonText(
                                                      text: "checkIn",
                                                    ),
                                                    SizedBox(
                                                      height: 5,
                                                    ),
                                                    CommonText(
                                                      text: convertDatetoTime(
                                                          data
                                                              .bookingdata!
                                                              .bookedDates!
                                                              .start!),
                                                    )
                                                  ],
                                                ),
                                                Column(
                                                  crossAxisAlignment:
                                                      CrossAxisAlignment.end,
                                                  children: [
                                                    CommonText(
                                                      text: "checkOut",
                                                    ),
                                                    SizedBox(
                                                      height: 5,
                                                    ),
                                                    CommonText(
                                                      text: convertDatetoTime(
                                                          data
                                                              .bookingdata!
                                                              .bookedDates!
                                                              .end!),
                                                    )
                                                  ],
                                                ),
                                              ],
                                            )
                                          ],
                                        ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }),
                  if (viewModel.getBookinghistory("cancelled").isNotEmpty)
                    tripHistory(viewModel, "cancelledTrips", "cancelled"),
                  if (viewModel.getBookinghistory("booked").isNotEmpty)
                    tripHistory(viewModel, "bookingHistory", "booked"),
                ],
              ),
      ),
    );
  }

  Widget tripHistory(TripViewModel viewModel, String title, String status) {
    var apiDateFormat = commonViewModel
        ?.settingsResponseModel?.data?.hiddenSettings?.dateFormat;
    return Padding(
      padding: EdgeInsets.only(left: 20.0)
          .toLTRAware(context), //horizontalPadding(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              CommonText(
                text: title,
                style: AppTextStyle.titleStyle,
              ),
              IconButton(
                  onPressed: () {
                    Get.toNamed(RouterName.bookingHistoryScreen, arguments: {
                      RouterArguments.status: status,
                    });
                  },
                  icon: Icon(
                    Icons.keyboard_arrow_right_outlined,
                    size: 35,
                  ).toLTRAware(context))
            ],
          ),
          SizedBox(
            height: 20,
          ),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                ...viewModel.getBookinghistory(status).map((e) => InkWell(
                      onTap: () {
                        Get.toNamed(RouterName.tripDetailScreen, arguments: {
                          RouterArguments.data: e,
                          // RouterArguments.tripViewModel: viewModel,
                        });
                      },
                      child: Container(
                        decoration: BoxDecoration(
                            borderRadius:
                                BorderRadius.circular(5).toLTRAware(context),
                            color: AppColorData.appSecondaryColor,
                            boxShadow: commonBoxShadows(),
                            border: Border.all(
                                width: 1, color: AppColorData.dividerColor)),
                        margin: EdgeInsets.only(right: 20).toLTRAware(context),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              color: Colors.red,
                              child: ClipRRect(
                                borderRadius: BorderRadius.horizontal(
                                        left: Radius.circular(5))
                                    .toLTRAware(context),
                                child: CacheImageWidget(
                                    showErrorImage: false,
                                    width: 89,
                                    height: 100,
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, url, error) {
                                      Logger.appLogs(
                                          "error cancel trips $error::::$url");
                                      return SizedBox(
                                        width: 89,
                                        height: 100,
                                        child: ErrorImage(
                                          isSquare: true,
                                        ),
                                      );
                                    },
                                    imageUrl:
                                        e.listingImages?.coverImage ?? ""),
                              ),
                            ),
                            ConstrainedBox(
                              constraints: BoxConstraints(maxWidth: 170),
                              child: Padding(
                                padding: const EdgeInsets.all(8.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    CommonText(
                                      text: "${e.propertyName!}",
                                      overflow: TextOverflow.ellipsis,
                                      style: AppTextStyle.headerStyle,
                                    ),
                                    SizedBox(
                                      height: 5,
                                    ),
                                    CommonText(text: "Hosted by "),
                                    SizedBox(
                                      height: 5,
                                    ),
                                    Text(DateFormatterUtil.formatDateRange(
                                        e.bookingdata!.bookedDates!.start!
                                            .toString(),
                                        e.bookingdata!.bookedDates!.end!
                                            .toString(),
                                        apiDateFormat))
                                  ],
                                ),
                              ),
                            )
                          ],
                        ),
                      ),
                    ))
              ],
            ),
          ),
          SizedBox(
            height: 20,
          ),
        ],
      ),
    );
  }

  Widget _loginTripsView() {
    return Padding(
      padding: horizontalPadding(vertical: 14),
      child: Container(
        width: MediaQuery.of(context).size.width,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CustomDivider(),
            doubleSpacer(),
            CommonText(
              text: "noTrips",
              style: AppTextStyle.headingStyle,
            ),
            doubleSpacer(),
            CommonText(
              text: "tripsSub",
              style: AppTextStyle.bodyTextStyle.copyWith(
                  color: AppColorData.subBodyTextClr,
                  fontWeight: FontWeight.w300),
            ),
            doubleSpacer(),
            CommonElevatedButton(
              width: MediaQuery.of(context).size.width * 0.35,
              elevatedButtonName: "login",
              elevatedButtonColor: AppColorData.appPrimaryColor,
              onTap: () {
                Get.toNamed(RouterName.loginScreen);
                /* Navigator.push(context,
                    MaterialPageRoute(builder: (context) => LoginScreen()));*/
              },
            )
          ],
        ),
      ),
    );
  }
}

class CancelledTips {
  const CancelledTips({
    required this.id,
    required this.hotel,
    required this.hostedBy,
    required this.date,
  });

  final int id;
  final String hotel;
  final String hostedBy;
  final String date;
}
