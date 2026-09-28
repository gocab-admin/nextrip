import 'package:flutter/material.dart';

import '../../utils/utils.dart';

enum ViewState {
  idle,
  busy,
  success,
  error,
  secondaryLoader,
  tertiaryLoader,
  hostLogin,
  guestLogin
}

class BaseViewModel extends ChangeNotifier {
  ViewState _viewState = ViewState.idle;
  bool _disposed = false;
  String errorMsg = '';

  late AppException error;

  ViewState get state => _viewState;

  void setState(ViewState viewState) {
    _viewState = viewState;
    notify();
  }

  void notify() {
    notifyListeners();
  }

  @override
  void notifyListeners() {
    if (_disposed) return;
    super.notifyListeners();
  }

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }
}
