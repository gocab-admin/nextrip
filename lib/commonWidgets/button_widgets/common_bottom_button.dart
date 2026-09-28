import 'package:airstar_flutter/commonWidgets/loading_widgets/loader.dart';
import 'package:flutter/material.dart';
import '../../utils/utils.dart';

class CommonBottomButton extends StatefulWidget {
  final String elevatedButtonName;
  final Color? elevatedButtonColor;
  final Color? elevatedButtonNameColor;
  final Function()? onTap;
  final double? height;
  final double? width;
  final Widget? icon;
  final BoxBorder? border;
  final bool? isLoad;
  final MainAxisAlignment? mainAxisAlignment;
  const CommonBottomButton(
      {super.key,
        required this.elevatedButtonName,
        required this.onTap,
        this.height,
        this.width,
        this.icon,
        this.elevatedButtonColor,
        this.elevatedButtonNameColor,
        this.border,
        this.mainAxisAlignment, this.isLoad = false});

  @override
  State<CommonBottomButton> createState() => _CommonBottomButtonState();
}

class _CommonBottomButtonState extends State<CommonBottomButton> {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap,
      child: Container(
          height: widget.height ?? 50,
          // 70,// MediaQuery.of(context).size.height *0.08,//
          width: widget.width ?? MediaQuery.of(context).size.width * 0.38,
          //378,// MediaQuery.of(context).size.width *0.98,//
          decoration: BoxDecoration(
              color: widget.elevatedButtonColor ?? AppColorData.appPrimaryColor,
              borderRadius: BorderRadius.circular(10),
              border: widget.border),
          child:(widget.isLoad!)? Loader(): Row(
            // mainAxisAlignment: widget.mainAxisAlignment ?? MainAxisAlignment.center,
            children: [
              (widget.icon != null)
                  ? Padding(
                padding: const EdgeInsets.symmetric(
                    horizontal: 8, vertical: 8),
                child: widget.icon ?? const SizedBox.shrink(),
              )
                  : const SizedBox.shrink(),
              Expanded(
                child: Container(
                  color: Colors.transparent,
                  child: Center(
                    child: CommonText(text:
                      widget.elevatedButtonName,

                      maxLines: 2,
                      style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontFamily: 'CircularStd',
                          fontSize: 16,
                          overflow: TextOverflow.ellipsis,
                          color: widget.elevatedButtonNameColor ??
                              AppColorData.appSecondaryColor),
                    ),
                  ),
                ),
              ),
            ],
          )
      ),
    );
  }
}
