import 'dart:async';
import 'package:airstar_flutter/data/models/user/listing_detail_response_model.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';


class MapView extends StatefulWidget {
  final ListingDetailResponseModel listingDetailResponseModel;
  final BitmapDescriptor mapIcon;
  const MapView(
      {super.key,
      required this.listingDetailResponseModel,
      required this.mapIcon});

  @override
  State<MapView> createState() => _MapViewState();
}

class _MapViewState extends State<MapView> {
  CameraPosition? _initialPosition;

  final Set<Marker> _markers = {};

  @override
  void initState() {
    loadData();
    super.initState();
  }

  loadData() {
    var data = widget.listingDetailResponseModel.data?.listing?.first;
    LatLng latLng = LatLng(
      data?.address?.coordinates?.first ?? 0,
      data?.address?.coordinates?.last ?? 0,
    );

    Logger.appLogs("lat ${latLng.latitude}, lng ${latLng.longitude}");
    _loadCustomMarker(latLng, data);
  }

  Future<void> _loadCustomMarker(LatLng latLng, Listing? listing) async {
    _initialPosition = CameraPosition(
      target: latLng, // Your specific coordinates
      zoom: 10,
    );

    _addMarker(latLng, listing);

    // setState(() {});
  }

  void _addMarker(LatLng latLng, Listing? data) async {
    _markers.clear();
    await _markers.add(
      Marker(
        markerId: MarkerId('locationMarker'),
        position: latLng,
        icon: widget.mapIcon, // Set your custom icon here
        infoWindow: InfoWindow(
            title: tr("whereYouillBe"), snippet: "${data?.propertyName}"),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        CommonText(text: "whereYouillBe", style: AppTextStyle.titleStyle),
        SizedBox(
          height: 20,
        ),
        ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: Container(
            height: MediaQuery.of(context).size.height * 0.30,
            child: GoogleMap(
              initialCameraPosition: _initialPosition!,
              markers: _markers,
            ),
          ),
        ),
        SizedBox(
          height: 10,
        )
      ]),
    );
  }
}
