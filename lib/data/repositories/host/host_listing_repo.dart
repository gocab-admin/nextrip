import 'package:airstar_flutter/data/models/host/calendar_response_model.dart';
import 'package:airstar_flutter/data/models/host/cancel_policy_response_model.dart';
import 'package:airstar_flutter/data/models/host/host_reserve_response_model.dart';
import 'package:airstar_flutter/data/models/host/rules_icons_response_model.dart';
import 'package:airstar_flutter/data/models/host/today_menu_response_model.dart';
import 'package:airstar_flutter/services/dio_client.dart';
import 'package:airstar_flutter/utils/constants/constants.dart';

import '../../models/host/basic_details_response_model.dart';
import '../../models/host/host_listing_response_model.dart';
import '../../models/host/user_listings_response_model.dart';

class HostListingRepository{

  ApiClient _client = ApiClient();

  Future<TodayMenuResponseModel?> fetchTodayMenu() async {
    final response = await _client.get(EndPointConstants.todayMenuUrl);

    if(response != null) {
      return TodayMenuResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      return null;
    }
  }

  Future<UserListingsResponseModel?> fetchUserListings({String? search, List<dynamic>? amenities, String? list, String? status}) async {

    var params = {
      "_page": 1,
      "_limit": 10,
      if(search != null) "search": search,
      if(amenities != null) "amenities": '[${amenities.join(',')}]',
      if(list != null)"list": list,
      if(status != null) "status": status
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


  Future<bool?> addHostResponse({
    required String hostResponse,
    required String reviewId,
    required String listingId,
  }) async {

    var body = {
      "response": hostResponse,
      "reviewId": reviewId,
      "type": "provider"
    };

    final response = await _client.post("${EndPointConstants.reviewAndRatingUrl}/$listingId", body: body);

    if(response != null) {
      return response['status'];
    } else {
      return null;
    }
  }

  Future<HostReserveResponseModel?> fetchBooking({String? reserveType, String? bookingStatus}) async {

    var params = {
      "_page": 1,
      "_limit": 10,
      "type": "provider",
      if(reserveType == "approval")"bookingStatus": bookingStatus,
    };

    final response = await _client.get("${EndPointConstants.bookingUrl}/$reserveType", queryParameters: params);

    if(response != null) {
      return HostReserveResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      return null;
    }
  }

  Future<bool?> confirmBooking({String? bookingId, String? reserveType}) async {
    final response = await _client.post("${EndPointConstants.bookingUrl}/$reserveType/$bookingId");

    if(response != null) {
      return response['status'];
    } else {
      return false;
    }
  }

  Future<bool?> publishListing({required String listingId}) async {
    final response = await _client.post("${EndPointConstants.publishUrl}/$listingId");

    if(response != null) {
      return response['status'];
    } else {
      return false;
    }
  }
  
  Future<CancelPolicyResponseModel?> fetchCancelPolicy() async {
    final response = await _client.get(EndPointConstants.cancellationPolicyUrl);

    if(response != null) {
      return CancelPolicyResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      return null;
    }
  }

  Future<bool?> updateCancellationPolicy({int? cancellationPolicyId, String? listingId}) async {

    final body = {
      "cancellationPolicyId": cancellationPolicyId
    };

    final params = {
      "listingId": listingId
    };

    final response = await _client.post('${EndPointConstants.cancellationPolicyUrl}', body: body, queryParameters: params);

    if(response != null) {
      return response['status'];
    } else {
      return false;
    }
  }

  Future<RulesIconsResponseModel?> fetchRulesIcons() async {
    final response = await _client.get(EndPointConstants.ruleIconsUrl);

    if(response != null) {
      return RulesIconsResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      return null;
    }
  }

  Future<bool?> updateHouseRules({
    required String listingId,
    required String title,
    required String description,
    required String rules,
    //required int progressPercentage,

}) async {

    var body = {
      "title": title,
      "desc": description,
      "rules": rules,
     // "progressPercentage": progressPercentage
    };

    final response = await _client.post("${EndPointConstants.houseRulesUrl}/${listingId}", body: body);

    if(response != null) {
      return response['status'];
    } else {
      return false;
    }
  }

  Future<CalendarResponseModel?> fetchCalendarRecords() async {
    final response = await _client.get(EndPointConstants.calendarRecordsUrl);

    if(response != null) {
      return CalendarResponseModel.fromJson(response as Map<String, dynamic>);
    }
    return null;
  }

  Future<bool?> updateBlockDates({
    required String listingId,
    required String startDate,
    required String endDate,
}) async {
    var body = {
      "start": startDate,
      "end": endDate
    };
    final response = await _client.post("${EndPointConstants.blockDatesUrl}/$listingId", body: body);

    if(response != null) {
      return response["status"];
    } else {
      return false;
    }
  }


  Future<bool?> deleteBlockDates({
    required String listingId,
    required String dateId,

  }) async {
    var body = {
      "dateId": dateId,
    };
    final response = await _client.delete("${EndPointConstants.blockDatesUrl}/$listingId", body: body);

    if(response != null) {
      return response["status"];
    } else {
      return false;
    }
  }
}