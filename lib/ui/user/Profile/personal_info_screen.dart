import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/user/user_response_model.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_libphonenumber/flutter_libphonenumber.dart';
import 'package:provider/provider.dart';

import '../dashBoard/searchBar.dart';

class PersonalInfoScreen extends StatefulWidget {
  final UserResponseModel userModel;

  const PersonalInfoScreen({super.key, required this.userModel});

  @override
  State<PersonalInfoScreen> createState() => _PersonalInfoScreenState();
}

class _PersonalInfoScreenState extends State<PersonalInfoScreen> {
  TextEditingController firstNameController = TextEditingController();
  TextEditingController lastNameController = TextEditingController();
  TextEditingController phoneController = TextEditingController();
  TextEditingController emailController = TextEditingController();

  EditProfileViewModel? editProfileViewModel;
  CommonViewModel? commonViewModel;

  @override
  void initState() {
    init();
    editProfileViewModel = Provider.of<EditProfileViewModel>(context, listen: false);
    commonViewModel = Provider.of<CommonViewModel>(context, listen: false);
    firstNameController.text = widget.userModel.data?.userDetail?.firstname ?? '';
    lastNameController.text = widget.userModel.data?.userDetail?.lastname ?? '';
    phoneController.text = widget.userModel.data?.userDetail?.phone ?? '';
    emailController.text = widget.userModel.data?.userDetail?.email ?? '';
    editProfileViewModel!.selectedCountryCode1 = CountryWithPhoneCode.getCountryDataByPhone(
      "+${widget.userModel.data?.userDetail?.phoneCode}${widget.userModel.data?.userDetail?.phone}",
    );
    super.initState();
  }

  TextEditingController _searchController = TextEditingController();
  List<CountryWithPhoneCode> _countries = [];
  List<CountryWithPhoneCode> _filteredCountries = [];

