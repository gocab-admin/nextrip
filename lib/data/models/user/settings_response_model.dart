// To parse this JSON data, do
//
//     final settingsResponseModel = settingsResponseModelFromJson(jsonString);

import 'dart:convert';

SettingsResponseModel settingsResponseModelFromJson(String str) => SettingsResponseModel.fromJson(json.decode(str));

String settingsResponseModelToJson(SettingsResponseModel data) => json.encode(data.toJson());

class SettingsResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;

  SettingsResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
  });

  factory SettingsResponseModel.fromJson(Map<String, dynamic> json) => SettingsResponseModel(
    message: json["message"],
    statusCode: json["statusCode"],
    status: json["status"],
    data: json["data"] == null ? null : Data.fromJson(json["data"]),
  );

  Map<String, dynamic> toJson() => {
    "message": message,
    "statusCode": statusCode,
    "status": status,
    "data": data?.toJson(),
  };
}

class Data {
  App? app;
  Site? site;
  Chat? chat;
  SocialLinks? socialLinks;
  AppLinks? appLinks;
  Theme? theme;
  HiddenSettings? hiddenSettings;
  Listings? listings;
  Cloudinary? cloudinary;
  Google? google;
  List<String>? locale;
  String? fileurl;
  String? frontendurl;
  String? companyaddress;
  String? baseUrl;
  String? companymail;
  DataAuth? auth;
  Db? db;
  Winiston? winiston;
  EmailGateway? emailGateway;
  String? mailFrom;
  PaymentGateway? paymentGateway;
  RazorPayGateway? razorPayGateway;
  Booking? booking;
  MetaData? metaData;
  // String? commission;
  // String? tax;
  String? toFixedCount;
  int? requestRadius;
  List<String>? activePages;
  List<CancelationPolicy>? cancelationPolicy;
  AdstarConfig? adstarConfig;

  Data({
    this.app,
    this.site,
    this.chat,
    this.socialLinks,
    this.appLinks,
    this.theme,
    this.hiddenSettings,
    this.listings,
    this.cloudinary,
    this.google,
    this.locale,
    this.fileurl,
    this.frontendurl,
    this.companyaddress,
    this.baseUrl,
    this.companymail,
    this.auth,
    this.db,
    this.winiston,
    this.emailGateway,
    this.mailFrom,
    this.paymentGateway,
    this.razorPayGateway,
    this.booking,
    this.metaData,
    // this.commission,
    // this.tax,
    this.toFixedCount,
    this.requestRadius,
    this.activePages,
    this.cancelationPolicy,
    this.adstarConfig,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    app: json["app"] == null ? null : App.fromJson(json["app"]),
    site: json["site"] == null ? null : Site.fromJson(json["site"]),
    chat: json["chat"] == null ? null : Chat.fromJson(json["chat"]),
    socialLinks: json["socialLinks"] == null ? null : SocialLinks.fromJson(json["socialLinks"]),
    appLinks: json["appLinks"] == null ? null : AppLinks.fromJson(json["appLinks"]),
    theme: json["theme"] == null ? null : Theme.fromJson(json["theme"]),
    hiddenSettings: json["hiddenSettings"] == null ? null : HiddenSettings.fromJson(json["hiddenSettings"]),
    listings: json["listings"] == null ? null : Listings.fromJson(json["listings"]),
    cloudinary: json["cloudinary"] == null ? null : Cloudinary.fromJson(json["cloudinary"]),
    google: json["google"] == null ? null : Google.fromJson(json["google"]),
    locale: json["locale"] == null ? [] : List<String>.from(json["locale"]!.map((x) => x)),
    fileurl: json["fileurl"],
    frontendurl: json["frontendurl"],
    companyaddress: json["companyaddress"],
    baseUrl: json["baseUrl"],
    companymail: json["companymail"],
    auth: json["auth"] == null ? null : DataAuth.fromJson(json["auth"]),
    db: json["db"] == null ? null : Db.fromJson(json["db"]),
    winiston: json["winiston"] == null ? null : Winiston.fromJson(json["winiston"]),
    emailGateway: json["emailGateway"] == null ? null : EmailGateway.fromJson(json["emailGateway"]),
    mailFrom: json["mailFrom"],
    paymentGateway: json["paymentGateway"] == null ? null : PaymentGateway.fromJson(json["paymentGateway"]),
    razorPayGateway: json["razorPayGateway"] == null ? null : RazorPayGateway.fromJson(json["razorPayGateway"]),
    booking: json["booking"] == null ? null : Booking.fromJson(json["booking"]),
    metaData: json["metaData"] == null ? null : MetaData.fromJson(json["metaData"]),
    // commission: json["commission"],
    // tax: json["tax"],
    toFixedCount: json["toFixedCount"],
    requestRadius: json["requestRadius"],
    activePages: json["activePages"] == null ? [] : List<String>.from(json["activePages"]!.map((x) => x)),
    cancelationPolicy: json["cancelationPolicy"] == null ? [] : List<CancelationPolicy>.from(json["cancelationPolicy"]!.map((x) => CancelationPolicy.fromJson(x))),
    adstarConfig: json["adstarConfig"] == null ? null : AdstarConfig.fromJson(json["adstarConfig"]),
  );

  Map<String, dynamic> toJson() => {
    "app": app?.toJson(),
    "site": site?.toJson(),
    "chat": chat?.toJson(),
    "socialLinks": socialLinks?.toJson(),
    "appLinks": appLinks?.toJson(),
    "theme": theme?.toJson(),
    "hiddenSettings": hiddenSettings?.toJson(),
    "listings": listings?.toJson(),
    "cloudinary": cloudinary?.toJson(),
    "google": google?.toJson(),
    "locale": locale == null ? [] : List<dynamic>.from(locale!.map((x) => x)),
    "fileurl": fileurl,
    "frontendurl": frontendurl,
    "companyaddress": companyaddress,
    "baseUrl": baseUrl,
    "companymail": companymail,
    "auth": auth?.toJson(),
    "db": db?.toJson(),
    "winiston": winiston?.toJson(),
    "emailGateway": emailGateway?.toJson(),
    "mailFrom": mailFrom,
    "paymentGateway": paymentGateway?.toJson(),
    "razorPayGateway": razorPayGateway?.toJson(),
    "booking": booking?.toJson(),
    "metaData": metaData?.toJson(),
    // "commission": commission,
    // "tax": tax,
    "toFixedCount": toFixedCount,
    "requestRadius": requestRadius,
    "activePages": activePages == null ? [] : List<dynamic>.from(activePages!.map((x) => x)),
    "cancelationPolicy": cancelationPolicy == null ? [] : List<dynamic>.from(cancelationPolicy!.map((x) => x.toJson())),
    "adstarConfig": adstarConfig?.toJson(),
  };
}

class AdstarConfig {
  String? defaultPackage;
  int? adsLimitPerUser;
  int? adsValidityInDays;

