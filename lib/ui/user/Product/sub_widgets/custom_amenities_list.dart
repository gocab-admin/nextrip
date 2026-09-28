import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';


/// A common widget to render the privilege details.
class CommonPrivilegeList extends StatelessWidget {
  final List<dynamic>? privileges;
  final List<dynamic>? privilegeItems;
  final Function(dynamic privilege, BuildContext context) onShowAllPressed;
  const CommonPrivilegeList({
    Key? key,
     this.privileges,
     this.privilegeItems,
    required this.onShowAllPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      physics: NeverScrollableScrollPhysics(),
        shrinkWrap: true,
        itemCount: privileges?.length,
        itemBuilder: (context, index) {
          var privilege = privileges?[index];
          var matchedItems = privilegeItems
              ?.where((item) => item.privilegeId == privilege.id)
              .toList();
         return Column(
           crossAxisAlignment: CrossAxisAlignment.start,
           children: [
             CommonText(
               text: privilege.name,
               style: AppTextStyle.titleStyle,
             ),
             doubleSpacer(),
             if (matchedItems != null && matchedItems.isNotEmpty)
          ...matchedItems
              .take(matchedItems.length > 6 ? 6 : matchedItems.length)
              .map((item) =>  PrivilegeItemRow(item: item))
              ,
             doubleSpacer(),
             if (matchedItems != null && matchedItems.length > 6)
               CommonElevatedButton(
                 border: Border.all(color: AppColorData.blackBorderClr),
                 elevatedButtonNameColor: AppColorData.bodyTextColor,
                 elevatedButtonColor: AppColorData.appSecondaryColor,
                 elevatedButtonName:
                 "${tr("showAll")} ${matchedItems.length} ${tr("features")}",
                 onTap: () => onShowAllPressed(privilege, context),
               ),
             CustomDivider(height: 30),
           ],
         );
        });
  }
}


class PrivilegeItemRow extends StatelessWidget {
  final dynamic item;

  const PrivilegeItemRow({Key? key, required this.item}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          SizedBox(
            width: 30,
            height: 30,
            child: isSvgImageUrl(item.icon)
                ? SvgPicture.network("${EndPointConstants.baseurl}/${item.icon}")
                : CacheImageWidget(
              errorBuilder: (context, url, error) => ErrorImage(),
              imageUrl: "${EndPointConstants.baseurl}/${item.icon}",
            ),
          ),
          SizedBox(width: 15),
          Flexible(
            child: CommonText(
              text: item.name,
              style: AppTextStyle.bodyTextStyle.copyWith(
                fontWeight: FontWeight.w400,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class CustomAmenitiesList extends StatelessWidget {
  final String privilegeName;
  final List<dynamic>? categories;
  final List<dynamic>? privilegeItems;

  const CustomAmenitiesList({
    Key? key,
    required this.privilegeName,
     this.categories,
     this.privilegeItems,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CommonText(text: privilegeName, style: AppTextStyle.headingStyle),
          SizedBox(height: 20),
          if(categories != null)
          ...categories!.map((category) {
            var relatedItems = privilegeItems?.where((item) => item.privilegeCategoryId == category.id)
                .toList();

            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CommonText(text: category.name, style: AppTextStyle.titleStyle),
                spacer(),
                ...relatedItems!.map((item) => PrivilegeItemRow(item: item)),
                CustomDivider(),
                doubleSpacer(),
              ],
            );
          }).toList(),
        ],
      ),
    );
  }
}

