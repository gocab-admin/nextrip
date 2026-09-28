import 'package:airstar_flutter/data/models/user/booking_response_model.dart';
import 'package:airstar_flutter/services/dio_client.dart';
import '../../../utils/utils.dart';

class BookingRepository {
  final ApiClient _client = ApiClient();

  Future<BookingResponseModel?> fetchBooking({
    required String bookingType,
    required String id,
    required DateTime startDate,
    required DateTime endDate,
    required String paymentMode,
    required String adults,
    required String children,
    required String pets,
    required String currency,
    String? paymentMethod,
  }) async {
    var body = {
      'bookingType': bookingType,
      'startDate': "${startDate}",
      'endDate': "${endDate}",
      'paymentMode': paymentMode,
      'adults': adults,
      'children': children,
      'pets': pets,
      if(paymentMethod != null)'paymentMethod': paymentMethod
    };

    final response =
    await _client.post(
        "${EndPointConstants.initiateBookingUrl}/${id}?currency=$currency",
        body: body);

    // Logger.appLogs('callBackResponse:: $response');
    if (response != null) {
      //Success returning data back
      // Logger.appLogs('responseRepo:: $response');
      return BookingResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      //Failed returning null
      // Logger.appLogs('errorNull:: $response');
      return null;
    }
  }

  Future<dynamic> paymentStatus({
    String? paymentId,
    required String invoiceId,
    String? paymentMethod,
    String? razorpayOrderId,
    String? razorpayPaymentId,
    String? razorpaySignature,
    String? phonePeMerchantOrderId,
  }) async {
    var body = {
      /*'bookingId': bookingId,*/
      if(isValidValue(invoiceId)) 'invoiceId': invoiceId,
      if(isValidValue(paymentMethod))'paymentMethod': paymentMethod,
      if(isValidValue(razorpayOrderId))'razorpay_order_id': razorpayOrderId,
      if(isValidValue(razorpayPaymentId)) 'razorpay_payment_id': razorpayPaymentId,
      if(isValidValue(razorpaySignature))'razorpay_signature': razorpaySignature,
      if(isValidValue(phonePeMerchantOrderId)) 'merchant_order_id': phonePeMerchantOrderId,
      if(paymentMethod?.toLowerCase() == AppConstant.paymentMethod[2])"platform" : "Mobile"
    };


    Map<String, dynamic>? params = paymentMethod?.toLowerCase() == AppConstant.paymentMethod[0] || paymentMethod?.toLowerCase() == AppConstant.paymentMethod[2] ? {} : {'id': paymentId};


    final response = await _client
        .post(EndPointConstants.paymentStatusUrl, body: body, queryParameters: params.isNotEmpty ? params : null);

    // Logger.appLogs('callBackResponse:: $response');
    if (response != null) {
      //Success returning data back
      // Logger.appLogs('responseRepo:: $response');
      return response;
    } else {
      //Failed returning null
      // Logger.appLogs('errorNull:: $response');
      return null;
    }
  }
}

