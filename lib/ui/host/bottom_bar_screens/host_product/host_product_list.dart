import 'package:airstar_flutter/commonWidgets/button_widgets/button_widget.dart';
import 'package:airstar_flutter/ui/host/bottom_bar_screens/subwidgets/switch_button_widgets.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/utils/constants/constants.dart';
import 'package:airstar_flutter/viewModel/view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

import '../../../../commonWidgets/widget/common_padding_alignment.dart';
import '../../../../routes/router_name.dart';
import '../../../../utils/components/color/app_color.dart';

class HostProductList extends StatefulWidget {
  final String? token;
  const HostProductList({super.key, this.token});

  @override
  State<HostProductList> createState() => _HostProductListState();
}

class _HostProductListState extends State<HostProductList> {
  EditProfileViewModel? editProfileViewModel;
  NotificationViewModel? notificationViewModel;
  HostListingViewModel? hostListingViewModel;

  @override
  void initState() {
    editProfileViewModel = Provider.of<EditProfileViewModel>(context, listen: false);
    notificationViewModel = Provider.of<NotificationViewModel>(context, listen: false);
    hostListingViewModel = Provider.of<HostListingViewModel>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((val) {
      if (widget.token != null && widget.token!.isNotEmpty) {
        editProfileViewModel!.fetchUserProfile(successRes: (){ notificationViewModel!.fetchNotification();});
      }
        hostListingViewModel?.fetchTodayMenu();
      hostListingViewModel?.fetchUsersListing(/*list: "incomplete"*/);
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: () async {
        hostListingViewModel?.fetchUsersListing(list: "incomplete");
      },
      child: CommonPadding(
        child: Consumer2<EditProfileViewModel, HostListingViewModel>(
          builder: (context, editModel, value, child) {
            var profile = editModel.userResponseModel?.data?.userDetail;
            return Column(
              spacing: 20,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                 _notificationHeaderTile(),
                CommonText(
                  text: "${tr("welcome")}, ${profile?.firstname ?? ''}!",
                  style: AppTextStyle.loginHeadingStyle,
                ),
                _pendingListings(),
                _reservationLists(value)

              ],
            );
          }
        ),
      ),
    );
  }

  ListTile _notificationHeaderTile() {
    return  ListTile(
      contentPadding: EdgeInsets.zero,
      trailing: Consumer<NotificationViewModel>(
        builder: (context, value, child) {
          int notifications = value
              .notificationResponseModel?.data?.notifications?.length ??
              0;
          return Padding(
            padding: const EdgeInsets.only(right: 18.0),
            child: GestureDetector(
              onTap: () {
                Get.toNamed(RouterName.notificationScreen,);
              },
              child: Stack(
                children: [
                  Icon(
                    Icons.notifications_none_rounded,
                    size: 25,
                  ),
                  if (notifications > 0)
                    CircleAvatar(
                      radius: 7,
                      child: Center(
                        child: Text(
                          notifications.toString(),
                          style: TextStyle(color: Colors.white, fontSize: 10),
                        ),
                      ),
                      backgroundColor: AppColorData.appPrimaryColor,
                    )
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _pendingListings() {
    return Consumer<HostListingViewModel>(
      builder: (context, value,child) {
        var listing = value.userListingsResponseModel?.data?.providerListings;
        
        var pendingListings = listing?.where((list) => list.status  == "pending").toList();

        return Column(
          spacing: 20,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CommonText(
              text: "listing",
              style: AppTextStyle.headingStyle,
            ),
            if (pendingListings == null || pendingListings.isEmpty)
              Center(
                child: CommonText(
                  text: "noDataFound",
                  style: AppTextStyle.bodyTextStyle,
                ),
              )
            else
            ConstrainedBox(
              constraints: BoxConstraints(
                maxHeight: 170,
                minHeight: 160,
              ),
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                shrinkWrap: true,
                  itemCount: pendingListings.length ?? 0,
                  itemBuilder: (context, index) {
                  var data = pendingListings[index];

                    return Container(
                      width: MediaQuery.of(context).size.width - 40,
                      margin: EdgeInsets.only(right: 14.0),
                      padding: EdgeInsets.all(14.0),
                      decoration: BoxDecoration(
                        border: Border.all(color: AppColorData.boxBorder),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                       // mainAxisSize: MainAxisSize.max,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Flexible(
                            child: Column(
                              spacing: 4,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                CommonText(
                                  text: "confirmImportantDetails",
                                  style: AppTextStyle.bodyTextStyle,
                                ),
                                CommonText(
                                  text: "requiredToPublish",
                                style: AppTextStyle.subBodyHintTextStyle,
                                ),
                                CommonText(
                                  text: data.propertyName?.capitalizeFirst,
                                  style: AppTextStyle.headerStyle,
                                ),
                                CommonElevatedButton(
                                  isTextBtn: true,
                                    elevatedButtonName: "publish",
                                    onTap: (){
                                      value.publishListing(data.id ?? '').then((val){
                                          if(val == true) {
                                            value.fetchUsersListing();
                                          }
                                        });
                                    })
                              ],
                            ),
                          ),
                          Icon(Icons.error_outline_outlined,size: 30,
                            color: AppColorData.deactivateButtonClr,)
                        ],
                      ),
                    );
                  }),
            ),
          ],
        );
      }
    );
  }

  Widget _reservationLists(HostListingViewModel value) {
    var reservation = value.todayMenuResponseModel?.data?.reservation;
     var getTotalCount = (reservation?.checkingOut ?? 0) + (reservation?.arrivingSoon?? 0);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CommonText(
          text: "yourReservations",
          style: AppTextStyle.headingStyle,
        ),
        CommonElevatedButton(
            isTextBtn: true,
            elevatedButtonName: "${tr("allReservations")} (${getTotalCount})",
            onTap: (){

            }),
        spacer(),
        Row(
          spacing: 14,
          children: [
            Flexible(
              flex: 2,
                child: CommonOptionCardWidget(title: "${tr("checkingOut")} (${reservation?.checkingOut ?? 0})")),
            Flexible(
              flex: 2,
                child: CommonOptionCardWidget(title: "${tr("arrivingSoon")} (${reservation?.arrivingSoon ?? 0})")),
          ],

        )
      ],
    );
  }
}
