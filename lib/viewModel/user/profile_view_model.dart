import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/user/password_update_model.dart';
import 'package:airstar_flutter/data/models/user/profile_update_model.dart';
import 'package:airstar_flutter/data/models/user/user_response_model.dart';
import 'package:airstar_flutter/data/repositories/user/register_repo.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:dio/dio.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_libphonenumber/flutter_libphonenumber.dart';
import 'package:get/route_manager.dart';
import 'package:package_info_plus/package_info_plus.dart';

import '../../data/models/user/currency_response_model.dart';
import '../../routes/router_name.dart';
import '../../services/notification_service.dart';
import '../../services/signin_with_google_service.dart';
import '../../ui/user/Profile/Profile_main_Screen.dart';
import '../../utils/utils.dart';

class EditProfileViewModel extends BaseViewModel {
  String? versionNumber;
  CountryWithPhoneCode? selectedCountryCode1;
  //
  // String? validatePhonenumber({String? value}) {
  //   if(value != null && value.isNotEmpty){
  //     String? value1 =  "+${selectedCountryCode1?.phoneCode} $value";
  //     int? expectedLength = selectedCountryCode1?.exampleNumberFixedLineInternational.length;
  //     print("expectedLength ::: $expectedLength :::\n value1 :: ${value1.length} $value1");
  //
  //     String isValid = value1.length == expectedLength? "": "phone number not valid";
  //     return isValid;
  //   }else{
  //    return AppValidators().validateMobileNumber(value!)!;
  //   }
  // }
  final SignInWithGoogleService _signInWithGoogleService =
      SignInWithGoogleService();

  String? validatePhonenumber({String? value}) {
    if (value != null && value.isNotEmpty) {
      // Remove spaces from the value
      String cleanedValue = value.replaceAll(' ', '');

      if (selectedCountryCode1 == null) {
        print("selectedCountryCode1 is NULL - Retrying...");
        return null; // Or handle with an error message
      }

      String? value1 = "+${selectedCountryCode1?.phoneCode}$cleanedValue";
      int? expectedLength = selectedCountryCode1
          ?.exampleNumberMobileInternational
          .replaceAll(' ', '')
          .length;

      print(
        "expectedLength ::: $expectedLength :::\n value1 :: ${value1.length} $value1",
      );

      String isValid = value1.length == expectedLength
          ? ""
          : "phone number not valid";
      return isValid;
    } else {
      return AppValidators().validateMobileNumber(value!)!;
    }
  }

  bool isTextEmpty = true;

  void updateTextStatus(String text) {
    isTextEmpty = text.isEmpty;
    notifyListeners();
  }

  // Make sure to call this method when you initialize the controller or update text
  void initializeController(TextEditingController controller) {
    controller.addListener(() {
      updateTextStatus(controller.text);
    });
  }

  Future<void> fetchVersionNumber() async {
    PackageInfo packageInfo = await PackageInfo.fromPlatform();
    versionNumber = "${packageInfo.version}";
    //versionNumber = "${packageInfo.version}(${packageInfo.buildNumber})";
    notifyListeners(); // Notify listeners after updating the version number
  }

  final RegisterRepository _registerRepository = locator<RegisterRepository>();

  UserResponseModel? _userResponseModel;
  PasswordUpdateResponseModel? _passwordUpdateResponseModel;
  ProfileUpdateResponseModel? _profileUpdateResponseModel;

  UserResponseModel? get userResponseModel => _userResponseModel;
  PasswordUpdateResponseModel? get passwordUpdateResponseModel =>
      _passwordUpdateResponseModel;
  ProfileUpdateResponseModel? get profileUpdateResponseModel =>
      _profileUpdateResponseModel;

  TextEditingController schoolNameController = TextEditingController();
  TextEditingController myWorkController = TextEditingController();
  // TextEditingController liveController = TextEditingController();
  TextEditingController langSpeakController = TextEditingController();
  TextEditingController bornController = TextEditingController();
  TextEditingController songController = TextEditingController();
  TextEditingController obessionController = TextEditingController();
  TextEditingController funFactController = TextEditingController();
  TextEditingController bioTitleController = TextEditingController();
  TextEditingController hobbiesController = TextEditingController();
  Map<String, dynamic> body = {};
  // String inputText = '';
  List<ProfileList> profileList = [];
  // int? personalIfoExpandedIndex;

