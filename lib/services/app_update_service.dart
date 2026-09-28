import 'dart:convert';
import 'dart:io';

import 'package:airstar_flutter/utils/utils.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:package_info_plus/package_info_plus.dart';
import 'package:playx_version_update/playx_version_update.dart';

class AppUpdateService {
  var _client = http.Client();

  static const String iosBundleId = EndPointConstants.applicationId;

  Future<bool> showInAppUpdateFlow(BuildContext context) async {
    bool isUpdateAvailable = true;
    if (!kIsWeb && Platform.isIOS) {
      final currentVersion = await getCurrentAppVersion();
      String? latestVersion = await getLatestVersionFromAppStore();

      Logger.appLogs("currentVersion :: $currentVersion");
      Logger.appLogs("latestVersion :: $latestVersion");

      if (currentVersion != null && latestVersion != null) {
        isUpdateAvailable = _compareVersions(currentVersion, latestVersion);
      }
    }

    if (isUpdateAvailable == true) {
      final result = await PlayxVersionUpdate.showInAppUpdateDialog(
        context: context,
        type: PlayxAppUpdateType.immediate,
        iosOptions: const PlayxUpdateOptions(
          iosBundleId: iosBundleId,
          forceUpdate: true,
        ),
        iosUiOptions: PlayxUpdateUIOptions(
          showDismissButtonOnForceUpdate: false,
          showReleaseNotes: true,
          releaseNotesTitle: (info) => 'What\'s New in ${info.newVersion}?',
          displayType: PlayxUpdateDisplayType.pageOnForceUpdate,
          isDismissible: false,
        ),
      );

      return result.when(
        success: (isShown) {
          if (isShown) {
            Logger.appLogs(
              'In-app update dialog process initiated or no update needed.',
            );
            return true;
          }
          return true;
        },
        error: (error) {
          Logger.appLogs('Error during in-app update dialog: ${error.message}');
          return true;
        },
      );
    } else {
      return true;
    }
  }

  Future<String?> getLatestVersionFromAppStore() async {
    try {
      final url = Uri.parse(
        "https://itunes.apple.com/lookup?bundleId=$iosBundleId",
      );
      final responseStr = await _client.get(Uri.parse("$url"));

      // Parse the response string into JSON
      final Map<String, dynamic> json = jsonDecode(responseStr.body);

      if (json['resultCount'] > 0 &&
          json['results'] is List &&
          json['results'].isNotEmpty) {
        final version = json['results'][0]['version'];
        Logger.appLogs("IOS app version :: $version");
        return version;
      } else {
        Logger.appLogs("No results found in App Store response");
        return null;
      }
    } catch (e) {
      Logger.appLogs("Error fetching version from App Store: $e");
      return null;
    }
  }

  Future<String?> getCurrentAppVersion() async {
    try {
      final packageInfo = await PackageInfo.fromPlatform();
      return packageInfo.version;
    } catch (e) {
      Logger.appLogs("Error getting current app version: $e");
      return null;
    }
  }

  bool _compareVersions(String currentVersion, String latestVersion) {
    try {
      List<int> current = currentVersion
          .split('.')
          .map((e) => int.parse(e))
          .toList();
      List<int> latest = latestVersion
          .split('.')
          .map((e) => int.parse(e))
          .toList();

      // Pad with zeros if versions have different lengths
      while (current.length < latest.length) current.add(0);
      while (latest.length < current.length) latest.add(0);

      // Compare version numbers
      for (int i = 0; i < current.length; i++) {
        if (latest[i] > current[i]) return true;
        if (latest[i] < current[i]) return false;
      }
      return false; // Versions are equal
    } catch (e) {
      Logger.appLogs("Error comparing versions: $e");
      // If version parsing fails, fall back to string comparison
      return latestVersion != currentVersion;
    }
  }
}

// class VersionChecker {
//   final String packageName = EndPointConstants.applicationId;
//   final String iosBundleId = EndPointConstants.applicationId;
//   ApiClient _client = ApiClient();
//
//   Future<bool> checkForAndroidUpdate() async {
//     if (!Platform.isAndroid) return false;
//
//     try {
//       final AppUpdateInfo updateInfo = await InAppUpdate.checkForUpdate();
//       Logger.appLogs("AppUpdateInfo :: $updateInfo");
//       return updateInfo.updateAvailability ==
//           UpdateAvailability.updateAvailable;
//     } catch (e) {
//       Logger.appLogs('Error checking for Android update: $e');
//       return false;
//     }
//   }
//
//   Future<String?> getLatestVersionFromAppStore() async {
//     try {
//       final url =
//       Uri.parse("https://itunes.apple.com/lookup?bundleId=$iosBundleId");
//       final responseStr = await _client.get("$url");
//
//       // Parse the response string into JSON
//       final Map<String, dynamic> json = jsonDecode(responseStr);
//
//       if (json['resultCount'] > 0 &&
//           json['results'] is List &&
//           json['results'].isNotEmpty) {
//         final version = json['results'][0]['version'];
//         Logger.appLogs("IOS app version :: $version");
//         return version;
//       } else {
//         Logger.appLogs("No results found in App Store response");
//         return null;
//       }
//     } catch (e) {
//       Logger.appLogs("Error fetching version from App Store: $e");
//       return null;
//     }
//   }
//
//   Future<String?> getCurrentAppVersion() async {
//     try {
//       final packageInfo = await PackageInfo.fromPlatform();
//       return packageInfo.version;
//     } catch (e) {
//       Logger.appLogs("Error getting current app version: $e");
//       return null;
//     }
//   }
//
//   Future<bool> checkForUpdate() async {
//     try {
//       final currentVersion = await getCurrentAppVersion();
//       String? latestVersion;
//
//       if (Platform.isAndroid) {
//         return await checkForAndroidUpdate();
//       } else if (Platform.isIOS) {
//         latestVersion = await getLatestVersionFromAppStore();
//         Logger.appLogs("currentVersion :: $currentVersion");
//         Logger.appLogs("latestVersion :: $latestVersion");
//
//         if (currentVersion != null && latestVersion != null) {
//           return _compareVersions(currentVersion, latestVersion);
//         }
//       }
//       return false;
//     } catch (e) {
//       Logger.appLogs("Error checking for update: $e");
//       return false;
//     }
//   }
//
//   bool _compareVersions(String currentVersion, String latestVersion) {
//     try {
//       List<int> current =
//       currentVersion.split('.').map((e) => int.parse(e)).toList();
//       List<int> latest =
//       latestVersion.split('.').map((e) => int.parse(e)).toList();
//
//       // Pad with zeros if versions have different lengths
//       while (current.length < latest.length) current.add(0);
//       while (latest.length < current.length) latest.add(0);
//
//       // Compare version numbers
//       for (int i = 0; i < current.length; i++) {
//         if (latest[i] > current[i]) return true;
//         if (latest[i] < current[i]) return false;
//       }
//       return false; // Versions are equal
//     } catch (e) {
//       Logger.appLogs("Error comparing versions: $e");
//       // If version parsing fails, fall back to string comparison
//       return latestVersion != currentVersion;
//     }
//   }
// }
