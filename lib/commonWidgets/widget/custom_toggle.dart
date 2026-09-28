import 'package:airstar_flutter/utils/constants/common_text.dart';
import 'package:airstar_flutter/utils/constants/textstyle.dart';
import 'package:flutter/material.dart';

class CustomToggle extends StatefulWidget {
  final Function(bool) onToggle;
  final bool initialValue;
  final String toggle1;
  final String toggle2;

  const CustomToggle({
    Key? key,
    required this.onToggle,
    this.initialValue = true, // Changed default to true
    required this.toggle1,
    required this.toggle2,
  }) : super(key: key);

  @override
  _CustomToggleState createState() => _CustomToggleState();
}

class _CustomToggleState extends State<CustomToggle>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _animation;
  late bool _isToggle1; // Renamed from _isDay to _isToggle1

  @override
  void initState() {
    super.initState();
    _isToggle1 = widget.initialValue;
    _animationController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 300),
    );
    _animation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    );
    if (!_isToggle1) {
      // Changed condition
      _animationController.value = 1.0;
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _toggle() {
    setState(() {
      _isToggle1 = !_isToggle1;
      if (!_isToggle1) {
        // Changed condition
        _animationController.forward();
      } else {
        _animationController.reverse();
      }
      widget.onToggle(_isToggle1);
    });
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final width = constraints.maxWidth;
        final height = 56.0; // Fixed height
        final toggleWidth = width * 0.49;

        return GestureDetector(
          onTap: _toggle,
          child: AnimatedBuilder(
            animation: _animation,
            builder: (context, child) {
              return Container(
                width: width,
                height: height,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(height / 2),
                  color: Colors.grey[300], // Grey background
                ),
                child: Stack(
                  children: [
                    AnimatedPositioned(
                      duration: Duration(milliseconds: 300),
                      curve: Curves.easeInOut,
                      left: _isToggle1 ? 0 : toggleWidth, // Changed condition
                      top: 0,
                      bottom: 0,
                      child: Container(
                        width: toggleWidth,
                        margin: EdgeInsets.all(3),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(height / 2),
                          color: Colors.white,
                        ),
                      ),
                    ),
                    Row(
                      children: [
                        _buildOption(widget.toggle1, _isToggle1, toggleWidth),
                        _buildOption(widget.toggle2, !_isToggle1, toggleWidth),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        );
      },
    );
  }
  String capitalizeFirstLetter(String text) {
    if (text.isEmpty) return text;
    return text[0].toUpperCase() + text.substring(1);
  }
  Widget _buildOption(String label, bool isActive, double width) {
    return Container(
      width: width,
      child: Center(
        child: CommonText(text:
        capitalizeFirstLetter(label),
          style: AppTextStyle.bodyTextStyle.copyWith(
            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,

          ),
        ),
      ),
    );
  }
}
