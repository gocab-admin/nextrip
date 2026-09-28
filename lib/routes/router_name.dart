import 'package:airstar_flutter/data/models/user/user_response_model.dart';
import '../data/models/user/listing_detail_response_model.dart';
import 'package:airstar_flutter/data/models/user/trip_response_model.dart';

class RouterName {
  RouterName._();
  static const String splash = '/';
  static const String dashBoard = '/dashBoard';
  static const String loginScreen = '/loginScreen';
  static const String passwordVerifyScreen = '/passwordVerifyScreen';
  static const String otpVerifyScreen = '/otpVerifyScreen';
  static const String registerScreen = '/registerScreen';
  static const String searchBarScreen = '/searchBarScreen';
  static const String bookingScreen = '/bookingScreen';
  static const String checkAvailabilityScreen = '/checkAvailabilityScreen';
  static const String reservationScreen = '/reservationScreen';
  static const String chatScreen = '/chatScreen';
  static const String meetHostViewScreen = '/meetHostViewScreen';
  static const String productDetailScreen = '/productDetailScreen';
  static const String loginAndSecurityScreen = '/loginAndSecurityScreen';
  static const String notificationScreen = '/notificationScreen';
  static const String personalInfoScreen = '/personalInfoScreen';
  static const String profileViewScreen = '/profileViewScreen';
  static const String selectLanguageScreen = '/selectLanguageScreen';
  static const String bookingHistoryScreen = '/bookingHistoryScreen';
  static const String tripDetailScreen = '/tripDetailScreen';
  static const String wishlistCollection = '/wishlistCollection';
  static const String currencyScreen = '/currencyScreen';

  // Host
  static const String hostDashboard = '/hostDashboard';
  static const String getSteps = '/getSteps';
  static const String listingIntroScreen = '/listingIntroScreen';
  static const String listingPage = '/listingPage';
  static const String listingDetailPage = '/listingDetailPage';
  static const String insightsPage = '/insightsPage';
  static const String hostReservationPage = '/hostReservationPage';
  static const String reserveDetailPage = '/reserveDetailPage';


}

class RouterArguments{
  RouterArguments._();
  static const String token = 'token';
  static const String index = 'index';
  static const String isMain = 'isMain';
  static const String code = 'code';
  static const String mobileNumber = 'mobileNumber';
  static const String email = 'email';
  static const String listingId = 'listingId';
  static const String priceText = 'priceText';
  static  ListingDetailResponseModel? model;
  static const String detailModel = 'detailModel';
  static const String estimationModel = 'estimationModel';
  static const String bookingType = 'bookingType';
  static const bool isInboxPage = false;
  static const String profilePicture = 'profilePicture';
  static const String inboxListData = 'inboxListData';
  static const String hostDetailsData = 'hostDetailsData';
  static const bool wishlist = false;
//  static ApprovedListing? approvedListing;
  static const String approvedListing = "approvedListing";
  static const List<String> images = [];
  static UserResponseModel? userModel;
  static const String inBoXToDetails = 'inBoXToDetails';
  static const String status = 'status';
  static const String tripViewModel= 'tripViewModel';
  static BookingHistory? data;
  static const String collectionId = 'collectionId';
  static const String collectionName = 'collectionName';
  static const String from = 'from';
}