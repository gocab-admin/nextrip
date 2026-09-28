import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/ui/user/dashBoard/dashboard.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/ui/user/wishlist/wishlist_collection_loader.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/user/listing_view_model.dart';
import 'package:airstar_flutter/viewModel/user/wishlist_view_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../viewModel/user/common_viewmodel.dart';


class WishlistCollection extends StatefulWidget {
  final String collectionId;
  final String collectionName;

  const WishlistCollection(
      {super.key, required this.collectionId, required this.collectionName});

  @override
  State<WishlistCollection> createState() => _WishlistCollectionState();
}

class _WishlistCollectionState extends State<WishlistCollection> {
  WishlistViewModel? wishlistViewModel;
  CommonViewModel? commonViewModel;

  @override
  void initState() {
    wishlistViewModel = Provider.of<WishlistViewModel>(context, listen: false);
    commonViewModel = Provider.of<CommonViewModel>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((val) {
      wishlistViewModel!
          .fetchWishlist(isdefault: false, collectionId: widget.collectionId);
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        wishlistViewModel?.fetchWishlist(isdefault: true);
        return true;
      },
      child: Scaffold(
        backgroundColor: Colors.white,
        body: CustomScrollView(
          slivers: [
            SliverAppBar(
              pinned: true,
              expandedHeight: 110,
              flexibleSpace: CommonSliverAppBar(
                title: widget.collectionName,
                titleTextStyle: AppTextStyle.headingStyle,
              ),
            ),
            SliverToBoxAdapter(
              child: _renderBody(),
            )
          ],
        ),
      ),
    );
  }

  Widget _renderBody() {
    return Padding(
      padding: horizontalPadding(vertical: 10.0),
      child: Consumer2<WishlistViewModel, ProductListingViewModel>(
        builder: (context, value, productValue, child) {
          if (value.state == ViewState.busy) {
            return Center(
             //child: Loader(color: AppColorData.blackClr,),
                          child: WishlistCollectionLoader(),
            );
          } else if (value.wishlistCollectionResponseModel?.data?.wishLists
                  ?.firstOrNull?.listingId ==
              null) {
            return EmptyScreenView();
          }
          return ListView.builder(
            physics: NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            padding: EdgeInsets.zero,
            itemCount:
                value.wishlistCollectionResponseModel!.data!.wishLists!.length,
            itemBuilder: (context, index) {
              var data = value
                  .wishlistCollectionResponseModel!.data!.wishLists![index];
              List<String> images = [];
              images.add(data.image?.coverImage ?? "");
              images.addAll(data.image?.groupImage
                      ?.map((e) => e.imagePath ?? "")
                      .toList() ??
                  []);
              final _controller = PageController();
              return ProductCardWidget(
                  commonViewModel: commonViewModel,
                  id: data.listingId ?? '',
                  token: AppConstant.authToken ?? '',
                  controller: _controller,
                  images: images,
                  isWishlistPage: true,
                  pricePerDay: "${data.price?.perDay ?? ''}",
                  pricePerHour: "${data.price?.perHour ?? ''}",
                  discountPercentage: data.price?.discountPercentage,
                  discountedPrice: data.price?.discountedPrice,
                  wishlistViewModel: value,
                  wishListPageData: data);
            },
          );
        },
      ),
    );
  }

  Widget EmptyScreenView() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        spacer(),
        CommonText(
          text: "asYouSearchTap",
          style: AppTextStyle.headerStyle
              .copyWith(color: AppColorData.subBodyTextClr),
        ),
        SizedBox(
          height: 30,
        ),
        CommonElevatedButton(
            width: 150,
            elevatedButtonColor: AppColorData.blackButtonClr,
            elevatedButtonName: "startExploring",
            onTap: () {
              Navigator.push(context,
                  MaterialPageRoute(builder: (context) => DashBoard()));
            })
      ],
    );
  }
}
