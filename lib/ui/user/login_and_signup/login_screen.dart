import 'dart:io';

import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/user/common_viewmodel.dart';
import 'package:airstar_flutter/viewModel/user/login_view_model.dart';
import 'package:country_picker/country_picker.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_libphonenumber/flutter_libphonenumber.dart';
import 'package:flutter_svg/svg.dart';
import 'package:get/route_manager.dart';
import 'package:provider/provider.dart';

import '../../../routes/routes.dart';
import '../Profile/select_language_screen.dart';

class LoginScreen extends StatefulWidget {
  final bool? isMain;
  final bool? isBottomSheet;

  const LoginScreen({super.key, this.isMain, this.isBottomSheet = false});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  LoginViewModel? loginViewModel;
  CommonViewModel? commonViewModel;

  List<SocialIcons> iconsSocial = [
    SocialIcons(name: Strings.eMail, icon: SVGAssets.mailIcon),
    SocialIcons(name: Strings.google, icon: SVGAssets.googleIcon),
  ];

  // String? token;
  //
  // final FirebaseAuth _auth = FirebaseAuth.instance;
  //
  // Future getToken() async {
  //   SharedPreferences prefs = await SharedPreferences.getInstance();
  //
  //   token = prefs.getString(PrefConstant.socialAuthToken);
  // }

  GlobalKey<FormState> phoneFormKey = GlobalKey<FormState>();
  GlobalKey<FormState> emailFormKey = GlobalKey<FormState>();

