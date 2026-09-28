import 'dart:convert';

import 'package:airstar_flutter/data/models/user/listing_response_model.dart';
import 'package:airstar_flutter/ui/user/Product/product_list.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/viewModel/user/common_viewmodel.dart';
import 'package:airstar_flutter/viewModel/user/listing_view_model.dart';
import 'package:airstar_flutter/viewModel/user/product_detail_view_model.dart';
import 'package:airstar_flutter/viewModel/user/profile_view_model.dart';
import 'package:airstar_flutter/viewModel/user/wishlist_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:get/route_manager.dart';
import 'package:provider/provider.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

import '../../data/models/user/wishlist_collection_response_model.dart';
import '../../routes/routes.dart';
import '../../utils/utils.dart';
import '../common_widgets.dart';

class ProductCardWidget extends StatelessWidget {
  final String? pricePerDay;
  final String? pricePerHour;
  final bool? isWishlistPage;
  final int? discountPercentage;
  final num? discountedPrice;
  final String id;
  final ApprovedListing? data;
  final WishList? wishListPageData;
  final List<String> images;
  final PageController controller;
  final ProductListingViewModel? viewModel;
  final WishlistViewModel? wishlistViewModel;
  final CommonViewModel? commonViewModel;
  final String token;

  const ProductCardWidget({
    super.key,
    this.pricePerDay,
    this.pricePerHour,
    this.isWishlistPage,
    this.discountPercentage,
    this.discountedPrice,
    required this.id,
    this.data,
    this.wishListPageData,
    required this.images,
    required this.controller,
    this.viewModel,
    this.wishlistViewModel,
    this.commonViewModel,
    required this.token,
  });

  @override
  Widget build(BuildContext context) {
    var hourlyBooking = commonViewModel
        ?.settingsResponseModel?.data?.hiddenSettings?.hourlyBooking;
    return Padding(
      padding: (isWishlistPage == true)
          ? EdgeInsets.symmetric(vertical: 20)
          : horizontalPadding(horizontal: 20, vertical: 20),
      child: GestureDetector(
          onTap: () {
            if (pricePerDay!.isNotEmpty && pricePerHour!.isNotEmpty) {
              Get.toNamed(RouterName.productDetailScreen, arguments: {
                RouterArguments.listingId: data?.id ?? id,
                RouterArguments.images: images,
                RouterArguments.wishlist:
                    data?.wishlist ?? isWishlistPage ?? false,
              }, parameters: {
                if (data != null)
                  RouterArguments.hostDetailsData: jsonEncode(data?.toJson()),
              });
            } else {
              ToastUtil.showMessage("noListingFound");
            }
          },
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(
              children: [
                Stack(
                  alignment: Alignment.bottomCenter,
                  children: [
                    SizedBox(
                      height: 300,
                      child: PageView(
                        controller: controller,
                        children: [
                          if (images.isNotEmpty)
                            ...images.map((item) => ClipRRect(
                                  borderRadius: BorderRadius.circular(10),
                                  child: CacheImageWidget(
                                    imageUrl: item,
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, url, error) {
                                      return ErrorImage(
                                        isSquare: true,
                                      );
                                    },
                                  ),
                                )),
                        ],
                      ),
                    ),
                    if (discountPercentage != null && discountPercentage! > 0)
                      Positioned(
                          left: 14,
                          top: 14,
                          child: discountPriceCardWidget(
                              discountAmount: "$discountPercentage")),
                    Positioned(
                        right: 0,
                        top: 0,
                        child: WishlistIconButton(
                          token: token,
                          // data: data ,
                          listingId: data?.id ?? id,
                          collectionId: wishListPageData?.id,
                          collectionName: wishListPageData?.collectionName,
                          wishlist: data?.wishlist ?? isWishlistPage ?? false,
                          isWishlistPage: isWishlistPage,
                          wishlistViewModel: wishlistViewModel!,
                        )),
                    if (images.isNotEmpty && images.length > 1)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: SmoothPageIndicator(
                          controller: controller,
                          count: images.length,
                          effect: SwapEffect(
                              activeDotColor: AppColorData.appSecondaryColor,
                              dotColor: AppColorData.grey03.withOpacity(0.5),
                              dotHeight: 8,
                              dotWidth: 8),
                        ),
                      )
                  ],
                ),
                SizedBox(
                  height: 10,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Flexible(
                      child: CommonText(
                        text:
                            data?.propertyName ?? wishListPageData?.listingName,
                        overflow: TextOverflow.ellipsis,
                        style: AppTextStyle.bodyTextStyle,
                      ),
                    ),
                    Row(
                      children: [
                        Icon(
                          Icons.star,
                          size: 20,
                          color: AppColorData.starColor,
                        ),
                        SizedBox(
                          width: 2,
                        ),
                        CommonText(
                          text: data?.totalRatingCount == 0 ||
                                  wishListPageData?.rating == 0
                              ? tr("New")
                              : "${data?.totalRatingCount ?? wishListPageData?.rating}",
                          style: AppTextStyle.bodyTextStyle
                              .copyWith(fontWeight: FontWeight.w400),
                        ),
                      ],
                    )
                  ],
                ),
                Consumer2<ProductListingViewModel, EditProfileViewModel>(
                  builder: (context, value, editModel, child) {
                    return priceDisplayWidget(
                        hourlyBooking: hourlyBooking,
                        currencySymbol: value.listingResponseModel?.data
                                ?.multipleCurrency?.toSymbol ??
                            '',
                        perDayPrice: editModel.convertPrice(pricePerDay ??
                            "${data?.priceData?.pricing?.perDay}"),
                        perHourPrice: editModel.convertPrice(pricePerHour ??
                            "${data?.priceData?.pricing?.perHour}"),
                        discountedPrice:
                            data?.priceData?.pricing?.discountedPrice ??
                                discountedPrice,
                        editModel: editModel);
                  },
                ),
              ],
            ),
          )),
    );
  }
}

