import 'package:airstar_flutter/commonWidgets/common_widgets.dart';

import 'package:airstar_flutter/commonWidgets/widget/common_padding_alignment.dart';
import 'package:airstar_flutter/data/models/user/review_response_model.dart';
import 'package:airstar_flutter/ui/host/bottom_bar_screens/subwidgets/common_radio_tile.dart';

import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/host/create_listing_view_model.dart';
import 'package:airstar_flutter/viewModel/user/product_detail_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

import '../../../viewModel/host/host_listing_view_model.dart';

class InsightsPage extends StatefulWidget {
  const InsightsPage({super.key});

  @override
  State<InsightsPage> createState() => _InsightsPageState();
}

class _InsightsPageState extends State<InsightsPage> {
  ProductDetailViewModel? productDetailViewModel;
  HostListingViewModel? hostListingViewModel;

  @override
  void initState() {
    productDetailViewModel = Provider.of<ProductDetailViewModel>(context, listen:  false);
    hostListingViewModel = Provider.of<HostListingViewModel>(context, listen:  false);
    WidgetsBinding.instance.addPostFrameCallback((_){
      _fetchInitialReviews();
    });
    super.initState();
  }

  void _fetchInitialReviews() {
    var listings = hostListingViewModel?.userListingsResponseModel?.data?.providerListings ?? [];

    if(listings.isNotEmpty) {
      hostListingViewModel?.setDefaultListing(listings);
      productDetailViewModel?.fetchReviewsAndRating(id: '${hostListingViewModel?.selectedListingId}');

    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Consumer3<CreateListingViewModel, HostListingViewModel, ProductDetailViewModel>(
        builder: (context, value, hostModel, productModel, child) {
          return CustomScrollView(
            slivers: [
              SliverAppBar(
                pinned: true,
                expandedHeight: 110,
                flexibleSpace: CommonSliverAppBar(
                  bottomPosition: 6,
                  title: "reviews",
                ),
              ),
              SliverList(
                  delegate: SliverChildListDelegate([
                        _renderBody(value, hostModel, productModel)
                    
                  ]))
            ],
          );
        }
      )
    );
  }

  Widget _buildEmptyReviewCard() {
    return Center(
      child: Container(
        padding: EdgeInsets.all(20.0),
        decoration: BoxDecoration(
          border: Border.all(color: AppColorData.boxBorder),
          borderRadius: BorderRadius.circular(10)
        ),
        child: Column(
          spacing: 10,
          mainAxisSize: MainAxisSize.min,
            children: [
               SvgPicture.asset(SVGAssets.starIcon),
               CommonText(
                 textAlign: TextAlign.center,
                 text: "emptyReviewHead",
                 style: AppTextStyle.bodyTextStyle,),
               CommonText(
                 textAlign: TextAlign.center,
                 text: "emptyReviewSub",
                 style: AppTextStyle.subBodyHintTextStyle.copyWith(
                     color: AppColorData.subBodyTextClr)),
            ],
            ),
      ),
    );
  }

