import 'package:airstar_flutter/data/models/host/cancel_policy_response_model.dart';
import 'package:airstar_flutter/data/models/host/host_reserve_response_model.dart';
import 'package:airstar_flutter/data/models/host/rules_icons_response_model.dart';
import 'package:airstar_flutter/data/models/host/today_menu_response_model.dart';
import 'package:airstar_flutter/data/repositories/host/host_listing_repo.dart';
import 'package:airstar_flutter/ui/host/bottom_bar_screens/calendar_page.dart';
import 'package:airstar_flutter/utils/commonFunctions/app_common_functions.dart';
import 'package:airstar_flutter/utils/config/config.dart';
import 'package:airstar_flutter/utils/constants/constants.dart';
import 'package:airstar_flutter/utils/exception/exception.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/user/listing_view_model.dart';
import 'package:flutter/cupertino.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

import '../../data/models/host/basic_details_response_model.dart';
import '../../data/models/host/calendar_response_model.dart';
import '../../data/models/host/host_listing_response_model.dart';
import '../../data/models/host/user_listings_response_model.dart';
import '../../data/models/user/users_listing_response_model.dart';
import '../../utils/constants/strings.dart';
import '../../utils/secureStorage/app_secure_storage.dart';
import '../../utils/shardHelper/preference_constant.dart';

class HostListingViewModel extends BaseViewModel {
  HostListingRepository _hostListingRepository =
  locator<HostListingRepository>();
  final storage = locator<AppSecureStorage>();

  TodayMenuResponseModel? _todayMenuResponseModel;
  UserListingsResponseModel? _userListingsResponseModel;
  HostReserveResponseModel? _hostReserveResponseModel;
  BasicDetailsResponseModel? _basicDetailsResponseModel;
  HostListingResponseModel? _hostListingResponseModel;
  CancelPolicyResponseModel? _cancelPolicyResponseModel;
  RulesIconsResponseModel? _rulesIconsResponseModel;
  CalendarResponseModel? _calendarResponseModel;

  TodayMenuResponseModel? get todayMenuResponseModel => _todayMenuResponseModel;

  UserListingsResponseModel? get userListingsResponseModel =>
      _userListingsResponseModel;

  HostReserveResponseModel? get hostReserveResponseModel =>
      _hostReserveResponseModel;

  BasicDetailsResponseModel? get basicDetailsResponseModel =>
      _basicDetailsResponseModel;

  HostListingResponseModel? get hostListingResponseModel =>
      _hostListingResponseModel;

  CancelPolicyResponseModel? get cancelPolicyResponseModel =>
      _cancelPolicyResponseModel;

  RulesIconsResponseModel? get rulesIconsResponseModel =>
      _rulesIconsResponseModel;

  CalendarResponseModel? get calendarResponseModel =>
      _calendarResponseModel;

  TextEditingController hostController = TextEditingController();
  TextEditingController searchController = TextEditingController();
  TextEditingController rulesTitleController = TextEditingController();
  TextEditingController rulesDescController = TextEditingController();

  bool showIconsGrid = false;
  String? selectedIconUrl;
  String? selectedIconId;
  bool isIconSelected = false;

  void toggleIcon() {
    showIconsGrid = !showIconsGrid;
    notify();
  }

  void setSelectedIcon(String id, String url) {
    selectedIconUrl = "$url";
    selectedIconId = id;
    isIconSelected = true;
    showIconsGrid = false;
    notify();
  }

  void clearSelectedIcon() {
    selectedIconId = null;
    selectedIconUrl = null;
    isIconSelected = false;
    notify();
  }

  String? selectedOption;

  void selectFilterOption(String title) {
    selectedOption = title;
    notify();
  }

  String? selectedListingId;
  String? selectedPropertyName;

  int? expandedIndex;

  void selectListing(String id, String name) {
    selectedListingId = id;
    selectedPropertyName = name;
    notify();
  }

  void setDefaultListing(List<ProviderListing> listings) {
    if (selectedListingId == null && listings.isNotEmpty) {
      selectedListingId = listings.first.id;
      selectedPropertyName = listings.first.propertyName;
      notify();
    }
  }

  void toggleExpansion(int index, bool isExpanded) {
    if (isExpanded) {
      expandedIndex = null;
    } else {
      expandedIndex = index;
    }
    notify();
  }

  bool isSearching = false;

  void toggleSearch() {
    isSearching = !isSearching;
    notify();
  }

  void clearSearchField() {
    searchController.clear();
    notify();
  }

  bool hasAmenitiesFilter = false;
  bool hasListingFilter = false;

