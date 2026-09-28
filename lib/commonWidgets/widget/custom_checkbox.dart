import 'package:flutter/material.dart';

import '../../utils/components/color/app_color.dart';

class CustomCheckbox extends StatelessWidget {
  CustomCheckbox({
    super.key,
    required this.value,
    required this.onChanged,
  });

  final bool value;
  final ValueChanged<bool?>? onChanged;

  @override
  Widget build(BuildContext context) {
    return Transform.scale(
      scale: 1.15,
      child: Checkbox(
        side: BorderSide(color: AppColorData.grey03, width: 1.5),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
        activeColor: AppColorData.checkBoxSlctedClr,
        value: value,
        onChanged: onChanged,
      ),
    );
  }
}
