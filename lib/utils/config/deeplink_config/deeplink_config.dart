import 'dart:async';
import 'dart:convert';

import 'package:app_links/app_links.dart';
import 'package:encrypt/encrypt.dart' as encrypt;
import 'package:flutter/foundation.dart';
import 'package:get/get.dart';

import '../../../routes/router_name.dart';
import '../../utils.dart';

//https://airstar.abservetechdemo.com/.well-known/assetlinks.json

// Encryption Helper Class
class DeepLinkEncryption {
  static const bool ENABLE_ENCRYPTION = false;

  static final _key = encrypt.Key.fromLength(32);
  static final _iv = encrypt.IV.fromLength(8);
  static final _encrypter = encrypt.Encrypter(encrypt.Salsa20(_key));

  // Encrypt the query parameters
  static String encryptParams(Map<String, String> params) {
    if (!ENABLE_ENCRYPTION) return ''; // Skip encryption if disabled

    try {
      final jsonString = json.encode(params);
      final encrypted = _encrypter.encrypt(jsonString, iv: _iv);
      // Use base64Url for URL safety
      return base64Url.encode(encrypted.bytes).replaceAll('=', '');
    } catch (e) {
      Logger.appLogs('Encryption error: $e');
      return '';
    }
  }

  // Decrypt the query parameters
  static Map<String, String>? decryptParams(String encryptedData) {
    if (!ENABLE_ENCRYPTION) return null; // Skip decryption if disabled

    try {
      // Add back padding if needed
      String padded = encryptedData;
      while (padded.length % 4 != 0) {
        padded += '=';
      }

      final bytes = base64Url.decode(padded);
      final encrypted = encrypt.Encrypted(bytes);
      final decrypted = _encrypter.decrypt(encrypted, iv: _iv);
      final Map<String, dynamic> decoded = json.decode(decrypted);

      return decoded.map((key, value) => MapEntry(key, value.toString()));
    } catch (e) {
      Logger.appLogs('Decryption error: $e');
      return null;
    }
  }
}

// Updated generateSmartLink with conditional encryption
String generateSmartLink({
  required String route,
  String? id,
  Map<String, String>? queryParams,
}) {
  final String host = 'jitooneworld.extraa.in';

  String path = '/app/$route';
  if (id != null) {
    path += '/$id';
  }

  // Filter out null or empty values from queryParams
  final filteredParams = queryParams?.entries
      .where((entry) => entry.value.isNotEmpty)
      .fold<Map<String, String>>(
        {},
        (map, entry) => map..[entry.key] = entry.value,
      );

  Map<String, String>? finalParams;

  // Check if encryption is enabled
  if (DeepLinkEncryption.ENABLE_ENCRYPTION) {
    // Encrypt params if they exist
    if (filteredParams != null && filteredParams.isNotEmpty) {
      final encryptedData = DeepLinkEncryption.encryptParams(filteredParams);
      if (encryptedData.isNotEmpty) {
        finalParams = {'data': encryptedData};
        Logger.appLogs("Encryption ENABLED - Parameters encrypted");
      }
    }
  } else {
    // Use normal params without encryption
    finalParams = filteredParams;
    Logger.appLogs("Encryption DISABLED - Parameters in plain text");
  }

  final uri = Uri(
    scheme: 'https',
    host: host,
    path: path,
    queryParameters: finalParams?.isNotEmpty == true ? finalParams : null,
  );

  Logger.appLogs("uri ::$uri");
  return uri.toString();
}

// Updated DeepLinkConfig with conditional decryption
class DeepLinkConfig {
  // Private constructor for Singleton pattern
  DeepLinkConfig._();
  static final DeepLinkConfig _instance = DeepLinkConfig._();
  static DeepLinkConfig get instance => _instance;

  final AppLinks _appLinks = AppLinks();
  StreamSubscription<Uri>? _linkSubscription;

  Future<void> initDeepLinks() async {
    if (kIsWeb) return;
    try {
      final initialUri = await _appLinks.getInitialLink();
      if (initialUri != null) {
        _handleDeepLink(initialUri);
      }

      _linkSubscription = _appLinks.uriLinkStream.listen(
        _handleDeepLink,
        onError: (error) {
          Logger.appLogs('Deep link error: $error');
        },
        onDone: () {
          _linkSubscription?.cancel();
        },
      );
    } catch (e) {
      Logger.appLogs('Failed to initialize deep links: $e');
    }
  }

  void _handleDeepLink(Uri uri) {
    Logger.appLogs('Deep Link Received: $uri');
    final pathSegments = uri.pathSegments;

    if (pathSegments.isEmpty) return;
    Logger.appLogs("route :::${pathSegments}");
    /*    final String route = pathSegments.first.toLowerCase();
    final String? id = pathSegments.length > 1 ? pathSegments[1] : null;*/

    int routeIndex = 0;
    if (pathSegments.first.toLowerCase() == 'app' && pathSegments.length > 1) {
      routeIndex = 1; // Skip 'app' and use next segment as route
    }

    if (pathSegments.length <= routeIndex) return;

    final String route = pathSegments[routeIndex].toLowerCase();
    final String? id = pathSegments.length > routeIndex + 1
        ? pathSegments[routeIndex + 1]
        : null;

    Logger.appLogs("Route: $route, ID: $id");

    // Handle query parameters based on encryption setting
    Map<String, String> queryParams = {};

    if (DeepLinkEncryption.ENABLE_ENCRYPTION) {
      // Try to decrypt if encryption is enabled
      if (uri.queryParameters.containsKey('data')) {
        final encryptedData = uri.queryParameters['data'];
        if (encryptedData != null) {
          final decrypted = DeepLinkEncryption.decryptParams(encryptedData);
          if (decrypted != null) {
            queryParams = decrypted;
            Logger.appLogs('Decryption SUCCESS: $queryParams');
          } else {
            Logger.appLogs('Decryption FAILED');
          }
        }
      }
    } else {
      // Use normal query parameters without decryption
      queryParams = uri.queryParameters;
      Logger.appLogs(
        'Encryption DISABLED - Using plain parameters: $queryParams',
      );
    }

    switch (route) {
      case DeepLinkRoutes.productDetails:
        if (id != null && int.tryParse(id) != null) {
          Get.toNamed(
            RouterName.productDetailScreen,
            arguments: {
              RouterArguments.listingId: id,
              RouterArguments.images: <String>[],
              RouterArguments.wishlist: false,
            },
          );
        }
        break;

      default:
        Logger.appLogs('No matching route for $route');
        break;
    }
  }

  void dispose() {
    _linkSubscription?.cancel();
  }
}

class DeepLinkRoutes {
  static const String productDetails = 'product_details';
}
