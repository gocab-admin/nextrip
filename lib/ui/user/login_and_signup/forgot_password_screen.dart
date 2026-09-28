// import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
// import 'package:airstar_flutter/data/models/settings_response_model.dart';
// import 'package:airstar_flutter/ui/Profile/profile_view_screen.dart';
// import 'package:airstar_flutter/utils/constants/textstyle.dart';
// import 'package:flutter/material.dart';
// import 'package:fluttertoast/fluttertoast.dart';

// import '../../utils/utils.dart';
// import '../dashBoard/searchBar.dart';

// class ForgotPasswordScreen extends StatefulWidget {
//   const ForgotPasswordScreen({super.key});

//   @override
//   State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
// }

// class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
//   final forgotPasswordController = TextEditingController();
//   bool passwordObscure = true;

//   // @override
//   // void initState() {
//   //   super.initState();
//   //   fToast = FToast();
//   //   fToast.init(context);
//   // }
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: AppColorData.appSecondaryColor,
//       appBar: CommonAppBar(),
//       body: _renderBody(),
//     );
//   }

//   Widget _renderBody() {
//     final toastUtil = ToastUtil(context);
//     return Padding(
//       padding: EdgeInsets.all(14),
//       child: Column(
//         children: [
//           Expanded(
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 Text(
//                   Strings.login,
//                   style: AppTextStyle.titleStyle,
//                 ),
//                 doubleSpacer(),
//                 CommonTextFromField(
//                   contentPadding: EdgeInsets.all(10.0),
//                   labelText: Strings.psWord,
//                   controller: forgotPasswordController,
//                   obscureText: passwordObscure,
//                   suffixIcon: TextButton(
//                     onPressed: () {
//                       setState(() {
//                         passwordObscure = !passwordObscure;
//                       });
//                     },
//                     child: passwordObscure
//                         ? Text(Strings.show,
//                             style:
//                                 TextStyle(color: AppColorData.subBodyTextClr))
//                         : Text(
//                             Strings.hide,
//                             style:
//                                 TextStyle(color: AppColorData.subBodyTextClr),
//                           ),
//                   ),
//                   border: Border.all(color: AppColorData.boxBorder),
//                   textStyle: TextStyle(
//                     fontSize: 16,
//                     color: AppColorData.bodyTextColor,
//                     fontWeight: FontWeight.w400,
//                   ),
//                 ),
//                 doubleSpacer(),
//                 CommonElevatedButton(
//                     elevatedButtonColor: AppColorData.shimmerBaseColor,
//                     elevatedButtonName: Strings.continueKeyWord,
//                     onTap: () {
//                       toastUtil.showModalToast(
//                         seconds: 6,
//                         child: Material(
//                           color: Colors.white,
//                           child: Row(
//                             mainAxisSize: MainAxisSize.min,
//                             children: [
//                               CircleAvatar(
//                                 backgroundColor: AppColorData.snackBarColor,
//                                 child: Icon(
//                                   Icons.check,
//                                   color: AppColorData.appSecondaryColor,
//                                 ),
//                               ),
//                               SizedBox(
//                                 width: 14,
//                               ),
//                               Text(
//                                 "${Strings.linkToResetPswrd} seo@abservetech.com",
//                                 style: AppTextStyle.bodyStyle,
//                               )
//                             ],
//                           ),
//                         ),
//                       );
//                     }),
//                 doubleSpacer(),
//                 Align(
//                     alignment: Alignment.topCenter,
//                     child: CommonText(isUnderline:true,
//                     text:  Strings.forgottenPassword,
//                       style: AppTextStyle.bodyTextStyle,
//                     )),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }
