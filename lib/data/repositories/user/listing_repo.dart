import 'package:airstar_flutter/data/models/user/amenities_response_model.dart';
import 'package:airstar_flutter/data/models/user/category_response_model.dart';
import 'package:airstar_flutter/data/models/user/listing_response_model.dart';
import 'package:airstar_flutter/data/models/user/properties_response_model.dart';
import 'package:airstar_flutter/services/dio_client.dart';
import 'package:airstar_flutter/utils/constants/constants.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:flutter/foundation.dart';

class ListingRepository {
  ApiClient _client = ApiClient();

  Future<ListingResponseModel?> fetchListing({
    Map<String, dynamic>? queryParameters,
  }) async {
    final response = await _client.get(
      EndPointConstants.listingScreenUrl,
      queryParameters: queryParameters,
    );

    if (response != null) {
      return compute(
        ListingResponseModel.fromJson,
        response as Map<String, dynamic>,
      );
    } else {
      return null;
    }
  }

  Future<CategoryResponseModel?> fetchCategory({
    Map<String, dynamic>? queryParameters,
  }) async {
    final response = await _client.get(
      EndPointConstants.listingCategories,
      queryParameters: queryParameters,
    );

    if (response != null) {
      return compute(
        CategoryResponseModel.fromJson,
        response as Map<String, dynamic>,
      );
    } else {
      return null;
    }
  }

  Future<AmenitiesResponseModel?> fetchAmenities({String? privilegeId}) async {
    var params = {"privilegeId": privilegeId};

    final response = await _client.get(
      "${EndPointConstants.amenitiesUrl}",
      queryParameters: params,
    );

    if (response != null) {
      return compute(
        AmenitiesResponseModel.fromJson,
        response as Map<String, dynamic>,
      );
    } else {
      return null;
    }
  }

  Future<PropertiesResponseModel?> fetchProperties(String catergoryId) async {
    final response = await _client.get(
      "${EndPointConstants.propertiesUrl}/${catergoryId}",
    );

    if (response != null) {
      return compute(
        PropertiesResponseModel.fromJson,
        response as Map<String, dynamic>,
      );
    } else {
      return null;
    }
  }
}
