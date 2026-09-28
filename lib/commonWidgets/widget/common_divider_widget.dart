import 'package:flutter/material.dart';

import '../../utils/utils.dart';

Widget divider({double height = 30.0, Color? color, double thickness = 1.0}) {
  return Divider(
    thickness: thickness,
    color: color ?? AppColorData.boxBorder,
    height: height,
  );
}