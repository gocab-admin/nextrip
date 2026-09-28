import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/commonWidgets/widget/common_price_widget.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

import '../../../routes/router_name.dart';

class GuestPricePage extends StatefulWidget {
  @override
  _ExpandableState createState() => _ExpandableState();
}

class _ExpandableState extends State<GuestPricePage> {
  CreateListingViewModel? createListingViewModel;
  CommonViewModel? commonViewModel;

  @override
  void initState() {
    createListingViewModel =
        Provider.of<CreateListingViewModel>(context, listen: false);
    commonViewModel = Provider.of<CommonViewModel>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      createListingViewModel?.buildPriceDetailsFromSettings(commonViewModel!);
    });

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<CreateListingViewModel>(builder: (context, value, child) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: 10.0,
        children: [
          CommonText(
            text: "nowSetYourPrice",
            style: AppTextStyle.headingStyle,
          ),
          CommonText(
            text: "youCanChangeItAnytime",
            style: AppTextStyle.bodyTextStyle,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Column(
                children: [
                  SizedBox(
                    width: MediaQuery.of(context).size.width * 0.4,
                    child: CommonTextFromField(
                      textAlign: TextAlign.center,
                      controller: value.priceController,
                      textStyle: AppTextStyle.headingStyle,
                      enabled: value.hideEdit,
                      keyboardType: TextInputType.number,
                    ),
                  ),
                  Visibility(
                    visible: value.hideEdit,
                    child: CommonElevatedButton(
                      width: MediaQuery.of(context).size.width * 0.25,
                      height: MediaQuery.of(context).size.height * 0.05,
                      elevatedButtonName: "save",
                      elevatedButtonColor: AppColorData.blackButtonClr,
                      elevatedButtonNameColor: AppColorData.whiteClr,
                      onTap: () => value.toggleEdit(),
                    ),
                  ),
                  spacer(),
                  CommonText(
                    text: "${tr("guestPrice")}${value.priceController.text}",
                    style: AppTextStyle.subBodyStyle,
                  ),
                ],
              ),
              SizedBox(width: 20.0),
              Visibility(
                visible: !value.hideEdit,
                child: GestureDetector(
                  onTap: () => value.toggleEdit(),
                  child: Container(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.grey),
                    ),
                    padding: EdgeInsets.all(4),
                    child: Icon(Icons.edit, size: 18),
                  ),
                ),
              ),
            ],
          ),
          Theme(
              data:
                  Theme.of(context).copyWith(dividerColor: Colors.transparent),
              child: ExpansionTile(
                initiallyExpanded: value.isExpanded,
                tilePadding: EdgeInsets.zero,
                iconColor: AppColorData.appIconBlack,
                title: CommonText(
                  text: "moreDetails",
                  style: AppTextStyle.titleStyle,
                ),
                children: [
                  Padding(
                    padding: EdgeInsets.all(0.0),
                    child: MediaQuery.removePadding(
                        context: context,
                        removeTop: true,
                        child: ListView.builder(
                            itemCount: value.priceDetails.length,
                            shrinkWrap: true,
                            physics: NeverScrollableScrollPhysics(),
                            itemBuilder: (context, index) {
                              final item = value.priceDetails[index];
                              return CommonPriceWidget(
                                index: index,
                                controller:
                                    (item.title == ("extraPricePerGuest"))
                                        ? value.guestPriceController
                                        : value.hourPriceController,
                              );
                            })),
                  )
                ],
              ))
        ],
      );
    });
  }
}

class ReviewListingPage extends StatefulWidget {
  @override
  State<ReviewListingPage> createState() => _ReviewListingPageState();
}

class _ReviewListingPageState extends State<ReviewListingPage> {
  CreateListingViewModel? createListingViewModel;
  HostListingViewModel? hostListingViewModel;
  EditProfileViewModel? editProfileViewModel;