  List<String> filterOptions = [
    "listed",
    "unListed",
    "inProgress",
    "inComplete"
  ];

  String? selectedListingField;

  void clearFilter() {
    selectedListingField = null;
    hasListingFilter = false;
    notify();
  }

  int selectedFilter = 0;

  List<String> listingDetailFilters = [
    "listingDetails",
    "priceAndAvailability",
    "policiesAndRules"
  ];

  void updateSelectedFilter(int index) {
    selectedFilter = index;
    notify();
  }

  String? savedCurrencySymbol;

  Future<void> loadSavedCurrencySymbol() async {
    savedCurrencySymbol =
    await storage.readSecureData(PrefConstant.currencySymbol);
    notify();
  }

  int? selectedPolicyId;
  String selectedPolicyField = Strings.nonRefundable; // for UI (title display)

  void updateSelectedPolicy(int id, String title) {
    selectedPolicyId = id;
    selectedPolicyField = title;
    notify();
  }

  void clearCancellationPolicyData() {
    selectedPolicyId = null;
    selectedPolicyField = Strings.nonRefundable;
    notify();
  }

  String? selectedReserveType;
  String? selectedReserveTitle;

  List<String> reserveList = [
    "requestHistory",
    "bookingHistory",
    "cancellationHistory",
    "currentTrips",
    "upcomingTrips"
  ];

  final Map<String, String> reserveType = {
    "requestHistory": "approval",
    "bookingHistory": "history",
    "cancellationHistory": "cancelled",
    "currentTrips": "current",
    "upcomingTrips": "upcomming",
  };

  List<String> approvalList = ["BOOKED", "CONFIRMED"];

  String selectedApprovalType = "BOOKED";

  void selectApprovalType(String approvalType) {
    selectedApprovalType = approvalType;
    notify();
  }

  void setDefaultReserveTitle() {
    if (selectedReserveTitle == null && reserveList.isNotEmpty) {
      selectedReserveTitle = reserveList[0];
      selectedReserveType = reserveType[selectedReserveTitle];
    }
  }

  void setReserveTitle(String title) {
    if (selectedReserveTitle == title) {
      return;
    }

    selectedReserveTitle = title;
    selectedReserveType = reserveType[title];
    fetchBooking(reserveTitle: selectedReserveType);
    notify();
  }

  //  calendar page fun work


  String? selectedCalendarListingId;
  String? selectedCalendarListingName;

  void selectCalendarListing(String id, String name) {
    selectedCalendarListingId = id;
    selectedCalendarListingName = name;
    notify();
  }

  Future<void> setDefaultCalendarListing(List<ProviderListing> listings) async {
    if (selectedCalendarListingId == null && listings.isNotEmpty) {
      selectedCalendarListingId = listings.first.id;
      selectedCalendarListingName = listings.first.propertyName;
      notify();
    }
  }

  CalendarController calendarController = CalendarController();
  List<DateTime> selectedDates = [];
  DateTime? selectedDate;
  DateTime? rangeStartDate;
  DateTime? rangeEndDate;
  Appointment? selectedAppointment;
  String? selectedSummary;
  String? selectedDescription;

  bool showCustomSettings = false;

  void toggleCustomSettings() {
    showCustomSettings = !showCustomSettings;
    notify();
  }

  void closeCustomSettings() {
    showCustomSettings = false;
    notify();
  }


  void selectDate(DateTime date) {

    if (selectedAppointment != null) {
      clearSelectedAppointment();
    }


    if(selectedDate != null && isSameDay(date, selectedDate!)) {
      selectedDate = null;
      notify();
      return ;
    }

    if(rangeStartDate != null && isSameDay(date, rangeStartDate!)) {
      // while starting a range, clear the previous selected range
      rangeStartDate = null;
      rangeEndDate = null;
      notify();
      return ;
    }

    if(rangeEndDate != null && isSameDay(date, rangeEndDate!)) {
      // it's the end of a range, clear the end
      rangeEndDate = null;
      notify();
      return ;
    }

    if(rangeStartDate != null && rangeEndDate != null && isDateInRange(date) && isRangeStart(date) && isRangeEnd(date)) {
      splitRange(date);
      notify();
      return ;
    }

    // start selecting dates
    if(selectedDate != null) {
      selectedDate = null;
    }

    if(rangeStartDate == null) {
      rangeStartDate = date;
      rangeEndDate = date;
    } else if (rangeEndDate == null || rangeStartDate == rangeEndDate) {
      if(date.isBefore(rangeStartDate!)) {
        rangeEndDate = rangeStartDate;
        rangeStartDate = date;
      } else {
        rangeEndDate = date;
      }
    } else {
      rangeStartDate = date;
      rangeEndDate = date;
    }
    updateAnimation();
    notify();
  }

