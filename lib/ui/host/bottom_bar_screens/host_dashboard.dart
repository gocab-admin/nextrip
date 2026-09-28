import 'dart:developer';

import 'package:airstar_flutter/ui/host/bottom_bar_screens/calendar_page.dart';
import 'package:airstar_flutter/ui/host/bottom_bar_screens/listings_page.dart';
import 'package:airstar_flutter/ui/user/message/chat_list_screen.dart';
import 'package:airstar_flutter/utils/asset_imags/assets.dart';
import 'package:airstar_flutter/utils/components/color/app_color.dart';

import 'package:airstar_flutter/viewModel/view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';

import '../../../utils/constants/app_constant.dart';
import '../../../utils/shardHelper/preference_constant.dart';
import '../../../utils/shardHelper/preference_helper.dart';

import 'host_product/host_product_list.dart';
import 'menu.dart';


class HostDashboard extends StatefulWidget {
  final int? index;
  const HostDashboard({super.key,this.index});

  @override
  State<HostDashboard> createState() => _HostDashboardState();
}

class _HostDashboardState extends State<HostDashboard> {
  int _currentIndex = 0;
  HostListingViewModel? hostListingViewModel;
  ChatViewModel? chatViewModel;
  CreateListingViewModel? createListingViewModel;
  String? token = AppConstant.authToken;

  @override
  void initState() {
    _currentIndex = widget.index ?? 0;
    hostListingViewModel =
        Provider.of<HostListingViewModel>(context, listen: false);
    chatViewModel = Provider.of<ChatViewModel>(context, listen: false);
    createListingViewModel = Provider.of<CreateListingViewModel>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((_){
      if(createListingViewModel?.getStepsResponseModel == null) {
        createListingViewModel?.getSteps();
      }
    });
    super.initState();
  }

  loadData(int index) {
    switch (index) {
      case 0:
        break;
      case 1:
        WidgetsBinding.instance.addPostFrameCallback((_) async {
         await hostListingViewModel?.fetchUsersListing(status: "approve");
          hostListingViewModel?.fetchCalendarRecords();

        });
        break;
      case 2:
        WidgetsBinding.instance.addPostFrameCallback((_) {
          hostListingViewModel?.fetchUsersListing();
          hostListingViewModel?.clearFilter();
        });
        break;
      case 3:
        WidgetsBinding.instance.addPostFrameCallback((val) {
          if (token != null && token!.isNotEmpty) {
            chatViewModel?.fetchChatList();
          }
        });
        break;
      case 4:
        break;
    }
  }

  getToken() async {
    token = await PreferenceHelper.getString(PrefConstant.authToken);
    hostListingViewModel?.notify();
    log("token :: $token");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColorData.appSecondaryColor,
      bottomNavigationBar: BottomNavigationBar(
          currentIndex: _currentIndex,
          type: BottomNavigationBarType.fixed,
          selectedItemColor: AppColorData.appPrimaryColor,
          unselectedItemColor: AppColorData.iconDimColor,
          backgroundColor: AppColorData.appSecondaryColor,
          onTap: (int index) {
            if (_currentIndex != index) loadData(index);
            setState(() {
              _currentIndex = index;
            });
          },
          items: [
            BottomNavigationBarItem(
                icon: SvgPicture.asset(
                  SVGAssets.todayIcon,
                  height: 20,
                  colorFilter: _currentIndex == 0
                      ? ColorFilter.mode(
                          AppColorData.appPrimaryColor, BlendMode.srcIn)
                      : null,
                ),
                label: tr("today")),
            BottomNavigationBarItem(
                icon: SvgPicture.asset(
                  SVGAssets.calendarIcon,
                  colorFilter: _currentIndex == 1
                      ? ColorFilter.mode(
                          AppColorData.appPrimaryColor, BlendMode.srcIn)
                      : null,
                ),
                label: tr("calendar")),
            BottomNavigationBarItem(
                icon: SvgPicture.asset(
                  SVGAssets.listingsIcon,
                  colorFilter: _currentIndex == 2
                      ? ColorFilter.mode(
                          AppColorData.appPrimaryColor, BlendMode.srcIn)
                      : null,
                ),
                label: tr("listings")),
            BottomNavigationBarItem(
                icon: SvgPicture.asset(
                  SVGAssets.inboxIcon,
                  colorFilter: _currentIndex == 3
                      ? ColorFilter.mode(
                          AppColorData.appPrimaryColor, BlendMode.srcIn)
                      : null,
                ),
                label: tr("messages")),
            BottomNavigationBarItem(icon: Icon(Icons.menu), label: tr("menu"))
          ]),
      body: IndexedStack(
        index: _currentIndex,
        children: [
          HostProductList(token: token),
          CalendarPage(),
          ListingsPage(),
          InBoxScreen(token: token),
          Menu()
        ],
      ),
    );
  }
}
