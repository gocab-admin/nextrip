import 'dart:async';

import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/ui/user/Product/product_category.dart';
import 'package:airstar_flutter/ui/user/Profile/Profile_main_Screen.dart';
import 'package:airstar_flutter/ui/user/Profile/profile_login_view.dart';
import 'package:airstar_flutter/ui/user/dashBoard/searchBar.dart';
import 'package:airstar_flutter/ui/user/dashBoard/widgets/welcome_wishlist_bottomSheet.dart';
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/host/create_listing_view_model.dart';
import 'package:airstar_flutter/viewModel/user/chat_view_model.dart';
import 'package:airstar_flutter/viewModel/user/common_viewmodel.dart';
import 'package:airstar_flutter/viewModel/user/listing_view_model.dart';
import 'package:airstar_flutter/viewModel/user/notification_view_model.dart';
import 'package:airstar_flutter/viewModel/user/profile_view_model.dart';
import 'package:airstar_flutter/viewModel/user/trips_view_model.dart';
import 'package:airstar_flutter/viewModel/user/wishlist_view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:get/route_manager.dart';
import 'package:provider/provider.dart';

import '../../../routes/routes.dart';
import '../../../services/notification_service.dart';
import '../message/chat_list_screen.dart';
import '../trips/trips_screen.dart';
import '../wishlist/wishlist_screen.dart';
import 'filterScreen/filter_screen.dart';

// ==================== UPGRADE HANDLER ====================
// class UpgradeHandler {
//   static final UpgradeHandler _instance = UpgradeHandler._internal();
//   factory UpgradeHandler() => _instance;
//   UpgradeHandler._internal();
//
//   Upgrader? _upgrader;
//   bool _isInitialized = false;
//
//   Future<void> initializeUpgrader() async {
//     if (_isInitialized) return;
//
//     try {
//       final upgrader = Upgrader.sharedInstance;
//       await upgrader.initialize();
//       _isInitialized = true;
//     } catch (e) {
//       debugPrint('Upgrader initialization error: $e');
//     }
//   }
//
//   Upgrader getUpgrader() {
//     _upgrader ??= Upgrader(
//       debugDisplayAlways: false,
//       debugDisplayOnce: false,
//       debugLogging: false,
//       minAppVersion: '1.0.2',
//       messages: UpgraderMessages(code: 'en'),
//       durationUntilAlertAgain: const Duration(days: 1),
//     );
//     return _upgrader!;
//   }
// }

// ==================== DASHBOARD STATE ====================
class DashBoard extends StatefulWidget {
  final int? initialIndex;

  const DashBoard({super.key, this.initialIndex});

  @override
  State<DashBoard> createState() => _DashBoardState();
}

