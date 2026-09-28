//
// import 'package:flutter/material.dart';
// import '../utils/utils.dart';
//
// class NoInternet extends StatelessWidget {
//   const NoInternet({Key? key}) : super(key: key);
//
//   @override
//   Widget build(BuildContext context) {
//     return WillPopScope(
//       onWillPop: willPopCallback,
//       child: Scaffold(
//         body: Container(
//           width: MediaQuery.of(context).size.width,
//           height: MediaQuery.of(context).size.height,
//           color: AppColorData.blurContainer,
//           child: Column(
//             mainAxisAlignment: MainAxisAlignment.center,
//             children: [
//               Padding(
//                 padding: const EdgeInsets.all(Dimensions.dm_15),
//                 child: CommonText(text:
//                   Strings.connectionError,
//                   style:  TextStyle(
//                     color: AppColorData.appSecondaryColor,
//                     fontWeight: FontWeight.w600,
//                     fontSize: Dimensions.dm_20,
//                   ),
//                 ),
//               ),
//                Padding(
//                 padding: EdgeInsets.symmetric(horizontal: Dimensions.dm_60),
//                 child:CommonText(text:
//                   Strings.checkInternet,
//                   textAlign: TextAlign.center,
//                   style: TextStyle(
//                     color: AppColorData.appSecondaryColor,
//                     fontWeight: FontWeight.w400,
//                     fontSize: Dimensions.dm_16,
//                   ),
//                 ),
//               ),
//               Padding(
//                 padding: const EdgeInsets.symmetric(vertical: Dimensions.dm_50),
//                 child: Image.asset(PNGAssets.connection_error),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }
