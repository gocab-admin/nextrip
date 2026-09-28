import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/commonWidgets/widget/common_padding_alignment.dart';
import 'package:airstar_flutter/routes/router_name.dart';
import 'package:airstar_flutter/ui/host/bottom_bar_screens/subwidgets/common_radio_tile.dart';
import 'package:airstar_flutter/ui/host/bottom_bar_screens/subwidgets/switch_button_widgets.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/host/create_listing_view_model.dart';
import 'package:airstar_flutter/viewModel/host/host_listing_view_model.dart';
import 'package:airstar_flutter/viewModel/user/listing_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

import '../../../../data/models/host/host_listing_response_model.dart';
import '../../../../viewModel/user/profile_view_model.dart';

class ListingDetailPage extends StatefulWidget {
  final String listingId;

  const ListingDetailPage({super.key, required this.listingId});

  @override
  State<ListingDetailPage> createState() => _ListingDetailPageState();
}

class _ListingDetailPageState extends State<ListingDetailPage> {
  HostListingViewModel? hostListingViewModel;
  EditProfileViewModel? editProfileViewModel;
  final storage = locator<AppSecureStorage>();

  @override
  void initState() {
    hostListingViewModel =
        Provider.of<HostListingViewModel>(context, listen: false);
    editProfileViewModel =
        Provider.of<EditProfileViewModel>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      if (widget.listingId.isNotEmpty) {
        await hostListingViewModel?.fetchHostListing(widget.listingId);
      }
      hostListingViewModel?.loadSavedCurrencySymbol();
      hostListingViewModel?.fetchCancelPolicy();
      hostListingViewModel?.fetchRulesIcons();
      hostListingViewModel?.selectedFilter = 0;
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Consumer<HostListingViewModel>(builder: (context, value, child) {
        var data = value.hostListingResponseModel?.data?.listing?.first;
        return SafeArea(
          child: CustomScrollView(
            slivers: [
              SliverAppBar(
                pinned: true,
                expandedHeight: 115,
                flexibleSpace: CommonSliverAppBar(
                  title: '${data?.propertyName}',
                  bottomPosition: 6,
                ),
                actions: [
                  Padding(
                    padding: const EdgeInsets.only(right: 20.0),
                    child: CommonElevatedButton(
                      isTextBtn: true,
                      onTap: () {
                        value
                            .deleteListing(listingId: '${data?.id ?? ''}')
                            .then((_) {
                          Get.back();
                        });
                      },
                      elevatedButtonName: "delete",
                    ),
                  )
                ],
              ),
              SliverList(
                  delegate: SliverChildListDelegate([_renderBody(value)]))
            ],
          ),
        );
      }),
    );
  }

  Widget _renderBody(HostListingViewModel value) {
    return CommonPadding(
        child: Column(
          spacing: 14,
          children: [
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                spacing: 14,
                children: List.generate(value.listingDetailFilters.length, (index) {
                  var filterData = value.listingDetailFilters[index];
                  return CommonOptionCardWidget(
                    isSelected: value.selectedFilter == index,
                    onTap: () => value.updateSelectedFilter(index),
                    title: filterData,
                  );
                }),
              ),
            ),
            spacer(),
            if (value.selectedFilter == 0) ListingDetails(value: value),
            if (value.selectedFilter == 1) PriceDetails(value: value, editModel: editProfileViewModel),
            if (value.selectedFilter == 2) PoliciesAndRules(value: value, listingId: widget.listingId),
          ],
        ));
  }
}

class EditTileWidget extends StatelessWidget {
  final String? title;
  final String? subtitle;
  final VoidCallback? onEdit;
  final TextStyle? titleStyle;
  final int? routeIndex;
  final bool? showDivider;
  final bool? isEdit;
  final CreateListingViewModel? listingModel;
  final HostListingViewModel? value;
  final ProductListingViewModel? productModel;
  final List<HostListing>? data;
  final String? listingId;