  //-------login & Security variables---------
  bool isSecurityExpanded = false;
  bool isSecurityActive = false;
  bool currentPasswordObscure = false;
  bool newPasswordObscure = false;
  bool confirmPasswordObscure = false;
  GlobalKey<FormState> formKey = GlobalKey<FormState>();
  TextEditingController currentPasswordController = TextEditingController();
  TextEditingController newPasswordController = TextEditingController();
  TextEditingController confirmPasswordController = TextEditingController();

  List<SettingsDetails> settingsDetails = [
    SettingsDetails(
      id: 0,
      icon: SVGAssets.profile_icon17,
      data: "personalInformation",
    ),
    SettingsDetails(
      id: 1,
      icon: SVGAssets.profile_icon16,
      data: "loginAndSecurity",
    ),
    SettingsDetails(id: 2, icon: SVGAssets.profile_icon14, data: 'translation'),
    SettingsDetails(id: 3, icon: SVGAssets.profile_icon15, data: 'currency'),
    /*  SettingsDetails(id: 3, icon: SVGAssets.profile_icon14, data: ''),
    SettingsDetails(
        id: 3, icon: SVGAssets.profile_icon13, data: "notifications"),
     SettingsDetails(
        id: 2, icon: Icons.payments_outlined, data: 'Payments and Payouts'),
    SettingsDetails(id: 3, icon: Icons.settings, data: 'Accessibility'),
    SettingsDetails(id: 4, icon: Icons.insert_drive_file_sharp, data: 'Taxes'),
    SettingsDetails(id: 5, icon: Icons.g_translate_sharp, data: 'Translation'),
    SettingsDetails(
        id: 6, icon: Icons.notifications_none, data: 'Notifications'),
    SettingsDetails(id: 7, icon: Icons.lock, data: 'Privacy and sharing'),
    SettingsDetails(id: 8, icon: Icons.wallet_travel, data: 'Travel and work'),*/
  ];

  List<LegalDetails> legalDetails = [
    LegalDetails(
      id1: 0,
      icon1: SVGAssets.profile_icon12,
      data1: "termsOfService",
    ),
    LegalDetails(
      id1: 1,
      icon1: SVGAssets.profile_icon12,
      data1: "privacyPolicy",
    ),
    LegalDetails(
      id1: 2,
      icon1: SVGAssets.profile_icon12,
      data1: "deleteAccount",
    ),
    /* LegalDetails(
        id1: 2,
        icon1: Icons.privacy_tip_outlined,
        data1: Strings.openSourceLicenses),*/
  ];

  Future<void> logout() async {
    final NotificationService notificationService = NotificationService();
    try {
      await _signInWithGoogleService.signOut();
    } catch (e) {
      print("Google sign-out failed: $e");
    }
    AppConstant.authToken = null;
    clearAllCaches();
    storage.deleteAllData();
    PreferenceHelper.clear();
    notificationService.disableNotifications();
    Get.offAllNamed(
      RouterName.loginScreen,
      arguments: {RouterArguments.isMain: 'true'},
      predicate: (Route<dynamic> predecate) => false,
    );
  }

  void clearAllCaches() async {
    await CachedNetworkImage.evictFromCache("");
  }

  bool isLegalNameExpand = false;
  bool isPhoneExpand = false;
  bool isEmailExpand = false;

  void toggleLegalName() {
    isLegalNameExpand = true;
    isPhoneExpand = false;
    isEmailExpand = false;
    notify();
  }

  void togglePhone() {
    isLegalNameExpand = false;
    isPhoneExpand = true;
    isEmailExpand = false;
    notify();
  }

  void toggleEmail() {
    isLegalNameExpand = false;
    isPhoneExpand = false;
    isEmailExpand = true;
    notify();
  }

  void toggleAll({bool refresh = true}) {
    isLegalNameExpand = false;
    isPhoneExpand = false;
    isEmailExpand = false;
    if (refresh) {
      notify();
    }
  }

  clearControllerFun() {
    currentPasswordController.clear();
    newPasswordController.clear();
    confirmPasswordController.clear();
  }

  // TextFieldChangeVal(value) {
  //   inputText = value;
  //   notify();
  // }

  securityExpandFun({bool? val = true}) {
    isSecurityExpanded = val ?? true;
    notify();
  }

  securityActiveFun() {
    isSecurityActive = !isSecurityActive;
    notify();
  }