  AdstarConfig({
    this.defaultPackage,
    this.adsLimitPerUser,
    this.adsValidityInDays,
  });

  factory AdstarConfig.fromJson(Map<String, dynamic> json) => AdstarConfig(
    defaultPackage: json["defaultPackage"],
    adsLimitPerUser: json["adsLimitPerUser"],
    adsValidityInDays: json["adsValidityInDays"],
  );

  Map<String, dynamic> toJson() => {
    "defaultPackage": defaultPackage,
    "adsLimitPerUser": adsLimitPerUser,
    "adsValidityInDays": adsValidityInDays,
  };
}

class App {
  int? port;
  String? appName;
  String? desc;
  String? appMode;
  String? logo;
  String? favicon;
  String? baseurl;

  App({
    this.port,
    this.appName,
    this.desc,
    this.appMode,
    this.logo,
    this.favicon,
    this.baseurl,
  });

  factory App.fromJson(Map<String, dynamic> json) => App(
    port: json["port"],
    appName: json["appName"],
    desc: json["desc"],
    appMode: json["appMode"],
    logo: json["logo"],
    favicon: json["favicon"],
    baseurl: json["baseurl"],
  );

  Map<String, dynamic> toJson() => {
    "port": port,
    "appName": appName,
    "desc": desc,
    "appMode": appMode,
    "logo": logo,
    "favicon": favicon,
    "baseurl": baseurl,
  };
}

class AppLinks {
  String? playstore;
  String? appstore;

  AppLinks({
    this.playstore,
    this.appstore,
  });

  factory AppLinks.fromJson(Map<String, dynamic> json) => AppLinks(
    playstore: json["playstore"],
    appstore: json["appstore"],
  );

  Map<String, dynamic> toJson() => {
    "playstore": playstore,
    "appstore": appstore,
  };
}

class DataAuth {
  String? cipherKey;

  DataAuth({
    this.cipherKey,
  });

  factory DataAuth.fromJson(Map<String, dynamic> json) => DataAuth(
    cipherKey: json["cipherKey"],
  );

