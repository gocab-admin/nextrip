import 'package:airstar_flutter/data/repositories/user/product_detail_repo.dart';
import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import 'package:syncfusion_flutter_datepicker/datepicker.dart';

import '../../data/models/guest_count_model/guest_count_models.dart';
import '../../data/models/user/estimation_response_model.dart';
import '../../data/models/user/listing_detail_response_model.dart';
import '../../data/models/user/review_response_model.dart';
import '../../data/models/user/users_listing_response_model.dart';
import '../../utils/utils.dart';
import '../base_view_model/base_view_model.dart';
import 'listing_view_model.dart';

enum GuestMode {
  Adult,
  Children,
  Pets,
}

class ProductDetailViewModel extends BaseViewModel {
  final storage = locator<AppSecureStorage>();

  final ProductDetailRepository _listingDetailRepository =
      locator<ProductDetailRepository>();
  ListingDetailResponseModel? _listingDetailResponseModel;
  EstimationResponseModel? _estimationResponseModel;
  ReviewResponseModel? _reviewResponseModel;
  UsersListingResponseModel? _usersListingResponseModel;

  ListingDetailResponseModel? get listingDetailResponseModel =>
      _listingDetailResponseModel;
  EstimationResponseModel? get estimationResponseModel =>
      _estimationResponseModel;
  ReviewResponseModel? get reviewResponseModel => _reviewResponseModel;
  UsersListingResponseModel? get usersListingResponseModel =>
      _usersListingResponseModel;

  bool currentCard = true;

  void updateCurrentCard() {
    currentCard = !currentCard;
    notify();
  }

  // int adult = 1;
  // int children = 0;
  // int pets = 0;

  bool isEstimationVisible = true;
  bool isPageLoader = false;

  DateTime limitedEndDate = DateTime.now().add(Duration(days: 365));
  DateTime selectedStartDate = DateTime.now();

  bool isExpandDatePicker = true;
  bool isExpandTimePicker = false;

  TimeOfDay checkIntime = TimeOfDay.now();
  TimeOfDay checkOuttime = TimeOfDay.now();
  bool isActivelySelecting = false;

  void toggleDatePicker() {
    isExpandDatePicker = true;
    isExpandTimePicker = false;
  }

  void toggleTimePicker({bool resetTime = true}) {
    isExpandTimePicker = true;
    isExpandDatePicker = false;
    if (resetTime) {
      checkIntime = TimeOfDay.now();
      checkOuttime = TimeOfDay.now();
    }

    notify();
  }

  Map<String, EstimationResponseModel> listingSelectedDates = {};
  clearSelectedDate({required String listingId}) {
    print("bauvbiadbvohob 2:: ${listingId}");
    listingSelectedDates.remove(listingId);
    notify();
  }

  void prepareRangePickerForListing(String listingId) {
    // Get the saved range for this listing
    final savedRange = listingSelectedDates[listingId]?.data?.estimation;
    if (savedRange != null) {
      // Update the controller with the saved range
      dateRangeController.selectedRange =
          PickerDateRange(savedRange.startDate, savedRange.endDate);
    } else {
      // Clear the controller if no saved range exists
      dateRangeController.selectedRange = null;
    }
    notify();
  }

  DateRangePickerController dateRangeController = DateRangePickerController();

  List<DateTime> getBlockedDates() {
    List<DateTime> blockedDates = [];

    var listing = listingDetailResponseModel?.data?.listing?.first;
    var priceData = listing?.priceData?.first;
    var blockedDatesList = priceData?.blockedDates;

    if (blockedDatesList == null || blockedDatesList.isEmpty) {
      return blockedDates; // Return empty list if null
    }

    for (var blockedDate in blockedDatesList) {
      if (blockedDate['start'] == null || blockedDate['end'] == null) continue;

      DateTime start = DateTime.parse(blockedDate['start']);
      DateTime end = DateTime.parse(blockedDate['end']);

      for (var date = start;
          date.isBefore(end.add(const Duration(days: 1)));
          date = date.add(const Duration(days: 1))) {
        blockedDates.add(DateTime(date.year, date.month, date.day));
      }
    }

    return blockedDates;
  }

  calculateRange(DateTime startdate, int days) {
    Logger.appLogs("days - $days");
    selectedStartDate = startdate;
    limitedEndDate = startdate.add(Duration(days: days));
    notify();
    limitedEndDate = DateTime.now().add(Duration(days: 365));
    selectedStartDate = DateTime.now();
  }

  void clearDates() {
    limitedEndDate = DateTime.now().add(Duration(days: 365));
    selectedStartDate = DateTime.now();
    dateRangeController = DateRangePickerController();
    isEstimationVisible = false;
  }

  int calculateHostingPeriod(DateTime date) {
    DateTime currentDate = DateTime.now();

    // Calculate the difference in years and months
    int yearDiff = currentDate.year - date.year;
    int monthDiff = currentDate.month - date.month;

    // Calculate the total difference in months
    int totalMonths = yearDiff * 12 + monthDiff;

    return totalMonths;
  }

  GuestCount buildGuestCountParams({
    required String listingId,
    ProductListingViewModel? listingModel,
    bool useListingModel = false,
  }) {
    if (useListingModel && listingModel != null) {
      return GuestCount(
        adult: listingModel.getGuestCount("adult") ?? 1,
        children: listingModel.getGuestCount("children") ?? 0,
        pets: listingModel.getGuestCount("pet") ?? 0,
      );
    } else {
      return listingGuestCounts[listingId] ?? GuestCount();
    }
  }