class _DashBoardState extends State<DashBoard>
    with TickerProviderStateMixin, WidgetsBindingObserver {
  // ========== Services & Handlers ==========
  // final UpgradeHandler _upgradeHandler = UpgradeHandler();
  final NotificationService _notificationService = NotificationService();
  // late final AppLinks _appLinks;
  late final DeepLinkConfig _deepLinkConfig;
  StreamSubscription<Uri>? _linkSubscription;

  // ========== State ==========
  int _currentIndex = 0;
  String? _authToken;
  bool _hasShownWishlistBottomSheet = false;
  bool _isInitialized = false;

  // ========== ViewModels (Lazy loaded) ==========
  late final ChatViewModel _chatViewModel;
  late final CommonViewModel _commonViewModel;
  late final WishlistViewModel _wishlistViewModel;
  late final TripViewModel _tripViewModel;
  late final EditProfileViewModel _editProfileViewModel;
  late final ProductListingViewModel _listingViewModel;
  late final NotificationViewModel _notificationViewModel;
  late final CreateListingViewModel _createListingViewModel;

  // ========== Getters ==========
  bool get _isLoggedIn => _authToken != null && _authToken!.isNotEmpty;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _currentIndex = widget.initialIndex ?? 0;
    _initializeViewModels();
    _initialize();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _linkSubscription?.cancel();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _refreshCurrentTab();
    }
  }

  // ==================== INITIALIZATION ====================

  void _initializeViewModels() {
    _listingViewModel = context.read<ProductListingViewModel>();
    _commonViewModel = context.read<CommonViewModel>();
    _wishlistViewModel = context.read<WishlistViewModel>();
    _tripViewModel = context.read<TripViewModel>();
    _chatViewModel = context.read<ChatViewModel>();
    _editProfileViewModel = context.read<EditProfileViewModel>();
    _notificationViewModel = context.read<NotificationViewModel>();
    _createListingViewModel = context.read<CreateListingViewModel>();
    _deepLinkConfig = DeepLinkConfig.instance;
  }

  Future<void> _initialize() async {
    if (_isInitialized) return;

    try {
      await _loadAuthToken();
      await Future.wait([
        // _upgradeHandler.initializeUpgrader(),
        _notificationService.enableNotifications(),
        _checkWishlistBottomSheetStatus(),
        _deepLinkConfig.initDeepLinks(),
      ]);

      _isInitialized = true;

      // Post-frame callbacks
      WidgetsBinding.instance.addPostFrameCallback((_) {
      //  _createListingViewModel.getSteps();
        // _checkForAppUpdate();
        _fetchInitialData();
      });
    } catch (e) {
      debugPrint('Initialization error: $e');
    }
  }

  Future<void> _loadAuthToken() async {
    _authToken = await PreferenceHelper.getString(PrefConstant.authToken);
    if (mounted) setState(() {});
  }

  Future<void> _checkWishlistBottomSheetStatus() async {
    final prefs = await SharedPreferences.getInstance();
    _hasShownWishlistBottomSheet =
        prefs.getBool('hasShownWishlistBottomSheet') ?? false;
  }

  // ==================== APP UPDATE ====================

  // Future<void> _checkForAppUpdate() async {
  //   try {
  //     final versionChecker = VersionChecker();
  //     final isUpdateAvailable = await versionChecker.checkForUpdate();
  //
  //     if (isUpdateAvailable) {
  //       debugPrint("App update available");
  //     } else {
  //       _fetchInitialData();
  //     }
  //   } catch (e) {
  //     debugPrint('Update check error: $e');
  //     _fetchInitialData();
  //   }
  // }

  Future<void> _fetchInitialData() async {
    await _listingViewModel.loadMapIcon();
    await _listingViewModel.fetchCategory();

    if (_isLoggedIn) {
      await _editProfileViewModel.fetchUserProfile(successRes: () {});
    }

    _loadTabData(_currentIndex);
  }

  // ==================== TAB NAVIGATION ====================

  Future<void> _onTabChanged(int index) async {
    if (_currentIndex == index) return;

    setState(() => _currentIndex = index);
    await _loadTabData(index);
  }

  Future<void> _loadTabData(int index) async {
    if (!_isLoggedIn && index > 0 && index < 4) {
      // Optional: Show login prompt for protected tabs
      return;
    }

    switch (index) {
      case 0: // Explore
        // Already loaded in _fetchInitialData
        break;

      case 1: // Wishlist
        await _loadWishlist();
        break;

      case 2: // Trips
        if (_isLoggedIn) {
          await _tripViewModel.fetchTrip();
        }
        break;

      case 3: // Inbox
        if (_isLoggedIn) {
          await _chatViewModel.fetchChatList();
        }
        break;

      case 4: // Profile
        if (_isLoggedIn) {
          await _editProfileViewModel.fetchUserProfile(
            successRes: () => _notificationViewModel.fetchNotification(),
          );
        }
        break;
    }
  }

  Future<void> _loadWishlist() async {
    if (!_isLoggedIn) return;

    await _wishlistViewModel.fetchWishlist(isdefault: true);

    if (!_hasShownWishlistBottomSheet) {
      Future.delayed(const Duration(milliseconds: 150), () {
        if (mounted) {
          WelcomeWishlistBottomsheet.show(context);
          _hasShownWishlistBottomSheet = true;
          SharedPreferences.getInstance().then(
            (prefs) => prefs.setBool('hasShownWishlistBottomSheet', true),
          );
        }
      });
    }
  }

  Future<void> _refreshCurrentTab() async {
    if (_currentIndex == 0) {
      await _listingViewModel.fetchListing(
        categoryId: _listingViewModel.categoryId,
      );
    } else {
      await _loadTabData(_currentIndex);
    }
  }

  // ==================== BUILD ====================

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (_currentIndex != 0) {
          setState(() => _currentIndex = 0);
        } else {
          SystemNavigator.pop();
        }
      },
      child: Scaffold(
        backgroundColor: AppColorData.appSecondaryColor,
        appBar: _currentIndex == 0 ? _buildAppBar() : null,
        bottomNavigationBar: _buildBottomNav(),
        body: _buildBody(),
      ),
    );
  }

  Widget _buildBody() {
    return RefreshIndicator(
      onRefresh: _refreshCurrentTab,
      child: IndexedStack(
        index: _currentIndex,
        children: [
          ProductCategory(
            wishlistViewModel: _wishlistViewModel,
            token: _authToken,
          ),
          WishlistScreen(token: _authToken),
          TripsScreen(token: _authToken),
          InBoxScreen(token: _authToken),
          _isLoggedIn ? const ProfilePage() : const ProfileLoginPage(),
        ],
      ),
    );
    //   UpgradeAlert(
    //   dialogStyle: UpgradeDialogStyle.material,
    //   barrierDismissible: false,
    //   shouldPopScope: () => false,
    //   showIgnore: false,
    //   upgrader: _upgradeHandler.getUpgrader(),
    //   onIgnore: () {
    //     _fetchInitialData();
    //     return true;
    //   },
    //   onLater: () {
    //     _fetchInitialData();
    //     return true;
    //   },
    //   onUpdate: () {
    //     _fetchInitialData();
    //     return true;
    //   },
    //   child:
    // );
  }

  // ==================== APP BAR ====================

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      systemOverlayStyle: const SystemUiOverlayStyle(
        statusBarIconBrightness: Brightness.dark,
      ),
      automaticallyImplyLeading: false,
      backgroundColor: AppColorData.appSecondaryColor,
      toolbarHeight: 70,
      title: _buildSearchBar(),
      actions: [_buildFilterButton()],
    );
  }

  Widget _buildSearchBar() {
    return GestureDetector(
      onTap: () => Get.toNamed(RouterName.searchBarScreen),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 10),
        decoration: BoxDecoration(
          color: AppColorData.appSecondaryColor,
          borderRadius: BorderRadius.circular(35),
          boxShadow: commonBoxShadows(),
        ),
        child: Selector<ProductListingViewModel, _SearchBarState>(
          selector: (_, vm) => _SearchBarState(
            address: vm.address,
            startDate: vm.startDate,
            endDate: vm.endDate,
            guestText: vm.getGuestCountText(),
          ),
          builder: (context, state, _) {
            return Row(
              children: [
                Icon(Icons.search, size: 25, color: AppColorData.appIconBlack),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      CommonText(
                        text: state.address ?? "whereTo",
                        overflow: TextOverflow.ellipsis,
                        style: AppTextStyle.bodyTextStyle,
                      ),
                      RichText(
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        text: TextSpan(
                          children: [
                            TextSpan(
                              text:
                                  state.startDate != null &&
                                      state.endDate != null
                                  ? "${formatDateTimeMonthDate(state.startDate)} - ${formatDateTimeMonthDate(state.endDate)} "
                                  : tr("any"),
                              style: AppTextStyle.contentStyle.copyWith(
                                fontWeight: FontWeight.w400,
                              ),
                            ),
                            TextSpan(
                              text: state.guestText,
                              style: AppTextStyle.contentStyle.copyWith(
                                fontWeight: FontWeight.w400,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildFilterButton() {
    return Padding(
      padding: const EdgeInsets.only(right: 20),
      child: GestureDetector(
        onTap: _showFilterBottomSheet,
        child: Stack(
          children: [
            Container(
              padding: const EdgeInsets.all(14),
              height: 48,
              width: 48,
              decoration: BoxDecoration(
                color: AppColorData.appSecondaryColor,
                border: Border.all(color: AppColorData.boxBorder),
                borderRadius: BorderRadius.circular(30),
              ),
              child: Image.asset(PNGAssets.filterIcon),
            ),
            Selector<ProductListingViewModel, int>(
              selector: (_, vm) => vm.appliedFilters,
              builder: (context, appliedFilters, _) {
                if (appliedFilters > 0) {
                  return Positioned(
                    right: 0,
                    child: CircleAvatar(
                      radius: 8,
                      backgroundColor: AppColorData.blackButtonClr,
                      child: CommonText(
                        text: appliedFilters.toString(),
                        style: const TextStyle(fontSize: 10),
                      ),
                    ),
                  );
                }
                return const SizedBox.shrink();
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showFilterBottomSheet() {
    _listingViewModel.clearFilters();
    _listingViewModel.resetPriceRange();

    showCustomModalBottomSheet(
      backgroundColor: AppColorData.appSecondaryColor,
      title: tr("filter"),
      context: context,
      builder: (_) => const FilterScreen(),
    );
  }

  // ==================== BOTTOM NAVIGATION ====================

  Widget _buildBottomNav() {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      backgroundColor: AppColorData.appSecondaryColor,
      selectedItemColor: AppColorData.appPrimaryColor,
      unselectedItemColor: AppColorData.iconDimColor,
      showSelectedLabels: true,
      showUnselectedLabels: true,
      currentIndex: _currentIndex,
      onTap: _onTabChanged,
      items: [
        _buildNavItem(0, tr("explore"), SVGAssets.searchIcon),
        _buildNavItem(1, tr("wishList"), SVGAssets.heartIcon),
        _buildTripNavItem(2),
        _buildNavItem(3, tr("inbox"), SVGAssets.inboxIcon),
        _buildProfileNavItem(4),
      ],
    );
  }

  BottomNavigationBarItem _buildNavItem(
    int index,
    String label,
    String iconPath,
  ) {
    return BottomNavigationBarItem(
      backgroundColor: Colors.white,
      label: label,
      icon: SvgPicture.asset(
        iconPath,
        colorFilter: _currentIndex == index
            ? ColorFilter.mode(AppColorData.appPrimaryColor, BlendMode.srcIn)
            : null,
      ),
    );
  }

  BottomNavigationBarItem _buildTripNavItem(int index) {
    return BottomNavigationBarItem(
      backgroundColor: Colors.white,
      label: tr("trips"),
      icon: SvgPicture.asset(
        _currentIndex == index ? SVGAssets.tripAirIcon2 : SVGAssets.tripAirIcon,
      ),
    );
  }

  BottomNavigationBarItem _buildProfileNavItem(int index) {
    return BottomNavigationBarItem(
      backgroundColor: Colors.white,
      label: _isLoggedIn ? tr("profile") : tr("login"),
      icon: Selector<EditProfileViewModel, String?>(
        selector: (_, vm) =>
            vm.userResponseModel?.data?.userDetail?.profileImage,
        builder: (context, profileImage, _) {
          if (_isLoggedIn && profileImage != null && profileImage.isNotEmpty) {
            return Container(
              height: 22,
              width: 22,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                image: DecorationImage(
                  image: ImageUtils.getCachedImageProvider(
                    profileImage,
                    context,
                  ),
                  fit: BoxFit.cover,
                ),
              ),
            );
          }

          return SvgPicture.asset(
            SVGAssets.personIcon,
            colorFilter: _currentIndex == index
                ? ColorFilter.mode(
                    AppColorData.appPrimaryColor,
                    BlendMode.srcIn,
                  )
                : null,
          );
        },
      ),
    );
  }
}

// ==================== HELPER CLASSES ====================

class _SearchBarState {
  final String? address;
  final DateTime? startDate;
  final DateTime? endDate;
  final String guestText;

  _SearchBarState({
    required this.address,
    required this.startDate,
    required this.endDate,
    required this.guestText,
  });

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is _SearchBarState &&
          address == other.address &&
          startDate == other.startDate &&
          endDate == other.endDate &&
          guestText == other.guestText;

  @override
  int get hashCode =>
      address.hashCode ^
      startDate.hashCode ^
      endDate.hashCode ^
      guestText.hashCode;
}
