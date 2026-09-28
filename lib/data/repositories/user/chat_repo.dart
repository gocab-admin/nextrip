import 'package:airstar_flutter/data/models/user/chat_details_responde_model_two.dart';
import 'package:airstar_flutter/data/models/user/chat_details_response_model.dart';
import 'package:airstar_flutter/data/models/user/chat_list_response_model.dart';
import 'package:airstar_flutter/services/dio_client.dart';

import '../../../utils/utils.dart';

class ChatRepository{
  ApiClient _client = ApiClient();

  Future<ChatDetailsResponseModel?> fetchChatDetails1({Map<String, dynamic>? queryParameters})async{
    final response =
    await _client.get(EndPointConstants.chatDetailUrl1, queryParameters: queryParameters);
    if (response != null) {
      return ChatDetailsResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      return null;
    }
  }

  Future<InboxChatDetailsResponseModel2?> fetchChatInboxDetails(String? chatId)async{
    final response =
    await _client.get("${EndPointConstants.chatInboxDetailUrl2}$chatId");
    if (response != null) {
      return InboxChatDetailsResponseModel2.fromJson(response as Map<String, dynamic>);
    } else {
      return null;
    }
  }



  Future<ChatListResponseModel?> fetchChatList({String? status})async{
    final response =
    await _client.get(EndPointConstants.chatListUrl,queryParameters: {"type":"listing", "status": status});
    if (response != null) {
      return ChatListResponseModel.fromJson(response as Map<String, dynamic>);
    } else {
      return null;
    }
  }
}