  Map<String, dynamic> toJson() => {
    "cipherKey": cipherKey,
  };
}

class Booking {
  int? dayHour;

  Booking({
    this.dayHour,
  });

  factory Booking.fromJson(Map<String, dynamic> json) => Booking(
    dayHour: json["dayHour"],
  );

  Map<String, dynamic> toJson() => {
    "dayHour": dayHour,
  };
}

class CancelationPolicy {
  int? id;
  String? title;
  String? desc;

  CancelationPolicy({
    this.id,
    this.title,
    this.desc,
  });

  factory CancelationPolicy.fromJson(Map<String, dynamic> json) => CancelationPolicy(
    id: json["id"],
    title: json["title"],
    desc: json["desc"],
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "title": title,
    "desc": desc,
  };
}

class Chat {
  String? chatPropertyId;
  String? chatWidgetId;

  Chat({
    this.chatPropertyId,
    this.chatWidgetId,
  });

  factory Chat.fromJson(Map<String, dynamic> json) => Chat(
    chatPropertyId: json["chatPropertyId"],
    chatWidgetId: json["chatWidgetId"],
  );

  Map<String, dynamic> toJson() => {
    "chatPropertyId": chatPropertyId,
    "chatWidgetId": chatWidgetId,
  };
}

class Cloudinary {
  String? cloudName;
  String? apiKey;
  String? apiSecret;

  Cloudinary({
    this.cloudName,
    this.apiKey,
    this.apiSecret,
  });

  factory Cloudinary.fromJson(Map<String, dynamic> json) => Cloudinary(
    cloudName: json["cloud_name"],
    apiKey: json["api_key"],
    apiSecret: json["api_secret"],
  );

  Map<String, dynamic> toJson() => {
    "cloud_name": cloudName,
    "api_key": apiKey,
    "api_secret": apiSecret,
  };
}

class Db {
  String? url;

  Db({
    this.url,
  });

  factory Db.fromJson(Map<String, dynamic> json) => Db(
    url: json["url"],
  );

  Map<String, dynamic> toJson() => {
    "url": url,
  };
}

class EmailGateway {
  String? appName;
  String? name;
  SmtpConfig? smtpConfig;

  EmailGateway({
    this.appName,
    this.name,
    this.smtpConfig,
  });

  factory EmailGateway.fromJson(Map<String, dynamic> json) => EmailGateway(
    appName: json["AppName"],
    name: json["name"],
    smtpConfig: json["smtpConfig"] == null ? null : SmtpConfig.fromJson(json["smtpConfig"]),
  );

  Map<String, dynamic> toJson() => {
    "AppName": appName,
    "name": name,
    "smtpConfig": smtpConfig?.toJson(),
  };
}

class SmtpConfig {
  String? host;
  int? port;
  SmtpConfigAuth? auth;

  SmtpConfig({
    this.host,
    this.port,
    this.auth,
  });

  factory SmtpConfig.fromJson(Map<String, dynamic> json) => SmtpConfig(
    host: json["host"],
    port: json["port"],
    auth: json["auth"] == null ? null : SmtpConfigAuth.fromJson(json["auth"]),
  );

  Map<String, dynamic> toJson() => {
    "host": host,
    "port": port,
    "auth": auth?.toJson(),
  };
}

class SmtpConfigAuth {
  String? user;
  String? pass;

  SmtpConfigAuth({
    this.user,
    this.pass,
  });

  factory SmtpConfigAuth.fromJson(Map<String, dynamic> json) => SmtpConfigAuth(
    user: json["user"],
    pass: json["pass"],
  );

  Map<String, dynamic> toJson() => {
    "user": user,
    "pass": pass,
  };
}

class Google {
  String? googleClientId;
  String? googleClientSecret;
  String? mapApiKey;
  String? googleRedirectUrl;
  String? googleRecaptchaKey;
  String? googleRecaptchaSiteKey;
  String? googleRecaptchaSecretKey;

  Google({
    this.googleClientId,
    this.googleClientSecret,
    this.mapApiKey,
    this.googleRedirectUrl,
    this.googleRecaptchaKey,
    this.googleRecaptchaSiteKey,
    this.googleRecaptchaSecretKey,
  });

  factory Google.fromJson(Map<String, dynamic> json) => Google(
    googleClientId: json["googleClientId"],
    googleClientSecret: json["googleClientSecret"],
    mapApiKey: json["mapApiKey"],
    googleRedirectUrl: json["googleRedirectUrl"],
    googleRecaptchaKey: json["googleRecaptchaKey"],
    googleRecaptchaSiteKey: json["googleRecaptchaSiteKey"],
    googleRecaptchaSecretKey: json["googleRecaptchaSecretKey"],
  );

