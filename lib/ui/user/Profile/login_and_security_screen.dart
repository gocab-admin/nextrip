import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/user/user_response_model.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/user/profile_view_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:airstar_flutter/utils/utils.dart';
import '../dashBoard/searchBar.dart';

class LoginAndSecurityScreen extends StatefulWidget {
  final UserResponseModel? userModel;
  const LoginAndSecurityScreen({super.key, this.userModel});

  @override
  State<LoginAndSecurityScreen> createState() => _LoginAndSecurityScreenState();
}

class _LoginAndSecurityScreenState extends State<LoginAndSecurityScreen> {
  EditProfileViewModel? editProfileViewModel;

  @override
  void initState() {
    editProfileViewModel =
        Provider.of<EditProfileViewModel>(context, listen: false);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColorData.appSecondaryColor,
      appBar: CommonAppBar(
        //  showBorder: true,
        automaticallyImplyLeading: true,
        elevation: 10,
      ),
      body: Consumer<EditProfileViewModel>(builder: (context, value, child) {
        return _renderBody();
      }),
    );
  }

  Widget _renderBody() {
    return SingleChildScrollView(
      child: Padding(
        padding: horizontalPadding(vertical: 14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            updateScreen(),
            Visibility(
              visible: false,
              child: CommonText(
                text: "account",
                style: AppTextStyle.headingStyle,
              ),
            ),
            Visibility(
              visible: false,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  CommonText(
                    text: "deactivateYourAcnt",
                    style: AppTextStyle.bodyTextStyle,
                  ),
                  // TextButton(
                  //   onPressed: () {
                  //     showCustomModalBottomSheet(
                  //         backgroundColor: AppColorData.appSecondaryColor,
                  //         //height: 0.4,
                  //         context: context,
                  //         builder: (context) {
                  //           return deactivateScreen();
                  //         });
                  //   },
                  //   child: CommonText(
                  //       text: "deactivate",
                  //       style: AppTextStyle.subHeaderStyle
                  //           .copyWith(color: AppColorData.deactivateButtonClr)),
                  // )
                  CommonElevatedButton(
                    isTextBtn: true,
                    isUnderline: false,
                    onTap: () {
                      // showCustomModalBottomSheet(
                      //     backgroundColor: AppColorData.appSecondaryColor,
                      //     //height: 0.4,
                      //     context: context,
                      //     builder: (context) {
                      //       return deactivateScreen();
                      //     });
                    },
                    elevatedButtonName: "deactivate",
                    elevatedButtonNameColor: AppColorData.disableButtonClr,
                  )
                ],
              ),
            ),
            Visibility(
              visible: false,
              child: divider(
                height: 50,
                thickness: 2,
                color: AppColorData.dividerColor,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget loginAndSecurityScreen() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CommonText(
          text: "loginAndSecurity",
          style: AppTextStyle.loginHeadingStyle,
        ),
        doubleSpacer(
          height: 40,
        ),
        CommonText(
          text: "login",
          style: AppTextStyle.headingStyle,
        ),
        doubleSpacer(
          height: 30,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            CommonText(
              text: "psWord",
              style: AppTextStyle.bodyTextStyle,
            ),
            // TextButton(
            //   onPressed: () {
            //     editProfileViewModel?.securityExpandFun();
            //   },
            //   child: CommonText(
            //       text: "update",
            //       style: AppTextStyle.subHeaderStyle
            //           .copyWith(color: AppColorData.updateButtonClr)),
            // )
            CommonElevatedButton(
              isUnderline: false,
              isTextBtn: true,
              onTap: () {
                editProfileViewModel?.securityExpandFun();
              },
              elevatedButtonName: "update",
              elevatedButtonNameColor: AppColorData.updateButtonClr,
            )
          ],
        ),
        // CommonText(
        //     text: "lastUpdate",
        //     style: AppTextStyle.subBodyHintTextStyle
        //         .copyWith(fontWeight: FontWeight.w300)),
        divider(
          height: 50,
          thickness: 2,
          color: AppColorData.dividerColor,
        ),
      ],
    );
  }

  Widget updateScreen() {
    return Builder(builder: (context) {
      return Consumer<EditProfileViewModel>(
        builder: (context, value, child) {
          bool getButtonAccess() {
            final conditions = <bool>[
              value.currentPasswordController.text.isNotEmpty &&
                  AppValidators()
                      .isPassword(value.currentPasswordController.text),
              value.newPasswordController.text.isNotEmpty &&
                  AppValidators().isPassword(value.newPasswordController.text),
              value.confirmPasswordController.text.isNotEmpty &&
                  AppValidators()
                      .isPassword(value.confirmPasswordController.text) &&
                  value.newPasswordController.text ==
                      value.confirmPasswordController.text,
            ];

            // Check if all conditions are true
            if (conditions.every((condition) => condition)) {
              return true;
            } else {
              return false;
            }
          }

          return AnimatedContainer(
            duration: Duration(milliseconds: 150),
            width: MediaQuery.of(context).size.width,
            child: value.isSecurityExpanded
                ? Form(
                    key: value.formKey,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        CommonText(
                          text: "loginAndSecurity",
                          style: AppTextStyle.loginHeadingStyle,
                        ),
                        SizedBox(
                          height: 40,
                        ),
                        CommonText(
                          text: "login",
                          style: AppTextStyle.headingStyle,
                        ),
                        SizedBox(
                          height: 30,
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            CommonText(
                              text: "psWord",
                              style: AppTextStyle.bodyTextStyle,
                            ),
                            // TextButton(
                            //   onPressed: () {
                            //     editProfileViewModel?.securityExpandFun(val: false);
                            //   },
                            //   child: CommonText(
                            //       text: "cancel",
                            //       style: AppTextStyle.subHeaderStyle.copyWith(
                            //           color: AppColorData.updateButtonClr)),
                            // )
                            CommonElevatedButton(
                              isTextBtn: true,
                              isUnderline: false,
                              onTap: () {
                                value.securityExpandFun(val: false);
                              },
                              elevatedButtonName: "cancel",
                              elevatedButtonNameColor:
                                  AppColorData.updateButtonClr,
                            )
                          ],
                        ),
                        CommonText(
                          text: "currentPswrd",
                          style: AppTextStyle.bodyTextStyle
                              .copyWith(fontWeight: FontWeight.w300),
                        ),
                        spacer(),
                        passwordTextWidget(
                            errorMessage:
                                value.currentPasswordController.text.isEmpty
                                    ? ""
                                    : AppValidators().validatePassword(
                                        value.currentPasswordController.text),
                            onChanged: (p0) {
                              value.notify();
                            },
                            controller: value.currentPasswordController,
                            obscureText: value.currentPasswordObscure,
                            // validator: (val) {
                            //   if (val == null || val.isEmpty) {
                            //     return "${tr("currentPassValidateMSg1")} ${tr("currentPswrd")}";
                            //   }
                            //   return null;
                            // },
                            onPressed: () {
                              value.currentPasswordObscure =
                                  !value.currentPasswordObscure;
                              value.notify();
                            }),
                        // spacer(),
                        // GestureDetector(
                        //   onTap: (){
                        //   },
                        //   child: CommonText(text: "needNwPswrd",style:AppTextStyle.bodyStyle.copyWith(color: AppColorData.updateButtonClr)),
                        // ),
                        doubleSpacer(),
                        CommonText(
                          text: "newPswrd",
                          style: AppTextStyle.bodyTextStyle
                              .copyWith(fontWeight: FontWeight.w300),
                        ),
                        spacer(),
                        passwordTextWidget(
                            errorMessage:
                                value.newPasswordController.text.isEmpty
                                    ? ""
                                    : AppValidators().validatePassword(
                                        value.newPasswordController.text),
                            controller: value.newPasswordController,
                            onChanged: (p0) {
                              value.notify();
                            },
                            obscureText: value.newPasswordObscure,
                            // validator: (val) {
                            //   if (val == null || val.isEmpty) {
                            //     return "${tr("currentPassValidateMSg1")} ${tr("newPswrd")}";
                            //   } else if (value.newPasswordController.text !=
                            //       value.confirmPasswordController.text) {
                            //     return "${tr("currentPassValidateMSg2")}";
                            //   }
                            //   return null;
                            // },
                            onPressed: () {
                              value.newPasswordObscure =
                                  !value.newPasswordObscure;
                              value.notify();
                            }),
                        doubleSpacer(),
                        CommonText(
                          text: "confirmPswrd",
                          style: AppTextStyle.bodyTextStyle
                              .copyWith(fontWeight: FontWeight.w300),
                        ),
                        spacer(),
                        passwordTextWidget(
                            errorMessage:
                                value.confirmPasswordController.text.isEmpty
                                    ? ""
                                    : AppValidators().validateConfirmPassword(
                                        value.newPasswordController.text,
                                        value.confirmPasswordController.text),
                            controller: value.confirmPasswordController,
                            onChanged: (p0) {
                              value.notify();
                            },
                            obscureText: value.confirmPasswordObscure,
                            // validator: (val) {
                            //   if (val == null || val.isEmpty) {
                            //     return "${tr("currentPassValidateMSg1")} ${tr("confirmPswrd")}";
                            //   } else if (value.confirmPasswordController.text !=
                            //       value.newPasswordController.text) {
                            //     return "${tr("currentPassValidateMSg2")}";
                            //   }
                            //   return null;
                            // },
                            onPressed: () {
                              value.confirmPasswordObscure =
                                  !value.confirmPasswordObscure;
                              value.notify();
                            }),
                        doubleSpacer(),
                        Container(
                            width: MediaQuery.of(context).size.width * 0.4,
                            child: CommonElevatedButton(
                              showLoader: true,
                              isLoad: value.state == ViewState.secondaryLoader
                                  ? true
                                  : false,
                              elevatedButtonName: "updatePswrd",
                              elevatedButtonNameColor:
                                  AppColorData.appSecondaryColor,
                              elevatedButtonColor: getButtonAccess()
                                  ? AppColorData.updateButtonClr
                                  : AppColorData.disableButtonClr,
                              onTap: () {
                                if (getButtonAccess()) {
                                  value.fetchUpdatePassword();
                                } else {
                                  print("button access disabled");
                                }
                              },
                            )),
                        divider(
                          height: 50,
                          thickness: 2,
                          color: AppColorData.dividerColor,
                        ),
                      ],
                    ),
                  )
                : loginAndSecurityScreen(),
          );
        },
      );
    });
  }

  Widget passwordTextWidget(
      {TextEditingController? controller,
      bool? obscureText,
      Function(String)? onChanged,
      Function()? onPressed,
      String? errorMessage,
      FormFieldValidator<String>? validator}) {
    return CommonTextFromField(
      onChanged: onChanged,
      border: Border.all(color: AppColorData.boxBorder),
      controller: controller,
      contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      obscureText: obscureText,
      // validator: validator,
      errorMessage: errorMessage ?? "",
      suffixIcon: TextButton(
        onPressed: onPressed,
        child: obscureText!
            ? CommonText(
                text: "show",
                style: TextStyle(color: AppColorData.subBodyTextClr))
            : CommonText(
                text: "hide",
                style: TextStyle(color: AppColorData.subBodyTextClr),
              ),
      ),
      // CommonElevatedButton(
      //   isUnderline: false,
      //   isTextBtn: true,
      //   onTap: onPressed,
      //   elevatedButtonName: obscureText!
      //       ?  "show"
      //       :  "hide",
      //   elevatedButtonNameColor:  AppColorData.appHintText,
      // ),
    );
  }

  Widget deactivateScreen() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        doubleSpacer(),
        CommonText(
          text: "areUSureToDeactivate",
          style: AppTextStyle.bodyTextStyle,
        ),
        SizedBox(
          height: 50,
        ),
        Align(
          alignment: Alignment.bottomCenter,
          // color: AppColorData.appSecondaryColor,
          child: Container(
            padding: EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColorData.appSecondaryColor,
              boxShadow: [
                BoxShadow(
                    spreadRadius: -2,
                    blurRadius: 5,
                    color: AppColorData.shadowClr,
                    offset: Offset(-4, -4))
              ],
              // border:Border(top: BorderSide(color: AppColorData.boxBorder))
            ),
            child: Consumer<EditProfileViewModel>(
                builder: (context, viewModel, child) {
              return Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  CommonElevatedButton(
                    width: MediaQuery.of(context).size.width * 0.3,
                    border: Border.all(color: AppColorData.boxBorder),
                    elevatedButtonNameColor: viewModel.isSecurityActive
                        ? AppColorData.appSecondaryColor
                        : AppColorData.bodyTextColor,
                    elevatedButtonColor: viewModel.isSecurityActive
                        ? AppColorData.blackButtonClr
                        : AppColorData.appSecondaryColor,
                    onTap: () {
                      viewModel.securityActiveFun();
                    },
                    elevatedButtonName: 'No',
                  ),
                  CommonElevatedButton(
                    width: MediaQuery.of(context).size.width * 0.3,
                    border: Border.all(color: AppColorData.boxBorder),
                    elevatedButtonNameColor: viewModel.isSecurityActive
                        ? AppColorData.bodyTextColor
                        : AppColorData.appSecondaryColor,
                    elevatedButtonColor: viewModel.isSecurityActive
                        ? AppColorData.appSecondaryColor
                        : AppColorData.blackButtonClr,
                    onTap: () {
                      viewModel.securityActiveFun();
                    },
                    elevatedButtonName: 'Yes',
                  ),
                ],
              );
            }),
          ),
        ),
      ],
    );
  }
}