class WishlistIconButton extends StatelessWidget {
  const WishlistIconButton({
    super.key,
    this.token,
    // required this.data,
    required this.wishlistViewModel,
    this.onSuccess,
    this.listingId,
    this.wishlist,
    this.isWishlistPage,
    this.collectionId,
    this.collectionName,
  });

  final String? token;
  final String? listingId;
  final String? collectionId;
  final String? collectionName;
  final bool? wishlist;
  final bool? isWishlistPage;
  //final ApprovedListing data;
  final WishlistViewModel wishlistViewModel;
  final VoidCallback? onSuccess;

  @override
  Widget build(BuildContext context) {
    return Consumer3<ProductListingViewModel, WishlistViewModel,
        ProductDetailViewModel>(
      builder: (context, productListingValue, wishlistValue, listingDetailModel,
          child) {
        return IconButton(
            onPressed: () {
              print("token :: $token");
              if (token != null && token!.isNotEmpty) {
                if (wishlist!) {
                  // if(isWishlistPage == true){
                  //   wishlistValue.fetchWishlist(isdefault: false,collectionId: collectionId);
                  //   /*Get.offAllNamed(RouterName.wishlistCollection,
                  //     arguments: {
                  //       RouterArguments.collectionId: collectionId!,
                  //       RouterArguments.collectionName: collectionName!
                  //     });*/}
                  wishlistViewModel
                      .removeWishlist(
                    listingId: listingId!,
                    isWishListPage: isWishlistPage,
                  )
                      .then((val) {
                    if (onSuccess != null) {
                      onSuccess!();
                    }
                    if (isWishlistPage == true) {
                      wishlistValue.fetchWishlist(
                          isdefault: false, collectionId: collectionId);
                      /*Get.offAllNamed(RouterName.wishlistCollection,
                      arguments: {
                        RouterArguments.collectionId: collectionId!,
                        RouterArguments.collectionName: collectionName!
                      });*/
                    }
                    productListingValue.fetchListing(
                        loader: false,
                        categoryId: productListingValue.categoryId);
                  });
                } else {
                  wishListBtmSht(
                      listingDetailViewModel: listingDetailModel,
                      listingId: listingId!,
                      context: context,
                      onSuccess: onSuccess,
                      from: "main",
                      wishListModel: wishlistViewModel,
                      viewModel: productListingValue,
                      categoryId: productListingValue.categoryId);
                }
              } else {
                Get.toNamed(RouterName.loginScreen);
                /* Navigator.of(context).push(
                  MaterialPageRoute(builder: (context) => LoginScreen()),
                );*/
              }
            },
            icon: wishlist ?? false
                ? Stack(
                    alignment: Alignment.center,
                    children: [
                      Icon(
                        Icons.favorite_border_rounded,
                        size: 28,
                        color: Colors.white,
                      ),
                      Icon(
                        Icons.favorite,
                        size: 25,
                        color: AppColorData.appPrimaryColor.withOpacity(0.8),
                      ),
                    ],
                  )
                : Stack(
                    alignment: Alignment.center,
                    children: [
                      Icon(
                        Icons.favorite_border_rounded,
                        size: 28,
                        color: Colors.white,
                      ),
                      Icon(
                        Icons.favorite,
                        size: 25,
                        color: Colors.black12,
                      ),
                    ],
                  ));
      },
    );
  }
}

