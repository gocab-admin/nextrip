import 'dart:async';
import 'dart:ui' as ui;

import 'package:airstar_flutter/commonWidgets/toastWidget/app_toast.dart';
import 'package:airstar_flutter/data/models/user/amenities_response_model.dart';
import 'package:airstar_flutter/data/models/user/category_response_model.dart';
import 'package:airstar_flutter/data/models/user/listing_response_model.dart';
import 'package:airstar_flutter/data/models/user/properties_response_model.dart';
import 'package:airstar_flutter/data/repositories/user/listing_repo.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart' as GMap;

class ProductListingViewModel extends BaseViewModel {
  final ListingRepository _listingRepository = locator<ListingRepository>();
  final storage = locator<AppSecureStorage>();

  ListingResponseModel? _listingResponseModel;
  ListingResponseModel? _filterListingResponseModel;

  CategoryResponseModel? _categoryResponseModel;

  AmenitiesResponseModel? _amenitiesResponseModel;
  PropertiesResponseModel? _propertiesResponseModel;

  ListingResponseModel? get listingResponseModel => _listingResponseModel;
  ListingResponseModel? get filterListingResponseModel =>
      _filterListingResponseModel;

  CategoryResponseModel? get categoryResponseModel => _categoryResponseModel;

  AmenitiesResponseModel? get amenitiesResponseModel => _amenitiesResponseModel;

  PropertiesResponseModel? get propertiesResponseModel =>
      _propertiesResponseModel;

  //booking screen

  bool isExpandMap = false;

  GMap.BitmapDescriptor? mapIcon;
  Future loadMapIcon() async {
    // Load image from assets
    final ByteData data = await rootBundle.load(PNGAssets.markerIcon);
    final Uint8List imageData = data.buffer.asUint8List();

    // Resize the image
    final ui.Codec codec = await ui.instantiateImageCodec(
      imageData,
      targetWidth: 50,
      targetHeight: 60,
    );
    final ui.FrameInfo frameInfo = await codec.getNextFrame();
    final ui.Image resizedImage = frameInfo.image;

    // Convert the resized image to bytes
    final ByteData? byteData = await resizedImage.toByteData(
      format: ui.ImageByteFormat.png,
    );
    final Uint8List resizedImageData = byteData!.buffer.asUint8List();

    // Create BitmapDescriptor from resized image bytes
    mapIcon = GMap.BitmapDescriptor.bytes(resizedImageData);
  }

  //booking screen

  String categoryId = "";

  // TabController? tabController;

  int selectedBedroom = 1;

  bool isExpandDate = false;
  bool isExpandGuest = false;
  bool isExpandSearch = true;
  bool isSearching = false;
  DateTime? startDate;
  DateTime? endDate;

  List<GuestDetails> guestDetails = [
    GuestDetails(title: "adults", subtitle: "agesAbove", count: 0),
    GuestDetails(title: "children", subtitle: "age2", count: 0),
    GuestDetails(title: "pets", subtitle: "bringServiceAnimal", count: 0),
  ];

  // List<GuestDetails> get filteredGuestDetails {
  //   if (isAirstar()) {
  //     return guestDetails;
  //   } else {
  //     return guestDetails
  //         .where((guest) => guest.title != "children" && guest.title != "pets")
  //         .toList();
  //   }
  // }

  double? addressLat;
  double? addressLng;
  String? address;
  TextEditingController addressController = TextEditingController();
  String? country;
  String? addressState;
  String? city;
  String? postalCode;

  void toggleExpandDate() {
    isExpandDate = !isExpandDate;
    isExpandGuest = false;
    isExpandSearch = false;
    notify();
  }

  void toggleExpandGuest() {
    isExpandGuest = !isExpandGuest;
    isExpandDate = false;
    isExpandSearch = false;
    notify();
  }

  void toggleExpandSearch() {
    isExpandSearch = true;
    isExpandDate = false;
    isExpandGuest = false;
    notify();
  }

  void toggleisSearching() {
    isSearching = !isSearching;
    notify();
  }

  void setDates(DateTime? startDate, DateTime? endDate) {
    this.startDate = startDate;
    this.endDate = endDate;
    excludedListings.clear();
    notify();
  }

  int get totalNights {
    if (startDate != null && endDate != null) {
      return endDate!.difference(startDate!).inDays;
    }
    return 0;
  }

  Set<String> excludedListings = {};

  void excludeListingFromFilteredDates(String listingId) {
    excludedListings.add(listingId);
    notify();
  }

  bool isListingUsingFilteredDates(String listingId) {
    return !excludedListings.contains(listingId);
  }

  void incrementGuestCount(int index) {
    guestDetails[index].count++;
    notify();
  }

  void decrementGuestCount(int index) {
    if (guestDetails[index].count > 0) guestDetails[index].count--;
    notify();
  }

