import 'dart:convert';

import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/user/chat_list_response_model.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/ui/user/message/chat_list_screen_loader.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/user/chat_view_model.dart';
import 'package:flutter/material.dart';
import 'package:get/route_manager.dart';
import 'package:provider/provider.dart';

import '../../../routes/routes.dart';
import '../login_and_signup/login_screen.dart';

class InBoxScreen extends StatefulWidget {
  final String? token;

  const InBoxScreen({super.key, this.token});

  @override
  State<InBoxScreen> createState() => _InBoxScreenState();
}

class _InBoxScreenState extends State<InBoxScreen> {
  ChatViewModel? chatViewModel;

  @override
  void initState() {
    super.initState();
    chatViewModel = Provider.of<ChatViewModel>(context, listen: false);
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: CustomScrollView(
        slivers: [
          SliverAppBar(
            automaticallyImplyLeading: false,
            pinned: true,
            expandedHeight: 115,
            flexibleSpace: CommonSliverAppBar(
              isBackArrowPresent: false,
              title: "messages",
            ),
          ),
          SliverToBoxAdapter(
            child: widget.token != null && widget.token!.isNotEmpty
                ? _renderBody()
                : _loginDialogWidget(),
          )
        ],
      ),
    );
  }

  Widget _renderBody() {
    return Padding(
      padding: horizontalPadding(),
      child: Consumer<ChatViewModel>(builder: (context, model, child) {
        if (model.state == ViewState.busy) {
          return ChatListScreenLoader();
        }
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _filterMessage(model),
            doubleSpacer(),
            (model.chatListResponseModel?.data != null &&
                    model.chatListResponseModel!.data!.isNotEmpty)
                ? msgListWidget(model.chatListResponseModel, model)
                : EmptyWidget()
          ],
        );
      }),
    );
  }

  Widget msgListWidget(ChatListResponseModel? model, ChatViewModel value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        doubleSpacer(height: 40),
        Container(
          child: ListView.builder(
              physics: NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              itemCount: model?.data?.length,
              itemBuilder: (context, index) {
                var user = model?.data?[index].userDetails?.first;
                String? profilePicture = user?.profilePicture;
                String userName = user?.name ?? '';
                String firstLetter =
                    userName.isNotEmpty ? userName[0].toUpperCase() : '';

                return InboxCardWidget(
                  onTap: () {
                    print(
                        "model?.data?[index].userDetails?.first.name ::: ${user?.id}");
                    Get.toNamed(RouterName.chatScreen, arguments: {
                      RouterArguments.isInboxPage: true,
                      RouterArguments.profilePicture: profilePicture ?? "",
                    }, parameters: {
                      RouterArguments.inboxListData:
                          jsonEncode(model?.data?[index].toJson()),
                    });
                  },
                  titleText: userName,
                  unSeenCount: model?.data?[index].participants?[0].unseen,
                  subTitleText: model?.data?[index].lastMessageDate != null
                      ? convertDateTime(
                          "${model?.data?[index].lastMessageDate}")
                      : '',
                  bodyText: model?.data?[index].lastMessage ?? '',
                  leadingImg:
                      profilePicture != null && profilePicture.isNotEmpty
                          ? "${profilePicture}"
                          : null,
                  leadingWidget:
                      profilePicture == null || profilePicture.isEmpty
                          ? CircleAvatar(
                              radius: 24,
                              child: CommonText(
                                  text: firstLetter,
                                  style: AppTextStyle.headingStyle),
                              backgroundColor: AppColorData.shadowClr,
                            )
                          : null,
                );
              }),
        ),
      ],
    );
  }

  Widget _filterMessage(ChatViewModel value) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        spacing: 8,
        children: List.generate(value.messagesList.length, (index) {
          var messageList = value.messagesList[index];
          bool isSelected = value.selectedIndex == index;
          return GestureDetector(
            onTap: () {
              value.updateSelectedIndex(index);
              value.fetchChatList(status: messageList.toLowerCase());
            },
            child: Container(
              padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 6.0),
              decoration: BoxDecoration(
                  color:
                      isSelected ? AppColorData.blackClr : AppColorData.grey06,
                  borderRadius: BorderRadius.circular(20)),
              child: CommonText(
                text: messageList,
                style: AppTextStyle.subBodyHintTextStyle.copyWith(
                    color: isSelected
                        ? AppColorData.whiteClr
                        : AppColorData.bodyTextColor),
              ),
            ),
          );
        }),
      ),
    );
  }

  Widget EmptyWidget() {
    return Container(
      width: MediaQuery.of(context).size.width,
      height: MediaQuery.of(context).size.height * 0.65,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.message_outlined,
          ),
          spacer(),
          CommonText(
            text: "youDontHaveMsg",
            style: AppTextStyle.subBodyStyle,
          ),
          spacer(),
          CommonText(
            text: "whenYouReceive",
            style: AppTextStyle.subBodyHintTextStyle
                .copyWith(color: AppColorData.subBodyTextClr),
          ),
          spacer(),
          spacer(),
          Visibility(
            visible: false,
            child: Container(
              width: MediaQuery.of(context).size.width * 0.5,
              child: CommonElevatedButton(
                elevatedButtonName: "showAllMsg",
                elevatedButtonNameColor: AppColorData.bodyTextColor,
                border: Border.all(color: AppColorData.blackBorderClr),
                elevatedButtonColor: AppColorData.appSecondaryColor,
                onTap: () {},
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _loginDialogWidget() {
    return Padding(
      padding: horizontalPadding(vertical: 14),
      child: Container(
        width: MediaQuery.of(context).size.width,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CustomDivider(),
            doubleSpacer(),
            CommonText(
              text: "inBoxSub",
              style: AppTextStyle.headingStyle,
            ),
            doubleSpacer(),
            CommonText(
                text: "inBoxLoginSUb",
                style: AppTextStyle.subBodyHintTextStyle),
            doubleSpacer(),
            CommonElevatedButton(
              width: MediaQuery.of(context).size.width * 0.35,
              elevatedButtonColor: AppColorData.appPrimaryColor,
              elevatedButtonName: "login",
              onTap: () {
                Get.toNamed(RouterName.loginScreen);
              },
            )
          ],
        ),
      ),
    );
  }
}
