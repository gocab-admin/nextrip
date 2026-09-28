import 'dart:developer';

import 'package:airstar_flutter/data/models/user/settings_response_model.dart';
import 'package:airstar_flutter/data/repositories/user/home_repo.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

import '../../utils/utils.dart';

class CommonViewModel extends BaseViewModel {
  //Repository
  final HomeRepository _homeRepository = locator<HomeRepository>();
  final storage = locator<AppSecureStorage>();

  //Model
  SettingsResponseModel? _settingsResponseModel;

  SettingsResponseModel? get settingsResponseModel => _settingsResponseModel;

  Future<void> fetchSettings() async {
    setState(ViewState.busy);
    try {
      var data = await _homeRepository.fetchSettings();
      if (data != null) {
        _settingsResponseModel = data;
        storage.writeSecureData(
          PrefConstant.google_api_key,
          data.data?.google?.mapApiKey ?? '',
        );
        storage.writeSecureData(
          PrefConstant.stripe_secret_key,
          data.data!.paymentGateway!.kkSecret!,
        );
        storage.writeSecureData(
          PrefConstant.razorpay_key,
          data.data!.razorPayGateway!.razorpayKeyId!,
        );
        storage.writeSecureData(
          PrefConstant.stripe_publishable_key,
          data.data!.paymentGateway!.publishableKey!,
        );
        String? modifiedString =
            data.data?.site?.language ??
            "en-us"
                .split(' ')
                .map(
                  (lang) => lang.split('-')[0],
                ) // Keep only the language part
                .join(' ');
        storage.writeSecureData(PrefConstant.default_language, modifiedString);
        storage.writeSecureData(
          PrefConstant.booking_type,
          data.data?.hiddenSettings?.hourlyBooking ?? "Both",
        );
        storage.writeSecureData(
          PrefConstant.dateFormat,
          data.data?.hiddenSettings?.dateFormat ?? "",
        );
        storage.writeSecureData(
          PrefConstant.peopleCount,
          data.data?.hiddenSettings?.peopleCount ?? "1",
        );
        if (!kIsWeb) {
          _updateManifestApiKey(data.data?.google?.mapApiKey ?? '');
        }
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  String? userToken;

  getToken() async {
    userToken = await storage.readSecureData(PrefConstant.authToken);
    // userToken = await PreferenceHelper.getString(PrefConstant.authToken);
    notify();
    log("token :: $userToken");
    log("token != null :: ${userToken}");
  }

  Future<void> _updateManifestApiKey(String apiKey) async {
    // Use platform channels to update manifest dynamically
    const platform = MethodChannel('api_key_channel');
    try {
      // await platform.invokeMethod('setApiKey', {'apiKey': apiKey});
      await platform.invokeMethod('setApiKey', {
        'apiKey': "AIzaSyCgX8fVnxc1Kajx4nNrGsgfdaws59A3Gk4",
      });
    } catch (e) {
      print('Failed to update manifest: $e');
    }
  }
}
