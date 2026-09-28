import 'dart:convert';
import 'dart:io';

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:permission_handler/permission_handler.dart';

import '../utils/utils.dart';

@pragma('vm:entry-point')
handleBackgroundNotificationTap(NotificationResponse response) {
  if (response.payload != null) {
    final data = json.decode(response.payload!);
    _handleNotificationNavigation(data);
  }
}

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage? message) async {
  // Handle the background notification here
  print("_backgroundNotificationHandler ${message?.notification?.body}");
  if (message != null) {
    print("message :: ${message.notification}");
  } else {
    print("msh is null");
  }
}

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;

  NotificationService._internal();

  bool _isInitialized = false;
  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();

  AndroidNotificationChannel get _channel => AndroidNotificationChannel(
    'NextripChannel',
    'NextripChannel',
    description: 'NextripNotificationChannel',
    importance: Importance.max,
  );

  Future<void> initialize() async {
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
    _initLocalNotifications();
    // await  _requestFCMPermission();
    //   _initializeFCMListeners();
  }

  void _initLocalNotifications() {
    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iOSSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    final settings = InitializationSettings(android: androidSettings, iOS: iOSSettings);
    _flutterLocalNotificationsPlugin.initialize(
      settings,
      onDidReceiveNotificationResponse: _onNotificationTap,
      onDidReceiveBackgroundNotificationResponse: handleBackgroundNotificationTap,
    );
  }

  Future<void> enableNotifications() async {
    if (_isInitialized) {
      debugPrint("Notifications already initialized");
      return;
    }

    debugPrint("Enabling notifications after user login");
    await _requestFCMPermission();
    //  await _getFCMToken();
    _initializeFCMListeners();
    _isInitialized = true;
  }

  Future<void> disableNotifications() async {
    if (!_isInitialized) {
      return;
    }

    debugPrint("Disabling notifications after user logout");
    // Unsubscribe from any topics if needed
    // Clear any stored tokens
    var storage = AppSecureStorage.getInstance();
    await storage.deleteSecuredData(PrefConstant.fcmToken);
    _isInitialized = false;
  }

  Future<void> _requestFCMPermission() async {
    final status = await Permission.notification.request();
    if (status.isGranted) {
      await _firebaseMessaging.setAutoInitEnabled(true);
      await _flutterLocalNotificationsPlugin
          .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
          ?.createNotificationChannel(_channel);

      if ((!kIsWeb) && Platform.isIOS) {
        await _firebaseMessaging.setForegroundNotificationPresentationOptions(
          alert: true,
          badge: true,
          sound: true,
        );
      }
    } else {
      debugPrint("Notification permission denied.");
    }
  }

  Future<void> _getFCMToken() async {
    try {
      String? token;
      if (kIsWeb) {
        token = await _firebaseMessaging.getToken(vapidKey: AppConstant.vapidKey);
      } else {
        token = await _firebaseMessaging.getToken();
      }
      // final token = await _firebaseMessaging.getToken(
      //   vapidKey: AppConstant.vapidKey,
      // );
      if (token != null) {
        debugPrint("FCM Token: $token");
        var storage = AppSecureStorage.getInstance();
        await storage.writeSecureData(PrefConstant.fcmToken, token);
      }
    } catch (e) {
      debugPrint("Error fetching FCM token: $e");
    }
  }

  Future<void> _initializeFCMListeners() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString(PrefConstant.authToken);
    if (token != null && token.isNotEmpty == true) {
      FirebaseMessaging.onMessage.listen((message) {
        debugPrint("onMessage: ${message.data}");
        debugPrint("onMessage1: ${message.notification?.body}");
        _showLocalNotification(message);
      });

      FirebaseMessaging.onMessageOpenedApp.listen((message) {
        debugPrint("onMessageOpenedApp: ${message.data}");
        _handleNotificationNavigation(message.data);
      });
    } else {
      Logger.appLogs("Notification service user Not Login 111");
    }
  }

  void _showLocalNotification(RemoteMessage message) async {
    final notification = message.notification;
    if (notification != null) {
      final details = NotificationDetails(
        android: AndroidNotificationDetails(
          _channel.id,
          _channel.name,
          channelDescription: _channel.description,
          importance: Importance.max,
          priority: Priority.max,
          playSound: true,
        ),
        iOS: const DarwinNotificationDetails(presentAlert: true, presentBadge: true, presentSound: true),
      );

      await _flutterLocalNotificationsPlugin.show(
        notification.hashCode,
        notification.title ?? '',
        notification.body ?? '',
        details,
        payload: json.encode(message.data) /* message.notification?.body ?? ''*/,
      );
    }
  }
}

void _onNotificationTap(NotificationResponse response) {
  if (response.payload != null) {
    final data = json.decode(response.payload!);
    _handleNotificationNavigation(data);
  }
}

void _handleNotificationNavigation(Map<String, dynamic> data) async {
  final type = data['type'];
  final bookingId = data['booking_id'];
  Logger.appLogs("_handleNotificationNavigation::$data");
}
