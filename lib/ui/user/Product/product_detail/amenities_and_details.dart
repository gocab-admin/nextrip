import 'package:airstar_flutter/ui/user/Product/product_detail/rules_list.dart';
import 'package:airstar_flutter/ui/user/Product/sub_widgets/custom_amenities_list.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:airstar_flutter/commonWidgets/common_widgets.dart';

import '../../../../data/models/user/listing_detail_response_model.dart';
import '../../../../data/models/user/listing_response_model.dart';
import '../../../../utils/components/color/app_color.dart';
import '../../../../utils/constants/common_text.dart';
import '../../../../utils/constants/textstyle.dart';
import '../../../../utils/widgets/common_widgets.dart';
import '../../../../viewModel/user/product_detail_view_model.dart';


class AmenitiesAndDetails extends StatelessWidget {
  final ApprovedListing? approvedListing;

  const AmenitiesAndDetails({
    super.key,
    this.approvedListing,
  });

  @override
  Widget build(BuildContext context) {
    return Consumer<ProductDetailViewModel>(builder: (context, value, child) {
      var privilege = value.listingDetailResponseModel?.data?.privilegeItems;
      return Column(
        children: [
          productInfo(value.listingDetailResponseModel),
          CustomDivider(
            color: AppColorData.dividerColor,
          ),
          hostProfile(value.listingDetailResponseModel),
          CustomDivider(),
          RulesList(
              listingDetailResponseModel: value.listingDetailResponseModel!),
          aboutThisHotel(value.listingDetailResponseModel, context,
              approvedListing),
            bedRoomDetail(),
          if (privilege?.isNotEmpty ?? false)...[
                CustomDivider(),
                amenitiesDetail(),
                //  amenities(),
              ],

        ],
      );
    });
  }

