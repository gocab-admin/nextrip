import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/user/listing_response_model.dart';
import 'package:airstar_flutter/ui/user/Product/product_mapview.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../viewModel/base_view_model/base_view_model.dart';

class ProductList extends StatefulWidget {
  final String categoryId;
  final String? token;
  final bool? isMapView;
  final ProductListingViewModel viewModel;
  final WishlistViewModel wishlistViewModel;

  ProductList({
    super.key,
    required this.categoryId,
    this.token,
    required this.wishlistViewModel,
    required this.viewModel,
    this.isMapView,
  });

  @override
  State<ProductList> createState() => _ProductListState();
}

class _ProductListState extends State<ProductList> {
  DraggableScrollableController controller = DraggableScrollableController();

  ScrollController productScrollController = ScrollController();

  @override
  void initState() {
    controller = DraggableScrollableController();
    productScrollController.addListener(() {
      if (productScrollController.position.pixels ==
          productScrollController.position.maxScrollExtent) {
        if (widget.viewModel.state != ViewState.tertiaryLoader &&
            widget.viewModel.loadPaginatedListing) {
          widget.viewModel.fetchListing(
            categoryId: widget.viewModel.categoryId,
            isPaginated: true,
          );
        }
      }
    });
    super.initState();
  }
  // bool isExpanded = false;

