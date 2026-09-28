import 'package:airstar_flutter/data/models/user/verify_otp_response_model.dart';
import 'package:airstar_flutter/services/dio_client.dart';
import 'package:airstar_flutter/utils/constants/constants.dart';
import 'package:dio/dio.dart';
import '../../models/user/send_otp_response_model.dart';

class VerifyOtpRepository {
  final ApiClient _client = ApiClient();

  Future<SendOtpResponseModel?> fetchSendOtp({
    phoneNo,
    String? phoneCode,
    userType,
    verifyBy,
    verifyFrom,
    email,
  }) async {
    var body = {
      'userType': userType,
      'phone': phoneNo,
      'phoneCode': "+${phoneCode}",
      'verifyFrom': verifyFrom,
      'verifyBy': verifyBy,
    };
    final response =
        await _client.post(EndPointConstants.sendOtpUrl, body: body);
    // Logger.appLogs('callBackResponse :: $response');
    if (response != null) {
      // success returning data back
      // Logger.appLogs('responseRepo :: $response');
      return SendOtpResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      // Failed returning null
      // Logger.appLogs('errorNull :: $response');
      return null;
    }
  }

  Future<VerifyOtpResponseModel?> verifyOtp(
      phoneNo, phoneCode, userType, verifyBy, verifyFrom, code) async {
    var body = {
      'phone': phoneNo,
      'phoneCode': "+${phoneCode}",
      'userType': userType,
      'verifyBy': verifyBy,
      'verifyFrom': verifyFrom,
      'code': code,
    };

    final response = await _client.post(
      EndPointConstants.verifyOtpUrl,
      body: body,
      options: Options(
        contentType: Headers.formUrlEncodedContentType,
      ),
    );
    // Logger.appLogs('callBackResponse :: $response');
    if (response != null) {
      // Logger.appLogs('responseRepo :: $response');
      return VerifyOtpResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      // Logger.appLogs('errorNull :: $response');
      return null;
    }
  }
}
