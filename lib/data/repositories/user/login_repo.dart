import 'package:airstar_flutter/data/models/user/user_exist_response_model.dart';
import 'package:airstar_flutter/services/dio_client.dart';
import 'package:airstar_flutter/utils/constants/constants.dart';
import '../../models/user/login_response_model.dart';
import '../../models/user/social_login_response_model.dart';

class LoginRepository {
  ApiClient _client = ApiClient();


  Future<UserExistResponseModel?> fetchUserExist(
      {required Map<String, dynamic>? queryParameters}) async {
    final response = await _client.get(EndPointConstants.userExistUrl,
        queryParameters: queryParameters);

    if (response != null) {
      // Logger.appLogs("user response : ${response}");
      return UserExistResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      return null;
    }
  }

  Future<LoginResponseModel> userLogin(
      {phoneNo, phoneCode, userType, code, email, password, isEmail,String? fcmId}) async {
    var body = isEmail
        ? {'userType': userType, 'email': email, 'password': password, 'fcmId': fcmId}
        : {
            'phone': phoneNo.replaceAll(RegExp(r'[\s-]'), ''),
            'phoneCode': "+${phoneCode}",
            'code': code,
            'userType': userType,
            'fcmId': fcmId
          };

    final response =
        await _client.post(EndPointConstants.loginScreenUrl, body: body);

    return LoginResponseModel.fromJson(response as Map<String, dynamic>);
  }

  Future<bool> userForgotPassword({email, isEmail}) async {
    var body = {
      "email": email,
      "userType": "USER",
      "verifyBy": "email",
      "verifyFrom": "FORGETPASSWORD"
    };

    final response =
        await _client.post(EndPointConstants.forgetPasswordUrl, body: body);
    if (response != null) {
      return true;
    } else {
      return false;
    }
  }

  Future<SocialLoginResponseModel?> socialLogin({
    required String type,
    required  String fcmId,
    required String accessToken}) async{

     var body = {
       "type": type,
       "fcmId":fcmId,
       "accessToken":accessToken
     };

    final response = await _client.put(EndPointConstants.loginScreenUrl, body: body);

    if(response != null){
      return SocialLoginResponseModel.fromJson(response as Map<String, dynamic>);
    }
    else {
      // Logger.appLogs('errorNull :: $response');
      return null;
    }


  }
}
