import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_stripe/flutter_stripe.dart';

// import 'package:flutter_stripe_web/flutter_stripe_web.dart';
// import 'package:web/web.dart' as web;

import '../commonWidgets/toastWidget/app_toast.dart';
import '../utils/config/debugger/logger.dart';
import '../utils/constants/strings.dart';
import '../utils/secureStorage/app_secure_storage.dart';
import '../utils/shardHelper/preference_constant.dart';

class StripeService {
  final Function()? getPaymentStatus;

  StripeService({this.getPaymentStatus});

  Future<void> initStripe(
    String secret, {
    required BuildContext context,
  }) async {
    if (kIsWeb) {
      // PlatformPaymentElement.show(context, clientSecret: secret);
      // ToastUtil.showMessage("Stripe PaymentSheet not supported on Web $secret");
      return;
    }
    var storage = AppSecureStorage.getInstance();
    var key = await storage.readSecureData(PrefConstant.stripe_publishable_key);
    Logger.appLogs("Stripe publishable key: $key");

    if (key == null) {
      Logger.appLogs("Fetching Stripe publishable key...");
      key = await storage.readSecureData(PrefConstant.stripe_publishable_key);
    }

    if (key != null) {
      Stripe.publishableKey = key;
      Logger.appLogs("Stripe initialized successfully.");
      Logger.appLogs(secret);

      await Stripe.instance
          .initPaymentSheet(
            paymentSheetParameters: SetupPaymentSheetParameters(
              customFlow: false,
              paymentIntentClientSecret: secret,
              merchantDisplayName: Strings.appName,
            ),
          )
          .then((_) {
            displayPaymentSheet();
          })
          .catchError((e) {
            Logger.appLogs("Error initializing payment sheet: $e");
          });
    } else {
      Logger.appLogs("Failed to retrieve Stripe publishable key.");
    }
  }

  Future<void> displayPaymentSheet() async {
    try {
      await Stripe.instance.presentPaymentSheet().then((val) {
        Logger.appLogs("Payment successful.");
        getPaymentStatus!();
      });
    } catch (e) {
      Logger.appLogs("Stripe payment sheet error: $e");
      ToastUtil.showMessage("Payment Failed");
    }
  }
}

/// WEB Stripe

// class StripeWeb {
//   String getUrlPort() => web.window.location.port;
//
//   String getReturnUrl() => web.window.location.href;
//
//   Future<void> pay() async {
//     await WebStripe.instance.confirmPaymentElement(
//       ConfirmPaymentElementOptions(
//         confirmParams: ConfirmPaymentParams(return_url: getReturnUrl()),
//       ),
//     );
//   }
// }
//
// class PlatformPaymentElement extends StatelessWidget {
//   const PlatformPaymentElement(this.clientSecret, {Key? key}) : super(key: key);
//
//   final String? clientSecret;
//
//   static void show(BuildContext context, {required String? clientSecret}) {
//     // Validate clientSecret before showing the modal
//     if (clientSecret == null || clientSecret.isEmpty) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(
//           content: Text('Payment setup error. Please try again.'),
//           backgroundColor: Colors.red,
//         ),
//       );
//       return;
//     }
//
//     showModalBottomSheet(
//       context: context,
//       isScrollControlled: true,
//       backgroundColor: Colors.transparent,
//       barrierColor: Colors.black.withOpacity(0.3),
//       builder: (context) => BackdropFilter(
//         filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
//         child: PlatformPaymentElement(clientSecret),
//       ),
//     );
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     // Add null check and show error if clientSecret is invalid
//     if (clientSecret == null || clientSecret!.isEmpty) {
//       return Container(
//         padding: const EdgeInsets.all(20),
//         decoration: BoxDecoration(
//           color: Colors.white,
//           borderRadius: BorderRadius.circular(16),
//         ),
//         child: Column(
//           mainAxisSize: MainAxisSize.min,
//           children: [
//             const Icon(Icons.error_outline, color: Colors.red, size: 48),
//             const SizedBox(height: 16),
//             const Text(
//               'Payment Error',
//               style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
//             ),
//             const SizedBox(height: 8),
//             const Text(
//               'Unable to initialize payment. Please try again.',
//               textAlign: TextAlign.center,
//             ),
//             const SizedBox(height: 16),
//             ElevatedButton(
//               onPressed: () => Navigator.pop(context),
//               child: const Text('Close'),
//             ),
//           ],
//         ),
//       );
//     }
//
//     return Container(
//       decoration: BoxDecoration(
//         color: Colors.white,
//         borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
//       ),
//       child: Padding(
//         padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
//         child: Column(
//           mainAxisSize: MainAxisSize.min,
//           children: [
//             // Drag handle
//             Container(
//               width: 40,
//               height: 4,
//               margin: const EdgeInsets.only(bottom: 20),
//               decoration: BoxDecoration(
//                 color: Colors.grey[300],
//                 borderRadius: BorderRadius.circular(2),
//               ),
//             ),
//             ExpressCheckoutElement(
//               // PaymentElement(
//               //   autofocus: true,
//               //   enablePostalCode: true,
//               //   onCardChanged: (_) {},
//               clientSecret: clientSecret!,
//               onConfirm: (value) {
//                 StripeWeb().pay();
//               },
//             ),
//             const SizedBox(height: 20),
//           ],
//         ),
//       ),
//     );
//   }
// }

/*
class StripeWeb {
  String getUrlPort() => web.window.location.port;

  String getReturnUrl() => web.window.location.href;

  Future<void> pay() async {
    await WebStripe.instance.confirmPaymentElement(
      ConfirmPaymentElementOptions(
        confirmParams: ConfirmPaymentParams(return_url: getReturnUrl()),
      ),
    );
  }
}

class PlatformPaymentElement extends StatelessWidget {
  const PlatformPaymentElement(this.clientSecret);

  final String clientSecret;

  static void show(BuildContext context, {required String clientSecret}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      barrierColor: Colors.black.withOpacity(
        0.3,
      ), // Semi-transparent background
      builder: (context) => BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10), // Blur effect
        child: PlatformPaymentElement(clientSecret),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
      child: PaymentElement(
        autofocus: true,
        enablePostalCode: true,
        onCardChanged: (_) {},
        clientSecret: clientSecret,
      ),
    );
  }
}
*/
