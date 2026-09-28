import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

import '../../../../commonWidgets/button_widgets/common_elevated_button.dart';
import '../../../../commonWidgets/widget/common_bottom_sheet_widget.dart';
import '../../../../utils/utils.dart';
import '../searchBar.dart';

class WelcomeWishlistBottomsheet extends StatelessWidget {
  const WelcomeWishlistBottomsheet({super.key});

  static void show(BuildContext context) {
    showCustomModalBottomSheet(
      showDivider: false,
      context: context,
      backgroundColor: AppColorData.wishListBtmShtClr,
      builder: (context) {
        return WelcomeWishlistBottomsheet();
      },
    ).then((_) async {
      PreferenceHelper.setBool(PrefConstant.hasShownWishlistBottomSheet, true);
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Padding(
        padding: EdgeInsetsGeometry.symmetric(vertical: 20.0, horizontal: 20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: AppColorData.appSecondaryColor,
                    // border: Border.all(color: AppColorData.appSecondaryColor,width: 3),
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: [
                      BoxShadow(
                        color: AppColorData.greyColor.withOpacity(0.5),
                        offset: Offset(0, 0),
                        blurRadius: 5,
                        spreadRadius: 0,
                      ),
                    ],
                  ),
                  child: Card(
                    child: Image.asset(
                      PNGAssets.wishListImage,
                      filterQuality: FilterQuality.high,
                    ),
                  ),
                ),
                Positioned(
                  right: 10,
                  top: 10,
                  child: SvgPicture.asset(SVGAssets.likedIcon),
                ),
              ],
            ),
            doubleSpacer(height: 30),
            CommonText(
              text: "saveYourFavInPlace",
              style: AppTextStyle.titleStyle,
            ),
            doubleSpacer(),
            CommonText(
              textAlign: TextAlign.center,
              text: "tapTheHeartIcon",
              style: AppTextStyle.bodyTextStyle,
            ),
            doubleSpacer(height: 60),
            CommonElevatedButton(
              height: 60,
              //  width: 330,
              elevatedButtonColor: AppColorData.blackButtonClr,
              elevatedButtonName: "gotIt",
              onTap: () {
                Navigator.pop(context);
              },
            ),
            // SizedBox(
            //   height: 20,
            // )
          ],
        ),
      ),
    );
  }
}
