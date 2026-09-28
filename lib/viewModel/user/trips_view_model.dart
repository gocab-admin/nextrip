import 'package:airstar_flutter/data/models/user/trip_response_model.dart';
import 'package:airstar_flutter/data/repositories/user/trip_repo.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';

import '../../commonWidgets/common_widgets.dart';
import '../../data/models/user/user_review_response_model.dart';
import '../../utils/utils.dart';

class TripViewModel extends BaseViewModel {
  //Repository
  final TripRepository _tripRepository = locator<TripRepository>();

  //Model
  TripResponseModel? _tripResponseModel;
  TripResponseModel? get tripResponseModel => _tripResponseModel;

  UserReviewResponseModel? _userReviewResponseModel;
  UserReviewResponseModel? get userReviewResponseModel => _userReviewResponseModel;

  // List<BookingHistory> getBookinghistory(String status) {
  //   if (status == "all") return tripResponseModel!.data!.bookingHistory!;
  //   if (status == "pending") {
  //     return tripResponseModel!.data!.bookingHistory!
  //         .where((e) =>
  //             e.bookingdata!.status == status ||
  //             e.bookingdata!.status == "onlinePayment")
  //         .map((t) => t)
  //         .toList();
  //   }
  //
  //   return tripResponseModel!.data!.bookingHistory!
  //       .where((e) => e.bookingdata!.status == status)
  //       .map((t) => t)
  //       .toList();
  // }

  List<BookingHistory> getBookinghistory(String status) {
    List<BookingHistory> filteredTripList = [];
     if(tripResponseModel!.data!.bookingHistory == null) return[];
    if (status == "all") {
      filteredTripList = tripResponseModel!.data!.bookingHistory!;
    } else if (status == "pending") {
      filteredTripList = tripResponseModel!.data!.bookingHistory!
          .where((e) =>
      e.bookingdata!.status == status ||
          e.bookingdata!.status == "onlinePayment")
          .toList();
    } else {
      filteredTripList = tripResponseModel!.data!.bookingHistory!
          .where((e) => e.bookingdata!.status == status)
          .toList();
    }

    filteredTripList.sort((a, b){
      final earlierTripDays = calculateDateDifference(DateTime.now(), a.bookingdata!.bookedDates!.start!);
      final laterTripDays = calculateDateDifference(DateTime.now(), b.bookingdata!.bookedDates!.start!);

      return earlierTripDays.compareTo(laterTripDays);
    });

    return filteredTripList;
  }

  Future<TripResponseModel?> fetchTrip() async {
    //Loader State
    setState(ViewState.busy);

    try {
      var data = await _tripRepository.fetchTrip();
      if (data != null) {
        _tripResponseModel = data;
        //Success State
        setState(ViewState.success);
      } else {
        //Failed
        // onFailureRes(Strings.somethingWentWrong);
        //Failure State
        setState(ViewState.idle);
      }
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<bool> cancelTrip({required String id, required String reason}) async {
    try {
      var data = await _tripRepository.cancelTrip(id: id, reason: reason);
      return data;
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
    }
    return false;
  }


  Future<String?> addReviewsAndRating(
      {required String listingId,required String bookingId,dynamic body}) async {
    setState(ViewState.secondaryLoader);

    try {
      var data = await _tripRepository.addReviewsRating(
          bookingId: bookingId,
          listingId: listingId,
          body: body
      );

      if (data != null) {
        ToastUtil.showMessage(data);
        return data;
        // setState(ViewState.secondaryLoader);
      }
      setState(ViewState.idle);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<UserReviewResponseModel?> getMyReviewsAndRating(
      {required String listingId,required String bookingId,dynamic body}) async {
    setState(ViewState.busy);

    try {
      var data = await _tripRepository.getMyReviewsRating(
        bookingId: bookingId,
        listingId: listingId,
      );

      if (data != null) {
        _userReviewResponseModel = data;
        setState(ViewState.success);
      }
      setState(ViewState.idle);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

}