  void splitRange(DateTime date) {
    final DateTime start = rangeStartDate!;
    final DateTime end = rangeEndDate!;

    final bool isStartBeforeEnd = start.isBefore(end);

    final DateTime actualStart = isStartBeforeEnd ? start : end;

    final DateTime actualEnd = isStartBeforeEnd ? end : start;

    if(date.isAfter(actualStart) && date.isBefore(actualEnd)) {
      rangeStartDate = actualStart;
      rangeEndDate = date.subtract(const Duration(days: 1));

      // to clear the select and to start fresh range

      rangeStartDate = date.add(const Duration(days: 1));
      rangeEndDate = actualEnd;

      // clear the selection when splitting
      rangeStartDate = null;
      rangeEndDate = null;
    }
  }

  bool isDateSelected(DateTime date) {
    return selectedDates.any((selectedDate) => selectedDate.isSameDate(date));
  }


  bool isDateInRange(DateTime date) {
    if(rangeStartDate != null && rangeEndDate != null) {
      final DateTime start = rangeStartDate!.isBefore(rangeEndDate!) ? rangeStartDate! : rangeEndDate!;
      final DateTime end = rangeStartDate!.isBefore(rangeEndDate!) ? rangeEndDate! : rangeStartDate!;

      return (date.isAfter(start.subtract(const Duration(days: 1))) || date.isSameDate(start)) && (date.isBefore(end.add(const Duration(days: 1))) || date.isSameDate(end));
    }
    return false;
  }

  bool isRangeStart(DateTime date) {
    return rangeStartDate != null && isSameDay(date, rangeStartDate!);
  }

  bool isRangeEnd(DateTime date) {
    return rangeEndDate != null && isSameDay(date, rangeEndDate!);
  }

  bool isSameDay(DateTime date1, DateTime date2) {
    return date1.year == date2.year &&
        date1.month == date2.month &&
        date1.day == date2.day;
  }

  // Check if any date is selected (single or range)
  bool get hasSelection {
    return selectedDate != null || (rangeStartDate != null && rangeEndDate != null) || selectedAppointment != null;
  }

  void clearSelectedDates() {
    rangeStartDate = null;
    rangeEndDate = null;
    selectedDate = null;
    clearSelectedAppointment();
    showCustomSettings = false;
    updateAnimation();
    notify();
  }

  void clearSelectedAppointment() {
    selectedAppointment = null;
    selectedSummary = null;
    selectedDescription = null;
    notify();
  }


  // to check the blocked or booked dated

  bool isBlockedOrBooked(DateTime date) {
    for(var item in _calendarResponseModel?.data ?? []) {
      final start = DateTime.parse(item.start);
      final end = DateTime.parse(item.end);

      if((date.isAfter(start.subtract(const Duration(days: 1))) && date.isBefore(end.add(const Duration(days: 1))))) {
        return true;
      }
    }
     return false;
  }

  // appointment container onTap
  void selectAppointment(Appointment appointment) {
    selectedAppointment = appointment;
    selectedSummary = appointment.notes ?? appointment.subject;
    selectedDescription = appointment.recurrenceId?.toString();
    updateAnimation();
    notify();
  }

  // Calendar page animation fun work

  late AnimationController animationController;
  late Animation<double> slideAnimation;
  late Animation<double> fadeAnimation;

  // Initialize animations
  void initializeAnimations(TickerProvider vsync) {
    animationController = AnimationController(
      vsync: vsync,
      duration: const Duration(seconds: 1),
    );

    slideAnimation = Tween<double>(
      begin: 100,
      end: 0,
    ).animate(CurvedAnimation(
      parent: animationController,
      curve: Curves.bounceInOut,
    ));

    fadeAnimation = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(CurvedAnimation(
      parent: animationController,
      curve: Curves.bounceIn,
    ));

    // Start animation if dates are already selected
    if (hasSelection) {
      animationController.forward();
    }
  }

  // Update animations based on selection changes
  void updateAnimation() {
    if (hasSelection) {
      animationController.forward();
    } else {
      animationController.reverse();
    }
    notify();
  }

  // Dispose animations
  void disposeAnimations() {
    animationController.dispose();
  }



  // Api's

  Future<TodayMenuResponseModel?> fetchTodayMenu() async {
    setState(ViewState.busy);
    try {
      var data = await _hostListingRepository.fetchTodayMenu();

      if (data != null) {
        _todayMenuResponseModel = data;
      }

      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }

    return null;
  }

