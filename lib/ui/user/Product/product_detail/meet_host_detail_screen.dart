import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/user/users_listing_response_model.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:easy_localization/easy_localization.dart';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';


import '../../../../data/models/user/listing_detail_response_model.dart';
import '../../../../data/models/user/review_response_model.dart';
import '../../../../viewModel/user/listing_view_model.dart';
import '../../../../viewModel/user/product_detail_view_model.dart';
import 'package:airstar_flutter/utils/utils.dart';
import '../../dashBoard/searchBar.dart';

// ***  Meet Your host card view   *******

class MeetHostViewScreen extends StatefulWidget {
  final String listingId;

  const MeetHostViewScreen({super.key, required this.listingId});


  @override
  State<MeetHostViewScreen> createState() => _MeetHostViewScreenState();
}

class _MeetHostViewScreenState extends State<MeetHostViewScreen> {
  ProductListingViewModel? listingViewModel;

  List<ConfirmedInfoDetail> confirmedInfoDetails = [
    ConfirmedInfoDetail(id: 0, confirmation: "Identity"),
    ConfirmedInfoDetail(id: 1, confirmation: "Phone number"),
    ConfirmedInfoDetail(id: 2, confirmation: "Work email"),
  ];

  String? token;

  @override
  void initState() {
    getToken();
    listingViewModel =
        Provider.of<ProductListingViewModel>(context, listen: false);

    super.initState();
  }

