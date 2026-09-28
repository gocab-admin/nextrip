import 'package:airstar_flutter/commonWidgets/widget/common_padding_alignment.dart';
import 'package:airstar_flutter/commonWidgets/widget/widget.dart';
import 'package:airstar_flutter/routes/router_name.dart';
import 'package:airstar_flutter/ui/host/bottom_bar_screens/subwidgets/switch_button_widgets.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';

import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/user/listing_view_model.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

import '../../../viewModel/host/create_listing_view_model.dart';
import '../../../viewModel/user/profile_view_model.dart';
import '../../user/Profile/Profile_main_Screen.dart';

class Menu extends StatefulWidget {
  const Menu({super.key});

  @override
  State<Menu> createState() => _MenuState();
}

class _MenuState extends State<Menu> {
  CreateListingViewModel? createListingViewModel;
  EditProfileViewModel? editProfileViewModel;


  List<ProfileDetails> profileDetails = [
    ProfileDetails(id: 0, icon: Icons.insights, data: ("insights")),
    ProfileDetails(id: 1, icon: Icons.receipt_long, data: ("reservations")),
    ProfileDetails(id: 2, icon: Icons.playlist_add, data: ("createNewListing")),
   // ProfileDetails(id: 3, icon: Icons.credit_card, data: ("transactionHistory")),
  ];


  @override
  void initState() {
    createListingViewModel = Provider.of<CreateListingViewModel>(context, listen: false);
    editProfileViewModel = Provider.of<EditProfileViewModel>(context, listen: false);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: Stack(
          children: [
            CustomScrollView(
              slivers: [
                SliverAppBar(
                  automaticallyImplyLeading: false,
                  pinned: true,
                  expandedHeight: 110,
                  flexibleSpace: CommonSliverAppBar(
                    isBackArrowPresent: false,
                    bottomPosition: 6,
                    title: "menu",
                  ),
                ),
                SliverList(delegate: SliverChildListDelegate([
                  Consumer2<CreateListingViewModel, ProductListingViewModel>(
                      builder: (context, value, productModel, child) {
                        return _renderBody(value, productModel);
                      }),

                ]))
              ],
            ),
            SwitchUserModeButton(
                text: "switchToTravelling",
                onTap: () async {
                editProfileViewModel?.updateUserMode(userMode: "traveller");
                Get.offAllNamed(RouterName.dashBoard);
              },
            )
          ],
        ));
  }

  Widget _renderBody(CreateListingViewModel value, ProductListingViewModel productModel) {
    return CommonPadding(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ProfileCard(),
          SettingsList(from: "host",),
          ListView.builder(
              padding: EdgeInsets.zero,
               shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              itemCount: profileDetails.length,
              itemBuilder: (context, index){
                 var profile = profileDetails[index];
                return Container(
                  decoration: BoxDecoration(
                    border: Border(bottom: BorderSide(color: AppColorData.dividerColor))
                  ),
                  child: ListTile(
                    onTap: () => _navigateToScreen(index, productModel, value),
                    contentPadding: EdgeInsets.zero,
                    title: CommonText(text: profile.data,
                    style: AppTextStyle.bodyTextStyle,),
                   // leading: SvgPicture.asset(profileDetails.icon),
                    leading: Icon(profile.icon),
                    trailing: Icon(Icons.arrow_forward_ios, size: 16,),
                  ),
                );
              }),
          doubleSpacer(height: 30),
          LogoutWidget(),
        ],
      ),
    );
  }

  void _navigateToScreen(int index, ProductListingViewModel productModel, CreateListingViewModel value) {
    switch(index) {
      case 0:
        Get.toNamed(RouterName.insightsPage);
        break;
      case 1:
        Get.toNamed(RouterName.hostReservationPage);
        break;
      case 2:
        value.resetProgress(productModel);
        Get.toNamed(RouterName.getSteps);
      case 3:
        break;
    }
  }
}
