import 'package:airstar_flutter/utils/constants/constants.dart';
import 'package:flutter/material.dart';

import '../../utils/components/color/app_color.dart';

class TranslateAndCurrencyCardWidget extends StatefulWidget {
  final String title;
  final String? subtitle;
  final String? symbol;
  final bool isSelected;
  final VoidCallback onTap;
  final double? verticalPadding;

  const TranslateAndCurrencyCardWidget({
    super.key,
    required this.title,
    this.subtitle,
    this.symbol,
    required this.isSelected,
    required this.onTap,
    this.verticalPadding,
  });

  @override
  State<TranslateAndCurrencyCardWidget> createState() =>
      _TranslateAndCurrencyCardWidgetState();
}

class _TranslateAndCurrencyCardWidgetState
    extends State<TranslateAndCurrencyCardWidget> {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap,
      child: Container(
        padding: EdgeInsets.symmetric(
            vertical: widget.verticalPadding ?? 20.0, horizontal: 14),
        margin: EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
            border: widget.isSelected
                ? Border.all(color: AppColorData.appPrimaryColor, width: 2)
                : Border.all(color: AppColorData.boxBorder)),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              spacing: 5.0,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CommonText(
                  text: widget.title,
                  style: AppTextStyle.subBodyStyle,
                ),
                if (widget.subtitle != null || widget.symbol != null)
                  CommonText(
                    text: "${widget.subtitle} - ${widget.symbol}",
                    style: AppTextStyle.bodyTextStyle,
                  ),
              ],
            ),
            if (widget.isSelected)
              Icon(
                Icons.check_circle,
                color: AppColorData.appPrimaryColor,
              ),
          ],
        ),
      ),
    );
  }
}
