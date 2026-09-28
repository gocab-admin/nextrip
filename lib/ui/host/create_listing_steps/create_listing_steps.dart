import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/commonWidgets/widget/common_padding_alignment.dart';
import 'package:airstar_flutter/routes/router_name.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/viewModel/view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:get/get_core/src/get_main.dart';
import 'package:get/get_navigation/src/extension_navigation.dart';
import 'package:provider/provider.dart';

class CreateListingSteps extends StatefulWidget {
  const CreateListingSteps({super.key});

  @override
  State<CreateListingSteps> createState() => _CreateListingStepsState();
}

class _CreateListingStepsState extends State<CreateListingSteps> {
  CreateListingViewModel? createListingViewModel;
  ProductListingViewModel? listingViewModel;
  HostListingViewModel? hostListingViewModel;

  @override
  void initState() {
    createListingViewModel =
        Provider.of<CreateListingViewModel>(context, listen: false);
    listingViewModel =
        Provider.of<ProductListingViewModel>(context, listen: false);
    hostListingViewModel =   Provider.of<HostListingViewModel>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if(listingViewModel?.propertiesResponseModel == null){
        listingViewModel!.fetchProperties(listingViewModel!.categoryId);
      }

      createListingViewModel?.fetchPendingList();
    });
    super.initState();
  }

  void handleNextAction(CreateListingViewModel value) async {
    final currentRoute = value.pageRoutes.indexOf(value.currentPage?.name ?? "");

    final isIntroPage =
        value.isIntroPage && value.currentStepIndex == 0;

    var listingId = await PreferenceHelper.getString(
        PrefConstant.listingId);
    print("ListingId from steps>>>> $listingId");

    if(value.isIntroPage || value.isNextButtonEnabled(listingViewModel!)) {
      if (isIntroPage) {
        value.fetchInfo();

      } else if([8,9].contains(currentRoute)) {
        value.fetchInfo(listingId: listingId);

      } else if(currentRoute == 7) {
        value.addCoverImage();
        value.addGroupImage();

      } else if(currentRoute == 6) {
        value.updatePrivileges(listingId: listingId, productModel: listingViewModel);

      } else if(currentRoute == 10) {
        value.fetchPriceData();

      } else if(currentRoute == 11) {
        value.updateStatus().then((_){
          Get.toNamed(RouterName.hostDashboard);
        });

      } else {
        final excludedIndexes = [8,9,7,6];
        if(!value.isIntroPage && !excludedIndexes.contains(currentRoute)) {
          value.fetchBasicDetails(params: value.getCurrentPageParams(listingViewModel!));
        }
      }
      value.nextPage();
    }

  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        final value =
        Provider.of<CreateListingViewModel>(context, listen: false);
        if (value.currentStepIndex > 0 || value.currentPageIndex > 0) {
          value.previousPage();
          return false;
        }
        return true;
      },
      child: Scaffold(
        body:
        Consumer2<CreateListingViewModel, ProductListingViewModel>(builder: (context, value, productModel, child) {

          final currentPageName = value.currentPage?.name ?? "";

          return CommonPadding(
            child: Column(
              spacing: 20,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                GestureDetector(
                  onTap: () async {
                    value.fetchBasicDetails().then((_) {
                    hostListingViewModel?.fetchUsersListing().then((_) {
                        Get.toNamed(RouterName.hostDashboard,
                            arguments: {RouterArguments.index: '2'});
                   });
                    });
                  },
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 24.0),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16.0, vertical: 8.0),
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColorData.boxBorder),
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: CommonText(
                      text: "saveAndExit",
                      style: AppTextStyle.bodyTextStyle,
                    ),
                  ),
                ),
                Expanded(
                    child: SingleChildScrollView(
                      child: getPageWidget(value),
                    )),
                Row(
                  children: List.generate(value.steps.length, (index) {
                    return Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        child: LinearProgressIndicator(
                          value: value.getStepProgress(index),
                          backgroundColor: Colors.grey[300],
                          valueColor:
                          AlwaysStoppedAnimation<Color>(Colors.black),
                          minHeight: 5,
                        ),
                      ),
                    );
                  }),
                ),
                Row(
                  children: [
                    Flexible(
                      flex: 3,
                      child: CommonElevatedButton(
                        isTextBtn: true,
                        elevatedButtonName: "back",
                        onTap: () => value.previousPage(),
                      ),
                    ),
                    Flexible(
                      flex: 1,
                      child: CommonElevatedButton(
                        isLoad: value.state == ViewState.busy,
                        showLoader: true,
                        elevatedButtonName:(currentPageName == value.pageRoutes[11]) ? "save" : "next",
                        elevatedButtonColor: (value.isIntroPage || value.isNextButtonEnabled(productModel)) ? AppColorData.blackButtonClr : AppColorData.disableButtonClr,
                        onTap: () async {
                          if(value.isIntroPage || value.isNextButtonEnabled(productModel)) {
                            handleNextAction(value);
                          }
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        }),
      ),
    );
  }

  Widget listingIntroWidget(CreateListingViewModel value) {
    var data = value.getStepsResponseModel?.data;
    final currentStep = value.currentStepIndex;

    final stepData = data?.steps?[currentStep];
    if (stepData == null) return const SizedBox();

    return Column(
      spacing: 10,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: 20,
        ),
        Center(
            child: CacheImageWidget(
                fit: BoxFit.cover,
                errorBuilder: (context, url, error) {
                  return const ErrorImage(isSquare: true);
                },
                imageUrl: stepData.image ?? ""
            ),
        ),
        SizedBox(
          height: 40,
        ),
        CommonText(
            text: "${tr("step")} ${currentStep + 1}",
            style: AppTextStyle.titleStyle),
        CommonText(
            text: stepData.title,
            style: AppTextStyle.headingStyle
                .copyWith(fontWeight: FontWeight.bold, fontSize: 30)),
        CommonText(
            text: stepData.description, style: AppTextStyle.bodyTextStyle),
      ],
    );
  }

  Widget getPageWidget(CreateListingViewModel value) {
    if (value.isIntroPage) return listingIntroWidget(value);
    final route = value.currentPage?.name ?? "";
    return value.pageSteps[value.currentPage?.name]?.pageRoute() ??
        Center(child: CommonText(text: "Page not found: $route"));
  }
}
