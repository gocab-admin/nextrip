import 'package:flutter/foundation.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';

import '../commonWidgets/toastWidget/app_toast.dart';
import '../utils/config/debugger/logger.dart';
import '../utils/secureStorage/app_secure_storage.dart';
import '../utils/shardHelper/preference_constant.dart';
import '../viewModel/user/profile_view_model.dart';

class RazorpayService {
  final EditProfileViewModel editProfileViewModel;
  final Function(PaymentSuccessResponse)? checkPaymentStatus;

  Razorpay _razorpay = Razorpay();

  RazorpayService({required this.editProfileViewModel, this.checkPaymentStatus})
      : _razorpay = Razorpay();

  void initialize() {
    if (kIsWeb) {
      ToastUtil.showMessage("Razorpay is not supported on Web");
      return;
    }
    try {
      _razorpay.on(
          Razorpay.EVENT_PAYMENT_SUCCESS, handlerPaymentSuccessWrapper);
      _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, handlerErrorFailure);
      _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, handlerExternalWallet);
      Logger.appLogs("Razorpay initialized successfully");
    } catch (e) {
      Logger.appLogs("Error initializing Razorpay: $e");
    }
  }

  void dispose() {
    _razorpay.clear();
  }

  void handlerPaymentSuccessWrapper(PaymentSuccessResponse response) {
    Logger.appLogs(
        "product order id :: ${response.orderId} \n  paymentId :: ${response.paymentId} \n  signature :: ${response.signature}");
    // Call the paymentStatus API after successful Razorpay payment
    checkPaymentStatus!(response);
  }

  void handlerErrorFailure(PaymentFailureResponse response) {
    ToastUtil.showMessage("${response.message ?? "Payment Cancelled"}");
    print("error:: ${response.message}");
  }

  void handlerExternalWallet(ExternalWalletResponse response) {
    Logger.appLogs("External Wallet Selected: ${response.walletName}");
  }

  void openCheckOut(int amount, String razorpayOrderId) async {
    if (kIsWeb) {
      ToastUtil.showMessage("Razorpay is not supported on Web");
      return;
    }
    var user = editProfileViewModel.userResponseModel?.data?.userDetail;

    var storage = AppSecureStorage.getInstance();
    var razorpayKey = await storage.readSecureData(PrefConstant.razorpay_key);
    Logger.appLogs("Razorpay key: $razorpayKey");

    if (razorpayKey == null) {
      Logger.appLogs("Fetching Razorpay key...");
      razorpayKey = await storage.readSecureData(PrefConstant.razorpay_key);
    }

    var options = {
      'key': razorpayKey,
      'amount': amount * 100, // Amount in paise
      'name': user?.firstname ?? '',
      'order_id': razorpayOrderId,
      'prefill': {
        'contact': user?.phone ?? '',
        'email': user?.email ?? '',
      },
      'external': {
        'wallets': ['paytm']
      }
    };

    try {
      _razorpay.open(options);
    } catch (e) {
      Logger.appLogs("Error in Razorpay checkout: $e");
    }
  }
}