  int? getGuestCount(type) {
    switch (type) {
      case "adult":
        if (guestDetails[0].count > 0) {
          return guestDetails[0].count;
        }
      case "children":
        if (guestDetails[1].count > 0) {
          return guestDetails[1].count;
        }
      case "pet":
        if (guestDetails[2].count > 0) {
          return guestDetails[2].count;
        }
    }
    return null;
  }

  void clearAddress() {
    addressLat = null;
    addressLng = null;
    address = null;
    addressController.clear();
    notify();
  }

  void clearAll() {
    startDate = null;
    endDate = null;
    clearAddress();
    for (var g in guestDetails) {
      g.count = 0;
    }
    resetPagination();
    notify();
  }

  bool isDataCleared() {
    bool guestCountReset = guestDetails.every((e) => e.count == 0);
    if (startDate == null &&
        endDate == null &&
        address == null &&
        addressLat == null &&
        addressLng == null &&
        addressController.text.isEmpty &&
        guestCountReset) {
      return true;
    }

    return false;
  }

  String getGuestCountText() {
    int totalGuests = 0;
    for (var g in guestDetails) {
      if (g.title != "Pets") totalGuests += g.count;
    }
    // if(isAirspace()) {
    //   return totalGuests > 0 ? "$totalGuests ${tr("vehicles")}" : tr("addVehicles");
    // }
    return totalGuests > 0 ? "$totalGuests ${tr("guests")}" : tr("addGuest");
  }

  void updateSelectedBedroom(int value) {
    selectedBedroom = value;
    notify();
  }

  int? selectedPropertyIndex;

  // RangeValues? priceRangeValues;
  bool? isPriceRangeEdited = false;

  List<dynamic> beds = List.generate(9, (index) => index == 0 ? "Any" : index);
  List<dynamic> bedrooms = List.generate(
    9,
    (index) => index == 0 ? "Any" : index,
  );
  List<dynamic> bathrooms = List.generate(
    9,
    (index) => index == 0 ? "Any" : index,
  );

  bool showMore = false;

  int currentBedIndex = 0;
  int currentBathroomIndex = 0;
  int currentBedroomIndex = 0;
  bool isFiltercleared = false;

  List selectedAmenities = [];

  setFilters() {
    setState(ViewState.busy);
    // resetPriceRange();
    resetPagination();

    _listingResponseModel = filterListingResponseModel;
    notify();
    setState(ViewState.success);
  }

  setFilterListing() {
    if (listingResponseModel != null) {
      _filterListingResponseModel = ListingResponseModel.fromJson(
        listingResponseModel!.toJson(),
      );
    }
    // _filterListingResponseModel = listingResponseModel;
  }

  void clearFilters() {
    selectedPropertyIndex = null;
    currentBathroomIndex = 0;
    currentBedroomIndex = 0;
    currentBedIndex = 0;
    showMore = false;
    isPriceRangeEdited = false;
    selectedAmenities.clear();
    for (var a in amenitiesResponseModel?.data?.amenities ?? []) {
      a.isChecked = false;
    }

    isFiltercleared = true;
    if (listingResponseModel != null) {
      _filterListingResponseModel = ListingResponseModel.fromJson(
        listingResponseModel!.toJson(),
      );
    }
    //  _filterListingResponseModel = listingResponseModel;
    notify();
    resetPagination();
    if (appliedFilters > 0) {
      fetchListing(categoryId: categoryId, loader: false).then((val) {
        if (listingResponseModel != null) {
          _filterListingResponseModel = ListingResponseModel.fromJson(
            listingResponseModel!.toJson(),
          );
        }
        // _filterListingResponseModel = listingResponseModel;
        notify();
      });
    }
    appliedFilters = 0;
    resetPriceRange();
    notify();
  }

  RangeValues? priceRangeValues;

  void resetPriceRange() {
    isPriceRangeEdited = false;

    final minPrice = listingResponseModel?.data?.defaultMinPrice ?? 0;
    final maxPrice = listingResponseModel?.data?.defaultMaxPrice ?? 0;

    // Ensure values are within valid range
    priceRangeValues = RangeValues(minPrice.toDouble(), maxPrice.toDouble());
    notify();
  }

  void updatePriceRangeValues(RangeValues newValues) {
    priceRangeValues = newValues;
    isFiltercleared = false;
    notify();
  }

  int getMinPrice() {
    if (!isFiltercleared) {
      return priceRangeValues?.start.toInt() ?? 0;
    }
    return 0;
  }

  int getMaxPrice() {
    if (!isFiltercleared) {
      return priceRangeValues?.end.toInt() ?? 0;
    }
    return 0;
  }

