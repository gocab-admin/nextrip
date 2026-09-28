import 'dart:async';
import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/utils/components/color/app_color.dart';
import 'package:airstar_flutter/utils/constants/common_text.dart';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class WishlistCollectionLoader extends StatefulWidget {
  const WishlistCollectionLoader({super.key});

  @override
  State<WishlistCollectionLoader> createState() => _WishlistCollectionLoaderState();
}

class _WishlistCollectionLoaderState extends State<WishlistCollectionLoader> {
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
      // height: MediaQuery.of(context).size.height * 0.15,
      padding: const EdgeInsets.symmetric(horizontal: 10,vertical: 20),
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
            child:  ListView.builder(
              shrinkWrap: true,
            //  padding: EdgeInsets.symmetric(horizontal: 20.0),
              itemCount: 2,
              itemBuilder: (context, index) {
                return ProductCategoryCard();
              },
            )

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
