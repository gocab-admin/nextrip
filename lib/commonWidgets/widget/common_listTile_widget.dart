import 'package:airstar_flutter/utils/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class ListTileWidget extends StatefulWidget {
  final Widget? leadingWidget;
  final Widget? trailingWidget;
  final IconData? leadingIcon;
  final String titleText;
  final String? subTitle;
  final String? leadingIconSVG;
  final TextStyle? titleTextStyle;
  final TextStyle? subTitleTextStyle; // New property for subtitle text style
  final IconData? trailingIcon;
  final bool showDivider;
  final Color dividerColor;
  final double dividerThickness;
  final void Function()? onTap;

  ListTileWidget({
    this.leadingWidget,
    this.trailingWidget,
    this.leadingIcon,
    required this.titleText,
    this.subTitle,
    this.titleTextStyle,
    this.subTitleTextStyle, // Include in constructor
    this.trailingIcon,
    this.showDivider = true,
    this.dividerColor = Colors.grey,
    this.dividerThickness = 1.0,
    this.onTap,
    this.leadingIconSVG,
  });

  @override
  _ListTileWidgetState createState() => _ListTileWidgetState();
}

class _ListTileWidgetState extends State<ListTileWidget> {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        InkWell(
          onTap: widget.onTap,
          child: Container(
            color: Colors.transparent,
            padding: EdgeInsets.symmetric(vertical: 8),
            child: Row(
              children: [
                // if(widget.leadingWidget != null) widget.leadingWidget!,
                (widget.leadingIcon != null)
                    ? Icon(widget.leadingIcon)
                    : (widget.leadingIconSVG != null)
                        ? SvgPicture.asset(
                            widget.leadingIconSVG ?? '',
                            width: 20,
                            height: 20,
                          )
                        : (widget.leadingWidget != null)
                            ? widget.leadingWidget!
                            : SizedBox.shrink(),
                // if(widget.leadingIconSVG != null) SvgPicture.asset(widget.leadingIconSVG ?? '',width: 20,height: 20,),
                if (widget.leadingIcon != null ||
                    widget.leadingWidget != null ||
                    widget.leadingIconSVG != null)
                  SizedBox(
                      width:
                          14), // Add spacing between icon and text only if icon is present
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          CommonText(
                            text: widget.titleText,
                            style: widget.titleTextStyle ??
                                AppTextStyle.bodyTextStyle,
                          ),
                          if (widget.trailingWidget != null)
                            widget.trailingWidget!,
                        ],
                      ),
                      if (widget.subTitle !=
                          null) // Check if subTitle is provided
                        CommonText(
                          text: widget.subTitle!,
                          style: widget.subTitleTextStyle ??
                              AppTextStyle.subBodyStyle,
                        ),
                    ],
                  ),
                ),
                // if (widget.trailingWidget != null) widget.trailingWidget!,
                (widget.trailingIcon != null)
                    ? Icon(
                        widget.trailingIcon,
                        size: 16,
                      )
                    : (widget.leadingIconSVG != null)
                        ? SvgPicture.asset(
                            widget.leadingIconSVG ?? '',
                            width: 20,
                            height: 20,
                          )
                        : SizedBox.shrink(),
              ],
            ),
          ),
        ),
        if (widget.showDivider) CustomDivider(),
      ],
    );
  }
}
