import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../commonWidgets/loading_widgets/loader.dart';
import '../../../../viewModel/base_view_model/base_view_model.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/view_model.dart';

class DebouncedShareButton extends StatefulWidget {
  final ProductListingViewModel viewModel;
  final ProductDetailViewModel productDetailModel;

  const DebouncedShareButton({
    Key? key,
    required this.viewModel,
    required this.productDetailModel,
  }) : super(key: key);

  @override
  State<DebouncedShareButton> createState() => _DebouncedShareButtonState();
}

class _DebouncedShareButtonState extends State<DebouncedShareButton> {
  DateTime? _lastTapTime;
  static const _debounceTime = Duration(milliseconds: 500);
  bool _isBottomSheetOpen = false;

  void _handleShare(BuildContext context) {
    if (_isBottomSheetOpen) return;

    final now = DateTime.now();
    if (_lastTapTime != null && now.difference(_lastTapTime!) < _debounceTime) {
      // Ignore tap if it's too soon after the last one
      return;
    }
    _lastTapTime = now;

    if (widget.viewModel.state != ViewState.secondaryLoader) {
      _isBottomSheetOpen = true;

      widget.productDetailModel.shareFile(context).whenComplete(() {
        _isBottomSheetOpen = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 14.0),
      child: Consumer<ProductListingViewModel>(
        builder: (context, value, child) {
          return CircleAvatar(
            radius: 18,
            backgroundColor: AppColorData.appSecondaryColor,
            child: IconButton(
              onPressed: () => _handleShare(context),
              icon: value.state == ViewState.secondaryLoader
                  ? const ProgressLoader()
                  : Icon(
                Icons.share_outlined,
                size: 18,
                color: AppColorData.appIconBlack,
              ),
            ),
          );
        },
      ),
    );
  }
}

