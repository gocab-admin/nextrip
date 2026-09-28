import 'package:airstar_flutter/data/models/user/login_response_model.dart';
import 'package:airstar_flutter/data/models/user/social_login_response_model.dart';
import 'package:airstar_flutter/data/models/user/user_exist_response_model.dart';
import 'package:airstar_flutter/data/repositories/user/login_repo.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/otp_verify_screen.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/password_verify_screen.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_libphonenumber/flutter_libphonenumber.dart';
import 'package:get/route_manager.dart';
import 'package:google_sign_in/google_sign_in.dart';

import '../../commonWidgets/widget/common_bottom_sheet_widget.dart';
import '../../routes/routes.dart';
import '../../services/signin_with_google_service.dart';
import 'common_viewmodel.dart';

class LoginViewModel extends BaseViewModel {
  final LoginRepository _loginRepository = locator<LoginRepository>();

  LoginResponseModel? _loginResponseModel;
  SocialLoginResponseModel? _socialLoginResponseModel;

  LoginResponseModel? get loginResponseModel => _loginResponseModel;

  SocialLoginResponseModel? get socialLoginResponseModel => _socialLoginResponseModel;

  AppValidators Appvalidators = AppValidators();

  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  final SignInWithGoogleService _signInWithGoogleService = SignInWithGoogleService();
  TextEditingController passwordVerifyController = TextEditingController();
  bool passwordObscure = true;

  void changePasswordVisible() {
    passwordObscure = !passwordObscure;
    notify();
  }

  String? _token;
  String? _userId;

  String? get token => _token;
  String? get userId => _userId;

