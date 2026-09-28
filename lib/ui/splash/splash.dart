import 'dart:async';

import 'package:airstar_flutter/commonWidgets/brand_logo.dart';
import 'package:airstar_flutter/viewModel/user/common_viewmodel.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_libphonenumber/flutter_libphonenumber.dart';
import 'package:get/route_manager.dart';
import 'package:provider/provider.dart';

import '../../routes/routes.dart';
import '../../services/app_update_service.dart';
import '../../utils/utils.dart';
import '../../viewModel/user/login_view_model.dart';
import '../../viewModel/user/profile_view_model.dart';

class Splash extends StatefulWidget {
  const Splash({Key? key}) : super(key: key);

  @override
  _SplashState createState() => _SplashState();
}

CommonViewModel? commonViewModel;

class _SplashState extends State<Splash> {
  LoginViewModel? loginViewModel;
  CommonViewModel? commonViewModel;
  EditProfileViewModel? editProfileViewModel;
  final AppUpdateService _updateService = AppUpdateService();

  @override
  void initState() {
    loginViewModel = Provider.of<LoginViewModel>(context, listen: false);
    commonViewModel = Provider.of<CommonViewModel>(context, listen: false);
    editProfileViewModel = Provider.of<EditProfileViewModel>(
      context,
      listen: false,
    );

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await initAPIs();
    });
    _checkUpdateAndProceed();
    super.initState();
    init();
  }

  Future<void> _checkUpdateAndProceed() async {
    // Wait for the update flow to complete
    if (kIsWeb) {
      navigateToNextPage();
    } else {
      final canProceed = await _updateService.showInAppUpdateFlow(context);

      if (canProceed) {
        // Navigate to home screen only after update is complete or no update needed
        navigateToNextPage();
      }
    }
  }

  Future<void> initAPIs() async {
    await Future.wait([
      commonViewModel!.fetchSettings(),
      loginViewModel!.fetchListOfCountry(commonViewModel!),
      editProfileViewModel!.fetchCurrency(),
      editProfileViewModel!.loadSavedExchangeRate(),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      child: Scaffold(
        body: Container(
          width: MediaQuery.of(context).size.width,
          height: MediaQuery.of(context).size.height,
          color: AppColorData.wishListBtmShtClr.withOpacity(0.3),
          child: brandLogo(context),
        ),
      ),
    );
  }

  navigateToNextPage() async {
    String? token = await PreferenceHelper.getString(PrefConstant.authToken);
    String? userMode = await PreferenceHelper.getString(PrefConstant.userMode);

    await Future.delayed(Duration(seconds: 5));

    if (token.isNotEmpty && token != '') {
      AppConstant.authToken = token;
      if (userMode == "host") {
        Get.offAllNamed(
          RouterName.hostDashboard,
          arguments: {RouterArguments.token: token},
        );
      } else {
        Get.offAllNamed(
          RouterName.dashBoard,
          arguments: {RouterArguments.token: token},
        );
      }
    } else {
      AppConstant.authToken = null;
      Get.offAllNamed(
        RouterName.loginScreen,
        arguments: {RouterArguments.isMain: 'true'},
      );
    }
  }
}
