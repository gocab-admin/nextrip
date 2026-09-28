import 'dart:io';

import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/user/register_response_model.dart';
import 'package:airstar_flutter/data/models/user/user_response_model.dart';
import 'package:airstar_flutter/data/repositories/user/register_repo.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:dio/dio.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:http_parser/http_parser.dart';
import 'package:path/path.dart' as path;

class RegisterViewModel extends BaseViewModel {
  final RegisterRepository _registerRepository = locator<RegisterRepository>();

  RegisterResponseModel? _registerResponseModel;
  UserResponseModel? _userResponseModel;

  RegisterResponseModel? get registerResponseModel => _registerResponseModel;
  UserResponseModel? get userResponseModel => _userResponseModel;

  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;

  bool isChecked = false;
  bool passwordObscure = true;

  toggleCheckbox(bool value) {
    isChecked = value;
    notify();
  }

  togglePasswordObscure() {
    passwordObscure = !passwordObscure;
    notify();
  }

  checkButtonEnabled() {
    notify();
  }

  Future<void> getFCMToken() async {
    final AppSecureStorage storage = locator<AppSecureStorage>();
    String? fcmId;
    if (kIsWeb) {
      fcmId = await _firebaseMessaging.getToken(vapidKey: AppConstant.vapidKey);
    } else {
      fcmId = await _firebaseMessaging.getToken();
    }
    // var fcmId = await _firebaseMessaging.getToken(
    //   vapidKey: AppConstant.vapidKey,
    // );
    await storage.writeSecureData(PrefConstant.fcmToken, fcmId!);
    Logger.appLogs("Create Fcm ID:: $fcmId");
  }

  // AppValidators appValidators = AppValidators();
  Future<RegisterResponseModel?> userRegister({
    required String phoneNo,
    String? phoneCode,
    required String password,
    required String email,
    required String lastName,
    required String firstName,
    required String dob,
  }) async {
    setState(ViewState.secondaryLoader);
    try {
      await getFCMToken();
      final AppSecureStorage storage = locator<AppSecureStorage>();
      var fcmToken = await storage.readSecureData(PrefConstant.fcmToken);
      Logger.appLogs("fcmToken :: $fcmToken");
      var data = await _registerRepository.userRegister(
        dob: dob,
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        phoneCode: phoneCode,
        phoneNo: phoneNo,
        fcmId: fcmToken,
      );

      if (data != null) {
        _registerResponseModel = data;
        AppConstant.authToken = "${registerResponseModel!.data.user.token}";
        PreferenceHelper.setString(
          PrefConstant.authToken,
          registerResponseModel!.data.user.token,
        );
        PreferenceHelper.setString(
          PrefConstant.userId,
          registerResponseModel!.data.user.id,
        );
        var storage = AppSecureStorage.getInstance();
        storage.writeSecureData(
          PrefConstant.authToken,
          registerResponseModel!.data.user.token,
        );
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

  Future<UserResponseModel?> fetchUser() async {
    setState(ViewState.busy);
    try {
      var data = await _registerRepository.fetchUserProfile();

      if (data != null) {
        _userResponseModel = data;

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

  Future<void> profileUpload({
    required String userId,
    required File file,
  }) async {
    setState(ViewState.busy);
    String fileName = path.basename(file.path);
    String mimeType = getMimeType(fileName);

    FormData formData = FormData.fromMap({
      "file": await MultipartFile.fromFile(
        file.path,
        filename: fileName,
        contentType: MediaType.parse(mimeType),
      ),
    });
    try {
      var data = await _registerRepository.profileUpdate(
        userId: userId,
        formData: formData,
      );
      fetchUser();
      ToastUtil.showMessage(Strings.profileImageUpdated);
      setState(ViewState.idle);

      print(data);
    } on AppException catch (appException) {
      // Logger.appLogs('errorType :: ${appException.error}');
      // Logger.appLogs('onFailure :: $appException');
      errorMsg = errorHandler(appException);

      setState(ViewState.idle);
    }
  }
}
