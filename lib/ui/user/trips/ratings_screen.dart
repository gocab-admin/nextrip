import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/view_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:provider/provider.dart';

import '../../../commonWidgets/button_widgets/common_elevated_button.dart';
import '../../../commonWidgets/loading_widgets/loader.dart';
import '../../../commonWidgets/toastWidget/app_toast.dart';
import '../../../viewModel/base_view_model/base_view_model.dart';
import '../dashBoard/dashboard.dart';

class RatingsScreen extends StatefulWidget {
  const RatingsScreen({
    super.key,
    required this.bookingId,
    required this.listingId,
    required this.onlyView,
  });

  final String bookingId;
  final String listingId;
  final bool onlyView;

  @override
  State<RatingsScreen> createState() => _RatingsScreenState();
}

class _RatingsScreenState extends State<RatingsScreen> {
  TripViewModel? tripViewModel;
  final TextEditingController _reviewController = TextEditingController();

  // Use const for static data
  static const _ratingCategories = [
    'Cleanliness',
    'Accuracy',
    'Communication',
    'Location',
    'Amenities',
    'Security',
  ];

  // Use a more efficient data structure for ratings
  Map<String, dynamic> _ratings = {
    for (var category in _ratingCategories) category: 0.0,
  };

  // Extract constants
  static const double _spacing = 14.0;
  static const double _borderRadius = 10.0;

  @override
  void initState() {
    super.initState();
    tripViewModel = Provider.of<TripViewModel>(context, listen: false);
    WidgetsBinding.instance.addPostFrameCallback((val) {
      getReviewData();
    });
  }

  getReviewData() async {
    if (widget.onlyView) {
      await tripViewModel
          ?.getMyReviewsAndRating(
            listingId: widget.listingId,
            bookingId: widget.bookingId,
          )
          .then((val) {
            if (tripViewModel?.userReviewResponseModel != null) {
              _reviewController.text =
                  tripViewModel!
                      .userReviewResponseModel!
                      .data!
                      .listingReview!
                      .review ??
                  '';
              return _ratings = tripViewModel!
                  .userReviewResponseModel!
                  .data!
                  .listingReview!
                  .rating!
                  .toJson();
            }
          });
    }
  }

  @override
  void dispose() {
    _reviewController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: _buildBody());
  }

  Widget _buildBody() {
    return CustomScrollView(
      slivers: [
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(_spacing, 0, _spacing, _spacing),
          sliver: SliverList(
            delegate: SliverChildListDelegate([
              Consumer<TripViewModel>(
                builder: (context, viewModel, _) {
                  return viewModel.state == ViewState.busy
                      ? Loader(color: AppColorData.blackClr)
                      : Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            ..._buildRatingWidgets(viewModel),
                            const SizedBox(height: _spacing),
                            _buildReviewTextField(),
                            if (!widget.onlyView) ...[
                              const SizedBox(height: _spacing),
                              _buildSubmitButton(viewModel),
                            ],
                          ],
                        );
                },
              ),
            ]),
          ),
        ),
      ],
    );
  }

  List<Widget> _buildRatingWidgets(TripViewModel viewModel) {
    return _ratingCategories
        .map(
          (category) => Padding(
            padding: const EdgeInsets.only(bottom: _spacing),
            child: _RatingWidget(
              title: category,
              rating: double.parse("${_ratings[category] ?? '0.0'}"),
              ignoreGestures: widget.onlyView,
              onRatingUpdate: (rating) {
                _ratings[category] = rating;
                viewModel.notify();
              },
            ),
          ),
        )
        .toList();
  }

  Widget _buildReviewTextField() {
    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border.all(color: Theme.of(context).dividerColor),
        borderRadius: BorderRadius.circular(_borderRadius),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: _spacing),
        child: TextField(
          enabled: !widget.onlyView,
          controller: _reviewController,
          maxLines: null,
          minLines: 5,
          keyboardType: TextInputType.multiline,
          textAlignVertical: TextAlignVertical.top,
          decoration: const InputDecoration(
            border: InputBorder.none,
            hintText: "Tell us about your experience...",
            hintStyle: TextStyle(color: Colors.grey),
          ),
        ),
      ),
    );
  }

  Widget _buildSubmitButton(TripViewModel viewModel) {
    return CommonElevatedButton(
      showLoader: true,
      elevatedButtonName: "submit",
      isLoad: viewModel.state == ViewState.secondaryLoader,
      onTap: () => _submitRating(viewModel),
    );
  }

  _submitRating(TripViewModel viewModel) async {
    if (!validateRatings() && _reviewController.text.isNotEmpty) {
      // Show error message if not all ratings are provided
      ToastUtil.showMessage('Please provide all ratings');
      return;
    }

    await viewModel.addReviewsAndRating(
      listingId: widget.listingId,
      bookingId: widget.bookingId,
      body: {
        "review": _reviewController.text.trim(),
        "type": "user",
        ..._ratings,
      },
    );
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => DashBoard(initialIndex: 2)),
    );
  }

  bool validateRatings() => !_ratings.values.contains(0.0);
}

// Separate stateless widget for better performance
class _RatingWidget extends StatelessWidget {
  const _RatingWidget({
    required this.title,
    required this.rating,
    required this.onRatingUpdate,
    required this.ignoreGestures,
  });

  final String title;
  final double rating;
  final ValueChanged<double> onRatingUpdate;
  final bool ignoreGestures;

  static const double _starSize = 20.0;
  static const _starPadding = EdgeInsets.symmetric(horizontal: 2.0);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CommonText(text: title, style: AppTextStyle.bodyTextStyle),
        RatingBar.builder(
          initialRating: rating,
          minRating: 1,
          direction: Axis.horizontal,
          allowHalfRating: true,
          itemCount: 5,
          itemSize: _starSize,
          glow: true,
          unratedColor: AppColorData.boxBorder,
          ignoreGestures: ignoreGestures,
          itemPadding: _starPadding,
          itemBuilder: (_, __) => const Icon(
            Icons.star_rounded,
            size: _starSize,
            color: Colors.amber,
          ),
          onRatingUpdate: onRatingUpdate,
        ),
      ],
    );
  }
}
