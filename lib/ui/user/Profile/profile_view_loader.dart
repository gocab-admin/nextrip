import 'dart:async';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import 'package:airstar_flutter/commonWidgets/common_widgets.dart';

class ProfileViewScreenLoader extends StatefulWidget {
  final bool isProfileViewLoader;
  final bool isProfileMainScreenLoader;

  const ProfileViewScreenLoader(
      {this.isProfileMainScreenLoader = false,
      this.isProfileViewLoader = false,
      super.key});

  @override
  State<ProfileViewScreenLoader> createState() =>
      _ProfileViewScreenLoaderState();
}

class _ProfileViewScreenLoaderState extends State<ProfileViewScreenLoader> {
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
      _timer = Timer.periodic(Duration(seconds: 1), (Timer timer) {
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
      padding: EdgeInsets.all(10.0),
      decoration: BoxDecoration(
          color: AppColorData.appSecondaryColor,
          borderRadius: BorderRadius.circular(15)),
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
                overflow: TextOverflow.ellipsis,
                maxLines: 2,
              )
            ],
          )
        ],
      ),
    );
  }

  Widget ProfileViewLoaderCard() {
    return Padding(
      padding: const EdgeInsets.all(18.0),
      child: Container(
        height: 200,
        padding: EdgeInsets.all(10),
        decoration: BoxDecoration(
            // color: AppColorData.appSecondaryColor,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: AppColorData.boxBorder),
            boxShadow: [
              BoxShadow(
                  color: Colors.grey.withOpacity(0.2),
                  offset: Offset(4.0, 4.0),
                  blurRadius: 15,
                  spreadRadius: 1),
              BoxShadow(
                  color: Colors.grey.withOpacity(0.2),
                  offset: Offset(-4.0, -4.0),
                  blurRadius: 15,
                  spreadRadius: 1)
            ]),
        child: Row(
          //mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(
                  height: 14,
                ),
                CommonBlurContainer(
                  height: 80,
                  width: 80,
                  borderRadius: BorderRadius.circular(50),
                ),
                SizedBox(
                  height: 14,
                ),
                CommonBlurContainer(
                  height: 28,
                  width: 100,
                ),
                SizedBox(
                  height: 10,
                ),
                CommonBlurContainer(
                  height: 18,
                  width: 60,
                ),
                SizedBox(
                  height: 14,
                ),
              ],
            ),
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CommonBlurContainer(
                  height: 24,
                  width: 40,
                ),
                SizedBox(
                  height: 14,
                ),
                CommonBlurContainer(
                  height: 18,
                  width: 100,
                ),
              ],
            )
          ],
        ),
      ),
    );
  }

  Widget ProfileScreenLoaderCard() {
    return Column(
      children: [
        SizedBox(
          height: 14,
        ),
        Row(
          children: [
            CommonBlurContainer(
              height: 50,
              width: 50,
              borderRadius: BorderRadius.circular(30),
            ),
            SizedBox(
              width: 20,
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CommonBlurContainer(
                  height: 16,
                  width: 180,
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
              ],
            ),
            Spacer(),
            CommonBlurContainer(
              height: 20,
              width: 30,
              isBorderRadius: true,
            ),
          ],
        ),
        divider(height: 40)
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
            child: widget.isProfileMainScreenLoader
                ? ProfileScreenLoaderCard()
                : widget.isProfileViewLoader
                    ? ProfileViewLoaderCard()
                    : Container()),
        Positioned(
          left: 20,
          right: 20,
          top: MediaQuery.of(context).size.height * 0.4,
          child: _start == 0 ? buildStillLoadingWidget() : Container(),
        )
      ],
    );
  }
}
