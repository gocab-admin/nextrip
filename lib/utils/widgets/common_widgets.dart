import 'package:flutter/material.dart';

class CustomDivider extends StatelessWidget {
  final Color? color;
  final double? height;
  const CustomDivider({
    super.key,
    this.color, this.height,
  });

  @override
  Widget build(BuildContext context) {
    return Divider(
      height: height,
      color: color ?? Color(0xffE4E4E4),
    );
  }
}
