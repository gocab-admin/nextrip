import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_core/firebase_core.dart';

import 'firebase_options.dart';

class AnalyticsEngin {
  static final _instance = FirebaseAnalytics.instance;

  static Future<void> init() {
    return Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
  }

  static Future<void> userLogin({
    String? loginMethod,
    Map<String, Object>? parameters,
  }) async {
    return _instance.logLogin(loginMethod: loginMethod, parameters: parameters);
  }

  static Future<void> userSignup({
    required String signUpMethod,
    Map<String, Object>? parameters,
  }) async {
    return _instance.logSignUp(
      signUpMethod: signUpMethod,
      parameters: parameters,
    );
  }

  static Future<void> btnPressed({
    required String name,
    Map<String, Object>? parameters,
  }) async {
    FormatException(name);
    return _instance.logEvent(name: name, parameters: parameters);
  }

  static Future<void> setCurrentScreen({required String screenName}) async {
    FormatException(screenName);
    return _instance.logScreenView(
      screenName: screenName,
      screenClass: screenName,
    );
  }
}