  Future getToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    token = prefs.getString(PrefConstant.authToken);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColorData.appSecondaryColor,
      appBar: CommonAppBar(),
      body: Consumer2<ProductListingViewModel, ProductDetailViewModel>(builder: (context, model, listingDetailModel,  child) {
        return _renderBody(model, listingDetailModel);
      }),
    );
  }

  Widget _renderBody(ProductListingViewModel model, ProductDetailViewModel value) {
    return SingleChildScrollView(
        child: Padding(
            padding: horizontalPadding(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                hostCard(value.listingDetailResponseModel!, value),
                //spacer(),
                divider(),
                CommonText(
                  text:
                      "${value.listingDetailResponseModel?.data?.listing?.first.providerData!.firstname}'s ${tr("reviews")}",
                  style: AppTextStyle.titleStyle,
                ),
                spacer(),
                reviewScreen(value.listingDetailResponseModel!, model, value),
                // SizedBox(height: 30,),
                // CommonElevatedButton(
                //     border: Border.all(color: AppColorData.boxBorder),
                //     elevatedButtonNameColor: AppColorData.textColor,
                //     elevatedButtonColor: AppColorData.appSecondaryColor,
                //     elevatedButtonName: "showAllReviews",
                //     onTap: (){
                //       // showModalBottomSheet(
                //       //   context: context,
                //       //   isScrollControlled: true,
                //       //   enableDrag: true,
                //       //   isDismissible: false,
                //       //   backgroundColor: AppColorData.appSecondaryColor,
                //       //   builder: (context) =>  showAllAmenities(),
                //       // );
                //     }),
                spacer(),
                divider(),
                CommonText(
                  text:
                      "${value.listingDetailResponseModel?.data?.listing?.first.providerData!.firstname}'s ${tr("confirmedInformation")}",
                  style: AppTextStyle.titleStyle,
                ),
                //Text("Confirmed information",style: AppTextStyle.titleStyle,),
                spacer(),
                confirmedInfoDetail(value.listingDetailResponseModel!, model),
                // divider(),
                // **********newly hifded**************
                // CommonText(
                //   text:
                //       "${model.listingDetailResponseModel!.data!.listing!.first.providerData!.firstname}'s Listing",
                //   style: AppTextStyle.titleStyle,
                // ),

                // Consumer<UsersListingViewModel>(
                //   builder: (context, viewModel, child) {
                //     return usersListing( viewModel);
                //   }
                // ),
                //******8this too*****
                //  usersListing(model.usersListingResponseModel, model),
                //  spacer(),
                // TextButton(
                //     onPressed: () {
                //       showCustomModalBottomSheet(
                //           backgroundColor: AppColorData.appSecondaryColor,
                //           title:
                //               "${model.listingDetailResponseModel!.data!.listing!.first.providerData!.firstname}",
                //           context: context,
                //           builder: (context) {
                //             return viewAllListings(
                //                 model.usersListingResponseModel, model);
                //           });
                //     },
                //     child: CommonText(
                //       text: "viewAllListing",
                //       style: AppTextStyle.underlinedSubHeaderText,
                //     )),
                // spacer(),
                // divider(),
                // Row(
                //   children: [
                //     Icon(Icons.flag),
                //     SizedBox(
                //       width: 5,
                //     ),
                //     CommonText(
                //       text: "reportThisListing",
                //       style: AppTextStyle.underlinedSubHeaderText,
                //     )
                //   ],
                // ),
                SizedBox(
                  height: 30,
                )
              ],
            )));
  }

  Widget hostCard(
      ListingDetailResponseModel model, ProductDetailViewModel viewModel) {
    var data = model.data?.listing?.first;
    return Padding(
      padding: const EdgeInsets.all(14.0),
      child: Container(
          padding: EdgeInsets.symmetric(vertical: 14),
          height: 220,
          // width: MediaQuery.of(context).size.width * 0.85,
          // height: MediaQuery.of(context).size.height * 0.28,
          decoration: BoxDecoration(
            boxShadow: [
              BoxShadow(
                  color: Colors.grey.withOpacity(0.3),
                  spreadRadius: -2,
                  blurRadius: 15,
                  offset: Offset(3.0, 3.0)),
              BoxShadow(
                  color: Colors.grey.withOpacity(0.3),
                  spreadRadius: -2,
                  blurRadius: 15,
                  offset: Offset(-3.0, -3.0)),
            ],
            color: AppColorData.appSecondaryColor,
            borderRadius: BorderRadius.circular(15),
            // border: Border.all(color: AppColorData.boxBorder)
          ),
          //color: Colors.blue,
          child: Padding(
              padding: const EdgeInsets.all(12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Hero(
                    tag: "meetYourHost",
                    transitionOnUserGestures: true,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Stack(
                          children: [
                            CircleAvatar(
                              radius: 50,
                              backgroundColor: AppColorData.appSecondaryColor,
                              child: ClipOval(
                                child: CacheImageWidget(
                                    imageUrl:data?.providerData!.profileImage ?? "",
                                    fit: BoxFit.cover,
                                    width: 80.0,
                                    height: 80.0,
                                    errorBuilder: (context, url, error) =>
                                        ErrorImage()),
                              ),
                            ),

                          ],
                        ),
                        CommonText(
                            text: data?.providerData!.firstname,
                            style: AppTextStyle.titleStyle),
                      ],
                    ),
                  ),
                  IntrinsicWidth(
                    child: Column(
                      // mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        CommonText(
                          text: data?.totalReviewCount.toString(),
                          style: AppTextStyle.bodyTextStyle,
                        ),
                        CommonText(text: "reviews"),
                        divider(height: 15),
                        CommonText(
                          text: data?.totalRatingCount.toString(),
                          style: AppTextStyle.bodyTextStyle,
                        ),
                        CommonText(text: "rating"),
                        divider(height: 15),
                        CommonText(
                          text: viewModel
                              .calculateHostingPeriod(
                                  data?.providerData?.verifiedDate ?? DateTime.now())
                              .toString(),
                          style: AppTextStyle.bodyTextStyle,
                        ),
                        CommonText(text: "monthsOnAirstar"),
                      ],
                    ),
                  ),
                ],
              ))),
    );
  }

  Widget reviewScreen(
      ListingDetailResponseModel model, ProductListingViewModel viewModel, ProductDetailViewModel listingDetailModel) {
    var review =
        listingDetailModel.reviewResponseModel?.data?.reviewAndRating ?? [];
    var data = model.data?.listing?.first;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CommonText(
          text: data!.totalReviewCount! > 0
              ? "${data.totalReviewCount.toString()} ${tr("reviews")}"
              : "noReviewsYet",
          style: AppTextStyle.bodyTextStyle,
        ),
        // if (review.isNotEmpty)
        //   SizedBox(
        //     height: 30,
        //   ),
        if (review.isNotEmpty)
          SizedBox(
            height: 230,
            child: ListView.builder(
                itemCount: review.length > 4 ? 4 : review.length,
                scrollDirection: Axis.horizontal,
                itemBuilder: (context, index) {
                  var reviewData = review[index];
                  return Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Container(
                      padding: EdgeInsets.all(14),
                      width: MediaQuery.of(context).size.width * 0.75,
                    //  height: MediaQuery.of(context).size.height * 0.2,
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
                                backgroundColor: AppColorData.appSecondaryColor,
                                radius: 30,
                                child: ClipOval(
                                  child: CacheImageWidget(
                                      imageUrl: reviewData.userProfileImage ?? "",
                                      fit: BoxFit.cover,
                                      width: 50.0,
                                      height:50.0,
                                      // placeholder: (context, url) =>
                                      //     ProgressLoader(),
                                      errorBuilder: (context, url, error) =>
                                          ErrorImage()),
                                ),
                                // backgroundImage: AssetImage(
                                //     PNGAssets.hotel_image
                                // ),
                              ),
                              SizedBox(
                                width: 20,
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  CommonText(
                                    text: reviewData.userFirstname!,
                                    style: AppTextStyle.bodyTextStyle,
                                  ),
                                  CommonText(
                                    text: getTimeAgo(reviewData
                                        .reviewRating!.dateOfReview
                                        .toString()),
                                    style: AppTextStyle.contentStyle
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
                            maxLines: 4,
                            overflow: TextOverflow.ellipsis,
                          ),
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
              border: Border.all(color: AppColorData.boxBorder),
              elevatedButtonNameColor: AppColorData.bodyTextColor,
              elevatedButtonColor: AppColorData.appSecondaryColor,
              elevatedButtonName:
                  "${tr("showAll")} ${review.length} ${tr("reviews")}",
              onTap: () {
                showCustomModalBottomSheet(
                    showDivider: false,
                    backgroundColor: AppColorData.appSecondaryColor,
                    context: context,
                    builder: (context) => showAllReviews(review));
              })
      ],
    );
  }

  Widget showAllReviews(List<ReviewAndRating> reviewAndRating) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(14, 0, 14, 14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CommonText(
              text: "${reviewAndRating.length} ${tr("reviews")}",
              style: AppTextStyle.titleStyle,
            ),
            doubleSpacer(),
            AnimatedContainer(
              duration: Duration(milliseconds: 300),
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
                                      imageUrl: data.userProfileImage ?? "",
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
                                    style: AppTextStyle.contentStyle,
                                  ),
                                ],
                              ),
                            ],
                          ),
                          doubleSpacer(),
                          CommonText(
                            text: data.reviewRating!.review!,
                            style: AppTextStyle.subBodyHintTextStyle
                                .copyWith(color: AppColorData.bodyTextColor),
                            // maxLines: 6,
                            //  overflow: TextOverflow.ellipsis,
                          ),
                          doubleSpacer(),
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

