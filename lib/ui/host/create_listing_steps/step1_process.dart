import 'dart:async';

import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/commonWidgets/widget/common_padding_alignment.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:provider/provider.dart';

import '../../user/login_and_signup/login_screen.dart';
import '../../user/search_location/auto_search_location.dart';

class SelectCategoryPage extends StatelessWidget {
  const SelectCategoryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer2<CreateListingViewModel, ProductListingViewModel>(
        builder: (context, value, productValue, child) {
      var data = productValue.categoryResponseModel?.data?.categories;

      if (data == null || data.isEmpty) {
        return Center(
          child: CommonText(
            text: "noDataFound",
            style: AppTextStyle.bodyTextStyle,
          ),
        );
      }

      return Column(
        children: [
          CommonText(
            text: "categoriesHead",
            style: AppTextStyle.headingStyle,
          ),
          GridView.builder(
              itemCount: data.length,
              physics: NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  mainAxisExtent: 110,
                  crossAxisSpacing: 20,
                  mainAxisSpacing: 20,
                  crossAxisCount: 2),
              itemBuilder: (context, index) {
                var categories = data[index];
                return GestureDetector(
                  onTap: () {
                    value.categoryId = categories.id!;
                    value.notify();
                  },
                  child: Container(
                    padding: EdgeInsets.symmetric(vertical: 14, horizontal: 14),
                    decoration: BoxDecoration(
                        color: value.categoryId == categories.id
                            ? AppColorData.dividerColor
                            : AppColorData.whiteClr,
                        border: Border.all(
                            color: value.categoryId == categories.id
                                ? AppColorData.blackClr
                                : AppColorData.boxBorder),
                        borderRadius: BorderRadius.circular(10)),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      spacing: 10,
                      children: [
                        isSvgImageUrl(
                                "${EndPointConstants.baseurl}/${categories.icon ?? ""}")
                            ? SvgPicture.network(
                                (categories.icon?.contains("https") ?? false)
                                    ? "${categories.icon ?? ""}"
                                    : "${EndPointConstants.baseurl}/${categories.icon ?? ""}",
                                height: 35)
                            : CacheImageWidget(
                                height: 40,
                                fit: BoxFit.cover,
                                errorBuilder: (context, url, error) {
                                  return const ErrorImage();
                                },
                                imageUrl: categories.icon ?? ""
                        ),
                        CommonText(
                          text: categories.category ?? "",
                          style: AppTextStyle.bodyTextStyle
                              .copyWith(fontWeight: FontWeight.bold),
                        )
                      ],
                    ),
                  ),
                );
              })
        ],
      );
    });
  }
}

class SelectPlacePage extends StatefulWidget {
  const SelectPlacePage({super.key});

  @override
  State<SelectPlacePage> createState() => _SelectPlacePageState();
}

class _SelectPlacePageState extends State<SelectPlacePage> {
  CreateListingViewModel? createListingViewModel;
  ProductListingViewModel? listingViewModel;

  @override
  void initState() {
    createListingViewModel =
        Provider.of<CreateListingViewModel>(context, listen: false);
    listingViewModel =
        Provider.of<ProductListingViewModel>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await listingViewModel!
          .fetchProperties(createListingViewModel!.categoryId);
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<CreateListingViewModel, ProductListingViewModel>(
        builder: (context, value, productValue, child) {
      var properties = productValue.propertiesResponseModel?.data?.properties;
      if (value.state == ViewState.busy) {
        return SizedBox(
          height: 250,
          child: Center(
            child: Loader(
              color: AppColorData.blackClr,
            ),
          ),
        );
      }
      if (properties == null || properties.isEmpty) {
        return Center(
          child: CommonText(
            text: "noDataAvailable",
            style: AppTextStyle.bodyTextStyle,
          ),
        );
      }
      return Column(
        children: [
          CommonText(
            text: "categoriesHead",
            style: AppTextStyle.headingStyle,
          ),
          ListView.builder(
              physics: NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              itemCount: properties.length,
              itemBuilder: (context, index) {
                var data = properties[index];
                return GestureDetector(
                  onTap: () {
                    value.propertyId = data.id!;
                    value.notify();
                  },
                  child: Container(
                    padding: EdgeInsets.symmetric(vertical: 24, horizontal: 14),
                    margin: EdgeInsets.symmetric(vertical: 14),
                    decoration: BoxDecoration(
                        color: value.propertyId == data.id
                            ? AppColorData.dividerColor
                            : AppColorData.whiteClr,
                        border: Border.all(
                            color: value.propertyId == data.id
                                ? AppColorData.blackClr
                                : AppColorData.boxBorder),
                        borderRadius: BorderRadius.circular(10)),
                    child: Row(
                      spacing: 14,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Flexible(
                          child: Column(
                            spacing: 6,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              CommonText(
                                text: "${data.property}",
                                style: AppTextStyle.bodyTextStyle
                                    .copyWith(fontWeight: FontWeight.bold),
                              ),
                              CommonText(
                                  text: data.desc,
                                  style: AppTextStyle.subBodyStyle.copyWith(
                                      color: AppColorData
                                          .subBodyTextHighlightClr)),
                            ],
                          ),
                        ),
                        CacheImageWidget(
                            height: 50,
                            fit: BoxFit.cover,
                            errorBuilder: (context, url, error) {
                              return const ErrorImage();
                            },
                            imageUrl:
                                data.icon ?? "")
                      ],
                    ),
                  ),
                );
              })
        ],
      );
    });
  }
}

class SelectLocationPage extends StatefulWidget {
  const SelectLocationPage({super.key});

  @override
  State<SelectLocationPage> createState() => _SelectLocationPageState();
}

class _SelectLocationPageState extends State<SelectLocationPage> {
  final Completer<GoogleMapController> _controller = Completer();
  LatLngBounds? _bounds;
  ProductListingViewModel? listingViewModel;

  @override
  void initState() {
    listingViewModel =
        Provider.of<ProductListingViewModel>(context, listen: false);
    listingViewModel?.addListener(_updateBounds);
    super.initState();
  }

  void _onMapCreated(GoogleMapController controller) {
    _controller.complete(controller);
    _updateBounds();
  }

  void _updateBounds() async {
    if (!mounted) return;
    if (listingViewModel?.addressLat == null ||
        listingViewModel?.addressLng == null) return;

    final latLng =
        LatLng(listingViewModel!.addressLat!, listingViewModel!.addressLng!);
    _bounds = LatLngBounds(southwest: latLng, northeast: latLng);

    final GoogleMapController controller = await _controller.future;

    controller.animateCamera(CameraUpdate.newLatLngZoom(latLng, 15));
  }

  @override
  void dispose() {
    listingViewModel?.removeListener(_updateBounds);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ProductListingViewModel>(
        builder: (context, productValue, child) {
      return Column(
        spacing: 20,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CommonText(
            text: "selectLocationHead",
            style: AppTextStyle.headingStyle,
          ),
          CommonText(
            text: "selectLocationSub",
            style: AppTextStyle.bodyTextStyle
                .copyWith(color: AppColorData.subBodyTextHighlightClr),
          ),
          Stack(
            alignment: Alignment.topCenter,
            children: [
              GoogleMapWidget(
                latitude: listingViewModel?.addressLat ?? 12.9796,
                longitude: listingViewModel?.addressLng ?? 80.2209,
                onMapCreated: _onMapCreated,
              ),
              GestureDetector(
                onTap: () {
                  showCustomModalBottomSheet(
                      title: "enterYourLocation",
                      showDivider: false,
                      context: context,
                      builder: (context) {
                        return enterLocationBottomSheet(productValue);
                      });
                },
                child: Container(
                    margin: EdgeInsets.all(14.0),
                    padding:
                        EdgeInsets.symmetric(horizontal: 14.0, vertical: 10.0),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(30),
                      color: AppColorData.whiteClr,
                    ),
                    child: Row(
                      spacing: 10,
                      children: [
                        Icon(Icons.location_on_rounded),
                        Flexible(
                          child: CommonText(
                            overflow: TextOverflow.ellipsis,
                            text: productValue.address?.isNotEmpty == true
                                ? productValue.address
                                : "enterYourAddress",
                            style: AppTextStyle.bodyTextStyle,
                          ),
                        )
                      ],
                    )),
              )
            ],
          )
        ],
      );
    });
  }

  Widget enterLocationBottomSheet(ProductListingViewModel productValue) {
    return CommonPadding(
      child: AddressSearchPage(
        from: "host",
        viewModel: productValue,
        fromController: productValue.addressController,
      ),
    );
  }
}

