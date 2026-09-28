import 'package:airstar_flutter/utils/utils.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';

class CommonText extends StatefulWidget {
  final String? text;
  final double? fontSize;
  final double? textScaleFactor;
  final Color? color;
  final int? maxLines;
  final FontWeight? fontWeight;
  final String? fontFamily;
  final TextAlign? textAlign;
  final bool? isUnderline;
  final Color? underLineColor;
  final TextOverflow? overflow;
  final TextStyle? style;
  final bool? isWhiteText;

  CommonText({
    super.key,
    this.text,
    this.fontSize,
    this.fontWeight,
    this.fontFamily,
    this.style,
    this.isUnderline,
    this.underLineColor,
    this.color,
    this.maxLines,
    this.textScaleFactor,
    this.textAlign,
    this.overflow,
    this.isWhiteText = false,
  });

  @override
  State<CommonText> createState() => _CommonTextState();
}

class _CommonTextState extends State<CommonText> {
  @override
  Widget build(BuildContext context) {
    TextStyle textStyle = widget.style ??
        TextStyle(
          fontSize: widget.fontSize,
          fontWeight: widget.fontWeight,
          fontFamily: widget.fontFamily,
          color: widget.isWhiteText == true
              ? AppColorData.appSecondaryColor
              : AppColorData.bodyTextColor,
        );
    textStyle = textStyle.copyWith(
      decoration: widget.isUnderline == true
          ? TextDecoration.underline
          : textStyle.decoration,
      decorationColor: widget.underLineColor ??  AppColorData.blackClr
    );

    return Text(widget.text ?? '',
            textAlign: widget.textAlign,
            overflow: widget.overflow,
            maxLines: widget.maxLines,
            softWrap: true,
            style: textStyle
            )
        .tr(namedArgs: {"appName": Strings.appName});
  }
}
