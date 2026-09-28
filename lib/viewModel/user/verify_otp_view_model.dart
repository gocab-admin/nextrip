import 'package:airstar_flutter/data/models/user/send_otp_response_model.dart';
import 'package:airstar_flutter/data/models/user/verify_otp_response_model.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import '../../data/repositories/user/verify_otp_repo.dart';
import '../../utils/utils.dart';

class VerifyOtpViewModel extends BaseViewModel {
  //Repository
  final VerifyOtpRepository _sendOtpRepository = locator<VerifyOtpRepository>();

  //Model
  SendOtpResponseModel? _sendOtpResponseModel;

  SendOtpResponseModel? get sendOtpResponseModel => _sendOtpResponseModel;
  AppValidators Appvalidators = AppValidators();
  Future<SendOtpResponseModel?> fetchSendOtp({
    required String phoneNo,
    required String phoneCode,
    required String userType,
    required String verifyBy,
    required String verifyFrom,
    required String email,
  }) async {
    //Loader State
    setState(ViewState.busy);

    try {
      var data = await _sendOtpRepository.fetchSendOtp(
        phoneNo: phoneNo,
        phoneCode: phoneCode,
        userType: userType,
        verifyBy: verifyBy,
        verifyFrom: verifyFrom,
        email: email,
      );

      if (data != null) {
        _sendOtpResponseModel = data;
        //Success State
        setState(ViewState.success);
      } else {
        //Failure State
        setState(ViewState.idle);
      }
    } on AppException catch (appException) {
      //Common Error Handler
      errorMsg = errorHandler(appException);
      //Failed
      setState(ViewState.idle);
    }
    return null;
  }

  VerifyOtpResponseModel? _verifyOtpResponseModel;

  VerifyOtpResponseModel? get verifyOtpResponseModel => _verifyOtpResponseModel;
  Future<VerifyOtpResponseModel?> verifyOtp({
    required Function(VerifyOtpResponseModel) onSuccessRes,
    required String phoneNo,
    required String phoneCode,
    required String userType,
    required String verifyBy,
    required String verifyFrom,
    required String code,
  }) async {
    setState(ViewState.secondaryLoader);

    try {
      var data = await _sendOtpRepository.verifyOtp(
          phoneNo, phoneCode, userType, verifyBy, verifyFrom, code);
      if (data != null) {
        _verifyOtpResponseModel = data;
        setState(ViewState.success);
        onSuccessRes(verifyOtpResponseModel!);
      } else {
        setState(ViewState.idle);
      }
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      // Logger.appLogs('errorType :: ${appException.type}');
      // Logger.appLogs('onFailure :: $appException');

      setState(ViewState.idle);
    }
    return null;
  }

}
