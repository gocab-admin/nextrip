import 'package:flutter/material.dart';

import '../../../../utils/components/color/app_color.dart';

class CommonBlackContainer extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final double borderRadius;

  const CommonBlackContainer({
    super.key,
    required this.child,
    this.padding,
    this.borderRadius = 20,
  });

  @override
  Widget build(BuildContext context) {
    return  Container(
      width: double.infinity,
      padding: padding ?? EdgeInsets.all(16),
      decoration: BoxDecoration(
          color: AppColorData.blackClr,
          borderRadius: BorderRadius.circular(borderRadius),
          boxShadow: [
            BoxShadow(
              color: AppColorData.whiteClr.withOpacity(0.2),
              blurRadius: 10,
              offset: Offset(0, 2),
            )
          ]
      ),
      child: child,
    );
  }
}