//Widget confirmedInfoDetail( ListingViewModel viewModel){
  Widget confirmedInfoDetail(
      ListingDetailResponseModel model, ProductListingViewModel viewModel) {
    // var list = model.data!.listing!.first.providerData;
    var list = model.data?.listing?.first.providerData;
    return Container(
      child: ListView.builder(
          shrinkWrap: true,
          physics: NeverScrollableScrollPhysics(),
          // itemCount: confirmedInfoDetails.length,
          itemCount: list!.email?.characters.first.length,
          itemBuilder: (context, index) {
            return
                //   ListTile(
                //   leading: Icon(Icons.check),
                //   title:Text( "${list.email}",style: AppTextStyle().subHeaderHintStyle,),
                // );

                Container(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(Icons.check),
                      SizedBox(
                        width: 10,
                      ),
                      CommonText(
                        text: "${list.email}",
                        style: AppTextStyle.bodyTextStyle.copyWith(fontWeight: FontWeight.w400),
                      ),
                    ],
                  ),
                ],
              ),
            );
          }),
    );
  }

  Widget usersListing(
      UsersListingResponseModel? model, ProductDetailViewModel viewModel) {
    var list = viewModel.usersListingResponseModel?.data.userListings;

    return Container(
      height: MediaQuery.of(context).size.height * 0.48,
      width: MediaQuery.of(context).size.width,
      child: ListView.builder(
          itemCount: list?.length,
          scrollDirection: Axis.horizontal,
          itemBuilder: (context, index) {
            // Use list[index] safely here
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              //  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ClipRRect(
                  child: Container(
                      padding: EdgeInsets.all(10),
                      height: MediaQuery.of(context).size.height * 0.35,
                      width: MediaQuery.of(context).size.width * 0.7,
                      child: CacheImageWidget(
                        imageUrl: list?.first.data.first.listingattachmentsData.image.groupImage.first.imagePath  ?? "",
                        errorBuilder: (context, url, error) {
                          return ErrorImage();
                        },
                      )
                      // color: Colors.blueGrey,
                      // child: Image.asset(PNGAssets.hotel_image)
                      ),
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 10.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(
                            Icons.star,
                            size: 20,
                          ),
                          SizedBox(
                            width: 5,
                          ),
                          CommonText(
                            text: "5.0",
                            style: AppTextStyle.headerStyle,
                          ),
                        ],
                      ),
                      CommonText(
                        text: "${list?.first.data.first.propertyName}",
                        style: AppTextStyle.headerStyle,
                      ),
                      CommonText(
                        text: "${list?.first.data.first.propertyDesc}",
                        style: AppTextStyle.subBodyHintTextStyle
                            .copyWith(color: AppColorData.subBodyTextHighlightClr),
                      )
                    ],
                  ),
                ),
              ],
            );
          }),
    );
  }

  Widget viewAllListings(
      UsersListingResponseModel? model, ProductListingViewModel viewModel) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Container(
        height: MediaQuery.of(context).size.height,
        width: MediaQuery.of(context).size.width,
        child: ListView.builder(itemBuilder: (context, index) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Container(
                height: MediaQuery.of(context).size.height * 0.33,
                width: MediaQuery.of(context).size.width * 0.9,
                color: Colors.blueGrey,
                // child: ClipRRect(
                //   //  child:Image.asset(PNGAssets.hotel_image,fit: BoxFit.fill,filterQuality: FilterQuality.high,)
                // ),
              ),
              spacer(),
              Row(
                children: [
                  Icon(
                    Icons.star,
                    size: 18,
                  ),
                  SizedBox(
                    width: 5,
                  ),
                  CommonText(
                    text: "5.0",
                    style: AppTextStyle.bodyTextStyle,
                  ),
                ],
              ),
              CommonText(
                text: "holidayHome",
                style: AppTextStyle.bodyTextStyle,
              ),
              CommonText(
                text: "quitAndGoodLocation",
                style: AppTextStyle.subBodyHintTextStyle
                    .copyWith(color: AppColorData.subBodyTextHighlightClr),
              ),
              spacer(),
            ],
          );
        }),
      ),
    );
  }
}

class ConfirmedInfoDetail {
  const ConfirmedInfoDetail({
    required this.id,
    required this.confirmation,
  });
  final int id;
  final String confirmation;
}
