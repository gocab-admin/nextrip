import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:phonepe_payment_sdk/phonepe_payment_sdk.dart';

import '../commonWidgets/common_widgets.dart';
import '../utils/utils.dart';

class PhonePeService {
  // Configuration variables
  final String? merchantId;
  final bool isProduction;

  PhonePeService({this.merchantId = "PGTESTPAYUAT", this.isProduction = false});

  // Initialize the PhonePe SDK
  Future<void> initPhonePeSdk() async {
    try {
      final environment = isProduction ? "PRODUCTION" : "SANDBOX";
      final appId = EndPointConstants.applicationId;

      final result = await PhonePePaymentSdk.init(
        environment,
        appId,
        merchantId!,
        !isProduction,
      );

      Logger.appLogs("PhonePe SDK Initialized: $result");
    } catch (e) {
      Logger.appLogs("PhonePe SDK Init Error: $e");
      rethrow;
    }
  }

  Future<bool> startTransaction(
    String orderId,
    String token,
    String appSchema,
  ) async {
    String? msg;
    try {
      Map<String, dynamic> payload = {
        "orderId": orderId,
        "merchantId": merchantId,
        "token": token,
        "paymentMode": {"type": "PAY_PAGE"},
        "deviceContext": {
          "deviceOS": kIsWeb
              ? "WEB"
              : Platform.isIOS
              ? "IOS"
              : "ANDROID",
        },
      };
      String request = jsonEncode(payload);

      final result = await PhonePePaymentSdk.startTransaction(
        request,
        appSchema,
      );

      Logger.appLogs("Transaction result: $result");

      final error = result?['error'];
      final status = result?['status']?.toString().toLowerCase();

      if (error is String) {
        msg = extractStatusCodeFromError(error);
      } else {
        msg = error?.toString();
      }

      Logger.appLogs("Transaction status: $status");
      Logger.appLogs("Transaction message: $msg");

      if (status == 'success') {
        // ToastUtil.showMessage(msg ?? 'payMntSucsful');
        return true;
      } else {
        ToastUtil.showMessage(msg ?? 'PaymentFailedMsg');
        return false;
      }
    } catch (e) {
      Logger.appLogs("PhonePe Transaction Error: $e");
      return false;
    }
  }

  void getInstalledUpiAppsForiOS() {
    dynamic iosApps = PhonePePaymentSdk.getInstalledUpiAppsForiOS();
    try {
      Logger.appLogs('getUPIAppsInstalledForIOS - $iosApps');

      // For Usage
      List<String> stringList = iosApps?.whereType<String>().toList() ?? [];

      String searchString = 'PHONEPE';
      bool isStringExist = stringList.contains(searchString);

      if (isStringExist) {
        Logger.appLogs('$searchString app exist in the device.');
      } else {
        Logger.appLogs('$searchString app does not exist in the list.');
      }
    } catch (e) {
      Logger.appLogs("PhonePe SDK getInstalledUpiAppsForiOS Error: $e");
    }
  }

  void getInstalledApps() {
    if (!kIsWeb && Platform.isAndroid) {
      getInstalledUpiAppsForAndroid();
    } else {
      getInstalledUpiAppsForiOS();
    }
  }

  Future<void> getInstalledUpiAppsForAndroid() async {
    dynamic installedApps = await PhonePePaymentSdk.getUpiAppsForAndroid();
    try {
      Logger.appLogs('Installed installedApps - $installedApps');
      if (installedApps != null) {
        Iterable l = json.decode(installedApps);
        List<UPIApp> upiApps = List<UPIApp>.from(
          l.map((model) => UPIApp.fromJson(model)),
        );
        var appString = '';
        for (var element in upiApps) {
          appString +=
              "${element.applicationName} ${element.version} ${element.packageName}";
        }
        Logger.appLogs('Installed Upi Apps - $appString');
      } else {
        Logger.appLogs('Installed Upi Apps - 0');
      }
    } catch (e) {
      Logger.appLogs("PhonePe SDK getInstalledUpiAppsForAndroid Error: $e");
    }
  }
}

class UPIApp {
  final String? packageName;
  final String? applicationName;
  final String? version;

  UPIApp(this.packageName, this.applicationName, this.version);

  factory UPIApp.fromJson(Map<String, dynamic> parsedJson) {
    return UPIApp(
      parsedJson['packageName'],
      parsedJson['applicationName'],
      parsedJson['version'].toString(),
    );
  }
}
