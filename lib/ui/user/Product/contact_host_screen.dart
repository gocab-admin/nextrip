import 'package:airstar_flutter/commonWidgets/common_widgets.dart';

import 'package:airstar_flutter/ui/user/login_and_signup/register_screen.dart';
import 'package:flutter/material.dart';
import 'package:airstar_flutter/utils/utils.dart';
import '../../../data/models/user/listing_detail_response_model.dart';



// ********************Code return for Message screen **************************************
class ContactHostScreen extends StatefulWidget {
  final Listing? data;
  const ContactHostScreen({super.key, this.data});

  @override
  State<ContactHostScreen> createState() => _ContactHostScreenState();
}

class _ContactHostScreenState extends State<ContactHostScreen> {
  String _inputText = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColorData.appSecondaryColor,
      appBar: CommonAppBar(),
      body: _renderBody(),
    );
  }

  Widget _renderBody() {
    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 14),
              child: Container(
                width: MediaQuery
                    .of(context)
                    .size
                    .width,
                height: MediaQuery
                    .of(context)
                    .size
                    .height * 0.7,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            CommonText(text:widget.data?.propertyCategoryName ?? '',
                              style: AppTextStyle.bodyTextStyle,),
                            spacer(),
                            CommonText(text:"entireBangalow"),

                          ],
                        ),
                        // ClipRRect(
                        //   child: Container(
                        //       width: MediaQuery
                        //           .of(context)
                        //           .size
                        //           .width * 0.4,
                        //       child: Image.asset(PNGAssets.hotel_image)
                        //   ),
                        // )
                      ],
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        CommonText(text: "dates", style: AppTextStyle.headerStyle,),
                        CommonText(
                          isUnderline: true,
                          text:"Jul7 - 12",
                          style: AppTextStyle.bodyTextStyle,)
                      ],
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        CommonText(text:
                          "guests", style: AppTextStyle.headerStyle,),
                        CommonText(
                          isUnderline:true,text:"1 guest",
                          style: AppTextStyle.bodyTextStyle,)
                      ],
                    ),
                    Divider(),
                    CommonText(text:"msgTheHost", style: AppTextStyle.titleStyle,),
                    CommonText(text:"IllBeVisiting",
                      style: AppTextStyle.subBodyHintTextStyle,),

                    Container(
                      width: MediaQuery
                          .of(context)
                          .size
                          .width * 0.9,
                      height: MediaQuery
                          .of(context)
                          .size
                          .height * 0.18,
                      decoration: BoxDecoration(
                          border: Border.all(color: AppColorData.boxBorder),
                          borderRadius: BorderRadius.circular(10)
                      ),
                      child: CommonTextFromField(
                        contentPadding: EdgeInsets.all(10),
                        expands: true,
                        maxLines: null,
                        onChanged: (value) {
                          setState(() {
                            _inputText = value;
                          });
                        },
                      ),
                    ),

                  ],
                ),
              ),
            ),
          ),
        ),
        Align(
          alignment: Alignment.bottomCenter,
          child: Container(
            padding: EdgeInsets.fromLTRB(10, 25, 10, 30),
            height: MediaQuery
                .of(context)
                .size
                .height * 0.15,
            decoration: BoxDecoration(
                border: Border(
                    top: BorderSide(color: AppColorData.boxBorder)
                )
            ),
            child: CommonElevatedButton(
                elevatedButtonColor: _inputText.isEmpty
                    ? AppColorData.disableButtonClr
                    : AppColorData.blackButtonClr,
                //value.isEmpty? AppColorData.boxBorder : AppColorData.blackButtonClr,
                elevatedButtonName: "sendMsg",
                onTap: () {}),


          ),
        )
      ],

    );
  }
}

//
// Widget _contactHost(){
//     return Column(
//       children: [
//         Expanded(
//           child: SingleChildScrollView(
//             child: Padding(padding: EdgeInsets.all(14),
//             child:  Container(
//               height: MediaQuery.of(context).size.height,
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 mainAxisAlignment: MainAxisAlignment.spaceEvenly,
//                 children: [
//                   Row(
//                     mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                     children: [
//                       Column(
//                         crossAxisAlignment: CrossAxisAlignment.start,
//                         children: [
//                           Text("contactMaeve",style: AppTextStyle.titleStyle,),
//                           Text(Strings.respondsWithinHr,style: AppTextStyle.contentStyle,)
//                         ],
//                       ),
//                       CircleAvatar(
//                         radius: 25,
//                       )
//                     ],
//                   ),
//                   divider(),
//                   Text(Strings.mostTravelerAskAbt,style: AppTextStyle.titleStyle,),
//                   Text(Strings.gettingThere,style: AppTextStyle.subHeaderStyle,),
//                   Text("${Strings.bulletPoint}  ${Strings.freeParking}"),
//                   Text("${Strings.bulletPoint}  ${Strings.aboutPara2}"),
//                   Text(Strings.houseDetailsARules,style: AppTextStyle.subHeaderStyle,),
//                   Text("${Strings.bulletPoint}  ${Strings.noPartiesOrEvents}"),
//                   Text(Strings.priceAvailability,style: AppTextStyle.subHeaderStyle,),
//                   Text("${Strings.bulletPoint}  ${Strings.aboutPara2}"),
//
//                   divider(),
//                   Row(
//                     children: [
//                       Text(Strings.homeAvailable,),
//                       TextButton(
//                         onPressed: (){},
//                           child: Text(Strings.book,style: AppTextStyle.underlinedHeaderText,))
//                     ],
//                   ),
//
//                 ],
//               ),
//             ),),
//           ),
//         ),
//         Align(
//           alignment: Alignment.bottomCenter,
//           child: Container(
//             height: MediaQuery.of(context).size.height*0.1,
//             decoration: BoxDecoration(
//                 border: Border(top: BorderSide(color: AppColorData.boxBorder))
//             ),
//             child: Row(
//               mainAxisAlignment: MainAxisAlignment.spaceEvenly,
//               children: [
//                 Text(Strings.stillHaveAQn),
//                 Container(
//                   width: MediaQuery.of(context).size.width*0.45,
//                   child: CommonElevatedButton(
//                     onTap: (){
//                       Navigator.push(context, MaterialPageRoute(builder: (context)=> _renderBody()));
//                     },
//                     elevatedButtonNameColor: AppColorData.appSecondaryColor,
//                     elevatedButtonName: "msgHost",
//                     elevatedButtonColor: AppColorData.blackButtonClr,
//                   ),
//                 )
//               ],
//             ),
//           ),
//         )
//       ],
//     );
// }
//}

