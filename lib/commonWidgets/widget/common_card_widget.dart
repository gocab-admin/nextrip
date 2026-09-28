import 'package:flutter/material.dart';
import '../../ui/user/dashBoard/searchBar.dart';

List<BoxShadow> commonShadow() {
  return [
    BoxShadow(
      color: Colors.black.withOpacity(0.1),
      spreadRadius: 2,
      blurRadius: 5,
      offset: Offset(0, 0), // changes position of shadow
    ),
    // BoxShadow(
    //   color: Colors.black.withOpacity(0.1),
    //   spreadRadius: 1,
    //   blurRadius: 5,
    //   offset: Offset(0, 3),
    // ),
  ];
}

class CommonCardWidget extends StatelessWidget {
  final Color color;
  final BorderRadius borderRadius;
  // final List<BoxShadow> boxShadows;
  final bool applyShadows;
  final bool isShadowSpread;
  final Widget child;
  final Duration duration;

  const CommonCardWidget({
    this.color = Colors.white,
    required this.child,
    this.borderRadius = const BorderRadius.all(Radius.circular(14)),
    this.applyShadows = true,
    this.isShadowSpread = false,
    //this.boxShadows = const [],
    this.duration = const Duration(milliseconds: 10),
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      padding: EdgeInsets.all(14),
      duration: duration,
      decoration: BoxDecoration(
        color: color,
        boxShadow: applyShadows ? commonBoxShadows(spread: isShadowSpread) : [],
        // boxShadow: boxShadows.isEmpty ? commonShadow() : boxShadows,
        borderRadius: borderRadius,
      ),
      child: child,
    );
  }
}
