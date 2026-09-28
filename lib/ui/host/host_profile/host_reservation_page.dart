import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/routes/router_name.dart';
import 'package:airstar_flutter/ui/host/bottom_bar_screens/subwidgets/switch_button_widgets.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/utils/commonFunctions/app_common_functions.dart';
import 'package:airstar_flutter/utils/components/color/app_color.dart';
import 'package:airstar_flutter/utils/constants/constants.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

import '../../../commonWidgets/widget/common_padding_alignment.dart';
import '../../../viewModel/view_model.dart';


class HostReservationPage extends StatefulWidget {
  const HostReservationPage({super.key});

  @override
  State<HostReservationPage> createState() => _HostReservationPageState();
}

class _HostReservationPageState extends State<HostReservationPage> {
  HostListingViewModel? hostListingViewModel;
  CommonViewModel? commonViewModel;

  @override
  void initState() {
     hostListingViewModel = Provider.of<HostListingViewModel>(context, listen: false);
     commonViewModel = Provider.of<CommonViewModel>(context, listen: false);
     WidgetsBinding.instance.addPostFrameCallback((_){
        hostListingViewModel?.setDefaultReserveTitle();
       hostListingViewModel?.fetchBooking(reserveTitle: hostListingViewModel?.selectedReserveType);
     });
    super.initState();
  }


  @override
  Widget build(BuildContext context) {
    return  Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            expandedHeight: 110,
            flexibleSpace: CommonSliverAppBar(
              title: "reservations",
              bottomPosition: 6,
            ),
          ),
          SliverList(delegate: SliverChildListDelegate([
            _renderBody(),
          ]))

        ],
      ),
    );
  }

  Widget _renderBody() {
    return CommonPadding(
        child: Consumer<HostListingViewModel>(
          builder: (context, value, child) {
            return Column(
              children: [
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    spacing: 14,
                    children: List.generate(value.reserveList.length, (index){
                      var reserveTitle = value.reserveList[index];
                      return CommonOptionCardWidget(
                        onTap: () {
                          value.setReserveTitle(reserveTitle);
                        },
                          isSelected: value.selectedReserveTitle == reserveTitle,
                          title: reserveTitle);
                    }),
                  ),
                ),
                if(value.selectedReserveTitle == "requestHistory")
                  _buildApprovalList(value),
                const SizedBox(height: 40),
                _reserveList(value),
              ],
            );
          }
        ));
  }

  Row _buildApprovalList(HostListingViewModel value) {
    return Row(
      children: List.generate(value.approvalList.length, (index) {
        var approvalType = value.approvalList[index];
        return GestureDetector(
          onTap: () {
            value.selectApprovalType(approvalType);
            value.fetchBooking();
          },
          child: Container(
            margin: EdgeInsets.only(top: 20),
            padding: EdgeInsets.symmetric(horizontal: 18.0, vertical: 12.0),
            decoration: BoxDecoration(
                border: Border(
                    bottom: BorderSide(
                        color: value.selectedApprovalType == approvalType
                            ? AppColorData.appPrimaryColor
                            : AppColorData.transparent,
                        width: 4))),
            child: CommonText(
                text: approvalType,
                style: AppTextStyle.bodyTextStyle),
          ),
        );
      }),
    );
  }

  Widget _reserveList(HostListingViewModel value) {
    var bookingList = value.hostReserveResponseModel?.data?.allBookingHistory;

    var apiDateFormat = commonViewModel?.settingsResponseModel?.data
        ?.hiddenSettings?.dateFormat;

    if (bookingList == null || bookingList.isEmpty) {
      return _buildEmptyListingCard();
    }

    return ListView.builder(
      padding: EdgeInsets.zero,
      shrinkWrap: true,
      physics: NeverScrollableScrollPhysics(),
      itemCount: bookingList.length ?? 0,
        itemBuilder: (context, index) {
        var data = bookingList[index];
          return GestureDetector(
            onTap: (){
              Get.toNamed(RouterName.reserveDetailPage,
               arguments: {
                RouterArguments.data: data,
               });
            },
            child: Container(
              height: 120,
              width: double.maxFinite,
              margin: EdgeInsets.only(bottom: 20.0),
              decoration: BoxDecoration(
                color: AppColorData.whiteClr,
                borderRadius: BorderRadius.circular(5),
                boxShadow: commonBoxShadows(),
                 border: Border.all(color: AppColorData.dividerColor, width: 1)
              ),
              child: Row(
                children: [
                  SizedBox(
                    width: 120,
                    height: double.maxFinite,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(5),
                      child: data.listingImages?.coverImage == null ? ErrorImage() : CacheImageWidget(
                        fit: BoxFit.cover,
                          errorBuilder: (context, url, error){
                          return ErrorImage(isSquare: true);
                          },
                          imageUrl: data.listingImages?.coverImage ?? ""),
                    ),
                  ),
                  Expanded(
                      child: Padding(padding: const EdgeInsets.all(8.0),
                        child: Column(
                          spacing: 10,
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            CommonText(text: data.propertyName?.trim() ?? '',
                            style:  AppTextStyle.headerStyle,),
                            CommonText(
                              text: '${tr("bookedBy")}${data.userFirstname?.capitalizeFirst}',
                              style: AppTextStyle.bodyTextStyle,
                            ),
                            CommonText(
                              text: DateFormatterUtil.formatDateRange(data.bookingdata?.bookedDates?.start ?? '', data.bookingdata?.bookedDates?.end ?? '', apiDateFormat),
                            )
                          ],
                        ),
                      ))
                ],
              ),
            ),
          );
        });
  }

  Widget _buildEmptyListingCard() {
    return Container(
      margin: EdgeInsets.only(top: 50.0),
      padding: EdgeInsets.all(34.0),
      decoration: BoxDecoration(
          border: Border.all(color: AppColorData.boxBorder),
        borderRadius: BorderRadius.circular(6)
      ), // Give it some height to be visible
      alignment: Alignment.center,
      child: Column(
        spacing: 10,
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          CommonText(
            textAlign: TextAlign.center,
            text: "noDataFound",
            style: AppTextStyle.titleStyle.copyWith(
                color: AppColorData.subBodyTextHighlightClr),
          ),
          CommonText(
            textAlign: TextAlign.center,
            text: "noBookingSub",
            style: AppTextStyle.subBodyHintTextStyle,
          )
        ],
      ),
    );
  }
}
