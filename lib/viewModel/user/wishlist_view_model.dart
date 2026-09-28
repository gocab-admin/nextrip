import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/user/wishlist_collection_response_model.dart';
import 'package:airstar_flutter/data/models/user/wishlist_response_model.dart';
import 'package:airstar_flutter/data/repositories/user/wishlist_repo.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';

import '../../utils/utils.dart';

class WishlistViewModel extends BaseViewModel {
  //Repository
  final WishlistRepository _WishlistRepository = locator<WishlistRepository>();

  //Model
  WishlistResponseModel? _wishlistResponseModel;
  WishlistCollectionResponseModel? _wishlistCollectionResponseModel;
  WishlistResponseModel? get wishlistResponseModel => _wishlistResponseModel;
  WishlistCollectionResponseModel? get wishlistCollectionResponseModel =>
      _wishlistCollectionResponseModel;

  bool isWishlistEdit = false;

  void updateWishlistEdit() {
    isWishlistEdit = !isWishlistEdit;
    notify();
  }

  Future<WishlistResponseModel?> fetchWishlist(
      {required bool isdefault, String? collectionId}) async {
    //Loader State
    setState(ViewState.busy);

    try {
      var data = await _WishlistRepository.fetchWishlist(
          isdefault: isdefault, collectionId: collectionId);
      if (data != null) {
        if (isdefault) {
          _wishlistResponseModel = data;
          if (wishlistResponseModel!.data?.wishLists?.isEmpty ?? true) {
            isWishlistEdit = false;
            print("wishlist edit set to default >>>");
          }
        } else {
          _wishlistCollectionResponseModel = data;
        }

        //Success State
        setState(ViewState.success);
      } else {
        //Failed
        // onFailureRes(Strings.somethingWentWrong);
        //Failure State
        setState(ViewState.idle);
      }
    } on AppException catch (appException) {
      _wishlistCollectionResponseModel = null;
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<WishlistResponseModel?> addWishlist(
      {required String collectionName,
      required String listingId,
      String? collectionId,
      required bool isCreateWishlist}) async {
    try {
      var data = await _WishlistRepository.addWishlist(
          collectionName: collectionName,
          collectionId: collectionId,
          isCreateWishlist: isCreateWishlist,
          listingId: listingId);
      if (data != null) {
        ToastUtil.showMessage("${data.message}");
      } else {
        print("wishlist data is null");
      }
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
    }
    return null;
  }

  Future removeWishlist({
    required String listingId,
    bool? isWishListPage =false,String? collectionId
  }) async {
    try {
      var statusCode =
          await _WishlistRepository.removeWishlist(listingId: listingId);
      // if(isWishListPage == true){
      //   _WishlistRepository.fetchWishlist(isdefault: false,collectionId: collectionId);
      // }
      return statusCode;
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
    }
    return null;
  }

  Future<bool> deleteWishlist({
    required String wishlistId,
  }) async {
    try {
      var status =
          await _WishlistRepository.deleteWishlist(wishlistId: wishlistId);
      return status;
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
    }
    return false;
  }
}

