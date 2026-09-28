import 'dart:io';

import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/user/chat_details_response_model.dart';
import 'package:airstar_flutter/data/models/user/listing_detail_response_model.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/user/chat_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:get/route_manager.dart';
import 'package:grouped_list/grouped_list.dart';
import 'package:provider/provider.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

import '../../../data/models/user/chat_list_response_model.dart';
import '../../../routes/routes.dart';

class ChatScreen extends StatefulWidget {
  final Listing? hostDetailsData;
  final bool isInboxPage;
  final Datum? inboxListData;
  final String? profilePicture;
  const ChatScreen(
      {super.key,
      this.hostDetailsData,
      this.isInboxPage = false,
      this.inboxListData,
      this.profilePicture});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController textEditingController = TextEditingController();
  late IO.Socket socket;
  ChatViewModel? chatViewModel;

  bool? isSendButton = false;

  String? typeMessage = '';

  String? userId = '';
  String? receiverId = '';
  bool? showLoadWidget = false;

  initSocket() {
    showLoadWidget = false;
    socket = IO.io(
        EndPointConstants.socketServerURL,
        IO.OptionBuilder()
            .setTransports(['websocket'])
            .disableAutoConnect()
            .build()
        /*<String, dynamic>{
      'autoConnect': false,
      'transports': ['websocket'],
    }*/
        );
    socket.connect();
    Logger.appLogs("socket connecting >>>>>");

    socket.onConnect((_) {
      Logger.appLogs('Connection established');
      Map messageMap = {
        'senderId': userId,
        'receiverId': widget.hostDetailsData?.providerData?.id ??
            chatViewModel?.inboxChatDetailsResponseModel2?.userData?.first
                .userDetails?.first.userId,
        'chatId': (widget.isInboxPage == false)
            ? chatViewModel?.chatDetailsResponseModel?.data?.id
            : chatViewModel?.inboxChatDetailsResponseModel2?.userData?.first.id,
      };
      print(
          "widget.hostDetailsData?.providerData?.id :: ${widget.hostDetailsData?.providerData?.id}");
      print(
          "chatViewModel?.chatDetailsResponseModel2?.userData?.first.userDetails?.last.userId :: ${chatViewModel?.inboxChatDetailsResponseModel2?.userData?.first.userDetails?.first.userId}");
      print(
          " chatViewModel?.chatDetailsResponseModel?.data?.id :: ${chatViewModel?.chatDetailsResponseModel?.data?.id}");
      print(
          "chatViewModel?.chatDetailsResponseModel2?.userData?.first.id :: ${chatViewModel?.inboxChatDetailsResponseModel2?.userData?.first.id}");
      print("jooin chanel :: $messageMap");
      socket.emit('joinChannel', messageMap);
    });
    socket.onDisconnect((_) => Logger.appLogs('Connection Disconnected'));
    socket.onConnectError((err) => Logger.appLogs("onConnectError :: $err"));
    socket.onError((err) => Logger.appLogs("onError :: $err"));

    socket.on("messageBroadcast", (data) {
      Logger.appLogs("received data >>>> ${data}");
      Map<String, dynamic> dataMap = data as Map<String, dynamic>;
      SocketMessageData chatData = SocketMessageData.fromJson(dataMap['data']);

      //chatViewModel!.messages!.add(chatData.newMessages.last);
      final receivedMessage = Message(
        message: chatData.newMessages.first.message,
        date: chatData.newMessages.first.date, //convertedDates(data['c_time']),
        userId: chatData.newMessages.first.userId,
      );

      print(
          "userId :: $userId and chatData.newMessages.last.userId :: ${chatData.newMessages.first.userId}");
      // if (userId != chatData.newMessages.first.userId) {
      chatViewModel?.messages?.add(receivedMessage);
      // model.messages!.insert(0,receivedMessage);
      // }
      chatViewModel!.notify();
    });
    Map seenMessageMap = {
      'userId': userId,
      'chatId': chatViewModel?.chatDetailsResponseModel?.data?.id ??
          chatViewModel?.inboxChatDetailsResponseModel2?.userData?.first.id,
    };

    socket.emitWithAck('seenMessages', seenMessageMap, ack: (data) {
      Logger.appLogs('ack data seenMessages :: $seenMessageMap');
      if (data != null) {
      } else {
        print("data is null");
      }
    });
    chatViewModel?.notify();
  }

