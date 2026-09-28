import 'package:airstar_flutter/commonWidgets/loading_widgets/loader.dart';
import 'package:flutter/material.dart';
import '../../utils/utils.dart';

class CommonElevatedButton extends StatefulWidget {
  final String elevatedButtonName;
  final Color? elevatedButtonColor;
  final Color? elevatedButtonNameColor;
  final Color? loaderColor;
  final bool? isTextBtn;
  final Function()? onTap;
  final double? height;
  final double? width;
  final Widget? icon;
  final BoxBorder? border;
  final double? borderRadius;
  final bool? isLoad;
  final bool? showLoader;
  final bool? isUnderline;
  final MainAxisAlignment? mainAxisAlignment;
  final TextStyle? style;
  final bool? isSuffix;
  const CommonElevatedButton(
      {super.key,
      required this.elevatedButtonName,
      required this.onTap,
      this.height,
      this.width,
      this.icon,
      this.elevatedButtonColor,
      this.elevatedButtonNameColor,
      this.loaderColor,
      this.border,
      this.borderRadius,
      this.mainAxisAlignment,
      this.isLoad = false,
      this.showLoader = false,
      this.isTextBtn = false,
      this.isUnderline = true,
      this.style,
      this.isSuffix = false,
      });

  @override
  State<CommonElevatedButton> createState() => _CommonElevatedButtonState();
}

class _CommonElevatedButtonState extends State<CommonElevatedButton> {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap:(widget.isLoad!)? (){}: widget.onTap,
      child: Container(
          height: widget.height ?? 50,
          // 70,// MediaQuery.of(context).size.height *0.08,//
          width: widget.width,
          //378,// MediaQuery.of(context).size.width *0.98,//
          decoration: BoxDecoration(
              color: (widget.isTextBtn == true)? AppColorData.transparent : widget.elevatedButtonColor ??AppColorData.appPrimaryColor,
              borderRadius: BorderRadius.circular(widget.borderRadius ?? 10),
              border: widget.border),
          child: (widget.isLoad! && widget.showLoader!)
              ? Loader(color: widget.loaderColor ?? AppColorData.whiteClr)
              : Row(
            //mainAxisAlignment: widget.isSuffix! ? MainAxisAlignment.end : MainAxisAlignment.start,
                  // mainAxisAlignment: widget.mainAxisAlignment ?? MainAxisAlignment.center,
                  children: [
                    (widget.icon != null)
                        ? Padding(
                            padding: const EdgeInsets.only(left: 15).toLTRAware(context),
                            child: widget.icon ?? const SizedBox.shrink(),
                          )
                        : const SizedBox.shrink(),
                    (widget.isTextBtn == true)? Center(
                      child: CommonText(
                          text: widget.elevatedButtonName,
                          // style: AppTextStyle.buttonTextStyle.copyWith(
                          //     color: widget.elevatedButtonNameColor ??
                          //         AppColorData.textColor,
                          //     decoration:widget.isUnderline! ?  TextDecoration.underline : TextDecoration.none)
                          style:(widget.style ?? AppTextStyle.buttonTextStyle).copyWith(
                              color: widget.elevatedButtonNameColor ??
                                  AppColorData.bodyTextColor,
                              decoration:widget.isUnderline! ?  TextDecoration.underline : TextDecoration.none)
                      ),
                    ):
                    Expanded(
                      child: Center(
                        child: CommonText(
                            text: widget.elevatedButtonName,
                            style: AppTextStyle.buttonTextStyle.copyWith(
                                color: widget.elevatedButtonNameColor ??
                                    AppColorData.appSecondaryColor)),
                      ),
                    ),
                  ],
                )),
    );
  }
}