  const EditTileWidget({
    super.key,
    this.title,
    this.subtitle,
    this.onEdit,
    this.titleStyle,
    this.routeIndex,
    this.showDivider = true,
    this.isEdit = true,
    this.listingModel,
    this.value,
    this.productModel,
    this.data,
    this.listingId,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      spacing: 6,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Flexible(
              child: CommonText(
                overflow: TextOverflow.ellipsis,
                text: title,
                style: titleStyle ?? AppTextStyle.headerStyle,
              ),
            ),
            if (isEdit == true)
              InkWell(
                onTap: (onEdit != null)
                    ? onEdit
                    : () async {
                  await PreferenceHelper.setString(
                      PrefConstant.listingId, listingId ?? '');

                  listingModel?.restoreProgressListing(
                      listingId ?? '', productModel!, value!);
                  listingModel?.jumpToPage(
                      '${listingModel?.pageRoutes[routeIndex ?? 0]}');
                  Get.toNamed(RouterName.listingIntroScreen);
                },
                child: CommonText(
                  isUnderline: true,
                  text: "edit",
                  style: AppTextStyle.bodyTextStyle,
                ),
              )
          ],
        ),
        if (subtitle != null)
          CommonText(
            text: subtitle,
            style: AppTextStyle.bodyTextStyle
                .copyWith(color: AppColorData.subBodyTextHighlightClr),
          ),
        if (showDivider == true)
          CustomDivider(
            height: 20,
          ),
      ],
    );
  }
}

class ListingDetails extends StatelessWidget {
  final HostListingViewModel value;
  const ListingDetails({super.key, required this.value});

