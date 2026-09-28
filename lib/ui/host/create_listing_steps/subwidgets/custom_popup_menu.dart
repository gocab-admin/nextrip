import 'package:airstar_flutter/utils/utils.dart';
import 'package:flutter/material.dart';

class CustomPopupMenu extends StatelessWidget {
  final int index;
  final int total;
  final Function(String action) onSelected;
  const CustomPopupMenu({super.key, required this.index, required this.total, required this.onSelected});

  @override
  Widget build(BuildContext context) {

    List<String> options = [];

    options.add("delete");

    if(total == 1) {
      // Only one image: only delete
    } else if(total == 2) {
      if(index == 0) {
        options.add("moveForward");
      } else {
        options.addAll(["moveBackward", "makeCoverPhoto"]);
      }
    } else {
      if(index == 0) {
        options.add("moveForward");
      } else if(index == total -1) {
        options.addAll(["moveBackward", "makeCoverPhoto"]);
      } else {
        options.addAll(["moveForward", "moveBackward", "makeCoverPhoto"]);
      }
    }

    return PopupMenuButton(
        padding: EdgeInsets.zero,
        icon: Icon(Icons.more_horiz),
        iconColor: AppColorData.appIconBlack,
        onSelected: onSelected,
        itemBuilder: (context) {
          return options.map((option) {
            return PopupMenuItem<String>(
                value: option,
                child: CommonText(text: option));
          }).toList();

        });
  }
}
