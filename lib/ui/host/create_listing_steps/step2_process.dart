import 'dart:ui';

import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/commonWidgets/widget/common_padding_alignment.dart';
import 'package:airstar_flutter/ui/host/create_listing_steps/subwidgets/custom_popup_menu.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/view_model.dart';
import 'package:dotted_border/dotted_border.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:provider/provider.dart';

import '../../user/dashBoard/searchBar.dart';

class SelectPrivileges extends StatefulWidget {
  const SelectPrivileges({super.key});

  @override
  State<SelectPrivileges> createState() => _SelectPrivilegesState();
}

class _SelectPrivilegesState extends State<SelectPrivileges> {
  CreateListingViewModel? createListingViewModel;

  @override
  void initState() {
    createListingViewModel =
        Provider.of<CreateListingViewModel>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      createListingViewModel?.fetchPrivileges();
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<CreateListingViewModel, ProductListingViewModel>(
        builder: (context, value, productValue, child) {
          var privileges = value.privilegesResponseModel?.data?.privilegeList;

          if(value.state == ViewState.busy) {
            return SizedBox(
              height: 250,
              child: Center(
                child: Loader(color: AppColorData.blackClr),
              ),
            );
          }

          return Column(
            children: [
              CommonText(
                  text: "addAmenitiesHead",
                  style: AppTextStyle.headingStyle
              ),
              ...List.generate(privileges?.length ?? 0, (index) {
                var data = privileges?[index];
                var amenities = productValue
                    .getAmenitiesForPrivilege((data?.id ?? "").toString());

                return Theme(
                  data: Theme.of(context)
                      .copyWith(dividerColor: AppColorData.transparent),
                  child: ExpansionTile(
                      onExpansionChanged: (isExpanded) {
                        if (isExpanded && data?.id != null) {
                          productValue.fetchAmenities(privilegeId: data?.id);
                        }
                      },
                      tilePadding: EdgeInsets.zero,
                      iconColor: AppColorData.blackClr,
                      title: CommonText(
                        text: data?.name,
                        style: AppTextStyle.bodyTextStyle,
                      ),
                      children: [
                        GridView.builder(
                            itemCount: amenities?.length ?? 0,
                            physics: NeverScrollableScrollPhysics(),
                            shrinkWrap: true,
                            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                                mainAxisExtent: 130,
                                crossAxisSpacing: 20,
                                mainAxisSpacing: 20,
                                crossAxisCount: 2
                            ),
                            itemBuilder: (context, index) {
                              var amenityData = amenities?[index];

                              bool isSelected =
                              productValue.isAmenitySelected(amenityData?.id ?? "");
                              return GestureDetector(
                                onTap: () => productValue
                                    .toggleAmenitiesSelection(amenityData?.id ?? ""),
                                child: Container(
                                  padding: EdgeInsets.symmetric(
                                      vertical: 14, horizontal: 14),
                                  decoration: BoxDecoration(
                                      color: isSelected
                                          ? AppColorData.greyColor.withOpacity(0.2)
                                          : AppColorData.whiteClr,
                                      border: Border.all(
                                          color: isSelected
                                              ? AppColorData.blackClr
                                              : AppColorData.boxBorder
                                      ),
                                      borderRadius: BorderRadius.circular(10)
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      isSvgImageUrl(
                                          "${EndPointConstants.baseurl}/${amenityData?.icon ?? ""}")
                                          ? SvgPicture.network(
                                          "${EndPointConstants.baseurl}/${amenityData?.icon ?? ""}",
                                          height: 35)
                                          : CacheImageWidget(
                                          height: 40,
                                          fit: BoxFit.cover,
                                          errorBuilder: (context, url, error) {
                                            return const ErrorImage(
                                              isSquare: false,
                                            );
                                          },
                                          imageUrl: amenityData?.icon ?? ""),
                                      SizedBox(height: 12),
                                      CommonText(
                                        text: amenityData?.name,
                                        style: AppTextStyle.bodyTextStyle
                                            .copyWith(fontWeight: FontWeight.bold),
                                      )
                                    ],
                                  ),
                                ),
                              );
                            })
                      ]),
                );
              })
            ],
          );
        });
  }
}

class SelectImagePage extends StatefulWidget {
  const SelectImagePage({super.key});

  @override
  State<SelectImagePage> createState() => _SelectImagePageState();
}

class _SelectImagePageState extends State<SelectImagePage> {
  CreateListingViewModel? createListingViewModel;

