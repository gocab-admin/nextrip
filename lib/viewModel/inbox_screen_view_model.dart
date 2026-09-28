
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/constants/strings.dart';
import '../utils/shardHelper/preference_constant.dart';

class InBoxScreenViewModel extends BaseViewModel {
  String? token;
  int selectedIndex = 0;

  List<String> messages = ['${Strings.all}', '${Strings.travelling}','${Strings.support}'];
  List<String> names = ['${Strings.airstarSupport}', '${Strings.maddy}','${Strings.saru}','${Strings.izaz}',];

  Future<void> getToken() async {
    setState(ViewState.busy);
    SharedPreferences prefs = await SharedPreferences.getInstance();
    token = prefs.getString(PrefConstant.authToken);
    setState(ViewState.success);
  }

  void updateSelectedIndex(int index) {
    selectedIndex = index;
    notify();
  }
}
