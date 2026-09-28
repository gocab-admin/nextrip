import 'dart:convert';
import 'dart:developer';

import 'package:airstar_flutter/data/models/user/listing_response_model.dart';
import 'package:airstar_flutter/ui/user/Product/product_detail/meet_host_detail_screen.dart';
import 'package:airstar_flutter/ui/user/Profile/login_and_security_screen.dart';
import 'package:airstar_flutter/ui/user/dashBoard/dashboard.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:get/get.dart';

import '../data/models/user/chat_list_response_model.dart';
import '../data/models/user/estimation_response_model.dart';
import '../data/models/user/listing_detail_response_model.dart';
import '../ui/host/bottom_bar_screens/host_dashboard.dart';
import '../ui/host/bottom_bar_screens/host_product/listing_detail_page.dart';
import '../ui/host/bottom_bar_screens/listings_page.dart';
import '../ui/host/create_listing_steps/create_listing_steps.dart';
import '../ui/host/create_listing_steps/get_started_screen.dart';
import '../ui/host/host_profile/host_reservation_page.dart';
import '../ui/host/host_profile/insights_page.dart';
import '../ui/host/host_profile/reserve_detail_page.dart';
import '../ui/splash/splash.dart';
import '../ui/user/Product/product_detail/product_detail_screen.dart';
import '../ui/user/Profile/currency_screen.dart';
import '../ui/user/Profile/notification_screen.dart';
import '../ui/user/Profile/personal_info_screen.dart';
import '../ui/user/Profile/profile_view_screen.dart';
import '../ui/user/Profile/select_language_screen.dart';
import '../ui/user/checkAvailability/booking_screen.dart';
import '../ui/user/checkAvailability/check_availability_screen.dart';
import '../ui/user/checkAvailability/reservation_screen.dart';
import '../ui/user/login_and_signup/login_screen.dart';
import '../ui/user/login_and_signup/otp_verify_screen.dart';
import '../ui/user/login_and_signup/password_verify_screen.dart';
import '../ui/user/login_and_signup/register_screen.dart';
import '../ui/user/message/chat_screen.dart';
import '../ui/user/trips/booking_history.dart';
import '../ui/user/trips/trip_detail.dart';
import '../ui/user/wishlist/wishlist_collection.dart';
import 'routes.dart';

