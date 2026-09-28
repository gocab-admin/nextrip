import 'package:airstar_flutter/data/models/user/wishlist_collection_response_model.dart';
import 'package:airstar_flutter/data/models/user/wishlist_response_model.dart';
import 'package:airstar_flutter/services/dio_client.dart';
import '../../../utils/utils.dart';

class WishlistRepository {
  final ApiClient _client = ApiClient();

  Future fetchWishlist({required bool isdefault, String? collectionId}) async {
    final response = await _client.get(
      isdefault
          ? "${EndPointConstants.wishlistUrl}"
          : "${EndPointConstants.wishlistUrl}/${collectionId}",
    );

    // Logger.appLogs('callBackResponse:: $response');
    if (response != null) {
      //Success returning data back
      // Logger.appLogs('responseRepo:: $response');
      return isdefault
          ? WishlistResponseModel.fromJson(response as Map<String, dynamic>)
          : WishlistCollectionResponseModel.fromJson(
              response as Map<String, dynamic>);
    } else {
      //Failed returning null
      // Logger.appLogs('errorNull:: $response');
      return null;
    }
  }

  Future<WishlistResponseModel?> addWishlist(
      {required String collectionName,
      required String listingId,
      String? collectionId,
      required bool isCreateWishlist}) async {
    var body = {
      'collectionName': collectionName,
      'listingId': listingId,
      if (!isCreateWishlist) 'collectionId': collectionId
    };
    final response =
        await _client.post("${EndPointConstants.wishlistUrl}", body: body);

    // Logger.appLogs('callBackResponse:: $response');
    if (response != null) {
      //Success returning data back
      // Logger.appLogs('responseRepo:: $response');
      return WishlistResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      //Failed returning null
      // Logger.appLogs('errorNull:: $response');
      return null;
    }
  }

  Future removeWishlist({required String listingId}) async {
    var body = {'listingId': listingId};
    final response =
        await _client.post("${EndPointConstants.wishlistUrl}", body: body);

    // Logger.appLogs('callBackResponse:: $response');
    if (response != null) {
      //Success returning data back
      // Logger.appLogs('responseRepo:: $response');
      print("success");
    } else {
      //Failed returning null
      // Logger.appLogs('errorNull:: $response');
      print("failed");
    }

    return response['statusCode'];
  }

  Future<bool> deleteWishlist({required String wishlistId}) async {
    final response =
        await _client.delete("${EndPointConstants.wishlistUrl}/${wishlistId}");

    // Logger.appLogs('callBackResponse:: $response');
    if (response != null) {
      //Success returning data back
      // Logger.appLogs('responseRepo:: $response');
      print("success");
    } else {
      //Failed returning null
      // Logger.appLogs('errorNull:: $response');
      print("failed");
    }

    return response['status'];
  }
}
