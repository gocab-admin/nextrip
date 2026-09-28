import 'dart:async';
import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/utils/components/color/app_color.dart';
import 'package:airstar_flutter/utils/constants/common_text.dart';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class WishlistLoader extends StatefulWidget {
  const WishlistLoader({super.key});

  @override
  State<WishlistLoader> createState() => _WishlistLoaderState();
}

class _WishlistLoaderState extends State<WishlistLoader> {
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

  Widget WishListLoaderCard() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CommonBlurContainer(
          height: 160,
          borderRadius: BorderRadius.circular(14),
        ),
        SizedBox(
          height: 10,
        ),
        CommonBlurContainer(
          height: 18,
          width: 150,
          isBorderRadius: true,
        ),
        SizedBox(
          height: 10,
        ),
        CommonBlurContainer(
          height: 18,
          width: 120,
          isBorderRadius: true,
        )
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Shimmer.fromColors(
          baseColor: AppColorData.shimmerBaseColor,
          highlightColor: AppColorData.shimmerHighlightColor,
          child:
              Column(
               crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // SizedBox(height: 10,),
                  // CommonBlurContainer(height: 30,width: 140,isBorderRadius: true,),
                  // SizedBox(height: 20,),
                  Expanded(
                    child:
              GridView.builder(
                  itemCount: 10,
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      mainAxisExtent: 220,
                      mainAxisSpacing: 20,
                      crossAxisSpacing: 20,
                      crossAxisCount: 2),
                  itemBuilder: (context, index) {
                    return WishListLoaderCard();
                  }),
        ),
          ],
        ),
        ),
        Positioned(
          left: 20,
          right: 20,
          top: 350,
         // top: MediaQuery.of(context).size.height * 0.4,
          child: _start == 0 ? buildStillLoadingWidget() : Container(),
        )
      ],
    );
  }
}
