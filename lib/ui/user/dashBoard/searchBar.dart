import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/ui/user/search_location/auto_search_location.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:syncfusion_flutter_datepicker/datepicker.dart';

class SearchBarScreen extends StatefulWidget {
  const SearchBarScreen({super.key});

  @override
  State<SearchBarScreen> createState() => _SearchBarScreenState();
}

class _SearchBarScreenState extends State<SearchBarScreen> {
  ProductListingViewModel? listingViewModel;

  @override
  void initState() {
    super.initState();
    // filteredCities.addAll(cities);
    listingViewModel =
        Provider.of<ProductListingViewModel>(context, listen: false);
    listingViewModel!.isSearching = false;
  }

  DateTime? startDate;
  DateTime? endDate;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColorData.appSecondaryColor,
      appBar: AppBar(
        systemOverlayStyle: SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
        ),
        leading: Consumer<ProductListingViewModel>(
          builder: (context, value, child) {
            return value.isSearching
                ? InkWell(
                    onTap: () {
                      value.toggleisSearching();
                    },
                    child: Icon(
                      Icons.arrow_back_outlined,
                      size: 20,
                      color: AppColorData.appIconBlack,
                    ),
                  )
                : InkWell(
                    onTap: () {
                      // listingViewModel!.clearAll();
                      Navigator.pop(context);
                    },
                    child: Icon(
                      Icons.close,
                      size: 20,
                      color: AppColorData.appIconBlack,
                    ),
                  );
          },
        ),
        title: CommonText(
            text: "stays",
            style: AppTextStyle.titleStyle.copyWith(
              decoration: TextDecoration.underline,
            )),
      ),
      body: Consumer2<ProductListingViewModel, CommonViewModel>(
        builder: (context, viewModel, commonModel, child) {
          return Container(
            color: AppColorData.appSecondaryColor,
            child: viewModel.isSearching
                ? AnimatedContainer(
                    duration: Duration(milliseconds: 300),
                    padding: horizontalPadding(vertical: 18.0),
                    margin: EdgeInsets.only(top: 20),
                    decoration: BoxDecoration(
                      boxShadow: commonBoxShadows(spread: false),
                      //  borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                      borderRadius: BorderRadius.circular(15),
                      color: AppColorData.appSecondaryColor,
                    ),
                    child: AddressSearchPage(
                      from: "user",
                      viewModel: viewModel,
                      fromController: viewModel.addressController,
                    ),
                  )
                : Padding(
                    padding: horizontalPadding(vertical: 14),
                    child: Column(
                      children: [
                        Expanded(
                          child: SingleChildScrollView(
                            child: Column(
                              children: [
                                SizedBox(height: 20),
                                GestureDetector(
                                  onTap: () {
                                    viewModel.toggleExpandSearch();
                                  },
                                  child: AnimatedContainer(
                                    duration: Duration(milliseconds: 300),
                                    padding: horizontalPadding(vertical: 18.0),
                                    decoration: BoxDecoration(
                                      boxShadow: commonBoxShadows(
                                          spread: viewModel.isExpandSearch
                                              ? true
                                              : false),
                                      //  borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                                      borderRadius: BorderRadius.circular(15),
                                      color: AppColorData.appSecondaryColor,
                                    ),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            !viewModel.isExpandSearch
                                                ? CommonText(
                                                    text: "where",
                                                    style: AppTextStyle
                                                        .subBodyStyle
                                                        .copyWith(
                                                            color: AppColorData
                                                                .subBodyTextClr),
                                                  )
                                                : CommonText(
                                                    text: "whereTo",
                                                    style: AppTextStyle
                                                        .headerStyle,
                                                  ),
                                            SizedBox(
                                              width: 10,
                                            ),
                                            if (!viewModel.isExpandSearch)
                                              Expanded(
                                                child: CommonText(
                                                  text: viewModel.address ??
                                                      "ImFlexible",
                                                  style:
                                                      AppTextStyle.subBodyStyle,
                                                  textAlign: TextAlign.end,
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                ),
                                              ),
                                          ],
                                        ),
                                        if (viewModel.isExpandSearch)
                                          SizedBox(
                                            height: 10,
                                          ),
                                        if (viewModel.isExpandSearch)
                                          CommonTextFromField(
                                            onTap: () {
                                              viewModel.toggleisSearching();
                                            },
                                            //height: 50,
                                            border: Border.all(
                                                color: AppColorData.boxBorder),
                                            autofocus: false,
                                            // prefixIcon:  SvgPicture.asset(SVGAssets.search,height: 20,width: 20),
                                            contentPadding:
                                                const EdgeInsets.symmetric(
                                                    vertical: 16,
                                                    horizontal: 6),
                                            fillColor:
                                                AppColorData.appSecondaryColor,
                                            controller:
                                                viewModel.addressController,
                                            hintText: tr("searchDestination"),
                                            // onChanged: ,
                                            // onSaved: _onChanged(widget.fromController),
                                            prefixIcon: Padding(
                                              padding: const EdgeInsets.only(
                                                  left: 5),
                                              child: Icon(
                                                Icons.search,
                                                color:
                                                    AppColorData.appIconBlack,
                                                size: 22,
                                              ),
                                            ),
                                          ),
                                      ],
                                    ),
                                  ),
                                ),
                                //  viewModel.isExpandSearch? _searchExpandContainer(viewModel): SearchContainer(viewModel) ,
                                doubleSpacer(),
                                AnimatedContainer(
                                  duration: Duration(milliseconds: 300),
                                  decoration: BoxDecoration(
                                    boxShadow: commonBoxShadows(
                                        spread: viewModel.isExpandDate
                                            ? true
                                            : false),
                                    color: AppColorData.appSecondaryColor,
                                    borderRadius: BorderRadius.circular(15),
                                  ),
                                  child: viewModel.isExpandDate
                                      ? _datePickerCard(viewModel)
                                      : _buildDateContainer(
                                          viewModel, commonModel),
                                ),
                                doubleSpacer(),
                                // if (isAirstar())
                                AnimatedContainer(
                                  duration: Duration(milliseconds: 300),
                                  decoration: BoxDecoration(
                                    boxShadow: commonBoxShadows(
                                        spread: viewModel.isExpandGuest
                                            ? true
                                            : false),
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(15),
                                  ),
                                  child: viewModel.isExpandGuest
                                      ? _guestCard(viewModel)
                                      : _buildGuestContainer(viewModel),
                                ),
                                doubleSpacer(),
                              ],
                            ),
                          ),
                        ),
                        if (!viewModel.isExpandDate)
                          Column(
                            children: [
                              CustomDivider(),
                              Padding(
                                padding:
                                    const EdgeInsets.symmetric(vertical: 10),
                                child: Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    !viewModel.isDataCleared()
                                        ? CommonElevatedButton(
                                            isTextBtn: true,
                                            onTap: () {
                                              viewModel.clearAll();
                                              viewModel.fetchListing(
                                                  categoryId:
                                                      viewModel.categoryId,
                                                  addFilterListing: true);
                                              // Navigator.pop(context);
                                            },
                                            elevatedButtonName: "clearAll",
                                          )
                                        : SizedBox(),
                                    ElevatedButton(
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor:
                                            AppColorData.appPrimaryColor,
                                        foregroundColor:
                                            AppColorData.appSecondaryColor,
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 26, vertical: 12),
                                        shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(8),
                                        ),
                                      ),
                                      onPressed: () {
                                        viewModel.resetPagination();
                                        viewModel.fetchListing(
                                            categoryId: viewModel.categoryId,
                                            addFilterListing: true);

                                        Navigator.pop(context);
                                      },
                                      child: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceEvenly,
                                        children: [
                                          Icon(Icons.search),
                                          //  SizedBox(width: 5),
                                          CommonText(
                                            text: "search",
                                            isWhiteText: true,
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                      ],
                    ),
                  ),
          );
        },
      ),
      // ),
    );
  }

  Widget _buildDateContainer(
      ProductListingViewModel viewModel, CommonViewModel commonModel) {
    var apiDateFormat =
        commonModel.settingsResponseModel?.data?.hiddenSettings?.dateFormat;
    return ListTile(
      onTap: () {
        viewModel.toggleExpandDate();
      },
      leading: CommonText(
          text: "when",
          style: AppTextStyle.subBodyStyle
              .copyWith(color: AppColorData.subBodyTextClr)),
      trailing: CommonText(
          text: viewModel.startDate != null && viewModel.endDate != null
              ? DateFormatterUtil.formatDateRangeWithTime(
                  viewModel.startDate.toString(),
                  viewModel.endDate.toString(),
                  apiDateFormat)
              : viewModel.startDate != null
                  ? DateFormatterUtil.formatDate(
                      viewModel.startDate.toString(), apiDateFormat)
                  : "addDates",
          style: AppTextStyle.subBodyStyle),
    );
  }

  Widget _buildGuestContainer(ProductListingViewModel viewModel) {
    return ListTile(
      onTap: () {
        viewModel.toggleExpandGuest();
      },
      leading: CommonText(
          text: "who",
          style: AppTextStyle.subBodyStyle
              .copyWith(color: AppColorData.subBodyTextClr)),
      trailing: CommonText(
          text: viewModel.guestDetails[2].count > 0
              ? "${viewModel.getGuestCountText()}, ${viewModel.guestDetails[2].count} ${tr("Pets")}"
              : "${viewModel.getGuestCountText()}",
          // viewModel.count.reduce((a, b) => a + b) > 0
          //     ? "${viewModel.count.reduce((a, b) => a + b)} guests"
          //     : "addGuest",
          style: AppTextStyle.subBodyStyle),
    );
  }

  Widget _datePickerCard(ProductListingViewModel viewModel) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          GestureDetector(
            onTap: () {
              viewModel.toggleExpandDate();
            },
            child: CommonText(
              text: "whensUrTrip",
              //  "${formatDateTime(_startDate)} - ${formatDateTime(_endDate)}",
              style: AppTextStyle.titleStyle,
            ),
          ),
          SizedBox(
            height: 300,
            child: CommonSyncfusionRangePicker(
              minDate: DateTime.now(),
              initialSelectedRange:
                  PickerDateRange(viewModel.startDate, viewModel.endDate),
              onSelectionChanged: (args) {
                startDate = args.value.startDate;
                endDate = args.value.endDate;
                // viewModel.setDates(args.value.startDate, args.value.endDate);
              },
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              CommonElevatedButton(
                isTextBtn: true,
                onTap: () {
                  if (startDate != null ||
                      endDate != null ||
                      viewModel.startDate != null ||
                      viewModel.endDate != null) {
                    startDate = null;
                    endDate = null;
                    viewModel.startDate = null;
                    viewModel.endDate = null;
                  }
                  viewModel.toggleExpandDate();
                  viewModel.toggleExpandGuest();
                  viewModel.notify();
                },
                elevatedButtonName: (startDate != null ||
                        endDate != null ||
                        viewModel.startDate != null ||
                        viewModel.endDate != null)
                    ? "clear"
                    : "skip",
              ),
              CommonElevatedButton(
                width: MediaQuery.of(context).size.width * 0.3,
                onTap: () {
                  viewModel.setDates(startDate, endDate);
                  viewModel.toggleExpandDate();
                  viewModel.toggleExpandGuest();
                },
                elevatedButtonName: "next",
                elevatedButtonNameColor: AppColorData.appSecondaryColor,
                elevatedButtonColor: AppColorData.blackButtonClr,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _guestCard(ProductListingViewModel viewModel) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          GestureDetector(
            onTap: () {
              viewModel.toggleExpandGuest();
            },
            child: CommonText(
              text: "whosComing",
              style: AppTextStyle.titleStyle,
            ),
          ),
          SizedBox(
            height: 20,
          ),
          ListView.builder(
            physics: NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            itemCount: viewModel.guestDetails.length,
            itemBuilder: (context, index) {
              return Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            CommonText(
                              text: viewModel.guestDetails[index].title,
                              style: AppTextStyle.bodyTextStyle,
                            ),
                            SizedBox(height: 5),
                            CommonText(
                              overflow: TextOverflow.ellipsis,
                              text: viewModel.guestDetails[index].subtitle,
                              style: AppTextStyle.contentStyle
                                  .copyWith(color: AppColorData.subBodyTextClr),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        width: MediaQuery.of(context).size.width * 0.3,
                        height: MediaQuery.of(context).size.height * 0.04,
                        child: Row(
                          //  spacing: 8,
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            GestureDetector(
                              onTap: () {
                                viewModel.decrementGuestCount(index);
                              },
                              child: Container(
                                decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                        color: viewModel
                                                    .guestDetails[index].count >
                                                0
                                            ? AppColorData.appIconBlack
                                            : Colors.grey,
                                        width: 0.5)),
                                child: CircleAvatar(
                                  radius: 20,
                                  backgroundColor:
                                      viewModel.guestDetails[index].count > 0
                                          ? AppColorData.appIconBlack
                                          : Colors.grey.shade300,
                                  child: CircleAvatar(
                                    radius: 17,
                                    backgroundColor:
                                        AppColorData.appSecondaryColor,
                                    child: Icon(
                                      Icons.remove,
                                      color:
                                          viewModel.guestDetails[index].count >
                                                  0
                                              ? AppColorData.appIconBlack
                                              : Colors.grey.shade300,
                                      size: 20,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            CommonText(
                                text:
                                    "${viewModel.guestDetails[index].count.toString()}"),
                            GestureDetector(
                              onTap: () {
                                viewModel.incrementGuestCount(index);
                              },
                              child: Container(
                                decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                        color: AppColorData.appIconBlack,
                                        width: 0.5)),
                                child: CircleAvatar(
                                  radius: 20,
                                  backgroundColor: AppColorData.appIconBlack,
                                  child: CircleAvatar(
                                    radius: 17,
                                    backgroundColor:
                                        AppColorData.appSecondaryColor,
                                    child: Icon(
                                      Icons.add,
                                      color: AppColorData.appIconBlack,
                                      size: 20,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  divider(),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

Widget doubleSpacer({double height = 20, double width = 0}) {
  return SizedBox(height: height, width: width);
}

List<BoxShadow> commonBoxShadows({bool spread = false}) {
  return [
    BoxShadow(
      color: Color(0xff000000).withOpacity(0.15),
      spreadRadius: 0,
      blurRadius: spread ? 25 : 7,
      offset: Offset(2, 2),
    ),
  ];
}
