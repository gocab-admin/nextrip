import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/user/login_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:get/route_manager.dart';
import 'package:provider/provider.dart';

import '../../../routes/routes.dart';

class PasswordVerifyScreen extends StatefulWidget {
  final bool? isBottomSheet;
  const PasswordVerifyScreen({super.key, this.isBottomSheet = false});

  @override
  State<PasswordVerifyScreen> createState() => _PasswordVerifyScreenState();
}

class _PasswordVerifyScreenState extends State<PasswordVerifyScreen> {
  LoginViewModel? loginViewModel;
  GlobalKey<FormState> passwordKey = GlobalKey<FormState>();
  @override
  void initState() {
    loginViewModel = Provider.of<LoginViewModel>(context, listen: false);

    super.initState();
  }

  bool isForgotPasswordLoading = false;
  @override
  Widget build(BuildContext context) {
    if (widget.isBottomSheet == true) {
      return _renderBody();
    }
    return Consumer<LoginViewModel>(
      builder: (context, value, child) {
        return Scaffold(
          appBar: CommonAppBar(
            elevation: 4,
            isMainPage: false,
            isBack: value.state == ViewState.secondaryLoader && !isForgotPasswordLoading ? true : false,
          ),
          body: _renderBody(),
        );
      },
    );
  }

  Widget _renderBody() {
    ToastUtil toast = ToastUtil(context);
    // FocusNode passwordFocus = FocusNode();

    return Consumer<LoginViewModel>(
      builder: (context, value, child) {
        Color getButtonColor() {
          if (value.passwordVerifyController.text.isNotEmpty) {
            return AppColorData.appPrimaryColor;
          }

          return AppColorData.disableButtonClr;
        }

        bool getButtonAccess() {
          if (value.passwordVerifyController.text.isNotEmpty) {
            return true;
          }

          return false;
        }

        return Container(
          // padding: EdgeInsets.all(16.0),
          color: AppColorData.appSecondaryColor,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Padding(
                padding: horizontalPadding(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    CommonText(
                      text: "login",
                      style: AppTextStyle.loginHeadingStyle.copyWith(
                        //  fontWeight: FontWeight.w700,
                        // fontSize: 23,
                      ),
                    ),
                    SizedBox(height: 20),
                    Form(
                      key: passwordKey,
                      child: CommonTextFromField(
                        // focusNode: passwordFocus,
                        contentPadding: EdgeInsets.all(10.0),
                        labelText: tr("psWord"),
                        controller: value.passwordVerifyController,
                        // validator: (value) {
                        //   return validator.validatePassword(oldPassword: value);
                        // },
                        obscureText: value.passwordObscure,
                        onChanged: (val) {
                          value.checkButtonEnabled();
                        },
                        suffixIcon: TextButton(
                          onPressed: () {
                            value.changePasswordVisible();
                          },
                          child: value.passwordObscure
                              ? CommonText(
                                  text: "show",
                                  style: TextStyle(color: AppColorData.subBodyTextClr),
                                )
                              : CommonText(
                                  text: "hide",
                                  style: TextStyle(color: AppColorData.subBodyTextClr),
                                ),
                        ),

                        border: Border.all(color: AppColorData.boxBorder),
                      ),
                    ),
                    SizedBox(height: 30),
                    Consumer<LoginViewModel>(
                      builder: (context, value, child) {
                        return CommonElevatedButton(
                          isLoad: value.state == ViewState.secondaryLoader && !isForgotPasswordLoading
                              ? true
                              : false,
                          elevatedButtonColor: getButtonColor(),
                          elevatedButtonName: "continueKeyWord",
                          showLoader: true,
                          onTap: () async {
                            FocusScope.of(context).unfocus();
                            if (getButtonAccess()) {
                              await value
                                  .userLogin(
                                    userType: 'USER',
                                    isEmail: true,
                                    email: loginViewModel!.emailController.text,
                                    isGuest: false,
                                    isHost: false,
                                    password: value.passwordVerifyController.text,
                                  )
                                  .then((val) async {
                                    if (val == true) {
                                      if (widget.isBottomSheet == true) {
                                        await value.getToken();
                                        value.notify();
                                        Navigator.pop(context);
                                      } else {
                                        Get.offAllNamed(
                                          RouterName.dashBoard,
                                          arguments: {
                                            RouterArguments.token: value.loginResponseModel?.data.user.token,
                                          },
                                          predicate: (Route<dynamic> predecate) => false,
                                        );
                                      }

                                      loginViewModel!.clearController();
                                      value.passwordVerifyController.clear();
                                    }
                                  });
                            } else {
                              print("button access disabled");
                            }
                          },
                        );
                      },
                    ),
                    SizedBox(height: 30),
                    Align(
                      alignment: Alignment.center,
                      child: value.state == ViewState.secondaryLoader && isForgotPasswordLoading
                          ? Loader(color: AppColorData.blackClr)
                          : TextButton(
                              onPressed: () {
                                isForgotPasswordLoading = true;
                                value
                                    .userForgotPassword(
                                      isEmail: true,
                                      email: loginViewModel!.emailController.text,
                                    )
                                    .then((val) {
                                      if (val == true) {
                                        isForgotPasswordLoading = false;
                                        toast.showModalToast(
                                          seconds: 6,
                                          child: Material(
                                            color: Colors.white,
                                            child: Row(
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                CircleAvatar(
                                                  backgroundColor: AppColorData.frgtPswToastChckBgClr,
                                                  child: Icon(
                                                    Icons.check,
                                                    color: AppColorData.appSecondaryColor,
                                                  ),
                                                ),
                                                SizedBox(width: 14),
                                                Expanded(
                                                  child: CommonText(
                                                    text:
                                                        // "${Strings.linkToResetPswrd} /*seo@abservetech.com*/",
                                                        "${tr("linkToResetPswrd")} ${loginViewModel!.emailController.text}",
                                                    //  softWrap: true,
                                                    style: AppTextStyle.subBodyStyle,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        );
                                      }
                                    });
                                // passwordFocus.requestFocus();
                              },
                              child: CommonText(
                                text: "forgotPassword",
                                style: TextStyle(
                                  decoration: TextDecoration.underline,
                                  color: AppColorData.bodyTextColor,
                                  fontWeight: FontWeight.w400,
                                ),
                              ),
                            ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
