import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:get/route_manager.dart';
import 'package:airstar_flutter/utils/utils.dart';
import '../../../routes/routes.dart';
import '../login_and_signup/login_screen.dart';
import 'Profile_main_Screen.dart';

class ProfileLoginPage extends StatefulWidget {
  const ProfileLoginPage({super.key});

  @override
  State<ProfileLoginPage> createState() => _ProfileLoginPageState();
}

class _ProfileLoginPageState extends State<ProfileLoginPage> {
  List<ProfileDetails> loggedOutLists = [
    ProfileDetails(id: 0, data: "settings", icon: Icons.settings),
    ProfileDetails(
        id: 1,
        data: "accessibility",
        icon: Icons.settings_applications_outlined),
    ProfileDetails(
        id: 2, data:"learnAboutHousting", icon: Icons.house_siding),
    ProfileDetails(
        id: 3, data:"getHelp", icon: Icons.help_outline_sharp),
  ];

  List<LegalDetails> legalDetails = [
    LegalDetails(
        id1: 0, icon1: SVGAssets.profile_icon12, data1: "termsOfService"),
    LegalDetails(
        id1: 1,
        icon1: SVGAssets.profile_icon12,
        data1:"privacyPolicy"), /*LegalDetails(
        id1: 2,
        icon1: Icons.privacy_tip_outlined,
        data1: Strings.openSourceLicenses),*/
  ];

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        child: Padding(
          padding: horizontalPadding(vertical: 14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                height: 30,
              ),
              CommonText(
                  text: "yourProfile",
                  style: AppTextStyle.loginHeadingStyle),
              // SizedBox(height: 100,),
              doubleSpacer(),
              CommonText(
                text: "loginToStart",
                style: AppTextStyle.headerStyle
                    .copyWith(fontWeight: FontWeight.w300),
              ),
              doubleSpacer(),
              //doubleSpacer(),
              CommonElevatedButton(
                  elevatedButtonName:"login",
                  elevatedButtonColor: AppColorData.appPrimaryColor,
                  onTap: () {
                    Get.toNamed(RouterName.loginScreen,arguments: {RouterArguments.isMain: 'false'});
                    /*Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => LoginScreen(
                                  isMain: false,
                                )));*/
                  }),
              doubleSpacer(),
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  CommonText(
                    text: "dontHaveAccount",
                    style: AppTextStyle.subBodyStyle
                        .copyWith(color: AppColorData.subBodyTextClr),
                  ),
                  SizedBox(width: 6,),
                  GestureDetector(
                    onTap: () {
                      Get.toNamed(RouterName.loginScreen,arguments: {RouterArguments.isMain: 'false'});
                    },
                    child: CommonText(
                     isUnderline: true,
                      text: "signUp",
                      style: AppTextStyle.subBodyStyle,
                    ),
                  ),
                ],
              ),
              doubleSpacer(),
              Visibility(
                visible: false,
                child: ListView.builder(
                    shrinkWrap: true,
                    physics: NeverScrollableScrollPhysics(),
                    itemCount: loggedOutLists.length,
                    itemBuilder: (context, index) {
                      return Column(
                        children: [
                          // ListTile(
                          //   leading: Icon(
                          //     loggedOutLists[index].icon,
                          //   ),
                          //   title: CommonText(text: loggedOutLists[index].data),
                          //   trailing: Icon(Icons.arrow_forward_ios_rounded),
                          // ),
                          // divider(height: 10),

                          ListTileWidget(
                              leadingIcon: loggedOutLists[index].icon,
                              titleText: loggedOutLists[index].data.tr(),
                              titleTextStyle: AppTextStyle.bodyTextStyle,
                              trailingIcon: Icons.arrow_forward_ios_rounded),
                        ],
                      );
                    }),
              ),
              ListView.builder(
                  shrinkWrap: true,
                  physics: NeverScrollableScrollPhysics(),
                  itemCount: legalDetails.length,
                  itemBuilder: (context, index) {
                    return ListTileWidget(
                      leadingIconSVG: legalDetails[index].icon1,
                      titleText: legalDetails[index].data1,
                      trailingIcon: Icons.arrow_forward_ios_rounded,
                      onTap: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => CommonWebPageWidget(
                                      url: (legalDetails[index].id1 == 0)
                                          ? EndPointConstants.termsServiceUrl
                                          : EndPointConstants.privacyUrl,
                                      appBarTitle: "",
                                    )));
                      },
                    );
                  }),
            ],
          ),
        ),
      ),
    );
  }
}
