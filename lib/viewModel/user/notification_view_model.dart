import 'package:airstar_flutter/commonWidgets/toastWidget/app_toast.dart';
import 'package:airstar_flutter/data/models/user/notification.dart';
import 'package:airstar_flutter/data/repositories/user/notification_repo.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';

class NotificationViewModel extends BaseViewModel {
  final NotificationRepository _notificationRepository =
      locator<NotificationRepository>();

  NotificationResponseModel? _notificationResponseModel;

  NotificationResponseModel? get notificationResponseModel =>
      _notificationResponseModel;

  Future<bool> fetchNotification() async {
    setState(ViewState.busy);
    try {
      NotificationResponseModel data =
          await _notificationRepository.fetchNotification();

      _notificationResponseModel = data;

      // Logger.appLogs('Token stored: ${loginResponseModel!.data.user.token}');
      setState(ViewState.success);
      return data.status!;
    } on AppException catch (appException) {
      //  Logger.appLogs('errorType :: ${appException.type}');
      //  Logger.appLogs('onFailure :: $appException');
      errorMsg = errorHandler(appException);

      setState(ViewState.idle);
      return false;
    }
  }

  Future<void> clearNotification(String id) async {
    setState(ViewState.busy);
    try {
      var data = await _notificationRepository.clearNotification(id);

      if (data == true) {
        fetchNotification();
        ToastUtil.showMessage("notificationDeleted");
      }

      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);

      setState(ViewState.idle);
    }
  }
}
