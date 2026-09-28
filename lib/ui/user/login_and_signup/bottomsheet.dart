import 'package:airstar_flutter/commonWidgets/button_widgets/button_widget.dart';
import 'package:airstar_flutter/routes/router_name.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:get/get.dart';
import 'package:airstar_flutter/utils/utils.dart';

class AgreeBottomSheet extends StatefulWidget {
  const AgreeBottomSheet({super.key});

  @override
  State<AgreeBottomSheet> createState() => _AgreeBottomSheetState();
}

class _AgreeBottomSheetState extends State<AgreeBottomSheet> {
  @override
  Widget build(BuildContext context) {
    return Container(
        color: AppColorData.appSecondaryColor,
        height: MediaQuery.of(context).size.height * 0.93,
        width: MediaQuery.of(context).size.height,
        padding: EdgeInsets.all(14),
        child: _bottomSheet());
  }

  Widget _bottomSheet() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: 30,
        ),
        Row(
          children: [
            // brandLogo(context),
            SvgPicture.asset(
              SVGAssets.airstar_logo,
              height: 45,
              width: 10,
            )
          ],
        ),
        SizedBox(
          height: 30,
        ),
        CommonText(
          text: Strings.community,
          style: TextStyle(
            fontSize: 14,
            color: AppColorData.bodyTextColor,
            fontWeight: FontWeight.w800,
          ),
        ),
        spacer(),
        CommonText(
          text: Strings.airBnbCommunity,
          style: TextStyle(
            fontSize: 30,
            color: AppColorData.bodyTextColor,
            fontWeight: FontWeight.w600,
          ),
        ),
        spacer(),
        CommonText(
            text: Strings.ensure,
            textAlign: TextAlign.justify,
            style: textStyle()),
        spacer(),
        spacer(),
        CommonText(text: Strings.agreePara, style: textStyle()),
        /* Expanded(child: Text(Strings.agreePara,
            style: textStyle()),),*/
        spacer(),
        spacer(),
        Row(
          children: [
            CommonText(
              text: Strings.learnMore,
              style: TextStyle(
                decoration: TextDecoration.underline,
                fontSize: 16,
                color: AppColorData.bodyTextColor,
                fontWeight: FontWeight.w600,
              ),
            ),
            Icon(
              Icons.arrow_forward_ios,
              size: 20,
            ),
          ],
        ),
        SizedBox(height: 100),
        CommonElevatedButton(
            elevatedButtonColor: AppColorData.appPrimaryColor,
            elevatedButtonName: Strings.agreeKeyWord,
            onTap: () {
              Get.toNamed(RouterName.dashBoard);
         /*     Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => DashBoard()),
              );*/
            }),
        spacer(),
        CommonElevatedButton(
          elevatedButtonColor: AppColorData.transparent,
          border: Border.all(color: AppColorData.blackBorderClr),
          elevatedButtonNameColor: AppColorData.bodyTextColor,
          elevatedButtonName: Strings.decline,
          onTap: () {
            Get.toNamed(RouterName.loginScreen);
           /* Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => LoginScreen()),
            );*/
          },
        )
      ],
    );
  }

  Widget spacer() {
    return SizedBox(
      height: 10,
    );
  }

  TextStyle textStyle() {
    return TextStyle(
      fontSize: 14,
      color: AppColorData.bodyTextColor,
      fontWeight: FontWeight.w400,
    );
  }
}
