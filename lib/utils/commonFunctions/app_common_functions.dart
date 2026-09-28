import 'dart:convert';
import 'dart:math';

import 'package:dio/dio.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:geocoding/geocoding.dart';
import 'package:get/get.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:path/path.dart' as path;

import '../../commonWidgets/common_widgets.dart';
import '../../data/models/user/listing_detail_response_model.dart';
import '../../services/exceptions/data_exceptions.dart';
import '../utils.dart';

bool isArabic(BuildContext context) {
  return context.locale.languageCode == 'ar';
}

//reuseable functions
Future<bool> willPopCallback() async => false;

//To request permission
Future<bool> requestPermission() async {
  AppConstant.isPermissionGranted = await checkPermission();
  return AppConstant.isPermissionGranted;
}

Future<bool> checkOnBoarding() async {
  final AppSecureStorage _storage = locator<AppSecureStorage>();
  String onBoarding =
      await _storage.readSecureData(SecureStorageConstant.onBoarding) ?? "null";
  Logger.appLogs('onBoardingMain : $onBoarding');
  return onBoarding == 'done';
}

Future<bool> checkIsLoggedIn() async {
  final AppSecureStorage _storage = locator<AppSecureStorage>();
  String onBoarding =
      await _storage.readSecureData(SecureStorageConstant.isLoggedIn) ?? "null";
  Logger.appLogs('onLoginMain : $onBoarding');
  return onBoarding == 'true';
}

Future<bool> checkPermission() async {
  final PermissionHandler _permHandler = locator<PermissionHandler>();
  var isGranted = await _permHandler.checkPermissions();
  Logger.appLogs('permGranted: $isGranted');
  return isGranted;
}

Future<bool> validatePermission() async {
  final PermissionHandler _permHandler = locator<PermissionHandler>();
  var isGranted = await _permHandler.validateAllPermissions();
  Logger.appLogs('permGranted: $isGranted');
  return isGranted;
}

bool isValidValue(dynamic value) {
  if (value == null) return false;
  if (value is String && value.trim().isEmpty) return false;
  if (value is List && value.isEmpty) return false;
  if (value is Map && value.isEmpty) return false;
  if (value is Set && value.isEmpty) return false;
  return true;
}

String errorHandler(AppException appException) {
  var errorMsg = '';
  if (appException.error is String) {
    //Something went wrong error
    errorMsg = appException.error as String;
  } else if (appException.type == ErrorType.dioError) {
    //Dio code error
    var dioError = appException.error as DioException;
    errorMsg = DataException.errorResponseHandler(dioError);
  } else {
    //Status code error
    errorMsg = DataException.handleError(appException.statusCode!);
  }
  Logger.appLogs('errorMsg:: $errorMsg');

  ToastUtil.showMessage(errorMsg);
  return errorMsg;
}

String getFormatCurrency(dynamic streamAmount) {
  try {
    final formatCurrency = NumberFormat.simpleCurrency(
      locale: 'HI',
      decimalDigits: 0,
    );
    num amount = 0;
    if (streamAmount is String) {
      amount = int.tryParse(streamAmount)!;
    } else {
      amount = streamAmount;
    }

    var value = formatCurrency.format(amount);
    Logger.appLogs('formattedCurrency:: $value');
    return value;
  } catch (e) {
    Logger.appLogs('numberFormatError:: $e');
    return '';
  }
}

converterTimeOfDay(DateTime? duration) {
  if (duration != null && duration != "") {
    DateTime dateTime = duration;
    TimeOfDay timeOfDay = TimeOfDay.fromDateTime(dateTime);
    return timeOfDay;
  } else {
    return null;
  }
}

DateTime roundUpTo30Minutes(DateTime? time) {
  int minutes = time!.minute;

  if (minutes == 0 || minutes == 30) {
    // If time is exactly on the hour or half-hour, return as-is
    return time;
  } else if (minutes < 30) {
    // Round up to 30 minutes if minutes are between 1 and 29
    return DateTime(time.year, time.month, time.day, time.hour, 30);
  } else {
    // If minutes are above 30, round up to the next hour
    return DateTime(time.year, time.month, time.day, time.hour + 1, 0);
  }
}

TimeOfDay convertTimeOfDayRoundUpTo30(TimeOfDay timeOfDay) {
  final now = DateTime.now();
  DateTime newVal = DateTime(
    now.year,
    now.month,
    now.day,
    timeOfDay.hour,
    timeOfDay.minute,
  );
  DateTime newVal1 = roundUpTo30Minutes(newVal);
  TimeOfDay finalVal = TimeOfDay(hour: newVal1.hour, minute: newVal1.minute);
  return finalVal;
}

DateTime addMinutesToTimeOfDay(TimeOfDay time, int minutesToAdd) {
  final now = DateTime.now();
  final dateTime = DateTime(
    now.year,
    now.month,
    now.day,
    time.hour,
    time.minute,
  );
  final updatedDateTime = dateTime.add(Duration(minutes: minutesToAdd));
  //return TimeOfDay(hour: updatedDateTime.hour, minute: updatedDateTime.minute);
  return updatedDateTime;
}

String getTimeAgo(String dateString) {
  DateTime reviewDate = DateTime.parse(dateString);
  DateTime now = DateTime.now();
  Duration difference = now.difference(reviewDate);

  if (difference.inMinutes < 60) {
    return 'just now';
  } else if (difference.inHours < 24) {
    return '${difference.inHours} ${difference.inHours == 1 ? tr("hour") : tr("hours")} ${tr("ago")}';
  } else if (difference.inDays >= 30) {
    int months = (difference.inDays / 30).floor();
    return '$months ${months == 1 ? tr("month") : tr("months")} ${tr("ago")}';
  } else {
    return '${difference.inDays} ${difference.inDays == 1 ? tr("day") : tr("days")} ${tr("ago")}';
  }
}

bool isSvgImageUrl(String url) {
  if (url.toLowerCase().endsWith('.svg')) {
    return true;
  }

  return false;
}

Future<LatLng> addressToLatLong(String address) async {
  print("address :: $address");
  try {
    List<Location> locations = await locationFromAddress(address);
    print("address locations:: $locations");
    if (locations.isNotEmpty) {
      print("address locations.isNotEmpty :: ${locations.isNotEmpty}");
      Location location = locations.first;
      LatLng sourceLocation = LatLng(location.latitude, location.longitude);
      return sourceLocation;
    } else {
      print("address locations.isEmpty :: ${locations.isEmpty}");
      const LatLng destination = LatLng(9.909386884180801, 78.11567829128447);
      return destination;
    }
  } catch (e) {
    print('Error during geocoding: $e');
    const LatLng destination = LatLng(9.909386884180801, 78.11567829128447);
    // Handle the error accordingly.
    return destination;
  }
}

String getMimeType(String fileName) {
  String extension = path.extension(fileName).toLowerCase();
  switch (extension) {
    case '.jpeg':
    case '.jpg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    // Add more cases as needed
    default:
      return 'application/octet-stream'; // Default binary data
  }
}

String formatDateTimeMonthDate(DateTime? dateTime) {
  if (dateTime == null) {
    return '';
  }
  if (dateContainsTime(dateTime)) {
    final DateFormat formatter = DateFormat('MMM d, h:mm a');
    return formatter.format(dateTime);
  }
  final DateFormat formatter = DateFormat('MMM d');
  return formatter.format(dateTime);
}

String formatDateTimeWithTime(DateTime? dateTime) {
  if (dateTime == null) {
    return '';
  }
  // Check if the time is exactly 12:00 AM
  if (dateTime.hour == 0 && dateTime.minute == 0) {
    final DateFormat dateFormatter = DateFormat('MMM d'); // Date-only format
    return dateFormatter.format(dateTime);
  }
  final DateFormat formatter = DateFormat('MMM d, h:mm a');
  return formatter.format(dateTime);
}

bool dateContainsTime(DateTime dateTime) {
  if (dateTime.hour == 0 && dateTime.minute == 0) {
    return false;
  }
  return true;
}

String formatFullDateWithMonth(DateTime? dateTime) {
  if (dateTime == null) {
    return '';
  }

  final DateFormat formatter = DateFormat('d MMMM yyyy');
  return formatter.format(dateTime);
}

int calculateDateDifference(DateTime startDate, DateTime endDate) {
  final DateFormat formatter = DateFormat('yyyy-MM-dd');

  try {
    DateTime start = formatter.parse(startDate.toString());
    DateTime end = formatter.parse(endDate.toString());

    return (end.difference(start).inDays).abs();
  } catch (e) {
    print('Error parsing dates: $e');
    return 0;
  }
}

String checkGoogleImageUrl(String url) {
  if (url.contains("lh3.googleusercontent.com")) {
    return url;
  } else {
    return "${EndPointConstants.baseurl}/$url";
  }
}

