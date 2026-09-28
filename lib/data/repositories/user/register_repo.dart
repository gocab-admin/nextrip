import 'package:airstar_flutter/data/models/user/password_update_model.dart';
import 'package:airstar_flutter/data/models/user/profile_update_model.dart';
import 'package:airstar_flutter/data/models/user/register_response_model.dart';
import 'package:airstar_flutter/data/models/user/user_response_model.dart';
import 'package:airstar_flutter/services/dio_client.dart';
import 'package:airstar_flutter/utils/constants/constants.dart';
import 'package:dio/dio.dart';

import '../../models/user/currency_response_model.dart';

class RegisterRepository {
  ApiClient _client = ApiClient();

  Future<RegisterResponseModel?> userRegister(
      {phoneNo, phoneCode, password, email, firstName, lastName, dob,String? fcmId}) async {
    var body = {
      'phone': phoneNo.replaceAll(RegExp(r'[\s-]'), ''),
      'phoneCode': "+${phoneCode}",
      'email': email,
      'password': password,
      'firstname': firstName,
      'lastname': lastName,
      'dob': dob,
      'fcmId': fcmId
    };

    final response =
        await _client.post(EndPointConstants.userRegisterUrl, body: body);

    if (response != null) {
      // Logger.appLogs('responseRep :: $response');
      return RegisterResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      // Logger.appLogs('errorNull :: $response');
      return null;
    }
  }

  Future<UserResponseModel?> fetchUserProfile() async {
    final response = await _client.get(EndPointConstants.userRegisterUrl);

    if (response != null) {
      // Logger.appLogs('responseRep :: $response');
      return UserResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      // Logger.appLogs('errorNull :: $response');
      return null;
    }
  }

  Future<PasswordUpdateResponseModel?> fetchPasswordUpdate(
      {required Map<String, String> body}) async {
    final response =
        await _client.put(EndPointConstants.passUpdateUrl, body: body);

    if (response != null) {
      // Logger.appLogs('responseRep :: $response');
      return PasswordUpdateResponseModel.fromJson(
          response as Map<String, dynamic>);
    } else {
      // Logger.appLogs('errorNull :: $response');
      return null;
    }
  }

  Future<ProfileUpdateResponseModel?> profileUpdate(
      {required String userId, required FormData formData}) async {
    final response = await _client
        .put("${EndPointConstants.userRegisterUrl}/$userId", body: formData);

    if (response != null) {
      // Logger.appLogs('responseRep :: $response');
      return ProfileUpdateResponseModel.fromJson(
          response as Map<String, dynamic>);
    } else {
      // Logger.appLogs('errorNull :: $response');
      return null;
    }
  }

  Future<CurrencyResponseModel?> fetchCurrency() async {
    final response = await _client.get(EndPointConstants.currencyScreenUrl);
     if(response != null) {
       return CurrencyResponseModel.fromJson(response as Map<String, dynamic>);
     } else {
       return null;
     }
  }

  Future deleteAccount({
    required String userId,
  }) async {
    final response =
        await _client.delete("${EndPointConstants.deleteAccountUrl}/$userId");

    return response;
  }

  Future logoutAccount() async {
    final response =
    await _client.put(EndPointConstants.logoutAccountUrl);
    return response;
  }

  Future<bool?> updateUserMode({String? userMode}) async {
    var body = {
      "mode": userMode
    };
    final response = await _client.put(EndPointConstants.updateUserMode, body: body);

    if(response != null) {
       return response['status'];
    } else {
      return false;
    }
  }

}