  // closeExpandFun() {
  //   personalIfoExpandedIndex = null;
  //   notify();
  // }

  // addOrEditFun(int index) {
  //   personalIfoExpandedIndex = index;
  //   notify();
  // }

  void addProfileList() {
    profileList = [
      ProfileList(
        id: 0,
        icon: SVGAssets.profile_icon1,
        info: "whereIwentToSchool",
        value: "school",
        controller: schoolNameController,
      ),
      ProfileList(
        id: 1,
        icon: SVGAssets.profile_icon2,
        info: "myWork",
        value: "work",
        controller: myWorkController,
      ),
      // ProfileList(
      //     id: 2,
      //     icon: SVGAssets.profile_icon3,
      //     info: "whereILive",
      //     value: "address",
      //     controller: liveController),
      ProfileList(
        id: 3,
        icon: SVGAssets.profile_icon4,
        info: "languagesISpeak",
        value: "language",
        controller: langSpeakController,
      ),
      /*   ProfileList(
          id: 4,
          icon: SVGAssets.profile_icon5,
          info: Strings.decadeIWasBorn,
          value: "",
          controller: bornController
      ),*/
      ProfileList(
        id: 4,
        icon: SVGAssets.profile_icon6,
        info: "myFavSongInScdndrySchl",
        value: "song",
        controller: songController,
      ),
      ProfileList(
        id: 5,
        icon: SVGAssets.profile_icon7,
        info: "myObession",
        value: "obsessed",
        controller: obessionController,
      ),
      ProfileList(
        id: 6,
        icon: SVGAssets.profile_icon8,
        info: "myFunFact",
        value: "funFact",
        controller: funFactController,
      ),
      ProfileList(
        id: 7,
        value: "bio",
        icon: SVGAssets.profile_icon10,
        info: "myBiographyTitle",
        controller: bioTitleController,
      ),
      ProfileList(
        id: 8,
        value: "hobby",
        icon: SVGAssets.profile_icon11,
        info: "myHobbies",
        controller: hobbiesController,
      ),
    ];
  }

  int calculateHostingPeriod(DateTime date) {
    DateTime currentDate = DateTime.now();

    // Calculate the difference in years and months
    int yearDiff = currentDate.year - date.year;
    int monthDiff = currentDate.month - date.month;

    // Calculate the total difference in months
    int totalMonths = yearDiff * 12 + monthDiff;

    // Logger.appLogs(yearDiff);
    // Logger.appLogs(date.month);

    return totalMonths;
  }

  Future<UserResponseModel?> fetchUserProfile({Function()? successRes}) async {
    setState(ViewState.busy);
    try {
      var data = await _registerRepository.fetchUserProfile();

      if (data != null) {
        _userResponseModel = data;
        schoolNameController.text =
            _userResponseModel?.data?.userDetail?.school ?? '';
        print(
          "schoolNameController :: ${schoolNameController.text} :::: ${_userResponseModel?.data?.userDetail?.school}",
        );
        myWorkController.text =
            _userResponseModel?.data?.userDetail?.work ?? '';
        // liveController.text =
        //     _userResponseModel?.data?.userDetail?.address?.address ?? '';
        langSpeakController.text =
            _userResponseModel?.data?.userDetail?.language ?? '';
        bornController.text = '';
        songController.text = _userResponseModel?.data?.userDetail?.song ?? '';
        obessionController.text =
            _userResponseModel?.data?.userDetail?.obsessed ?? '';
        funFactController.text =
            _userResponseModel?.data?.userDetail?.funFact ?? '';
        bioTitleController.text =
            _userResponseModel?.data?.userDetail?.bio ?? '';
        hobbiesController.text =
            _userResponseModel?.data?.userDetail?.hobby ?? '';

        final userMode =
            _userResponseModel?.data?.userDetail?.mode ?? "traveller";
        await PreferenceHelper.setString(PrefConstant.userMode, userMode);

        successRes!() ?? () {};
        setState(ViewState.success);
      } else {
        setState(ViewState.idle);
      }
    } on AppException catch (appException) {
      // Logger.appLogs('errorType :: ${appException.error}');
      // Logger.appLogs('onFailure :: $appException');
      errorMsg = errorHandler(appException);

      setState(ViewState.idle);
    }
    return null;
  }

