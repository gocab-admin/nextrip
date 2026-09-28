import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/routes/router_name.dart';
import 'package:airstar_flutter/utils/constants/constants.dart';
import 'package:airstar_flutter/viewModel/user/profile_view_model.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';
import '../../../commonWidgets/card_widget/translate_and_currency_card_widget.dart';
import '../../../utils/components/color/app_color.dart';
import '../../../viewModel/base_view_model/base_view_model.dart';
import '../login_and_signup/login_screen.dart';

class CurrencyScreen extends StatefulWidget {
  final String from;
  const CurrencyScreen({super.key, required this.from});

  @override
  State<CurrencyScreen> createState() => _CurrencyScreenState();
}

class _CurrencyScreenState extends State<CurrencyScreen> {
  EditProfileViewModel? editProfileViewModel;

  @override
  void initState() {
    editProfileViewModel =
        Provider.of<EditProfileViewModel>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      editProfileViewModel?.loadSavedCurrency();
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: CustomScrollView(
              slivers: [
                SliverAppBar(
                  pinned: true,
                  expandedHeight: 130,
                  flexibleSpace: CommonSliverAppBar(
                    appBarHeight: 120,
                    title: "selectCurrency",
                    titleTextStyle: AppTextStyle.headingStyle,
                  ),
                ),
                SliverToBoxAdapter(
                  child: _renderBody(),
                )
              ],
            ),
          ),
          Consumer<EditProfileViewModel>(builder: (context, value, child) {
            return Padding(
              padding: horizontalPadding(vertical: 14.0),
              child: CommonElevatedButton(
                  isLoad: value.state == ViewState.busy,
                  showLoader: true,
                  elevatedButtonName: "update",
                  onTap: () async {
                    value.updateSelectedCurrency().then((val) {
                      if(widget.from == "user") {
                        Get.offAllNamed(RouterName.dashBoard);
                      } else {
                        Get.offAllNamed(RouterName.hostDashboard);
                      }

                    });
                  },
                  elevatedButtonColor: AppColorData.blackButtonClr),
            );
          }),
        ],
      ),
    );
  }

  Widget _renderBody() {
    return Consumer<EditProfileViewModel>(builder: (context, value, child) {
      var currency = value.currencyResponseModel?.data.currency;
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
                itemCount: currency?.length,
                itemBuilder: (context, index) {
                  var data = currency?[index];
                  return TranslateAndCurrencyCardWidget(
                    verticalPadding: 14.0,
                    title: "${data?.name}",
                    subtitle: data?.code,
                    symbol: data?.symbol ?? "",
                    onTap: () {
                      value.setNewCurrency(index);
                    },
                    isSelected: value.selectedCurrencyIndex == index,
                  );
                }),
          ],
        ),
      );
    });
  }
}
