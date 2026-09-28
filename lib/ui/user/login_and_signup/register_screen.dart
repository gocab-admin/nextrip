import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_holo_date_picker/flutter_holo_date_picker.dart';
import 'package:flutter_libphonenumber/flutter_libphonenumber.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

import '../../../routes/routes.dart';

class RegisterScreen extends StatefulWidget {
  final String phoneNumber;
  final String email;
  final String countryCode;
  final bool? isBottomSheet;

  const RegisterScreen({
    super.key,
    required this.phoneNumber,
    required this.email,
    required this.countryCode,
    this.isBottomSheet = false,
  });

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  late LoginViewModel loginViewModel;
  RegisterViewModel? registerViewModel;
  TextEditingController firstNameController = TextEditingController();
  TextEditingController lastNameController = TextEditingController();
  TextEditingController birthDayController = TextEditingController();
  TextEditingController passWordController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController phoneController = TextEditingController();
  final formKey = GlobalKey<FormState>();
  bool isValid = false;

  @override
  void dispose() {
    super.dispose();
    firstNameController.clear();
    lastNameController.clear();
    birthDayController.clear();
    passWordController.clear();
    passWordController.clear();
    phoneController.clear();
  }

  @override
  void initState() {
    phoneController.text = widget.phoneNumber;
    emailController.text = widget.email;
    loginViewModel = Provider.of<LoginViewModel>(context, listen: false);

    super.initState();
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await DatePicker.showSimpleDatePicker(
      context,
      // backgroundColor: Colors.white,
      titleText: Strings.selectBirthDate,
      initialDate: DateTime(2001),
      firstDate: DateTime(1920),
      lastDate: DateTime(2006),
      dateFormat: "MMM-dd-yyyy",
      // Customize date format as needed
      locale: DateTimePickerLocale.en_us,
      // Set locale
      looping: false, // Allow looping through dates
    );

    if (picked != null) {
      final formattedDate = DateFormat('dd/MM/yyyy').format(picked);

      birthDayController.text = formattedDate;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (widget.isBottomSheet == true) {
      return Padding(
        padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
        child: SingleChildScrollView(physics: const ClampingScrollPhysics(), child: _renderBody()),
      );
    }
    return Consumer<RegisterViewModel>(
      builder: (context, value, child) {
        return Scaffold(
          backgroundColor: AppColorData.appSecondaryColor,
          appBar: CommonAppBar(isMainPage: false, isBack: value.state == ViewState.secondaryLoader),
          body: _renderBody(),
        );
      },
    );
  }

  Widget _renderBody() {
    return Consumer<RegisterViewModel>(
      builder: (context, value, child) {
        bool getButtonAccess() {
          final conditions = <bool>[
            firstNameController.text.isNotEmpty && AppValidators().isName(firstNameController.text),
            lastNameController.text.isNotEmpty,
            birthDayController.text.isNotEmpty,
            phoneController.text.isNotEmpty &&
                loginViewModel.validatePhonenumber(value: phoneController.text) &&
                AppValidators().isMobileNumber(phoneController.text),
            emailController.text.isNotEmpty && AppValidators().isEmail(emailController.text),
            passWordController.text.isNotEmpty && AppValidators().isPassword(passWordController.text),
          ];

          // Check if all conditions are true
          if (conditions.every((condition) => condition)) {
            return true;
          } else {
            return false;
          }
        }

        return Container(
          color: AppColorData.appSecondaryColor,
          child: ListView(
            physics: widget.isBottomSheet! ? NeverScrollableScrollPhysics() : null,
            padding: horizontalPadding(),
            shrinkWrap: true,
            children: <Widget>[
              CommonText(text: "addYourInfo", style: AppTextStyle.loginHeadingStyle),
              const SizedBox(height: 14),
              AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                child: Form(
                  key: formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      CommonTextFromField(
                        controller: firstNameController,
                        keyboardType: TextInputType.name,
                        onChanged: (val) {
                          value.checkButtonEnabled();
                        },
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14),
                        border: Border(
                          top: BorderSide(color: AppColorData.boxBorder),
                          left: BorderSide(color: AppColorData.boxBorder),
                          right: BorderSide(color: AppColorData.boxBorder),
                        ),
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(10)),
                        labelText: tr("fName"),
                      ),
                      CommonTextFromField(
                        controller: lastNameController,
                        onChanged: (val) {
                          value.checkButtonEnabled();
                        },
                        keyboardType: TextInputType.name,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14),
                        border: Border.all(color: AppColorData.boxBorder),
                        borderRadius: const BorderRadius.vertical(bottom: Radius.circular(10)),
                        labelText: tr("lName"),
                      ),
                      //  spacer(),
                      doubleSpacer(height: 15),
                      CommonText(
                        text: "nameSub",
                        style: AppTextStyle.contentStyle.copyWith(
                          fontWeight: FontWeight.w400,
                          color: AppColorData.subBodyTextClr,
                        ),
                      ),
                      // spacer(),
                      doubleSpacer(height: 15),
                      CommonTextFromField(
                        showCursor: false,
                        controller: birthDayController,
                        readOnly: true,
                        onChanged: (val) {
                          value.checkButtonEnabled();
                        },
                        keyboardType: TextInputType.datetime,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14),
                        border: Border.all(color: AppColorData.boxBorder),
                        borderRadius: BorderRadius.circular(10),
                        labelText: tr("bDay"),
                        onTap: () {
                          // autoValidator();
                          _selectDate(context);
                        },
                      ),
                      doubleSpacer(height: 15),
                      AnimatedContainer(
                        duration: Duration(milliseconds: 150),
                        child: Consumer<LoginViewModel>(
                          builder: (context, value, child) {
                            return Column(
                              children: [
                                GestureDetector(
                                  onTap: () async {
                                    if (widget.phoneNumber.isEmpty) {
                                      value.countries = CountryManager().countries
                                        ..sort(
                                          (final a, final b) =>
                                              (a.countryName ?? '').compareTo(b.countryName ?? ''),
                                        );
                                      value.filteredCountries = value.countries;
                                      final res = await showModalBottomSheet<CountryWithPhoneCode>(
                                        context: context,
                                        isScrollControlled: true,
                                        builder: (final context) {
                                          return Padding(
                                            padding: EdgeInsets.only(
                                              bottom: MediaQuery.of(context).viewInsets.bottom,
                                            ),
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
                                                            shrinkWrap: true,
                                                            padding: const EdgeInsets.symmetric(
                                                              vertical: 16,
                                                            ).toLTRAware(context),
                                                            itemBuilder: (final context, final index) {
                                                              final item = value.filteredCountries[index];
                                                              return GestureDetector(
                                                                behavior: HitTestBehavior.opaque,
                                                                onTap: () {
                                                                  Navigator.of(context).pop(item);
                                                                },
                                                                child: Padding(
                                                                  padding: const EdgeInsets.symmetric(
                                                                    horizontal: 24,
                                                                    vertical: 16,
                                                                  ).toLTRAware(context),
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
                                    }
                                  },
                                  child: Container(
                                    height: 60,
                                    padding: EdgeInsets.only(left: 10, top: 8).toLTRAware(context),
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.vertical(top: Radius.circular(10)),
                                      border: Border(
                                        top: BorderSide(color: AppColorData.boxBorder),
                                        left: BorderSide(color: AppColorData.boxBorder),
                                        right: BorderSide(color: AppColorData.boxBorder),
                                      ),
                                    ),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      //mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        CommonText(
                                          text: "countryOrRegion",
                                          style: AppTextStyle.contentStyle.copyWith(
                                            color: AppColorData.subBodyTextClr,
                                          ),
                                        ),
                                        Flexible(
                                          child: Row(
                                            children: [
                                              Flexible(
                                                child: CommonText(
                                                  text:
                                                      value.selectedCountryCode1?.countryName ??
                                                      'United States',
                                                  style: AppTextStyle.bodyTextStyle.copyWith(
                                                    fontWeight: FontWeight.w400,
                                                  ),
                                                  overflow: TextOverflow.ellipsis,
                                                ),
                                              ),
                                              SizedBox(width: 10),
                                              CommonText(
                                                text: "+${value.selectedCountryCode1?.phoneCode ?? '1'}",
                                                style: AppTextStyle.bodyTextStyle.copyWith(
                                                  fontWeight: FontWeight.w400,
                                                ),
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                CommonTextFromField(
                                  showCursor: widget.phoneNumber.isNotEmpty ? false : true,
                                  readOnly: widget.phoneNumber.isNotEmpty ? true : false,
                                  controller: phoneController,
                                  errorMessage: phoneController.text.isEmpty
                                      ? ""
                                      : value.validatePhonenumber(value: phoneController.text) == true
                                      ? ""
                                      : "Enter valid number",
                                  onChanged: (val) {
                                    value.checkButtonEnabled();
                                  },
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
                                  keyboardType: TextInputType.phone,
                                  border: Border.all(color: AppColorData.boxBorder),
                                  borderRadius: BorderRadius.vertical(bottom: Radius.circular(10)),
                                  labelText: tr("phoneNumber"),
                                  contentPadding: EdgeInsets.symmetric(horizontal: 14),
                                ),
                              ],
                            );
                          },
                        ),
                      ),
                      doubleSpacer(height: 15),
                      CommonTextFromField(
                        showCursor: widget.email.isNotEmpty ? false : true,
                        readOnly: widget.email.isNotEmpty ? true : false,
                        controller: emailController,
                        errorMessage: emailController.text.isEmpty
                            ? ""
                            : AppValidators().validateEmail(emailController.text) ?? "",
                        onChanged: (val) {
                          value.checkButtonEnabled();
                        },
                        keyboardType: TextInputType.emailAddress,

                        contentPadding: const EdgeInsets.symmetric(horizontal: 14),
                        border: Border.all(color: AppColorData.boxBorder),
                        borderRadius: BorderRadius.circular(10),
                        labelText: tr("eMail"),
                        //  hintText:" ${mobileNumber}",
                      ),
                      doubleSpacer(height: 15),
                      CommonTextFromField(
                        controller: passWordController,
                        errorMessage: passWordController.text.isEmpty
                            ? ""
                            : AppValidators().validatePassword(passWordController.text) ?? "",
                        onChanged: (val) {
                          value.checkButtonEnabled();
                        },
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14),
                        border: Border.all(color: AppColorData.boxBorder),
                        borderRadius: BorderRadius.circular(10),
                        labelText: tr("psWord"),
                        obscureText: value.passwordObscure,
                        suffixIcon: IconButton(
                          onPressed: () {
                            value.togglePasswordObscure();
                          },
                          icon: value.passwordObscure
                              ? CommonText(
                                  text: "show",
                                  style: TextStyle(color: AppColorData.bodyTextColor),
                                )
                              : CommonText(
                                  text: "hide",
                                  style: TextStyle(color: AppColorData.bodyTextColor),
                                ),
                        ),
                      ),
                      // spacer(),
                      doubleSpacer(height: 15),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          CustomCheckbox(
                            value: value.isChecked,
                            onChanged: (val) {
                              value.toggleCheckbox(val!);
                            },
                          ),
                          //Flexible(child: _textSpan()),
                          Flexible(
                            child: CommonText(text: "psWordSub", style: AppTextStyle.contentStyle),
                          ),
                        ],
                      ),
                      const SizedBox(height: 23),
                      CommonElevatedButton(
                        showLoader: true,
                        isLoad: value.state == ViewState.secondaryLoader,
                        elevatedButtonName: "agreeKeyWord",
                        elevatedButtonColor: getButtonAccess()
                            ? AppColorData.blackButtonClr
                            : AppColorData.disableButtonClr,
                        onTap: () async {
                          FocusManager.instance.primaryFocus?.unfocus();

                          if (value.isChecked) {
                            if (getButtonAccess()) {
                              await value.userRegister(
                                firstName: firstNameController.text,
                                lastName: lastNameController.text,
                                dob: birthDayController.text,
                                phoneNo: phoneController.text,
                                email: emailController.text,
                                password: passWordController.text,
                                phoneCode:
                                    loginViewModel.selectedCountryCode1?.phoneCode ?? widget.countryCode,
                              );

                              Logger.appLogs("response >>>>>>>>> ${value.registerResponseModel?.message}");

                              if (value.registerResponseModel?.statusCode == 200) {
                                await Future.delayed(const Duration(seconds: 1));
                                if (mounted) {
                                  if (widget.isBottomSheet == true) {
                                    Navigator.pop(context);
                                  } else {
                                    Get.toNamed(
                                      RouterName.dashBoard,
                                      arguments: {
                                        RouterArguments.token: value.registerResponseModel?.data.user.token,
                                      },
                                    );
                                  }
                                }
                              }
                            } else {
                              print("button access disabled");
                            }
                          } else {
                            ToastUtil.showShortToast(context, "selectAgreeAndContinue");
                          }
                        },
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 14),
            ],
          ),
        );
      },
    );
  }
}

Widget spacer() {
  return SizedBox(height: 10);
}