Widget priceDisplayWidget({
  required String? hourlyBooking,
  required String currencySymbol,
  required String? perDayPrice,
  required String? perHourPrice,
  EditProfileViewModel? editModel,
  num? discountedPrice,
}) {
  final isDiscountAvailable = discountedPrice != null && discountedPrice > 0;

  if (hourlyBooking == "Both") {
    return Row(
      children: [
        Flexible(
          child: CommonText(
            text:
            "$currencySymbol${isDiscountAvailable ? editModel?.convertPrice(discountedPrice.toString()) : formatPrice(perDayPrice)}",
            style: AppTextStyle.subBodyStyle,
            overflow: TextOverflow.ellipsis,
          ),
        ),
        SizedBox(width: 5),
        if (isDiscountAvailable) ...[
          Flexible(
            child: CommonText(
              text: formatPrice(perDayPrice),
              overflow: TextOverflow.ellipsis,
              style: AppTextStyle.contentStyle.copyWith(
                decoration: TextDecoration.lineThrough,
                color: AppColorData.subBodyTextClr,
              ),
            ),
          ),
          SizedBox(width: 5),
        ],
        CommonText(
          text: "night",
          style: AppTextStyle.subBodyStyle.copyWith(
            color: AppColorData.subBodyTextClr,
          ),
        ),
        Container(
          height: 10,
          width: 1,
          margin: EdgeInsets.symmetric(horizontal: 10),
          color: AppColorData.blackClr,
        ),
        Flexible(
          child: CommonText(
            text: "$currencySymbol${formatPrice(perHourPrice)}",
            overflow: TextOverflow.ellipsis,
            style: AppTextStyle.subBodyStyle.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        SizedBox(width: 5),
        CommonText(
          text: "hour",
          style: AppTextStyle.subBodyStyle.copyWith(
            color: AppColorData.subBodyTextClr,
          ),
        ),
      ],
    );
  }

  // DAY ONLY
  else if (hourlyBooking == "Day") {
    return Row(
      spacing: 5,
      children: [
        Flexible(
          child: CommonText(
            text:
            "$currencySymbol${isDiscountAvailable ? formatPrice(discountedPrice) : formatPrice(perDayPrice)}",
            overflow: TextOverflow.ellipsis,
            style: AppTextStyle.subBodyStyle,
          ),
        ),
        if (isDiscountAvailable)
          Flexible(
            child: CommonText(
              text: formatPrice(perDayPrice),
              overflow: TextOverflow.ellipsis,
              style: AppTextStyle.subBodyStyle.copyWith(
                decoration: TextDecoration.lineThrough,
                color: AppColorData.subBodyTextClr,
              ),
            ),
          ),
        CommonText(
          text: "night",
          style: AppTextStyle.subBodyStyle.copyWith(
            color: AppColorData.subBodyTextClr,
          ),
        ),
      ],
    );
  }

  // HOUR ONLY
  else if (hourlyBooking == "Hour") {
    return Row(
      children: [
        Flexible(
          child: CommonText(
            overflow: TextOverflow.ellipsis,
            text: "$currencySymbol${formatPrice(perHourPrice)}",
            style: AppTextStyle.subBodyStyle.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        SizedBox(width: 5),
        CommonText(
          text: "hour",
          style: AppTextStyle.subBodyStyle.copyWith(
            color: AppColorData.subBodyTextClr,
          ),
        ),
      ],
    );
  }

  return SizedBox();
}


// Widget priceDisplayWidget({
//   required String? hourlyBooking,
//   required String currencySymbol,
//   required String? perDayPrice,
//   required String? perHourPrice,
//   EditProfileViewModel? editModel,
//   num? discountedPrice,
// }) {
//   final isDiscountAvailable = discountedPrice != null && discountedPrice > 0;
//
//   if (hourlyBooking == "Both") {
//     return Row(
//       children: [
//         CommonText(
//           text:
//               "$currencySymbol${isDiscountAvailable ? editModel?.convertPrice(discountedPrice.toString()) : formatPrice(perDayPrice)}",
//           style: AppTextStyle.subBodyStyle,
//         ),
//         SizedBox(width: 5),
//         if (isDiscountAvailable) ...[
//           CommonText(
//             text: formatPrice(perDayPrice),
//             style: AppTextStyle.contentStyle.copyWith(
//               decoration: TextDecoration.lineThrough,
//               color: AppColorData.subBodyTextClr,
//             ),
//           ),
//           SizedBox(width: 5),
//         ],
//         CommonText(
//           text: "night",
//           style: AppTextStyle.subBodyStyle.copyWith(
//             color: AppColorData.subBodyTextClr,
//           ),
//         ),
//         Container(
//           height: 10,
//           width: 1,
//           margin: EdgeInsets.symmetric(horizontal: 10),
//           color: AppColorData.blackClr,
//         ),
//         CommonText(
//           text: "$currencySymbol${formatPrice(perHourPrice)}",
//           style: AppTextStyle.subBodyStyle.copyWith(
//             fontWeight: FontWeight.w600,
//           ),
//         ),
//         SizedBox(width: 5),
//         CommonText(
//           text: "hour",
//           style: AppTextStyle.subBodyStyle.copyWith(
//             color: AppColorData.subBodyTextClr,
//           ),
//         ),
//       ],
//     );
//   } else if (hourlyBooking == "Day") {
//     return Row(
//       spacing: 5,
//       children: [
//         CommonText(
//           text:
//               "$currencySymbol${isDiscountAvailable ? formatPrice(discountedPrice) : formatPrice(perDayPrice)}",
//           style: AppTextStyle.subBodyStyle,
//         ),
//         if (isDiscountAvailable)
//           CommonText(
//             text: formatPrice(perDayPrice),
//             style: AppTextStyle.subBodyStyle.copyWith(
//               decoration: TextDecoration.lineThrough,
//               color: AppColorData.subBodyTextClr,
//             ),
//           ),
//         CommonText(
//           text: "night",
//           style: AppTextStyle.subBodyStyle.copyWith(
//             color: AppColorData.subBodyTextClr,
//           ),
//         ),
//       ],
//     );
//   } else if (hourlyBooking == "Hour") {
//     return Row(
//       children: [
//         CommonText(
//           text: "$currencySymbol${formatPrice(perHourPrice)}",
//           style: AppTextStyle.subBodyStyle.copyWith(
//             fontWeight: FontWeight.w600,
//           ),
//         ),
//         SizedBox(width: 5),
//         CommonText(
//           text: "hour",
//           style: AppTextStyle.subBodyStyle.copyWith(
//             color: AppColorData.subBodyTextClr,
//           ),
//         ),
//       ],
//     );
//   } else {
//     return SizedBox(); // Display nothing if no valid condition matches
//   }
// }

Widget discountPriceCardWidget({required String discountAmount}) {
  return Container(
    padding: EdgeInsets.symmetric(vertical: 7, horizontal: 12),
    decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        color: AppColorData.appPrimaryColor),
    child: CommonText(
      text: "$discountAmount% ${tr("off")}",
      style: AppTextStyle.bodyTextStyle.copyWith(color: AppColorData.whiteClr),
    ),
  );
}
