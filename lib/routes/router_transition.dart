// import 'package:airstar_flutter/ui/BottomBarScreens/chat_list_screen.dart';
// import 'package:airstar_flutter/ui/dashBoard/dashboard.dart';
// import 'package:airstar_flutter/ui/dashBoard/where_screen.dart';
// import 'package:airstar_flutter/ui/login_and_signup/add_info_screen.dart';
// import 'package:airstar_flutter/ui/login_and_signup/login_screen.dart';
// import 'package:airstar_flutter/ui/login_and_signup/number_verify_screen.dart';
// import 'package:airstar_flutter/ui/login_and_signup/password_verify_screen.dart';
// import 'package:flutter/material.dart';
// import 'package:go_router/go_router.dart';
// import 'package:airstar_flutter/routes/router_name.dart';
// import 'package:airstar_flutter/ui/home/home_screen.dart';

// import '../ui/Profile/edit_profile.dart';



// final router = GoRouter(
//   initialLocation: '/',
//   routes: [
//     GoRoute(
//       name: RouterName.login,
//       path: '/',
//       pageBuilder: (context, state) {
//         return CustomTransitionPage(
//           fullscreenDialog: true,
//           key: state.pageKey,
//           child: LoginScreen(),
//           transitionsBuilder: (context, animation, secondaryAnimation, child) {
//             var begin = Offset(-1.0, 0.0);
//             var end = Offset.zero;
//             var curve = Curves.easeInOut;
//             var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
//             var offsetAnimation = animation.drive(tween);
//             return SlideTransition(
//               position: offsetAnimation,
//               child: child,
//             );
//           },
//         );
//       },
//       routes: [
//         GoRoute(
//           name: RouterName.numberVerify,
//           path: 'confirmYourNumber/:mobileNumber',
//           builder: (context, state) => NumberVerifyScreen(mobileNumber: state.pathParameters["mobileNumber"],),
//         ),
//         /*GoRoute(
//           name: RouterName.addInfoScreen,
//           path: 'addInfoScreen/:mobileNumber/:email',
//           builder: (context, state) => AddInfoScreen(email:state.pathParameters['email'],mobileNumber: state.pathParameters['mobileNumber'],),
//         ),*/
//         GoRoute(
//           name: RouterName.addInfoScreen,
//           path: 'addInfoScreen',
//           builder: (context, state) => AddInfoScreen(),
//         ),
//       ]
//     ),
//     GoRoute(
//       name: RouterName.home,
//       path: '/home',
//       builder: (context, state) => HomePage(),
//     ),
//     GoRoute(
//       name: RouterName.dashBoardScreen,
//       path: '/dashBoardScreen',
//       builder: (context, state) => DashBoard(),
//     ),
//     GoRoute(
//       name: RouterName.tabBarScreen,
//       path: '/tabBarScreen',
//       builder: (context, state) => TabBarView(children: [],),
//     ),
//     GoRoute(
//        name: RouterName.whereScreen,
//         path: '/whereScreen',
//        builder: (context, state) => WhereScreen(),
//     ),

//     GoRoute(
//         name: RouterName.editprofilescreen,
//         path: '/editprofilescreen',
//         builder: (context, state) => PersonalInfoScreen()
//     ),
//     GoRoute(
//         name: RouterName.inboxScreen,
//         path: '/inboxScreen',
//         builder: (context, state) => InBoxScreen()
//     ),
//     GoRoute(
//         name: RouterName.passwordVerify,
//         path: '/passwordVerify',
//         builder: (context, state) => PasswordVerifyScreen()
//     ),

//   ],
//    /* redirect: (context , state){
//       if(isAuth){
//         return context.namedLocation(RouterName.dashBoardScreen);
//       }else{
//         return null;
//       }

//     }*/
// );


import 'package:flutter/material.dart';

class SlideRightRoute extends PageRouteBuilder {
  final Widget page;
  SlideRightRoute({required this.page})
      : super(
    pageBuilder: (
        BuildContext context,
        Animation<double> animation,
        Animation<double> secondaryAnimation,
        ) =>
    page,
    transitionsBuilder: (
        BuildContext context,
        Animation<double> animation,
        Animation<double> secondaryAnimation,
        Widget child,
        ) =>
        SlideTransition(
          position: Tween<Offset>(
            begin: const Offset(-1, 0),
            end: Offset.zero,
          ).animate(animation),
          child: child,
        ),
  );
}

// Fade transition
class FadeRoute extends PageRouteBuilder {
  final Widget page;
  FadeRoute({required this.page})
      : super(
    pageBuilder: (
        BuildContext context,
        Animation<double> animation,
        Animation<double> secondaryAnimation,
        ) =>
    page,
    transitionsBuilder: (
        BuildContext context,
        Animation<double> animation,
        Animation<double> secondaryAnimation,
        Widget child,
        ) =>
        FadeTransition(
          opacity: animation,
          child: child,
        ),
  );
}

// Scale transition
class ScaleRoute extends PageRouteBuilder {
  final Widget page;
  ScaleRoute({required this.page})
      : super(
    pageBuilder: (
        BuildContext context,
        Animation<double> animation,
        Animation<double> secondaryAnimation,
        ) =>
    page,
    transitionsBuilder: (
        BuildContext context,
        Animation<double> animation,
        Animation<double> secondaryAnimation,
        Widget child,
        ) =>
        ScaleTransition(
          scale: Tween<double>(
            begin: 0.0,
            end: 1.0,
          ).animate(
            CurvedAnimation(
              parent: animation,
              curve: Curves.fastOutSlowIn,
            ),
          ),
          child: child,
        ),
  );
}