  @override
  void initState() {
    createListingViewModel =
        Provider.of<CreateListingViewModel>(context, listen: false);
    hostListingViewModel =
        Provider.of<HostListingViewModel>(context, listen: false);
    editProfileViewModel =
        Provider.of<EditProfileViewModel>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      var listingId = await PreferenceHelper.getString(PrefConstant.listingId);
      hostListingViewModel?.fetchHostListing(listingId);
    });

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<CreateListingViewModel, HostListingViewModel>(
        builder: (context, value, hostModel, child) {
      var data = hostModel.hostListingResponseModel?.data?.listing;
      return Column(
          spacing: 20.0,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CommonText(
              text: "reviewYourListings",
              style: AppTextStyle.headingStyle,
            ),
            CommonText(
              text: "hereWhatWeShow",
              style: AppTextStyle.bodyTextStyle,
            ),
            GestureDetector(
              onTap: () {
                List<String> images = [];
                images.add(data?.first.attachmentData?.image?.coverImage ?? "");
                images.addAll(data?.first.attachmentData?.image?.groupImage
                        ?.map((e) => e.imagePath ?? "")
                        .toList() ??
                    []);

                Get.toNamed(
                  RouterName.productDetailScreen,
                  arguments: {
                    RouterArguments.listingId: data?.first.id ?? '',
                    RouterArguments.images: images,
                    RouterArguments.wishlist: false,
                  },
                );
              },
              child: Container(
                  padding: EdgeInsets.all(16.0),
                  margin: EdgeInsets.all(16.0),
                  decoration: BoxDecoration(
                    color: AppColorData.whiteClr,
                    borderRadius: BorderRadius.circular(16.0),
                    boxShadow: [
                      BoxShadow(
                          color: AppColorData.blackClr.withValues(alpha: 0.2),
                          offset: Offset(0, 4),
                          blurRadius: 8),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    spacing: 10.0,
                    children: [
                      Stack(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(16),
                            child: CacheImageWidget(
                                height: 250,
                                width: MediaQuery.of(context).size.width * 1.0,
                                fit: BoxFit.cover,
                                errorBuilder: (context, url, error) {
                                  return const ErrorImage(isSquare: true);
                                },
                                imageUrl: data?.first.attachmentData?.image?.coverImage ?? ""),
                          ),
                          Positioned(
                            left: 10,
                            top: 10,
                            child: Container(
                              padding: EdgeInsets.symmetric(
                                  horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                  color: AppColorData.whiteClr,
                                  borderRadius: BorderRadius.circular(6)),
                              child: CommonText(
                                text: "showPreview",
                                style: AppTextStyle.buttonTextStyle,
                              ),
                            ),
                          )
                        ],
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              CommonText(
                                text: "${data?.first.propertyName}",
                                style: AppTextStyle.subBodyStyle,
                              ),
                              CommonText(
                                text:
                                    "${hostModel.savedCurrencySymbol ?? '\$'}${editProfileViewModel?.convertPrice(data?.first.priceData?.pricing?.perHour?.toString())} ${tr("hour")} | ${hostModel.savedCurrencySymbol ?? '\$'}${editProfileViewModel?.convertPrice(data?.first.priceData?.pricing?.perDay?.toString())} ${tr("night")}",
                                style: AppTextStyle.subBodyStyle,
                              )
                            ],
                          ),
                          Row(
                            children: [
                              CommonText(
                                text: "New",
                                style: AppTextStyle.subBodyStyle,
                              ),
                              Icon(Icons.star)
                            ],
                          )
                        ],
                      )
                    ],
                  )),
            ),
            CommonText(
              text: "whatsNext",
              style: AppTextStyle.titleStyle,
            ),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Icon(Icons.calendar_month_outlined),
                SizedBox(width: 10),
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      CommonText(
                        text: "confirmFewDetailsAndPublish",
                        style: AppTextStyle.subBodyStyle,
                      ),
                      CommonText(
                        text: "weLetYouKnowToVerify",
                        style: AppTextStyle.subBodyStyle,
                      )
                    ],
                  ),
                )
              ],
            )
          ]);
    });
  }
}
