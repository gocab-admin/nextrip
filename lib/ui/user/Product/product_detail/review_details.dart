import 'package:provider/provider.dart';

import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import '../../../../commonWidgets/button_widgets/common_elevated_button.dart';
import '../../../../data/models/user/listing_detail_response_model.dart';
import '../../../../data/models/user/review_response_model.dart';
import '../../../../viewModel/user/product_detail_view_model.dart';
import 'package:airstar_flutter/commonWidgets/widget/widget.dart';
import 'package:airstar_flutter/utils/utils.dart';
import '../../dashBoard/searchBar.dart';

class ReviewDetails extends StatelessWidget {
  const ReviewDetails({super.key});

  @override
  Widget build(BuildContext context) {
    return  Consumer<ProductDetailViewModel>(
      builder: (context, value, child) {
        return reviewDetail(value.listingDetailResponseModel, value, context);
      }
    );
  }

  Widget reviewDetail(ListingDetailResponseModel? model,
      ProductDetailViewModel listingDetailModel, BuildContext context) {
    var data = model?.data?.listing?.first;
    var review =
        listingDetailModel.reviewResponseModel?.data?.reviewAndRating ?? [];

    var reviewCount =
        listingDetailModel.reviewResponseModel?.data?.totalCount ?? 0;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: Column(
        children: [
          Row(
            children: [
              const Icon(
                Icons.star,
                color: AppColorData.starColor,
              ),
              SizedBox(
                width: 5,
              ),
              CommonText(
                text: (data?.totalRatingCount ?? 0) > 0
                    ? "${data?.totalRatingCount.toString()}"
                    : "",
                style: AppTextStyle.titleStyle,
              ),
              CommonText(text: reviewCount > 0 ? " · " : " "),
              Expanded(
                child: CommonText(
                  // maxLines: 2,
                  // overflow: TextOverflow.ellipsis,
                  text: reviewCount > 0
                      ? "${reviewCount.toString()} ${tr("reviews")}"
                      : "noReviewsYet",
                  style: AppTextStyle.titleStyle,
                ),
              )
            ],
          ),
          doubleSpacer(),
          if (review.isNotEmpty)
            SizedBox(
              height: 230,
              child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: review.length > 4 ? 4 : review.length,
                  itemBuilder: (context, index) {
                    var reviewData = review[index];
                    return Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Container(
                        padding: EdgeInsets.all(14),
                        width: MediaQuery.of(context).size.width * 0.75,
                        // height: MediaQuery.of(context).size.height * 0.2,
                        decoration: BoxDecoration(
                          //color: Colors.greenAccent,
                            border: Border.all(color: AppColorData.boxBorder),
                            borderRadius: BorderRadius.circular(10)),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              // mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              children: [
                                CircleAvatar(
                                  radius: 30,
                                  backgroundColor: AppColorData.appSecondaryColor,
                                  child: ClipOval(
                                    child: CacheImageWidget(
                                        imageUrl:
                                        "${EndPointConstants.baseurl}/${reviewData.userProfileImage ?? ""}",
                                        fit: BoxFit.cover,
                                        width: 50.0,
                                        height: 50.0,
                                        // placeholder: (context, url) => ProgressLoader(),
                                        errorBuilder: (context, url, error) =>
                                            ErrorImage()),
                                  ),
                                ),
                                SizedBox(
                                  width: 20,
                                ),
                                Column(
                                  mainAxisSize: MainAxisSize.min,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    CommonText(
                                      text: reviewData.userFirstname!,
                                      style: AppTextStyle.bodyTextStyle,
                                    ),
                                    CommonText(
                                      text: getTimeAgo(reviewData
                                          .reviewRating!.dateOfReview!
                                          .toString()),
                                      style: AppTextStyle.subBodyHintTextStyle
                                          .copyWith(
                                          color: AppColorData.subBodyTextClr),
                                    ),
                                  ],
                                )
                              ],
                            ),
                            SizedBox(
                              height: 20,
                            ),
                            CommonText(
                              text: reviewData.reviewRating!.review!,
                              maxLines: 5,
                              overflow: TextOverflow.ellipsis,
                            )
                          ],
                        ),
                      ),
                    );
                  }),
            ),
          if (review.isNotEmpty)
            SizedBox(
              height: 30,
            ),
          if (review.isNotEmpty && review.length > 3)
            CommonElevatedButton(
                border: Border.all(color: AppColorData.blackBorderClr),
                elevatedButtonNameColor: AppColorData.bodyTextColor,
                elevatedButtonColor: AppColorData.appSecondaryColor,
                elevatedButtonName:
                "${tr("showAll")} ${review.length} ${tr("reviews")}",
                onTap: () {
                  showCustomModalBottomSheet(
                      backgroundColor: AppColorData.appSecondaryColor,
                      context: context,
                      builder: (context) => showAllReviews(review));
                })
        ],
      ),
    );
  }

  Widget showAllReviews(List<ReviewAndRating> reviewAndRating) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(14.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CommonText(
              text: "${reviewAndRating.length} ${tr("reviews")}",
              style: AppTextStyle.titleStyle,
            ),
            doubleSpacer(),
            AnimatedContainer(
              duration: Duration(milliseconds: 150),
              //  width: MediaQuery.of(context).size.width,
              // height: MediaQuery.of(context).size.height,
              child: ListView.builder(
                  shrinkWrap: true,
                  physics: ScrollPhysics(),
                  itemCount: reviewAndRating.length,
                  itemBuilder: (context, index) {
                    var data = reviewAndRating[index];
                    return Container(
                      width: MediaQuery.of(context).size.width,
                      //  height: MediaQuery.of(context).size.height * 0.3,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 20,
                                backgroundColor: AppColorData.appSecondaryColor,
                                child: ClipOval(
                                  child: CacheImageWidget(
                                      imageUrl:
                                      "${EndPointConstants.baseurl}/${data.userProfileImage ?? ""}",
                                      fit: BoxFit.cover,
                                      width: 80.0,
                                      height: 80.0,
                                      errorBuilder: (context, url, error) =>
                                          ErrorImage()),
                                ),
                              ),
                              SizedBox(
                                width: 10,
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  CommonText(
                                    text: data.userFirstname!,
                                    style: AppTextStyle.subBodyStyle,
                                  ),
                                  CommonText(
                                    text: getTimeAgo(data
                                        .reviewRating!.dateOfReview!
                                        .toString()),
                                    // style: AppTextStyle.subContentStyle,
                                    style: AppTextStyle.subBodyHintTextStyle
                                        .copyWith(
                                        color: AppColorData.subBodyTextClr),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          doubleSpacer(),
                          CommonText(
                            text: data.reviewRating!.review!,
                            style: AppTextStyle.subBodyHintTextStyle,
                            // maxLines: 6,
                            //  overflow: TextOverflow.ellipsis,
                          ),
                          doubleSpacer(height: 30),
                        ],
                      ),
                    );
                  }),
            ),
          ],
        ),
      ),
    );
  }
}
