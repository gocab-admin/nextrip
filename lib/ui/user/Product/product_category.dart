import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/user/category_response_model.dart';
import 'package:airstar_flutter/ui/user/Product/sub_widgets/custom_animated_tab_list.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/user/listing_view_model.dart';
import 'package:airstar_flutter/viewModel/user/wishlist_view_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../viewModel/base_view_model/base_view_model.dart';
import 'product_list.dart';

class ProductCategory extends StatefulWidget {
  final String? token;
  final WishlistViewModel wishlistViewModel;

  const ProductCategory({
    super.key,
    this.token,
    required this.wishlistViewModel,
  });

  @override
  State<ProductCategory> createState() => _ProductCategoryState();
}

class _ProductCategoryState extends State<ProductCategory> {
  bool isMap = false;

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ProductListingViewModel>(
      builder: (context, value, child) {
        // if (value.state == ViewState.busy) {
        //   return
        //     //ProfileViewScreenLoader();
        //     ProductCategoryLoader(isProductCategoryLoader: true,);
        // }
        List<Category> categories =
            value.categoryResponseModel?.data?.categories ?? [];

        if (value.state == ViewState.busy) {
          return Loader(color: AppColorData.blackClr);
        }

        return Column(
          children: [
            CustomAnimatedTabList(
              categories: categories,
              selectedCategoryId: value.categoryId,
              onCategoryChanged: (category) {
                if (value.categoryId != category.id!) {
                  value.categoryId = category.id!;
                  value.resetPagination();
                  value.resetPriceRange();
                  value.clearFilters();
                  value.fetchListing(categoryId: category.id!);
                }
              },
            ),
            Expanded(
              child: ProductList(
                categoryId: value.categoryId,
                viewModel: value,
                wishlistViewModel: widget.wishlistViewModel,
                token: widget.token,
              ),
            ),
            /*TabBar(
              unselectedLabelColor: AppColorData.iconDimColor,
              labelColor: AppColorData.appIconBlack,
              unselectedLabelStyle: TextStyle(
                color: AppColorData.subBodyTextClr,
              ),
              isScrollable: true,
              labelStyle: AppTextStyle.subBodyStyle,

              // indicatorSize: TabBarIndicatorSize.label,
              indicatorColor: AppColorData.blackClr,
              dividerColor: AppColorData.dividerColor,
              tabAlignment: TabAlignment.start,
              overlayColor: WidgetStatePropertyAll(Colors.transparent),
              controller: value.tabController,
              padding: EdgeInsets.only(left: 20),

              labelPadding: EdgeInsets.only(right: 20),
              onTap: (val) {
                if (value.tabController?.indexIsChanging == true) {
                  value.categoryId = categories[val].id!;
                  value.resetPagination();
                  value.resetPriceRange();
                  value.clearFilters();
                  value.fetchListing(categoryId: categories[val].id!);
                }
              },
              tabs: [
                for (int i = 0; i < categories.length; i++)
                  Tab(
                    text: categories[i].category ?? "",
                    icon: SizedBox(
                      height: 35,
                      width: 30,
                      child:
                          isSvgImageUrl(
                            "${EndPointConstants.baseurl}/${categories[i].icon ?? ""}",
                          )
                          ? SvgPicture.network(
                              "${EndPointConstants.baseurl}/${categories[i].icon ?? ""}",
                              height: 35,
                              colorFilter: ColorFilter.mode(
                                value.tabController!.index == i
                                    ? AppColorData.blackClr
                                    : AppColorData.grey03,
                                BlendMode.srcIn,
                              ),
                            )
                          : CacheImageWidget(
                              color: value.tabController!.index == i
                                  ? AppColorData.blackClr
                                  : AppColorData.grey03,
                              imageUrl: "${categories[i].icon ?? ""}",
                            ),
                    ),
                  ),
              ],
            ),
            Expanded(
              child: TabBarView(
                physics: NeverScrollableScrollPhysics(),
                controller: value.tabController,
                children: [
                  for (var e in categories)
                    ProductList(
                      categoryId: e.id ?? "",
                      viewModel: value,
                      wishlistViewModel: widget.wishlistViewModel,
                      token: widget.token,
                    ),
                ],
              ),
            ),*/
          ],
        );
      },
    );
  }
}