  Future<void> getToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    _userId = await PreferenceHelper.getString(PrefConstant.userId);
    _token = prefs.getString(PrefConstant.authToken);
    print("UserId :: $_userId");
    print("token :: $_token");
    notify();
  }

  Future<void> getFCMToken() async {
    try {
      final AppSecureStorage storage = locator<AppSecureStorage>();
      String? fcmId;
      if (kIsWeb) {
        fcmId = await _firebaseMessaging.getToken(vapidKey: AppConstant.vapidKey);
      } else {
        fcmId = await _firebaseMessaging.getToken();
      }
      // String? fcmId = await _firebaseMessaging.getToken(
      //   vapidKey: AppConstant.vapidKey,
      // );
      fcmId = fcmId ?? "";
      await storage.writeSecureData(PrefConstant.fcmToken, fcmId);
      Logger.appLogs("Create Fcm ID:: $fcmId");
    } catch (e) {
      // If anything fails, store empty string
      final AppSecureStorage storage = locator<AppSecureStorage>();
      await storage.writeSecureData(PrefConstant.fcmToken, "");

      Logger.appLogs("FCM ERROR → Using empty string $e");
    }
  }

  void clearUserId() {
    _userId = null;
    notify();
  }

  void checkButtonEnabled() {
    notify();
  }

  //--------------------------User Exist Checking Flow-------------------------------------
  bool? userStatus;
  CountryWithPhoneCode? selectedCountryCode1;

  Future<void> fetchListOfCountry(CommonViewModel commonViewModel) async {
    var defaultCountryCode = commonViewModel.settingsResponseModel?.data?.site?.countryCode;
    // Initialize countries list on widget initialization
    countries = CountryManager().countries
      ..sort((final a, final b) => (a.countryName ?? '').compareTo(b.countryName ?? ''));

    // if (selectedCountryCode1 == null && defaultCountryCode != null) {
    //   selectedCountryCode1 ??= findCountryByCode(defaultCountryCode);
    // }
    if (selectedCountryCode1 == null) {
      selectedCountryCode1 = findCountryByCode(defaultCountryCode ?? "US");
    }

    // selectedCountryCode1 ??= findCountryByCode("${defaultCountryCode}");

    filteredCountries = List.from(countries);
  }

  // Helper method to find a country by its ISO code
  CountryWithPhoneCode? findCountryByCode(String code) {
    try {
      return countries.firstWhere((country) => country.countryCode.toUpperCase() == code.toUpperCase());
    } catch (e) {
      // If not found, return null
      return null;
    }
  }

  //Model
  UserExistResponseModel? _userExistResponseModel;

  UserExistResponseModel? get userExistResponseModel => _userExistResponseModel;

  final phoneController = TextEditingController();
  final emailController = TextEditingController();
  bool isEmailLogin = false;

  clearController() {
    phoneController.clear();
    emailController.clear();
  }

  toggleEmailLogin() {
    isEmailLogin = !isEmailLogin;
    if (isEmailLogin == true) {
      phoneController.clear();
    } else {
      emailController.clear();
    }
    notify();
  }
  // final emailPasswordController = TextEditingController();

  bool validateEmail() {
    if (AppValidators().isEmail(emailController.text)) {
      return true;
    }

    return false;
  }

  bool validatePhonenumber({String? value}) {
    if (value != null && value.isNotEmpty) {
      selectedCountryCode1 ??= CountryWithPhoneCode.us();
      String? value1 = "+${selectedCountryCode1?.phoneCode} $value";
      int? expectedLength = selectedCountryCode1?.exampleNumberMobileInternational.length;
      print("expectedLength ::: $expectedLength :::\n value1 :: ${value1.length} $value1");

      if (expectedLength == null || expectedLength == 0) {
        return AppValidators().isMobileNumber(value);
      }

      bool isValid = value1.length == expectedLength ? true : false;
      return isValid;
    } else if (AppValidators().isMobileNumber(phoneController.text)) {
      return true;
    }

    return false;
  }

  void resetState() {
    emailController.clear();
    phoneController.clear();
    notify();
  }

  TextEditingController searchController = TextEditingController();
  List<CountryWithPhoneCode> countries = [];
  List<CountryWithPhoneCode> filteredCountries = [];

  void filterCountries(String query) {
    filteredCountries = countries.where((country) {
      final nameLower = country.countryName?.toLowerCase() ?? '';
      final codeLower = country.phoneCode.toLowerCase();
      final queryLower = query.toLowerCase().replaceAll('+', '');
      return nameLower.contains(queryLower) || codeLower.contains(queryLower);
    }).toList();
    notify();
  }

  Future<UserExistResponseModel?> fetchUserExist({
    required Function(AppException) onFailureRes,
    required Function(UserExistResponseModel) onSuccessRes,
    required String phoneNo,
    required String phoneCode,
    required String email,
    required bool isEmail,
  }) async {
    //Loader State
    setState(ViewState.secondaryLoader);
    try {
      var data;
      if (!isEmail) {
        data = await _loginRepository.fetchUserExist(
          queryParameters: {'phone': phoneNo.replaceAll(RegExp(r'[\s-]'), ''), 'phoneCode': "+${phoneCode}"},
        );
      } else {
        data = await _loginRepository.fetchUserExist(queryParameters: {'email': email});
      }
      _userExistResponseModel = data;
      if (data != null) {
        PreferenceHelper.setBool(PrefConstant.userExistStatus, userExistResponseModel!.status);
        setState(ViewState.success);
        onSuccessRes(userExistResponseModel!);
      } else {
        //Failed
        // onFailureRes();
        //Failure State
        setState(ViewState.idle);
      }
    } on AppException catch (appException) {
      //Common Error Handler
      onFailureRes(appException);
      errorMsg = errorHandler(appException);
      //Idle / Failure State
      setState(ViewState.idle);
    }
    return null;
  }

  onContinueTap(BuildContext context, bool isEmail, bool? isBottomSheet) async {
    {
      FocusManager.instance.primaryFocus?.unfocus();
      // Logger.appLogs("Send OTP button clicked");

      if (phoneController.text.isNotEmpty || emailController.text.isNotEmpty) {
        await fetchUserExist(
          isEmail: isEmail,
          onSuccessRes: (userExistResponseModel) async {
            if (isEmail) {
              if (isBottomSheet == true) {
                Get.back();
                showCustomModalBottomSheet(
                  showDivider: false,
                  showIcon: false,
                  maxHeight: 1.0,
                  // maxHeight: MediaQuery.of(context).size.height,
                  isDismissible: false,
                  enableDrag: false,
                  backgroundColor: AppColorData.appSecondaryColor,
                  context: context,
                  builder: (context) => PasswordVerifyScreen(isBottomSheet: isBottomSheet),
                );
              } else {
                Get.toNamed(RouterName.passwordVerifyScreen);
              }
            } else {
              if (isBottomSheet == true) {
                Get.back();
                showCustomModalBottomSheet(
                  showDivider: false,
                  showIcon: false,
                  maxHeight: 1.0,
                  // maxHeight: MediaQuery.of(context).size.height,
                  isDismissible: false,
                  enableDrag: false,
                  backgroundColor: AppColorData.appSecondaryColor,
                  context: context,
                  builder: (context) => OtpVerifyScreen(
                    isBottomSheet: isBottomSheet,
                    code: "${selectedCountryCode1?.phoneCode ?? "1"}",
                    mobileNumber: phoneController.text,
                  ),
                );
              } else {
                Get.toNamed(
                  RouterName.otpVerifyScreen,
                  arguments: {
                    RouterArguments.code: "${selectedCountryCode1?.phoneCode ?? "1"}",
                    RouterArguments.mobileNumber: phoneController.text.replaceAll(RegExp(r'[\s-]'), ''),
                  },
                );
              }
            }
          },
          onFailureRes: (appException) {
            print("userExistResponseModel?.statusCode :: ${appException.statusCode}");
            if (appException.statusCode == 400) {
              if (isBottomSheet == true) {
                Get.back();
                showCustomModalBottomSheet(
                  showDivider: false,
                  showIcon: false,
                  isDismissible: false,
                  maxHeight: 1.0,
                  enableDrag: false,
                  backgroundColor: AppColorData.appSecondaryColor,
                  context: context,
                  builder: (context) => RegisterScreen(
                    isBottomSheet: isBottomSheet,
                    phoneNumber: phoneController.text,
                    email: emailController.text,
                    countryCode: "${selectedCountryCode1?.phoneCode ?? "1"}",
                  ),
                );
              } else {
                Get.toNamed(
                  RouterName.registerScreen,
                  arguments: {
                    RouterArguments.email: emailController.text,
                    RouterArguments.mobileNumber: phoneController.text,
                    RouterArguments.code: "${selectedCountryCode1?.phoneCode ?? "1"}",
                  },
                );
              }
            }
          },
          phoneNo: phoneController.text,
          phoneCode: "${selectedCountryCode1?.phoneCode ?? '1'}",
          email: emailController.text.replaceAll(' ', ''),
        );
      }
    }
  }

  //---------------------------------------User Login Flow --------------------------------------

  Future<bool> userLogin({
    //  required Function(String) onFailureRes,
    String? phoneNo,
    String? phoneCode,
    String? code,
    required String userType,
    String? email,
    String? password,
    required bool isEmail,
    required bool isHost,
    required bool isGuest,
    // required Map<String, dynamic> body
  }) async {
    if (isGuest) {
      setState(ViewState.guestLogin);
    } else if (isHost) {
      setState(ViewState.hostLogin);
    } else {
      setState(ViewState.secondaryLoader);
    }
    try {
      await getFCMToken();
      final AppSecureStorage storage = locator<AppSecureStorage>();
      var fcmToken = await storage.readSecureData(PrefConstant.fcmToken);
      fcmToken = fcmToken ?? "";
      Logger.appLogs("fcmToken :: $fcmToken");

      LoginResponseModel data = await _loginRepository.userLogin(
        phoneCode: phoneCode ?? "",
        phoneNo: phoneNo ?? "",
        code: code ?? "",
        userType: userType,
        email: email ?? "",
        password: password ?? "",
        fcmId: fcmToken != null ? fcmToken : "",
        isEmail: isEmail,
      );

      _loginResponseModel = data;

      if (data.status == true) {
        AppConstant.authToken = "${socialLoginResponseModel?.data?.socialLogin?.token}";
        PreferenceHelper.setString(PrefConstant.authToken, loginResponseModel!.data.user.token);
        PreferenceHelper.setString(PrefConstant.userId, loginResponseModel!.data.user.id);
        PreferenceHelper.setString(PrefConstant.userMode, data.data.user.mode);
        var storage = AppSecureStorage.getInstance();
        storage.writeSecureData(PrefConstant.authToken, loginResponseModel!.data.user.token);
      }

      // Logger.appLogs('Token stored: ${loginResponseModel!.data.user.token}');
      setState(ViewState.success);
      return data.status;
    } on AppException catch (appException) {
      //  Logger.appLogs('errorType :: ${appException.type}');
      //  Logger.appLogs('onFailure :: $appException');
      errorMsg = errorHandler(appException);

      setState(ViewState.idle);
      return false;
    }
  }

  Future<bool> userForgotPassword({String? email, required bool isEmail}) async {
    setState(ViewState.secondaryLoader);
    try {
      var data = await _loginRepository.userForgotPassword(email: email ?? "", isEmail: isEmail);
      setState(ViewState.success);

      return data;
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return false;
  }

  //----------------------------------- Social Login Flow---------------------------------------

  Future<bool> socialLogin({required String type, String? fcmId, required String accessToken}) async {
    setState(ViewState.secondaryLoader);
    try {
      await getFCMToken();
      final AppSecureStorage storage = locator<AppSecureStorage>();
      var fcmToken = await storage.readSecureData(PrefConstant.fcmToken);
      Logger.appLogs("fcmToken write:: $fcmToken");

      SocialLoginResponseModel? data = await _loginRepository.socialLogin(
        type: type,
        fcmId: fcmToken ?? '',
        accessToken: accessToken,
      );

      _socialLoginResponseModel = data;

      if (data?.status == true) {
        AppConstant.authToken = "${socialLoginResponseModel?.data?.socialLogin?.token}";
        PreferenceHelper.setString(
          PrefConstant.authToken,
          "${socialLoginResponseModel?.data?.socialLogin?.token}",
        );
        PreferenceHelper.setString(
          PrefConstant.userId,
          "${socialLoginResponseModel?.data?.socialLogin?.userId}",
        );
        var storage = AppSecureStorage.getInstance();
        storage.writeSecureData(
          PrefConstant.authToken,
          "${socialLoginResponseModel?.data?.socialLogin?.token}",
        );
      }

      setState(ViewState.success);
      return data?.status ?? false;
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
      return false;
    }
  }

  Future<String?> signInWithGoogle() async {
    try {
      // 1. Sign in with Google
      GoogleSignInAccount gUser = await _signInWithGoogleService.signInWithGoogle();

      Logger.appLogs("Selected Email: ${gUser.email}");
      Logger.appLogs("Selected name: ${gUser.displayName}");

      // 2. Define the scopes you need for the Access Token
      final List<String> scopes = ['email', 'openid', 'profile'];

      // 3. Get the Access Token for the required scopes
      // This uses your custom method that correctly handles authorization.
      String? accessToken = await _signInWithGoogleService.getAccessTokenForScopes(scopes);

      if (accessToken != null) {
        Logger.appLogs("Access Token Retrieved: $accessToken");
        // Return the Access Token to be stored or sent to your API
        return accessToken;
      } else {
        Logger.appLogs('Failed to get Access Token.');
        return null;
      }
    } on GoogleSignInException catch (e) {
      // 4. Handle the 'canceled' error using the exception's description
      if (e.description == 'activity is cancelled by the user.' || e.code.name == 'canceled') {
        Logger.appLogs('Google Sign-In Canceled by User.');
        // Return null without showing a severe error message to the user
        return null;
      }

      // Handle other Google Sign-In exceptions
      Logger.appLogs('Google Sign-In Error: ${e.toString()}');
      return null;
    } catch (e) {
      // Handle any other unexpected errors
      Logger.appLogs('Unexpected Error: ${e.toString()}');
      return null;
    }
  }
}
