import 'package:flutter/material.dart';
import '../../utils/utils.dart';

class CommonSliverAppBar extends StatefulWidget {
  const CommonSliverAppBar({
    super.key,
    this.appBarHeight,
    this.title,
    this.titleTextStyle,
    this.scrolledFontSize,
    this.bottomPosition,
    this.isBackArrowPresent = true,
  });
  final int? appBarHeight;
  final String? title;
  final bool isBackArrowPresent;
  final TextStyle? titleTextStyle;
  final double? scrolledFontSize;
  final double? bottomPosition;

  @override
  State<CommonSliverAppBar> createState() => _CommonSliverAppBarState();
}

class _CommonSliverAppBarState extends State<CommonSliverAppBar> {
  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        // Calculate the scroll percentage
        double percent = ((constraints.maxHeight - kToolbarHeight) * 100 /
            ((widget.appBarHeight ?? 140) - kToolbarHeight));

        // Ensure percent is between 0 and 100
        percent = percent.clamp(0.0, 100.0);

        // Calculate how collapsed the app bar is (0 = fully expanded, 1 = fully collapsed)
        double collapseProgress = 1 - (percent / 100);

        // Set left padding based on isBackArrowPresent
        double leftPadding;

        if (widget.isBackArrowPresent) {
          // Dynamic padding that transitions from 14 when expanded to 76 when collapsed
          leftPadding = 14.0 + (collapseProgress * (76.0 - 14.0));
        } else {
          // Always keep padding at 14 regardless of scroll state
          leftPadding = 20.0;
        }

        // Bottom offset - adjust as needed for your design
        double bottomOffset = constraints.maxHeight > kToolbarHeight ? 10.0 : widget.bottomPosition ?? 12.0;

        return Stack(
          children: <Widget>[
            Positioned(
              left: leftPadding,
              bottom: bottomOffset,
              child: Container(
                color: AppColorData.transparent,
                width: MediaQuery.of(context).size.width * 0.7,
                child: CommonText(
                  overflow: TextOverflow.ellipsis,
                  text: widget.title ?? '',
                  maxLines: 1,
                  style: widget.titleTextStyle ?? AppTextStyle.loginHeadingStyle.copyWith(fontSize: constraints.maxHeight > kToolbarHeight ? 35 : (widget.scrolledFontSize ?? 30),),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}