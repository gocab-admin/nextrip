import 'package:flutter/material.dart';

import '../../../../commonWidgets/widget/common_cache_image_widget.dart';
import '../../../../commonWidgets/widget/error_image.dart';
import '../../../../utils/components/color/app_color.dart';
import '../../../../utils/constants/common_text.dart';
import '../../../../utils/constants/textstyle.dart';

class CommonRadioTile extends StatelessWidget {
  final String value;
  final String? groupValue;
  final String title;
  final String? imageUrl;
  final VoidCallback? onTap;
  final ValueChanged<String?>? onChanged;
  final EdgeInsetsGeometry? contentPadding;
  final bool hasSecondaryWidget;

  const CommonRadioTile({super.key,
    required this.value,
    required this.groupValue,
    required this.title,
    this.imageUrl,
    this.onTap,
    this.onChanged,
    this.contentPadding,
    this.hasSecondaryWidget = true,
  });

  @override
  Widget build(BuildContext context) {
    return RadioListTile<String>(
        value: value,
        groupValue: groupValue,
        contentPadding: contentPadding ??  EdgeInsets.zero,
        activeColor: AppColorData.blackClr,
        onChanged: (newValue) {
          if(newValue != null) {
            onChanged?.call(newValue);
          }
        },
      title: CommonText(
        text: title,
        style: AppTextStyle.bodyTextStyle,
      ),
      secondary: hasSecondaryWidget ? SizedBox(
        height: 40,
        width: 60,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: (imageUrl == null || imageUrl!.isEmpty)
              ? ErrorImage()
              : CacheImageWidget(
            fit: BoxFit.cover,
            errorBuilder: (context, url, error) => ErrorImage(),
            imageUrl: imageUrl!,
          ),
        ),
      ) : null,
    );
  }
}
