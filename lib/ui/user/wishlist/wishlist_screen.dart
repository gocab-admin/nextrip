import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/ui/user/dashBoard/dashboard.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/ui/user/wishlist/wishlist_loader.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/user/listing_view_model.dart';
import 'package:airstar_flutter/viewModel/user/wishlist_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:get/route_manager.dart';
import 'package:provider/provider.dart';

import '../../../routes/routes.dart';

class WishlistScreen extends StatefulWidget {
  final String? token;

  const WishlistScreen({super.key, required this.token});

  @override
  State<WishlistScreen> createState() => _WishlistScreenState();
}

class _WishlistScreenState extends State<WishlistScreen> {
  ProductListingViewModel? productListingViewModel;

  @override
  void initState() {
    productListingViewModel =
        Provider.of<ProductListingViewModel>(context, listen: false);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: CustomScrollView(
        slivers: [
          SliverAppBar(
            automaticallyImplyLeading: false,
            pinned: true,
            expandedHeight: 120,
            actions: [
              if (widget.token != null && widget.token!.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(right: 18.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Consumer<WishlistViewModel>(
                          builder: (context, value, child) {
                        if (value.wishlistResponseModel?.data?.wishLists
                                ?.isEmpty ??
                            true) {
                          return const SizedBox(height: 50);
                        }
                        return CommonElevatedButton(
                          isTextBtn: true,
                          onTap: () {
                            value.updateWishlistEdit();
                          },
                          elevatedButtonName:
                              value.isWishlistEdit ? "done" : "edit",
                        );
                      }),
                    ],
                  ),
                ),
            ],
            flexibleSpace: CommonSliverAppBar(
              isBackArrowPresent: false,
              bottomPosition: 4,
              appBarHeight: 120,
              title: "wishList",
            ),
          ),
          SliverList(
            delegate: SliverChildListDelegate([
              widget.token != null && widget.token!.isNotEmpty
                  ? _renderBody()
                  : _loginWishListView(),
            ]),
          )
        ],
      ),
    );
  }

  Widget _renderBody() {
    return Padding(
      padding: horizontalPadding(vertical: 10),
      child: LayoutBuilder(builder: (context, constraints) {
        bool isSmall = constraints.maxWidth < 600;
        bool isMedium =
            constraints.maxWidth >= 600 && constraints.maxWidth < 800;
        bool isLarge = constraints.maxWidth >= 800;
        int crossAxisCount = isSmall
            ? 2
            : isMedium
                ? 3
                : isLarge
                    ? 4
                    : 1;
        return Consumer<WishlistViewModel>(
          builder: (context, value, child) {
            if (value.state == ViewState.busy) {
              return SizedBox(height: 600, child: WishlistLoader());
            }
            if (value.wishlistResponseModel?.data?.wishLists?.isEmpty ?? true) {
              return noWishlistScreen();
            }
            return GridView.builder(
              physics: const NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              itemCount: value.wishlistResponseModel!.data!.wishLists!.length,
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  mainAxisExtent: 215,
                  mainAxisSpacing: 20,
                  crossAxisSpacing: 20,
                  crossAxisCount: crossAxisCount),
              itemBuilder: (context, index) {
                var data = value.wishlistResponseModel!.data!.wishLists![index];
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    GestureDetector(
                      onTap: () {
                        Get.toNamed(RouterName.wishlistCollection, arguments: {
                          RouterArguments.collectionId: data.id!,
                          RouterArguments.collectionName:
                              data.data!.collectionName!
                        });
                      },
                      child: Stack(
                        children: [
                          Container(
                            height: 150,
                            width: double.maxFinite,
                            decoration: BoxDecoration(
                                color: AppColorData.appSecondaryColor,
                                borderRadius: BorderRadius.circular(10),
                                boxShadow: [
                                  BoxShadow(
                                      color: AppColorData.greyColor
                                          .withOpacity(0.5),
                                      offset: Offset(0, 0),
                                      blurRadius: 5,
                                      spreadRadius: 0),
                                ]),
                            child: Card(
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: CacheImageWidget(
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, url, error) {
                                      return ErrorImage(
                                        isSquare: true,
                                      );
                                    },
                                    imageUrl: "${data.data?.img ?? ""}"),
                              ),
                            ),
                          ),
                          if (value.isWishlistEdit)
                            Positioned(
                                top: 12,
                                left: 12,
                                child: InkWell(
                                    onTap: () {
                                      showDialog(
                                          context: context,
                                          builder: (context) {
                                            return Padding(
                                              padding:
                                                  const EdgeInsets.all(20.0),
                                              child: Container(
                                                decoration: BoxDecoration(
                                                  borderRadius:
                                                      BorderRadius.zero,
                                                  shape: BoxShape.rectangle,
                                                ),
                                                child: CommonAlertDialog(
                                                    titleWidget: Padding(
                                                      padding:
                                                          const EdgeInsets.only(
                                                              left: 20.0,
                                                              top: 20.0),
                                                      child: Column(
                                                        crossAxisAlignment:
                                                            CrossAxisAlignment
                                                                .start,
                                                        children: [
                                                          CommonText(
                                                            text:
                                                                "deleteThisWishlist",
                                                            style: AppTextStyle
                                                                .bodyTextStyle,
                                                          ),
                                                          doubleSpacer(),
                                                          CommonText(
                                                            text:
                                                                '"${data.data!.collectionName!}" ${tr("willPermanentlyDltd")}',
                                                            style: AppTextStyle
                                                                .subBodyStyle
                                                                .copyWith(
                                                                    fontWeight:
                                                                        FontWeight
                                                                            .w300),
                                                          ),
                                                        ],
                                                      ),
                                                    ),
                                                    actions: [
                                                      Row(
                                                        mainAxisAlignment:
                                                            MainAxisAlignment
                                                                .end,
                                                        children: [
                                                          CommonElevatedButton(
                                                              isTextBtn: true,
                                                              isUnderline:
                                                                  false,
                                                              elevatedButtonName:
                                                                  "cancel",
                                                              onTap: () {
                                                                Navigator.pop(
                                                                    context);
                                                              }),
                                                          // CommonText(text: Strings.cancel,),
                                                          SizedBox(
                                                            width: 20,
                                                          ),
                                                          CommonElevatedButton(
                                                            isTextBtn: true,
                                                            isUnderline: false,
                                                            elevatedButtonName:
                                                                "DELETE",
                                                            onTap: () {
                                                              value
                                                                  .deleteWishlist(
                                                                      wishlistId:
                                                                          data.id!)
                                                                  .then((val) {
                                                                if (val ==
                                                                    true) {
                                                                  value.fetchWishlist(
                                                                      isdefault:
                                                                          true);
                                                                  productListingViewModel!
                                                                      .fetchListing(
                                                                          categoryId:
                                                                              productListingViewModel!.categoryId);
                                                                }
                                                              });
                                                              Navigator.pop(
                                                                  context);
                                                            },
                                                          ),
                                                          SizedBox(
                                                            width: 10,
                                                          ),
                                                        ],
                                                      )
                                                    ]),
                                              ),
                                            );
                                          });
                                    },
                                    child: CircleAvatar(
                                      backgroundColor:
                                          AppColorData.appSecondaryColor,
                                      minRadius: 13,
                                      child: Icon(
                                        Icons.close,
                                        color: AppColorData.appIconBlack,
                                        size: 15,
                                      ),
                                    )))
                        ],
                      ),
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    CommonText(
                      text: data.data!.collectionName!,
                      style: AppTextStyle.headerStyle,
                      overflow: TextOverflow.ellipsis,
                    ),
                    data.collectionDataCount != null
                        ? CommonText(
                            text: "${data.collectionDataCount} ${tr("saved")}",
                            style: AppTextStyle.subBodyHintTextStyle
                                .copyWith(color: AppColorData.subBodyTextClr),
                          )
                        : SizedBox()
                  ],
                );
              },
            );
          },
        );
      }),
    );
  }

  Widget noWishlistScreen() {
    return Padding(
      padding: horizontalPadding(vertical: 0),
      child: Column(
        spacing: 10,
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          CommonText(
            text: "saveYourFavInPlace",
            style: AppTextStyle.headerStyle,
          ),
          CommonText(
            textAlign: TextAlign.center,
            text: "tapTheHeartIcon",
            style:
                AppTextStyle.subBodyStyle.copyWith(fontWeight: FontWeight.w300),
          ),
          Stack(
            alignment: Alignment.bottomCenter,
            children: [
              // SvgPicture.asset(SVGAssets.noWishListWave),
              Image.asset(PNGAssets.noWishlistWave),
              Positioned(
                  right: 33,
                  bottom: 50,
                  child: Image.asset(PNGAssets.noWishlistSingleLeaf1)),
              Positioned(
                  right: 68,
                  bottom: 58,
                  child: Image.asset(PNGAssets.noWishlistSingleLeaf2)),
              Positioned(
                  right: 13,
                  bottom: 68,
                  child: Image.asset(
                    PNGAssets.noWishlistSingleLeaf3,
                  )),
              Positioned(
                  left: 15,
                  bottom: 65,
                  child: Image.asset(
                    PNGAssets.noWishlistDoubleLeafImage,
                  )),
              Image.asset(PNGAssets.girlImage),
            ],
          ),
          CommonText(
            text: "noWishListFound",
            style: AppTextStyle.titleStyle,
          ),
          GestureDetector(
              onTap: () {
                // Get.toNamed(RouterName.dashBoard,);
                Navigator.push(context,
                    MaterialPageRoute(builder: (context) => DashBoard()));
              },
              child: CommonText(
                  text: "startExploring",
                  style: AppTextStyle.bodyTextStyle
                      .copyWith(color: AppColorData.appPrimaryColor)))
        ],
      ),
    );
  }

  Widget _loginWishListView() {
    return Padding(
      padding: horizontalPadding(vertical: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CommonText(
            text: "wishListLoginSub",
            style: AppTextStyle.headingStyle,
          ),
          // doubleSpacer(),
          doubleSpacer(),
          CommonText(
            text: "wishListSub",
            style: AppTextStyle.bodyTextStyle.copyWith(
                fontWeight: FontWeight.w300,
                color: AppColorData.subBodyTextClr),
          ),
          doubleSpacer(),
          CommonElevatedButton(
            width: MediaQuery.of(context).size.width * 0.35,
            elevatedButtonColor: AppColorData.appPrimaryColor,
            elevatedButtonName: "login",
            onTap: () {
              Get.toNamed(RouterName.loginScreen);
            },
          ),
        ],
      ),
    );
  }
}
