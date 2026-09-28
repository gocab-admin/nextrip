import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/utils/components/color/app_color.dart';
import 'package:airstar_flutter/utils/constants/textstyle.dart';
import 'package:airstar_flutter/viewModel/user/profile_view_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../commonWidgets/button_widgets/common_elevated_button.dart';
import '../../../commonWidgets/card_widget/translate_and_currency_card_widget.dart';
import '../../../commonWidgets/widget/common_divider_widget.dart';
import '../../../commonWidgets/widget/common_sliver_app_bar_widget.dart';
import '../../../utils/commonFunctions/app_common_functions.dart';
import '../../../viewModel/base_view_model/base_view_model.dart';


class SelectLanguageScreen extends StatefulWidget {
  const SelectLanguageScreen({super.key});

  @override
  State<SelectLanguageScreen> createState() => _SelectLanguageScreenState();
}

class _SelectLanguageScreenState extends State<SelectLanguageScreen> {
  EditProfileViewModel? editProfileViewModel;

  @override
  void initState() {
    editProfileViewModel =
        Provider.of<EditProfileViewModel>(context, listen: false);
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      editProfileViewModel?.getOldLang();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Consumer<EditProfileViewModel>(builder: (context, viewModel, child) {
        return Column(
          children: [
            Expanded(
              child: CustomScrollView(
                slivers: [
                  SliverAppBar(
                    pinned: true,
                    expandedHeight: 130,
                    flexibleSpace: CommonSliverAppBar(
                      appBarHeight: 120,
                      title: "selectLanguage",
                      titleTextStyle: AppTextStyle.headingStyle,
                    ),
                  ),
                  SliverToBoxAdapter(
                    child: renderBody(viewModel),
                  )
                ],
              ),
            ),
            Padding(
              padding: horizontalPadding(vertical: 14.0),
              child: CommonElevatedButton(
                isLoad: viewModel.state == ViewState.busy ? true : false,
                  showLoader: true,
                  elevatedButtonName: "update",
                  onTap: () {
                    viewModel.updateSelectedLanguage(context).then((val) {
                      Navigator.pop(context);
                      print("arabiv :: ${isArabic(context)}");
                    });
                  },
                  elevatedButtonColor: AppColorData.blackButtonClr),
            ),
          ],
        );
      }),
    );
  }

  Widget renderBody(EditProfileViewModel viewModel) {
    return Padding(
      padding: horizontalPadding(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          divider(),
          ListView.builder(
              padding: EdgeInsets.zero,
              physics: NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              itemCount: viewModel.languages.length,
              itemBuilder: (context, index) {
                return TranslateAndCurrencyCardWidget(
                  onTap: () {
                    viewModel.setNewLang(viewModel.languages[index].locale);
                  },
                  title: viewModel.languages[index].name ?? '',
                  isSelected: viewModel.selectedLanguage ==
                      viewModel.languages[index].locale,
                );
              }),
        ],
      ),
    );
  }
}
