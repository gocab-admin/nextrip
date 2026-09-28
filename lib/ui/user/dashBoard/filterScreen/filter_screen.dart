import 'package:airstar_flutter/commonWidgets/button_widgets/button_widget.dart';
import 'package:airstar_flutter/commonWidgets/loading_widgets/loader.dart';
import 'package:airstar_flutter/ui/user/dashBoard/filterScreen/filter_rooms_widget.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/login_screen.dart';
import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/user/listing_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../viewModel/base_view_model/base_view_model.dart';
import 'common_amenities_widget.dart';

class FilterScreen extends StatefulWidget {
  const FilterScreen({super.key});

  @override
  State<FilterScreen> createState() => _FilterScreenState();
}

class _FilterScreenState extends State<FilterScreen> {
  // FilterViewModel? filterViewModel;
  ProductListingViewModel? listingViewModel;


  @override
  void initState() {
    // filterViewModel = Provider.of(context, listen: false);
    listingViewModel =
        Provider.of<ProductListingViewModel>(context, listen: false);

    WidgetsBinding.instance.addPostFrameCallback((_) {

      listingViewModel!.fetchAmenities();
      listingViewModel!.fetchProperties(listingViewModel!.categoryId).then((_){
        listingViewModel!.setFilterListing();
      });
    });
    super.initState();
  }

  int getAmenitiesCount(ProductListingViewModel value) {
    if (value.amenitiesResponseModel?.data?.amenities == null ||
        value.amenitiesResponseModel!.data!.amenities!.isEmpty) {
      return 0;
    } else if (value.amenitiesResponseModel!.data!.amenities!.length > 3 &&
        !value.showMore) {
      return 3;
    } else {
      return value.amenitiesResponseModel!.data!.amenities!.length;
    }
  }