class GoogleMapWidget extends StatefulWidget {
  final double latitude;
  final double longitude;
  final Function(GoogleMapController)? onMapCreated;
  const GoogleMapWidget({
    super.key,
    required this.latitude,
    required this.longitude,
    this.onMapCreated,
  });

  @override
  State<GoogleMapWidget> createState() => _GoogleMapWidgetState();
}

class _GoogleMapWidgetState extends State<GoogleMapWidget> {
  final Completer<GoogleMapController> _controller = Completer();

  @override
  Widget build(BuildContext context) {
    final LatLng latLng = LatLng(widget.latitude, widget.longitude);

    return SizedBox(
      height: 500,
      child: GoogleMap(
        gestureRecognizers: {
          Factory<OneSequenceGestureRecognizer>(() => EagerGestureRecognizer())
        },
        initialCameraPosition: CameraPosition(target: latLng, zoom: 15),
        onMapCreated: (controller) {
          _controller.complete(controller);
          widget.onMapCreated?.call(controller);
        },
        markers: {
          Marker(
            markerId: const MarkerId('selected_location'),
            position: latLng,
          ),
        },
        circles: {
          Circle(
            circleId: const CircleId('selected_area'),
            center: latLng,
            radius: 500,
            fillColor: Colors.grey.withOpacity(0.2),
            strokeColor: Colors.grey,
            strokeWidth: 2,
          ),
        },
        myLocationEnabled: true,
        myLocationButtonEnabled: true,
      ),
    );
  }
}

class ConfirmLocationPage extends StatefulWidget {
  const ConfirmLocationPage({super.key});

  @override
  State<ConfirmLocationPage> createState() => _ConfirmLocationPageState();
}

class _ConfirmLocationPageState extends State<ConfirmLocationPage> {
  CreateListingViewModel? createListingViewModel;
  ProductListingViewModel? listingViewModel;

