import 'package:shared_preferences/shared_preferences.dart';

// Future<SharedPreferences>? preferenceValue1;

class PreferenceHelper {
  static SharedPreferences? _prefs;

  static Future<SharedPreferences> get _preference async {
    _prefs ??= await SharedPreferences.getInstance();
    return _prefs!;
  }

  static Future<bool> getBool(String key) async {
    return (await _preference).getBool(key) ?? false;
  }

  static Future<bool> getBool2(String key) async {
    return (await _preference).getBool(key) ?? true;
  }

  static Future<bool?> getBoolWithoutNullCheck(String key) async {
    return (await _preference).getBool(key);
  }

  static Future setBool(String key, bool value) async {
    (await _preference).setBool(key, value);
  }

  static Future<int> getInt(String key) async {
    return (await _preference).getInt(key) ?? 0;
  }

  static Future setInt(String key, int value) async {
    (await _preference).setInt(key, value);
  }

  static Future<String> getString(String key) async {
    return (await _preference).getString(key) ?? '';
  }

  static Future setString(String key, String value) async {
    (await _preference).setString(key, value);
  }

  static Future<double> getDouble(String key) async {
    return (await _preference).getDouble(key) ?? 0.0;
  }

  static Future setDouble(String key, double value) async {
    (await _preference).setDouble(key, value);
  }

  static Future remove(String key) async {
    (await _preference).remove(key);
  }

  static Future clear() async {
    (await _preference).clear();
  }
}