  Future<ProfileUpdateResponseModel?> profileUpdate({
    Function()? onSuccess,
  }) async {
    setState(ViewState.secondaryLoader);
    FormData formData = FormData.fromMap(body);
    try {
      String userid = await PreferenceHelper.getString(PrefConstant.userId);
      var data = await _registerRepository.profileUpdate(
        userId: userid,
        formData: formData,
      );
      if (data != null) {
        _profileUpdateResponseModel = data;
        onSuccess!();
        fetchUserProfile(successRes: () {});
      }

      //ToastUtil.showMessage("Profile image updated");
      setState(ViewState.idle);

      print(data);
    } on AppException catch (appException) {
      // Logger.appLogs('errorType :: ${appException.error}');
      // Logger.appLogs('onFailure :: $appException');
      errorMsg = errorHandler(appException);

      setState(ViewState.idle);
    }
    body.clear();
    return null;
  }

  Future<PasswordUpdateResponseModel?> fetchUpdatePassword() async {
    setState(ViewState.secondaryLoader);
    try {
      var data = await _registerRepository.fetchPasswordUpdate(
        body: {
          "currentPassword": currentPasswordController.text,
          "newPassword": confirmPasswordController.text,
        },
      );

      if (data != null) {
        _passwordUpdateResponseModel = data;
        if (_passwordUpdateResponseModel?.statusCode == 200) {
          clearControllerFun();
          ToastUtil.showMessage(_passwordUpdateResponseModel?.message ?? '');
          securityExpandFun(val: false);
        }
        setState(ViewState.success);
      } else {
        setState(ViewState.idle);
      }
    } on AppException catch (appException) {
      // Logger.appLogs('errorType :: ${appException.error}');
      // Logger.appLogs('onFailure :: $appException');
      errorMsg = errorHandler(appException);

      setState(ViewState.idle);
    }
    return null;
  }

  Future<bool> deleteAccount() async {
    try {
      String userid = await PreferenceHelper.getString(PrefConstant.userId);
      var res = await _registerRepository.deleteAccount(userId: userid);
      ToastUtil.showMessage(res['message']);
      return res['status'];
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
    }
    return false;
  }

  Future<bool> logoutAccount() async {
    try {
      var res = await _registerRepository.logoutAccount();
      ToastUtil.showMessage(res['message']);
      return res['status'];
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
    }
    return false;
  }

