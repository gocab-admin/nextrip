import 'dart:async';

import 'package:airstar_flutter/utils/components/color/app_color.dart';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../common_widgets.dart';
import '../../utils/constants/common_text.dart';

class TripScreenLoader extends StatefulWidget {
  const TripScreenLoader({super.key});

  @override
  State<TripScreenLoader> createState() => _TripScreenLoaderState();
}

class _TripScreenLoaderState extends State<TripScreenLoader> {
  Timer? _timer;
  int _start = 10;


  @override
  void initState() {
    startTimer();
    super.initState();
  }


  @override
  void dispose() {
   if(_timer != null){
     _timer!.cancel();
   }
    super.dispose();
  }


  void startTimer(){
    if(_timer != null){
      _timer!.cancel();
      _timer = null;
    }else{
      _timer = Timer.periodic(Duration(seconds: 1), (Timer timer){
        setState(() {
          if(_start> 1){
            _timer!.cancel();
          }else{
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
          color: AppColorData.appSecondaryColor, borderRadius: BorderRadius.circular(15)),
      width: MediaQuery.of(context).size.width,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          CircularProgressIndicator(),
          Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CommonText(text:"waitHead"),
              CommonText(text:
              "waitBody",
               // maxLines: 2,
                overflow: TextOverflow.ellipsis,
              )
            ],
          )
        ],
      ),
    );
  }

Widget TripScreenLoaderCard(){
    return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
               CommonBlurContainer(
                 height: 300,borderRadius: BorderRadius.vertical(top: Radius.circular(10)),
               ),
              SizedBox(height: 14,),
              CommonBlurContainer(height: 20,width: 200,),
             // SizedBox(height: 10,),
              divider(),
              IntrinsicHeight(
                child: Row(
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        CommonBlurContainer(height: 12,width: 40,),
                        SizedBox(height: 10,),
                        CommonBlurContainer(height: 12,width: 50,),
                        SizedBox(height: 10,),
                        CommonBlurContainer(height: 12,width: 40,),
                      ],
                    ),
                    VerticalDivider(width: 30,),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        CommonBlurContainer(height: 12,width: 200,),
                        SizedBox(height: 10,),
                        CommonBlurContainer(height: 12,width: 120,),
                        SizedBox(height: 10,),
                        CommonBlurContainer(height: 12,width: 80,),
                      ],
                    )
                  ],
                ),
              ),
              SizedBox(height: 45,)

      ],
    );
}

  @override
  Widget build(BuildContext context) {
    return  Padding(
      padding: const EdgeInsets.all(20.0),
      child: Stack(
        children: [
          Shimmer.fromColors(
            baseColor: AppColorData.shimmerBaseColor,
            highlightColor: AppColorData.shimmerHighlightColor,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // SizedBox(height: 50,),
                // CommonBlurContainer(height: 26,width: 100,),
               // SizedBox(height: 30,),
                Expanded(
                  child: ListView.builder(
                    scrollDirection: Axis.vertical,
                    physics: AlwaysScrollableScrollPhysics(),
                    shrinkWrap: true,
                      itemCount: 5,
                      itemBuilder: (context, index){
                        return TripScreenLoaderCard();
                      }
                  ),
                ),
              ],
            ),
          ),

          Positioned(
            left: 20,right: 20,
            //  top: MediaQuery.of(context).size.height * 0.4,
              top: 350,
              child: _start == 0 ? buildStillLoadingWidget() : Container())
        ],
      ),
    );
  }
}
