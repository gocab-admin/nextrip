
import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/utils/components/color/app_color.dart';
import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

class CommonWebPageWidget extends StatefulWidget {
  const CommonWebPageWidget(
      {super.key, required this.url, required this.appBarTitle, this.showAppBar = true});

  final String url;
  final String appBarTitle;
  final bool showAppBar;

  @override
  State<CommonWebPageWidget> createState() => _CommonWebPageWidgetState();
}

class _CommonWebPageWidgetState extends State<CommonWebPageWidget> {
  late InAppWebViewController _webViewController;

  var progress;
  bool _isLoading = true;
  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: _onBackPressed,
      child: SafeArea(
        child: Scaffold(
          extendBodyBehindAppBar: true,
          appBar:  widget.showAppBar ? _buildAppBar() : null,
          backgroundColor: AppColorData.appSecondaryColor,
          body: _buildContentBody(),
        ),
      ),
    );
  }

  _buildContentBody() {
    return Container(
      color: AppColorData.appSecondaryColor,
      child: Stack(
        children: [
          InAppWebView(
            initialUrlRequest:
            URLRequest(url: WebUri.uri(Uri.parse(widget.url))),
            onWebViewCreated: (InAppWebViewController controller) {
              print("iscreated");
              _webViewController = controller;
            },
            onLoadStart: (controller, url) {
              _webViewController
                  .evaluateJavascript(source: '''javascript:(function() {

 var element = document.querySelector('.componentheaderstyles_home__MhEi6.border-bottom');

// Check if the element exists before attempting to remove it
if (element) {
  element.remove();
})()''')
                  .then(
                      (value) => debugPrint('Page finished loading Javascript'))
                  .catchError((onError) => debugPrint(' error $onError'));
              setState(() {
                _isLoading = true;
              });
              print("onLoadStart :: $url");
            },
            onLoadStop: (controller, url) {
              _webViewController
                  .evaluateJavascript(
                source:
                "javascript:(function() { var head = document.getElementsByTagName('header')[0];head.parentNode.removeChild(head);var footer = document.getElementsByTagName('footer')[0];footer.parentNode.removeChild(footer);})()",
              )
                  .then(
                      (value) => debugPrint('Page finished loading Javascript'))
                  .catchError((onError) => debugPrint(' error $onError'));
              setState(() {
                _isLoading = false;
              });
              print("Payment#Url: " + url.toString());
            },
            onProgressChanged:
                (InAppWebViewController controller, int progress) {
              setState(() {
                this.progress = progress / 100;
              });
              //loadData();
            },
          ),
          if (_isLoading)
            Container(
              color: AppColorData.appSecondaryColor,
              child: Center(
                child: ProgressLoader(),
              ),
            ),
        ],
      ),
    );
  }

  //------------------------------------------------------------------------------------------------->>

  _buildAppBar() {
    return PreferredSize(
      preferredSize: Size.fromHeight(60),
      child: CommonAppBar(
        isMainPage: false,
      ),
    );
  }

  Future<bool> _onBackPressed() async {
    bool canGoBack = await _webViewController.canGoBack();

    if(canGoBack) {
      await _webViewController.stopLoading();
      _webViewController.goBack();
      return false;  // Prevent app from closing
    }
      return true;
  }
}