  @override
  Widget build(BuildContext context) {
    return Consumer2<CreateListingViewModel, ProductListingViewModel>(
        builder: (context, listingModel, productModel, child) {
          return Column(
            spacing: 20,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _listingImageDetails(value, listingModel, productModel),
              _listingBasicDetails(value, listingModel),
              _guestRoomSpaceDetails(value, listingModel, productModel)
            ],
          );
        });
  }


  Widget _listingImageDetails(
      HostListingViewModel value,
      CreateListingViewModel listingModel,
      ProductListingViewModel productModel,
      ) {
    var attachmentData =
        value.hostListingResponseModel?.data?.listing?.first.attachmentData;
    var coverImage = attachmentData?.image?.coverImage;
    var groupImage = attachmentData?.image?.groupImage ?? [];

    // Merge cover + group images (cover first, then group list)
    List<String> allImages = [];
    if (coverImage != null && coverImage.isNotEmpty) {
      allImages.add(coverImage);
    }
    allImages.addAll(groupImage.map((e) => e.imagePath ?? "").where((e) => e.isNotEmpty));

    var listingId = value.hostListingResponseModel?.data?.listing?.first.id;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        EditTileWidget(
           title: "photos",
            showDivider: false,
            titleStyle: AppTextStyle.titleStyle,
            routeIndex: 7,
            listingModel: listingModel,
            productModel: productModel,
            value: value,
            listingId: listingId
        ),
        ConstrainedBox(
          constraints: const BoxConstraints(maxHeight: 160, minHeight: 150),
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            shrinkWrap: true,
            itemCount: allImages.length,
            itemBuilder: (context, index) {
              var imagePath = allImages[index];
              return Padding(
                padding: const EdgeInsets.only(right: 14.0),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: CacheImageWidget(
                    width: 160,
                    errorBuilder: (context, url, error) {
                      return ErrorImage();
                    },
                    imageUrl: imagePath,
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }


  Widget _listingBasicDetails(
      HostListingViewModel value, CreateListingViewModel listingModel) {
    var data = value.hostListingResponseModel?.data?.listing?.first;
    var privileges = value.hostListingResponseModel?.data;
    return Consumer<ProductListingViewModel>(
        builder: (context, productModel, child) {
          return Column(
            spacing: 20,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CommonText(
                text: "listingBasics",
                style: AppTextStyle.titleStyle,
              ),
              EditTileWidget(
                title: "listingTitle",
                subtitle: data?.propertyName ?? '',
                routeIndex: 8,
                listingModel: listingModel,
                productModel: productModel,
                value: value,
                listingId: data?.id ?? '',
              ),
              EditTileWidget(
                title: "listingDescription",
                subtitle: data?.propertyDesc ?? '',
                routeIndex: 9,
                listingModel: listingModel,
                productModel: productModel,
                listingId: data?.id ?? '',
                value: value,
              ),
              if (privileges?.privileges != null) ...[
                EditTileWidget(
                    title: "Amenities",
                    showDivider: false,
                    titleStyle: AppTextStyle.titleStyle,
                    routeIndex: 6,
                    listingModel: listingModel,
                    productModel: productModel,
                    value: value,
                    listingId: data?.id ?? ''),
                // if(privileges?.privileges != null)
                ...List.generate(privileges?.privileges?.length ?? 0, (index) {
                  var data = privileges?.privileges?[index];
                  var matchedItems = privileges?.privilegeItems
                      ?.where((item) => item.privilegeId == data?.id)
                      .toList();

                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      CommonText(
                        text: data?.name,
                        style: AppTextStyle.headerStyle,
                      ),
                      spacer(),
                      if (matchedItems != null && matchedItems.isNotEmpty)
                        ...matchedItems.map((item) => Padding(
                          padding: const EdgeInsets.only(bottom: 8.0),
                          child: CommonText(
                            text: item.name,
                            style: AppTextStyle.bodyTextStyle.copyWith(
                              color: AppColorData.subBodyTextHighlightClr,
                            ),
                          ),
                        )),
                      CustomDivider(height: 20),
                    ],
                  );
                }),
              ],
              CommonText(
                text: "location",
                style: AppTextStyle.titleStyle,
              ),
              EditTileWidget(
                  title: "address",
                  subtitle: data?.address?.location ?? '',
                  routeIndex: 2,
                  listingModel: listingModel,
                  productModel: productModel,
                  value: value,
                  listingId: data?.id ?? ''),
            ],
          );
        });
  }

  Widget _guestRoomSpaceDetails(
      HostListingViewModel value,
      CreateListingViewModel listingModel,
      ProductListingViewModel productModel) {
    var data = value.hostListingResponseModel?.data?.listing?.first;
    var bedCount = data?.accomodation?.bedRoomBedtype
        ?.map((e) => e.bedCount ?? 0)
        .fold<int>(0, (sum, count) => sum + count);
    return Column(
      spacing: 4,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CommonText(
          text: "propertyAndRooms",
          style: AppTextStyle.titleStyle,
        ),
        spacer(),
        EditTileWidget(
          showDivider: false,
          title: "propertyType",
          subtitle: '${data?.propertyTypeName?.property}',
          routeIndex: 0,
          listingModel: listingModel,
          productModel: productModel,
          listingId: data?.id ?? '',
          value: value,
        ),
        spacer(),
        CommonText(
          text: "listingType",
          style: AppTextStyle.bodyTextStyle,
        ),
        CommonText(
          text: '${data?.propertyCategoryName?.category}',
          style: AppTextStyle.bodyTextStyle.copyWith(
            color: AppColorData.subBodyTextHighlightClr,
          ),
        ),
        CustomDivider(height: 30),
        EditTileWidget(
            showDivider: false,
            title: "guestRoomsSpace",
            routeIndex: 4,
            listingModel: listingModel,
            productModel: productModel,
            value: value,
            listingId: data?.id ?? ''),
        spacer(),
        CommonText(
          text: '${tr("guest")}: ${data?.guest?.adult}',
          style: AppTextStyle.subBodyStyle.copyWith(
            color: AppColorData.subBodyTextHighlightClr,
          ),
        ),
        CommonText(
          text: '${tr("children")}: ${data?.guest?.children}',
          style: AppTextStyle.subBodyStyle.copyWith(
            color: AppColorData.subBodyTextHighlightClr,
          ),
        ),
        CommonText(
          text: '${tr("pets")}: ${data?.guest?.pets}',
          style: AppTextStyle.subBodyStyle.copyWith(
            color: AppColorData.subBodyTextHighlightClr,
          ),
        ),
        CommonText(
          text: '${tr("bedRoom")}: ${data?.accomodation?.bedRoomCount}',
          style: AppTextStyle.subBodyStyle.copyWith(
            color: AppColorData.subBodyTextHighlightClr,
          ),
        ),
        CommonText(
          text: '${tr("beds")}: ${bedCount}',
          style: AppTextStyle.subBodyStyle.copyWith(
            color: AppColorData.subBodyTextHighlightClr,
          ),
        ),
        CommonText(
          text:
          '${tr("bathRooms")}: ${data?.accomodation?.bathRoom?.bathRoomCount}',
          style: AppTextStyle.subBodyStyle.copyWith(
            color: AppColorData.subBodyTextHighlightClr,
          ),
        ),
      ],
    );
  }
}

class PriceDetails extends StatelessWidget {
  final HostListingViewModel value;
  final EditProfileViewModel? editModel;
  const PriceDetails({super.key, required this.value, this.editModel});