  Map<String, dynamic> toJson() => {
    "googleClientId": googleClientId,
    "googleClientSecret": googleClientSecret,
    "mapApiKey": mapApiKey,
    "googleRedirectUrl": googleRedirectUrl,
    "googleRecaptchaKey": googleRecaptchaKey,
    "googleRecaptchaSiteKey": googleRecaptchaSiteKey,
    "googleRecaptchaSecretKey": googleRecaptchaSecretKey,
  };
}

class HiddenSettings {
  String? autoEnable;
  String? mode;
  String? sensitive;
  String? ads;
  String? listing;
  String? stripe;
  String? razorpay;
  String? phonePe;
  String? cash;
  String? checkIn;
  String? timeFormat;
  String? listingImageCount;
  String? peopleCount;
  String? hourlyBooking;
  String? documentVerification;
  String? dateFormat;
  String? calendarTheme;

  HiddenSettings({
    this.autoEnable,
    this.mode,
    this.sensitive,
    this.ads,
    this.listing,
    this.stripe,
    this.razorpay,
    this.phonePe,
    this.cash,
    this.checkIn,
    this.timeFormat,
    this.listingImageCount,
    this.peopleCount,
    this.hourlyBooking,
    this.documentVerification,
    this.dateFormat,
    this.calendarTheme,
  });

  factory HiddenSettings.fromJson(Map<String, dynamic> json) => HiddenSettings(
    autoEnable: json["autoEnable"],
    mode: json["mode"],
    sensitive: json["sensitive"],
    ads: json["ads"],
    listing: json["listing"],
    stripe: json["stripe"],
    razorpay: json["razorpay"],
    phonePe: json["phonePe"],
    cash: json["cash"],
    checkIn: json["checkIn"],
    timeFormat: json["timeFormat"],
    listingImageCount: json["listingImageCount"],
    peopleCount: json["peopleCount"],
    hourlyBooking: json["hourlyBooking"],
    documentVerification: json["documentVerification"],
    dateFormat: json["dateFormat"],
    calendarTheme: json["calendarTheme"],
  );

  Map<String, dynamic> toJson() => {
    "autoEnable": autoEnable,
    "mode": mode,
    "sensitive": sensitive,
    "ads": ads,
    "listing": listing,
    "stripe": stripe,
    "razorpay": razorpay,
    "phonePe": phonePe,
    "cash": cash,
    "checkIn": checkIn,
    "timeFormat": timeFormat,
    "listingImageCount": listingImageCount,
    "peopleCount": peopleCount,
    "hourlyBooking": hourlyBooking,
    "documentVerification": documentVerification,
    "dateFormat": dateFormat,
    "calendarTheme": calendarTheme,
  };
}

class Listings {
  String? availableCount;
  String? specifications;
  Pricings? pricings;

  Listings({
    this.availableCount,
    this.specifications,
    this.pricings,
  });

  factory Listings.fromJson(Map<String, dynamic> json) => Listings(
    availableCount: json["availableCount"],
    specifications: json["specifications"],
    pricings: json["pricings"] == null ? null : Pricings.fromJson(json["pricings"]),
  );

  Map<String, dynamic> toJson() => {
    "availableCount": availableCount,
    "specifications": specifications,
    "pricings": pricings?.toJson(),
  };
}

class Pricings {
  String? additions;

  Pricings({
    this.additions,
  });

  factory Pricings.fromJson(Map<String, dynamic> json) => Pricings(
    additions: json["additions"],
  );

  Map<String, dynamic> toJson() => {
    "additions": additions,
  };
}

class MetaData {
  String? fbClientId;
  String? fbSeceretId;

  MetaData({
    this.fbClientId,
    this.fbSeceretId,
  });

  factory MetaData.fromJson(Map<String, dynamic> json) => MetaData(
    fbClientId: json["FB_CLIENT_ID"],
    fbSeceretId: json["FB_SECERET_ID"],
  );

  Map<String, dynamic> toJson() => {
    "FB_CLIENT_ID": fbClientId,
    "FB_SECERET_ID": fbSeceretId,
  };
}

class PaymentGateway {
  String? name;
  String? mode;
  String? keySecret;
  String? publishableKey;
  String? kkSecret;

  PaymentGateway({
    this.name,
    this.mode,
    this.keySecret,
    this.publishableKey,
    this.kkSecret,
  });