class GetXRouter {
  GetXRouter._();
  static List<GetPage> getPages = [
    GetPage(name: RouterName.splash, page: () => Splash()),
    GetPage(
      name: RouterName.dashBoard,
      page: () {
        final args = Get.arguments ?? {};
        log("args[RouterArguments.index] :: ${args[RouterArguments.index]}");
        log("args[RouterArguments.index] :: ${AppConstant.authToken}");
        return DashBoard(
          // token: args[RouterArguments.token] ?? AppConstant.authToken ?? null,
          initialIndex: int.parse(args[RouterArguments.index] ?? '0'),
        );
      },
    ),
    GetPage(
      name: RouterName.loginScreen,
      transition: Transition.downToUp,
      transitionDuration: AppConstant.transitionDuration,

      page: () {
        final args = Get.arguments ?? {};
        return LoginScreen(
          isMain: args[RouterArguments.isMain] == 'true' ? true : false,
        );
      },
    ),
    GetPage(
      name: RouterName.passwordVerifyScreen,
      transition: Transition.downToUp,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        return PasswordVerifyScreen();
      },
    ),
    GetPage(
      name: RouterName.otpVerifyScreen,
      transition: Transition.downToUp,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        final args = Get.arguments ?? {};
        return OtpVerifyScreen(
          code: args[RouterArguments.code],
          mobileNumber: args[RouterArguments.mobileNumber],
        );
      },
    ),
    GetPage(
      name: RouterName.registerScreen,
      transition: Transition.rightToLeftWithFade,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        final args = Get.arguments ?? {};
        return RegisterScreen(
          countryCode: args[RouterArguments.code],
          phoneNumber: args[RouterArguments.mobileNumber],
          email: args[RouterArguments.email],
        );
      },
    ),
    GetPage(name: RouterName.searchBarScreen, page: () => SearchBarScreen()),
    GetPage(name: RouterName.bookingScreen, page: () => BookingScreen()),
    GetPage(
      name: RouterName.checkAvailabilityScreen,
      transition: Transition.rightToLeft,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        final args = Get.arguments ?? {};
        return CheckAvailabilityScreen(
          listingId: args[RouterArguments.listingId],
          priceText: args[RouterArguments.priceText],
          model: args[RouterArguments.model],
          //  model: modelData!,
        );
      },
    ),
    GetPage(
      name: RouterName.reservationScreen,
      transition: Transition.rightToLeft,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        final args = Get.arguments ?? {};
        final detailModelJson = Get.parameters[RouterArguments.detailModel];
        final ListingDetailResponseModel? detailModelData =
            detailModelJson != null
            ? ListingDetailResponseModel.fromJson(jsonDecode(detailModelJson))
            : null;
        final estimationModelJson =
            Get.parameters[RouterArguments.estimationModel];
        final EstimationResponseModel? estimationModelData =
            detailModelJson != null
            ? EstimationResponseModel.fromJson(jsonDecode(estimationModelJson!))
            : null;
        return ReservationScreen(
          // detailmodel: args[RouterArguments.detailModel],
          detailmodel: detailModelData!,
          // estimationModel: args[RouterArguments.estimationModel],
          estimationModel: estimationModelData!,
          bookingType: args[RouterArguments.bookingType],
        );
      },
    ),
    GetPage(
      name: RouterName.chatScreen,
      transition: Transition.rightToLeft,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        final args = Get.arguments ?? {};
        final parms = Get.parameters;
        final hostDetailsJson = parms[RouterArguments.hostDetailsData];
        final Listing? hostDetailsData = hostDetailsJson != null
            ? Listing.fromJson(jsonDecode(hostDetailsJson))
            : null;
        final inboxListDataJson = parms[RouterArguments.inboxListData];
        final Datum? inboxListDataData = inboxListDataJson != null
            ? Datum.fromJson(jsonDecode(inboxListDataJson))
            : null;
        return ChatScreen(
          hostDetailsData: hostDetailsData,
          inboxListData: inboxListDataData,
          isInboxPage: args[RouterArguments.isInboxPage],
          profilePicture: args[RouterArguments.profilePicture] ?? '',
        );
      },
    ),
    GetPage(
      name: RouterName.meetHostViewScreen,
      page: () {
        final args = Get.arguments ?? {};
        return MeetHostViewScreen(listingId: args[RouterArguments.listingId]);
      },
    ),
    GetPage(
      name: RouterName.productDetailScreen,
      transition: Transition.rightToLeft,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        final args = Get.arguments ?? {};
        final parms = Get.parameters;
        final approvedListingJson = parms[RouterArguments.hostDetailsData];
        final ApprovedListing? approvedListingData = approvedListingJson != null
            ? ApprovedListing.fromJson(jsonDecode(approvedListingJson))
            : null;
        return ProductDetailScreen(
          listingId: args[RouterArguments.listingId],
          wishlist: args[RouterArguments.wishlist],
          approvedListing: approvedListingData,
          images: args[RouterArguments.images],
          isIndexPage: args[RouterArguments.inBoXToDetails] == "true"
              ? true
              : false,
        );
      },
    ),
    GetPage(
      name: RouterName.loginAndSecurityScreen,
      transition: Transition.rightToLeft,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        final args = Get.arguments ?? {};
        return LoginAndSecurityScreen(
          userModel: args[RouterArguments.userModel],
        );
      },
    ),
    GetPage(
      name: RouterName.notificationScreen,
      transition: Transition.upToDown,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        return NotificationScreen();
      },
    ),
    GetPage(
      name: RouterName.personalInfoScreen,
      transition: Transition.rightToLeft,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        final args = Get.arguments ?? {};
        return PersonalInfoScreen(userModel: args[RouterArguments.userModel]);
      },
    ),
    GetPage(
      name: RouterName.profileViewScreen,
      page: () {
        final args = Get.arguments ?? {};
        return ProfileViewScreen(userModel: args[RouterArguments.userModel]);
      },
    ),
    GetPage(
      name: RouterName.selectLanguageScreen,
      transition: Transition.rightToLeft,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        return SelectLanguageScreen();
      },
    ),
    GetPage(
      name: RouterName.currencyScreen,
      transition: Transition.rightToLeft,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        final args = Get.arguments ?? {};
        return CurrencyScreen(from: args[RouterArguments.from]);
      },
    ),
    GetPage(
      name: RouterName.bookingHistoryScreen,
      page: () {
        final args = Get.arguments ?? {};
        return BookingHistoryScreen(status: args[RouterArguments.status]);
      },
    ),
    GetPage(
      name: RouterName.tripDetailScreen,
      transition: Transition.rightToLeft,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        final args = Get.arguments ?? {};
        return TripDetailScreen(
          data: args[RouterArguments.data],
          /* tripViewModel: args[RouterArguments.tripViewModel],*/
        );
      },
    ),
    GetPage(
      name: RouterName.wishlistCollection,
      transition: Transition.rightToLeft,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        final args = Get.arguments ?? {};
        return WishlistCollection(
          collectionId: args[RouterArguments.collectionId],
          collectionName: args[RouterArguments.collectionName],
        );
      },
    ),

    // Host related screens
    GetPage(
      name: RouterName.getSteps,
      transition: Transition.upToDown,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        return GetStartedScreen();
      },
    ),
    GetPage(
      name: RouterName.listingIntroScreen,
      transition: Transition.rightToLeft,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        return CreateListingSteps();
      },
    ),
    GetPage(
      name: RouterName.listingPage,
      transition: Transition.upToDown,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        return ListingsPage();
      },
    ),
    GetPage(
      name: RouterName.listingDetailPage,
      transition: Transition.rightToLeft,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        final args = Get.arguments ?? {};
        return ListingDetailPage(listingId: args[RouterArguments.listingId]);
      },
    ),
    GetPage(
      name: RouterName.hostDashboard,
      transition: Transition.upToDown,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        final args = Get.arguments ?? {};
        return HostDashboard(
          index: int.parse(args[RouterArguments.index] ?? '0'),
        );
      },
    ),
    GetPage(
      name: RouterName.insightsPage,
      page: () {
        return InsightsPage();
      },
    ),
    GetPage(
      name: RouterName.hostReservationPage,
      page: () {
        return HostReservationPage();
      },
    ),
    GetPage(
      name: RouterName.reserveDetailPage,
      transition: Transition.rightToLeft,
      transitionDuration: AppConstant.transitionDuration,
      page: () {
        final args = Get.arguments ?? {};
        return ReserveDetailPage(data: args[RouterArguments.data]);
      },
    ),
  ];
}
