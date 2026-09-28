import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/commonWidgets/widget/common_padding_alignment.dart';
import 'package:airstar_flutter/data/models/host/user_listings_response_model.dart';
import 'package:airstar_flutter/routes/router_name.dart';
import 'package:airstar_flutter/ui/host/bottom_bar_screens/subwidgets/common_radio_tile.dart';
import 'package:airstar_flutter/ui/host/bottom_bar_screens/subwidgets/switch_button_widgets.dart';
import 'package:airstar_flutter/ui/user/dashBoard/filterScreen/common_amenities_widget.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/host/create_listing_view_model.dart';
import 'package:airstar_flutter/viewModel/host/host_listing_view_model.dart';
import 'package:airstar_flutter/viewModel/user/listing_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

import '../../../viewModel/base_view_model/base_view_model.dart';

class ListingsPage extends StatefulWidget {
  const ListingsPage({super.key});

  @override
  State<ListingsPage> createState() => _ListingsPageState();
}

class _ListingsPageState extends State<ListingsPage> {
  CreateListingViewModel? createListingViewModel;
  ProductListingViewModel? listingViewModel;
  HostListingViewModel? hostListingViewModel;

  @override
  void initState() {
    createListingViewModel =
        Provider.of<CreateListingViewModel>(context, listen: false);
    listingViewModel =
        Provider.of<ProductListingViewModel>(context, listen: false);
    hostListingViewModel =
        Provider.of<HostListingViewModel>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      //  listingViewModel?.fetchAmenities();
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Consumer2<HostListingViewModel, CreateListingViewModel>(
          builder: (context, value, listingModel, child) {
        return CustomScrollView(
          slivers: [
            _buildAppBarWidget(value, listingModel),
            if (value.state == ViewState.busy)
              SliverFillRemaining(
                hasScrollBody: false,
                child: Center(
                    child: Loader(
                  color: AppColorData.blackClr,
                )),
              )
            else
              SliverList(
                  delegate: SliverChildListDelegate([
                _renderBody(value, listingModel),
              ]))
          ],
        );
      }),
    );
  }

  Widget _buildAppBarWidget(
      HostListingViewModel value, CreateListingViewModel listingModel) {
    return SliverAppBar(
      automaticallyImplyLeading: false,
      pinned: true,
      expandedHeight: 120,
      title:
          Visibility(visible: value.isSearching, child: _buildSearchBar(value)),
      actions: value.isSearching
          ? [
              Padding(
                padding: const EdgeInsets.only(right: 18.0),
                child: CommonElevatedButton(
                  isTextBtn: true,
                  onTap: () {
                    value.toggleSearch();
                    value.clearSearchField();
                    value.fetchUsersListing();
                  },
                  elevatedButtonName: "cancel",
                ),
              ),
            ]
          : [
              InkWell(
                onTap: () => value.toggleSearch(),
                child: Container(
                  margin: EdgeInsets.only(right: 14),
                  padding: EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppColorData.grey06,
                  ),
                  child: Icon(Icons.search),
                ),
              ),
              InkWell(
                onTap: () {
                  listingModel.resetProgress(listingViewModel!);
                  Get.toNamed(RouterName.getSteps);
                },
                child: Container(
                  margin: EdgeInsets.only(right: 20),
                  padding: EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppColorData.grey06,
                  ),
                  child: Icon(Icons.add),
                ),
              )
            ],
      flexibleSpace: Visibility(
        visible: !value.isSearching,
        child: CommonSliverAppBar(
          bottomPosition: 4,
          isBackArrowPresent: false,
          title: "yourListings",
        ),
      ),
    );
  }

  Widget _buildSearchBar(HostListingViewModel value) {
    var isSearchEmpty = value.searchController.text.isEmpty;
    return CommonTextFromField(
      height: 50,
      filled: true,
      fillColor: AppColorData.grey06,
      hintText: tr("search"),
      prefixIcon: Icon(Icons.search),
      controller: value.searchController,
      border: Border.all(
          color: isSearchEmpty
              ? AppColorData.boxBorder
              : AppColorData.blackBorderClr),
      borderRadius: BorderRadius.circular(50),
      onChanged: (val) {
        value.fetchUsersListing(search: val);
        value.notify();
      },
    );
  }

  Widget _buildEmptyListingWidget(CreateListingViewModel value) {
    return Center(
      child: CommonPadding(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          spacing: 10,
          children: [
            Icon(
              Icons.home_work,
              size: 30,
            ),
            CommonText(
                text: "youDontHaveListingsHead",
                style: AppTextStyle.bodyTextStyle
                    .copyWith(fontWeight: FontWeight.bold)),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 30.0),
              child: CommonText(
                textAlign: TextAlign.center,
                text: "youDontHaveListingsSub",
                style: AppTextStyle.subBodyStyle
                    .copyWith(color: AppColorData.subBodyTextHighlightClr),
              ),
            ),
            CommonElevatedButton(
                width: 200,
                border: Border.all(color: AppColorData.blackBorderClr),
                elevatedButtonColor: AppColorData.transparent,
                elevatedButtonNameColor: AppColorData.bodyTextColor,
                elevatedButtonName: "createListing",
                onTap: () {
                  value.resetProgress(listingViewModel!);
                  Get.toNamed(RouterName.getSteps);
                })
          ],
        ),
      ),
    );
  }

  Widget _renderBody(
      HostListingViewModel value, CreateListingViewModel listingModel) {
    var listings = value.userListingsResponseModel?.data?.providerListings;

    return CommonPadding(
      child: Column(
        spacing: 20,
        children: [
          _filterOptions(value),
          if (listings == null || listings.isEmpty)
            _buildEmptyListingWidget(listingModel)
          else
            ListView.builder(
                padding: EdgeInsets.zero,
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                itemCount: listings.length,
                itemBuilder: (context, index) {
                  var data = listings[index];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 48.0),
                    child: GestureDetector(
                      onTap: () {
                        if (data.status == 'pending') {
                          showCustomModalBottomSheet(
                              showDivider: false,
                              context: context,
                              builder: (context) =>
                                  editListingBottomSheet(value, data));
                        } else {
                          Get.toNamed(RouterName.listingDetailPage, arguments: {
                            RouterArguments.listingId: data.id ?? ''
                          });
                        }
                      },
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Stack(
                            children: [
                              SizedBox(
                                width: double.maxFinite,
                                height: 330,
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(10),
                                  child: data.coverImage == null
                                      ? ErrorImage()
                                      : CacheImageWidget(

                                          fit: BoxFit.cover,
                                          errorBuilder: (context, url, error) {
                                            return ErrorImage();
                                          },
                                          imageUrl: data.coverImage ?? "",
                                  ),
                                ),
                              ),
                              Positioned(
                                top: 20,
                                left: 10,
                                child: Container(
                                  padding: EdgeInsets.symmetric(
                                      horizontal: 7, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: AppColorData.whiteClr,
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Row(
                                    spacing: 4,
                                    children: [
                                      Icon(
                                        Icons.circle,
                                        size: 10,
                                        color: data.status == "pending"
                                            ? AppColorData.tripProcesTxtClr
                                            : AppColorData.deactivateButtonClr,
                                      ),
                                      CommonText(
                                        text: data.status == "pending"
                                            ? "InProgress"
                                            : "actionRequired",
                                        style: AppTextStyle.subBodyStyle,
                                      ),
                                    ],
                                  ),
                                ),
                              )
                            ],
                          ),
                          spacer(),
                          CommonText(
                            text: data.propertyName?.capitalizeFirst ?? '',
                            style: AppTextStyle.bodyTextStyle
                                .copyWith(fontWeight: FontWeight.bold),
                          ),
                          SizedBox(height: 6),
                          CommonText(
                            text: data.address?.city == null ||
                                    data.address!.city!.isEmpty
                                ? " ${tr("yourListingUpdatedAt")} ${formatFullDateWithMonth(DateTime.tryParse("${data.updatedAt}"))}"
                                : "${tr("homeIn")} ${data.address?.city}, ${data.address?.state}",
                            style: AppTextStyle.subBodyStyle.copyWith(
                                color: AppColorData.subBodyTextHighlightClr),
                          )
                        ],
                      ),
                    ),
                  );
                }),
        ],
      ),
    );
  }

  Widget _filterOptions(HostListingViewModel value) {
    return Row(
      spacing: 14,
      children: [
        FilterOptionWidget(
            title: "Amenities",
            hasFilter: value.hasAmenitiesFilter == true,
            onTap: () {
              showCustomModalBottomSheet(
                  title: "chooseAmenities",
                  context: context,
                  builder: (context) => showAmenitiesSheet());
            }),
        FilterOptionWidget(
            title: "listingStatus",
            hasFilter: value.hasListingFilter == true,
            onTap: () {
              showCustomModalBottomSheet(
                  title: "listingStatus",
                  context: context,
                  builder: (context) => _filterSheet());
            }),
      ],
    );
  }

  Widget showAmenitiesSheet() {
    return CommonPadding(
        padding: EdgeInsets.symmetric(horizontal: 20.0),
        child: Consumer2<ProductListingViewModel, HostListingViewModel>(
            builder: (context, productModel, value, child) {
          return SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CommonAmenitiesWidget(
                  model: productModel,
                  isFromFilter: false,
                ),
                CommonBottomActionButtons(onClear: () {
                  productModel.selectedAmenities.clear();
                  productModel.showMore = false;
                  for (var a
                      in productModel.amenitiesResponseModel?.data?.amenities ??
                          []) {
                    a.isChecked = false;
                  }
                  value.hasAmenitiesFilter = false;
                  value.notify();
                  value.fetchUsersListing().then((_) {
                    productModel.showMore = false;
                    Get.back();
                  });
                  Get.back();
                }, onSave: () {
                  value.hasAmenitiesFilter =
                      productModel.selectedAmenities.isNotEmpty;
                  value.fetchUsersListing(productModel: productModel).then((_) {
                    productModel.showMore = false;
                    Get.back();
                  });
                }),
              ],
            ),
          );
        }));
  }

  Widget _filterSheet() {
    return CommonPadding(
        padding: EdgeInsets.symmetric(horizontal: 20.0),
        child: Consumer<HostListingViewModel>(builder: (context, value, child) {
          return Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListView.builder(
                  padding: EdgeInsets.zero,
                  shrinkWrap: true,
                  itemCount: value.filterOptions.length,
                  itemBuilder: (context, index) {
                    final option = value.filterOptions[index];
                    return CommonRadioTile(
                      hasSecondaryWidget: false,
                      title: option,
                      value: option,
                      groupValue: value.selectedListingField,
                      onChanged: (newValue) {
                        value.selectedListingField = newValue;
                        value.notify();
                      },
                    );
                  }),
              CommonBottomActionButtons(onClear: () {
                value.clearFilter();
                value.fetchUsersListing();
                Get.back();
              }, onSave: () {
                value.hasListingFilter = value.selectedListingField != null;
                value.fetchUsersListing().then((_) {
                  Get.back();
                });
              })
            ],
          );
        }));
  }

  Widget editListingBottomSheet(
      HostListingViewModel value, ProviderListing? data) {
    return Consumer2<ProductListingViewModel, CreateListingViewModel>(
        builder: (context, productModel, listingModel, child) {
      return CommonPadding(
        padding: EdgeInsets.symmetric(horizontal: 20.0),
        child: Column(
          spacing: 10,
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              height: 150,
              width: 150,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: data?.coverImage == null
                    ? ErrorImage()
                    : CacheImageWidget(
                        height: 150,
                        width: 150,
                        fit: BoxFit.cover,
                        errorBuilder: (context, url, error) {
                          return ErrorImage();
                        },
                        imageUrl: data?.coverImage ?? "",
                ),
              ),
            ),
            CommonText(
              text: data?.propertyName?.capitalizeFirst,
              style: AppTextStyle.bodyTextStyle
                  .copyWith(fontWeight: FontWeight.bold),
            ),
            CommonText(
              text: data?.address?.city == null || data!.address!.city!.isEmpty
                  ? " ${tr("yourListingUpdatedAt")} ${formatFullDateWithMonth(DateTime.tryParse("${data?.updatedAt}"))}"
                  : "${data.address?.city}, ${data.address?.state}",
              style: AppTextStyle.subBodyStyle
                  .copyWith(color: AppColorData.subBodyTextHighlightClr),
            ),
            doubleSpacer(),
            CommonElevatedButton(
                isLoad: value.state == ViewState.busy,
                showLoader: true,
                elevatedButtonColor: AppColorData.blackButtonClr,
                elevatedButtonName: "editListing",
                onTap: () async {
                  final selectedId = data?.id ?? '';

                  await PreferenceHelper.setString(
                      PrefConstant.listingId, selectedId);
                  listingModel.getSteps().then((_) {
                    value.fetchHostListing(data?.id ?? '').then((hostListing) {
                      listingModel.restoreProgressListing(
                          data?.id ?? '', productModel, value);
                      Get.toNamed(RouterName.listingIntroScreen);
                    });
                  });
                }),
            spacer(),
            GestureDetector(
              onTap: () {
                value.deleteListing(listingId: '${data?.id ?? ''}').then((_) {
                  Get.back();
                });
              },
              child: CommonText(
                text: "removeListing",
                style: AppTextStyle.buttonTextStyle,
              ),
            ),
            doubleSpacer(),
          ],
        ),
      );
    });
  }
}
