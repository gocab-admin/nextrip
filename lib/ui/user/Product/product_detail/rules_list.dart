import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:flutter/material.dart';

import '../../../../data/models/user/listing_detail_response_model.dart';


class RulesList extends StatelessWidget {
  final ListingDetailResponseModel listingDetailResponseModel;
  const RulesList({super.key, required this.listingDetailResponseModel});

  @override
  Widget build(BuildContext context) {

        var rules = listingDetailResponseModel.data?.listing?.first.attachmentData?.first.rules;

        if (rules == null || rules.isEmpty) {
          return SizedBox.shrink();
        }

        return Column(
          children: [
            ListView.builder(
              physics: NeverScrollableScrollPhysics(),
              shrinkWrap: true,
               itemCount: rules.length,
                itemBuilder: (context, index) {
                var data = rules[index];
              return ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(
                  backgroundColor: AppColorData.whiteClr,
                  child: CacheImageWidget(
                    imageUrl: '${EndPointConstants.baseurl}/${data['image']}',
                    errorBuilder:
                        (context, url, error) {
                      return ErrorImage(
                        isSquare: false,
                      );
                    },
                   ),
                ),
                title: CommonText(
                  text: "${data['title'] ?? ""}",
                  style: AppTextStyle.bodyTextStyle,
                ),
                subtitle: CommonText(text: "${data['desc'] ?? ""}",
                  style: AppTextStyle.subBodyHintTextStyle,
                ),
              );
            }),
            CustomDivider()
          ],
        );

  }
}





