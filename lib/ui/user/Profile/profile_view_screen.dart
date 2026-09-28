import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/user/user_response_model.dart';
import 'package:airstar_flutter/ui/user/Profile/edit_profile.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/user/profile_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';

class ProfileViewScreen extends StatefulWidget {
  final UserResponseModel userModel;
  const ProfileViewScreen({super.key, required this.userModel});

  @override
  State<ProfileViewScreen> createState() => _ProfileViewScreenState();
}

class _ProfileViewScreenState extends State<ProfileViewScreen> {
  EditProfileViewModel? editProfileViewModel;
  @override
  void initState() {
    editProfileViewModel =
        Provider.of<EditProfileViewModel>(context, listen: false);
    editProfileViewModel!.addProfileList();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColorData.appSecondaryColor,
      appBar: CommonAppBar(
        actions: [
          Padding(
            padding: EdgeInsets.only(right: 20).toLTRAware(context),
            child: CommonElevatedButton(
              isTextBtn: true,
              onTap: () {
                showCustomModalBottomSheet(
                    backgroundColor: AppColorData.appSecondaryColor,
                    title: "editProfile",
                    context: context,
                    builder: (context) {
                      return EditProfile(
                        userModel: widget.userModel,
                      );
                    });
              },
              elevatedButtonName: "edit",
            ),
          ),
        ],
      ),
      body: Consumer<EditProfileViewModel>(builder: (context, value, child) {
        return _renderBody(
            value.userResponseModel?.data?.userDetail ??
                widget.userModel.data?.userDetail,
            value);
      }),
    );
  }

  Widget _renderBody(UserDetail? model, EditProfileViewModel viewModel) {
    bool hasUserData =
        viewModel.profileList.any((e) => e.controller.text.isNotEmpty);
    return SingleChildScrollView(
      child: Padding(
        padding: horizontalPadding(vertical: 14.0),
        child: Column(
          children: [
            Padding(
                padding: EdgeInsets.only(
                    bottom: MediaQuery.of(context).size.width > 600 ? 0 : 20),
                child: _profileCard(model)),
            userDetails(model),
            hasUserData ? CustomDivider() : SizedBox.shrink(),
            doubleSpacer(),
            // doubleSpacer(),
            _confirmation(model),

            if (!hasUserData) itsTimeToCreate(model)
          ],
        ),
      ),
    );
  }

  Widget _profileCard(UserDetail? model) {
    return Container(
      padding: EdgeInsets.all(10),
      height: 200,
      width: MediaQuery.of(context).size.width > 600 ? 310 : null,
      decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          color: AppColorData.appSecondaryColor,
          boxShadow: commonBoxShadows()),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            // crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(100),
                child: SizedBox(
                  width: 80,
                  height: 80,
                  child: CacheImageWidget(
                    fit: BoxFit.cover,
                    imageUrl:
                        //  checkGoogleImageUrl(model?.profileImage ?? ""),
                        model?.profileImage ?? "",
                  ),
                ),
              ),
              SizedBox(
                height: 5,
              ),
              CommonText(
                text: (model!.firstname!.isNotEmpty)
                    ? model.firstname
                    : model.fullname ?? '',
                style: AppTextStyle.titleStyle,
              ),
              CommonText(
                text: "guest",
                style: AppTextStyle.bodyTextStyle
                    .copyWith(fontWeight: FontWeight.w400),
              ),
            ],
          ),
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CommonText(
                text: editProfileViewModel!
                    .calculateHostingPeriod(model.verifiedDate!)
                    .toString(),
                style: AppTextStyle.titleStyle,
              ),
              CommonText(
                text: "monthOnAirstar",
                style: AppTextStyle.bodyTextStyle
                    .copyWith(fontWeight: FontWeight.w400),
              ),
            ],
          )
        ],
      ),
      // ),
    );
  }

  Widget _confirmation(UserDetail? model) {
    return Container(
      width: MediaQuery.of(context).size.width > 600 ? 310 : null,
      padding:
          MediaQuery.of(context).size.width > 600 ? EdgeInsets.all(10) : null,
      decoration: MediaQuery.of(context).size.width > 600
          ? BoxDecoration(
              border: Border.all(color: AppColorData.boxBorder),
              borderRadius: BorderRadius.circular(10),
            )
          : null,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          CommonText(
            text: "${model?.firstname}${tr("userNameConfirmed")}",
            style: AppTextStyle.headingStyle,
          ),
          ListTile(
            contentPadding: EdgeInsets.zero,
            leading: Icon(
              Icons.check,
              color: AppColorData.appIconBlack,
              size: 26,
            ),
            title: CommonText(
              text: "phoneNumber",
              style: AppTextStyle.bodyTextStyle,
            ),
          ),
        ],
      ),
    );
  }

  itsTimeToCreate(UserDetail? model) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CustomDivider(),
        doubleSpacer(),
        CommonText(
          text: "itsTimeToCreate",
          style: AppTextStyle.titleStyle,
        ),
        doubleSpacer(),
        CommonText(
          text: "createYourProfileSub",
          //  style: AppTextStyle.bodyHintTextStyle,
          style: AppTextStyle.bodyTextStyle.copyWith(
              fontWeight: FontWeight.w100,
              color: AppColorData.subBodyTextClr,
              fontSize: 15),
        ),
        SizedBox(
          height: 25,
        ),
        CommonElevatedButton(
            elevatedButtonName: "createProfile",
            elevatedButtonColor: AppColorData.appPrimaryColor,
            onTap: () {
              showCustomModalBottomSheet(
                  backgroundColor: AppColorData.appSecondaryColor,
                  title: "edit",
                  context: context,
                  builder: (context) {
                    return EditProfile(userModel: widget.userModel);
                  });
            }),
      ],
    );
  }

  userDetails(UserDetail? model) {
    return Consumer<EditProfileViewModel>(builder: (context, value, child) {
      return Container(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Visibility(
                visible: MediaQuery.of(context).size.width > 600 ? true : false,
                child: CommonText(
                  text: "aboutMe",
                  style: AppTextStyle.titleStyle,
                )),
            ListView.builder(
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                itemCount: value.profileList.length,
                itemBuilder: (context, index) {
                  return Visibility(
                    visible: value.profileList[index].controller.text.isNotEmpty
                        ? true
                        : false,
                    child: ListTile(
                      visualDensity: VisualDensity(horizontal: -2),
                      contentPadding: EdgeInsets.zero,
                      leading: Container(
                          child: SvgPicture.asset(
                        value.profileList[index].icon,
                        height: 20,
                        width: 20,
                      )),
                      title: CommonText(
                        text:
                            "${value.profileList[index].info.tr()}${value.profileList[index].controller.text.isNotEmpty ? ': ${value.profileList[index].controller.text}' : ''}",
                      ),
                    ),
                  );
                }),
          ],
        ),
      );
    });
  }

  listTileWidget() {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: Icon(
        Icons.check,
        color: AppColorData.appIconBlack,
        size: 26,
      ),
      title: CommonText(
        text: "phoneNumber",
        style: AppTextStyle.headerStyle.copyWith(fontWeight: FontWeight.w300),
      ),
    );
  }
}