String formatDateMonthRange(DateTime startDate, DateTime endDate) {
  DateFormat monthDayFormat = DateFormat('MMM d');
  DateFormat dayFormat = DateFormat('d');
  DateFormat timeFormat = DateFormat('h:mm a');

  bool hasTimeStart = !(startDate.hour == 0 && startDate.minute == 0);
  bool hasTimeEnd = !(endDate.hour == 0 && endDate.minute == 0);

  String formatDateWithTime(DateTime date) {
    return hasTimeStart || hasTimeEnd
        ? '${monthDayFormat.format(date)}, ${timeFormat.format(date)}'
        : monthDayFormat.format(date);
  }

  if (startDate.month == endDate.month) {
    // Same month
    return '${formatDateWithTime(startDate)} - ${dayFormat.format(endDate)}${hasTimeEnd ? ', ${timeFormat.format(endDate)}' : ''}';
  } else {
    // Different months
    return '${formatDateWithTime(startDate)} - ${formatDateWithTime(endDate)}';
  }
}

String formatDateMonthRangeWithYear(DateTime startDate, DateTime endDate) {
  DateFormat monthFormat = DateFormat('MMM');
  DateFormat dayFormat = DateFormat('d');
  DateFormat yearFormat = DateFormat('yyyy');

  String startMonth = monthFormat.format(startDate).toUpperCase();
  String endMonth = monthFormat.format(endDate).toUpperCase();
  String startDay = dayFormat.format(startDate);
  String endDay = dayFormat.format(endDate);
  String year = yearFormat.format(startDate);

  if (startDate.month == endDate.month) {
    // Same month
    return '$startMonth\n$startDay-$endDay\n$year';
  } else {
    // Different months
    return '$startMonth $startDay - $endMonth $endDay\n$year';
  }
}

String convertToIST(String utcTimeString) {
  // Parse the UTC time string
  DateTime utcTime = DateTime.parse(utcTimeString);

  // Convert to IST (UTC+5:30)
  DateTime istTime = utcTime.add(Duration(hours: 5, minutes: 30));

  // Format the IST time
  final DateFormat formatter = DateFormat('h:mm a');
  String formattedTime = formatter.format(istTime);

  return formattedTime;
}

String convertDateTime(String? inputDateTime) {
  if (inputDateTime != null || inputDateTime != '') {
    DateTime dateTime = DateTime.parse(inputDateTime ?? '').toLocal();
    DateTime now = DateTime.now();

    if (dateTime.year == now.year &&
        dateTime.month == now.month &&
        dateTime.day == now.day) {
      return DateFormat('h:mm a').format(dateTime);
    } else {
      return DateFormat('dd/MM/yy').format(dateTime);
    }
  } else {
    return '';
  }
}

String convertDatetoTime(DateTime date) {
  return DateFormat('h:mm a').format(date);
}

// to display the email & num in asterisk

String getMaskPhoneNumber(String phone) {
  if (phone.length > 2) {
    return '*' * (phone.length - 2) + phone.substring(phone.length - 2);
  }
  return phone;
}

String getMaskEmail(String email) {
  List<String> parts = email.split('@');
  if (parts.length == 2) {
    String username = parts[0];
    String domain = parts[1];

    if (username.length > 2) {
      return username.substring(0, 2) +
          '*' * (username.length - 2) +
          '@' +
          domain;
    }
  }
  return email;
}

String calculatePrice(num? a, num? b) {
  if (a != null && b != null) return (a * b).toString();
  return "0";
}

String formatPrice(dynamic price) {
  if (price == null) return "0";

  double? parsed;

  if (price is int) {
    parsed = price.toDouble();
  } else if (price is double) {
    parsed = price;
  } else if (price is String) {
    parsed = double.tryParse(price);
  }

  if (parsed == null) return "0";

  double rounded = double.parse(parsed.toStringAsFixed(2));

  // Check if it's a whole number like 8400.00
  if (rounded == rounded.toInt()) {
    return rounded.toInt().toString(); // 👉 return as int string
  } else {
    return rounded.toString(); // 👉 return decimal string
  }
}

class LTRAware {
  static bool isLTR(BuildContext context) {
    return Directionality.of(context) == TextDirection.LTR;
  }

  static bool isRTL(BuildContext context) {
    return Directionality.of(context) == TextDirection.RTL;
  }

