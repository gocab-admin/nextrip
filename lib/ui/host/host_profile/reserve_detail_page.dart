import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/host/host_reserve_response_model.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/utils/commonFunctions/app_common_functions.dart';
import 'package:airstar_flutter/viewModel/host/host_listing_view_model.dart';
import 'package:airstar_flutter/viewModel/user/common_viewmodel.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

import '../../../commonWidgets/widget/common_padding_alignment.dart';
import '../../../utils/components/color/app_color.dart';
import '../../../utils/constants/common_text.dart';
import '../../../utils/constants/strings.dart';
import '../../../utils/constants/textstyle.dart';
import '../../../utils/widgets/common_widgets.dart';
import '../../../viewModel/base_view_model/base_view_model.dart';
import '../../user/trips/trip_detail.dart';

class ReserveDetailPage extends StatefulWidget {
  final BookingHistory data;

  const ReserveDetailPage({super.key, required this.data});

  @override
  State<ReserveDetailPage> createState() => _ReserveDetailPageState();
}

class _ReserveDetailPageState extends State<ReserveDetailPage> {
  HostListingViewModel? hostListingViewModel;

  @override
  void initState() {
    hostListingViewModel =
        Provider.of<HostListingViewModel>(context, listen: false);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CommonAppBar(
        titleText:
            hostListingViewModel?.selectedReserveTitle ?? "requestHistory",
      ),
      body: Consumer2<HostListingViewModel, CommonViewModel>(
          builder: (context, value, commonModel, child) {
        return CommonPadding(
          child: Column(
            children: [
              Expanded(
                child: ListView(
                  children: [
                    _listingDetail(),
                    const SizedBox(height: 30),
                    _reserveDetailList(commonModel),
                  ],
                ),
              ),
              Align(
                alignment: Alignment.bottomCenter,
                child: _bottomButtons(value),
              )
            ],
          ),
        );
      }),
    );
  }

  Row _listingDetail() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 160,
          height: MediaQuery.of(context).size.height * 0.14,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: (widget.data.listingImages?.coverImage == null)
                ? ErrorImage()
                : CacheImageWidget(
                    errorBuilder: (context, url, error) {
                      return ErrorImage(
                        isSquare: true,
                      );
                    },
                    width: MediaQuery.of(context).size.width * 0.4,
                    imageUrl:widget.data.listingImages?.coverImage ?? "",
                    fit: BoxFit.fill,
                  ),
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
    );
  }

  Widget _reserveDetailList(CommonViewModel commonModel) {
    var apiDateFormat =
        commonModel.settingsResponseModel?.data?.hiddenSettings?.dateFormat;
    var data = widget.data.bookingdata;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CommonText(
          text: "yourBookingHistory",
          style: AppTextStyle.titleStyle,
        ),
        doubleSpacer(),
        buildPriceTile(
            prefixText: "bookedDates",
            suffixText: DateFormatterUtil.formatDateRange(
                data?.bookedDates?.start ?? '',
                data?.bookedDates?.end ?? '',
                apiDateFormat)),
        buildPriceTile(
            prefixText: "guestName",
            suffixText:
                '${widget.data.userFirstname?.capitalizeFirst} ${widget.data.userlastname ?? ''}'),
        buildPriceTile(
            prefixText: "hostAmount",
            currency: data?.currencySymbol,
            suffixText: '${data?.hostAmount ?? 0}'),
        buildPriceTile(
            prefixText: "commissionAmount",
            currency: data?.currencySymbol,
            suffixText: '${data?.commission ?? 0}'),
        if (data?.tax != null)
          buildPriceTile(
              prefixText: "tax",
              currency: data?.currencySymbol,
              suffixText: '${data?.tax ?? 0}'),
        buildPriceTile(
            prefixText: "paidAmount",
            currency: data?.currencySymbol,
            suffixText: '${data?.paidAmount ?? 0}'),
        buildPriceTile(
            prefixText: "paidOn",
            suffixText: DateFormatterUtil.formatDate(
                data?.paidDate ?? '', apiDateFormat)),
        buildPriceTile(
            prefixText: "paymentMode", suffixText: '${data?.paymentMode}'),
      ],
    );
  }

  Row _bottomButtons(HostListingViewModel value) {
    var bookingId = widget.data.bookingdata?.id ?? '';
    bool isBooked = value.selectedApprovalType == Strings.BOOKED;
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Flexible(
          child: CommonElevatedButton(
              isTextBtn: true,
              elevatedButtonName: "cancel",
              onTap: () {
                TripCancelUtil.showTripCancelDialog(
                    context: context,
                    bookingId: bookingId,
                    onHostSuccess: () async {
                      value.fetchBooking();
                      Get.back();
                    });
              }),
        ),
        Flexible(
          child: CommonElevatedButton(
              elevatedButtonName: isBooked ? "confirm" : "checkedOut",
              onTap: () => bookingConfirmDialog()),
        )
      ],
    );
  }

  Future<void> bookingConfirmDialog() {
    return showDialog(
        context: context,
        traversalEdgeBehavior: TraversalEdgeBehavior.leaveFlutterView,
        useSafeArea: true,
        builder: (context) {
          return Consumer<HostListingViewModel>(
              builder: (context, value, child) {
            var bookingId = widget.data.bookingdata?.id ?? '';
            return CommonAlertDialog(
                titleWidget: Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(
                          left: 10.0, top: 14.0, right: 14),
                      child: GestureDetector(
                        onTap: () {
                          Navigator.pop(context);
                        },
                        child: Icon(
                          Icons.close,
                          size: 16,
                        ),
                      ),
                    ),
                  ],
                ),
                contentWidget: Center(
                  child: CommonText(
                    textAlign: TextAlign.center,
                    text: "confirmThisBooking",
                    style: AppTextStyle.bodyTextStyle,
                  ),
                ),
                actions: [
                  CustomDivider(),
                  SizedBox(
                    height: 10,
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      CommonElevatedButton(
                          elevatedButtonColor: AppColorData.blackButtonClr,
                          showLoader: true,
                          width: MediaQuery.of(context).size.width * 0.15,
                          elevatedButtonName: "no",
                          onTap: () {}),
                      CommonElevatedButton(
                          showLoader: true,
                          isLoad: value.state == ViewState.secondaryLoader,
                          elevatedButtonColor: AppColorData.blackButtonClr,
                          width: MediaQuery.of(context).size.width * 0.18,
                          elevatedButtonName: "yes",
                          onTap: () {
                            final reserveType =
                                value.selectedApprovalType == Strings.BOOKED
                                    ? 'confirm'
                                    : 'complete';

                            value
                                .confirmBooking(bookingId, reserveType)
                                .then((val) {
                              if (val == true) {
                                value.fetchBooking();
                                Get.close(2);
                              }
                            });
                          }),
                    ],
                  ),
                ]);
          });
        });
  }
}

Widget buildPriceTile({
  required String prefixText,
  required String suffixText,
  final String? currency,
}) {
  return ListTile(
    contentPadding: EdgeInsets.zero,
    title: CommonText(
      text: prefixText,
      style: AppTextStyle.bodyTextStyle.copyWith(
          fontWeight: FontWeight.w400, color: AppColorData.subBodyTextClr),
    ),
    trailing: CommonText(
      text: '${currency ?? ''}$suffixText',
      style: AppTextStyle.bodyTextStyle.copyWith(
          fontWeight: FontWeight.w400, color: AppColorData.subBodyTextClr),
    ),
  );
}
