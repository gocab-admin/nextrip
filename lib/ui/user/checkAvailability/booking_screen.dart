import 'package:provider/provider.dart';
import 'package:airstar_flutter/commonWidgets/button_widgets/button_widget.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:get/route_manager.dart';
import 'package:in_app_review/in_app_review.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/view_model.dart';
import '../../../routes/routes.dart';

class BookingScreen extends StatefulWidget {
  const BookingScreen({
    super.key,
  });

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  InAppReview inAppReview = InAppReview.instance;

  @override
  void initState() {
    _inAppReview();
    super.initState();
  }

  _inAppReview() async {
    if (await inAppReview.isAvailable()) {
      inAppReview.requestReview();
    }
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvoked: (didPop) {
        Get.offAllNamed(RouterName.dashBoard,
            predicate: (Route<dynamic> predecate) => false);
      },
      child: Scaffold(
        backgroundColor: AppColorData.appSecondaryColor,
        body: Consumer<BookingViewModel>(
            builder: (context, value, child) {
              var isCash = value.selectedPaymentType == "payAtHotel";
              return SingleChildScrollView(
                child: Padding(
                  padding: horizontalPadding(),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      doubleSpacer(),
                      isCash ?
                      Image.asset(PNGAssets.booking_logo) :
                      Stack(
                        alignment: Alignment.center,
                        children: [
                          Image.asset(PNGAssets.paymentSuccessBg),
                          Image.asset(PNGAssets.paymentSuccessTick),
                        ],
                      ),
                      CommonText(
                        textAlign: TextAlign.center,
                        text: tr(isCash ? "thankYourForBooking" : "payMntSucsful"),
                        style: isCash? AppTextStyle.headingStyle :  AppTextStyle.loginHeadingStyle,
                      ),
                      CommonText(
                        textAlign: TextAlign.center,
                        text: tr("pyMntScsFulSub"),
                        style: AppTextStyle.bodyTextStyle
                            .copyWith(fontWeight: FontWeight.w400),
                      ),
                      doubleSpacer(),
                      CommonElevatedButton(
                        onTap: () {
                          Get.offAllNamed(RouterName.dashBoard,arguments: {RouterArguments.index: '2'});
                        },
                        elevatedButtonColor: AppColorData.blackButtonClr,
                        elevatedButtonName: "bookingDetails",
                      ),
                      doubleSpacer(),
                    ],
                  ),
                ),
              );
            }
        ),
      ),
    );
  }
}