  Widget _renderBody(CreateListingViewModel listingModel, HostListingViewModel value, ProductDetailViewModel productModel ) {
    var listing = value.selectedPropertyName ?? value.userListingsResponseModel?.data?.providerListings?.first.propertyName;
    return CommonPadding(
      child: Column(
        spacing: 20,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          GestureDetector(
            onTap: (){
              showCustomModalBottomSheet(
                title: "selectAListing",
                  context: context,
                  builder: (context) => _listingViewSheet());
            },
            child: Container(
              padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                spacing: 4,
                children: [
                  CommonText(
                    text: listing?.capitalizeFirst,
                    style: AppTextStyle.headerStyle,
                  ),
                  Icon(Icons.arrow_drop_down_sharp)
                ],
              ),
            ),
          ),
          (productModel.reviewResponseModel?.data?.reviewAndRating != null &&
              (productModel.reviewResponseModel?.data?.reviewAndRating?.isNotEmpty ?? false))
              ? _reviewView(productModel)
              : _buildEmptyReviewCard(),
        ],
      ),
    );
  }

  Widget _reviewView(ProductDetailViewModel productModel) {
    var reviews = productModel.reviewResponseModel?.data?.reviewAndRating ?? [];
    return Consumer<HostListingViewModel>(
      builder: (context, hostModel, child) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ListView.builder(
              padding: EdgeInsets.zero,
              shrinkWrap: true,
              itemCount: reviews.length,
                itemBuilder: (context, index){
                  var data = reviews[index];
                  final hasReply = data.reviewRating?.reply != null &&
                      (data.reviewRating!.reply!.isNotEmpty);

                  bool isExpanded =  hostModel.expandedIndex == index;
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: ClipRRect(
                          borderRadius: BorderRadius.circular(100),
                          child: SizedBox(
                            width: 50,
                            height: 50,
                            child: CacheImageWidget(
                              fit: BoxFit.cover,
                              imageUrl:
                              "${checkGoogleImageUrl(data.userProfileImage ?? "")}",
                              errorBuilder: (context, url, error) {
                                return ErrorImage();
                              },
                            ),
                          ),
                        ),
                        title: CommonText(
                          text: data.userFirstname,
                          style: AppTextStyle.titleStyle.copyWith(fontWeight: FontWeight.bold),
                        ),
                        subtitle: CommonText(
                          text: formatFullDateWithMonth(DateTime.tryParse("${data.reviewRating?.dateOfReview}")),
                          style: AppTextStyle.subBodyStyle.copyWith(color: AppColorData.subBodyTextClr),
                        ),
                        trailing: Visibility(
                          visible: !hasReply,
                          child: IconButton(onPressed: (){
                                showCustomModalBottomSheet(
                                   title: "reply",
                                    context: context,
                                    builder: (context) => _replyHostSheet(data));
                          }, icon: Icon(Icons.reply_all)),
                        ),
                      ),
                      if(hasReply)
                      InkWell(
                        onTap: () => hostModel.toggleExpansion(index, isExpanded),
                        child: CommonText(
                          text: isExpanded ? "hideReply" : "viewReply",
                          style: AppTextStyle.bodyTextStyle.copyWith(
                            color: AppColorData.subBodyTextClr
                          ),
                        ),
                      ),
                      spacer(),
                      if (isExpanded && hasReply)
                      Align(
                        alignment: Alignment.centerRight,
                        child: ConstrainedBox(
                         constraints: const BoxConstraints(
                           maxWidth: 260,
                           minWidth: 40,
                         ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text.rich(
                               TextSpan(
                                 children: [
                                   TextSpan(
                                     text: tr("responseFrom"),
                                   style: AppTextStyle.bodyTextStyle.copyWith(
                                     color: AppColorData.subBodyTextClr,
                                   ),
                                   ),
                                   TextSpan(
                                     text: tr("host"),
                                     style: AppTextStyle.bodyTextStyle.copyWith(
                                       color: AppColorData.subBodyTextClr,
                                       fontWeight: FontWeight.w700
                                     ),
                                   ),
                                 ]
                               )
                              ),
                              CommonText(
                              text: hasReply ? data.reviewRating?.reply?.first.response ?? '' : '',
                                style: AppTextStyle.bodyTextStyle.copyWith(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15
                                ),
                              ),
                            ],
                          ),
                        ),
                      )
                    ],
                  );
                })
          ],
        );
      }
    );
  }

  Widget _listingViewSheet() {
    return CommonPadding(
      child: Consumer2<ProductDetailViewModel, HostListingViewModel>(
          builder: (context, productModel, value, child) {
            var listings = value.userListingsResponseModel?.data?.providerListings ?? [];
            return ListView.builder(
                shrinkWrap: true,
                itemCount: listings.length,
                itemBuilder: (context, index) {
                  var data = listings[index];
                 return CommonRadioTile(
                    value: data.id ?? '',
                    groupValue: value.selectedListingId,
                    title: data.propertyName ?? '',
                    imageUrl: data.coverImage == null
                        ? null
                        : "${EndPointConstants.baseurl}/${data.coverImage}",
                    onChanged: (newValue) {
                      value.selectListing(newValue!, data.propertyName ?? '');
                      productModel.fetchReviewsAndRating(id: newValue).then((_) {
                        Get.back();
                      });
                    },
                  );
                }
            );
          }
      ),
    );
  }

  Widget _replyHostSheet(ReviewAndRating data) {
    return CommonPadding(
      padding: EdgeInsets.only(
        right: 14.0,
        left: 14.0,
        bottom: MediaQuery.viewInsetsOf(context).bottom
      ),
      child: Consumer<HostListingViewModel>(
        builder: (context, hostModel, child) {
          return Column(
            spacing: 10,
            mainAxisSize: MainAxisSize.min,
            children: [
               ListTile(
                 contentPadding: EdgeInsets.zero,
                 leading: ClipRRect(
                   borderRadius: BorderRadius.circular(100),
                   child: SizedBox(
                     width: 40,
                     height: 40,
                     child: CacheImageWidget(
                       fit: BoxFit.cover,
                       imageUrl:
                       "${checkGoogleImageUrl(data.userProfileImage ?? "")}",
                       errorBuilder: (context, url, error) {
                         return ErrorImage();
                       },
                     ),
                   ),
                 ),
                 title: CommonText(
                   text: data.userFirstname,
                   style: AppTextStyle.titleStyle.copyWith(fontWeight: FontWeight.bold),
                 ),
                 subtitle: CommonText(
                   text: formatFullDateWithMonth(DateTime.tryParse("${data.reviewRating?.dateOfReview}")),
                   style: AppTextStyle.subBodyStyle.copyWith(color: AppColorData.subBodyTextClr),
                 ),
               ),
              CommonTextFromField(
                height: 100,
                contentPadding: EdgeInsets.all(14),
               controller: hostModel.hostController,
                expands: true,
                maxLines: null,
                border: Border.all(color: AppColorData.boxBorder),
                keyboardType: TextInputType.multiline,
                textAlignVertical: TextAlignVertical.top,
              ),
              CustomDivider(),
              CommonElevatedButton(
                elevatedButtonColor: AppColorData.blackClr,
                  elevatedButtonName: "send",
                  onTap: (){
                     hostModel.addHostResponse(
                         hostResponse: hostModel.hostController.text,
                         reviewId: data.reviewRating?.id ?? '',
                         listingId: hostModel.selectedListingId ?? '').then((val){
                       if(val == true){
                         Get.back();
                       }
                     });
                  })
            ],
          );
        }
      ),
    );
  }
}
