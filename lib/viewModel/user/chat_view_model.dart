import 'package:airstar_flutter/data/models/user/chat_details_responde_model_two.dart';
import 'package:airstar_flutter/data/models/user/chat_details_response_model.dart';
import 'package:airstar_flutter/data/models/user/chat_list_response_model.dart';
import 'package:airstar_flutter/data/repositories/user/chat_repo.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';

import '../../utils/utils.dart';

class ChatViewModel extends BaseViewModel {
  final ChatRepository _chatRepository =
      locator<ChatRepository>();

  ChatDetailsResponseModel? _chatDetailsResponseModel;
  ChatListResponseModel? _chatListResponseModel;
  InboxChatDetailsResponseModel2? _inboxChatDetailsResponseModel2;

  ChatDetailsResponseModel? get chatDetailsResponseModel =>
      _chatDetailsResponseModel;
  InboxChatDetailsResponseModel2? get inboxChatDetailsResponseModel2 =>
      _inboxChatDetailsResponseModel2;
  
  ChatListResponseModel? get chatListResponseModel =>
      _chatListResponseModel;
  List<Message>? messages = [];

  int selectedIndex = 0;

  List<String> messagesList = ["all", "travelling", "hosting", "blocked"];
  List<String> names = ['${Strings.airstarSupport}', '${Strings.maddy}','${Strings.saru}','${Strings.izaz}',];

  void updateSelectedIndex(int index) {
    selectedIndex = index;
    notify();
  }

  Future<ChatListResponseModel?> fetchChatList({String? status}) async {
    setState(ViewState.busy);
    try {
      var data =
      await _chatRepository.fetchChatList(status: status);
      if (data != null) {
        _chatListResponseModel = data;
        setState(ViewState.success);
      } else {
        setState(ViewState.idle);
      }
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future fetchChatDetails({
    String? userId,
    String? hostId,
    String? categoryId,
    String? listingId,
    String? chatId,
    required bool isInboxPage,
    required Function() onSuccessRes,
  }) async {
    setState(ViewState.busy);
    try {
      var data;
      if (isInboxPage == true) {
        data = await _chatRepository.fetchChatInboxDetails(chatId);
      } else{
        data = await _chatRepository.fetchChatDetails1(queryParameters: {
          "senderId": userId,
          "receiverId": hostId,
          "catId": categoryId,
          "adsId": listingId,
        });
    }
      if (data != null) {
        (isInboxPage == true)? _inboxChatDetailsResponseModel2 = data: _chatDetailsResponseModel = data;
        setState(ViewState.success);
        if( _inboxChatDetailsResponseModel2?.data != null && _inboxChatDetailsResponseModel2!.data!.isNotEmpty){
          messages?.addAll((isInboxPage == true)? _inboxChatDetailsResponseModel2?.data?.first.message ?? [] :_chatDetailsResponseModel?.data?.message ?? []);
        } else{
          messages?.addAll((isInboxPage == true)?[] :_chatDetailsResponseModel?.data?.message ?? []);
        }
        onSuccessRes();

      } else {
        setState(ViewState.idle);
      }
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }
}
