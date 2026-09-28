import 'package:airstar_flutter/commonWidgets/widget/widget.dart';
import 'package:airstar_flutter/data/models/user/listing_response_model.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/user/listing_view_model.dart';
import 'package:airstar_flutter/viewModel/user/wishlist_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:get/route_manager.dart';
import 'package:latlong2/latlong.dart';

import '../../../commonWidgets/card_widget/product_card_widget.dart';
import '../../../routes/routes.dart';

class ProductMapView extends StatefulWidget {
  final List<ApprovedListing> listing;
  final ProductListingViewModel viewModel;
  final String? token;
  final WishlistViewModel wishlistViewModel;
  const ProductMapView(
      {super.key,
      required this.listing,
      required this.viewModel,
      this.token,
      required this.wishlistViewModel});

  @override
  State<ProductMapView> createState() => _ProductMapViewState();
}

class _ProductMapViewState extends State<ProductMapView> {
  final MapController _controller = MapController();
  List<Marker>? _markers = [];
  LatLngBounds? _bounds;

  ApprovedListing? listing;

  List<String> images = [];

  @override
  void initState() {
    super.initState();
    print("Map object :: ${widget.listing.length}");
    _updateMarkers();
  }

  @override
  void didUpdateWidget(ProductMapView oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.listing != oldWidget.listing) {
      print("Map object 1:: ${widget.listing.length}");
      _updateMarkers();
    }
  }

  void _updateMarkers() {
    setState(() {
      _markers = _createMarkers();
      _bounds = _calculateBounds();
    });
  }

  List<Marker> _createMarkers() {
    return widget.listing.map((l) {
      double lat = l.address!.coordinates!.first;
      double lng = l.address!.coordinates!.last;

      return Marker(
        height: 20,
        width: 50,
        alignment: Alignment.center,
        point: LatLng(lat, lng),
        child: InkWell(
            onTap: () {
              listing = l;
              images.clear();
              images.add(l.attachmentData?[0].image?.coverImage ?? "");
              images.addAll(l.attachmentData?[0].image?.groupImage
                      ?.map((e) => e.imagePath ?? "")
                      .toList() ??
                  []);
              setState(() {});
            },
            child: Center(
              child: Container(
                  padding: EdgeInsets.all(2),
                  decoration: BoxDecoration(
                      color: AppColorData.appSecondaryColor,
                      borderRadius: BorderRadius.circular(6)),
                  child: Text(
                    "${widget.viewModel.listingResponseModel!.data!.multipleCurrency!.toSymbol}${l.priceData?.pricing?.perDay}",
                  )),
            )),
      );
    }).toList();
  }

  LatLngBounds _calculateBounds() {
    if (widget.listing.isEmpty) {
      return LatLngBounds(LatLng(0, 0), LatLng(0, 0));
    }

    if (widget.listing.length == 1) {
      final lat = widget.listing.first.address!.coordinates!.first;
      final lng = widget.listing.first.address!.coordinates!.last;
      const offset = 0.40; // Approximately 5km offset
      return LatLngBounds(
        LatLng(lat - offset, lng - offset),
        LatLng(lat + offset, lng + offset),
      );
    }

    double minLat = double.infinity;
    double maxLat = -double.infinity;
    double minLng = double.infinity;
    double maxLng = -double.infinity;

    for (var l in widget.listing) {
      double lat = l.address!.coordinates!.first;
      double lng = l.address!.coordinates!.last;

      minLat = minLat < lat ? minLat : lat;
      maxLat = maxLat > lat ? maxLat : lat;
      minLng = minLng < lng ? minLng : lng;
      maxLng = maxLng > lng ? maxLng : lng;
    }

    // Add padding to the bounds
    const padding = 0.40; // Approximately 6km padding
    return LatLngBounds(
      LatLng(minLat - padding, minLng - padding),
      LatLng(maxLat + padding, maxLng + padding),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: FlutterMap(
            options: MapOptions(
              initialCameraFit: CameraFit.bounds(
                bounds: _bounds!,
                padding: EdgeInsets.all(40),
                maxZoom: 18,
              ),
              keepAlive: true,
              initialZoom: 18, // Initial zoom level
              minZoom: 2.0, // Set the minimum zoom level
              maxZoom: 18, // Set the maximum zoom level
              backgroundColor: Colors.transparent,
              interactionOptions: InteractionOptions(
                flags: InteractiveFlag.all & ~InteractiveFlag.rotate,
              ),
            ),
            mapController: _controller,
            children: [
              TileLayer(
                urlTemplate:
                    'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
              ),
              MarkerLayer(
                markers: _markers!,
              ),
            ],
          ),
        ),
        if (listing != null)
          Positioned(
              bottom: 70,
              left: 0,
              right: 0,
              child: GestureDetector(
                onTap: () {
                  Logger.appLogs(
                      "listing!.wishlist! :: ${listing!.wishlist ?? listing!.toString()}");
                  Get.toNamed(RouterName.productDetailScreen, arguments: {
                    RouterArguments.listingId: listing!.id!,
                    RouterArguments.images: images,
                    RouterArguments.wishlist: listing!.wishlist ?? false,
                  });
                },
                child: Container(
                  height: 130,
                  margin: EdgeInsets.symmetric(horizontal: 20),
                  decoration: BoxDecoration(
                      color: AppColorData.appSecondaryColor,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: commonBoxShadows()),
                  child: Row(
                    children: [
                      Stack(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.only(
                                    topLeft: Radius.circular(20),
                                    bottomLeft: Radius.circular(20))
                                .toLTRAware(context),
                            child: CacheImageWidget(
                                width: 130,
                                errorBuilder: (context, url, error) {
                                  return ErrorImage();
                                },
                                height: double.maxFinite,
                                fit: BoxFit.cover,
                                imageUrl: "${images.first}"),
                          ),
                          Positioned(
                              left: 10,
                              top: 10,
                              child: GestureDetector(
                                onTap: () {
                                  listing = null;
                                  setState(() {});
                                },
                                child: CircleAvatar(
                                    radius: 13,
                                    backgroundColor:
                                        AppColorData.appSecondaryColor,
                                    child: Icon(
                                      Icons.close,
                                      size: 15,
                                      color: AppColorData.blackClr,
                                    )),
                              )).toLTRAware(context)
                        ],
                      ),
                      Expanded(
                          child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              SizedBox(
                                width: 10,
                              ),
                              Expanded(
                                child: CommonText(
                                  text: listing!.propertyName,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              SizedBox(
                                width: 10,
                              ),
                              WishlistIconButton(
                                token: widget.token,
                                // data: listing!,
                                wishlist: listing?.wishlist,
                                listingId: listing?.id,
                                wishlistViewModel: widget.wishlistViewModel,
                                onSuccess: () {
                                  listing!.wishlist = !listing!.wishlist!;
                                  setState(() {});
                                },
                              )
                            ],
                          ),
                          Spacer(),
                          Padding(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 10),
                            child: Row(
                              children: [
                                CommonText(
                                  text:
                                      "${widget.viewModel.listingResponseModel!.data!.multipleCurrency!.toSymbol}${listing!.priceData?.pricing?.perDay ?? 0}",
                                  style: AppTextStyle.subBodyStyle,
                                ),
                                SizedBox(
                                  width: 5,
                                ),
                                CommonText(
                                  text: "night",
                                  style: AppTextStyle.subBodyStyle.copyWith(
                                      color: AppColorData.subBodyTextClr),
                                ),
                                Spacer(),
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
                                      text: listing!.totalRatingCount == 0
                                          ? tr("New")
                                          : listing!.totalRatingCount
                                              .toString(),
                                      style: AppTextStyle.subBodyHintTextStyle,
                                    ),
                                  ],
                                )
                              ],
                            ),
                          )
                        ],
                      ))
                    ],
                  ),
                ),
              ))
      ],
    );
  }
}
