import 'dart:async';

import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/user/user_response_model.dart';
import 'package:airstar_flutter/ui/user/Profile/profile_view_loader.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/user/common_viewmodel.dart';
import 'package:airstar_flutter/viewModel/user/listing_view_model.dart';
import 'package:airstar_flutter/viewModel/user/notification_view_model.dart';
import 'package:airstar_flutter/viewModel/user/profile_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:get/route_manager.dart';
import 'package:provider/provider.dart';

import '../../../routes/routes.dart';
import '../../../viewModel/user/login_view_model.dart';
import '../../host/bottom_bar_screens/subwidgets/switch_button_widgets.dart'
    show SwitchUserModeButton;

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  EditProfileViewModel? editProfileViewModel;
  CommonViewModel? commonViewModel;
  ProductListingViewModel? productListingViewModel;

  @override
  void initState() {
    super.initState();
    editProfileViewModel = Provider.of<EditProfileViewModel>(
      context,
      listen: false,
    );
    commonViewModel = Provider.of<CommonViewModel>(context, listen: false);
    productListingViewModel = Provider.of<ProductListingViewModel>(
      context,
      listen: false,
    );
    editProfileViewModel?.fetchVersionNumber();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: NestedScrollView(
        headerSliverBuilder: (context, bool innerBoxIsScrolled) {
          return [
            SliverAppBar(
              pinned: true,
              expandedHeight: 115,
              actions: [
                Consumer<NotificationViewModel>(
                  builder: (context, value, child) {
                    int notifications =
                        value
                            .notificationResponseModel
                            ?.data
                            ?.notifications
                            ?.length ??
                        0;
                    return Padding(
                      padding: const EdgeInsets.only(right: 18.0),
                      child: GestureDetector(
                        onTap: () {
                          Get.toNamed(RouterName.notificationScreen);
                        },
                        child: Stack(
                          children: [
                            Icon(Icons.notifications_none_rounded, size: 25),
                            if (notifications > 0)
                              CircleAvatar(
                                radius: 7,
                                child: Center(
                                  child: Text(
                                    notifications.toString(),
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 10,
                                    ),
                                  ),
                                ),
                                backgroundColor: AppColorData.appPrimaryColor,
                              ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ],
              flexibleSpace: CommonSliverAppBar(
                isBackArrowPresent: false,
                bottomPosition: 6,
                title: "profile",
              ),
            ),
          ];
        },
        body: Consumer2<EditProfileViewModel, LoginViewModel>(
          builder: (context, viewModel, loginValue, child) {
            return _renderBody(viewModel, loginValue);
          },
        ),
      ),
      //  ),
    );
  }

  Widget _renderBody(
    EditProfileViewModel viewModel,
    LoginViewModel loginValue,
  ) {
    var userListings = viewModel.userResponseModel?.totalCount;
    return Stack(
      children: [
        Padding(
          padding: horizontalPadding(vertical: 0.0),
          child: ListView(
            physics: AlwaysScrollableScrollPhysics(),
            children: [
              ProfileCard(),
              spacer(),
              CommonText(text: "settings", style: AppTextStyle.headingStyle),
              spacer(),
              SettingsList(from: "user"),
              spacer(),
              CommonText(text: "legal", style: AppTextStyle.headingStyle),
              spacer(),
              LegalLists(),
              spacer(),
              LogoutWidget(),
              SizedBox(height: 30),
            ],
          ),
        ),
        SwitchUserModeButton(
          text: userListings == 0 ? "becomeHost" : "switchHost",
          onTap: () async {
            productListingViewModel?.clearFilters();
             viewModel.updateUserMode(userMode: "host");
            if (userListings == 0) {
              Get.offAllNamed(RouterName.getSteps);
            } else {
              Get.offAllNamed(RouterName.hostDashboard);
            }
          },
        ),
        // Align(
        //   alignment: Alignment.bottomCenter,
        //   child: Padding(
        //     padding: const EdgeInsets.only(bottom: 14.0),
        //     child: InkWell(
        //       onTap: () async {
        //         viewModel.updateUserMode(userMode: "host");
        //         if (userListings == 0) {
        //           Get.offAllNamed(RouterName.getSteps);
        //         } else {
        //           Get.offAllNamed(RouterName.hostDashboard);
        //         }
        //         //  Navigator.push(context, MaterialPageRoute(builder: (context)=> CommonWebPageWidget(url: EndPointConstants.linkShareUrl, appBarTitle: "appBarTitle", showAppBar: false,)));
        //       },
        //       child: Container(
        //         padding: const EdgeInsets.symmetric(
        //           horizontal: 14.0,
        //           vertical: 14.0,
        //         ),
        //         decoration: BoxDecoration(
        //           borderRadius: BorderRadius.circular(55),
        //           color: AppColorData.blackBorderClr,
        //         ),
        //         child: Row(
        //           spacing: 4,
        //           mainAxisSize: MainAxisSize.min,
        //           children: [
        //             Icon(Icons.sync, color: AppColorData.whiteClr, size: 20),
        //             CommonText(
        //               text: userListings == 0 ? "becomeHost" : "switchHost",
        //               style: AppTextStyle.bodyTextStyle.copyWith(
        //                 color: AppColorData.whiteClr,
        //               ),
        //             ),
        //           ],
        //         ),
        //       ),
        //     ),
        //   ),
        // ),
      ],
    );
  }

  Widget profileHead() {
    return Container(
      color: AppColorData.transparent,
      padding: EdgeInsets.only(bottom: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          CommonText(text: "profile", style: AppTextStyle.loginHeadingStyle),
          Consumer<NotificationViewModel>(
            builder: (context, value, child) {
              int notifications =
                  value
                      .notificationResponseModel
                      ?.data
                      ?.notifications
                      ?.length ??
                  0;
              return GestureDetector(
                onTap: () {
                  Get.toNamed(RouterName.notificationScreen);
                },
                child: Stack(
                  children: [
                    Icon(Icons.notifications_none_rounded, size: 25),
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
                      ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget spacer() {
    return SizedBox(height: 20);
  }
}

class ProfileCard extends StatelessWidget {
  const ProfileCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<EditProfileViewModel>(
      builder: (context, value, child) {
        if (value.state == ViewState.busy) {
          return ProfileViewScreenLoader(isProfileMainScreenLoader: true);
        }
        var data = value.userResponseModel?.data?.userDetail;
        return GestureDetector(
          onTap: () {
            if (value.userResponseModel != null) {
              Get.toNamed(
                RouterName.profileViewScreen,
                arguments: {
                  RouterArguments.userModel: value.userResponseModel!,
                },
              );
            } else {
              // Show error or fallback UI
              print("User data not loaded. Please try again.");
            }
          },
          child: ListTileWidget(
            leadingWidget: ClipRRect(
              borderRadius: BorderRadius.circular(100),
              child: SizedBox(
                width: 50,
                height: 50,
                child: CacheImageWidget(
                  imageUrl: '${data?.profileImage ?? ""}',
                  fit: BoxFit.cover,
                  errorBuilder: (context, url, error) {
                    return ErrorImage();
                  },
                ),
              ),
            ),
            titleText: /*(data?.firstname != null && data?.lastname !=null)?"${data?.fullname}":*/
                "${data?.firstname} ${data?.lastname}",
            titleTextStyle: AppTextStyle.headerStyle,
            subTitle: 'showProfile'.tr(),
            subTitleTextStyle: AppTextStyle.subBodyStyle.copyWith(
              fontWeight: FontWeight.w400,
            ),
            trailingIcon: Icons.arrow_forward_ios,
            showDivider: true,
          ),
        );
      },
    );
  }
}

class SettingsList extends StatelessWidget {
  final String from;
  const SettingsList({super.key, required this.from});

  @override
  Widget build(BuildContext context) {
    return Consumer2<EditProfileViewModel, CommonViewModel>(
      builder: (context, value, commonModel, child) {
        var mode =
            commonModel.settingsResponseModel?.data?.hiddenSettings?.mode;

        List<SettingsDetails> filteredSettings = value.settingsDetails
            .where(
              (setting) => !(mode == "1" && setting.data == "loginAndSecurity"),
            )
            .toList();
        return Container(
          width: MediaQuery.of(context).size.width,
          child: ListView.builder(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            itemCount: filteredSettings.length,
            itemBuilder: (context, index) {
              return ListTileWidget(
                onTap: () {
                  _navigateToScreen(
                    filteredSettings[index].data,
                    value.userResponseModel,
                    commonModel,
                    from,
                  );
                  // Navigator.push(context, MaterialPageRoute(builder: (context) => settingsDetails[index].page!));
                },
                leadingIconSVG: filteredSettings[index].icon,
                titleText: filteredSettings[index].data.tr(),
                titleTextStyle: AppTextStyle.bodyTextStyle,
                trailingIcon: Icons.arrow_forward_ios,
              );
            },
          ),
        );
      },
    );
  }
}

class LegalLists extends StatelessWidget {
  const LegalLists({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer2<EditProfileViewModel, CommonViewModel>(
      builder: (context, value, commonModel, child) {
        var mode =
            commonModel.settingsResponseModel?.data?.hiddenSettings?.mode;
        List<LegalDetails> filteredLegalDetails = value.legalDetails
            .where(
              (legalData) =>
                  !(mode == "1" && legalData.data1 == "deleteAccount"),
            )
            .toList();
        return Container(
          width: MediaQuery.of(context).size.width,
          color: AppColorData.transparent,
          child: ListView.builder(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            itemCount: filteredLegalDetails.length,
            itemBuilder: (context, index) {
              return ListTileWidget(
                leadingIconSVG: filteredLegalDetails[index].icon1,
                titleTextStyle: AppTextStyle.bodyTextStyle.copyWith(
                  color: filteredLegalDetails[index].id1 == 2
                      ? AppColorData.errorColor
                      : null,
                ),
                titleText: filteredLegalDetails[index].data1,
                trailingIcon: Icons.arrow_forward_ios,
                onTap: () {
                  if (filteredLegalDetails[index].id1 == 2) {
                    _dltAccDialog(context, value);
                  } else {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => CommonWebPageWidget(
                          url: (filteredLegalDetails[index].id1 == 0)
                              ? EndPointConstants.termsServiceUrl
                              : EndPointConstants.privacyUrl,
                          appBarTitle: "",
                        ),
                      ),
                    );
                  }
                },
              );
            },
          ),
        );
      },
    );
  }

  Future _dltAccDialog(BuildContext context, EditProfileViewModel value) {
    return showDialog(
      context: context,
      barrierDismissible: false,
      traversalEdgeBehavior: TraversalEdgeBehavior.leaveFlutterView,
      builder: (context) {
        return CommonAlertDialog(
          titleWidget: Padding(
            padding: const EdgeInsets.only(left: 10.0, top: 14.0),
            child: Align(
              alignment: Alignment.topLeft,
              child: GestureDetector(
                onTap: () {
                  Navigator.pop(context);
                },
                child: Icon(Icons.close, size: 16),
              ),
            ),
          ),
          contentWidget: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [CommonText(text: "dltDialog")],
          ),
          actions: [
            divider(),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                CommonElevatedButton(
                  isTextBtn: true,
                  width: MediaQuery.of(context).size.width * 0.25,
                  onTap: () {
                    Navigator.pop(context);
                  },
                  elevatedButtonName: "no",
                ),
                CommonElevatedButton(
                  width: MediaQuery.of(context).size.width * 0.25,
                  showLoader: true,
                  onTap: () {
                    //logout();
                    value.deleteAccount().then((val) {
                      if (val == true) {
                        value.logout();
                      }
                    });
                  },
                  elevatedButtonColor: AppColorData.blackButtonClr,
                  elevatedButtonName: tr("yes"),
                ),
                // )
              ],
            ),
          ],
        );
      },
    );
  }
}

class LogoutWidget extends StatelessWidget {
  const LogoutWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<EditProfileViewModel>(
      builder: (context, value, child) {
        return Column(
          spacing: 20,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            GestureDetector(
              onTap: () {
                _logOutDialog(context, value);
              },
              child: CommonText(
                isUnderline: true,
                text: tr("logOut"),
                style: AppTextStyle.headerStyle,
              ),
            ),
            CommonText(
              text: "${tr("Version")} ${value.versionNumber}",
              style: AppTextStyle.subBodyStyle,
            ),
          ],
        );
      },
    );
  }

  Future _logOutDialog(BuildContext context, EditProfileViewModel value) {
    return showDialog(
      context: context,
      barrierDismissible: false,
      traversalEdgeBehavior: TraversalEdgeBehavior.leaveFlutterView,
      builder: (context) {
        return CommonAlertDialog(
          titleWidget: Padding(
            padding: const EdgeInsets.only(left: 10.0, top: 14.0),
            child: Align(
              alignment: Alignment.topLeft,
              child: GestureDetector(
                onTap: () {
                  Navigator.pop(context);
                },
                child: Icon(Icons.close, size: 16),
              ),
            ),
          ),
          contentWidget: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [CommonText(text: "areYouSure")],
          ),
          actions: [
            divider(),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                CommonElevatedButton(
                  isTextBtn: true,
                  width: MediaQuery.of(context).size.width * 0.25,
                  onTap: () {
                    Navigator.pop(context);
                  },
                  elevatedButtonName: "cancel",
                ),
                CommonElevatedButton(
                  width: MediaQuery.of(context).size.width * 0.25,
                  onTap: () {
                    value.logoutAccount().then((val) {
                      if (val == true) {
                        value.logout();
                      }
                    });
                  },
                  elevatedButtonColor: AppColorData.blackButtonClr,
                  elevatedButtonName: tr("logOut"),
                ),
                // )
              ],
            ),
          ],
        );
      },
    );
  }
}

void _navigateToScreen(
  String screenName,
  UserResponseModel? details,
  CommonViewModel commonModel,
  String? from,
) {
  var mode = commonModel.settingsResponseModel?.data?.hiddenSettings?.mode;
  switch (screenName) {
    case "personalInformation":
      Get.toNamed(
        RouterName.personalInfoScreen,
        arguments: {RouterArguments.userModel: details!},
      );
      break;
    case "loginAndSecurity":
      if (mode == "0") {
        Get.toNamed(
          RouterName.loginAndSecurityScreen,
          arguments: {RouterArguments.userModel: details},
        );
      }
      break;
    case "translation":
      Get.toNamed(RouterName.selectLanguageScreen);
      break;
    case "currency":
      Get.toNamed(
        RouterName.currencyScreen,
        arguments: {RouterArguments.from: from},
      );
    case "notification":
      Get.toNamed(RouterName.notificationScreen);
    default:
      break;
  }
}

class SettingsDetails {
  const SettingsDetails({
    required this.id,
    required this.icon,
    required this.data,
    this.page,
  });
  final int id;
  final String icon;
  final String data;
  final Widget? page;
}

class LegalDetails {
  const LegalDetails({
    required this.id1,
    required this.icon1,
    required this.data1,
  });
  final int id1;
  final String icon1;
  final String data1;
}

class ProfileDetails {
  const ProfileDetails({
    required this.id,
    required this.data,
    required this.icon,
  });
  final int id;
  final String data;
  final IconData icon;
}