  // Convert EdgeInsets to be LTR-aware
  static EdgeInsets convertEdgeInsets(
    BuildContext context,
    EdgeInsets edgeInsets,
  ) {
    if (!isLTR(context) && isArabic(context)) {
      return EdgeInsets.fromLTRB(
        edgeInsets.right,
        edgeInsets.top,
        edgeInsets.left,
        edgeInsets.bottom,
      );
    } else if (isRTL(context)) {
      return EdgeInsets.fromLTRB(
        edgeInsets.right,
        edgeInsets.top,
        edgeInsets.left,
        edgeInsets.bottom,
      );
    }
    return edgeInsets;
  }
}

// Extension method for easier usage
extension LTRAwareEdgeInsetsExtension on EdgeInsets {
  EdgeInsets toLTRAware(BuildContext context) {
    return LTRAware.convertEdgeInsets(context, this);
  }
}

class LTRAwarePositioned extends StatelessWidget {
  final Widget child;
  final double? left;
  final double? right;
  final double? top;
  final double? bottom;
  final double? width;
  final double? height;

  const LTRAwarePositioned({
    Key? key,
    required this.child,
    this.left,
    this.right,
    this.top,
    this.bottom,
    this.width,
    this.height,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isLTR = Directionality.of(context) == TextDirection.LTR;
    return Positioned(
      left: isLTR ? left : right,
      right: isLTR ? right : left,
      top: top,
      bottom: bottom,
      width: width,
      height: height,
      child: child,
    );
  }
}

// Extension method for easier conversion of existing Positioned widgets
extension LTRAwarePositionedExtension on Positioned {
  Widget toLTRAware(BuildContext context) {
    if (isArabic(context)) {
      return LTRAwarePositioned(
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        width: width,
        height: height,
        child: child,
      );
    } else {
      return this;
    }
  }
}

bool isLTR(BuildContext context) {
  return Directionality.of(context) == TextDirection.LTR;
}

// Extension on Widget for LTR conversion
extension LTRAwareWidgetExtension on Widget {
  Widget toLTRAware(BuildContext context) {
    return Builder(
      builder: (BuildContext context) {
        if (isArabic(context) == true)
          return Transform(
            transform: Matrix4.identity()..scale(-1.0, 1.0, 1.0),
            alignment: Alignment.center,
            transformHitTests: false,
            child: this,
          );
        else {
          return this;
        }
      },
    );
  }
}

// Combining LTR and RTL aware utilities
class DirectionalAware {
  static bool isRTL(BuildContext context) {
    return Directionality.of(context) == TextDirection.RTL;
  }

  static EdgeInsets convertEdgeInsets(
    BuildContext context,
    EdgeInsets edgeInsets,
  ) {
    if (isRTL(context)) {
      return EdgeInsets.fromLTRB(
        edgeInsets.right,
        edgeInsets.top,
        edgeInsets.left,
        edgeInsets.bottom,
      );
    }
    return edgeInsets;
  }

  static double getStart(BuildContext context, double value) {
    return isRTL(context) ? 0 : value;
  }

  static double getEnd(BuildContext context, double value) {
    return isRTL(context) ? value : 0;
  }
}

extension DirectionalAwareEdgeInsetsExtension on EdgeInsets {
  EdgeInsets toDirectionalAware(BuildContext context) {
    return DirectionalAware.convertEdgeInsets(context, this);
  }
}

class DirectionalAwarePositioned extends StatelessWidget {
  final Widget child;
  final double? left;
  final double? right;
  final double? top;
  final double? bottom;
  final double? width;
  final double? height;

