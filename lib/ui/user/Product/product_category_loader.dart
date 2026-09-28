import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import 'package:airstar_flutter/commonWidgets/widget/widget.dart';
import 'package:airstar_flutter/utils/utils.dart';

class ProductCategoryLoader extends StatefulWidget {
  final bool isSearchBarLoader;
  final bool isProductCategoryLoader;

  const ProductCategoryLoader({
    Key? key,
    this.isSearchBarLoader = false,
    this.isProductCategoryLoader = false,
  }) : super(key: key);

  @override
  State<ProductCategoryLoader> createState() => _ProductCategoryLoaderState();
}

class _ProductCategoryLoaderState extends State<ProductCategoryLoader> {
  Timer? _timer;
  int _start = 10; // time to popup still working window /// in seconds

  @override
  void initState() {
    startTimer();
    super.initState();
  }

  @override
  void dispose() {
    if (_timer != null) {
      _timer!.cancel();
    }
    super.dispose();
  }

  void startTimer() {
    if (_timer != null) {
      _timer!.cancel();
      _timer = null;
    } else {
      _timer = Timer.periodic(const Duration(seconds: 1), (Timer timer) {
        setState(() {
          if (_start < 1) {
            _timer!.cancel();
          } else {
            _start = _start - 1;
          }
        });
      });
    }
  }

  buildStillLoadingWidget() {
    return Container(
      height: MediaQuery.of(context).size.height * 0.15,
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
          color: AppColorData.appSecondaryColor,
          borderRadius: BorderRadius.circular(15)),
      width: MediaQuery.of(context).size.width,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          CircularProgressIndicator(),
          Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CommonText(text: "waitHead"),
              CommonText(
                text: "waitBody",
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              )
            ],
          )
        ],
      ),
    );
  }

  Widget SearchLoaderCard() {
    return Row(
      children: [
        SizedBox(
          width: 5,
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CommonBlurContainer(
              height: 18,
              width: 80,
            ),
            SizedBox(
              height: 5,
            ),
            Row(
              children: [
                CommonBlurContainer(
                  height: 14,
                  width: 60,
                ),
                SizedBox(
                  width: 3,
                ),
                CommonText(
                  text: Strings.dot,
                ),
                SizedBox(
                  width: 3,
                ),
                CommonBlurContainer(
                  height: 14,
                  width: 90,
                ),
              ],
            )
          ],
        ),
        Spacer()
      ],
    );
  }

  Widget ProductCategoryCard() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(
          height: 10,
        ),
        CommonBlurContainer(
          height: 300,
          borderRadius: BorderRadius.circular(10),
        ),
        const SizedBox(
          height: 14,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            CommonBlurContainer(
              height: 18,
              width: 164,
              borderRadius: BorderRadius.circular(4),
            ),
            const SizedBox(
              width: 14,
            ),
            CommonBlurContainer(
              height: 18,
              width: 50,
              borderRadius: BorderRadius.circular(4),
            ),
          ],
        ),
        SizedBox(
          height: 14,
        ),
        CommonBlurContainer(
          height: 18,
          width: 100,
          borderRadius: BorderRadius.circular(4),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Stack(
        children: [
          Shimmer.fromColors(
            baseColor: AppColorData.shimmerBaseColor,
            highlightColor: AppColorData.shimmerHighlightColor,
            child: widget.isSearchBarLoader
                ? SearchLoaderCard()
                : widget.isProductCategoryLoader
                    ? Column(
                        children: [
                          Container(
                            height: 100,
                            child: ListView.builder(
                                padding: EdgeInsets.symmetric(horizontal: 20.0),
                                shrinkWrap: true,
                                itemCount: 14,
                                scrollDirection: Axis.horizontal,
                                itemBuilder: (context, index) {
                                  return Row(
                                    children: [
                                      Column(
                                        children: [
                                          SizedBox(
                                            height: 14,
                                          ),
                                          CommonBlurContainer(
                                            height: 30,
                                            width: 30,
                                            borderRadius:
                                                BorderRadius.circular(30),
                                          ),
                                          SizedBox(
                                            height: 14,
                                          ),
                                          CommonBlurContainer(
                                            height: 16,
                                            width: 70,
                                          )
                                        ],
                                      ),
                                      SizedBox(
                                        width: 20,
                                      )
                                    ],
                                  );
                                }),
                          ),
                          ListView.builder(
                            shrinkWrap: true,
                            padding: EdgeInsets.symmetric(horizontal: 20.0),
                            itemCount: 2,
                            itemBuilder: (context, index) {
                              return ProductCategoryCard();
                            },
                          ),
                        ],
                      )
                    : Container(),
          ),
          Positioned(
            left: 20,
            right: 20,
            top: MediaQuery.of(context).size.height * 0.4,
            child: _start == 0 ? buildStillLoadingWidget() : Container(),
          )
        ],
      ),
    );
  }
}
