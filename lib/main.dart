import 'dart:async';

import 'package:airstar_flutter/analytics_engin.dart';
import 'package:airstar_flutter/app.dart';
import 'package:airstar_flutter/services/notification_service.dart';
import 'package:airstar_flutter/utils/utils.dart';
// import 'package:drift/drift.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
// import 'package:url_strategy/url_strategy.dart';

bool weWantFatalErrorRecording = true;

FutureOr<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AnalyticsEngin.init();

  if (!kIsWeb) {
    await FirebaseCrashlytics.instance.setCrashlyticsCollectionEnabled(
      kReleaseMode,
    );

    FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;
  }

  WidgetsFlutterBinding.ensureInitialized();
  await EasyLocalization.ensureInitialized();

  if (kReleaseMode) {
    FlutterError.onError = (errorDetails) {
      if (weWantFatalErrorRecording) {
        FirebaseCrashlytics.instance.recordFlutterFatalError(errorDetails);
      } else {
        FirebaseCrashlytics.instance.recordFlutterError(errorDetails);
      }
    };
    PlatformDispatcher.instance.onError = (error, stack) {
      FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
      return true;
    };
    await FirebaseAnalytics.instance.setAnalyticsCollectionEnabled(true);
  }

  // to disable the unwanted warning log from Easy Localization
  EasyLocalization.logger.enableBuildModes = [];

  //To setup the singleton initialization
  setupLocator();
  //To remove (#) from the navigation url
  // setPathUrlStrategy();

  AppConstant.isBoarding = await checkOnBoarding();
  //Check for onLogin
  AppConstant.isLoggedIn = await checkIsLoggedIn();
  //Check for permission
  AppConstant.isPermissionGranted = await validatePermission();

  // driftRuntimeOptions.dontWarnAboutMultipleDatabases = true;

  NotificationService notificationService = NotificationService();
  await notificationService.initialize();

  runApp(
    EasyLocalization(
      supportedLocales: [
        Locale('en'),
        Locale('hi'),
        Locale('ta'),
        Locale('fr'),
        Locale('es'),
        Locale('ar'),
        Locale('th'),
        Locale('id'),
        Locale('ja'),
        Locale('nl'),
        Locale('pt'),
        Locale('vi'),
        Locale('zh'),
      ],
      path: 'assets/translations',
      saveLocale: true,
      useOnlyLangCode: true,
      fallbackLocale: Locale('en'),
      child: MyApp(),
    ),
  );
}