  int? getBedroomCount() {
    if (bedrooms[currentBedroomIndex] == "Any") {
      return null;
    }
    return bedrooms[currentBedroomIndex];
  }

  int? getBathroomCount() {
    if (bathrooms[currentBathroomIndex] == "Any") {
      return null;
    }
    return bathrooms[currentBathroomIndex];
  }

  int? getBedCount() {
    if (beds[currentBedIndex] == "Any") {
      return null;
    }
    return beds[currentBedIndex];
  }

  void toggleProperties(int index) {
    selectedPropertyIndex = index;
    fetchListing(categoryId: categoryId, filter: true);

    notify();
  }

  void toggleAmenities(int index, bool newValue, bool user) {
    print("index :: $index :: newValue :: $newValue");
    amenitiesResponseModel!.data!.amenities![index].isChecked = newValue;
    if (newValue) {
      selectedAmenities.add(amenitiesResponseModel!.data!.amenities![index]);
    } else {
      selectedAmenities.removeWhere(
        (amenity) =>
            amenity.id == amenitiesResponseModel!.data!.amenities![index].id,
      );
    }

    Logger.appLogs(
      "selectedAmenities.map((e) => e.name).toList() :: ${selectedAmenities.map((e) => e.name).toList()}",
    );

    if (user == true) {
      fetchListing(categoryId: categoryId, filter: true);
    }

    notify();
  }

  void toggleShowMore() {
    showMore = !showMore;
    notify();
  }

  void updateCurrentBedroomIndex(index) {
    currentBedroomIndex = index;
    fetchListing(categoryId: categoryId, filter: true);
    notify();
  }

  void updateCurrentBathroomIndex(index) {
    currentBathroomIndex = index;
    fetchListing(categoryId: categoryId, filter: true);

    notify();
  }

  void updateCurrentBedIndex(index) {
    currentBedIndex = index;
    fetchListing(categoryId: categoryId, filter: true);

    notify();
  }

  List getAmenities() {
    var amenities = [];
    for (var a in amenitiesResponseModel?.data?.amenities ?? []) {
      if (a.isChecked!) {
        amenities.add(a.id);
      }
    }
    return amenities;
  }

  String? getProperty() {
    if (selectedPropertyIndex != null) {
      return propertiesResponseModel
              ?.data
              ?.properties?[selectedPropertyIndex!]
              .id ??
          null;
    }
    return null;
  }

  calculateAppliedFilters() {
    appliedFilters = 0;
    if (getProperty() != null) {
      appliedFilters++;
    }
    if (getBedroomCount() != null) {
      appliedFilters++;
    }
    if (getBathroomCount() != null) {
      appliedFilters++;
    }
    if (getAmenities().isNotEmpty) {
      appliedFilters++;
    }
    /*if (getMinPrice() != 0 || getMaxPrice() != 0) {
      appliedFilters++;
    }*/
    if (isPriceRangeEdited == true) {
      appliedFilters++;
    }
    // notify();
  }

  //api

  int listingPage = 2;
  bool loadPaginatedListing = true;

  int appliedFilters = 0;

  resetPagination() {
    listingPage = 2;
    loadPaginatedListing = true;
  }

  void updateHomePageWishlistStatus(String listingId, bool wishlistStatus) {
    if (listingResponseModel?.data?.approvedListing != null) {
      for (var listing in listingResponseModel!.data!.approvedListing!) {
        if (listing.id == listingId) {
          listing.wishlist = wishlistStatus;
        }
      }
      notify();
    }
  }

  Timer? _debounce;

  void debounceFetchListing({
    required String categoryId,
    bool filter = false,
    Duration duration = const Duration(milliseconds: 300),
  }) {
    _debounce?.cancel(); // Cancel previous debounce if still running
    _debounce = Timer(duration, () {
      fetchListing(categoryId: categoryId, filter: filter);
    });
  }

  // Map<String, List<Amenity>> privilegeAmenities = {};
  //
  // List<Amenity>? getAmenitiesForPrivilege(String? privilegeId) => privilegeAmenities[privilegeId];

  //  List<String> selectedAmenitiesId = [];
  //
  // bool isAmenitySelected(String id) => selectedAmenitiesId.contains(id);
  //
  // void toggleAmenitiesSelection(String id) {
  //   if(selectedAmenitiesId.contains(id)) {
  //     selectedAmenitiesId.remove(id);
  //   } else {
  //     selectedAmenitiesId.add(id);
  //   }
  //   notify();
  // }

  Map<String, List<Amenity>> privilegeAmenities = {};

  List<Amenity>? getAmenitiesForPrivilege(String? privilegeId) =>
      privilegeAmenities[privilegeId];

  List<String> selectedAmenitiesId = [];

  bool isAmenitySelected(String id) => selectedAmenitiesId.contains(id);

