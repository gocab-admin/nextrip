import 'package:airstar_flutter/utils/constants/common_text.dart';
import 'package:airstar_flutter/viewModel/user/listing_view_model.dart';
import 'package:flutter/material.dart';

import '../../../../commonWidgets/widget/custom_checkbox.dart';
import '../../../../utils/constants/textstyle.dart';

class CommonAmenitiesWidget extends StatelessWidget {
  final ProductListingViewModel model;
  final bool isFromFilter;

  const CommonAmenitiesWidget({super.key,
    required this.model,
    this.isFromFilter = true,
  });

  int _getAmenitiesCount() {
    if (model.amenitiesResponseModel?.data?.amenities == null ||
        model.amenitiesResponseModel!.data!.amenities!.isEmpty) {
      return 0;
    } else if (model.amenitiesResponseModel!.data!.amenities!.length > 3 &&
        !model.showMore) {
      return 3;
    } else {
      return model.amenitiesResponseModel!.data!.amenities!.length;
    }
  }


  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeInOut,
            padding: const EdgeInsets.symmetric(vertical: 10),
            child: ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _getAmenitiesCount(),
                itemBuilder: (context, index) {

                  var data = model.amenitiesResponseModel?.data?.amenities?[index];

                  bool isSelected = model.selectedAmenities.any((e) => e.id == data?.id);

                  if (isSelected) {
                    data?.isChecked = true;
                  }

                return Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    CommonText(
                      text: data?.name ?? "",
                      style: AppTextStyle.bodyTextStyle,
                    ),
                    CustomCheckbox(
                      value: data!.isChecked!,
                      onChanged: (newValue) {
                        model.toggleAmenities(index, newValue!, isFromFilter);
                      },
                    ),
                  ],
                );
            }),
        ),
        GestureDetector(
          onTap: () {
            model.toggleShowMore();
          },
          child: Row(
            children: [
              CommonText(
                isUnderline: true,
                text: model.showMore ? "showLess" : "showMore",
                style: AppTextStyle.headerStyle,
              ),
              Icon(
                model.showMore
                    ? Icons.keyboard_arrow_up_sharp
                    : Icons.keyboard_arrow_down_sharp,
                size: 30,
              )
            ],
          ),
        ),
      ],
    );
  }
}