  @override
  void dispose() {
    editProfileViewModel!.toggleAll(refresh: false);
    editProfileViewModel?.selectedCountryCode1?.phoneCode == null;
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<EditProfileViewModel>(
      builder: (context, value, child) {
        return Scaffold(
          backgroundColor: AppColorData.appSecondaryColor,
          body: SafeArea(
            child: CustomScrollView(
              slivers: [
                SliverAppBar(
                  pinned: true,
                  expandedHeight: 140,
                  flexibleSpace: CommonSliverAppBar(title: "personalInfo", scrolledFontSize: 25),
                ),
                SliverToBoxAdapter(child: _renderBody()),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _renderBody() {
    return Consumer<EditProfileViewModel>(
      builder: (context, value, child) {
        bool getDisabled(int index) {
          if (index == 0) {
            if (value.isPhoneExpand || value.isEmailExpand) {
              return true;
            }
          } else if (index == 1) {
            if (value.isLegalNameExpand || value.isEmailExpand) {
              return true;
            }
          } else if (index == 2) {
            if (value.isLegalNameExpand || value.isPhoneExpand) {
              return true;
            }
          }

          return false;
        }

        var sensitive = commonViewModel?.settingsResponseModel?.data?.hiddenSettings?.sensitive;
        var phoneNumber = value.userResponseModel?.data?.userDetail?.phone;
        var email = value.userResponseModel?.data?.userDetail?.email;

        Logger.appLogs("isdisabled >>>>> ${getDisabled(0)}");

        return SingleChildScrollView(
          child: Padding(
            padding: horizontalPadding(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                doubleSpacer(),
                AnimatedCrossFade(
                  firstChild: getFirstChild(
                    title: "legalName",
                    isDisabled: getDisabled(0),
                    viewModel: value,
                    onTap: () {
                      value.toggleLegalName();
                    },
                    subTitle:
                        // value.userResponseModel?.data?.userDetail?.fullname ?? ''
                        "${value.userResponseModel?.data?.userDetail?.firstname ?? ''} ${value.userResponseModel?.data?.userDetail?.lastname ?? ''}",
                  ),
                  secondChild: getSecondChild(
                    title: "legalName",
                    onCancel: () {
                      firstNameController.text = value.userResponseModel?.data?.userDetail?.firstname ?? "";
                      lastNameController.text = value.userResponseModel?.data?.userDetail?.lastname ?? "";

                      value.toggleAll();
                    },
                    viewModel: value,
                    controller: firstNameController,
                    onSave: () async {
                      (firstNameController.text.isNotEmpty)
                          ? value.body["firstname"] = firstNameController.text.trim()
                          : null;
                      (lastNameController.text.isNotEmpty)
                          ? value.body["lastname"] = lastNameController.text.trim()
                          : null;
                      value.profileUpdate(
                        onSuccess: () {
                          value.toggleAll();
                        },
                      );
                    },
                    lastNameController: lastNameController,
                  ),
                  crossFadeState: value.isLegalNameExpand
                      ? CrossFadeState.showSecond
                      : CrossFadeState.showFirst,
                  duration: Duration(milliseconds: 150),
                ),
                AnimatedCrossFade(
                  firstChild: getFirstChild(
                    title: "phoneNumber",
                    isDisabled: getDisabled(1),
                    viewModel: value,
                    onTap: () {
                      value.togglePhone();
                    },
                    subTitle: (sensitive == "1") ? getMaskPhoneNumber("${phoneNumber}") : phoneNumber ?? '',
                  ),
                  secondChild: getSecondChild(
                    title: "phoneNumber",
                    errorMessage: phoneController.text.isEmpty
                        ? ""
                        : editProfileViewModel?.validatePhonenumber(value: phoneController.text) ?? "",
                    onCancel: () {
                      phoneController.text = value.userResponseModel?.data?.userDetail?.phone ?? "";

                      value.toggleAll();
                    },
                    viewModel: value,
                    keyboardType: .number,
                    controller: phoneController,
                    onSave: () async {
                      if (editProfileViewModel?.validatePhonenumber(value: phoneController.text) == "") {
                        (phoneController.text.isNotEmpty)
                            ? value.body["phone"] = phoneController.text.trim()
                            : null;
                        (editProfileViewModel!.selectedCountryCode1!.phoneCode.isNotEmpty)
                            ? value.body["phoneCode"] =
                                  "+${editProfileViewModel?.selectedCountryCode1!.phoneCode}"
                            : null;
                        value.profileUpdate(
                          onSuccess: () {
                            value.toggleAll();
                          },
                        );
                      }
                    },
                  ),
                  crossFadeState: value.isPhoneExpand ? CrossFadeState.showSecond : CrossFadeState.showFirst,
                  duration: Duration(milliseconds: 150),
                ),
                AnimatedCrossFade(
                  firstChild: getFirstChild(
                    title: "email",
                    isDisabled: getDisabled(2),
                    viewModel: value,
                    onTap: () {
                      value.toggleEmail();
                    },
                    subTitle: (sensitive == "1") ? getMaskEmail("${email}") : email ?? '',
                  ),
                  secondChild: getSecondChild(
                    title: "email",
                    errorMessage: emailController.text.isEmpty
                        ? ""
                        : AppValidators().validateEmail(emailController.text) ?? "",
                    onCancel: () {
                      emailController.text = value.userResponseModel?.data?.userDetail?.email ?? "";

                      value.toggleAll();
                    },
                    viewModel: value,
                    keyboardType: .emailAddress,
                    controller: emailController,
                    onSave: () async {
                      if (emailController.text.isEmpty || AppValidators().isEmail(emailController.text)) {
                        (emailController.text.isNotEmpty)
                            ? value.body["email"] = emailController.text.trim()
                            : null;
                        value.profileUpdate(
                          onSuccess: () {
                            value.toggleAll();
                          },
                        );
                      } else {
                        print("invalid email");
                      }
                    },
                  ),
                  crossFadeState: value.isEmailExpand ? CrossFadeState.showSecond : CrossFadeState.showFirst,
                  duration: Duration(milliseconds: 150),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget getFirstChild({
    required String title,
    required String subTitle,
    required EditProfileViewModel viewModel,
    required bool isDisabled,
    void Function()? onTap,
  }) {
    return IgnorePointer(
      ignoring: isDisabled,
      child: Opacity(
        opacity: isDisabled ? 0.2 : 1,
        child: AnimatedContainer(
          duration: Duration(milliseconds: 300),
          child: ListTileWidget(
            titleText: title,
            trailingWidget: InkWell(
              onTap: onTap,
              child: CommonText(
                isUnderline: true,
                text: subTitle.isEmpty ? "add" : "edit",
                style: AppTextStyle.subBodyStyle,
              ),
            ),
            subTitle: subTitle,
          ),
        ),
      ),
    );
  }

  void _filterCountries(String query) {
    _filteredCountries = _countries.where((country) {
      final nameLower = country.countryName?.toLowerCase() ?? '';
      final codeLower = country.phoneCode.toLowerCase();
      final queryLower = query.toLowerCase().replaceAll('+', '');
      return nameLower.contains(queryLower) || codeLower.contains(queryLower);
    }).toList();
    editProfileViewModel?.notify();
  }

  Widget getSecondChild({
    required String title,
    required EditProfileViewModel viewModel,
    required TextEditingController controller,
    TextEditingController? lastNameController,
    void Function()? onCancel,
    TextInputType? keyboardType,
    String errorMessage = "",
    required dynamic Function()? onSave,
  }) {
    return AnimatedContainer(
      curve: Curves.bounceInOut,
      duration: Duration(seconds: 5),
      width: MediaQuery.of(context).size.width,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          doubleSpacer(height: 5),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              CommonText(text: title, style: AppTextStyle.bodyTextStyle),
              InkWell(
                onTap: onCancel,
                child: CommonText(isUnderline: true, text: "cancel", style: AppTextStyle.subBodyStyle),
              ),
            ],
          ),
          if (title == "phoneNumber")
            GestureDetector(
              /*  onTap: () {
                        countryPicker(value, context);
                      },*/
              onTap: () async {
                _countries = CountryManager().countries
                  ..sort((final a, final b) => (a.countryName ?? '').compareTo(b.countryName ?? ''));
                _filteredCountries = _countries;
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
                                      keyboardType: keyboardType ?? TextInputType.text,
                                      controller: _searchController,
                                      decoration: InputDecoration(
                                        hintText: '',
                                        prefixIcon: Icon(Icons.search),
                                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                                      ),
                                      onChanged: (val) {
                                        setModalState(() {
                                          _filterCountries(val);
                                        });
                                      },
                                      autofocus: true,
                                      inputFormatters: [
                                        FilteringTextInputFormatter.allow(RegExp(r'[a-zA-Z0-9\s\+]+')),
                                      ],
                                    ),
                                  ),
                                  Expanded(
                                    child: ListView.builder(
                                      shrinkWrap: true,
                                      padding: const EdgeInsets.symmetric(vertical: 16),
                                      itemBuilder: (final context, final index) {
                                        final item = _filteredCountries[index];
                                        return GestureDetector(
                                          behavior: HitTestBehavior.opaque,
                                          onTap: () {
                                            Navigator.of(context).pop(item);
                                          },
                                          child: Padding(
                                            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
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
                                                Expanded(flex: 8, child: Text(item.countryName ?? '')),
                                              ],
                                            ),
                                          ),
                                        );
                                      },
                                      itemCount: _filteredCountries.length,
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
                print('New country selection1: ${_filteredCountries.length}');

                if (res != null) {
                  editProfileViewModel?.selectedCountryCode1 = res;
                  phoneController.clear();
                  editProfileViewModel?.notify();
                }
              },
              child: Container(
                height: 60,
                padding: horizontalPadding(horizontal: 10),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.all(Radius.circular(10)),
                  border: Border.all(color: AppColorData.boxBorder),
                ),
                child: Row(
                  //mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Flexible(
                      child: Row(
                        children: [
                          Flexible(
                            child: CommonText(
                              text: editProfileViewModel?.selectedCountryCode1?.countryName ?? '',
                              style: AppTextStyle.bodyTextStyle.copyWith(fontWeight: FontWeight.w400),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          SizedBox(width: 10),
                          CommonText(
                            text:
                                "${editProfileViewModel?.selectedCountryCode1?.phoneCode ?? '${widget.userModel.data?.userDetail?.phoneCode ?? ''}'}",
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
          spacer(),
          CommonTextFromField(
            contentPadding: const EdgeInsets.symmetric(horizontal: 14),
            controller: controller,
            border: Border.all(color: AppColorData.boxBorder),
            labelText: tr(title),
            errorMessage: errorMessage,
            inputFormatters: (title == "phoneNumber")
                ? [
                    FilteringTextInputFormatter.digitsOnly,
                    LibPhonenumberTextFormatter(
                      phoneNumberType: PhoneNumberType.mobile,
                      phoneNumberFormat: PhoneNumberFormat.international,
                      country: editProfileViewModel?.selectedCountryCode1 ?? CountryWithPhoneCode.us(),
                      inputContainsCountryCode: false,
                      shouldKeepCursorAtEndOfInput: true,
                    ),

                    // LengthLimitingTextInputFormatter(10),
                  ]
                : [],
            onChanged: (val) {
              viewModel.notify();
            },
          ),
          spacer(),
          if (lastNameController != null)
            CommonTextFromField(
              contentPadding: const EdgeInsets.symmetric(horizontal: 14),
              controller: lastNameController,
              border: Border.all(color: AppColorData.boxBorder),
              labelText: tr("lName"),
              onChanged: (val) {
                viewModel.notify();
              },
            ),
          spacer(),
          Container(
            width: MediaQuery.of(context).size.width * 0.25,
            child: CommonElevatedButton(
              showLoader: true,
              isLoad: viewModel.state == ViewState.secondaryLoader,
              // elevatedButtonColor: getChangedButtonColor(index),
              elevatedButtonColor: AppColorData.blackButtonClr,
              elevatedButtonName: "save",
              onTap: onSave,
            ),
          ),
          divider(),
        ],
      ),
    );
  }
}
