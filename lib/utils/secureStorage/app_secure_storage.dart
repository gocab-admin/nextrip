import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AppSecureStorage {
  static final AppSecureStorage _instance = AppSecureStorage._internal();

  factory AppSecureStorage.getInstance() => _instance;

  late final FlutterSecureStorage _storage;

  AppSecureStorage._internal() {
    if (kIsWeb) {
      _storage = FlutterSecureStorage(
        webOptions: const WebOptions(
          wrapKey: 'kD9xP3R0VdZBfNq7H4YJcEwA6M2s8LQt',
          wrapKeyIv: 'B9xR2WZP1sQ7L0cF',
        ),
      );
    } else {
      _storage = FlutterSecureStorage(aOptions: _getAndroidOptions());
    }
  }

  static AndroidOptions _getAndroidOptions() =>
      const AndroidOptions(encryptedSharedPreferences: true);

  Future<void> writeSecureData(String key, String value) async {
    await _storage.write(key: key, value: value);
  }

  Future<String?> readSecureData(String key) async {
    return await _storage.read(key: key);
  }

  Future<void> deleteSecuredData(String key) async {
    await _storage.delete(key: key);
  }

  Future<void> deleteAllData() async {
    await _storage.deleteAll();
  }
}
