
import 'package:airstar_flutter/utils/utils.dart';
import 'package:airstar_flutter/viewModel/view_model.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';
import 'routes/routes.dart';
import 'ui/splash/splash.dart';

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  static _MyAppState of(BuildContext context) =>
      context.findAncestorStateOfType<_MyAppState>()!;

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        statusBarBrightness: Brightness.light,
      ),
      child: MultiProvider(
        providers: [
          ChangeNotifierProvider<CommonViewModel>(
            create: (BuildContext context) => CommonViewModel(),
          ),
          ChangeNotifierProvider<BookingViewModel>(
            create: (BuildContext context) => BookingViewModel(),
          ),
          ChangeNotifierProvider<VerifyOtpViewModel>(
              create: (BuildContext context) => VerifyOtpViewModel()),
          ChangeNotifierProvider<LoginViewModel>(
              create: (BuildContext context) => LoginViewModel()),
          ChangeNotifierProvider<RegisterViewModel>(
              create: (BuildContext context) => RegisterViewModel()),
          ChangeNotifierProvider<ProductListingViewModel>(
              create: (BuildContext context) => ProductListingViewModel()),
          ChangeNotifierProvider<TripViewModel>(
              create: (BuildContext context) => TripViewModel()),
          ChangeNotifierProvider<WishlistViewModel>(
              create: (BuildContext context) => WishlistViewModel()),
          ChangeNotifierProvider<EditProfileViewModel>(
              create: (BuildContext context) => EditProfileViewModel()),
          ChangeNotifierProvider<InBoxScreenViewModel>(
              create: (BuildContext context) => InBoxScreenViewModel()),
          ChangeNotifierProvider<ChatViewModel>(
              create: (BuildContext context) => ChatViewModel()),
          ChangeNotifierProvider<NotificationViewModel>(
              create: (BuildContext context) => NotificationViewModel()),
          ChangeNotifierProvider<ProductDetailViewModel>(
              create: (BuildContext context) => ProductDetailViewModel()),

          // Host

          ChangeNotifierProvider<CreateListingViewModel>(
              create: (BuildContext context) => CreateListingViewModel()),
          ChangeNotifierProvider<HostListingViewModel>(
              create: (BuildContext context) => HostListingViewModel()),
        ],
        child: GetMaterialApp(
          title: Strings.appName,
           getPages: GetXRouter.getPages,
          localizationsDelegates: context.localizationDelegates,
          supportedLocales: context.supportedLocales,
          locale: context.locale,
          initialRoute: RouterName.splash,
          home: Splash(),
          onGenerateRoute: (settings) {
            if (settings.name ==  RouterName.splash) {
              return MaterialPageRoute(builder: (_) => Splash());
            } else {
              // Handle other routes here
              return MaterialPageRoute(
                  builder: (_) => Scaffold(body: Center(child: Text('404'))));
            }
          },
          color: AppColorData.appPrimaryColor,

          theme: ThemeData(
            colorScheme:
                ColorScheme.light(primary: AppColorData.appPrimaryColor),
            fontFamily: 'CircularStd',
            primaryColor: AppColorData.appPrimaryColor,
            appBarTheme: appBarThemeData(),
            timePickerTheme: timePickerTheme(),
          ),
          builder: (context, router) {
            return MediaQuery(
                data: MediaQuery.of(context)
                    .copyWith(boldText: false, textScaler: TextScaler.linear(1.0),),
                child: router!);
          },
          debugShowCheckedModeBanner: false,
        ),
      ),
    );
  }
}

//TODO add firebase analytics
// navigatorObservers: <NavigatorObserver>cons[
// FirebaseAnalyticsObserver(analytics: analytics),
// ],