  Future<bool?> updateUserMode({String? userMode}) async {
    setState(ViewState.busy);

    try {
      var data = _registerRepository.updateUserMode(userMode: userMode);
      setState(ViewState.success);
      return data;
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return false;
  }

  Color deactivateButtonColor = AppColorData.deactivateButtonClr;

  void changeDeactivateButtonColor() {
    deactivateButtonColor =
        AppColorData.blackButtonClr; // Or any other color you want
    notifyListeners();
  }

  //<---------------------language change ------------------------>
  Locale? selectedLanguage;
  List<Languages> languages = [
    Languages(Strings.english, Locale('en')),
    Languages(Strings.tamil, Locale('ta')),
    Languages(Strings.hindi, Locale('hi')),
    Languages(Strings.french, Locale('fr')),
    Languages(Strings.spanish, Locale('es')),
    Languages(Strings.arabic, Locale('ar')),
    Languages(Strings.thai, Locale('th')),
    Languages(Strings.indonesian, Locale('id')),
    Languages(Strings.japanese, Locale('ja')),
    Languages(Strings.dutch, Locale('nl')),
    Languages(Strings.portuguese, Locale('pt')),
    Languages(Strings.vietnamese, Locale('vi')),
    Languages(Strings.chinese, Locale('zh')),
  ];

  getOldLang() async {
    var storage = AppSecureStorage.getInstance();

    var oldLang = await storage.readSecureData(PrefConstant.currentLanguage);
    if (oldLang != null) {
      selectedLanguage = Locale('${oldLang}');
    } else {
      selectedLanguage = Locale('en');
    }
    notify();
  }

  setNewLang(Locale locale) async {
    if (selectedLanguage != locale) {
      selectedLanguage = locale;
    }
    notify();
  }

  Future<void> updateSelectedLanguage(BuildContext context) async {
    setState(ViewState.busy);
    try {
      if (selectedLanguage == null) {
        setState(ViewState.idle);
        return;
      }

      await context.setLocale(selectedLanguage!);

      Get.updateLocale(selectedLanguage!);

      var storage = AppSecureStorage.getInstance();
      await storage.writeSecureData(
        PrefConstant.currentLanguage,
        selectedLanguage!.languageCode,
      );

      setState(ViewState.success);
    } catch (e) {
      print("updateSelectedLanguage error: $e\n");
      setState(ViewState.idle);
    }
  }

  // ------------ currency update --------------

  CurrencyResponseModel? _currencyResponseModel;
  CurrencyResponseModel? get currencyResponseModel => _currencyResponseModel;
  final storage = AppSecureStorage.getInstance();

  Future<void> fetchCurrency() async {
    setState(ViewState.busy);
    try {
      var data = await _registerRepository.fetchCurrency();
      if (data != null) {
        _currencyResponseModel = data;
        var savedCurrencyCode = await storage.readSecureData(
          PrefConstant.currentCurrency,
        );
        if (savedCurrencyCode == null || savedCurrencyCode == '') {
          for (Currency? currency
              in (_currencyResponseModel?.data.currency ?? [])) {
            if (currency?.currencyDefault == true) {
              var defaultCurrencyCode = currency?.code;
              var defaultExchangeRate = currency?.exchangeRate;
              var defaultCurrencySymbol = currency?.symbol;
              storage.writeSecureData(
                PrefConstant.currentCurrency,
                defaultCurrencyCode ?? '',
              );
              storage.writeSecureData(
                PrefConstant.exchangeRate,
                defaultExchangeRate ?? '',
              );
              storage.writeSecureData(
                PrefConstant.currencySymbol,
                defaultCurrencySymbol ?? '',
              );
              break;
            }
          }
        }
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }

    return null;
  }

  int? selectedCurrencyIndex;
  String? savedCurrencyCode;
  String? selectedExchangeRate;
  String? savedCurrencySymbol;

  Future<void> loadSavedCurrency() async {
    savedCurrencyCode = await storage.readSecureData(
      PrefConstant.currentCurrency,
    );

    final currencyList = currencyResponseModel?.data.currency;

    selectedCurrencyIndex = savedCurrencyCode != null
        ? currencyList?.indexWhere((e) => e.code == savedCurrencyCode)
        : currencyList?.indexWhere((e) => e.currencyDefault == true);

    notify();
  }

  Future<void> loadSavedExchangeRate() async {
    selectedExchangeRate = await storage.readSecureData(
      PrefConstant.exchangeRate,
    );
    notify();
  }

  void setNewCurrency(int index) {
    selectedCurrencyIndex = index;
    notify();
  }

  Future<void> updateSelectedCurrency() async {
    setState(ViewState.busy);
    try {
      await Future.delayed(Duration(seconds: 1));
      var selectedIndex = selectedCurrencyIndex;
      if (selectedIndex != null) {
        var selectedCode =
            currencyResponseModel?.data.currency[selectedIndex].code;
        var exchangeRate =
            currencyResponseModel?.data.currency[selectedIndex].exchangeRate;
        var selectedSymbol =
            currencyResponseModel?.data.currency[selectedIndex].symbol;
        if (selectedCode != null) {
          await storage.writeSecureData(
            PrefConstant.currentCurrency,
            selectedCode,
          );
          await storage.writeSecureData(
            PrefConstant.exchangeRate,
            "$exchangeRate",
          );
          await storage.writeSecureData(
            PrefConstant.currencySymbol,
            "$selectedSymbol",
          );
          savedCurrencyCode = selectedCode;
          selectedExchangeRate = exchangeRate;
          savedCurrencySymbol = selectedSymbol;
        }
      }
      setState(ViewState.success);
    } catch (e) {
      setState(ViewState.idle);
    }
  }

  String convertPrice(String? price) {
    final exchangeRate = double.tryParse(selectedExchangeRate ?? '1') ?? 1.0;
    final basePrice = double.tryParse(price ?? '0') ?? 0.0;
    return formatPrice((basePrice * exchangeRate).toStringAsFixed(2));
  }
}

class ProfileList {
  const ProfileList({
    required this.id,
    required this.icon,
    required this.info,
    required this.value,
    required this.controller,
  });

  final int id;
  final String icon;
  final String info;
  final String value;
  final TextEditingController controller;
}

class Languages {
  final String? name;
  final Locale locale;

  Languages(this.name, this.locale);
}
