import 'package:airstar_flutter/data/models/user/trip_response_model.dart';
import 'package:airstar_flutter/services/dio_client.dart';
import '../../../utils/utils.dart';
import '../../models/user/user_review_response_model.dart';

class TripRepository {
  final ApiClient _client = ApiClient();

  Future<TripResponseModel?> fetchTrip() async {
    final response = await _client.get("${EndPointConstants.tripsBookingUrl}/all",
        queryParameters: {'_page': 1, '_limit': 50, 'type': "user"});

    // Logger.appLogs('callBackResponse:: $response');
    if (response != null) {
      //Success returning data back
      // Logger.appLogs('responseRepo:: $response');
      return TripResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      //Failed returning null
      // Logger.appLogs('errorNull:: $response');
      return null;
    }
  }

  Future<bool> cancelTrip({required String id, required String reason}) async {
    var body = {"reason": reason, "type": "user"};
    final response = await _client
        .post("${EndPointConstants.bookingCancelUrl}/${id}", body: body);
    return response['status'];
  }

  Future<String?> addReviewsRating({required String listingId,required String bookingId,dynamic body})async {
    final response = await _client.post(
        "${EndPointConstants.reviewAndRatingUrl}/$listingId/$bookingId",
        body: body);
    if (response != null && response['statusCode'] == 200) {
      //Success returning data bac
      return response['message'];
      // ReviewResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      //Failed returning null
      // Logger.appLogs('errorNull:: $response');
      return null;
    }
  }
  Future<UserReviewResponseModel?> getMyReviewsRating({required String listingId,required String bookingId,})async {
    final response = await _client.get(
        "${EndPointConstants.viewUserReviewUrl}/$listingId/$bookingId");
    if (response != null) {
      //Success returning data back
      return UserReviewResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      //Failed returning null
      // Logger.appLogs('errorNull:: $response');
      return null;
    }
  }

}
