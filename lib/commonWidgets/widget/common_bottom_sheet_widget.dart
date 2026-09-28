import 'package:airstar_flutter/utils/components/color/app_color.dart';
import 'package:flutter/material.dart';

import '../../utils/constants/common_text.dart';

Future<void> showCustomModalBottomSheet({
  required BuildContext context,
  required WidgetBuilder builder,
  bool isDismissible = true,
  bool enableDrag = true,
  Color? backgroundColor,
  String? title,
  List<Widget>? commonChildren, // New parameter for common content
  double? elevation,
  ShapeBorder? shape,
  Clip? clipBehavior,
  bool useRootNavigator = false,
  bool isScrollControlled = true,
  double maxHeight = 0.96, // Maximum height of the bottom sheet
  double minHeight = 0.3, // Minimum height of the bottom sheet
  IconData? icon = Icons.close, // Default icon
  bool showDivider = true, // Parameter to show or hide divider
  bool showIcon = true,
  Function()? onCloseFun,
  Function()? onDispose,
}) {
  return showModalBottomSheet(
    context: context,
    builder: (context) => buildBottomSheetContent(
      title: title,
      icon: icon,
      child: builder(context),
      children: commonChildren, // Pass the list of widgets
      maxHeight: maxHeight,
      minHeight: minHeight,
      onDispose: onDispose,
      showDivider: showDivider, // Pass the showDivider parameter
      showIcon: showIcon,
      onCloseFun: onCloseFun,
    ),
    isDismissible: isDismissible,
    enableDrag: enableDrag,
    backgroundColor: backgroundColor,
    elevation: elevation,
    shape: shape ?? RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(10))),
    clipBehavior: clipBehavior,
    useRootNavigator: useRootNavigator,
    isScrollControlled: isScrollControlled,
  );
}

class buildBottomSheetContent extends StatefulWidget {
  final String? title;
  final Widget child;
  final IconData? icon;
  final Function()? onDispose;
  final Function()? onCloseFun;
  final double maxHeight;
  final double minHeight;
  final List<Widget>? children; // List of widgets for the common content
  final bool showDivider;
  final bool? showIcon;
  buildBottomSheetContent({
    super.key,
    this.title,
    required this.child,
    this.icon,
    this.onDispose,
    this.onCloseFun,
    required this.maxHeight,
    required this.minHeight,
    this.children,
    required this.showDivider,
    this.showIcon = true,
  });

  @override
  State<buildBottomSheetContent> createState() => _buildBottomSheetContentState();
}

class _buildBottomSheetContentState extends State<buildBottomSheetContent>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(duration: const Duration(milliseconds: 300), vsync: this);

    _opacityAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeIn));

    _controller.forward(); // Start the animation
  }

  @override
  void dispose() {
    if (widget.onDispose != null) widget.onDispose!();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Opacity(
          opacity: _opacityAnimation.value,
          child: LayoutBuilder(
            builder: (context, constraints) {
              double screenHeight = MediaQuery.of(context).size.height;
              double maxContentHeight = screenHeight * widget.maxHeight;
              double minContentHeight = screenHeight * widget.minHeight;

              return SingleChildScrollView(
                child: ConstrainedBox(
                  constraints: BoxConstraints(minHeight: minContentHeight, maxHeight: maxContentHeight),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        padding: const EdgeInsets.fromLTRB(10, 10, 10, 0),
                        child: Row(
                          children: [
                            // IconButton(
                            //   icon: Icon(widget.icon, size: 20),
                            //   onPressed: widget.onCloseFun ??
                            //       () {
                            //         Navigator.pop(context);
                            //       },
                            // ),
                            if (widget.showIcon == true) ...[
                              IconButton(
                                icon: Icon(widget.icon, size: 20),
                                onPressed:
                                    widget.onCloseFun ??
                                    () {
                                      Navigator.pop(context);
                                    },
                              ),
                              SizedBox(width: 10),
                            ],
                            //  SizedBox(width: 10),
                            if (widget.title != null)
                              Expanded(
                                child: CommonText(
                                  text: widget.title,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.w600,
                                    fontFamily: 'CircularStd',
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                      if (widget.showDivider) Divider(color: AppColorData.boxBorder),
                      if (widget.children != null) ...widget.children!,
                      SizedBox(height: 10), // Adjust spacing as needed
                      Flexible(
                        child: widget.child, // Include the main content and make it expandable
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }
}