  factory PaymentGateway.fromJson(Map<String, dynamic> json) => PaymentGateway(
    name: json["name"],
    mode: json["mode"],
    keySecret: json["keySecret"],
    publishableKey: json["publishableKey"],
    kkSecret: json["kkSecret"],
  );

  Map<String, dynamic> toJson() => {
    "name": name,
    "mode": mode,
    "keySecret": keySecret,
    "publishableKey": publishableKey,
    "kkSecret": kkSecret,
  };
}

class RazorPayGateway {
  String? name;
  String? mode;
  String? razorpayKeyId;
  String? razorpaySecret;
  String? accountNumber;

  RazorPayGateway({
    this.name,
    this.mode,
    this.razorpayKeyId,
    this.razorpaySecret,
    this.accountNumber,
  });

  factory RazorPayGateway.fromJson(Map<String, dynamic> json) => RazorPayGateway(
    name: json["name"],
    mode: json["mode"],
    razorpayKeyId: json["razorpayKeyId"],
    razorpaySecret: json["razorpaySecret"],
    accountNumber: json["accountNumber"],
  );

  Map<String, dynamic> toJson() => {
    "name": name,
    "mode": mode,
    "razorpayKeyId": razorpayKeyId,
    "razorpaySecret": razorpaySecret,
    "accountNumber": accountNumber,
  };
}

class Site {
  String? sensitiveDatas;
  String? titleName;
  String? language;
  String? currency;
  String? currencySymbol;
  String? phoneCode;
  String? countryCode;
  MapCoordinates? mapCoordinates;

  Site({
    this.sensitiveDatas,
    this.titleName,
    this.language,
    this.currency,
    this.currencySymbol,
    this.phoneCode,
    this.countryCode,
    this.mapCoordinates,
  });

  factory Site.fromJson(Map<String, dynamic> json) => Site(
    sensitiveDatas: json["sensitiveDatas"],
    titleName: json["titleName"],
    language: json["language"],
    currency: json["currency"],
    currencySymbol: json["currencySymbol"],
    phoneCode: json["phoneCode"],
    countryCode: json["countryCode"],
    mapCoordinates: json["mapCoordinates"] == null ? null : MapCoordinates.fromJson(json["mapCoordinates"]),
  );

  Map<String, dynamic> toJson() => {
    "sensitiveDatas": sensitiveDatas,
    "titleName": titleName,
    "language": language,
    "currency": currency,
    "currencySymbol": currencySymbol,
    "phoneCode": phoneCode,
    "countryCode": countryCode,
    "mapCoordinates": mapCoordinates?.toJson(),
  };
}

class MapCoordinates {
  String? lat;
  String? lng;

  MapCoordinates({
    this.lat,
    this.lng,
  });

  factory MapCoordinates.fromJson(Map<String, dynamic> json) => MapCoordinates(
    lat: json["lat"],
    lng: json["lng"],
  );

  Map<String, dynamic> toJson() => {
    "lat": lat,
    "lng": lng,
  };
}

class SocialLinks {
  String? facebook;
  String? twitter;
  String? instagram;

  SocialLinks({
    this.facebook,
    this.twitter,
    this.instagram,
  });

  factory SocialLinks.fromJson(Map<String, dynamic> json) => SocialLinks(
    facebook: json["facebook"],
    twitter: json["twitter"],
    instagram: json["instagram"],
  );

  Map<String, dynamic> toJson() => {
    "facebook": facebook,
    "twitter": twitter,
    "instagram": instagram,
  };
}

class Theme {
  String? homepage;
  String? fontFamily;
  String? themeColor;
  String? primaryTheme;
  String? secondaryTheme;

  Theme({
    this.homepage,
    this.fontFamily,
    this.themeColor,
    this.primaryTheme,
    this.secondaryTheme,
  });

  factory Theme.fromJson(Map<String, dynamic> json) => Theme(
    homepage: json["homepage"],
    fontFamily: json["fontFamily"],
    themeColor: json["themeColor"],
    primaryTheme: json["primaryTheme"],
    secondaryTheme: json["secondaryTheme"],
  );

  Map<String, dynamic> toJson() => {
    "homepage": homepage,
    "fontFamily": fontFamily,
    "themeColor": themeColor,
    "primaryTheme": primaryTheme,
    "secondaryTheme": secondaryTheme,
  };
}

class Winiston {
  String? logpath;

  Winiston({
    this.logpath,
  });

  factory Winiston.fromJson(Map<String, dynamic> json) => Winiston(
    logpath: json["logpath"],
  );

  Map<String, dynamic> toJson() => {
    "logpath": logpath,
  };
}
