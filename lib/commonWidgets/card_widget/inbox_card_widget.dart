
import 'package:flutter/material.dart';

import '../../utils/utils.dart';
import '../common_widgets.dart';

enum SampleItem { delete, block }

class InboxCardWidget extends StatefulWidget {
  const InboxCardWidget(
      {super.key,
      this.titleText,
      this.subTitleText,
      this.bodyText,
      this.leadingWidget,
      this.leadingImg,
      this.onTap, this.unSeenCount});

  final String? titleText;
  final String? subTitleText;
  final String? bodyText;
  final Widget? leadingWidget;
  final String? leadingImg;
  final int? unSeenCount;
  final Function()? onTap;

  @override
  State<InboxCardWidget> createState() => _InboxCardWidgetState();
}

class _InboxCardWidgetState extends State<InboxCardWidget> {
  SampleItem? selectedItem;
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(bottom: 0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          InkWell(
            onTap: widget.onTap,
            child: Container(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  (widget.leadingImg != null)
                      ? Container(
                          width: 50,
                          height: 50,
                          decoration: BoxDecoration(
                              border: Border.all(
                                  color:
                                      AppColorData.boxBorder.withOpacity(0.6)),
                              shape: BoxShape.circle,
                              image: DecorationImage(
                                  image: ImageUtils.getCachedImageProvider(
                                      widget.leadingImg ?? '',context))),
                        )
                      : widget.leadingWidget ?? SizedBox.shrink(),
                  SizedBox(
                    width: 10,
                  ),
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            (widget.titleText != null)
                                ? CommonText(
                                    text: widget.titleText ?? '',
                                    style: AppTextStyle.bodyTextStyle,
                                  )
                                : SizedBox.shrink(),
                            (widget.subTitleText != null)
                                ? CommonText(
                                    text: widget.subTitleText ?? '',
                                    style: AppTextStyle.contentStyle)
                                : SizedBox.shrink()
                          ],
                        ),
                        SizedBox(
                          height: 5,
                        ),

                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                  (widget.bodyText != null)?
                                Expanded(
                                  child: CommonText(
                                      overflow: TextOverflow.ellipsis,
                                      text: widget.bodyText ?? '',
                                      style: AppTextStyle.subBodyStyle,
                                    ),
                                ) : SizedBox.shrink(),
                                if(widget.unSeenCount != 0)Container(
                                  height: 20,
                                  width: 20,
                                  decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: AppColorData.appPrimaryColor
                                  ),
                                  child: Center(
                                    child: CommonText(
                                        text: "${widget.unSeenCount}${(widget.unSeenCount! >9)? '+':''}",
                                        style: AppTextStyle.contentStyle.copyWith(color: AppColorData.appSecondaryColor,fontSize: 10)),
                                  ),
                                ),
                              ],
                            ),

                      ],
                    ),
                  ),
                  Visibility(
                    visible: false,
                    child: PopupMenuButton<SampleItem>(
                      initialValue: selectedItem,
                      onSelected: (SampleItem item) {
                        setState(() {
                          selectedItem = item;
                        });
                        print("selectedItem :: $selectedItem");
                      },
                      itemBuilder: (BuildContext context) =>
                          <PopupMenuEntry<SampleItem>>[
                        PopupMenuItem<SampleItem>(
                          value: SampleItem.block,
                          child: CommonText(text: 'Block'),
                        ),
                        PopupMenuItem<SampleItem>(
                          value: SampleItem.delete,
                          child: CommonText(text: 'Delete'),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          CustomDivider(
            height: 40,
          )
        ],
      ),
    );
  }
}