  const DirectionalAwarePositioned({
    Key? key,
    required this.child,
    this.left,
    this.right,
    this.top,
    this.bottom,
    this.width,
    this.height,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isRTL = DirectionalAware.isRTL(context);

    return Positioned(
      left: isRTL ? right : left,
      right: isRTL ? left : right,
      top: top,
      bottom: bottom,
      width: width,
      height: height,
      child: child,
    );
  }
}

extension DirectionalAwarePositionedExtension on Positioned {
  Widget toDirectionalAware() {
    return DirectionalAwarePositioned(
      left: left,
      right: right,
      top: top,
      bottom: bottom,
      width: width,
      height: height,
      child: child,
    );
  }
}

extension LTRAwareBorderRadiusExtension on BorderRadius {
  BorderRadius toLTRAware(BuildContext context) {
    if (isArabic(context) == true) {
      return BorderRadius.only(
        topLeft: topRight,
        topRight: topLeft,
        bottomLeft: bottomRight,
        bottomRight: bottomLeft,
      );
    } else {
      return this;
    }
  }
}

class LTRAwareBorderRadius {
  static BorderRadius only({
    required BuildContext context,
    double topStart = 0.0,
    double topEnd = 0.0,
    double bottomStart = 0.0,
    double bottomEnd = 0.0,
  }) {
    if (LTRAware.isLTR(context)) {
      return BorderRadius.only(
        topLeft: Radius.circular(topStart),
        topRight: Radius.circular(topEnd),
        bottomLeft: Radius.circular(bottomStart),
        bottomRight: Radius.circular(bottomEnd),
      );
    } else if (LTRAware.isRTL(context)) {
      return BorderRadius.only(
        topLeft: Radius.circular(topEnd),
        topRight: Radius.circular(topStart),
        bottomLeft: Radius.circular(bottomEnd),
        bottomRight: Radius.circular(bottomStart),
      );
    } else {
      return BorderRadius.only(
        topLeft: Radius.circular(topEnd),
        topRight: Radius.circular(topStart),
        bottomLeft: Radius.circular(bottomEnd),
        bottomRight: Radius.circular(bottomStart),
      );
    }
  }

  static BorderRadius circular(BuildContext context, double radius) {
    return BorderRadius.circular(radius);
  }

  static BorderRadius vertical({
    required BuildContext context,
    double top = 0.0,
    double bottom = 0.0,
  }) {
    return BorderRadius.vertical(
      top: Radius.circular(top),
      bottom: Radius.circular(bottom),
    );
  }

  static BorderRadius horizontal({
    required BuildContext context,
    double start = 0.0,
    double end = 0.0,
  }) {
    if (LTRAware.isLTR(context)) {
      return BorderRadius.horizontal(
        left: Radius.circular(start),
        right: Radius.circular(end),
      );
    } else {
      return BorderRadius.horizontal(
        left: Radius.circular(end),
        right: Radius.circular(start),
      );
    }
  }
}

int getReviewRating(ListingDetailResponseModel model, String category) {
  var rating = model.data?.listing?.first.reviewRating?.first.rating;
  switch (category) {
    case "Cleanliness":
      return rating!.cleanliness!;
    case "Accuracy":
      return rating!.accuracy!;
    case "Check-in":
      return rating!.checkIn!;
    case "Communication":
      return rating!.communication!;
    case "Location":
      return rating!.location!;
    case "Value":
      return rating!.value!;

    default:
      return 0;
  }
}

class DateFormatterUtil {
  /// Formats a single date based on API dateFormat
  static String formatDate(String inputDate, String? dateFormat) {
    try {
      if (inputDate.isEmpty || dateFormat == null || dateFormat.isEmpty) {
        return "";
      }

      DateTime dateTime = _parseDateDynamically(inputDate);
      String formattedPattern = _convertToDartFormat(dateFormat);
      return DateFormat(formattedPattern).format(dateTime);
    } catch (e) {
      print("Error formatting date: $e");
      return inputDate;
    }
  }

  /// Formats a date range (startDate - endDate) dynamically
  static String formatDateRange(
    String startDate,
    String endDate,
    String? dateFormat,
  ) {
    try {
      if (startDate.isEmpty ||
          endDate.isEmpty ||
          dateFormat == null ||
          dateFormat.isEmpty) {
        return "";
      }

      DateTime start = _parseDateDynamically(startDate);
      DateTime end = _parseDateDynamically(endDate);
      String formattedPattern = _convertToDartFormat(dateFormat);

      return "${DateFormat(formattedPattern).format(start)} -- ${DateFormat(formattedPattern).format(end)}";
    } catch (e) {
      print("Error formatting date range: $e");
      return "$startDate - $endDate";
    }
  }

  /// Formats a single date with time dynamically
  static String formatDateTimeWithTime(String inputDate, String? dateFormat) {
    try {
      if (inputDate.isEmpty || dateFormat == null || dateFormat.isEmpty) {
        return "";
      }

      DateTime dateTime = _parseDateDynamically(inputDate);
      String formattedPattern = "${_convertToDartFormat(dateFormat)}, hh:mm a";
      return DateFormat(formattedPattern).format(dateTime);
    } catch (e) {
      print("Error formatting date with time: $e");
      return inputDate;
    }
  }

