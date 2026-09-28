// import 'package:another_flushbar/flushbar.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

import '../../utils/utils.dart';

/*void customSnackBar(
    {BuildContext? context, required String title, required String message}) {
  if (context != null) {
    Flushbar(
      title: title,
      message: message,
      icon: Icon(
        Icons.info_outline,
        size: 28,
        color: Theme.of(context).primaryColor,
      ),
      leftBarIndicatorColor: Theme.of(context).primaryColor,
      duration: const Duration(seconds: 5),
    ).show(context);
  }
}*/

void showFlutterToast({String? msg}) {
  Fluttertoast.showToast(
    msg: msg ?? '',
    toastLength: Toast.LENGTH_SHORT,
    gravity: ToastGravity.TOP,
    timeInSecForIosWeb: 1,
    backgroundColor: AppColorData.appPrimaryColor,
    textColor: AppColorData.appSecondaryColor,
    fontSize: 16.0,
  );
}

void customToast({
  String? msg,
  //required BuildContext context,
  required String image,
  ToastGravity? gravity,
  // Widget? BoxShadow,
  Color? backgroundColor,
  Color? textColor,
  String? actionText,
  Color? actionTextColor,
  required VoidCallback onActionTap,
}) {
  final resolvedGravity = gravity ?? ToastGravity.BOTTOM;
  final resolvedBackgroundColor =
      backgroundColor ?? AppColorData.appSecondaryColor;
  final resolvedTextColor = textColor ?? AppColorData.bodyTextColor;
  final resolvedActionTextColor = actionTextColor ?? AppColorData.bodyTextColor;

  FToast fToast = FToast();
  // fToast.init(context);

  Widget toast = Container(
    decoration: BoxDecoration(
      boxShadow: [
        BoxShadow(
          color: Colors.grey,
          spreadRadius: -2,
          blurRadius: 15,
          offset: Offset(0, 0),
        ),
      ],
      color: resolvedBackgroundColor,
      borderRadius: BorderRadius.circular(10),
    ),
    padding: EdgeInsets.symmetric(horizontal: 14, vertical: 8),
    child: Row(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(10.0),
          child: Image.asset(image, width: 70, height: 70, fit: BoxFit.cover),
        ),
        SizedBox(width: 10),
        Expanded(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              CommonText(
                text: msg ?? "",
                style: TextStyle(
                  color: resolvedTextColor,
                  fontSize: 16,
                  fontWeight: FontWeight.w400,
                ),
              ),
              SizedBox(height: 5),
              GestureDetector(
                onTap: onActionTap,
                child: CommonText(
                  text: actionText ?? "",
                  style: TextStyle(
                    color: resolvedActionTextColor,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    decoration: TextDecoration.underline,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    ),
  );

  fToast.showToast(
    child: toast,
    toastDuration: Duration(seconds: 5),
    gravity: resolvedGravity,
  );
}
