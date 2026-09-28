import 'package:airstar_flutter/data/models/user/notification.dart';
import 'package:airstar_flutter/services/dio_client.dart';
import 'package:airstar_flutter/utils/constants/constants.dart';
import 'package:flutter/foundation.dart';

class NotificationRepository {
  ApiClient _client = ApiClient();

  Future<NotificationResponseModel> fetchNotification() async {
    final response = await _client.get(EndPointConstants.notificationUrl,
        queryParameters: {"_page": 1, "_limit": 10});

    return await compute(
        NotificationResponseModel.fromJson, response as Map<String, dynamic>);
  }

  Future<bool> clearNotification(String id) async {
    final response = await _client.put(
      "${EndPointConstants.notificationClearUrl}/${id}",
    );

    return response['status'];
  }
}