  @override
  void initState() {
    createListingViewModel =
        Provider.of<CreateListingViewModel>(context, listen: false);
    listingViewModel =
        Provider.of<ProductListingViewModel>(context, listen: false);
    createListingViewModel?.cityController.text = listingViewModel?.city ?? '';
    createListingViewModel?.stateController.text =
        listingViewModel?.addressState ?? '';
    createListingViewModel?.postCodeController.text =
        listingViewModel?.postalCode ?? '';
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<CreateListingViewModel>(builder: (context, value, child) {
      return Column(
        // spacing: 10,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CommonText(
            text: "confirmYourAddress",
            style: AppTextStyle.headingStyle,
          ),
          spacer(),
          CommonText(
            text: "selectLocationSub",
            style: AppTextStyle.bodyTextStyle
                .copyWith(color: AppColorData.subBodyTextHighlightClr),
          ),
          doubleSpacer(),
          GestureDetector(
            onTap: () {
              value.selectField("countryPicker");
              // countryPicker(value);
            },
            child: Container(
              height: 60,
              padding: horizontalPadding(horizontal: 10),
              decoration: BoxDecoration(
                border: Border.all(
                    color: value.selectedField == "countryPicker"
                        ? AppColorData.blackClr
                        : AppColorData.boxBorder),
              ),
              child: Row(
                children: [
                  Flexible(
                    child: Row(
                      children: [
                        CommonText(
                          text: listingViewModel?.country ?? '',
                          style: AppTextStyle.bodyTextStyle,
                          overflow: TextOverflow.ellipsis,
                        ),
                        SizedBox(
                          width: 10,
                        ),
                        // CommonText(
                        //   text: "+${value.selectedCountryCode?.phoneCode ?? '1'}",
                        //   style: AppTextStyle.bodyTextStyle
                        //       .copyWith(fontWeight: FontWeight.w400),
                        //   overflow: TextOverflow.ellipsis,
                        // ),
                      ],
                    ),
                  ),
                  // Icon(
                  //   Icons.keyboard_arrow_down_outlined,
                  //   size: 30,
                  // ),
                ],
              ),
            ),
          ),
          doubleSpacer(),
          addressTextField(
              showCursor: true,
              readOnly: false,
              value: value,
              controller: value.streetController,
              labelText: "streetAddress",
              fieldName: "street"),
          addressTextField(
              showCursor: true,
              readOnly: false,
              value: value,
              controller: value.landMarkController,
              labelText: "nearbyLandmark",
              fieldName: "landmark"),
          addressTextField(
              value: value,
              controller: value.cityController,
              labelText: "cityOrTown",
              fieldName: "city"),
          addressTextField(
              value: value,
              controller: value.postCodeController,
              labelText: "postCode",
              fieldName: "postCode"),
          addressTextField(
              value: value,
              controller: value.stateController,
              labelText: "stateOrTerritory",
              fieldName: "state",
              border: Border.all(
                  color: value.selectedField == "state"
                      ? AppColorData.blackBorderClr
                      : AppColorData.boxBorder)),
          doubleSpacer(),
          CustomDivider(height: 56),
          GoogleMapWidget(
            latitude: listingViewModel?.addressLat ?? 12.9796,
            longitude: listingViewModel?.addressLng ?? 80.2209,
          )
        ],
      );
    });
  }

  Widget addressTextField({
    required TextEditingController controller,
    required String labelText,
    required String fieldName,
    bool? showCursor,
    bool? readOnly,
    required CreateListingViewModel value,
    Border? border,
  }) {
    var isSelected = value.selectedField == fieldName;
    return CommonTextFromField(
      showCursor: showCursor ?? false,
      readOnly: readOnly ?? true,
      contentPadding: EdgeInsets.only(left: 14.0),
      border: border ??
          Border(
            top: BorderSide(
                color: isSelected
                    ? AppColorData.blackBorderClr
                    : AppColorData.boxBorder),
            right: BorderSide(
                color: isSelected
                    ? AppColorData.blackBorderClr
                    : AppColorData.boxBorder),
            left: BorderSide(
                color: isSelected
                    ? AppColorData.blackBorderClr
                    : AppColorData.boxBorder),
            bottom: BorderSide(
                color: isSelected
                    ? AppColorData.blackBorderClr
                    : AppColorData.transparent),
          ),
      borderRadius: BorderRadius.circular(0),
      controller: controller,
      labelText: tr(labelText),
      onTap: () {
        value.selectField(fieldName);
      },
      onChanged: (val) {
        value.notify();
      },
    );
  }
}

class AddGuestCount extends StatefulWidget {
  const AddGuestCount({super.key});

  @override
  State<AddGuestCount> createState() => _AddGuestCountState();
}

