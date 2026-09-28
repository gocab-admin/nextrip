import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/ui/user/search_location/auto_search_model.dart';
import 'package:airstar_flutter/viewModel/user/listing_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:geocoding/geocoding.dart';
import 'package:get/get.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart' as loc;
import 'package:uuid/uuid.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/commonWidgets/widget/widget.dart';
import '../../../services/dio_client.dart';

class AddressSearchPage extends StatefulWidget {
  final ProductListingViewModel viewModel;

  final TextEditingController fromController;
  final String from;
  const AddressSearchPage(
      {super.key, required this.viewModel, required this.fromController, required this.from});

  @override
  State<AddressSearchPage> createState() => _AddressSearchPageState();
}

class _AddressSearchPageState extends State<AddressSearchPage> {
  String? _sessionToken;
  Uuid uuid = const Uuid();
  List<Prediction>? _placeList = [];
  String? address;
  bool isAddressEmpty = false;
  double? lat;
  double? long;
  bool isNavigate = false;
  loc.Location location = loc.Location();
  LatLng? result;
  late final VoidCallback _controllerListener;

  @override
  void initState() {
    if (widget.viewModel.address != null) {
      widget.fromController.text = widget.viewModel.address!;
    }
    _initControllerListener();
    // getCurrentLocation();
    super.initState();
  }

  void _initControllerListener() {
    _controllerListener = () => _onChanged(widget.fromController);
    widget.fromController.addListener(_controllerListener);
  }

  _onChanged(TextEditingController controller) {
    if (_sessionToken == null) {
      setState(() {
        _sessionToken = uuid.v4();
      });
    }
    getSuggestion(controller.text);
  }

  void getSuggestion(String input) async {
    if (widget.fromController.text.isNotEmpty) {
      final ApiClient client = ApiClient();
      String kplacesApiKey = AppConstant.gMapKey;
      //String type = '(regions)';
      String baseURL = EndPointConstants.googleMapAddressSearchBaseUrl;
      String request =
          '$baseURL?input=$input&key=$kplacesApiKey&sessiontoken=$_sessionToken';
      try {
        var response = await client.get(request);

        var model =
        AddressAutoSearchModel.fromJson(response as Map<String, dynamic>);
        final predictions = model.predictions;

        for (var i = 0; i < (predictions?.length ?? 0); i++) {
          String name = predictions?[i].description ?? '';
          print("name$i :: $name");
        }

        if (!mounted) return;
        setState(() {
          _placeList = predictions;
        });
      } catch(e) {
        print("Error in getSuggestion: $e");
      }

    }
  }

  @override
  void dispose() {
    widget.fromController.removeListener(_controllerListener);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return locationSheet();
  }

  locationSheet() {
    var isHost = widget.from == "host";
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[

        CommonTextFromField(
          onTap: () {
            // widget.viewModel.toggleisSearching();
            widget.viewModel.isExpandDate = false;
            widget.viewModel.isExpandGuest = false;
            setState(() {
              isAddressEmpty = false;
            });
          },
          //height: 50,
          border: Border.all(color: AppColorData.boxBorder),
          autofocus: true,
          borderRadius: BorderRadius.circular(isHost ? 30: 0),
          // prefixIcon:  SvgPicture.asset(SVGAssets.search,height: 20,width: 20),
          contentPadding:
           EdgeInsets.symmetric(vertical: 16, horizontal: 6),
          fillColor: AppColorData.appSecondaryColor,
          controller: widget.fromController,
          hintText: isHost ? tr("enterYourLocation"): tr("searchDestination"),
          // onChanged: ,
          // onSaved: _onChanged(widget.fromController),
          prefixIcon: Padding(
            padding:  EdgeInsets.only(left: isHost ? 14: 5, right: isHost ? 10 : 0),
            child: Icon(
              isHost ? Icons.location_on_rounded :
              Icons.search,
              color: AppColorData.appIconBlack,
              size: 22,
            ),
          ),
          suffixIcon: widget.fromController.text.isEmpty
              ? null
              : IconButton(
            icon: const Icon(Icons.cancel),
            onPressed: () {
              widget.fromController.clear();
              clearAddress();
              widget.viewModel.clearAddress();
            },
          ),
        ) ,
        const SizedBox(height: 10),
        Expanded(
          child: Padding(
              padding: horizontalPadding(horizontal: 0, vertical: 8),
              child: addressSuggestionWidget()),
        ),
      ],
    );
  }

  Widget addressSuggestionWidget() {
    return (isAddressEmpty == true)
        ? const SizedBox.shrink()
        : ListView.builder(
      physics: const AlwaysScrollableScrollPhysics(),
      // shrinkWrap: true,
      itemCount: _placeList?.length ?? 2,
      itemBuilder: (context, index) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            GestureDetector(
              onTap: () {
                addressSelectFun(index);
                if(widget.from == "host") {
                  Get.back();
                }
              },
              child: Row(
                children: [
                  Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        //  color: AppColorData.grey03.withOpacity(0.1),
                          color: AppColorData.locationBgClr,
                          borderRadius: BorderRadius.circular(10)),
                      //padding: EdgeInsets.all(6),
                      child: Icon(Icons.location_on_rounded)
                    // SvgPicture.asset(
                    //     SVGAssets.location,
                    //     height: 16,
                    //     width: 16,
                    //   )
                  ),
                  SizedBox(
                    width: 15,
                  ),
                  Expanded(
                    child: Container(
                      color: AppColorData.transparent,
                      child: CommonText(
                          text: _placeList?[index].description ?? "null",
                          style: TextStyle(
                              height: 1.4,
                              fontSize: 17,
                              fontWeight: FontWeight.w400,
                              color: AppColorData.subBodyTextClr)),
                    ),
                  ),
                ],
              ),
            ),
            doubleSpacer(),
          ],
        );
      },
    );
  }

  addressSelectFun(int index) async {
    address = _placeList?[index].description ?? "null";
    FocusManager.instance.primaryFocus?.unfocus();
    widget.fromController.text = address ?? '';
    result = await addressToLatLong(widget.fromController.text);
    print(
        "widget.fromController places :: ${_placeList?[index] ?? "null"} \n and result:: latlong :: $result");
    Logger.appLogs("lat ${result!.latitude}: lng ${result!.longitude}");
    widget.viewModel.addressLat = result!.latitude;
    widget.viewModel.addressLng = result!.longitude;
    widget.viewModel.address = address;

    // 🔍 Use geocoding to get full address details from lat/lng
    List<Placemark> placemarks = await placemarkFromCoordinates(
      result!.latitude,
      result!.longitude,
    );

    final Placemark place = placemarks.first;

    widget.viewModel.country = place.country ?? '';
    widget.viewModel.addressState = place.administrativeArea ?? '';
    widget.viewModel.city = place.locality ?? place.subAdministrativeArea ?? '';
    widget.viewModel.postalCode = place.postalCode ?? '';

    widget.viewModel.toggleExpandDate();
    widget.viewModel.toggleisSearching();

    clearAddress();
  }

  void clearAddress() {
    if (!mounted) return;
    setState(() {
      _placeList?.clear();
      isAddressEmpty = true;
    });
  }

  void getCurrentLocation() async {
    isNavigate = await requestPermission();
    if (!mounted) return;
    setState(() {
      location.getLocation().then(
            (location) {
          lat = location.latitude;
          long = location.longitude;
          print(
              "object permission :: ${location.latitude} is lat :: $lat is long:: $long");
        },
      );
    });
  }
}
