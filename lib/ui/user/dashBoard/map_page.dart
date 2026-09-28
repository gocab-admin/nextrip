import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:airstar_flutter/utils/utils.dart';

class LoadMap extends StatefulWidget {
  const LoadMap({super.key});

  @override
  State<LoadMap> createState() => _LoadMapState();
}

class _LoadMapState extends State<LoadMap> {
  final Completer<GoogleMapController> _controller = Completer();

  static const CameraPosition _center =
      CameraPosition(target: LatLng(45.521563, -122.677433), zoom: 14);

  final List<Marker> _marker = [];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: AppColorData.appSecondaryColor,
        floatingActionButton: Container(
          width: 130,
          height: 45,
          child: FloatingActionButton.extended(
              onPressed: () {
                Navigator.pop(context);
              },
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30)),
              backgroundColor: AppColorData.blackButtonClr,
              label: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  CommonText(
                    text: Strings.showList,
                    style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w400,
                        fontFamily: 'CircularStd',
                        color: AppColorData.appSecondaryColor),
                  ),
                  Icon(
                    Icons.list,
                    color: AppColorData.appSecondaryColor,
                  )
                ],
              )),
        ),
        floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
        body: GoogleMap(
          mapType: MapType.normal,
          markers: Set<Marker>.of(_marker),
          onMapCreated: (GoogleMapController controller) {
            _controller.complete(controller);
          },
          initialCameraPosition: _center,
        ));
  }
}
