import 'package:flutter/material.dart';

import '../../utils/utils.dart';

class ErrorImage extends StatelessWidget {
  final bool? isSquare;

  const ErrorImage({
    super.key,
    this.isSquare = true,
  });

  @override
  Widget build(BuildContext context) {
    //return SvgPicture.asset('assets/svg_icons/error_icon.svg');
    if (isSquare == true) {
      return SizedBox(
        height: 100,
        width: 89,
        child: Image.asset(
          PNGAssets.default_image,
          fit: BoxFit.cover,
        ),
      );
    } else {
      return CircleAvatar(
        backgroundImage: AssetImage(PNGAssets.default_image),
      );
    }
  }
}
