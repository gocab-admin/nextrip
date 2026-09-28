import 'package:airstar_flutter/data/models/user/settings_response_model.dart';
import 'package:airstar_flutter/services/dio_client.dart';
import 'package:flutter/foundation.dart';

import '../../../utils/utils.dart';

class HomeRepository {
  final ApiClient _client = ApiClient();

  Future<SettingsResponseModel?> fetchSettings() async {
    final response = await _client.get(EndPointConstants.settingsUrl);

    // Logger.appLogs('callBackResponse:: $response');
    if (response != null) {
      return await compute(
          SettingsResponseModel.fromJson, response as Map<String, dynamic>);
    } else {
      //Failed returning null
      // Logger.appLogs('errorNull:: $response');
      return null;
    }
  }
}
