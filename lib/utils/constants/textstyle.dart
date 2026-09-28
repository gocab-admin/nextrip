import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';
import 'package:flutter/rendering.dart';

import '../components/color/app_color.dart';

class AppTextStyle {
  AppTextStyle._();

  static TextStyle loginHeadingStyle = TextStyle(
    fontFamily:
        "CircularStd", // Use the font family name defined in pubspec.yaml
    fontWeight: FontWeight.w500,
    fontSize: 35,
    color: AppColorData.bodyTextColor,
  );

  static TextStyle headingStyle = TextStyle(
    fontFamily:
        "CircularStd", // Use the font family name defined in pubspec.yaml
    fontWeight: FontWeight.w500,
    fontSize: 25,
    color: AppColorData.bodyTextColor,
  );

  static TextStyle titleStyle = TextStyle(
    fontFamily:
        "CircularStd", // Use the font family name defined in pubspec.yaml
    fontWeight: FontWeight.w600,
    fontSize: 20,
    color: AppColorData.bodyTextColor,
  );

  static TextStyle headerStyle = TextStyle(
    fontSize: 18,
    fontFamily: "CircularStd",
    color: AppColorData.bodyTextColor,
    fontWeight: FontWeight.w600,
  );
  static TextStyle priceStyle = TextStyle(
    fontSize: 18,
    fontFamily: "CircularStd",
    color: AppColorData.bodyTextColor,
    fontWeight: FontWeight.w800,
  );

  // static TextStyle headerHintStyle = TextStyle(
  //   fontSize: 18,
  //   fontFamily: "CircularStd",
  //   color: AppColorData.bodyTextColor,
  //   fontWeight: FontWeight.w400,
  // );

  static TextStyle bodyTextStyle = TextStyle(
      fontFamily: "CircularStd",
      fontSize: 16,
      fontWeight: FontWeight.w500,
      color: AppColorData.bodyTextColor);

  static TextStyle buttonTextStyle = TextStyle(
      fontFamily: "CircularStd",
      fontSize: 16,
      fontWeight: FontWeight.w600,
      color: AppColorData.bodyTextColor);

  // static TextStyle bodyHintStyle = TextStyle(
  //     fontFamily: "CircularStd",
  //     fontSize: 16,
  //     fontWeight: FontWeight.w400,
  //     color: AppColorData.bodyTextColor);

  static TextStyle subBodyStyle = TextStyle(
    fontFamily: "CircularStd",
    fontSize: 14,
    color: AppColorData.bodyTextColor,
    fontWeight: FontWeight.w500,
  );

  static TextStyle subBodyHintTextStyle = TextStyle(
    fontSize: 14,
    fontFamily: "CircularStd",
    color: AppColorData.bodyTextColor,
    fontWeight: FontWeight.w300,
  );

  static TextStyle contentStyle = TextStyle(
    fontFamily: "CircularStd",
    fontSize: 12,
    color: AppColorData.bodyTextColor,
    fontWeight: FontWeight.w500,
  );

  // static TextStyle contentHintTextStyle = TextStyle(
  //   fontFamily: "CircularStd",
  //   fontSize: 12,
  //   color: AppColorData.bodyTextColor,
  //   fontWeight: FontWeight.w400,
  // );

  // static TextStyle underlinedSubBodyText = TextStyle(
  //   fontFamily: "CircularStd",
  //   fontSize: 14,
  //   fontWeight: FontWeight.w400,
  //   color: AppColorData.bodyTextColor,
  //   decoration: TextDecoration.underline,
  // );

  // static TextStyle underlinedContentText = TextStyle(
  //   fontFamily: "CircularStd",
  //   fontSize: 12,
  //   fontWeight: FontWeight.w400,
  //   color: AppColorData.bodyTextColor,
  //   decoration: TextDecoration.underline,
  // );

  // static TextStyle underlinedBodyText = TextStyle(
  //   fontFamily: "CircularStd",
  //   fontSize: 16,
  //   fontWeight: FontWeight.w500,
  //   color: AppColorData.bodyTextColor,
  //   decoration: TextDecoration.underline,
  // );

  // static TextStyle underLinedHeaderStyle = TextStyle(
  //   fontFamily:
  //   "CircularStd", // Use the font family name defined in pubspec.yaml
  //   fontWeight: FontWeight.w500,
  //   fontSize: 18,
  //   decoration: TextDecoration.underline,
  //   color: AppColorData.bodyTextColor,
  // );
}