  @override
  void initState() {
    loginViewModel = Provider.of<LoginViewModel>(context, listen: false);
    commonViewModel = Provider.of<CommonViewModel>(context, listen: false);
    //
    // WidgetsBinding.instance.addPostFrameCallback((_) async{
    //   await commonViewModel?.fetchSettings();
    //   await loginViewModel?.fetchListOfCountry(commonViewModel!);
    // });
    super.initState();
    init();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.isBottomSheet == true) {
      return Consumer2<LoginViewModel, CommonViewModel>(
        builder: (context, value, commonValue, child) =>
            Column(children: [_buildAppBar(value), _renderBody()]),
      );
    }
    return Consumer2<LoginViewModel, CommonViewModel>(
      builder: (context, value, commonValue, child) {
        return Scaffold(
          //  backgroundColor: Colors.white,
          appBar: _buildAppBar(value),
          body: _renderBody(),
        );
      },
    );
  }

  PreferredSizeWidget _buildAppBar(LoginViewModel value) {
    return CommonAppBar(
      backgroundColor: AppColorData.appSecondaryColor,
      isLeadingWidget: true,
      elevation: 4,
      leading: CommonElevatedButton(
        elevatedButtonName: "",
        isTextBtn: true,
        isLoad: value.state == ViewState.secondaryLoader ? true : false,
        onTap: () {
          if (widget.isMain == true) {
            Get.offAllNamed(RouterName.dashBoard, predicate: (Route<dynamic> predecate) => false);
          } else {
            Navigator.pop(context);
          }
        },
        icon: Icon(Icons.close, color: AppColorData.appIconBlack),
      ),
      actions: [
        Padding(
          padding: EdgeInsets.only(right: 20.0).toLTRAware(context),
          child: CommonElevatedButton(
            isTextBtn: true,
            isLoad: value.state == ViewState.secondaryLoader ? true : false,
            elevatedButtonName: "language",
            onTap: () {
              showCustomModalBottomSheet(
                showIcon: false,
                showDivider: false,
                context: context,
                builder: (context) {
                  return SelectLanguageScreen();
                },
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _renderBody() {
    return SingleChildScrollView(
      child: Padding(
        padding: horizontalPadding(),
        child: Consumer<LoginViewModel>(
          builder: (context, value, child) {
            bool getButtonAccess() {
              if (value.isEmailLogin) {
                if (value.validateEmail()) {
                  return true;
                }
              } else {
                if (value.validatePhonenumber(value: value.phoneController.text)) {
                  return true;
                }
              }
              return false;
            }

            return Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                CommonText(
                  text: "loginTitle",
                  style: AppTextStyle.loginHeadingStyle.copyWith(
                    //  fontWeight: FontWeight.w600,
                    // fontSize: 23,
                  ),
                ),

                // value.isEmailLogin? SizedBox(height: 30,): SizedBox.shrink(),
                // value.isEmailLogin? CommonText(text:Strings.welcomeToAirstar,style: AppTextStyle.titleStyle,) : SizedBox.shrink(),
                const SizedBox(height: 30),

                loginTextfield(value),
                SizedBox(height: 15),
                CommonElevatedButton(
                  elevatedButtonColor: getButtonAccess()
                      ? AppColorData.appPrimaryColor
                      : AppColorData.disableButtonClr,
                  showLoader: true,
                  isLoad: value.state == ViewState.secondaryLoader ? true : false,
                  elevatedButtonName: tr("continueKeyWord"),
                  onTap: () {
                    if (getButtonAccess()) {
                      value.onContinueTap(context, value.isEmailLogin, widget.isBottomSheet);
                    } else {
                      print("button access disabled");
                    }
                  },
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(flex: 1, child: CustomDivider()),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                      child: CommonText(text: "or", style: AppTextStyle.subBodyStyle),
                    ),
                    Expanded(flex: 1, child: CustomDivider()),
                  ],
                ),
                const SizedBox(height: 14),
                CommonElevatedButton(
                  isLoad: value.state == ViewState.secondaryLoader ? true : false,
                  icon: !value.isEmailLogin ? SvgPicture.asset(iconsSocial[0].icon) : Icon(Icons.phone),
                  border: Border.all(color: AppColorData.blackBorderClr),
                  elevatedButtonColor: AppColorData.appSecondaryColor,
                  elevatedButtonNameColor: AppColorData.bodyTextColor,
                  elevatedButtonName:
                      "${tr("continueWith")}${!value.isEmailLogin ? tr("eMail") : tr("phone")}",
                  onTap: () {
                    value.toggleEmailLogin();
                  },
                ),
                SizedBox(height: 14),

                if (kIsWeb || Platform.isAndroid)
                  CommonElevatedButton(
                    icon: SvgPicture.asset(iconsSocial[1].icon),
                    border: Border.all(color: AppColorData.blackBorderClr),
                    isLoad: value.state == ViewState.secondaryLoader ? true : false,
                    elevatedButtonColor: AppColorData.appSecondaryColor,
                    elevatedButtonNameColor: AppColorData.bodyTextColor,
                    elevatedButtonName: "${tr("continueWith")} ${tr("google")}",
                    onTap: () async {
                      final accessToken = await value.signInWithGoogle();
                      print(
                        "loginViewModel?.state :: ${loginViewModel?.state} ::: ViewState.secondaryLoader :${ViewState.secondaryLoader}",
                      );
                      if (accessToken != null) {
                        await loginViewModel
                            ?.socialLogin(
                              type: 'google',
                              //fcmId: '',
                              accessToken: accessToken,
                            )
                            .then((val) {
                              if (val == true) {
                                Get.offAllNamed(
                                  RouterName.dashBoard,
                                  arguments: {
                                    RouterArguments.token:
                                        loginViewModel?.socialLoginResponseModel?.data?.socialLogin?.token,
                                  },
                                  predicate: (Route<dynamic> predecate) => false,
                                );
                              }
                            });
                      }
                      print(
                        "loginViewModel?.state 1111 :: ${loginViewModel?.state} ::: ViewState.secondaryLoader :${ViewState.secondaryLoader}",
                      );
                    },
                  ),
                SizedBox(height: 14),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Consumer<LoginViewModel>(
                      builder: (context, value, child) {
                        return CommonElevatedButton(
                          isLoad: value.state == ViewState.guestLogin ? true : false,
                          showLoader: true,
                          loaderColor: AppColorData.blackClr,
                          height: 50,
                          width: MediaQuery.of(context).size.height * 0.20,
                          elevatedButtonColor: AppColorData.appSecondaryColor,
                          elevatedButtonNameColor: AppColorData.bodyTextColor,
                          border: Border.all(color: AppColorData.blackBorderClr),
                          elevatedButtonName: "guestLogin",
                          onTap: () async {
                            FocusScope.of(context).unfocus();
                            value
                                .userLogin(
                                  userType: 'USER',
                                  isEmail: true,
                                  isGuest: true,
                                  isHost: false,
                                  email: "user@airstar.com",
                                  password: "123456",
                                )
                                .then((val) async {
                                  if (val == true) {
                                    Get.offAllNamed(
                                      RouterName.dashBoard,
                                      arguments: {
                                        RouterArguments: value.loginResponseModel?.data.user.token ?? "",
                                      },
                                      predicate: (Route<dynamic> predicate) => false,
                                    );
                                  }
                                });
                          },
                        );
                      },
                    ),
                    SizedBox(width: 14),
                    Consumer<LoginViewModel>(
                      builder: (context, value, child) {
                        return CommonElevatedButton(
                          elevatedButtonName: "hostLogin",
                          showLoader: true,
                          loaderColor: AppColorData.blackClr,
                          height: 50,
                          elevatedButtonColor: AppColorData.appSecondaryColor,
                          elevatedButtonNameColor: AppColorData.bodyTextColor,
                          border: Border.all(color: AppColorData.blackBorderClr),
                          width: MediaQuery.of(context).size.height * 0.19,
                          isLoad: value.state == ViewState.hostLogin ? true : false,
                          onTap: () async {
                            FocusScope.of(context).unfocus();
                            value
                                .userLogin(
                                  userType: "Host",
                                  isEmail: true,
                                  email: "host@airstar.com",
                                  isHost: true,
                                  isGuest: false,
                                  password: "123456",
                                )
                                .then((val) {
                                  if (val == true) {
                                    Get.offAllNamed(
                                      RouterName.hostDashboard,
                                      predicate: (Route<dynamic> predicate) => false,
                                    );
                                  } else {
                                    print("else part login not work");
                                  }
                                });
                          },
                        );
                      },
                    ),
                  ],
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget loginTextfield(LoginViewModel model) {
    return (model.isEmailLogin)
        ? AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            // margin: EdgeInsets.only(top: 35),
            child: Form(
              key: emailFormKey,
              child: CommonTextFromField(
                controller: model.emailController,
                contentPadding: horizontalPadding(horizontal: 14),
                border: Border.all(color: AppColorData.boxBorder),
                keyboardType: TextInputType.emailAddress,
                labelText: tr("eMail"),
                onChanged: (_) {
                  model.checkButtonEnabled();
                },
              ),
            ),
          )
        : AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            child: Consumer<LoginViewModel>(
              builder: (context, value, child) {
                return Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    GestureDetector(
                      /*  onTap: () {
                        countryPicker(value, context);
                      },*/
                      onTap: () async {
                        value.countries = CountryManager().countries
                          ..sort((final a, final b) => (a.countryName ?? '').compareTo(b.countryName ?? ''));
                        value.filteredCountries = value.countries;
                        final res = await showModalBottomSheet<CountryWithPhoneCode>(
                          context: context,
                          isScrollControlled: true,
                          builder: (final context) {
                            return Padding(
                              padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
                              child: DraggableScrollableSheet(
                                initialChildSize: 0.6,
                                minChildSize: 0.5,
                                maxChildSize: 0.9,
                                expand: false,
                                builder: (context, scrollController) {
                                  return StatefulBuilder(
                                    builder: (context, setModalState) {
                                      return Column(
                                        children: [
                                          Padding(
                                            padding: const EdgeInsets.all(16.0),
                                            child: TextField(
                                              controller: value.searchController,
                                              decoration: InputDecoration(
                                                hintText: '',
                                                prefixIcon: Icon(Icons.search),
                                                border: OutlineInputBorder(
                                                  borderRadius: BorderRadius.circular(10),
                                                ),
                                              ),
                                              onChanged: (val) {
                                                setModalState(() {
                                                  value.filterCountries(val);
                                                });
                                              },
                                              autofocus: true,
                                              inputFormatters: [
                                                FilteringTextInputFormatter.allow(
                                                  RegExp(r'[a-zA-Z0-9\s\+]+'),
                                                ),
                                              ],
                                            ),
                                          ),
                                          Expanded(
                                            child: ListView.builder(
                                              padding: const EdgeInsets.symmetric(vertical: 16),
                                              itemBuilder: (final context, final index) {
                                                final item = value.filteredCountries[index];
                                                return GestureDetector(
                                                  behavior: HitTestBehavior.opaque,
                                                  onTap: () {
                                                    Navigator.of(context).pop(item);
                                                    value.searchController.clear();
                                                  },
                                                  child: Padding(
                                                    padding: const EdgeInsets.symmetric(
                                                      horizontal: 24,
                                                      vertical: 16,
                                                    ),
                                                    child: Row(
                                                      children: [
                                                        /// Phone code
                                                        Expanded(
                                                          child: Text(
                                                            '+${item.phoneCode}',
                                                            textAlign: TextAlign.right,
                                                          ),
                                                        ),

                                                        /// Spacer
                                                        const SizedBox(width: 16),

                                                        /// Name
                                                        Expanded(
                                                          flex: 8,
                                                          child: Text(item.countryName ?? ''),
                                                        ),
                                                      ],
                                                    ),
                                                  ),
                                                );
                                              },
                                              itemCount: value.filteredCountries.length,
                                            ),
                                          ),
                                        ],
                                      );
                                    },
                                  );
                                },
                              ),
                            );
                          },
                        );

                        print('New country selection: $res');
                        print('New country selection1: ${value.filteredCountries.length}');

                        if (res != null) {
                          value.selectedCountryCode1 = res;
                          value.phoneController.clear();
                          value.notify();
                        }
                      },
                      child: Container(
                        height: 60,
                        padding: horizontalPadding(horizontal: 10),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.vertical(top: Radius.circular(10)),
                          border: Border(
                            top: BorderSide(color: AppColorData.boxBorder),
                            left: BorderSide(color: AppColorData.boxBorder),
                            right: BorderSide(color: AppColorData.boxBorder),
                          ),
                        ),
                        child: Row(
                          //mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Flexible(
                              child: Row(
                                children: [
                                  Flexible(
                                    child: CommonText(
                                      text: value.selectedCountryCode1?.countryName ?? '',
                                      style: AppTextStyle.bodyTextStyle.copyWith(fontWeight: FontWeight.w400),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  SizedBox(width: 10),
                                  CommonText(
                                    text: "+${value.selectedCountryCode1?.phoneCode ?? '1'}",
                                    style: AppTextStyle.bodyTextStyle.copyWith(fontWeight: FontWeight.w400),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),
                            Icon(Icons.keyboard_arrow_down_outlined, size: 30),
                          ],
                        ),
                      ),
                    ),
                    Form(
                      key: phoneFormKey,
                      child: CommonTextFromField(
                        controller: value.phoneController,
                        keyboardType: TextInputType.number,
                        contentPadding: horizontalPadding(horizontal: 14),
                        border: Border.all(color: AppColorData.boxBorder),
                        borderRadius: BorderRadius.vertical(bottom: Radius.circular(10)),
                        labelText: tr("phoneNumber"),
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                          LibPhonenumberTextFormatter(
                            phoneNumberType: PhoneNumberType.mobile,
                            phoneNumberFormat: PhoneNumberFormat.international,
                            country: value.selectedCountryCode1 ?? CountryWithPhoneCode.us(),
                            inputContainsCountryCode: false,
                            shouldKeepCursorAtEndOfInput: true,
                          ),
                          // LengthLimitingTextInputFormatter(10),
                        ],
                        onChanged: (phone) {
                          value.checkButtonEnabled();
                        },
                      ),
                    ),
                    const SizedBox(height: 14),
                    CommonText(
                      text: "loginSub",
                      style: AppTextStyle.contentStyle.copyWith(fontWeight: FontWeight.w400),
                    ),
                  ],
                );
              },
            ),
          );
  }
}

countryPicker(LoginViewModel model, BuildContext context) {
  return showCountryPicker(
    context: context,
    countryListTheme: CountryListThemeData(
      flagSize: 0,
      bottomSheetWidth: MediaQuery.of(context).size.width * 0.85,
      borderRadius: BorderRadius.circular(5),
      // padding: EdgeInsets.symmetric(vertical: 20, horizontal: 20),
      backgroundColor: Colors.white,

      margin: EdgeInsets.symmetric(vertical: 20),
      textStyle: AppTextStyle.bodyTextStyle,
    ),
    showPhoneCode: true,
    showSearch: false,
    useSafeArea: true,
    useRootNavigator: true,
    showWorldWide: false,
    onSelect: (Country country) {
      print('Select country: ${country.displayName}');
    },
  );
}

EdgeInsets horizontalPadding({double horizontal = 20, double vertical = 0.0}) {
  return EdgeInsets.symmetric(horizontal: horizontal, vertical: vertical);
}

class SocialIcons {
  final String name;
  final String icon;

  SocialIcons({required this.name, required this.icon});
}