  int getListingplacesCount(ProductListingViewModel value) {
    if (value.filterListingResponseModel?.data?.approvedListing == null ||
        value.filterListingResponseModel!.data!.approvedListing!.isEmpty) {
      return 0;
    }
    return value.filterListingResponseModel!.data!.totalCount!;
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ProductListingViewModel>(builder: (context, value, child) {

      return value.state == ViewState.busy ||
          value.propertiesResponseModel == null ||
          value.amenitiesResponseModel == null
          ? ProgressLoader()
          : Container(
        decoration: BoxDecoration(
          color: AppColorData.appSecondaryColor,
        ),
        child: Column(children: [
          Expanded(
              child: SingleChildScrollView(
                child: Padding(
                  padding: horizontalPadding(),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      typesOfPlace(value),
                      priceRange(value),
                      CustomDivider(),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            SizedBox(
                              height: 10,
                            ),
                            CommonText(
                              text: "rooms",
                              style: AppTextStyle.titleStyle,
                            ),
                            doubleSpacer(),
                            CommonText(
                              text: "bedRooms",
                              style: AppTextStyle.bodyTextStyle,
                            ),
                            // roomsList(value, "bedroom"),
                            RoomsListWidget(
                              model: value,
                              roomType: RoomType.bedroom,
                              visibleLimit: 5,
                            ),
                            // CommonText(
                            //     text: "beds",
                            //     style: AppTextStyle.bodyTextStyle),
                            // roomsList(value, "bed"),
                            CommonText(
                                text: "bathRooms",
                                style: AppTextStyle.bodyTextStyle),
                            //roomsList(value, "bathroom"),
                            RoomsListWidget(
                              model: value,
                              roomType: RoomType.bathroom,
                              visibleLimit: 5,
                            ),
                            SizedBox(
                              height: 10,
                            ),
                            CustomDivider(),
                          ],
                        ),
                      SizedBox(
                        height: 10,
                      ),
                      CommonText(
                        text: "Amenities",
                        style: AppTextStyle.titleStyle,
                      ),
                      CommonAmenitiesWidget(
                        model: value,
                        isFromFilter: true,
                      ),
                      // Column(
                      //   crossAxisAlignment: CrossAxisAlignment.start,
                      //   children: [
                      //     AnimatedContainer(
                      //       duration: Duration(milliseconds: 300),
                      //       curve: Curves.easeInOut,
                      //       padding: const EdgeInsets.symmetric(vertical: 10),
                      //       width: MediaQuery.of(context).size.width,
                      //       child: ListView.builder(
                      //         shrinkWrap: true,
                      //         physics: NeverScrollableScrollPhysics(),
                      //         itemCount: getAmenitiesCount(value),
                      //         itemBuilder: (context, index) {
                      //           var data = value.amenitiesResponseModel!.data!
                      //               .amenities![index];
                      //           bool isSelected = value.selectedAmenities
                      //               .any((e) => e.id == data.id);
                      //
                      //           if (isSelected) {
                      //             data.isChecked = true;
                      //           }
                      //           print("isSelected :: $isSelected");
                      //
                      //           return Column(
                      //             crossAxisAlignment:
                      //             CrossAxisAlignment.start,
                      //             children: [
                      //               Row(
                      //                 mainAxisAlignment:
                      //                 MainAxisAlignment.spaceBetween,
                      //                 children: [
                      //                   CommonText(
                      //                     text: data.name!,
                      //                     style: AppTextStyle.bodyTextStyle,
                      //                   ),
                      //                   CustomCheckbox(
                      //                     value: data.isChecked!,
                      //                     onChanged: (newValue) {
                      //                       value.toggleAmenities(
                      //                           index, newValue!,true);
                      //                     },
                      //                   ),
                      //                 ],
                      //               ),
                      //             ],
                      //           );
                      //         },
                      //       ),
                      //     ),
                      //     GestureDetector(
                      //       onTap: () {
                      //         value.toggleShowMore();
                      //       },
                      //       child: Row(
                      //         children: [
                      //           CommonText(
                      //             isUnderline: true,
                      //             text: value.showMore
                      //                 ? "showLess"
                      //                 : "showMore",
                      //             style: AppTextStyle.headerStyle,
                      //           ),
                      //           Icon(
                      //             value.showMore
                      //                 ? Icons.keyboard_arrow_up_sharp
                      //                 : Icons.keyboard_arrow_down_sharp,
                      //             size: 30,
                      //           )
                      //         ],
                      //       ),
                      //     ),
                      //   ],
                      // ),
                      SizedBox(
                        height: 10,
                      ),
                    ],
                  ),
                ),
              )),
          CustomDivider(),
          Padding(
            padding: EdgeInsets.all(10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // TextButton(
                //   onPressed: () {
                //     value.clearFilters();
                //   },
                //   child: CommonText(
                //     text: "clearAll",
                //   ),
                // ),
                CommonElevatedButton(
                  isTextBtn: true,
                  isUnderline: true,
                  onTap: () {
                    value.clearFilters();
                  },
                  elevatedButtonName: "clearAll",
                ),
                //CommonText(text:"clearAll",
                //     style: AppTextStyle.bodyStyle),
                //CommonText(text:'night',style: textStyle(),),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColorData.blackButtonClr,
                    foregroundColor: AppColorData.appSecondaryColor,
                    // side: BorderSide(color: Colors.black87),
                    elevation: 3,
                    shadowColor:
                    AppColorData.bodyTextColor.withOpacity(0.1),
                    padding: const EdgeInsets.all(18),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8)),
                  ),
                  child:value.state == ViewState.tertiaryLoader
                      ? SizedBox(height: 20, width: 100, child: Loader())
                      : CommonText(
                                          text: getListingplacesCount(value) != 0
                        ? "${tr("show")} ${getListingplacesCount(value)} ${tr("Places")}"
                        : "noExactMatches",
                                          style: TextStyle(
                        color: AppColorData.appSecondaryColor,
                        fontWeight: FontWeight.w500,
                        fontSize: 16),
                                        ),
                  onPressed:  () {
                    if (value.state == ViewState.tertiaryLoader) return;
                    if (getListingplacesCount(value) != 0) {
                      value.calculateAppliedFilters();
                      value.setFilters();
                      Navigator.pop(context);
                    }
                  },
                ),
              ],
            ),
          ),
        ]),
      );
    });
  }

  Widget typesOfPlace(ProductListingViewModel model) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14),
      // height: MediaQuery.of(context).size.height * 0.25,
      // color: Colors.green,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          CommonText(
            text: "typeOfPlace",
            style: AppTextStyle.titleStyle,
          ),
          CommonText(
            text: "searchRoomsPara",
            style: AppTextStyle.bodyTextStyle
                .copyWith(fontWeight: FontWeight.w400),
          ),
          doubleSpacer(height: 30),
          Center(
            child: Container(
              // margin: const EdgeInsets.all(14),
                height: 60,
                width: 300,
                decoration: BoxDecoration(
                  // color: Colors.red,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppColorData.boxBorder)),
                child: ListView.builder(
                  shrinkWrap: true,
                  scrollDirection: Axis.horizontal,
                  itemCount:
                  model.propertiesResponseModel!.data!.properties!.length,
                  itemBuilder: (context, index) {
                    var data =
                    model.propertiesResponseModel!.data!.properties![index];
                    bool isSingle = model.propertiesResponseModel!.data!
                        .properties!.length <=
                        1;
                    bool isFirst = model
                        .propertiesResponseModel!.data!.properties!.first ==
                        data;
                    bool isLast =
                        model.propertiesResponseModel!.data!.properties!.last ==
                            data;

                    return _buildTextContainer(
                        data.property!, index, isSingle, isFirst, isLast);
                  },
                )),
          ),
          doubleSpacer(),
        ],
      ),
    );
  }

  Widget priceRange(ProductListingViewModel model) {

    int minPrice = model.listingResponseModel?.data?.defaultMinPrice ?? 0;
    int maxPrice = model.listingResponseModel?.data?.defaultMaxPrice ?? 100;


    if (maxPrice <= minPrice) {
      maxPrice = minPrice + 1;
    }


    if (model.priceRangeValues == null) {
      model.priceRangeValues = RangeValues(minPrice.toDouble(), maxPrice.toDouble());
    }


    double startValue = model.priceRangeValues?.start ?? minPrice.toDouble();
    double endValue = model.priceRangeValues?.end ?? maxPrice.toDouble();


    startValue = startValue.clamp(minPrice.toDouble(), maxPrice.toDouble());
    endValue = endValue.clamp(startValue, maxPrice.toDouble());


    if (model.priceRangeValues?.start != startValue || model.priceRangeValues?.end != endValue) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        model.updatePriceRangeValues(RangeValues(startValue, endValue));
      });
    }

    RangeLabels labels = RangeLabels(
      startValue.toInt().toString(),
      endValue.toInt().toString(),
    );

    int calculateDivisions() {
      if (maxPrice <= 100) return 10;
      if (maxPrice <= 500) return 20;
      if (maxPrice <= 1000) return 20;
      if (maxPrice <= 5000) return 25;
      return 40;
    }

    // Additional safety check
    if (minPrice < maxPrice && model.priceRangeValues != null) {
      // Ensure values are valid one more time
      RangeValues safeValues = RangeValues(
          model.priceRangeValues!.start.clamp(minPrice.toDouble(), maxPrice.toDouble()),
          model.priceRangeValues!.end.clamp(minPrice.toDouble(), maxPrice.toDouble())
      );

      // If end is less than start, fix it
      if (safeValues.end < safeValues.start) {
        safeValues = RangeValues(safeValues.start, safeValues.start);
      }

      var currency = model.listingResponseModel?.data?.multipleCurrency?.toSymbol;
      return Column(
        children: [
          CustomDivider(),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CommonText(
                  text: "priceRange",
                  style: AppTextStyle.titleStyle,
                ),
                CommonText(
                  text: "nightlyPrices",
                  style: AppTextStyle.bodyTextStyle
                      .copyWith(fontWeight: FontWeight.w400),
                ),
                doubleSpacer(),
                RepaintBoundary(
                  child: RangeSlider(
                    min: minPrice.toDouble(),
                    max: maxPrice.toDouble(),
                    inactiveColor: Colors.grey.withOpacity(0.8),
                    activeColor: Colors.black,
                    values: safeValues,
                    labels: labels,
                    divisions: calculateDivisions(),
                    onChangeStart: (value) {
                      model.isPriceRangeEdited = true;
                      model.notify();
                    },
                    onChangeEnd: (value) {
                      model.updatePriceRangeValues(value); // Update first
                      model.debounceFetchListing(
                        categoryId: model.categoryId,
                        filter: true,
                        duration: const Duration(milliseconds: 500), // Fast response
                      );
                    // model.fetchListing(categoryId: model.categoryId, filter: true);
                    },
                    onChanged: (newValues) {
                      model.updatePriceRangeValues(newValues);
                    },
                  ),
                ),
                doubleSpacer(),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColorData.grey03),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            CommonText(
                              text: "minimum",
                              style: AppTextStyle.bodyTextStyle
                                  .copyWith(color: AppColorData.subBodyTextClr),
                            ),
                            CommonText(
                              text: '${currency}${model.priceRangeValues!.start.round()}',
                              style: AppTextStyle.bodyTextStyle,
                            ),
                          ],
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: SizedBox(
                          width: 20,
                          child: CustomDivider(color: AppColorData.grey03)),
                    ),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColorData.grey03),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            CommonText(
                              text: "maximum",
                              style: AppTextStyle.bodyTextStyle
                                  .copyWith(color: AppColorData.subBodyTextClr),
                            ),
                            CommonText(
                              text: '${currency}${model.priceRangeValues!.end.round()}',
                              style: AppTextStyle.bodyTextStyle,
                            ),
                          ],
                        ),
                      ),
                    )
                  ],
                ),
                spacer()
              ],
            ),
          ),
        ],
      );
    } else {

      return SizedBox();
    }

  }


  List getRoomItems(String room, ProductListingViewModel model) {
    switch (room) {
      case "bedroom":
        return model.bedrooms;
      case "bathroom":
        return model.bathrooms;
      case "bed":
        return model.beds;
    }
    return [];
  }

  int getRoomIndex(String room, ProductListingViewModel model) {
    switch (room) {
      case "bedroom":
        return model.currentBedroomIndex;
      case "bathroom":
        return model.currentBathroomIndex;
      case "bed":
        return model.currentBedIndex;
    }
    return 0;
  }

  // Widget roomsList(ProductListingViewModel model, String room) {
  //   return Container(
  //     width: MediaQuery.of(context).size.width,
  //     height: 40,
  //     margin: EdgeInsets.only(bottom: 10, top: 10),
  //     //color: Colors.red,
  //     child: ListView.builder(
  //         shrinkWrap: true,
  //         scrollDirection: Axis.horizontal,
  //         itemCount: getRoomItems(room, model).length,
  //         itemBuilder: (context, index) {
  //           return GestureDetector(
  //             onTap: () {
  //               if (room == "bedroom") {
  //                 model.updateCurrentBedroomIndex(index);
  //               } else if (room == "bed") {
  //                 model.updateCurrentBedIndex(index);
  //               } else if (room == "bathroom") {
  //                 model.updateCurrentBathroomIndex(index);
  //               }
  //             },
  //             child: Container(
  //               margin: EdgeInsets.only(right: 10),
  //               padding: EdgeInsets.symmetric(horizontal: 20),
  //               decoration: BoxDecoration(
  //                   border: Border.all(color: AppColorData.boxBorder),
  //                   color: getRoomIndex(room, model) == index
  //                       //? ThemeColor.Black
  //                       ? AppColorData.blackClr
  //                       : Colors.transparent,
  //                   borderRadius: BorderRadius.circular(25)),
  //               child: Center(
  //                 child: CommonText(
  //                   text: getRoomItems(room, model)[index].toString(),
  //                   style: TextStyle(
  //                       fontWeight: FontWeight.w500,
  //                       fontSize: 14,
  //                       color: getRoomIndex(room, model) == index
  //                           ? AppColorData.appSecondaryColor
  //                           : AppColorData.blackButtonClr),
  //                 ),
  //               ),
  //             ),
  //           );
  //         }),
  //   );
  // }


  Widget _buildTextContainer(
      String text, int index, bool isSingle, bool isFirst, bool isLast) {
    return Consumer<ProductListingViewModel>(
      builder: (context, model, child) {
        return GestureDetector(
          onTap: () {
            model.toggleProperties(index);
          },
          child: Container(
            width: isSingle ? 300 : 100,
            padding: EdgeInsets.symmetric(horizontal: 10),
            decoration: BoxDecoration(
              border: !isFirst && !isLast
                  ? Border.symmetric(
                  vertical:
                  BorderSide(width: 1, color: AppColorData.boxBorder))
                  : null,
              color: model.selectedPropertyIndex == index ? AppColorData.blackButtonClr : null,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(isFirst ? 10 : 0),
                topRight: Radius.circular(isLast ? 10 : 0),
                bottomLeft: Radius.circular(isFirst ? 10 : 0),
                bottomRight: Radius.circular(isLast ? 10 : 0),
              ),
            ),
            child: Center(
              child: CommonText(
                  text: text,
                  style: AppTextStyle.subBodyStyle.copyWith(
                    color: model.selectedPropertyIndex == index
                        ? AppColorData.appSecondaryColor
                        : AppColorData.bodyTextColor,
                  )),
            ),
          ),
        );
      },
    );
  }
}
