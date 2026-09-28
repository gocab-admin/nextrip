import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

import '../../../../commonWidgets/common_widgets.dart';
import '../../../../data/models/user/category_response_model.dart';
import '../../../../utils/utils.dart';

class CustomAnimatedTabList extends StatefulWidget {
  final List<Category> categories;
  final String selectedCategoryId;
  final ValueChanged<Category> onCategoryChanged;
  final double height;
  final EdgeInsets padding;

  const CustomAnimatedTabList({
    Key? key,
    required this.categories,
    required this.selectedCategoryId,
    required this.onCategoryChanged,
    this.height = 74,
    this.padding = const EdgeInsets.symmetric(horizontal: 20),
  }) : super(key: key);

  @override
  State<CustomAnimatedTabList> createState() => _CustomAnimatedTabListState();
}

class _CustomAnimatedTabListState extends State<CustomAnimatedTabList> {
  late final ScrollController _scrollController;
  final Map<String, GlobalKey> _tabKeys = {};
  bool _isInitialScrollDone = false;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    _initializeTabKeys();

    // Initial scroll only once
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_isInitialScrollDone) {
        _scrollToSelectedTab(animated: false);
        _isInitialScrollDone = true;
      }
    });
  }

  @override
  void didUpdateWidget(CustomAnimatedTabList oldWidget) {
    super.didUpdateWidget(oldWidget);

    // Only scroll if selection changed AND tab is not visible
    if (oldWidget.selectedCategoryId != widget.selectedCategoryId) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _scrollToSelectedTabIfNeeded();
      });
    }
  }

  void _initializeTabKeys() {
    _tabKeys.clear();
    for (final category in widget.categories) {
      _tabKeys[category.id ?? ''] = GlobalKey();
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  // Check if tab is visible before scrolling
  bool _isTabVisible(GlobalKey key) {
    final context = key.currentContext;
    if (context == null || !_scrollController.hasClients) return false;

    try {
      final renderBox = context.findRenderObject() as RenderBox?;
      if (renderBox == null) return false;

      final position = renderBox.localToGlobal(Offset.zero);
      final size = renderBox.size;
      final screenWidth = MediaQuery.of(this.context).size.width;

      // Check if tab is fully visible (with some margin)
      final leftVisible = position.dx >= 20;
      final rightVisible = position.dx + size.width <= screenWidth - 20;

      return leftVisible && rightVisible;
    } catch (e) {
      return false;
    }
  }

  // Only scroll if tab is not visible
  Future<void> _scrollToSelectedTabIfNeeded() async {
    final selectedKey = _tabKeys[widget.selectedCategoryId];
    if (selectedKey == null) return;

    // Only scroll if the tab is not visible
    if (!_isTabVisible(selectedKey)) {
      await _scrollToSelectedTab(animated: true);
    }
  }

  Future<void> _scrollToSelectedTab({bool animated = true}) async {
    final selectedKey = _tabKeys[widget.selectedCategoryId];
    if (selectedKey == null || !_scrollController.hasClients) return;

    final context = selectedKey.currentContext;
    if (context == null) return;

    try {
      final renderBox = context.findRenderObject() as RenderBox?;
      if (renderBox == null) return;

      final tabPosition = renderBox.localToGlobal(Offset.zero);
      final tabWidth = renderBox.size.width;
      final screenWidth = MediaQuery.of(this.context).size.width;

      // Calculate scroll offset to center the tab
      final scrollOffset =
          _scrollController.offset +
          tabPosition.dx -
          (screenWidth / 2) +
          (tabWidth / 2);

      final maxScroll = _scrollController.position.maxScrollExtent;
      final targetOffset = scrollOffset.clamp(0.0, maxScroll);

      if (animated) {
        await _scrollController.animateTo(
          targetOffset,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
      } else {
        _scrollController.jumpTo(targetOffset);
      }
    } catch (e) {
      debugPrint('Scroll error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: widget.height,
      decoration: BoxDecoration(
        color: AppColorData.appSecondaryColor,
        border: Border(
          bottom: BorderSide(color: AppColorData.dividerColor, width: 0.5),
        ),
      ),
      child: ListView.separated(
        controller: _scrollController,
        scrollDirection: Axis.horizontal,
        padding: widget.padding,
        physics: const BouncingScrollPhysics(),
        itemCount: widget.categories.length,
        separatorBuilder: (context, index) => const SizedBox(width: 20),
        itemBuilder: (context, index) {
          final category = widget.categories[index];
          final isSelected = widget.selectedCategoryId == category.id;

          return AnimatedTabCardDynamic(
            key: _tabKeys[category.id],
            category: category,
            isSelected: isSelected,
            onTap: () => widget.onCategoryChanged(category),
          );
        },
      ),
    );
  }
}

// ==================== FIXED ANIMATED TAB CARD ====================
class AnimatedTabCardDynamic extends StatefulWidget {
  final Category category;
  final bool isSelected;
  final VoidCallback onTap;

  const AnimatedTabCardDynamic({
    Key? key,
    required this.category,
    required this.isSelected,
    required this.onTap,
  }) : super(key: key);

  @override
  State<AnimatedTabCardDynamic> createState() => _AnimatedTabCardDynamicState();
}

class _AnimatedTabCardDynamicState extends State<AnimatedTabCardDynamic>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  final GlobalKey _textKey = GlobalKey();
  double textWidth = 0;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
      value: widget.isSelected ? 1.0 : 0.0,
    );

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _updateTextWidth();
    });
  }

  void _updateTextWidth() {
    final RenderBox? box =
        _textKey.currentContext?.findRenderObject() as RenderBox?;
    if (box != null) {
      setState(() => textWidth = box.size.width);
    }
  }

  @override
  void didUpdateWidget(AnimatedTabCardDynamic oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (oldWidget.isSelected != widget.isSelected) {
      if (widget.isSelected) {
        _animationController.forward();
      } else {
        _animationController.reverse();
      }
      WidgetsBinding.instance.addPostFrameCallback((_) => _updateTextWidth());
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap,
      child: Container(
        child: AnimatedBuilder(
          animation: _animationController,
          builder: (context, _) {
            final progress = _animationController.value;

            return Transform.scale(
              scale: 1.0 + (progress * 0.05),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                spacing: 6,
                children: [
                  // Icon
                  SizedBox(height: 35, width: 35, child: _buildIcon(progress)),

                  // Text
                  Text(
                    widget.category.category ?? "",
                    key: _textKey,
                    textAlign: TextAlign.center,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontWeight: progress > 0.5
                          ? FontWeight.w600
                          : FontWeight.w400,
                      color: Color.lerp(
                        AppColorData.iconDimColor,
                        AppColorData.appIconBlack,
                        progress,
                      ),
                    ),
                  ),

                  // **Dynamic animated underline**
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 250),
                    height: 3.4,
                    width: textWidth * progress,
                    decoration: BoxDecoration(
                      color: widget.isSelected
                          ? AppColorData.blackClr
                          : Colors.transparent,
                      borderRadius: BorderRadius.vertical(
                        top: Radius.circular(20),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildIcon(double progress) {
    final iconUrl =
        "${EndPointConstants.baseurl}/${widget.category.icon ?? ""}";
    final iconColor = Color.lerp(
      AppColorData.grey03,
      AppColorData.blackClr,
      progress,
    );

    if (isSvgImageUrl(iconUrl)) {
      return SvgPicture.network(
        iconUrl,
        colorFilter: ColorFilter.mode(iconColor!, BlendMode.srcIn),
      );
    }
    return CacheImageWidget(
      color: iconColor,
      imageUrl: widget.category.icon ?? "",
    );
  }
}
