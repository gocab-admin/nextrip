import 'dart:ui';

import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/user/booking_response_model.dart';
import 'package:airstar_flutter/data/repositories/user/booking_repo.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/user/common_viewmodel.dart';
import 'package:flutter/cupertino.dart';

import '../../utils/utils.dart';

class BookingViewModel extends BaseViewModel {
  //Repository
  final BookingRepository _bookingRepository = locator<BookingRepository>();

  //Model
  BookingResponseModel? _bookingResponseModel;

  BookingResponseModel? get bookingResponseModel => _bookingResponseModel;


  String selectedPaymentMethod = '';
  String selectedPaymentType = Strings.stripe;

  void selectPaymentMethod(String paymentMethod) {
    selectedPaymentMethod = paymentMethod;
    notify();
  }

  void selectPaymentType(String paymentType) {
    selectedPaymentType = paymentType;
    notify();
  }

  List<String> paymentOptions(CommonViewModel commonValue) {
    final paymentType = commonValue.settingsResponseModel?.data?.hiddenSettings;
    return [
      "stripe",
      if (paymentType?.cash == '1') "payAtHotel",
      if (paymentType?.razorpay == '1') "razorpay",
       if (paymentType?.phonePe == '1') "phonePe",
    ];
  }

  Color getReserveButtonColor(String userId, String? providerId) {
    if(userId == providerId) {
      return AppColorData.disableButtonClr;
    }
    return  AppColorData.appPrimaryColor;
  }


  String getReserveButtonName(String userId, String? providerId) {
    if(userId == providerId) {
      print("UserId>>>>> $userId");
      print("ProviderId>>>>> $providerId");
      return "cantReserveYourOwnListings";
    }
    return  "requestToBook";

  }


  Future<bool> fetchBooking({
    required String id,
    required String bookingType,
    required DateTime startDate,
    required DateTime endDate,
    required String paymentMode,
    required String adults,
    required String children,
    required String pets,
    required String currency,
    String? paymentMethod,
  }) async {
    try {
      setState(ViewState.secondaryLoader);
      var data = await _bookingRepository.fetchBooking(
          bookingType: bookingType,
          adults: adults,
          id: id,
          children: children,
          endDate: endDate,
          paymentMode: paymentMode,
          pets: pets,
          startDate: startDate,
          currency: currency,
          paymentMethod: paymentMethod);

      if (data != null) {
        _bookingResponseModel = data;
      }
      setState(ViewState.idle);
      return true;
    } on AppException catch (appException) {
      setState(ViewState.idle);
      errorMsg = errorHandler(appException);
    }
    return false;
  }

  Future<bool> paymentStatus({
    String? paymentId,
    required String invoiceId,
    String? paymentMethod,
    String? razorpayOrderId,
    String? razorpayPaymentId,
    String? razorpaySignature,
    String? phonePeMerchantOrderId,
  }) async {
    try {
      setState(ViewState.secondaryLoader);
      var data = await _bookingRepository.paymentStatus(
          invoiceId: invoiceId, paymentId: paymentId, paymentMethod: paymentMethod, razorpayOrderId: razorpayOrderId, razorpayPaymentId: razorpayPaymentId, razorpaySignature: razorpaySignature,  phonePeMerchantOrderId: phonePeMerchantOrderId,);

      ToastUtil.showMessage("${data['message'] ?? 'null'}");
      setState(ViewState.idle);
      return data['status'];
    } on AppException catch (appException) {
      setState(ViewState.idle);
      errorMsg = errorHandler(appException);
    }
    return false;
  }

  // basic logics

  List<int> _count = List<int>.generate(4, (index) => 0);

  List<int> get count => _count;

  void incrementGuestCount(int index) {
    setState(ViewState.busy);
    _count[index]++;
    setState(ViewState.success);
  }

  void decrementGuestCount(int index) {
    setState(ViewState.busy);
    if (_count[index] > 0) _count[index]--;
    setState(ViewState.success);
  }
}