class _AddGuestCountState extends State<AddGuestCount> {
  @override
  Widget build(BuildContext context) {
    return Consumer<CreateListingViewModel>(builder: (context, value, child) {
      return Column(
        spacing: 10,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CommonText(
            text: "addGuestBedCountHead",
            style: AppTextStyle.headingStyle,
          ),
          CommonText(
            text: "addGuestBedCountSub",
            style: AppTextStyle.bodyTextStyle,
          ),
          ListView.builder(
            physics: NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            itemCount: value.getGuestBedDetails.length,
            itemBuilder: (context, index) {
              return Column(
                spacing: 10,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const SizedBox(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      CommonText(
                        text: value.getGuestBedDetails[index].title,
                        style: AppTextStyle.bodyTextStyle,
                      ),
                      Container(
                        width: MediaQuery.of(context).size.width * 0.4,
                        child: Row(
                          spacing: 20,
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            GestureDetector(
                              onTap: () {
                                value.decrementGuestCount(index);
                              },
                              child: CircleAvatar(
                                radius: 15,
                                backgroundColor: AppColorData.boxBorder,
                                child: CircleAvatar(
                                  radius: 13,
                                  backgroundColor:
                                      AppColorData.appSecondaryColor,
                                  child: Icon(
                                    Icons.remove,
                                    color:
                                        value.getGuestBedDetails[index].count >
                                                0
                                            ? AppColorData.appIconBlack
                                            : AppColorData.iconDimColor,
                                    size: 20,
                                  ),
                                ),
                              ),
                            ),
                            CommonText(
                                text:
                                    "${value.getGuestBedDetails[index].count.toString()}"),
                            GestureDetector(
                              onTap: () {
                                value.incrementGuestCount(index);
                              },
                              child: CircleAvatar(
                                radius: 15,
                                backgroundColor: AppColorData.boxBorder,
                                child: CircleAvatar(
                                  radius: 13,
                                  backgroundColor:
                                      AppColorData.appSecondaryColor,
                                  child: Icon(
                                    Icons.add,
                                    color: AppColorData.appIconBlack,
                                    size: 20,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  divider(),
                ],
              );
            },
          ),
        ],
      );
    });
  }
}

class AddBedroomCount extends StatefulWidget {
  const AddBedroomCount({super.key});

  @override
  State<AddBedroomCount> createState() => _AddBedroomCountState();
}

class _AddBedroomCountState extends State<AddBedroomCount> {
  CreateListingViewModel? createListingViewModel;

  @override
  void initState() {
    createListingViewModel =
        Provider.of<CreateListingViewModel>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      createListingViewModel?.initializeBedroomData();
      print("bedrooms count >> ${createListingViewModel?.bedrooms.length}");
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<CreateListingViewModel>(builder: (context, value, child) {
      return Column(
        spacing: 10,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CommonText(
            text: "addBedroomCountHead",
            style: AppTextStyle.headingStyle,
          ),
          CommonText(
            text: "youCanChangeItLater",
            style: AppTextStyle.bodyTextStyle,
          ),
          ...List.generate(value.bedrooms.length, (index) {
            var bedroom = value.bedrooms[index];

            return Column(
              children: [
                Theme(
                  data: Theme.of(context)
                      .copyWith(dividerColor: Colors.transparent),
                  child: ExpansionTile(
                    tilePadding: EdgeInsets.zero,
                    iconColor: AppColorData.appIconBlack,
                    title: CommonText(
                        text: bedroom.label,
                        style: AppTextStyle.bodyTextStyle
                            .copyWith(fontWeight: FontWeight.bold)),
                    children: bedroom.beds.map((bedDetail) {
                      return Column(
                        children: [
                          Padding(
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                CommonText(
                                    text: bedDetail.type,
                                    style: AppTextStyle.bodyTextStyle),
                                Row(
                                  children: [
                                    GestureDetector(
                                      onTap: () {
                                        if (bedDetail.count > 0) {
                                          bedDetail.count--;
                                          value.notify();
                                        }
                                      },
                                      child: CircleAvatar(
                                        radius: 15,
                                        backgroundColor: AppColorData.boxBorder,
                                        child: CircleAvatar(
                                          radius: 13,
                                          backgroundColor:
                                              AppColorData.appSecondaryColor,
                                          child: Icon(
                                            Icons.remove,
                                            color: AppColorData.appIconBlack,
                                            size: 20,
                                          ),
                                        ),
                                      ),
                                    ),
                                    Padding(
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 16),
                                        child: CommonText(
                                            text: bedDetail.count.toString())),
                                    GestureDetector(
                                      onTap: () {
                                        bedDetail.count++;
                                        value.notify();
                                      },
                                      child: CircleAvatar(
                                        radius: 15,
                                        backgroundColor: AppColorData.boxBorder,
                                        child: CircleAvatar(
                                          radius: 13,
                                          backgroundColor:
                                              AppColorData.appSecondaryColor,
                                          child: Icon(
                                            Icons.add,
                                            color: AppColorData.appIconBlack,
                                            size: 20,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          CustomDivider(),
                        ],
                      );
                    }).toList(),
                  ),
                ),
              ],
            );
          }),
        ],
      );
    });
  }
}
