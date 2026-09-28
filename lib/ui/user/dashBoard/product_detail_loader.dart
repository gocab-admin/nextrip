import 'dart:async';
import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/utils/components/color/app_color.dart';
import 'package:airstar_flutter/utils/constants/common_text.dart';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class ProductDetailLoader extends StatefulWidget {
  const ProductDetailLoader({super.key});

  @override
  State<ProductDetailLoader> createState() => _ProductDetailLoaderState();
}

class _ProductDetailLoaderState extends State<ProductDetailLoader> {
  Timer? _timer;
  int _start = 10;

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
      //height: 120,
      //height: MediaQuery.of(context).size.height * 0.15,
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 20),
      decoration: BoxDecoration(
          color: AppColorData.appSecondaryColor,
          borderRadius: BorderRadius.circular(15)),
      width: MediaQuery.of(context).size.width,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          ProgressLoader(),
          Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CommonText(text: "waitHead"),
              CommonText(
                text: "waitBody",
                // maxLines: 3,
                overflow: TextOverflow.ellipsis,
              )
            ],
          )
        ],
      ),
    );
  }

  Widget ProductDetailLoaderCard() {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(14.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CommonBlurContainer(
              height: 350,
            ),
            SizedBox(
              height: 14,
            ),
            CommonBlurContainer(
              height: 20,
              width: 200,
              isBorderRadius: true,
            ),
            SizedBox(
              height: 14,
            ),
            CommonBlurContainer(
              height: 16,
              width: 100,
              isBorderRadius: true,
            ),
            SizedBox(
              height: 14,
            ),
            CommonBlurContainer(
              height: 16,
              width: 250,
              isBorderRadius: true,
            ),
            SizedBox(
              height: 14,
            ),
            CommonBlurContainer(
              height: 16,
              width: 140,
              isBorderRadius: true,
            ),
            divider(height: 40),
            Row(
              children: [
                CommonBlurContainer(
                  height: 60,
                  width: 60,
                  borderRadius: BorderRadius.circular(30),
                ),
                SizedBox(
                  width: 18,
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CommonBlurContainer(
                      height: 20,
                      width: 200,
                      isBorderRadius: true,
                    ),
                    SizedBox(
                      height: 14,
                    ),
                    CommonBlurContainer(
                      height: 16,
                      width: 160,
                      isBorderRadius: true,
                    )
                  ],
                ),
              ],
            ),
            divider(height: 50),
            CommonBlurContainer(
              height: 20,
              width: 180,
              isBorderRadius: true,
            ),
            SizedBox(
              height: 18,
            ),
            CommonBlurContainer(
              height: 18,
              isBorderRadius: true,
            ),
            SizedBox(
              height: 14,
            ),
            CommonBlurContainer(
              height: 18,
              isBorderRadius: true,
            ),
            SizedBox(
              height: 14,
            ),
            CommonBlurContainer(
              height: 20,
              width: 130,
              isBorderRadius: true,
            ),
            SizedBox(
              height: 18,
            ),
            divider(),
            CommonBlurContainer(
              height: 24,
              width: 180,
              isBorderRadius: true,
            ),
            SizedBox(
              height: 18,
            ),
            CommonBlurContainer(
              height: 120,
              width: 130,
              isBorderRadius: true,
            ),
            divider(height: 40),
            CommonBlurContainer(
              height: 20,
              width: 180,
              isBorderRadius: true,
            ),
            SizedBox(
              height: 18,
            ),
            CommonBlurContainer(
              height: 18,
              width: 150,
              isBorderRadius: true,
            ),
            SizedBox(
              height: 18,
            ),
            CommonBlurContainer(
              height: 18,
              width: 150,
              isBorderRadius: true,
            ),
            SizedBox(
              height: 18,
            ),
            CommonBlurContainer(
              height: 18,
              width: 150,
              isBorderRadius: true,
            ),
            SizedBox(
              height: 20,
            ),
            Padding(
              padding: const EdgeInsets.only(left: 28.0),
              child: CommonBlurContainer(
                height: 42,
                width: 320,
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            divider(height: 40)
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Shimmer.fromColors(
          baseColor: AppColorData.shimmerBaseColor,
          highlightColor: AppColorData.shimmerHighlightColor,
          child: ProductDetailLoaderCard(),
        ),
        // Positioned(
        //   left: 20,
        //   right: 20,
        //   top: 350,
        //   //top: MediaQuery.of(context).size.height * 0.5,
        //   child: _start == 0 ? buildStillLoadingWidget() : Container(),
        // )
      ],
    );
  }
}