  Future<UsersListingResponseModel?> fetchUsersListing(
      {String? search,
        String? status,
        ProductListingViewModel? productModel,
        String? list}) async {
    setState(ViewState.busy);
    try {
      var data = await _hostListingRepository.fetchUserListings(
          search: search,
          amenities: productModel?.getAmenities(),
          list: list ?? selectedListingField,
          status: status
      );

      if (data != null) {
        _userListingsResponseModel = data;
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<BasicDetailsResponseModel?> deleteListing(
      {required String listingId}) async {
    setState(ViewState.busy);
    try {
      var data =
      await _hostListingRepository.deleteListing(listingId: listingId);

      if (data != null) {
        _basicDetailsResponseModel = data;
        fetchUsersListing();
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<HostListingResponseModel?> fetchHostListing(String listingId) async {
    setState(ViewState.busy);
    try {
      var data =
      await _hostListingRepository.fetchHostListings(listingId: listingId);

      if (data != null) {
        _hostListingResponseModel = data;
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<bool?> addHostResponse(
      {required String hostResponse,
        required String reviewId,
        required String listingId}) async {
    setState(ViewState.busy);
    try {
      var data = await _hostListingRepository.addHostResponse(
          hostResponse: hostResponse, reviewId: reviewId, listingId: listingId);

      if (data != null) {
        return data;
      }

      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<HostReserveResponseModel?> fetchBooking(
      {String? reserveTitle, String? bookingStatus}) async {
    setState(ViewState.busy);
    try {
      var data = await _hostListingRepository.fetchBooking(
          reserveType: selectedReserveType,
          bookingStatus: selectedApprovalType.toLowerCase());
      if (data != null) {
        _hostReserveResponseModel = data;
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<bool?> confirmBooking(String bookingId, String reserveType) async {
    setState(ViewState.secondaryLoader);
    try {
      var data = await _hostListingRepository.confirmBooking(
          bookingId: bookingId, reserveType: reserveType);

      if (data != null) {
        return data;
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }

    return false;
  }

  Future<bool?> publishListing(String listingId) async {
    setState(ViewState.secondaryLoader);
    try {
      var data =
      await _hostListingRepository.publishListing(listingId: listingId);

      if (data != null) {
        return data;
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }

    return false;
  }

  Future<CancelPolicyResponseModel?> fetchCancelPolicy() async {
    setState(ViewState.busy);
    try {
      var data = await _hostListingRepository.fetchCancelPolicy();

      if (data != null) {
        _cancelPolicyResponseModel = data;
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<bool?> updateCancellationPolicy(
      {int? cancellationPolicyId, String? listingId}) async {
    setState(ViewState.secondaryLoader);
    try {
      var data = await _hostListingRepository.updateCancellationPolicy(
          cancellationPolicyId: cancellationPolicyId, listingId: listingId);

      if (data != null) {
        return data;
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return false;
  }

  Future<RulesIconsResponseModel?> fetchRulesIcons() async {
    setState(ViewState.busy);
    try {
      var data = await _hostListingRepository.fetchRulesIcons();

      if (data != null) {
        _rulesIconsResponseModel = data;
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<bool?> updateHouseRules({
    required String title,
    required String description,
    required String rules,
    //required int progressPercentage,
    required String listingId,
  }) async {
    setState(ViewState.busy);

    try {
      var data = await _hostListingRepository.updateHouseRules(
        listingId: listingId,
        title: title,
        description: description,
        rules: rules,
        //  progressPercentage: progressPercentage
      );

      if (data != null) {
        return data;
      }

      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }

    return false;
  }

  Future<CalendarResponseModel?> fetchCalendarRecords() async {
    setState(ViewState.busy);

    try{
      var data = await _hostListingRepository.fetchCalendarRecords();
      if(data != null) {
        _calendarResponseModel = data;
      }
      setState(ViewState.success);
    } on AppException catch(appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<bool?> updateBlockDates({required String listingId}) async {
    setState(ViewState.secondaryLoader);
    try {
      var data =
      await _hostListingRepository.updateBlockDates(
          listingId: listingId,
          startDate: rangeStartDate?.toString() ?? '',
          endDate: rangeEndDate?.toString() ?? '',
      );

      if (data != null) {
        return data;

      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }

    return false;
  }


  Future<bool?> deleteBlockDates({required String listingId}) async {
    setState(ViewState.secondaryLoader);
    try {
      var data =
      await _hostListingRepository.deleteBlockDates(
        listingId: listingId,
        dateId: '${selectedAppointment?.id}',
      );

      if (data != null) {
        return data;

      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }

    return false;
  }

}