  /// Formats a date range with time dynamically
  static String formatDateTimeRange(
    String startDate,
    String endDate,
    String? dateFormat,
  ) {
    try {
      if (startDate.isEmpty ||
          endDate.isEmpty ||
          dateFormat == null ||
          dateFormat.isEmpty) {
        return "";
      }

      return "${formatDateTimeWithTime(startDate, dateFormat)} -- ${formatDateTimeWithTime(endDate, dateFormat)}";
    } catch (e) {
      print("Error formatting date-time range: $e");
      return "$startDate - $endDate";
    }
  }

  static String formatDateRangeWithTime(
    String startDate,
    String endDate,
    String? dateFormat,
  ) {
    try {
      if (startDate.isEmpty ||
          endDate.isEmpty ||
          dateFormat == null ||
          dateFormat.isEmpty) {
        return ""; // Return empty if input is invalid
      }

      // Convert API format to Dart-compatible format
      String formattedPattern = _convertToDartFormat(dateFormat);

      // Parse both start and end dates
      DateTime start = _parseDateDynamically(startDate);
      DateTime end = _parseDateDynamically(endDate);

      // Check if time exists (hour or minute not zero)
      bool hasTimeStart = !(start.hour == 0 && start.minute == 0);
      bool hasTimeEnd = !(end.hour == 0 && end.minute == 0);

      // Format date based on conditions
      String formattedStartDate = DateFormat(formattedPattern).format(start);
      String formattedEndDate = DateFormat(formattedPattern).format(end);

      // Append time if available
      if (hasTimeStart || hasTimeEnd) {
        formattedStartDate += ", ${DateFormat("h:mm a").format(start)}";
        formattedEndDate += ", ${DateFormat("h:mm a").format(end)}";
      }

      return "$formattedStartDate -- $formattedEndDate";
    } catch (e) {
      print("Error formatting date-time range: $e");
      return "$startDate - $endDate"; // Return original range in case of error
    }
  }

  /// Converts API date format (MM-DD-YYYY) to Dart DateFormat compatible format
  static String _convertToDartFormat(String apiFormat) {
    return apiFormat
        .replaceAll("YYYY", "yyyy")
        .replaceAll("YY", "yy")
        .replaceAll("DD", "dd")
        .replaceAll("D", "d")
        .replaceAll("MM", "MM")
        .replaceAll("M", "M")
        .replaceAll("HH", "HH")
        .replaceAll("hh", "hh")
        .replaceAll("mm", "mm")
        .replaceAll("ss", "ss")
        .replaceAll("SSS", "SSS")
        .replaceAll("EEE", "EEE") // Weekday (e.g., Mon, Tue)
        .replaceAll("EEEE", "EEEE"); // Full weekday (e.g., Monday)
  }

  /// Dynamically parses various date formats

  static DateTime _parseDateDynamically(String inputDate) {
    try {
      return DateTime.parse(inputDate); // Directly parse ISO format
    } catch (_) {
      List<String> possibleFormats = [
        "yyyy-MM-dd HH:mm:ss.SSS",
        "yyyy-MM-dd HH:mm:ss",
        "yyyy-MM-dd",
        "dd/MM/yyyy",
        "MM/dd/yyyy",
        "dd-MM-yyyy",
        "yyyy/MM/dd",
        "d MMM yyyy",
        "d MMMM yyyy",
        "EEEE, d MMM yyyy",
        "EEE, d MMM yyyy",
        "yyyy-MM-dd'T'HH:mm:ss'Z'",
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
      ];

      for (String format in possibleFormats) {
        try {
          return DateFormat(format).parseLoose(inputDate);
        } catch (_) {}
      }
    }
    throw FormatException("Unsupported date format: $inputDate");
  }
}

int cacheSize(BuildContext context) {
  int value = Get.width.round() * 2;
  return value * MediaQuery.of(context).devicePixelRatio.round();
}

String? extractStatusCodeFromError(String? errorString) {
  if (errorString == null) return null;

  // Check if the string contains embedded JSON
  final regex = RegExp(r'key_txn_result:\s*(\{.*\})');
  final match = regex.firstMatch(errorString);
  if (match != null) {
    final jsonPart = match.group(1);
    try {
      final decoded = jsonDecode(jsonPart!);
      if (decoded is Map && decoded.containsKey('statusCode')) {
        return decoded['statusCode']?.toString();
      }
    } catch (e) {
      print('Failed to decode embedded JSON: $e');
    }
  }

  return errorString; // fallback
}

String generateKey(int length) {
  const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  final rand = Random.secure();
  return List.generate(length, (_) => chars[rand.nextInt(chars.length)]).join();
}
