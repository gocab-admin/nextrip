import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/routes/router_name.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/host/create_listing_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

import '../../../commonWidgets/widget/common_padding_alignment.dart';
import '../../../viewModel/base_view_model/base_view_model.dart';

class GetStartedScreen extends StatefulWidget {
  const GetStartedScreen({super.key});

  @override
  State<GetStartedScreen> createState() => _GetStartedScreenState();
}

class _GetStartedScreenState extends State<GetStartedScreen> {
  CreateListingViewModel? createListingViewModel;

  @override
  void initState() {
    createListingViewModel =
        Provider.of<CreateListingViewModel>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if(createListingViewModel?.getStepsResponseModel == null) {
        createListingViewModel?.getSteps();
         }
    });

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CommonAppBar(
        isMainPage: true,
      ),
      body: Consumer<CreateListingViewModel>(builder: (context, value, child) {
        final steps = value.getStepsResponseModel?.data?.steps;

        if (value.state == ViewState.busy) {
          return Center(
              child: Loader(
            color: AppColorData.blackClr,
          ));
        }

        if (steps == null || steps.isEmpty) {
          return Center(child: CommonText(text: "No steps available."));
        }

        return CommonPadding(
            child: Column(
          children: [
            Expanded(
                child: SingleChildScrollView(
              child: Column(
                spacing: 20,
                children: [
                  CommonText(
                    text: "${tr("itsEasyToStart")} ${Strings.appName}",
                    style: AppTextStyle.headingStyle,
                  ),
                  const SizedBox(),
                  ..._buildStepWidgets(steps),
                ],
              ),
            )),
            CommonElevatedButton(
                elevatedButtonName: "getStarted",
                onTap: () {
                  Get.toNamed(RouterName.listingIntroScreen);
                })
          ],
        ));
      }),
    );
  }

  List<Widget> _buildStepWidgets(List<dynamic> steps) {
    return List.generate(steps.length, (index) {
      final data = steps[index];
      return Column(
        spacing: 14,
        children: [
          Row(
            spacing: 10,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CommonText(text: "${index + 1}", style: AppTextStyle.headerStyle),
              Expanded(
                child: Column(
                  spacing: 4,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CommonText(
                      text: data.title ?? "",
                      style: AppTextStyle.headerStyle,
                    ),
                    CommonText(
                      text: data.subTitle ?? "",
                      style: AppTextStyle.subBodyStyle.copyWith(
                          color: AppColorData.subBodyTextHighlightClr),
                    ),
                  ],
                ),
              ),
              CacheImageWidget(
                height: 100,
                width: 100,
                fit: BoxFit.cover,
                errorBuilder: (context, url, error) {
                  return const ErrorImage(isSquare: true);
                },
                imageUrl: data.icon ?? "",
              ),
            ],
          ),
          const CustomDivider(),
        ],
      );
    });
  }
}
