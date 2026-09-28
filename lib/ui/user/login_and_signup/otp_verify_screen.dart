import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/user/verify_otp_response_model.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/user/login_view_model.dart';
import 'package:airstar_flutter/viewModel/user/verify_otp_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/route_manager.dart';
import 'package:pinput/pinput.dart';
import 'package:provider/provider.dart';

import '../../../routes/routes.dart';

class OtpVerifyScreen extends StatefulWidget {
  const OtpVerifyScreen({
    super.key,
    required this.mobileNumber,
    required this.code,
    this.isBottomSheet = false,
  });

  final String mobileNumber;
  final String code;
  final bool? isBottomSheet;

  @override
  State<OtpVerifyScreen> createState() => _OtpVerifyScreenState();
}

class _OtpVerifyScreenState extends State<OtpVerifyScreen> {
  VerifyOtpViewModel? verifyOtpViewModel;
  LoginViewModel? loginViewModel;
  GlobalKey<FormState> otpFormKey = GlobalKey<FormState>();
  late TextEditingController _otpController;
  bool? pageChange = false;

  String? _errorText;

  void sendOtp({bool showMessage = false}) {
    verifyOtpViewModel!
        .fetchSendOtp(
          phoneNo: widget.mobileNumber,
          phoneCode: widget.code,
          userType: "USER",
          verifyBy: "phone",
          verifyFrom: "LOGIN",
          email: "",
        )
        .then((val) {
          if (showMessage) ToastUtil.showMessage("Otp Sent");
        });
  }

  onSuccessRes(VerifyOtpResponseModel verifyOtpResponseModel) {
    if (verifyOtpViewModel!.verifyOtpResponseModel?.status == true) {
      loginViewModel
          ?.userLogin(
            userType: 'USER',
            isEmail: false,
            isHost: false,
            isGuest: false,
            phoneNo: loginViewModel!.phoneController.text,
            phoneCode: loginViewModel?.selectedCountryCode1?.phoneCode ?? "1",
            code: _otpController.text,
          )
          .then((val) async {
            if (val == true) {
              FocusManager.instance.primaryFocus?.unfocus();
              if (loginViewModel?.loginResponseModel?.data.user.verified == true) {
                if (widget.isBottomSheet == true) {
                  Get.back();
                } else {
                  Get.offAllNamed(
                    RouterName.dashBoard,
                    arguments: {RouterArguments.token: loginViewModel!.loginResponseModel?.data.user.token},
                    predicate: (Route<dynamic> predecate) => false,
                  );
                }
                loginViewModel!.clearController();
                _otpController.clear();
              }
            }
          });
    }
  }

  @override
  void initState() {
    _otpController = TextEditingController();
    verifyOtpViewModel = Provider.of<VerifyOtpViewModel>(context, listen: false);
    loginViewModel = Provider.of<LoginViewModel>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      sendOtp();
    });
    super.initState();
  }

  @override
  void dispose() {
    _otpController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.isBottomSheet == true) {
      return Consumer<VerifyOtpViewModel>(builder: (context, viewModel, child) => _renderBody(viewModel));
    }
    return Consumer<VerifyOtpViewModel>(
      builder: (context, viewModel, child) {
        return Scaffold(
          backgroundColor: AppColorData.appSecondaryColor,
          appBar: CommonAppBar(
            elevation: 4,
            isMainPage: false,
            showBorder: true,
            titleText: "confirmNumber",
            isBack: viewModel.state == ViewState.secondaryLoader || pageChange == true ? true : false,
          ),
          body: Consumer<VerifyOtpViewModel>(
            builder: (context, viewModel, child) {
              return _renderBody(viewModel);
            },
          ),
        );
      },
    );
  }

  Widget _renderBody(viewModel) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20, top: 10),
      child: Column(
        children: <Widget>[
          otpField(),
          if (widget.isBottomSheet != true) Spacer(),
          Padding(
            padding: horizontalPadding(),
            child: Consumer<VerifyOtpViewModel>(
              builder: (context, viewModel, child) {
                return CommonElevatedButton(
                  elevatedButtonColor: AppColorData.appPrimaryColor,
                  showLoader: true,
                  isLoad: viewModel.state == ViewState.secondaryLoader || pageChange == true ? true : false,
                  elevatedButtonName: tr("continueKeyWord"),
                  onTap: () async {
                    if (otpFormKey.currentState?.validate() ??
                        false || _otpController.text.isEmpty || _otpController.text.length != 4) {
                      _errorText = null;
                      verifyOtpViewModel?.notify();
                      await verifyOtpViewModel?.verifyOtp(
                        // onFailureRes: onFailureRes,
                        onSuccessRes: onSuccessRes,
                        phoneNo: widget.mobileNumber,
                        phoneCode: widget.code,
                        userType: 'USER',
                        verifyBy: 'phone',
                        verifyFrom: 'LOGIN',
                        code: _otpController.text,
                      );
                    } else {
                      _errorText = 'otpNotValid';
                      verifyOtpViewModel?.notify();
                    }
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget otpField() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 14.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          const SizedBox(height: 14),
          CommonText(
            text: "${tr("otpSub")}${widget.mobileNumber}",
            style: AppTextStyle.bodyTextStyle.copyWith(fontWeight: FontWeight.w400),
          ),
          const SizedBox(height: 14),
          otpWidget(),
          const SizedBox(height: 14),
          Align(
            alignment: Alignment.centerLeft,
            child: Row(
              children: [
                CommonText(text: "resendOtpSub", style: AppTextStyle.subBodyHintTextStyle),
                SizedBox(width: 10),
                CommonElevatedButton(
                  isTextBtn: true,
                  onTap: () {
                    sendOtp(showMessage: true);
                  },
                  elevatedButtonName: "sendAgain",
                  style: AppTextStyle.bodyTextStyle,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget otpWidget() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: 4,
      children: [
        Form(
          key: otpFormKey,
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppColorData.boxBorder),
            ),
            child: Pinput(
              validator: (value) {
                if (value == null || value.length != 4) {
                  return 'Enter 4-digit OTP';
                }
                return null;
              },
              onCompleted: (text) {
                Logger.appLogs('Entered pin is $text');
              },
              onChanged: (text) {
                Logger.appLogs('Enter on change pin is $text');
                _otpController.text = text;
              },
              length: 4,
              controller: _otpController,
              autofocus: true,
              showCursor: true,
              cursor: Container(width: 2, height: 20, color: AppColorData.appPrimaryColor),
              keyboardType: TextInputType.number,
              inputFormatters: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(4)],
              defaultPinTheme: pinTheme(),
              focusedPinTheme: pinTheme(),
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              preFilledWidget: CommonText(
                text: '-',
                style: TextStyle(fontSize: 20, color: Colors.grey),
              ),
            ),
          ),
        ),
        CommonText(
          text: _errorText,
          style: TextStyle(color: AppColorData.errorColor, fontSize: 12),
        ),
      ],
    );
  }

  PinTheme pinTheme() {
    return PinTheme(
      height: 50,
      width: 50,
      textStyle: TextStyle(fontSize: 20, fontWeight: FontWeight.w500),
      decoration: BoxDecoration(
        border: Border.all(color: AppColorData.transparent, width: 1),
        borderRadius: BorderRadius.circular(8),
      ),
    );
  }
}