  // Replace with listing-specific guest counts
  Map<String, GuestCount> listingGuestCounts = {};

  int getGuestCount(String listingId, GuestMode guestType) {
    if (!listingGuestCounts.containsKey(listingId)) {
      listingGuestCounts[listingId] = GuestCount();
    }
    return listingGuestCounts[listingId]!.getByGuestMode(guestType);
  }

  void updateGuest({
    required String listingId,
    required int value,
    required GuestMode title,
  }) {
    // Initialize if not exists
    if (!listingGuestCounts.containsKey(listingId)) {
      listingGuestCounts[listingId] = GuestCount();
    }
    listingGuestCounts[listingId]!.updateGuest(title, value);
    notify();
  }

  // Updated resetGuest method with listingId parameter
  resetGuest(String listingId) {
    listingGuestCounts[listingId] = GuestCount();
    notify();
  }

  void resetEstimationResponseModel(String listingId) {
    _estimationResponseModel = EstimationResponseModel();
    resetGuest(listingId);
  }

  String convertToSlug(String text) {
    return text
        .toLowerCase()
        .replaceAll(RegExp(r'[^a-z0-9\s-]'), '')
        .replaceAll(RegExp(r'\s+'), '-')
        .replaceAll(RegExp(r'-+'), '-')
        .trim()
        .replaceAll(RegExp(r'-$'), '');
  }

  bool _isSharing = false;
  Future<void> shareFile(BuildContext context) async {
    if (_isSharing) return;
    _isSharing = true;
    notify();
    try {
      setState(ViewState.secondaryLoader);

      try {
        final box = context.findRenderObject() as RenderBox?;
        var cat = listingDetailResponseModel?.data?.listing?.first;
        String link =
            "${convertToSlug(cat?.propertyCategoryName ?? '')}/${convertToSlug(cat?.propertyName ?? '')}";
        String shareLink =
            "${EndPointConstants.linkShareUrl}${link}_${cat?.id}/";
        print("link :: $shareLink");
        Share.share(
          "$shareLink",
          subject: shareLink,
          sharePositionOrigin: box!.localToGlobal(Offset.zero) & box.size,
        );
      } finally {
        _isSharing = false;
        notify();
      }

      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
  }

  Future<ListingDetailResponseModel?> fetchListingDetail(
      {required String id,
      bool loader = true,
      Function()? successResFun}) async {
    if (loader) {
      setState(ViewState.busy);
    }

    try {
      String userid = await PreferenceHelper.getString(PrefConstant.userId);
      String savedCurrencyCode =
          await storage.readSecureData(PrefConstant.currentCurrency) ?? "";

      var data = await _listingDetailRepository.fetchListingDetail(
          id: id,
          queryParameters: {"userId": userid, "currency": savedCurrencyCode});

      if (data != null) {
        _listingDetailResponseModel = data;
        //Success State
        successResFun != null ? successResFun() : () {};
        setState(ViewState.success);
      } else {
        // Failure State
        setState(ViewState.idle);
      }
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      //Idle / Failure State
      setState(ViewState.idle);
    }
    return null;
  }

  Future<EstimationResponseModel?> fetchEstimation(
      {required String id,
      required String bookingType,
      required DateTime startDate,
      required DateTime endDate,
      int? adults,
      int? childrens,
      int? pet,
      required Function()? onSuccessRes,
      String? from}) async {
    if (from == "detail") {
      setState(ViewState.tertiaryLoader);
    } else {
      isPageLoader = true;
      setState(ViewState.secondaryLoader);
    }

    try {
      String savedCurrencyCode =
          await storage.readSecureData(PrefConstant.currentCurrency) ?? "";

      // Update listing-specific guest count
      GuestCount guestCount = GuestCount(
        adult: adults ?? getGuestCount(id, GuestMode.Adult),
        children: childrens ?? getGuestCount(id, GuestMode.Children),
        pets: pet ?? getGuestCount(id, GuestMode.Pets),
      );

      listingGuestCounts[id] = guestCount;

      var data = await _listingDetailRepository.fetchEstimation(
        currency: savedCurrencyCode,
        id: id,
        bookingType: bookingType,
        startDate: startDate,
        endDate: endDate,
        adults: guestCount.adult,
        children: guestCount.children,
        pets: guestCount.pets,
      );

      if (data != null) {
        _estimationResponseModel = data;
        listingSelectedDates[id] = data;
        onSuccessRes!();
        // saveSelectedDateRange(id, data);
        isPageLoader = false;
        setState(ViewState.success);
      } else {
        isPageLoader = false;
        setState(ViewState.idle);
      }
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      isPageLoader = false;
      setState(ViewState.idle);
    }
    return null;
  }

  Future<ReviewResponseModel?> fetchReviewsAndRating(
      {required String id}) async {
    setState(ViewState.busy);

    try {
      var data = await _listingDetailRepository.fetchReviewsAndRating(
        id: id,
      );

      if (data != null) {
        _reviewResponseModel = data;
        // setState(ViewState.secondaryLoader);
      }
      setState(ViewState.idle);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<UsersListingResponseModel?> fetchUsersListing(
      {Map<String, dynamic>? queryParameters, required String id}) async {
    setState(ViewState.busy);
    try {
      var data = await _listingDetailRepository.fetchUsersListing(id: id);
      if (data != null) {
        _usersListingResponseModel = data;
        setState(ViewState.success);
      }
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }
}