  void _toggleSheet(ProductListingViewModel value) {
    value.isExpandMap = !value.isExpandMap;
    value.notify();
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        bool isSmall = constraints.maxWidth < 600;
        bool isMedium =
            constraints.maxWidth >= 600 && constraints.maxWidth < 900;
        bool isLarge =
            constraints.maxWidth >= 900 && constraints.maxWidth < 1200;
        bool isExtraLarge = constraints.maxWidth >= 1200;
        int crossAxisCount;
        if (isSmall) {
          crossAxisCount = 1;
        } else if (isMedium) {
          crossAxisCount = 2;
        } else if (isLarge) {
          crossAxisCount = 3;
        } else {
          crossAxisCount = 5; // Monitor view
        }

        double childAspectRatio;
        if (isSmall) {
          childAspectRatio = 0.75; // Taller cards for mobile
        } else if (isMedium) {
          childAspectRatio = 0.70; // Medium height for tablets
        } else if (isLarge) {
          childAspectRatio = 0.75; // Balanced for desktop
        } else {
          childAspectRatio = 0.80; // More square for large monitors
        }
        return Consumer2<ProductListingViewModel, CommonViewModel>(
          builder: (context, viewModel, commonValue, child) {
            if (viewModel.state == ViewState.secondaryLoader) {
              return DashBoardLoader();
            }

            if (viewModel.listingResponseModel == null) {
              return Center(child: Loader());
            } else {
              return _cabinBottomSheet(
                viewModel,
                widget.wishlistViewModel,
                commonValue,
                crossAxisCount,
                childAspectRatio,
              );
              /*RefreshIndicator(
                onRefresh: () async {
                  //viewModel.fetchListing(categoryId: widget.categoryId);
                },
                child: _cabinBottomSheet(viewModel, widget.wishlistViewModel,
                    commonValue, crossAxisCount, childAspectRatio)
            );*/
            }
          },
        );
      },
    );
  }

  Widget _cabinBottomSheet(
    ProductListingViewModel viewModel,
    WishlistViewModel wishlistViewModel,
    CommonViewModel commonValue,
    int crossAxisCount,
    double childAspectRatio,
  ) {
    if (viewModel.listingResponseModel!.data!.approvedListing!.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            //  doubleSpacer(height: 80),
            Image.asset(PNGAssets.noDataImage),
            doubleSpacer(height: 40),
            CommonText(text: "noListingFound", style: AppTextStyle.headerStyle),
            TextButton(
              onPressed: () {
                viewModel.clearAll();
                viewModel.clearFilters();
                viewModel.fetchListing(
                  categoryId: viewModel.categoryId,
                  addFilterListing: true,
                );
              },
              child: CommonText(
                text: "resetFilters",
                underLineColor: AppColorData.appPrimaryColor,
                isUnderline: true,
                style: AppTextStyle.bodyTextStyle.copyWith(
                  color: AppColorData.appPrimaryColor,
                ),
              ),
            ),
          ],
        ),
      );
    }

    return Stack(
      children: [
        ProductMapView(
          token: widget.token,
          wishlistViewModel: wishlistViewModel,
          listing: viewModel.listingResponseModel!.data!.approvedListing!,
          viewModel: viewModel,
        ),
        if (viewModel.isExpandMap == false)
          DraggableScrollableSheet(
            snap: true,
            initialChildSize: 1,
            minChildSize: 0.1,
            maxChildSize: 1,
            controller: controller,
            builder: (context, scrollController) {
              return Container(
                color: AppColorData.appSecondaryColor,
                child: Column(
                  children: [
                    Expanded(
                      child: (crossAxisCount == 1)
                          ? ListView.builder(
                              controller: productScrollController,
                              itemCount: viewModel
                                  .listingResponseModel!
                                  .data!
                                  .approvedListing!
                                  .length,
                              itemBuilder: (context, index) {
                                var data = viewModel
                                    .listingResponseModel!
                                    .data!
                                    .approvedListing![index];

                                List<String> images = [];
                                if (data.attachmentData != null &&
                                    data.attachmentData!.isNotEmpty)
                                  images.add(
                                    data.attachmentData?[0].image?.coverImage ??
                                        "",
                                  );
                                if (data.attachmentData != null &&
                                    data.attachmentData!.isNotEmpty)
                                  images.addAll(
                                    data.attachmentData?[0].image?.groupImage
                                            ?.map((e) => e.imagePath ?? "")
                                            .toList() ??
                                        [],
                                  );

                                // int _current = 0;

                                final _controller = PageController();

                                return productCardWidget(
                                  data,
                                  images,
                                  _controller,
                                  viewModel,
                                  wishlistViewModel,
                                  commonValue,
                                );
                              },
                            )
                          : GridView.builder(
                              controller: productScrollController,
                              gridDelegate:
                                  SliverGridDelegateWithFixedCrossAxisCount(
                                    crossAxisCount: crossAxisCount,
                                    childAspectRatio: crossAxisCount == 1
                                        ? 1.0
                                        : childAspectRatio,
                                  ),
                              itemCount: viewModel
                                  .listingResponseModel!
                                  .data!
                                  .approvedListing!
                                  .length,
                              itemBuilder: (context, index) {
                                var data = viewModel
                                    .listingResponseModel!
                                    .data!
                                    .approvedListing![index];

                                List<String> images = [];
                                if (data.attachmentData != null &&
                                    data.attachmentData!.isNotEmpty)
                                  images.add(
                                    data.attachmentData?[0].image?.coverImage ??
                                        "",
                                  );
                                if (data.attachmentData != null &&
                                    data.attachmentData!.isNotEmpty)
                                  images.addAll(
                                    data.attachmentData?[0].image?.groupImage
                                            ?.map((e) => e.imagePath ?? "")
                                            .toList() ??
                                        [],
                                  );

                                // int _current = 0;

                                final _controller = PageController();

                                return productCardWidget(
                                  data,
                                  images,
                                  _controller,
                                  viewModel,
                                  wishlistViewModel,
                                  commonValue,
                                );
                              },
                            ),
                    ),
                    if (viewModel.state == ViewState.tertiaryLoader)
                      Hero(
                        tag: "load",
                        child: Loader(color: AppColorData.blackClr),
                      ),
                  ],
                ),
              );
            },
          ),
        if (viewModel.state != ViewState.tertiaryLoader)
          Align(
            alignment: Alignment.bottomCenter,
            child: Padding(
              padding: const EdgeInsets.only(bottom: 14.0),
              child: InkWell(
                onTap: () => _toggleSheet(viewModel),
                child: Hero(
                  tag: "load",
                  child: Container(
                    padding: const EdgeInsets.all(14.0),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(55),
                      color: AppColorData.blackBorderClr,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        CommonText(
                          text: viewModel.isExpandMap ? "showList" : "showMap",
                          style: AppTextStyle.bodyTextStyle.copyWith(
                            color: AppColorData.whiteClr,
                          ),
                        ),
                        SizedBox(width: 6),
                        Icon(
                          viewModel.isExpandMap
                              ? Icons.menu_open_rounded
                              : Icons.map,
                          size: 20,
                          color: AppColorData.whiteClr,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget productCardWidget(
    ApprovedListing data,
    List<String> images,
    PageController controller,
    ProductListingViewModel viewModel,
    WishlistViewModel wishlistViewModel,
    CommonViewModel commonValue,
  ) {
    return ProductCardWidget(
      id: "${data.id}",
      images: images,
      controller: controller,
      token: "${widget.token}",
      data: data,
      pricePerDay: "${data.priceData?.pricing?.perDay ?? ''}",
      pricePerHour: "${data.priceData?.pricing?.perHour ?? ''}",
      discountPercentage: data.priceData?.pricing?.discountPercentage,
      discountedPrice: data.priceData?.pricing?.discountedPrice,
      wishlistViewModel: wishlistViewModel,
      commonViewModel: commonValue,
      viewModel: viewModel,
    );
  }

  Widget spacer() {
    return const SizedBox(height: 10);
  }
}

Future wishListBtmSht({
  required String listingId,
  required String categoryId,
  required ProductListingViewModel viewModel,
  required ProductDetailViewModel listingDetailViewModel,
  required WishlistViewModel wishListModel,
  required BuildContext context,
  required String from,
  final VoidCallback? onSuccess,
}) {
  wishListModel.fetchWishlist(isdefault: true);
  return showCustomModalBottomSheet(
    showDivider: false,
    backgroundColor: AppColorData.appSecondaryColor,
    title: tr("addToWishlist"),
    context: context,
    builder: (context) {
      return Padding(
        padding: horizontalPadding(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            doubleSpacer(),
            Consumer<WishlistViewModel>(
              builder: (context, value, child) {
                if (value.state == ViewState.busy) {
                  return Padding(
                    padding: const EdgeInsets.only(top: 10, bottom: 10),
                    child: ProgressLoader(),
                  );
                }
                if (value.wishlistResponseModel!.data!.wishLists!.isEmpty) {
                  return Center(child: CommonText(text: "noWishListFound"));
                }
                return Expanded(
                  child: GridView.builder(
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      // mainAxisExtent: 340,
                      mainAxisExtent: 215,
                      mainAxisSpacing: 20,
                      crossAxisSpacing: 20,
                      crossAxisCount: 2,
                    ),
                    shrinkWrap: false,
                    itemCount:
                        value.wishlistResponseModel!.data!.wishLists!.length,
                    itemBuilder: (context, index) {
                      var data =
                          value.wishlistResponseModel!.data!.wishLists![index];
                      return InkWell(
                        splashColor: Colors.transparent,
                        highlightColor: Colors.transparent,
                        onTap: () {
                          value
                              .addWishlist(
                                collectionName: data.data!.collectionName!,
                                listingId: listingId,
                                isCreateWishlist: false,
                                collectionId: data.id!,
                              )
                              .then((val) {
                                if (from == "main") {
                                  if (onSuccess != null) {
                                    onSuccess();
                                  }
                                  viewModel.fetchListing(
                                    categoryId: categoryId,
                                    loader: false,
                                  );
                                } else if (from == "detail") {
                                  viewModel.updateHomePageWishlistStatus(
                                    listingId,
                                    true,
                                  );
                                  listingDetailViewModel.fetchListingDetail(
                                    id: listingId,
                                  );
                                }
                                Navigator.pop(context);
                              });
                        },
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              height: 150,
                              width: double.maxFinite,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(10),
                                color: AppColorData.appSecondaryColor,
                                boxShadow: commonBoxShadows(),
                              ),
                              child: Card(
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(8),
                                  child: CacheImageWidget(
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, url, error) {
                                      return ErrorImage(isSquare: true);
                                    },
                                    imageUrl: data.data?.img ?? "",
                                  ),
                                ),
                              ),
                            ),
                            SizedBox(height: 10),
                            CommonText(
                              text: data.data!.collectionName!,
                              style: AppTextStyle.headerStyle,
                              overflow: TextOverflow.ellipsis,
                            ),
                            if (data.collectionDataCount != null)
                              CommonText(
                                text:
                                    "${data.collectionDataCount} ${tr("saved")}",
                                style: AppTextStyle.subBodyHintTextStyle
                                    .copyWith(
                                      color: AppColorData.subBodyTextClr,
                                    ),
                              ),
                          ],
                        ),
                      );
                    },
                  ),
                );
              },
            ),
            doubleSpacer(height: 50),
            Container(
              padding: EdgeInsets.symmetric(vertical: 20),
              decoration: BoxDecoration(
                border: Border(
                  top: BorderSide(color: AppColorData.dividerColor),
                ),
              ),
              child: CommonElevatedButton(
                elevatedButtonColor: AppColorData.blackButtonClr,
                elevatedButtonName: tr("createWishlist"),
                onTap: () {
                  Navigator.pop(context);
                  _addwishListBtmSht(
                    viewModel: viewModel,
                    listingId: listingId,
                    context: context,
                    from: from,
                    wishListModel: wishListModel,
                    listingDetailViewModel: listingDetailViewModel,
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

Future _addwishListBtmSht({
  required String listingId,
  required BuildContext context,
  required WishlistViewModel wishListModel,
  required ProductListingViewModel viewModel,
  required ProductDetailViewModel listingDetailViewModel,
  required String from,
}) {
  TextEditingController name = TextEditingController();

  ValueNotifier<int> textLength = ValueNotifier<int>(0);

  name.addListener(() {
    textLength.value = name.text.length;
  });

  return showCustomModalBottomSheet(
    showDivider: false,
    // shape: RoundedRectangleBorder(
    //     borderRadius: BorderRadius.only(
    //         topRight: Radius.circular(20), topLeft: Radius.circular(20))),
    backgroundColor: AppColorData.appSecondaryColor,
    //height: 0.45,
    title: "createWishlist",
    context: context,
    builder: (context) {
      return Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            // spacer(),
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 20.0,
                vertical: 5,
              ),
              child: CommonTextFromField(
                contentPadding: EdgeInsets.symmetric(horizontal: 14),
                controller: name,
                border: Border.all(color: AppColorData.boxBorder),
                labelText: tr("name"),
                // hintText: "${viewModel.categoryResponseModel!.data!.categories!.first.category}",
              ),
            ),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: ValueListenableBuilder<int>(
                valueListenable: textLength,
                builder: (context, length, child) {
                  return Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      CommonText(
                        text: "$length / 50 ${tr("characters")}",
                        style: AppTextStyle.contentStyle.copyWith(
                          fontWeight: FontWeight.w400,
                          color: AppColorData.subBodyTextClr,
                        ),
                      ),
                    ],
                  );
                },
              ),
            ),
            SizedBox(height: 40),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              decoration: BoxDecoration(
                border: Border(
                  top: BorderSide(
                    color: AppColorData.boxBorder.withOpacity(0.5),
                  ),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  GestureDetector(
                    onTap: () {
                      name.clear();
                    },
                    child: CommonText(
                      isUnderline: true,
                      text: "clear",
                      style: AppTextStyle.bodyTextStyle,
                    ),
                  ),
                  CommonElevatedButton(
                    width: MediaQuery.of(context).size.width * 0.3,
                    onTap: () {
                      wishListModel
                          .addWishlist(
                            collectionName: name.text,
                            isCreateWishlist: true,
                            listingId: listingId,
                          )
                          .then((val) {
                            if (from == "main") {
                              viewModel.fetchListing(
                                categoryId: viewModel.categoryId,
                                loader: false,
                              );
                            } else if (from == "detail") {
                              viewModel.updateHomePageWishlistStatus(
                                listingId,
                                true,
                              );
                              listingDetailViewModel.fetchListingDetail(
                                id: listingId,
                              );
                            }
                          });
                      Navigator.pop(context);
                    },
                    elevatedButtonName: "create",
                    elevatedButtonNameColor: AppColorData.appSecondaryColor,
                    elevatedButtonColor: AppColorData.blackButtonClr,
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    },
  );
}
