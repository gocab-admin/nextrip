import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import '../../utils/config/debugger/logger.dart';
import '../../utils/constants/common_text.dart';
import '../loading_widgets/loading_widget.dart';

final GlobalKey<ScaffoldMessengerState> snackBarKey =
    GlobalKey<ScaffoldMessengerState>();

class ToastUtil {
  late FToast fToast;

  ToastUtil(BuildContext context) {
    fToast = FToast();
    fToast.init(context);
  }

  static showAlertDialog(BuildContext context) {
    AlertDialog alert = AlertDialog(
      content: Row(
        children: [
          const ProgressLoader(),
          Container(
              margin: const EdgeInsets.only(left: 5),
              child: CommonText(text: "Loading")),
        ],
      ),
    );
    showDialog(
      barrierDismissible: false,
      context: context,
      builder: (BuildContext context) {
        return alert;
      },
    );
  }

  static showSnackBar(BuildContext context, String message) {
    Fluttertoast.showToast(
      toastLength: Toast.LENGTH_LONG,
      gravity: ToastGravity.BOTTOM,
      msg: message,
    );
  }

  static showShortToast(BuildContext context, String message) {
    Logger.appLogs("the short toast $context");
    Fluttertoast.showToast(
      toastLength: Toast.LENGTH_SHORT,
      gravity: ToastGravity.BOTTOM,
      msg: tr(message),
    );
  }

  static showLongToast(BuildContext context, String message) {
    Fluttertoast.showToast(
      toastLength: Toast.LENGTH_LONG,
      gravity: ToastGravity.BOTTOM,
      msg: message,
    );
  }

  static showSnackBarAtCurrentState(String message,
      {required SnackBarAction actions, required int seconds}) {
    final SnackBar snackBar = SnackBar(
      duration: Duration(seconds: seconds),
      action: actions,
      content: CommonText(
        text: message,
        style: const TextStyle(color: Colors.white),
      ),
    );
    snackBarKey.currentState?.showSnackBar(snackBar);
  }

  static showMessage(String message) {
    Fluttertoast.showToast(
      msg: tr("$message"),
      toastLength: Toast.LENGTH_SHORT,
      gravity: ToastGravity.BOTTOM,
      timeInSecForIosWeb: 1,
      backgroundColor: Colors.black,
      textColor: Colors.white,
      fontSize: 16.0,
    );
  }

  void showModalToast({required Widget child, int? seconds}) {
    fToast.showToast(
        toastDuration: Duration(seconds: seconds != null ? seconds : 2),
        gravity: ToastGravity.BOTTOM,
        child: child);
  }
}
