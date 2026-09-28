import 'package:flutter/material.dart';

class CommonPadding extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;

  const CommonPadding({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.symmetric(horizontal: 20.0, vertical: 14.0), // Default padding
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: padding,
      child: child,
    );
  }
}

class CommonHorizontalPadding extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;

  const CommonHorizontalPadding({
    super.key,
    required this.child,
    this.padding =
    const EdgeInsets.symmetric(horizontal: 14.0), // Default padding
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: padding,
      child: child,
    );
  }
}
