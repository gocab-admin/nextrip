import 'dart:convert';
import 'dart:developer';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../../commonWidgets/button_widgets/common_elevated_button.dart';
import '../../../../data/models/user/chat_details_responde_model_two.dart';
import '../../../../data/models/user/listing_detail_response_model.dart';
import '../../../../routes/router_name.dart';
import '../../../../viewModel/user/product_detail_view_model.dart';
import '../../login_and_signup/login_screen.dart';
import 'package:airstar_flutter/commonWidgets/widget/widget.dart';
import 'package:airstar_flutter/utils/utils.dart';

class MeetHostView extends StatelessWidget {
  final ProductDetailViewModel viewModel;
  final ListingDetailResponseModel model;
  final String listingId;
  final bool? isIndexPage;
  final Future<void> Function() getToken;
  final String? token;

  const MeetHostView(
      {super.key,
      required this.viewModel,
      required this.model,
      required this.listingId,
      this.isIndexPage = false,
        required this.getToken,
         this.token,
      });

  @override
  Widget build(BuildContext context) {

    Listing? data = model.data?.listing?.first;
    var screenHeight = MediaQuery.of(context).size.height;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CommonText(
            text: "meetYourHost",
            style: AppTextStyle.titleStyle,
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 10),
            child: GestureDetector(
              onTap: () {
                Get.toNamed(RouterName.meetHostViewScreen, arguments: {
                  RouterArguments.listingId: listingId,
                });
              },
              child: Container(
                  padding: EdgeInsets.symmetric(vertical: 20, horizontal: 10),
                  margin: EdgeInsets.symmetric(vertical: 20),
                  decoration: BoxDecoration(
                    boxShadow: [
                      BoxShadow(
                          color: Color(0xff626262).withOpacity(0.25),
                          spreadRadius: 0,
                          blurRadius: 25,
                          offset: Offset(2, 2)),
                    ],
                    color: AppColorData.appSecondaryColor,
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Expanded(
                        flex: 6,
                        child: Hero(
                          tag: "meetYourHost",
                          transitionOnUserGestures: true,
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Stack(
                                children: [
                                  Container(
                                    height: 100,
                                    width: 100,
                                    decoration: BoxDecoration(
                                        border: Border.all(
                                            color: AppColorData.boxBorder
                                                .withOpacity(0.6)),
                                        borderRadius:
                                            BorderRadius.circular(50)),
                                    child: ClipOval(
                                      child: CacheImageWidget(
                                          imageUrl:data?.providerData!.profileImage ?? "",
                                          fit: BoxFit.cover,
                                          width: 80.0,
                                          height: 80.0,
                                          // placeholder: (context, url) =>
                                          //     ProgressLoader(),
                                          errorBuilder: (context, url, error) =>
                                              ErrorImage()),
                                    ),
                                  ),
                                  //---------------------------------Super host icon setup here ---------------------------------------
                                  // Positioned(
                                  //   bottom: 0,
                                  //     right: 0,
                                  //     child: CircleAvatar(
                                  //       backgroundColor: AppColorData.appPrimaryColor,
                                  //       radius: 20,
                                  //       backgroundImage: SvgPicture.asset(SVGAssets.hostIcon1,)
                                  //     ))
                                ],
                              ),
                              CommonText(
                                  text: data?.providerData!.firstname,
                                  style: AppTextStyle.titleStyle),
                            ],
                          ),
                        ),
                      ),
                      Expanded(
                        flex: 4,
                        child: Column(
                          // mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            CommonText(
                              text: data?.totalReviewCount.toString(),
                              style: AppTextStyle.bodyTextStyle,
                            ),
                            CommonText(
                              text: "reviews",
                              style: AppTextStyle.contentStyle,
                            ),
                            CustomDivider(),
                            CommonText(
                              text: data?.totalRatingCount.toString(),
                              style: AppTextStyle.bodyTextStyle,
                            ),
                            CommonText(
                              text: "rating",
                              style: AppTextStyle.contentStyle,
                            ),
                            CustomDivider(),
                            CommonText(
                              text: viewModel
                                  .calculateHostingPeriod(
                                      data?.providerData?.verifiedDate ??
                                          DateTime.now())
                                  .toString(),
                              style: AppTextStyle.bodyTextStyle,
                            ),
                            CommonText(
                              text: "monthsOnAirstar",
                              style: AppTextStyle.contentStyle,
                            ),
                          ],
                        ),
                      ),
                    ],
                  )),
            ),
          ),
          CommonElevatedButton(
            width: MediaQuery.of(context).size.width * 0.55,
            onTap: () {
              getToken();
              print("token>>>>> $token");
              if (token != null) {
                if (isIndexPage == true) {
                  Navigator.of(context).pop();
                } else {
                  Datum? inboxListData = null;
                  Get.toNamed(RouterName.chatScreen, arguments: {
                    //RouterArguments.hostDetailsData: data?.toJson(),
                    RouterArguments.profilePicture:
                        data?.providerData?.profileImage ?? "",
                    RouterArguments.isInboxPage: false,
                    RouterArguments.inboxListData: inboxListData,
                  }, parameters: {
                    RouterArguments.hostDetailsData: jsonEncode(data?.toJson()),
                  });
                  Future.delayed(Duration.zero, () {
                    log("RouterArguments.hostDetailsData :: ${Get.parameters[RouterArguments.hostDetailsData]} \n data ::$data");
                    log("RouterArguments.profilePicture :: ${Get.arguments[RouterArguments.profilePicture]} \n data ::${data?.providerData?.profileImage ?? ""}");
                  });
                }
              } else {
                showCustomModalBottomSheet(
                    showDivider: false,
                    showIcon: false,
                    maxHeight: screenHeight,
                    isDismissible: false,
                    backgroundColor: AppColorData.appSecondaryColor,
                    context: context,
                    builder: (context) => LoginScreen(
                          isBottomSheet: true,
                        ));
              }
            },
            elevatedButtonNameColor: AppColorData.appSecondaryColor,
            elevatedButtonColor: AppColorData.blackButtonClr,
            elevatedButtonName: "msgHost",
          ),
        ],
      ),
    );
  }
}