  @override
  void initState() {
    createListingViewModel =
        Provider.of<CreateListingViewModel>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      createListingViewModel?.fetchImages();
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<CreateListingViewModel, CommonViewModel>(builder: (context, value, commonModel,child) {
      return RefreshIndicator(
        onRefresh: () async {
          await value.fetchImages();
        },
        child: Column(
          spacing: 20,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CommonText(
                text: "selectImageHead", style: AppTextStyle.headingStyle),
            CommonText(
                text: "selectImageSub", style: AppTextStyle.bodyTextStyle),
            spacer(),
            if (value.selectedImages.isEmpty) ...[
              _buildDefaultImageWidget(onTap: () {
                value.selectedTempImages = List.from(value.selectedImages);
                showCustomModalBottomSheet(
                    title: "chooseFromGallery",
                    context: context,
                    builder: (context) => _uploadFromGallerySheet());
              })
            ] else ...[
             _buildCoverImage(value),
              _selectedImageView(value, commonModel),
            ]
          ],
        ),
      );
    });
  }

  Widget _buildDefaultImageWidget({required Function() onTap}) {
    return InkWell(
      onTap: onTap,
      child: DottedBorder(
        options: RectDottedBorderOptions(
          color: AppColorData.boxBorder,
        ),
        child: CommonPadding(
          child: SizedBox(
            width: double.infinity,
            child: Column(
              spacing: 10,
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Image.asset(PNGAssets.choose_image, height: 100),
                CommonText(
                    textAlign: TextAlign.center,
                    text: "chooseAtLeastFivePhotos",
                    style: AppTextStyle.titleStyle),
                CommonText(
                    textAlign: TextAlign.center,
                    text: "uploadFromUrDevice",
                    style: AppTextStyle.bodyTextStyle)
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCoverImage(CreateListingViewModel value) {

    if (value.selectedImages.isEmpty) {
      return _buildDefaultImageWidget(onTap: () {
        value.selectedTempImages = List.from(value.selectedImages);
        showCustomModalBottomSheet(
            title: "chooseFromGallery",
            context: context,
            builder: (context) => _uploadFromGallerySheet());
      });
    }

    final coverId = value.selectedImages.first;
    final coverImage = value.findImageById(coverId);

    // If image not found, show placeholder
    if (coverImage == null) {
      return _buildDefaultImageWidget(onTap: () {
        value.selectedTempImages = List.from(value.selectedImages);
        showCustomModalBottomSheet(
            title: "chooseFromGallery",
            context: context,
            builder: (context) => _uploadFromGallerySheet());
      });
    }

    return DottedBorder(
      options: RoundedRectDottedBorderOptions(
          radius: Radius.circular(6), color: AppColorData.boxBorder),
      child: Stack(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: CacheImageWidget(
                height: 220,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (context, url, error) {
                  return ErrorImage(isSquare: true);
                },
                imageUrl: coverImage.path ?? ''),
          ),
          Positioned(
              top: 10,
              right: 6,
              child: CircleAvatar(
                radius: 18,
                backgroundColor: AppColorData.boxBorder,
                child: CircleAvatar(
                  radius: 14,
                  backgroundColor: AppColorData.whiteClr,
                  child: CustomPopupMenu(
                    index: 0,
                    total: value.selectedImages.length,
                    onSelected: (action) {
                      value.handleSelectedImageAction(0, action);
                    },
                  ),
                ),
              ))
        ],
      ),
    );
  }

  Widget _selectedImageView(CreateListingViewModel value, CommonViewModel commonModel) {
    final remainingIds = value.selectedImages.skip(1).toList();
    final remainingImages = remainingIds
        .map((id) => value.findImageById(id))
        .where((img) => img != null)
        .toList();
    final maxImageCount = value.getMaxImageCount(commonModel);

    final totalImageLength = remainingImages.length + ((value.selectedImages.length < maxImageCount) ? 1 : 0);


    return GridView.builder(
        itemCount: totalImageLength,
        shrinkWrap: true,
        physics: NeverScrollableScrollPhysics(),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            childAspectRatio: 1,
            crossAxisCount: 2),
        itemBuilder: (context, index) {
          if (index == remainingImages.length &&
              value.selectedImages.length - 1 < maxImageCount) {
            return InkWell(
              onTap: () {
                value.selectedTempImages = List.from(value.selectedImages);
                showCustomModalBottomSheet(
                    title: "chooseFromGallery",
                    context: context,
                    builder: (context) => _uploadFromGallerySheet());
              },
              child: DottedBorder(
                  options: RoundedRectDottedBorderOptions(
                      radius: Radius.circular(8),
                      color: AppColorData.boxBorder),
                  child: Center(
                    child: Column(
                      spacing: 8,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.add,
                          size: 30,
                          color: AppColorData.appIconBlack,
                        ),
                        CommonText(
                          text: "addMore",
                          style: AppTextStyle.bodyTextStyle.copyWith(
                              color: AppColorData.subBodyTextHighlightClr),
                        )
                      ],
                    ),
                  )),
            );
          }
          final img = remainingImages[index];
          return DottedBorder(
            options: RoundedRectDottedBorderOptions(
                radius: Radius.circular(6), color: AppColorData.boxBorder),
            child: Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: CacheImageWidget(
                      height: 220,
                      width: double.infinity,
                      fit: BoxFit.cover,
                      errorBuilder: (context, url, error) {
                        return ErrorImage(isSquare: true);
                      },
                      imageUrl:
                      "${EndPointConstants.baseurl}/${img?.path ?? ''}"),
                ),
                Positioned(
                  top: 10,
                  right: 6,
                  child: CircleAvatar(
                    radius: 18,
                    backgroundColor: AppColorData.boxBorder,
                    child: CircleAvatar(
                      radius: 14,
                      backgroundColor: AppColorData.whiteClr,
                      child: CustomPopupMenu(
                        index: index + 1, // because 0 is cover image
                        total: value.selectedImages.length,
                        onSelected: (action) {
                          value.handleSelectedImageAction(index + 1, action);
                        },
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        });
  }

  Widget _uploadFromGallerySheet() {
    return CommonPadding(child:
        Consumer2<CreateListingViewModel, CommonViewModel>(
            builder: (context, value, commonModel, child) {
          if(value.state == ViewState.secondaryLoader) {
            return Center(
              child: Loader(color: AppColorData.blackClr,),
            );
          }
      final isImagesSelected = value.selectedTempImages
          .where((id) => !value.selectedImages.contains(id))
          .toList();
      return Column(
        spacing: 20,
        children: [
          _buildTabView(value),
          spacer(),
          Expanded(
              child: SingleChildScrollView(child: _buildTabListView(value, commonModel))),
          Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              padding: EdgeInsets.only(top: 14),
              decoration: BoxDecoration(
                  color: AppColorData.appSecondaryColor,
                  border: Border(
                      top: BorderSide(color: AppColorData.dividerColor))),
              child: Row(
                children: [
                  Flexible(
                    flex: 1,
                    child: CommonElevatedButton(
                        isTextBtn: true,
                        elevatedButtonNameColor: isImagesSelected.isNotEmpty
                            ? AppColorData.bodyTextColor
                            : AppColorData.disableButtonClr,
                        elevatedButtonName: "delete",
                        onTap: () {
                          if (isImagesSelected.isNotEmpty) {
                            value.deleteImages(isImagesSelected).then((val) {
                              if (val == true) {
                                value.fetchImages();
                              }
                            });
                          }
                        }),
                  ),
                  Spacer(),
                  Flexible(
                    flex: 1,
                    child: CommonElevatedButton(
                      elevatedButtonColor: isImagesSelected.isNotEmpty
                          ? AppColorData.blackButtonClr
                          : AppColorData.disableButtonClr,
                      elevatedButtonName: "upload",
                      onTap: () {
                        if (isImagesSelected.isNotEmpty) {
                          value.saveSelectedImages();
                          Navigator.pop(context);
                        }
                        // Close bottom sheet
                      },
                    ),
                  )
                ],
              ),
            ),
          )
        ],
      );
    }));
  }

  Row _buildTabView(CreateListingViewModel value) {
    return Row(
      children: List.generate(value.uploadImageType.length, (index) {
        return GestureDetector(
          onTap: () => value.selectUploadImageType(index),
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 18.0, vertical: 12.0),
            decoration: BoxDecoration(
                border: Border(
                    bottom: BorderSide(
                        color: value.selectedUploadImageType == index
                            ? AppColorData.appPrimaryColor
                            : AppColorData.transparent,
                        width: 4))),
            child: CommonText(
                text: value.uploadImageType[index],
                style: AppTextStyle.bodyTextStyle),
          ),
        );
      }),
    );
  }

  Widget _buildTabListView(CreateListingViewModel value, CommonViewModel commonModel) {
    var galleryImage = value.galleryResponseModel?.data?.galleryImage ?? [];

    if(value.selectedUploadImageType == 0) {
       return _buildDefaultImageWidget(onTap: () => value.pickImage());
    }

    if(galleryImage.isEmpty) {
       return _buildDefaultGalleryWidget(onTap: () {
         value.selectUploadImageType(0);
       });
    }

    return  GridView.builder(
            itemCount: galleryImage.length ?? 0,
            physics: NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisSpacing: 20, mainAxisSpacing: 20, crossAxisCount: 2),
            itemBuilder: (context, index) {
              var data = galleryImage[index];
              var isTempSelected = value.selectedTempImages.contains(data.id);
              var isSelected = value.selectedImages.contains(data.id);

              var maxImageCount = value.getMaxImageCount(commonModel);

              return GestureDetector(
                onTap: () {
                  if (!isSelected) value.toggleSelectedImages(data.id ?? '', maxImageCount);
                },
                child: Stack(
                  children: [
                    Container(
                      height: 190,
                      width: double.maxFinite,
                      decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(10),
                          color: AppColorData.whiteClr,
                          border: isTempSelected || isSelected
                              ? Border.all(
                                  color: AppColorData.blackBorderClr, width: 2)
                              : null,
                          boxShadow: commonBoxShadows()),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: CacheImageWidget(
                            fit: BoxFit.cover,
                            errorBuilder: (context, url, error) {
                              return ErrorImage(isSquare: true);
                            },
                            imageUrl:
                                "${data.path ?? ''}"),
                      ),
                    ),
                    if (isTempSelected && !isSelected)
                      Positioned.fill(
                          child: ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: BackdropFilter(
                                filter:
                                    ImageFilter.blur(sigmaX: 0.5, sigmaY: 0.5),
                                child: Container(
                                  color: AppColorData.whiteClr.withOpacity(0.6),
                                ),
                              ))),
                    if (!isSelected)
                      Positioned(
                        top: 8,
                        right: 8,
                        child: Container(
                          padding: const EdgeInsets.all(2),
                          decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                  color: AppColorData.blackBorderClr,
                                  width: 2)),
                          child: Icon(
                            Icons.check,
                            color: isTempSelected
                                ? AppColorData.appIconBlack
                                : AppColorData.transparent,
                            size: 13,
                          ),
                        ),
                      ),
                  ],
                ),
              );
            });
  }

  Widget _buildDefaultGalleryWidget({required Function() onTap}) {
    return InkWell(
      onTap: onTap,
      child: DottedBorder(
        options: RectDottedBorderOptions(
          color: AppColorData.boxBorder,
        ),
        child: CommonPadding(
          child: SizedBox(
            width: double.infinity,
            child: Column(
              spacing: 10,
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Image.asset(PNGAssets.choose_image, height: 100),
                CommonText(
                    textAlign: TextAlign.center,
                    text: Strings.galleryIsEmpty,
                    style: AppTextStyle.titleStyle),
                CommonElevatedButton(
                  width: 100,
                  onTap: onTap,
                  elevatedButtonName : Strings.upload,
                ),
                const SizedBox(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class TitlePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<CreateListingViewModel>(builder: (context, value, child) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: 20.0,
        children: [
          CommonText(
            text: "letsGiveHouseTitle",
            style: AppTextStyle.headingStyle,
          ),
          CommonText(
            text: "shortTitlesWorkBest",
            style: AppTextStyle.bodyTextStyle,
          ),
          CommonTextFromField(
            controller: value.titleController,
            expands: true,
            maxLines: null,
            maxLength: 32,
            hintText: tr("enterTextHere"),
            textAlignVertical: TextAlignVertical.top,
            height: 120,
            contentPadding: EdgeInsets.all(14),
            border: Border.all(
                color: value.titleController.text.isNotEmpty
                    ? AppColorData.blackBorderClr
                    : AppColorData.boxBorder),
            onChanged: (val) {
              value.notify();
            },
          ),
        ],
      );
    });
  }
}

class DescriptionPage extends StatefulWidget {
  @override
  State<DescriptionPage> createState() => _DescriptionPageState();
}

class _DescriptionPageState extends State<DescriptionPage> {
  CreateListingViewModel? createListingViewModel;

  @override
  void initState() {
    createListingViewModel =
        Provider.of<CreateListingViewModel>(context, listen: false);
    createListingViewModel?.descController.text =
        '${createListingViewModel?.basicDetailsResponseModel?.data?.listing?.propertyDesc ?? ''}';

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: 20.0,
      children: [
        CommonText(
          text: "createDescription",
          style: AppTextStyle.headingStyle,
        ),
        CommonText(
          text: "shareWhatMakes",
          style: AppTextStyle.bodyTextStyle,
        ),
        CommonTextFromField(
          controller: createListingViewModel?.descController,
          height: 200,
          maxLength: 1000,
          textAlignVertical: TextAlignVertical.top,
          expands: true,
          maxLines: null,
          contentPadding: EdgeInsets.all(14),
          border: Border.all(color: AppColorData.blackBorderClr),
          onChanged: (val) {
            createListingViewModel?.notify();
          },
        ),
      ],
    );
  }
}