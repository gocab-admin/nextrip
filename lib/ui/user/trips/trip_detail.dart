import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/user/trip_response_model.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/ui/user/trips/ratings_screen.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/view_model.dart';
import '../../../routes/router_name.dart';
import '../login_and_signup/login_screen.dart';

class TripDetailScreen extends StatefulWidget {
  final BookingHistory data;
  const TripDetailScreen({
    super.key,
    required this.data,
  });

  @override
  State<TripDetailScreen> createState() => _TripDetailScreenState();
}

class _TripDetailScreenState extends State<TripDetailScreen> {
  late TripViewModel? tripViewModel;
  CommonViewModel? commonViewModel;
  @override
  void initState() {
    super.initState();
    tripViewModel = Provider.of<TripViewModel>(context, listen: false);
    commonViewModel = Provider.of<CommonViewModel>(context, listen: false);
  }

  @override
  Widget build(BuildContext context) {
    bool isCancel = false;
    return Scaffold(
      backgroundColor: AppColorData.appSecondaryColor,
      appBar: CommonAppBar(
        showBorder: true,
        titleText: (widget.data.bookingdata?.status == "cancelled")
            ? "cancelledTrips"
            : "yourTrip",
        actions: [
          if (widget.data.bookingdata?.status == "pending")
            Padding(
              padding: const EdgeInsets.only(right: 14.0),
              child: CommonElevatedButton(
                  isTextBtn: true,
                  isUnderline: false,
                  elevatedButtonName: "cancel",
                  onTap: () {
                   // tripCancelDialog(isCancel, context);
                    TripCancelUtil.showTripCancelDialog(
                        context: context,
                        bookingId: widget.data.bookingdata?.id ?? '',
                        onHostSuccess: () async {
                          SharedPreferences prefs =
                              await SharedPreferences.getInstance();
                          var token = prefs.getString(PrefConstant.authToken);
                          Get.toNamed(
                            RouterName.dashBoard,
                            arguments: {
                              RouterArguments.index: '2',
                              RouterArguments.token: token
                            },
                          );
                        });
                  }),
            )
        ],
        // centerTitle: false,
        // backgroundColor: AppColorData.shimmerBaseColor,
      ),
      body: Padding(
        padding: horizontalPadding(),
        child: ListView(
          children: [
            SizedBox(
              height: 30,
            ),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: CacheImageWidget(
                    errorBuilder: (context, url, error) {
                      return ErrorImage(
                        isSquare: true,
                      );
                    },
                    width: MediaQuery.of(context).size.width * 0.4,
                    imageUrl: widget.data.listingImages?.coverImage ?? "",
                    fit: BoxFit.fill,
                  ),
                ),
                SizedBox(
                  width: 10,
                ),
                Flexible(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      CommonText(
                          text: widget.data.propertyName!,
                          style: AppTextStyle.headerStyle),
                      CommonText(
                          text:
                              "${widget.data.address!.city.toString()},${widget.data.address!.country.toString()} ",
                          style: AppTextStyle.subBodyStyle),
                    ],
                  ),
                )
              ],
            ),
            SizedBox(
              height: 30,
            ),
            yourTrip(),
            SizedBox(
              height: 30,
            ),
            priceDetails(),
            SizedBox(
              height: 30,
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                CommonText(
                  text: "paymentMode",
                  style: AppTextStyle.titleStyle,
                ),
                CommonText(
                  text: widget.data.bookingdata!.paymentMode!,
                  style: AppTextStyle.headerStyle,
                )
              ],
            ),
            SizedBox(
              height: 30,
            ),
            if(widget.data.bookingdata?.status == "checkOut")
            GestureDetector(
              onTap: (){
                showCustomModalBottomSheet(
                    showIcon: true,
                    showDivider: true,
                    context: context,
                    title: (widget.data.isReviewed ?? false) ?" your review":"Add your review",
                    builder: (context) {
                      return RatingsScreen(
                        listingId: widget.data.id ?? '',
                        bookingId: widget.data.bookingdata?.id ?? '',
                        onlyView: widget.data.isReviewed ?? false,
                      );
                    });
              },
              child: CommonText(
                text: (widget.data.isReviewed ?? false) ?"show my review":"Add review",
                style: AppTextStyle.bodyTextStyle.copyWith(
                  decoration: TextDecoration.underline
                ),
              ),
            ),
            SizedBox(
              height: 30,
            ),
            if (widget.data.bookingdata?.status == "cancelled")
              CommonText(
                text: "cancelledReason",
                style: AppTextStyle.titleStyle,
              ),
            if (widget.data.bookingdata?.status == "cancelled")
              CommonText(
                text: widget.data.bookingdata?.cancellation?.reason ?? '',
                style: AppTextStyle.bodyTextStyle
                    .copyWith(color: AppColorData.subBodyTextClr),
              ),
            SizedBox(
              height: 30,
            ),
            if (widget.data.bookingdata?.status == "cancelled")
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  CommonText(
                    text: "cancelledBy",
                    style: AppTextStyle.titleStyle,
                  ),
                  CommonText(
                    text: widget.data.bookingdata?.cancellation?.cancledBy
                        ?.toLowerCase(),
                    style: AppTextStyle.bodyTextStyle
                        .copyWith(color: AppColorData.subBodyTextClr),
                  )
                ],
              ),
            SizedBox(
              height: 30,
            ),
          ],
        ),
      ),
    );
  }

  Column priceDetails() {
    var apiDateFormat = commonViewModel
        ?.settingsResponseModel?.data?.hiddenSettings?.dateFormat;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CommonText(
          text: "priceDetails",
          style: AppTextStyle.titleStyle,
        ),
        // doubleSpacer(),
        // Row(
        //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
        //   children: [
        //     Flexible(
        //       child: CommonText(
        //         text:
        //             "${formatDateTimeMonthDate(widget.data.bookingdata!.bookedDates!.start!)} - ${formatDateTimeMonthDate(widget.data.bookingdata!.bookedDates!.end!)}",
        //         style: AppTextStyle.bodyTextStyle.copyWith(
        //             fontWeight: FontWeight.w400,
        //             color: AppColorData.subBodyTextClr),
        //       ),
        //     ),
        //     SizedBox(
        //       width: 20,
        //     ),
        //     CommonText(
        //       text:
        //           "${widget.data.bookingdata?.currencySymbol} ${widget.data.bookingdata!.fareAmount.toString()}",
        //       style: AppTextStyle.bodyTextStyle
        //           .copyWith(color: AppColorData.subBodyTextClr),
        //     )
        //   ],
        // ),
        doubleSpacer(),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            CommonText(
              text:
                  "${tr("nights").capitalizeFirst} x ${widget.data.bookingdata?.bookedHours?.nights}",
              style: AppTextStyle.bodyTextStyle.copyWith(
                  fontWeight: FontWeight.w400,
                  color: AppColorData.subBodyTextClr),
            ),
            CommonText(
                text:
                    "${widget.data.bookingdata?.currencySymbol} ${formatPrice(calculatePrice(widget.data.bookingdata?.bookedHours?.nights, widget.data.bookingdata?.perDay))}",
                style: AppTextStyle.bodyTextStyle.copyWith(
                    fontWeight: FontWeight.w400,
                    color: AppColorData.subBodyTextClr))
          ],
        ),
        if(widget.data.bookingdata?.bookedHours?.hours != 0) doubleSpacer(),
       if(widget.data.bookingdata?.bookedHours?.hours != 0) Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            CommonText(
              text:
                  "${tr("hours").capitalizeFirst} x ${widget.data.bookingdata?.bookedHours?.hours}",
              style: AppTextStyle.bodyTextStyle.copyWith(
                  fontWeight: FontWeight.w400,
                  color: AppColorData.subBodyTextClr),
            ),
            CommonText(
                text:
                    "${widget.data.bookingdata?.currencySymbol} ${formatPrice(calculatePrice(widget.data.bookingdata?.bookedHours?.hours, widget.data.bookingdata?.perHour))}",
                style: AppTextStyle.bodyTextStyle.copyWith(
                    fontWeight: FontWeight.w400,
                    color: AppColorData.subBodyTextClr))
          ],
        ),
        doubleSpacer(),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            CommonText(
              text: "paidAmount",
              style: AppTextStyle.bodyTextStyle.copyWith(
                  fontWeight: FontWeight.w400,
                  color: AppColorData.subBodyTextClr),
            ),
            CommonText(
                text:
                    "${widget.data.bookingdata?.currencySymbol} ${formatPrice(widget.data.bookingdata!.paidAmount)}",
                style: AppTextStyle.bodyTextStyle.copyWith(
                    fontWeight: FontWeight.w400,
                    color: AppColorData.discountAmountClr))
          ],
        ),
        doubleSpacer(),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            CommonText(
              text: "paidOn",
              style: AppTextStyle.bodyTextStyle.copyWith(
                  fontWeight: FontWeight.w400,
                  color: AppColorData.subBodyTextClr),
            ),
            CommonText(
                text:
                    "${ DateFormatterUtil.formatDate(widget.data.bookingdata!.paidDate.toString(), apiDateFormat)}",
                style: AppTextStyle.bodyTextStyle.copyWith(
                    fontWeight: FontWeight.w400,
                    color: AppColorData.subBodyTextClr))
          ],
        ),
        doubleSpacer(),
        // Row(
        //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
        //   children: [
        //     CommonText(
        //       text: Strings.serviceFee,
        //       style: AppTextStyle.subHeaderHintStyle
        //           .copyWith(color: AppColorData.subBodyTextHighlightClr),
        //     ),
        //     CommonText(
        //         text: "\$ 0",
        //         style: AppTextStyle.subHeaderStyle
        //             .copyWith(color: AppColorData.discountAmountClr))
        //   ],
        // ),
        // doubleSpacer(),
        // Row(
        //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
        //   children: [
        //     CommonText(
        //       text: Strings.taxes,
        //       style: AppTextStyle.subHeaderHintStyle
        //           .copyWith(color: AppColorData.subBodyTextHighlightClr),
        //     ),
        //     Text(
        //       "",
        //       style: AppTextStyle.subHeaderStyle
        //           .copyWith(color: AppColorData.subBodyTextClr),
        //     )
        //   ],
        // ),
        // doubleSpacer(),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            CommonText(
              text: "${tr("total")}(${widget.data.bookingdata?.currency})",
              style: AppTextStyle.bodyTextStyle,
            ),
            CommonText(
              text:
                  "${widget.data.bookingdata?.currencySymbol} ${formatPrice(widget.data.bookingdata!.fareAmount)}",
              style: AppTextStyle.bodyTextStyle,
            )
          ],
        ),
        doubleSpacer(),
        // Align(
        //   alignment: Alignment.bottomRight,
        //   child: CommonText(
        //     text: Strings.moreInfo,
        //     style: AppTextStyle.underlinedSubHeaderText,
        //   ),
        // )
      ],
    );
  }

  int totalGuest() {
    if (widget.data.bookingdata?.adults != null) {
      return widget.data.bookingdata!.adults! +
          widget.data.bookingdata!.children!;
    }
    return 0;
  }

  yourTrip() {
    var apiDateFormat = commonViewModel
        ?.settingsResponseModel?.data?.hiddenSettings?.dateFormat;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CommonText(
          text: "yourTrip",
          style: AppTextStyle.titleStyle,
        ),
        doubleSpacer(),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            CommonText(
              text: "dates",
              style: AppTextStyle.headerStyle,
            ),
            SizedBox(
              width: 20,
            ),
            Flexible(
              child: CommonText(
              text: DateFormatterUtil.formatDateRangeWithTime(widget.data.bookingdata!.bookedDates!.start!.toString(), widget.data.bookingdata!.bookedDates!.end!.toString(), apiDateFormat),
                style: AppTextStyle.bodyTextStyle
                    .copyWith(color: AppColorData.subBodyTextClr),
              ),
            )
          ],
        ),
        spacer(),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              CommonText(
                text: "guests",
                style: AppTextStyle.headerStyle,
              ),
              CommonText(
                text: "${totalGuest()} ${tr("guest")}",
                style: AppTextStyle.bodyTextStyle.copyWith(
                    fontWeight: FontWeight.w400,
                    color: AppColorData.subBodyTextClr),
              )
            ],
          ),
      ],
    );
  }

  Future tripCancelDialog(bool isCancel, BuildContext context) {
    TextEditingController reason = TextEditingController();
    GlobalKey formKey = GlobalKey<FormState>();
    return showDialog(
        context: context,
        barrierDismissible: false,
        traversalEdgeBehavior: TraversalEdgeBehavior.leaveFlutterView,
        useSafeArea: true,
        builder: (context) {
          return Consumer<TripViewModel>(builder: (context, value, child) {
            return CommonAlertDialog(
              titleWidget: Padding(
                padding:
                    const EdgeInsets.only(left: 10.0, top: 14.0, right: 14),
                child: Row(
                  children: [
                    GestureDetector(
                      onTap: () {
                        Navigator.pop(context);
                      },
                      child: Icon(
                        Icons.close,
                        size: 16,
                      ),
                    ),
                    SizedBox(
                      width: 10,
                    ),
                    CommonText(
                      text: "giveReasonToCancel",
                      style: AppTextStyle.bodyTextStyle,
                    ),
                  ],
                ),
              ),
              // title: "Give reason to cancel your booking?",
              contentWidget: Form(
                key: formKey,
                child: CommonTextFromField(
                  maxLines: 5,
                  hintText: tr("reason"),
                  controller: reason,
                  errorMessage: reason.text.isEmpty
                      ? ""
                      : AppValidators().validateReason(reason.text) ?? "",
                  /*validator: (value) {
                          if (value!.isEmpty) {
                            return "Input required";
                          }
                          return null;
                        },*/
                  onChanged: (val) {
                    value.notify();
                  },
                  contentPadding:
                      EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  border: Border.all(color: AppColorData.boxBorder),
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              actions: [
                CustomDivider(),
                SizedBox(
                  height: 10,
                ),
                CommonElevatedButton(
                  showLoader: true,
                  width: MediaQuery.of(context).size.width * 0.25,
                  elevatedButtonColor: (reason.text.isNotEmpty &&
                          AppValidators().validateReason(reason.text) == null)
                      ? AppColorData.blackButtonClr
                      : AppColorData.disableButtonClr,
                  onTap: () async {
                    if (reason.text.isNotEmpty &&
                        AppValidators().validateReason(reason.text) == null) {
                      isCancel = (await tripViewModel?.cancelTrip(
                              id: widget.data.bookingdata?.id ?? "",
                              reason: reason.text)) ??
                          false;
                      if (isCancel) {
                        SharedPreferences prefs =
                            await SharedPreferences.getInstance();
                        var token = prefs.getString(PrefConstant.authToken);
                        Get.toNamed(
                          RouterName.dashBoard,
                          arguments: {
                            RouterArguments.index: '2',
                            RouterArguments.token: token
                          },
                        );
                        /* Navigator.push(context,MaterialPageRoute(builder: (context) {
                        return DashBoard(index: 2,);
                      },
                      ),);*/
                      }
                    }
                  },
                  elevatedButtonName: tr("yes"),
                )
              ],
            );
          });
        });
  }
}

class TripCancelUtil {
  static Future<void> showTripCancelDialog({
    required BuildContext context,
    required String bookingId,
    required Future<void> Function() onHostSuccess,
}) async {
    TextEditingController reason = TextEditingController();
    GlobalKey<FormState> formKey = GlobalKey<FormState>();

    bool isCancel = false;

    await showDialog(
        context: context,
        barrierDismissible: false,
        traversalEdgeBehavior: TraversalEdgeBehavior.leaveFlutterView,
        useSafeArea: true,
        builder: (context){
          return Consumer<TripViewModel>(
              builder: (context, tripModel, child){
              return CommonAlertDialog(
                  titleWidget: Padding(
                    padding: const EdgeInsets.only(left: 10.0, top: 14.0, right: 14),
                    child: Row(
                      children: [
                        GestureDetector(
                          onTap: () {
                            Navigator.pop(context);
                          },
                          child: Icon(Icons.close, size: 16),
                        ),
                        SizedBox(width: 10),
                        CommonText(
                          text: "giveReasonToCancel",
                          style: AppTextStyle.bodyTextStyle,
                        ),
                      ],
                    ),
                  ),
                  contentWidget: Form(
                    key: formKey,
                    child: CommonTextFromField(
                      maxLines: 5,
                      hintText: tr("reason"),
                      controller: reason,
                      errorMessage: reason.text.isEmpty
                          ? ""
                          : AppValidators().validateReason(reason.text) ?? "",
                      onChanged: (val) {
                        tripModel.notify(); // Update UI on text change
                      },
                      contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      border: Border.all(color: AppColorData.boxBorder),
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  actions: [
                    CustomDivider(),
                    const SizedBox(height: 10),
                    CommonElevatedButton(
                        showLoader: true,
                        width: MediaQuery.of(context).size.width * 0.25,
                        elevatedButtonColor: (reason.text.isNotEmpty &&
                            AppValidators().validateReason(reason.text) == null)
                            ? AppColorData.blackButtonClr
                            : AppColorData.disableButtonClr,
                        elevatedButtonName: tr("yes"),
                        onTap: () async {
                          if (reason.text.isNotEmpty &&
                              AppValidators().validateReason(reason.text) == null) {
                            isCancel = (await tripModel.cancelTrip(
                            id: bookingId,
                            reason: reason.text)) ??
                          false;
                             if(isCancel) {
                              await onHostSuccess();
                             }
                          }
                        })
                  ]);
          });
        });
  }
}