  Widget productInfo(ListingDetailResponseModel? model) {
    var data = model?.data?.listing?.first;
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      CommonText(
        text: data?.propertyName ?? '',
        style: AppTextStyle.headingStyle.copyWith(fontWeight: FontWeight.w600),
      ),
      SizedBox(
        height: 10,
      ),
      CommonText(
        text:
            "${data?.address?.city?.trim() ?? ""}, ${data?.address?.state?.trim() ?? ""}",
        style: AppTextStyle.subBodyStyle.copyWith(fontWeight: FontWeight.w600),
      ),
      SizedBox(
        height: 5,
      ),
        FittedBox(
          child: Row(
            children: [
              CommonText(
                text: "${data?.guest?.adult} ${tr("guest")} · ",
                style: AppTextStyle.subBodyStyle
                    .copyWith(color: AppColorData.subBodyTextClr),
              ),
              CommonText(
                text: '${data?.accomodation?.bedRoomCount} ${tr("bedRooms")} · ',
                style: AppTextStyle.subBodyStyle
                    .copyWith(color: AppColorData.subBodyTextClr),
              ),
              CommonText(
                overflow: TextOverflow.ellipsis,
                text:
                    '${data?.accomodation?.bedRoomBedtype?.length} ${tr("beds")} · ',
                style: AppTextStyle.subBodyStyle
                    .copyWith(color: AppColorData.subBodyTextClr),
              ),
              CommonText(
                overflow: TextOverflow.ellipsis,
                text:
                    '${data?.accomodation?.bathRoom?.bathRoomCount} ${tr("bathroom")}',
                style: AppTextStyle.subBodyStyle
                    .copyWith(color: AppColorData.subBodyTextClr),
              ),
            ],
          ),
        ),
      SizedBox(
        height: 5,
      ),
      Row(
        children: [
          const Icon(
            Icons.star,
            size: 20,
            color: AppColorData.starColor,
          ),
          SizedBox(
            width: 5,
          ),
          CommonText(
            text: (data?.totalRatingCount ?? 0) > 0
                ? "${data?.totalRatingCount.toString()} · "
                : "",
            style: AppTextStyle.subBodyStyle,
          ),
          SizedBox(
            width: 5,
          ),
          CommonText(
            text: (data?.totalReviewCount ?? 0) > 0
                ? "${data?.totalReviewCount?.toInt().toString()} ${tr("reviews")}"
                : "noReviewsYet",
            style: AppTextStyle.subBodyStyle
                .copyWith(decoration: TextDecoration.underline),
          )
        ],
      ),
      SizedBox(
        height: 10,
      ),
    ]);
  }

  Widget hostProfile(ListingDetailResponseModel? model) {
    var data = model?.data?.listing?.first;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        children: [
          Container(
            height: 60,
            width: 60,
            decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(30),
                border:
                    Border.all(color: AppColorData.boxBorder.withOpacity(0.6))),
            child: ClipOval(
              child: CacheImageWidget(
                  imageUrl:data?.providerData!.profileImage ?? "",
                  fit: BoxFit.cover, // width: 50.0,
                  errorBuilder: (context, url, error) => ErrorImage()),
            ),
          ),
          SizedBox(
            width: 15,
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CommonText(
                  text: "${tr("HostedBy")} ${data?.providerData!.firstname}",
                  style: AppTextStyle.headerStyle),
            ],
          )
        ],
      ),
    );
  }

  Widget aboutThisHotel(ListingDetailResponseModel? model, BuildContext context,
      ApprovedListing? approvedListing) {
    var data = model?.data?.listing?.first;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          CommonText(
              text: "aboutThisHotel",
              style: AppTextStyle.titleStyle),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 10),
            child: CommonText(
                text: data?.propertyDesc ?? approvedListing?.propertyDesc ?? '',
                maxLines: 4,
                //   overflow: TextOverflow.ellipsis, style: AppTextStyle.subHintTextStyle),
                overflow: TextOverflow.ellipsis,
                style: AppTextStyle.bodyTextStyle
                    .copyWith(fontWeight: FontWeight.w300)),
          ),
          InkWell(
            onTap: () {
              showCustomModalBottomSheet(
                title: "aboutThisPlace",
                context: context,
                backgroundColor: AppColorData.appSecondaryColor,
                builder: (context) => SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: CommonText(
                      text: data?.propertyDesc ??
                          approvedListing?.propertyDesc ??
                          "",
                      style: AppTextStyle.bodyTextStyle
                          .copyWith(fontWeight: FontWeight.w300),
                    ),
                  ),
                ),
              );
            },
            child: Row(
              children: [
                CommonText(
                  isUnderline: true,
                  text: "showMore",
                  style: AppTextStyle.bodyTextStyle,
                ),
                Icon(
                  Icons.arrow_forward_ios,
                  size: 16,
                )
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget bedRoomDetail() {
    return Consumer<ProductDetailViewModel>(
      builder: (context, listingDetailModel, child) {
        var listing =
            listingDetailModel.listingDetailResponseModel?.data?.listing?.first;
        var accommodation = listing?.accomodation;
        var bedRoomBedTypes = accommodation?.bedRoomBedtype ?? [];

        // Extract unique bedroom names
        Set<String?> bedrooms = bedRoomBedTypes.map((b) => b.bedRoom).toSet();

        if (bedrooms.isEmpty) return SizedBox();

        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CustomDivider(),
              const SizedBox(height: 10),
              CommonText(
                text: "whereYouSleep",
                style: AppTextStyle.titleStyle,
              ),
              const SizedBox(height: 20),
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                height: 130,
                child: ListView.separated(
                  itemCount: bedrooms.length,
                  scrollDirection: Axis.horizontal,
                  separatorBuilder: (_, __) => const SizedBox(width: 10),
                  itemBuilder: (context, index) {
                    String? bedroom = bedrooms.elementAt(index);

                    return Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppColorData.boxBorder),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(Icons.bed),
                          CommonText(
                            text: "${tr("bedroom")} ${index + 1}",
                            style: AppTextStyle.headerStyle,
                          ),
                          const SizedBox(height: 5),
                          Wrap(
                            spacing: 10,
                            children: bedRoomBedTypes
                                .where((e) => e.bedRoom == bedroom)
                                .map((b) => Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        CommonText(text: b.bedCount.toString()),
                                        const SizedBox(width: 5),
                                        CommonText(text: b.bedType ?? ''),
                                      ],
                                    ))
                                .toList(),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget amenitiesDetail() {
    return Consumer<ProductDetailViewModel>(
      builder: (context, listingDetailModel, child) {
        var data = listingDetailModel.listingDetailResponseModel?.data;

        if (data == null || data.privileges!.isEmpty) {
          return Center(
            child: CommonText(
              text: tr("noDataAvailable"),
              style: AppTextStyle.bodyTextStyle,
            ),
          );
        }

        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 10),
          child: CommonPrivilegeList(
            privileges: data.privileges,
            privilegeItems: data.privilegeItems,
            onShowAllPressed: (privilege, context) {
              var categories = data.privilegeCategories!
                  .where((category) => category.privilegeId == privilege.id)
                  .toList();

              showCustomModalBottomSheet(
                icon: Icons.arrow_back,
                showDivider: false,
                context: context,
                backgroundColor: AppColorData.appSecondaryColor,
                builder: (context) => CustomAmenitiesList(
                  privilegeName: privilege.name,
                  categories: categories,
                  privilegeItems: data.privilegeItems,
                ),
              );
            },
          ),
        );
      },
    );
  }
}
