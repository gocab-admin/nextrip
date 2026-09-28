import 'dart:io';

import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/user/notification_view_model.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../commonWidgets/button_widgets/common_elevated_button.dart';
import '../../../commonWidgets/widget/common_app_bar_widget.dart';
import '../../../commonWidgets/widget/common_divider_widget.dart';
import '../../../data/models/user/notification.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  NotificationViewModel? notificationViewModel;
  @override
  void initState() {
    super.initState();
    notificationViewModel = Provider.of<NotificationViewModel>(
      context,
      listen: false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(appBar: CommonAppBar(), body: _renderBody());
  }

  Widget _renderBody() {
    return Consumer<NotificationViewModel>(
      builder: (context, value, child) {
        int notification =
            value.notificationResponseModel?.data?.notifications?.length ?? 0;
        return Padding(
          padding: horizontalPadding(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CommonText(
                text: "notifications",
                style: AppTextStyle.loginHeadingStyle,
              ),
              doubleSpacer(),
              notification > 0 ? notificationList(value) : noNotificationView(),
            ],
          ),
        );
      },
    );
  }

  Widget notificationList(NotificationViewModel value) {
    int notification =
        value.notificationResponseModel?.data?.notifications?.length ?? 0;
    return Expanded(
      child: ListView.builder(
        itemCount: notification,
        itemBuilder: (context, index) {
          Notifications? data =
              value.notificationResponseModel?.data?.notifications?[index];
          return NotificationWidget(data);
        },
      ),
    );
  }

  Widget NotificationWidget(Notifications? data) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Flexible(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CommonText(
                    text: "${data?.title ?? ""}",
                    style: AppTextStyle.bodyTextStyle,
                  ),
                  doubleSpacer(height: 5),
                  CommonText(
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                    text: "${data?.message ?? ""}",
                    style: AppTextStyle.contentStyle.copyWith(
                      fontWeight: FontWeight.w300,
                    ),
                  ),
                  doubleSpacer(height: 5),
                  CommonText(
                    text: "${formatFullDateWithMonth(data?.createdAt)}",
                    style: AppTextStyle.contentStyle.copyWith(
                      fontWeight: FontWeight.w700,
                      fontSize: 10,
                    ),
                  ),
                ],
              ),
            ),
            CommonElevatedButton(
              isTextBtn: true,
              elevatedButtonName: '',
              icon: Icon(
                !kIsWeb && Platform.isIOS ? CupertinoIcons.delete : Icons.close,
                color: AppColorData.appIconBlack,
                weight: 23,
              ),
              onTap: () {
                notificationViewModel?.clearNotification(data?.id ?? '');
              },
            ),
          ],
        ),
        divider(thickness: 2, color: AppColorData.dividerColor),
      ],
    );
  }

  Widget noNotificationView() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        SizedBox(height: 150),
        Icon(Icons.notifications_none_rounded, size: 42),
        doubleSpacer(),
        CommonText(
          text: "noNotificationYet",
          style: AppTextStyle.bodyTextStyle,
        ),
        spacer(),
        CommonText(
          textAlign: TextAlign.center,
          text: "notificationSub",
          style: AppTextStyle.bodyTextStyle.copyWith(
            fontWeight: FontWeight.w300,
          ),
        ),
      ],
    );
  }
}
