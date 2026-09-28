import 'dart:io';

import 'package:airstar_flutter/data/models/host/basic_details_response_model.dart';
import 'package:airstar_flutter/data/models/host/get_steps_response_model.dart';
import 'package:airstar_flutter/data/models/host/price_response_model.dart';
import 'package:airstar_flutter/data/models/host/user_listings_response_model.dart';
import 'package:airstar_flutter/utils/constants/constants.dart';

import 'package:dio/dio.dart';
import '../../../services/dio_client.dart';
import '../../models/host/add_info_response_model.dart';
import '../../models/host/gallery_response_model.dart';
import '../../models/host/get_images_response_model.dart';
import '../../models/host/host_listing_response_model.dart';
import '../../models/host/privileges_response_model.dart';
import 'package:http_parser/http_parser.dart';

import '../../models/host/update_privileges_response_model.dart';


class CreateListingRepository {
  final ApiClient _client = ApiClient();

  Future<GetStepsResponseModel?> getSteps() async {
    final response = await _client.get(EndPointConstants.getSteps);

    if(response != null) {
      return GetStepsResponseModel.fromJson(response as Map<String, dynamic>) ;
    } else {
      return null;
    }
  }


  Future<bool?> fetchPendingList() async {
    final response = await _client.get(EndPointConstants.pendingUrl);

    if(response != null) {
      return response['status'];
    } else {
      return null;
    }
  }

  Future<AddInfoResponseModel?> fetchInfo({required String userId, String? title, String? description, String? listingId}) async {

    final body = {
      "desc": description,
      "name": title,
      "userId": userId
    };
    final url = listingId != null && listingId.isNotEmpty
        ? "${EndPointConstants.addInfoUrl}/$listingId"
        : EndPointConstants.addInfoUrl;
   final response = await _client.post(url, body: body);

    if(response != null) {
      return AddInfoResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      return null;
    }
  }

  Future<BasicDetailsResponseModel?> fetchBasicDetails(
      {Map<String, dynamic>? body, required String listingId}) async {

    final response = await _client.post("${EndPointConstants.basicDetailsUrl}/$listingId",
        body: body);

    if (response != null) {
      return BasicDetailsResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      return null;
    }
  }

  Future<PrivilegesResponseModel?> fetchPrivileges() async {
    final response = await _client.get(EndPointConstants.privilegesUrl);

    if(response != null) {
      return PrivilegesResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      return null;
    }
  }

  Future<UpdatePrivilegesResponseModel?> updatePrivileges({required String listingId, Map<String, dynamic>? body}) async {

    final response = await _client.post('${EndPointConstants.privilegesUrl}/$listingId', body: body);

    if(response != null) {
      return UpdatePrivilegesResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      return null;
    }
  }

  Future<GalleryResponseModel?> fetchImages() async {

    var params = {
      "collection": "listings",
      "_page": 1,
      "_limit": 12
    };
    final response = await _client.get(EndPointConstants.getImageUrl, queryParameters: params);

    if(response != null) {
      return GalleryResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      return null;
    }
  }

  Future<GalleryResponseModel?> uploadImages(File image) async {
    try {
      var formData = FormData.fromMap({
        "collection": "listings",
        "images[]": await MultipartFile.fromFile(
          image.path,
          filename: image.path.split('/').last,
          contentType: MediaType('image', 'jpeg'),
        ),
      });

      final response = await _client.post(
        EndPointConstants.getImageUrl,
        body: formData,
      );

      if (response != null) {
        return GalleryResponseModel.fromJson(response as Map<String, dynamic>);
      }
    } catch (e) {
      print('Upload error: $e');
    }

    return null;
  }

  Future<dynamic> deleteImages({required List<String> ids}) async {
    var params = {
      "imageIds": ids.join(",")
    };
    final response = await _client.delete(EndPointConstants.getImageUrl, queryParameters: params);

    if(response != null) {
      return response;
    } else {
      return null;
    }
  }

  Future<GetImagesResponseModel?> addCoverImage({
    required String listingId,
    required int progressPercentage,
    String? selectedImage }) async {
    var body = {
      "selectedImage": selectedImage,
      "progressPercentage": progressPercentage
    };
    final response = await _client.post("${EndPointConstants.coverImageUrl}/$listingId", body: body);

    if(response != null) {
      return GetImagesResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      return null;
    }
  }

  Future<GetImagesResponseModel?> addGroupImage({required String listingId,required int progressPercentage,
    List<String>? selectedImages }) async {

    final formData = FormData();

    formData.fields.add(MapEntry("progressPercentage", progressPercentage.toString()));

    for(var imageId in selectedImages ?? []) {
      formData.fields.add(MapEntry("selectedImages[]", imageId));
    }

    final response = await _client.post("${EndPointConstants.groupImageUrl}/$listingId", body: formData);

    if(response != null) {
      return GetImagesResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      return null;
    }
  }

  Future<UserListingsResponseModel?> fetchUserListings({String? search, List<dynamic>? amenities, String? list}) async {

    var params = {
      "_page": 1,
      "_limit": 30,
      if(search != null) "search": search,
      if(amenities != null) "amenities": '[${amenities.join(',')}]',
      if(list != null)"list": list
    };

    final response = await _client.get(EndPointConstants.userListingsUrl, queryParameters: params);

    if(response != null) {
      return UserListingsResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      return null;
    }
  }

  Future<BasicDetailsResponseModel?> deleteListing({required String listingId}) async {
    final response = await _client.delete("${EndPointConstants.deleteListingUrl}/$listingId");

    if(response != null) {
      return BasicDetailsResponseModel.fromJson(response as Map<String,dynamic>);
    } else {
      return null;
    }
  }

  Future<HostListingResponseModel?> fetchHostListings({required String listingId}) async {
    final response = await _client.get("${EndPointConstants.hostListingUrl}/$listingId");

    if(response != null) {
      return HostListingResponseModel.fromJson(response as Map<String,dynamic>);
    } else {
      return null;
    }
  }

  Future<PriceResponseModel?> fetchPriceData({required String listingId, Map<String, dynamic>? body,}) async {
    final response = await _client.post("${EndPointConstants.priceUrl}/$listingId", body: body);

    if(response != null) {
      return PriceResponseModel.fromJson(response as Map<String,dynamic>);
    } else {
      return null;
    }
  }

  Future<BasicDetailsResponseModel?> updateStatus({required String listingId}) async {
    final response = await _client.put("${EndPointConstants.updateStatusUrl}/$listingId");

    if(response != null) {
      return BasicDetailsResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      return null;
    }
  }
}