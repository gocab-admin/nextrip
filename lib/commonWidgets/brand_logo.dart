import 'package:airstar_flutter/utils/asset_imags/assets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

Widget brandLogo(BuildContext context) {
  return Center(
    child: Hero(
      tag: 'brandLogo',
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 26.0),
        child: SvgPicture.asset(SVGAssets.app_logo),
      ),
    ),
  );
}
