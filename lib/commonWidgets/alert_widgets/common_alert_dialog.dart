import 'package:flutter/material.dart';

import '../../utils/utils.dart';


class CommonAlertDialog extends StatelessWidget {
  final String? title;
  final Widget? titleWidget;
  final String? content;
  final Widget? contentWidget;
  final List<Widget> actions;

  const CommonAlertDialog({
    super.key,
    this.title,
    this.content,
    required this.actions,
    this.titleWidget,
    this.contentWidget,
  });

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: AppColorData.appSecondaryColor,
      surfaceTintColor: Colors.transparent,
      scrollable: true,
      titlePadding: EdgeInsets.zero,
      actionsPadding: EdgeInsets.all(14.0),
      insetPadding: const EdgeInsets.symmetric(horizontal: 14.0),
      contentPadding: EdgeInsets.only(top: 14.0),
      clipBehavior: Clip.antiAliasWithSaveLayer,
      title:
      (title == null) ? titleWidget :
      CommonText(
        text: title,
        textAlign: TextAlign.left,
      ),
      content:
      Builder(
        builder: (context) {
          var width = MediaQuery.of(context).size.width;
          return Container(
              width: width,
              padding: const EdgeInsets.symmetric(horizontal: 14.0),
              child:  (content == null) ? contentWidget :CommonText(
                text: content,
              ));
        }
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10.0),
      ),
      actions: actions,
    );
  }
}
