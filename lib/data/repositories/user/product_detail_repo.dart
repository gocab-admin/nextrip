
import 'package:airstar_flutter/services/dio_client.dart';

import '../../../utils/constants/end_points_constants.dart';
import '../../models/user/estimation_response_model.dart';
import '../../models/user/listing_detail_response_model.dart';
import '../../models/user/review_response_model.dart';
import '../../models/user/users_listing_response_model.dart';

class ProductDetailRepository {
  ApiClient _client = ApiClient();

  Future<ListingDetailResponseModel?> fetchListingDetail(
      {required String id, Map<String, dynamic>? queryParameters}) async {
    print("${EndPointConstants.listingScreenUrl}/${id}");
    final response = await _client.get(
        "${EndPointConstants.listingScreenUrl}/${id}",
        queryParameters: queryParameters);

    if (response != null) {
      return ListingDetailResponseModel.fromJson(
          response as Map<String, dynamic>);
    } else {
      return null;
    }
  }

  Future<EstimationResponseModel?> fetchEstimation({required String id,
    required String bookingType,
    required DateTime startDate,
    required DateTime endDate,
    required int adults,
    required int children,
    required int pets,
    required String currency}) async {
    print("${EndPointConstants.estimationUrl}/${id}");

    final response = await _client
        .get("${EndPointConstants.estimationUrl}/${id}", queryParameters: {
      'bookingType': bookingType,
      'startDate': startDate,
      'endDate': endDate,
      'adults': adults,
      'children': children,
      'pets': pets,
      'id': id,
      'currency': currency
    });

    if (response != null) {
      return EstimationResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      return null;
    }
  }

  Future<ReviewResponseModel?> fetchReviewsAndRating(
      {required String id}) async {
    final response = await _client.get(
        "${EndPointConstants.reviewAndRatingUrl}/${id}",
        queryParameters: {"_page": 1, "_limit": 10});

    // Logger.appLogs('callBackResponse:: $response');
    if (response != null) {
      //Success returning data back
      // Logger.appLogs('responseRepo:: $response');
      return ReviewResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      //Failed returning null
      // Logger.appLogs('errorNull:: $response');
      return null;
    }
  }

  Future<UsersListingResponseModel?> fetchUsersListing(
      {required String id}) async {
    final response = await _client.get(
      "${EndPointConstants.usersListingUrl}/${id}",
    );

    if (response != null) {
      return UsersListingResponseModel.fromJson(
          response as Map<String, dynamic>);
    } else {
      return null;
    }
  }
}