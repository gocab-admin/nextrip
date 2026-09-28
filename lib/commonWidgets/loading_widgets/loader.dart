import 'package:airstar_flutter/utils/components/color/app_color.dart';
import 'package:flutter/material.dart';
import 'dart:math' as math;

class Loader extends StatelessWidget {
  const Loader({super.key, this.color});
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return Center(
        child: LoadingAnimation(
      numberOfActors: 3,
      animationType: 0,
      size: Size(7.0, 7.0),
          color: color,
    ));
  }
}

class ProgressLoader extends StatelessWidget {
  const ProgressLoader({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
          height: 40,
          width: 40,
          child: CircularProgressIndicator(
            backgroundColor: AppColorData.appPrimaryColor,
            color: Colors.white,
          )),
    );
  }
}

/// The individual item to animate.
class Actor extends StatelessWidget {
  final Size size;
  final Color? color;

  const Actor({super.key, required this.size, this.color});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 2),
      child: Container(
        width: size.width,
        height: size.height,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: color ?? Colors.white,
        ),
      ),
    );
  }
}

/// The main animation widget.
class LoadingAnimation extends StatefulWidget {
  const LoadingAnimation(
      {super.key,
      required this.numberOfActors,
      this.animationType = 0,
      required this.size, this.color});
  final int numberOfActors;
  final int? animationType;
  final Size size;
  final Color? color;

  @override
  _LoadingAnimationState createState() => _LoadingAnimationState();
}

class _LoadingAnimationState extends State<LoadingAnimation>
    with SingleTickerProviderStateMixin {
  final double initialOffset = 0.0;
  final double finalOffset = 0.7;
  late AnimationController _loadingAnimationController;

  @override
  void initState() {
    super.initState();
    _initLoadingAnimationController();
    _loadingAnimationController.forward();
  }

  @override
  void dispose() {
    _loadingAnimationController.dispose();
    super.dispose();
  }

  // method to be called when the widget mounts
  void _initLoadingAnimationController() {
    _loadingAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..addStatusListener((AnimationStatus status) {
        if (status == AnimationStatus.completed) {
          _loadingAnimationController.forward(from: 0);
        }
      });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 80,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: List.generate(widget.numberOfActors, _generateActors),
      ),
    );
  }

  Widget _generateActors(int index) {
    Animation animation = _initLoadingAnimation(index);
    return AnimatedBuilder(
      animation: animation,
      builder: (BuildContext context, Widget? child) {
        // We can have multiple variations of animations with
        // this technique
        return waveType(
            animation: animation, type: widget.animationType, child: child);
      },
      child: Actor(
        size: widget.size,
        color: widget.color,
      ),
    );
  }

  Widget waveType(
      {int? type, Widget? child, required Animation<dynamic> animation}) {
    switch (type) {
      case 0:
        {
          return Transform.translate(
            offset: Offset(0, double.parse("${-20 * animation.value}")),
            child: child,
          );
        }
      case 1:
        {
          return Transform.rotate(
            angle: animation.value * math.pi / 2,
            alignment: Alignment.bottomRight,
            child: child,
          );
        }
      case 2:
        {
          return Transform.scale(
            scale: animation.value,
            child: child,
          );
        }
      case 3:
        {
          return Opacity(
            opacity: animation.value,
            child: child,
          );
        }
      default:
        {
          return Transform.translate(
            offset: Offset(0, double.parse("${-30 * animation.value}")),
            child: child,
          );
        }
    }
  }

  Animation<double> _initLoadingAnimation(int index) {
    double lastActorStartTime = 0.3;
    double actorAnimationDuration = 0.6;
    double begin = lastActorStartTime * (index / widget.numberOfActors);
    double end = actorAnimationDuration + begin;
    // Using Tween doesnt give us the desired output so we create a
    // custom Animatable
    // return Tween(begin: initialOffset, end: finalOffset)
    return Sinusoid(min: initialOffset, max: finalOffset).animate(
      CurvedAnimation(
        parent: _loadingAnimationController,
        curve: Interval(begin, end, curve: Curves.easeIn),
      ),
    );
  }
}

/// Tween moves from begin to end linearly
/// We dont want this because the animation stays at its max value at the end
/// then jumps back to the begin at the start of the next cycle.
/// So we create our custom animation to move in a wavy like form using sine
/// It is at its max value at the middle of the animation
/// and it at its min value at the begin and end,
/// thus giving us a wavy effect.
class Sinusoid extends Animatable<double> {
  final double min;
  final double max;

  Sinusoid({required this.min, required this.max});

  /// Here, the transform method takes the `t` and multiply it by `math.pi`
  /// then find its `sine`.
  /// The sine of `pi` is 0. The sine of `pi/2` is 1.
  /// This means that when the animation is at 0.5 the result of the
  /// sine function would be 1 hence giving us the max at the middle of the animation
  @override
  double transform(double t) {
    return min + (max - min) * math.sin(math.pi * t);
  }
}
