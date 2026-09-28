import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../../utils/utils.dart';
import 'error_image.dart';

class CacheImageWidget extends StatelessWidget {
  final String imageUrl;
  final String? errorName;
  final BoxFit? fit;
  final double? width;
  final double? height;
  final TextStyle? errorTextStyle;
  final ImageErrorWidgetBuilder? errorBuilder;
  final ImageLoadingBuilder? loadingBuilder;
  final Color? color;
  final Color? errorColor;
  final BlendMode? colorBlendMode;
  final BoxShape? shape;
  final BorderRadiusGeometry? borderRadius;
  final bool? showErrorImage;

  const CacheImageWidget({
    super.key,
    required this.imageUrl,
    this.fit,
    this.errorBuilder,
    this.width,
    this.height,
    this.loadingBuilder,
    this.color,
    this.colorBlendMode,
    this.errorName,
    this.shape = BoxShape.rectangle,
    this.borderRadius,
    this.errorTextStyle,
    this.errorColor,
    this.showErrorImage = true,
  });

  @override
  Widget build(BuildContext context) {
    return Image(
      width: width,
      height: height,
      fit: fit ?? BoxFit.cover,
      color: color,
      colorBlendMode: colorBlendMode,
      errorBuilder:
          errorBuilder ??
          (context, error, stackTrace) {
            if (showErrorImage == true) {
              return ErrorImage();
            } else {
              return Container(
                height: height,
                width: width,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: errorColor ?? AppColorData.TfIconClr,
                ),
                child: Center(
                  child: CommonText(
                    text: errorName ?? '',
                    style:
                        errorTextStyle ??
                        AppTextStyle.headingStyle.copyWith(
                          fontSize: 22,
                          color: AppColorData.appSecondaryColor,
                        ),
                  ),
                ),
              );
            }
          },
      loadingBuilder:
          loadingBuilder ??
          (context, child, loadingProgress) {
            if (loadingProgress == null) return child;
            return Center(
              child: CircularProgressIndicator(
                value: loadingProgress.expectedTotalBytes != null
                    ? loadingProgress.cumulativeBytesLoaded /
                          loadingProgress.expectedTotalBytes!
                    : null,
              ),
            );
          },
      image: ResizeImage(
        ImageUtils.getCachedImageProvider(imageUrl, context),
        width: cacheSize(context),
      ),
    );
  }
}

class ImageUtils {
  static String getFullImageUrl(String imageUrl) {
    if (imageUrl.startsWith(EndPointConstants.baseurl) &&
        !imageUrl.startsWith("res.cloudinary.com")) {
      return imageUrl;
    }
    if (imageUrl.startsWith("public/")) {
      return "${EndPointConstants.baseurl}$imageUrl";
    } else if (imageUrl.startsWith("lh3.googleusercontent.com") ||
        imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    return imageUrl;
  }

  static ImageProvider getCachedImageProvider(
    String imageUrl,
    BuildContext context,
  ) {
    return CachedNetworkImageProvider(
      getFullImageUrl(imageUrl),
      maxHeight: cacheSize(context),
    );
  }
}
