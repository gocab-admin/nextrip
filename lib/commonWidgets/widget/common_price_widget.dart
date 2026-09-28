import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/host/create_listing_view_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class CommonPriceWidget extends StatefulWidget {
  final int index;
  final TextEditingController controller;

  const CommonPriceWidget({Key? key, required this.index, required this.controller}) : super(key: key);

  @override
  _commonPriceState createState() => _commonPriceState();
}

class _commonPriceState extends State<CommonPriceWidget> {
  @override
  Widget build(BuildContext context) {
    return Consumer<CreateListingViewModel>(builder: (context, value, child) {
      final item = value.priceDetails[widget.index];
      final bool requiresSwitch = item.title == "minimumNight" || item.title == "maximumNight";
      return Visibility(
          visible: requiresSwitch ? value.isSwitch : true,
          child: Column(
            spacing: 15,
            children: [
              SizedBox(width: 20),
              SingleChildScrollView(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Flexible(
                      child: CommonText(
                        text: item.title,
                        style: AppTextStyle.bodyTextStyle,
                      ),
                    ),
                    buildRightWidget(value, widget.index),
                  ],
                ),
              ),
              item.dividerShow
                  ? CustomDivider()
                  : SizedBox.shrink(),
            ],
          ));
    });
  }

  Widget buildRightWidget(CreateListingViewModel value, int index) {
    final item = value.priceDetails[index];

    switch (item.type) {
      case "Increment":
        return Row(
          children: [
            Visibility(
              visible: item.title == "AvailableCount" ||
                  item.minimumRequired <
                      item.count,
              child: GestureDetector(
                onTap: () {
                  value.decrementPriceCount(index);
                },
                child: CircleAvatar(
                    radius: 15,
                    backgroundColor: AppColorData.boxBorder,
                    child: CircleAvatar(
                      radius: 13,
                      backgroundColor: AppColorData.appSecondaryColor,
                      child: Icon(
                        Icons.remove,
                        color: AppColorData.appIconBlack,
                        size: 20,
                      ),
                    )),
              ),
            ),
            Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child:
                CommonText(text: "${item.count}")),
            GestureDetector(
              onTap: () {
                value.incrementPriceCount(index);
              },
              child: CircleAvatar(
                  radius: 15,
                  backgroundColor: AppColorData.boxBorder,
                  child: CircleAvatar(
                    radius: 13,
                    backgroundColor: AppColorData.appSecondaryColor,
                    child: Icon(
                      Icons.add,
                      color: AppColorData.appIconBlack,
                      size: 20,
                    ),
                  )),
            )
          ],
        );
      case "Switch":
        return Switch(
            value: value.isSwitch,
            inactiveTrackColor: AppColorData.whiteClr,
            activeTrackColor: AppColorData.blackClr,
            onChanged: (bool newValue) {
              value.toggleSwitch(newValue);
            });
      case "Number":
        return CommonTextFromField(
          width: MediaQuery.of(context).size.width * 0.20,
          controller: widget.controller,
          textStyle: AppTextStyle.priceStyle,
        );
      default:
        return SizedBox.shrink();
    }
  }

}

