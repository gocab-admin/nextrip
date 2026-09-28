import 'dart:async';
import 'package:airstar_flutter/commonWidgets/widget/common_blur_container.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../../../commonWidgets/loading_widgets/loader.dart';

class ChatListScreenLoader extends StatefulWidget {
  const ChatListScreenLoader({super.key});

  @override
  State<ChatListScreenLoader> createState() => _ChatListScreenLoaderState();
}

class _ChatListScreenLoaderState extends State<ChatListScreenLoader> {
  Timer? _timer;
  int _start = 10;

  @override
  void initState() {
    startTime();
    super.initState();
  }

  @override
  void dispose() {
    if (_timer != null) {
      _timer!.cancel();
    }
    super.dispose();
  }

  void startTime() {
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
      // height: 120,
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 20),
      decoration: BoxDecoration(
          color: AppColorData.appSecondaryColor,
          borderRadius: BorderRadius.circular(10)),
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
                //maxLines: 3,
                overflow: TextOverflow.ellipsis,
              )
            ],
          )
        ],
      ),
    );
  }

  Widget ChatListCard() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            CommonBlurContainer(
              height: 40,
              width: 40,
              borderRadius: BorderRadius.circular(30),
            ),
            SizedBox(
              width: 20,
            ),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      CommonBlurContainer(
                        height: 18,
                        width: 40,
                      ),
                      // SizedBox(width: 220,),
                      CommonBlurContainer(
                        height: 18,
                        width: 40,
                      ),
                    ],
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  CommonBlurContainer(
                    height: 18,
                    width: 130,
                  )
                ],
              ),
            ),
          ],
        ),
        CustomDivider(
          height: 40,
        ),
        // SizedBox(height: 40,)
      ],
    );
  }

  Widget chatheadCard() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ListView.builder(
            shrinkWrap: true,
            itemCount: 6,
            itemBuilder: (context, index) {
              return ChatListCard();
            }),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 600,
      child: ListView(
        physics: AlwaysScrollableScrollPhysics(),
       // padding: horizontalPadding(vertical: 14),
        children: [
          Stack(
            children: [
              Shimmer.fromColors(
                baseColor: AppColorData.shimmerBaseColor,
                highlightColor: AppColorData.shimmerHighlightColor,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    chatheadCard(),
                  ],
                ),
              ),
              Positioned(
                  left: 20,
                  right: 20,
                  top: 350,
                  child: _start == 0 ? buildStillLoadingWidget() : Container())
            ],
          ),
        ],
      ),
    );
  }
}