  @override
  Widget build(BuildContext context) {
    return Consumer2<CreateListingViewModel, ProductListingViewModel>(
        builder: (context, listingModel, productModel, child) {
          var data = value
              .hostListingResponseModel?.data?.listing?.first.priceData?.pricing;
          return Column(
            spacing: 10,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              //  spacer(),
              Container(
                padding: EdgeInsets.all(14.0),
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppColorData.boxBorder)),
                child: Row(
                  spacing: 14,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    CircleAvatar(
                      child: Icon(Icons.notifications_outlined),
                    ),
                    Flexible(
                      child: Column(
                        spacing: 6,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          CommonText(
                            text: "blockDatesSetting",
                            style: AppTextStyle.bodyTextStyle,
                          ),
                          CommonText(
                            text: "nowCanUseUrCalendar",
                            style: AppTextStyle.subBodyHintTextStyle,
                          ),
                          CommonElevatedButton(
                              isTextBtn: true,
                              onTap: () {},
                              elevatedButtonName: "goToCalendar")
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              spacer(),
              EditTileWidget(
                title:   "pricing",
                showDivider: false,
                routeIndex: 10,
                listingModel: listingModel,
                productModel: productModel,
                value: value,
                listingId: value.hostListingResponseModel?.data?.listing?.first.id,
              ),
              CommonText(
                text:
                '${value.savedCurrencySymbol}${editModel?.convertPrice(data?.perDay?.toString())} ${tr("night")}',
                style: AppTextStyle.bodyTextStyle
                    .copyWith(color: AppColorData.subBodyTextHighlightClr),
              ),
              CommonText(
                text:
                '${value.savedCurrencySymbol}${editModel?.convertPrice(data?.perHour.toString())} ${tr("hour")}',
                style: AppTextStyle.bodyTextStyle
                    .copyWith(color: AppColorData.subBodyTextHighlightClr),
              )
            ],
          );
        });
  }
}

class PoliciesAndRules extends StatelessWidget {
  final HostListingViewModel value;
  final String listingId;
  const PoliciesAndRules({super.key, required this.value, required this.listingId});

  @override
  Widget build(BuildContext context) {
    return  Column(
      spacing: 10,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CommonText(
          text: "policies",
          style: AppTextStyle.titleStyle,
        ),
        EditTileWidget(
          title:  "cancellationPolicy",
          subtitle: value.selectedPolicyField,
          onEdit: () {
            showCustomModalBottomSheet(
                title: "cancellationPolicy",
                context: context,
                builder: (context) => _cancelPolicySheet());
          },
        ),
        // ListTile(
        //   contentPadding: EdgeInsets.zero,
        //   title: CommonText(
        //     text: "houseRules",
        //     style: AppTextStyle.headerStyle,
        //   ),
        //   trailing: GestureDetector(onTap: (){
        //     showCustomModalBottomSheet(
        //         title: "houseRules",
        //         context: context,
        //         builder: (context) => _addHouseRuleSheet(context));
        //   },
        //       child: CommonText(
        //         isUnderline: true,
        //     text: "add",
        //         style: AppTextStyle.bodyTextStyle,
        //   )),
        // )
      ],
    );
  }


