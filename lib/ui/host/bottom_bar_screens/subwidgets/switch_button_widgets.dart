import 'package:flutter/material.dart';

import '../../../../commonWidgets/button_widgets/common_elevated_button.dart';
import '../../../../utils/components/color/app_color.dart';
import '../../../../utils/constants/common_text.dart';
import '../../../../utils/constants/textstyle.dart';

class CommonOptionCardWidget extends StatelessWidget {
  final Function()? onTap;
  final String title;
  final bool isSelected;

  const CommonOptionCardWidget(
      {super.key, this.onTap, required this.title, this.isSelected = false});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 6, horizontal: 16),
        decoration: BoxDecoration(
          color: isSelected ? AppColorData.grey06 : AppColorData.whiteClr,
          border: Border.all(
              color: isSelected
                  ? AppColorData.blackBorderClr
                  : AppColorData.boxBorder,
              width: isSelected ? 2 : 1),
          borderRadius: BorderRadius.circular(30),
        ),
        child: FittedBox(
          child: CommonText(
            overflow: TextOverflow.ellipsis,
            text: title,
            style: AppTextStyle.bodyTextStyle,
          ),
        ),
      ),
    );
  }
}

// witch user button mode widget



class SwitchUserModeButton extends StatelessWidget {
  final String text;
  final VoidCallback onTap;
  const SwitchUserModeButton({super.key,required this.text, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.bottomCenter,
      child:  Padding(
        padding: const EdgeInsets.only(bottom: 14.0),
        child: InkWell(
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.symmetric(
                horizontal: 14.0, vertical: 14.0),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(55),
              color: AppColorData.blackBorderClr,
            ),
            child: Row(
              spacing: 4,
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.sync, color: AppColorData.whiteClr,size: 20,),
                CommonText(
                    text: text,
                    style: AppTextStyle.bodyTextStyle
                        .copyWith(color: AppColorData.whiteClr)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class FilterOptionWidget extends StatelessWidget {
  final String title;
  final VoidCallback onTap;
  final bool hasFilter;

  const FilterOptionWidget({
    super.key,
    required this.title,
    required this.onTap,
    this.hasFilter = false,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        CommonOptionCardWidget(
          onTap: onTap,
          title: title,
        ),
        if (hasFilter)
          const Positioned(
            top: -3,
            right: 10,
            child: CircleAvatar(radius: 5),
          ),
      ],
    );
  }
}


class CommonBottomActionButtons extends StatelessWidget {
  final String clearText;
  final String applyText;
  final VoidCallback onClear;
  final VoidCallback onSave;
  const CommonBottomActionButtons({super.key,
    required this.onClear,
    required this.onSave,
    this.clearText = "CLEAR",
    this.applyText = "APPLY",
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 14.0),
      padding: const EdgeInsets.symmetric(vertical: 14.0),
      decoration: BoxDecoration(
        border: Border(top: BorderSide(color: AppColorData.dividerColor))
      ),
      child: Row(
        children: [
          Flexible(
            flex: 3,
            child: CommonElevatedButton(
              isTextBtn: true,
              elevatedButtonName: clearText,
              onTap: onClear,
            ),
          ),
          Flexible(
            flex: 1,
            child: CommonElevatedButton(
              elevatedButtonColor: AppColorData.blackButtonClr,
              elevatedButtonName: applyText,
              onTap: onSave,
            ),
          )
        ],
      ),
    );
  }
}

