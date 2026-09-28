import 'package:flutter/material.dart';

import '../../utils/components/color/app_color.dart';


class CommonBlurContainer extends StatelessWidget {
  const CommonBlurContainer({super.key, this.height, this.width, this.borderRadius, this.isBorderRadius = true ,this.shape = BoxShape.rectangle});
  final double? height;
  final double? width;
  final BorderRadiusGeometry? borderRadius;
  final bool isBorderRadius;
  final BoxShape shape;

  @override
  Widget build(BuildContext context) {
    return  Container(
      height: height,
      width: width,
      decoration: BoxDecoration(
          shape: shape,
          borderRadius: borderRadius ??
              (isBorderRadius ? BorderRadius.circular(4) : BorderRadius.zero),
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: AppColorData.blurContainer,
              blurRadius: 20,
              spreadRadius: 0.05,
            ),
          ]),
    );
  }
}