  @override
  void initState() {
    super.initState();
    chatViewModel = Provider.of<ChatViewModel>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      fetchData();
    });
  }

  fetchData() async {
    String userid = await PreferenceHelper.getString(PrefConstant.userId);
    userId = userid;
    print("userid :: $userid");
    chatViewModel?.fetchChatDetails(
        isInboxPage: widget.isInboxPage,
        chatId: widget.inboxListData?.id,
        userId: userId,
        hostId: widget.hostDetailsData?.providerData?.id,
        categoryId: widget.hostDetailsData?.propertyCategoryId ?? '',
        listingId: widget.hostDetailsData?.id ?? '',
        onSuccessRes: () {
          initSocket();
        });
  }

  @override
  void dispose() {
    socket.dispose();
    //scrollcontroller.dispose();
    socket.disconnect();

    chatViewModel?.messages = [];
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar(),
      body: Consumer<ChatViewModel>(builder: (context, viewModel, child) {
        return (viewModel.state == ViewState.busy)
            ? Loader(
                color: AppColorData.blackClr,
              )
            : Column(
                children: [
                  Expanded(
                    child: Container(
                      width: MediaQuery.of(context).size.width,
                      color: AppColorData.appSecondaryColor,
                      child: GroupedListView<Message, DateTime>(
                          reverse: true,
                          order: GroupedListOrder.DESC,
                          // useStickyGroupSeparators: true,
                          // floatingHeader: true,
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 8),
                          elements: chatViewModel?.messages ?? [],
                          groupBy: (message) => DateTime(
                                message.date!.year,
                                message.date!.month,
                                message.date!.day,
                              ),
                          groupHeaderBuilder: (Message message) => SizedBox(
                                height: 40,
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Expanded(
                                        flex: 2, child: SizedBox.shrink()),
                                    Center(
                                      child: Container(
                                        decoration: BoxDecoration(
                                          borderRadius:
                                              BorderRadius.circular(6),
                                          color: Colors.transparent,
                                        ),
                                        child: Padding(
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 6, vertical: 4),
                                          child: CommonText(
                                            text: (message.date!.day ==
                                                    DateTime.now().day)
                                                ? 'Today'
                                                : DateFormat.yMMMd()
                                                    .format(message.date!),
                                            style: AppTextStyle
                                                .subBodyHintTextStyle
                                                .copyWith(
                                                    color: AppColorData
                                                        .subBodyTextClr),
                                          ),
                                        ),
                                      ),
                                    ),
                                    const Expanded(
                                        flex: 2, child: SizedBox.shrink()),
                                  ],
                                ),
                              ),
                          itemBuilder: (context, Message message) {
                            return Align(
                              alignment: message.userId == userId
                                  ? Alignment.centerRight
                                  : Alignment.centerLeft,
                              child: ConstrainedBox(
                                constraints: const BoxConstraints(
                                  maxWidth: 260,
                                  minWidth: 40,
                                  minHeight: 50,
                                ),
                                child: Container(
                                  // height: 60,
                                  color: AppColorData.transparent,
                                  child: Stack(
                                    children: [
                                      Padding(
                                        padding:
                                            const EdgeInsets.only(bottom: 14.0),
                                        child: Card(
                                          elevation: 0,
                                          color: (message.userId == userId)
                                              ? AppColorData.blackClr
                                              : AppColorData.ChatScrnMsgRcvrClr,
                                          shape: (message.userId == userId)
                                              ? const RoundedRectangleBorder(
                                                  borderRadius: BorderRadius.only(
                                                      topLeft:
                                                          Radius.circular(10),
                                                      topRight:
                                                          Radius.circular(10),
                                                      bottomLeft:
                                                          Radius.circular(10),
                                                      bottomRight:
                                                          Radius.circular(0)))
                                              : const RoundedRectangleBorder(
                                                  borderRadius: BorderRadius.only(
                                                      topLeft:
                                                          Radius.circular(10),
                                                      topRight:
                                                          Radius.circular(10),
                                                      bottomLeft:
                                                          Radius.circular(0),
                                                      bottomRight:
                                                          Radius.circular(10))),
                                          child: ConstrainedBox(
                                            constraints: const BoxConstraints(
                                              maxWidth: 260,
                                              minWidth: 62,
                                              minHeight: 20,
                                            ),
                                            child: Padding(
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                      vertical: 10,
                                                      horizontal: 12),
                                              child: /*Column(
                                            mainAxisSize: MainAxisSize.min,
                                            crossAxisAlignment: (message.userId == userId)? CrossAxisAlignment.end:CrossAxisAlignment.start,
                                            children: [*/
                                                  CommonText(
                                                text: message.message ?? '',
                                                style: AppTextStyle
                                                    .subBodyHintTextStyle
                                                    .copyWith(
                                                        color: (message
                                                                    .userId ==
                                                                userId)
                                                            ? AppColorData
                                                                .appSecondaryColor
                                                            : AppColorData
                                                                .titleTxtHighlightClr),
                                              ),
                                              /* CommonText(

                                                //DateFormat('h:mm a').format(message.date!),
                                                  text:  convertToIST(message.date!.toString()),
                                                  textAlign: TextAlign.end,
                                                  style: AppTextStyle.contentStyle.copyWith(color: AppColorData.subBodyTextClr)
                                              ),
                                            ],
                                          ),*/
                                            ),
                                          ),
                                        ),
                                      ),
                                      Positioned(
                                        bottom:
                                            (message.userId == userId) ? 0 : 0,
                                        right: (message.userId == userId)
                                            ? 6
                                            : null,
                                        left: (message.userId == userId)
                                            ? null
                                            : 6,
                                        child: Container(
                                          color: AppColorData.transparent,
                                          child: Padding(
                                              padding: const EdgeInsets.only(
                                                  left: 6),
                                              child: Align(
                                                alignment: Alignment.topRight,
                                                child: CommonText(

                                                    //DateFormat('h:mm a').format(message.date!),
                                                    text: convertToIST(message
                                                        .date!
                                                        .toString()),
                                                    textAlign: TextAlign.end,
                                                    style: AppTextStyle
                                                        .contentStyle
                                                        .copyWith(
                                                            color: AppColorData
                                                                .subBodyTextClr)),
                                              )),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          }),
                    ),
                  ),
                  chatTypingWidget(viewModel.chatDetailsResponseModel)
                ],
              );
      }),
    );
  }

  Widget chatTypingWidget(ChatDetailsResponseModel? model) {
    return Container(
      color: AppColorData.appSecondaryColor,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          spacer(),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: AnimatedContainer(
                    duration: Duration(milliseconds: 200),
                    // width: MediaQuery.of(context).size.width * 0.75,
                    decoration: BoxDecoration(
                        border: Border.all(
                          color: AppColorData.boxBorder,
                        ),
                        borderRadius: BorderRadius.circular(24)),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                      child: IntrinsicHeight(
                        child: ConstrainedBox(
                          constraints: const BoxConstraints(
                            maxHeight: 90,
                            minHeight: 50,
                          ),
                          child: Align(
                            alignment: Alignment.center,
                            child: TextField(
                              expands: true,
                              controller: textEditingController,
                              cursorColor: AppColorData.appPrimaryColor,
                              decoration: InputDecoration(
                                contentPadding: EdgeInsets.symmetric(
                                    horizontal: 2, vertical: 16),
                                hintText: tr("typeHere"),
                                hintStyle: AppTextStyle.subBodyHintTextStyle
                                    .copyWith(
                                        color: AppColorData.subBodyTextClr),
                                border: InputBorder.none,
                              ),
                              enableSuggestions: false,
                              autocorrect: false,
                              maxLines: null,
                              textInputAction: TextInputAction.newline,
                              keyboardType: TextInputType.multiline,
                              onChanged: (value) {
                                setState(() {
                                  if (value != '' && value.isNotEmpty) {
                                    typeMessage = value;
                                    isSendButton = true;
                                  } else {
                                    isSendButton = false;
                                  }
                                });
                              },
                              onSubmitted: (text) {
                                text = '$text\n';
                              },
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                (isSendButton == true)
                    ? SizedBox(
                        width: 10,
                      )
                    : SizedBox.shrink(),
                (typeMessage == null ||
                        typeMessage!.isEmpty ||
                        isSendButton == false)
                    ? SizedBox.shrink()
                    : FloatingActionButton(
                        onPressed: () {
                          if (typeMessage != '') {
                            // final message = Message(
                            //     message: textEditingController.text,
                            //     date: DateTime.now(),
                            //     userId: userId);
                            print(
                                "chatViewModel?.chatDetailsResponseModel2?.userData?.first.userDetails?.last.userId :: ${chatViewModel?.inboxChatDetailsResponseModel2?.userData?.first.userDetails?.first.userId}");
                            print(
                                " widget.hostDetailsData?.providerData?.id :: ${widget.hostDetailsData?.providerData?.id}");
                            Map messageMap = {
                              'message': textEditingController.text,
                              'senderId': userId,
                              'receiverId':
                                  widget.hostDetailsData?.providerData?.id ??
                                      chatViewModel
                                          ?.inboxChatDetailsResponseModel2
                                          ?.userData
                                          ?.first
                                          .userDetails
                                          ?.first
                                          .userId,
                              'chatId': model?.data?.id ??
                                  chatViewModel?.inboxChatDetailsResponseModel2
                                      ?.userData?.first.id,
                            };

                            socket.emitWithAck('sendMessage', messageMap,
                                ack: (data) {
                              Logger.appLogs(
                                  'ack data sendMessage :: $messageMap');
                              // Logger.appLogs('ack data from server :: $data');
                              if (data != null) {
                              } else {
                                print("data is null");
                              }
                            });
                            Map seenMessageMap = {
                              'userId': userId,
                              'chatId': model?.data?.id ??
                                  chatViewModel?.inboxChatDetailsResponseModel2
                                      ?.userData?.first.id,
                            };

                            socket.emitWithAck('seenMessages', seenMessageMap,
                                ack: (data) {
                              Logger.appLogs(
                                  'ack data seenMessages  on send:: $seenMessageMap');
                              if (data != null) {
                              } else {
                                print("data is null");
                              }
                            });
                            setState(() {
                              textEditingController.clear();
                              isSendButton = false;
                            });
                          } else {
                            null;
                          }
                        },
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16)),
                        backgroundColor: AppColorData.blackButtonClr,
                        child: Icon(
                            (isSendButton!)
                                ? Icons.send_outlined
                                : Icons.keyboard_voice_rounded,
                            color: AppColorData.appSecondaryColor),
                      )
              ],
            ),
          ),
          const SizedBox(
            height: 10,
          )
        ],
      ),
    );
  }

  PreferredSizeWidget appBar() {
    return CommonAppBar(
      backgroundColor: AppColorData.appSecondaryColor,
      isTitleWidget: true,
      centerTitle: false,
      elevation: 0,
      leadingWidth: 40,
      automaticallyImplyLeading: false,
      isLeadingWidget: true,
      leading: CommonElevatedButton(
        elevatedButtonName: "",
        isTextBtn: true,
        onTap: () {
          if (widget.isInboxPage) {
            chatViewModel?.fetchChatList().then((val) {
              Navigator.pop(context);
            });
          } else {
            Navigator.pop(context);
          }
        },
        icon: Icon((!kIsWeb && Platform.isIOS) ? CupertinoIcons.back : Icons.arrow_back,
            color: AppColorData.appIconBlack, weight: 23),
      ),
      titleWidget: Row(
        children: [
          widget.profilePicture!.isNotEmpty
              ? Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                      border: Border.all(
                          color: AppColorData.boxBorder.withOpacity(0.6)),
                      shape: BoxShape.circle,
                      image: DecorationImage(
                          image: ImageUtils.getCachedImageProvider(
                              "${widget.profilePicture}", context))),
                )
              : CircleAvatar(
                  radius: 24,
                  child: CommonText(
                      text: widget
                              .hostDetailsData?.providerData?.firstname?[0] ??
                          widget.inboxListData?.userDetails?.first.name?[0] ??
                          '',
                      style: AppTextStyle.headingStyle),
                  backgroundColor: AppColorData.shadowClr,
                ),
          // ClipRRect(
          //   borderRadius: BorderRadius.circular(100),
          //   child: Container(
          //     color: Colors.transparent,
          //     width: 50,
          //     height: 50,
          //     child: CachedNetworkImage(
          //       fit: BoxFit.cover,
          //       errorWidget: (context, url, error) {
          //         return Image.asset(
          //           PNGAssets.defaultImage,
          //           fit: BoxFit.fill,
          //         );
          //       },
          //       imageUrl:
          //           "${EndPointConstants.baseurl}/${widget.hostDetailsData?.providerData?.profileImage ?? ''}",
          //     ),
          //   ),
          // ),
          const SizedBox(width: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CommonText(
                  text: widget.hostDetailsData?.providerData?.firstname ??
                      widget.inboxListData?.userDetails?.first.name ??
                      '',
                  style: AppTextStyle.titleStyle),
              Consumer<ChatViewModel>(builder: (context, viewModel, child) {
                if (viewModel.state == ViewState.busy) {
                  return SizedBox();
                }
                var listing = viewModel
                    .inboxChatDetailsResponseModel2?.listingDetails?.first;
                List<String> images = [];
                images.add(listing?.listingImages?.coverImage ?? "");
                images.addAll(listing?.listingImages?.groupImage
                        ?.map((e) => e.imagePath ?? "")
                        .toList() ??
                    []);
                return GestureDetector(
                  onTap: () {
                    if (widget.isInboxPage) {
                      /*  showCustomModalBottomSheet(
                          title: "Booking status",
                          context: context,
                          backgroundColor: AppColorData.appSecondaryColor,
                          builder: (context) => ProductDetailScreen(listingId: listing!.listingId!, wishlist: false, images: images));*/
                      Get.toNamed(RouterName.productDetailScreen, arguments: {
                        RouterArguments.listingId: listing!.listingId!,
                        RouterArguments.wishlist: false,
                        RouterArguments.images: images,
                        RouterArguments.inBoXToDetails: "true",
                      });
                    }
                  },
                  child: CommonText(
                      text: listing?.listingName ?? "",
                      style: AppTextStyle.subBodyHintTextStyle
                          .copyWith(color: AppColorData.subBodyTextClr)),
                );
              }),
            ],
          )
        ],
      ),
      /* actions: [
        IconButton(
          onPressed: () {
            Logger.appLogs("location is pressed");
          },
          splashRadius: 1,
          icon: SvgPicture.asset(SVGAssets.phoneIcon),
        )
      ],*/
    );
  }
}

/*
class Message {
  final String text;
  final DateTime date;
  final bool isSendByMe;

  Message({required this.text, required this.date, required this.isSendByMe});
}*/