  Widget _cancelPolicySheet() {
    return CommonPadding(
      padding: EdgeInsets.symmetric(horizontal: 20.0),
      child: Consumer<HostListingViewModel>(builder: (context, value, child) {
        var cancelPolicy = value.cancelPolicyResponseModel?.data?.policies;
        return Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ListView.builder(
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                itemCount: cancelPolicy?.length,
                itemBuilder: (context, index) {
                  var data = cancelPolicy?[index];
                  return CommonRadioTile(
                    hasSecondaryWidget: false,
                    title: data?.title ?? '',
                    value: data?.title ?? '',
                    groupValue: value.selectedPolicyField,
                    onChanged: (newValue) {
                      value.updateSelectedPolicy(data?.id ?? 0, newValue!);
                    },
                  );
                }),
            CommonBottomActionButtons(
                applyText: "save",
                clearText: "cancel",
                onClear: () {
                  value.clearCancellationPolicyData();
                  Get.back();
                },
                onSave: () {
                  if (value.selectedPolicyId != null) {
                    value
                        .updateCancellationPolicy(
                        cancellationPolicyId: value.selectedPolicyId,
                        listingId: listingId)
                        .then((val) {
                      if (val == true) {
                        Get.back();
                      }
                    });
                  }
                })
          ],
        );
      }),
    );
  }

  Widget _addHouseRuleSheet(BuildContext context) {
    return Padding(
      padding: MediaQuery.of(context).viewInsets,
      child: Container(
        padding: EdgeInsets.all(20.0),
        child: SingleChildScrollView(
          child: Consumer<HostListingViewModel>(builder: (context, value, child) {
            var icons = value.rulesIconsResponseModel?.data?.icons;
            var data = value
                .hostListingResponseModel?.data?.listing?.first;
            return Stack(
              children: [
                Column(
                  spacing: 20,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      spacing: 14,
                      children: [
                        GestureDetector(
                          onTap: () {
                            value.toggleIcon();
                          },
                          child: Container(
                            decoration: BoxDecoration(
                              color: AppColorData.whiteClr,
                              border: Border.all(color: AppColorData.boxBorder),
                              boxShadow:
                              value.showIconsGrid ? commonShadow() : null,
                            ),
                            child: Row(
                              children: [
                                Padding(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 10.0),
                                  child: (value.isIconSelected &&
                                      value.selectedIconUrl != null)
                                      ? Container(
                                    decoration: BoxDecoration(
                                      color: AppColorData.whiteClr,
                                      border: Border.all(
                                          color: AppColorData.boxBorder),
                                    ),
                                    child: Row(
                                      children: [
                                        Container(
                                          padding: EdgeInsets.all(4),
                                          width: 24,
                                          height: 24,
                                          child: CacheImageWidget(
                                              imageUrl:value.selectedIconUrl ?? ""
                                          ),
                                        ),
                                        Container(
                                            padding:
                                            const EdgeInsets.symmetric(
                                                vertical: 2.0),
                                            color:
                                            AppColorData.dividerColor,
                                            child: GestureDetector(
                                                onTap: () {
                                                  value.clearSelectedIcon();
                                                },
                                                child: Icon(
                                                  Icons.close,
                                                  size: 20,
                                                ))),
                                      ],
                                    ),
                                  )
                                      : CommonText(
                                    text: Strings.selectIcon,
                                    style: AppTextStyle.contentStyle
                                        .copyWith(
                                        color: AppColorData
                                            .subBodyTextClr),
                                  ),
                                ),
                                Container(
                                    padding:
                                    const EdgeInsets.symmetric(vertical: 2.0),
                                    color: AppColorData.dividerColor,
                                    child: IconButton(
                                        onPressed: () {
                                          value.toggleIcon();
                                        },
                                        icon: Icon(
                                            Icons.keyboard_arrow_down_sharp))),
                              ],
                            ),
                          ),
                        ),
                        Flexible(
                          child: CommonTextFromField(
                            controller: value.rulesTitleController,
                            contentPadding: EdgeInsets.only(left: 14.0),
                            border: Border.all(color: AppColorData.boxBorder),
                            labelText: Strings.ruleTitle,
                          ),
                        ),
                      ],
                    ),
                    CommonTextFromField(
                      expands: true,
                      maxLines: null,
                      height: 120,
                      controller: value.rulesDescController,
                      textAlignVertical: TextAlignVertical.top,
                      contentPadding: EdgeInsets.all(14),
                      border: Border.all(color: AppColorData.boxBorder),
                      hintText: Strings.ruleDescription,
                    ),
                    CustomDivider(),
                    CommonElevatedButton(
                        elevatedButtonColor: AppColorData.blackButtonClr,
                        elevatedButtonName: Strings.save,
                        onTap: () {
                          //   print("id>>> ${data?.id}");
                          value.updateHouseRules(
                              title: value.rulesTitleController.text ?? '',
                              description: value.rulesDescController.text ?? '',
                              rules: value.selectedIconUrl ?? '',
                              listingId: data?.id ?? '');
                        })
                  ],
                ),
                if (value.showIconsGrid)
                  Positioned(
                    top: 50,
                    left: 0,
                    right: 0,
                    child: Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                          color: AppColorData.whiteClr,
                          boxShadow: commonShadow()),
                      padding: EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          CommonText(
                            text: Strings.selectIcon,
                            style: AppTextStyle.headerStyle,
                          ),
                          CustomDivider(),
                          GridView.builder(
                              gridDelegate:
                              SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 5,
                                childAspectRatio: 1.0,
                                mainAxisSpacing: 8,
                                crossAxisSpacing: 8,
                              ),
                              physics: NeverScrollableScrollPhysics(),
                              shrinkWrap: true,
                              itemCount: icons?.length ?? 0,
                              itemBuilder: (context, index) {
                                var data = icons?[index];
                                return GestureDetector(
                                  onTap: () {
                                    value.setSelectedIcon(
                                        '${data?.id}', '${data?.icon}');
                                  },
                                  child: Container(
                                    margin: EdgeInsets.all(4),
                                    padding: EdgeInsets.all(14),
                                    decoration: BoxDecoration(
                                      color: AppColorData.dividerColor,
                                      border: value.selectedIconId == data?.id
                                          ? Border.all(
                                          color: AppColorData.blackBorderClr,
                                          width: 2)
                                          : null,
                                    ),
                                    child: CacheImageWidget(
                                        fit: BoxFit.fill,
                                        imageUrl: data?.icon ?? "",
                                  ),
                                ),
                                );
                              }),
                        ],
                      ),
                    ),
                  ),
              ],
            );
          }),
        ),
      ),
    );
  }
}
