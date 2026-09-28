import 'package:airstar_flutter/data/repositories/host/create_listing_repo.dart';
import 'package:airstar_flutter/data/repositories/user/booking_repo.dart';
import 'package:airstar_flutter/data/repositories/user/chat_repo.dart';
import 'package:airstar_flutter/data/repositories/user/listing_repo.dart';
import 'package:airstar_flutter/data/repositories/user/login_repo.dart';
import 'package:airstar_flutter/data/repositories/user/notification_repo.dart';
import 'package:airstar_flutter/data/repositories/user/register_repo.dart';
import 'package:airstar_flutter/data/repositories/user/trip_repo.dart';
import 'package:airstar_flutter/data/repositories/user/wishlist_repo.dart';
import 'package:get_it/get_it.dart';
import '../../../data/repositories/host/host_listing_repo.dart';
import '../../../data/repositories/user/home_repo.dart';
import '../../../data/repositories/user/product_detail_repo.dart';
import '../../../data/repositories/user/verify_otp_repo.dart';
import '../../utils.dart';

final locator = GetIt.instance;

void setupLocator() async {
  //not using locator.registerLazySingleton(() => NavigationService.getInstance());
  locator.registerLazySingleton(() => AppSecureStorage.getInstance());
  locator.registerLazySingleton(() => PermissionHandler.getInstance());

  //repositories
  locator.registerFactory(() => HomeRepository());
  locator.registerFactory(() => VerifyOtpRepository());
  // locator.registerFactory(() => VerifyOtpRepository());
  locator.registerFactory(() => LoginRepository());
  locator.registerFactory(() => RegisterRepository());
  locator.registerFactory(() => ListingRepository());
  locator.registerFactory(() => BookingRepository());
  locator.registerFactory(() => TripRepository());
  locator.registerFactory(() => WishlistRepository());
  locator.registerFactory(() => ChatRepository());
  locator.registerFactory(() => NotificationRepository());
  locator.registerFactory(() => ProductDetailRepository());

  // Host
  locator.registerFactory(() => CreateListingRepository());
  locator.registerFactory(() => HostListingRepository());

  // final SharedPrefs sharedPrefs = await SharedPrefs.getInstance();
  // locator.registerSingleton(sharedPrefs);
}