  void toggleAmenitiesSelection(String id) {
    if (selectedAmenitiesId.contains(id)) {
      selectedAmenitiesId.remove(id);
    } else {
      selectedAmenitiesId.add(id);
    }
    notifyListeners();
  }

  Future<ListingResponseModel?> fetchListing({
    required String categoryId,
    bool filter = false,
    bool addFilterListing = false,
    bool isPaginated = false,
    bool loader = true,
  }) async {
    if (!filter && loader && !isPaginated) {
      setState(ViewState.secondaryLoader);
    }

    if (isPaginated || filter) {
      setState(ViewState.tertiaryLoader);
    }

    try {
      String userid = await PreferenceHelper.getString(PrefConstant.userId);
      String savedCurrencyCode =
          await storage.readSecureData(PrefConstant.currentCurrency) ?? "";

      var params = {
        'currency': savedCurrencyCode,
        '_page': isPaginated ? listingPage : 1,
        '_limit': '20',
        'propertyCategory': categoryId,
        'userId': userid,
        if (addressLat != null) 'lat': addressLat,
        if (addressLng != null) 'lng': addressLng,
        if (startDate != null) 'startDate': startDate,
        if (endDate != null) 'endDate': endDate,
        if (getGuestCount("adult") != null) 'adult': getGuestCount("adult"),
        if (getGuestCount("children") != null)
          'children': getGuestCount("children"),
        if (getGuestCount("pet") != null) 'pet': getGuestCount("pet"),
        if (getBedroomCount() != null) 'bedRoom': getBedroomCount(),
        if (getBathroomCount() != null) 'bathRoom': getBathroomCount(),
        // if (getBedCount() != null) 'bed': getBedCount(),
        if (getAmenities().isNotEmpty)
          'amenities': '[${getAmenities().join(',')}]',
        if (getMinPrice() != 0 && filter) 'minPrice': getMinPrice(),
        if (getMaxPrice() != 0 && filter) 'maxPrice': getMaxPrice(),
        if (getProperty() != null) 'propertyType': getProperty(),
      };

      var data = await _listingRepository.fetchListing(queryParameters: params);

      if (data != null) {
        if (isPaginated) {
          List<ApprovedListing> newListing = data.data?.approvedListing ?? [];
          List<ApprovedListing> existingListing =
              _listingResponseModel?.data?.approvedListing ?? [];
          if (newListing.isNotEmpty) {
            if (!existingListing.any(
              (e) => newListing.any((n) => e.id == n.id),
            )) {
              _listingResponseModel?.data?.approvedListing?.addAll(newListing);
              listingPage++;
            } else {
              ToastUtil.showMessage("No more listing found");
              loadPaginatedListing = false;
            }
          } else {
            ToastUtil.showMessage("No more listing found");
            loadPaginatedListing = false;
          }
        } else {
          if (!filter) {
            _listingResponseModel = data;

            if (addFilterListing) {
              _filterListingResponseModel = data;
            }
            if (data.data?.minPrice != null && data.data?.maxPrice != null) {
              priceRangeValues = RangeValues(
                data.data!.minPrice!.toDouble(),
                data.data!.maxPrice!.toDouble(),
              );
            }
          } else {
            _filterListingResponseModel = data;
          }
        }

        //Success State
        setState(ViewState.success);
      }
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<CategoryResponseModel?> fetchCategory() async {
    setState(ViewState.busy);

    try {
      var data = await _listingRepository.fetchCategory();

      if (data != null) {
        _categoryResponseModel = data;
        categoryId = data.data!.categories!.first.id!;
        await fetchListing(categoryId: categoryId, addFilterListing: true);
        //Success State
        setState(ViewState.success);
      } else {
        setState(ViewState.idle);
      }
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);

      setState(ViewState.idle);
    }
    return null;
  }

  Future<AmenitiesResponseModel?> fetchAmenities({String? privilegeId}) async {
    setState(ViewState.busy);
    try {
      var data = await _listingRepository.fetchAmenities(
        privilegeId: privilegeId,
      );
      if (data != null) {
        _amenitiesResponseModel = data;
        if (privilegeId != null) {
          privilegeAmenities[privilegeId] = data.data?.amenities ?? [];
        }
        setState(ViewState.success);
      }
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<PropertiesResponseModel?> fetchProperties(String catergoryId) async {
    setState(ViewState.busy);
    try {
      var data = await _listingRepository.fetchProperties(catergoryId);
      if (data != null) {
        _propertiesResponseModel = data;
        setState(ViewState.success);
      }
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  int selectedIndex = 0;
  void onTextTap(int index) {
    selectedIndex = index;
    notify();
  }
}

class GuestDetails {
  GuestDetails({
    required this.title,
    required this.subtitle,
    required this.count,
  });

  String title;
  String subtitle;
  int count;
}
