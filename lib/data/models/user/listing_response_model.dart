// To parse this JSON data, do
//
//     final listingResponseModel = listingResponseModelFromJson(jsonString);

import 'dart:convert';

ListingResponseModel listingResponseModelFromJson(String str) =>
    ListingResponseModel.fromJson(json.decode(str));

String listingResponseModelToJson(ListingResponseModel data) =>
    json.encode(data.toJson());

class ListingResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  ListingResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory ListingResponseModel.fromJson(Map<String, dynamic> json) =>
      ListingResponseModel(
        message: json["message"],
        statusCode: json["statusCode"],
        status: json["status"],
        data: json["data"] == null ? null : Data.fromJson(json["data"]),
        validation: json["validation"] == null
            ? null
            : Validation.fromJson(json["validation"]),
      );

  Map<String, dynamic> toJson() => {
        "message": message,
        "statusCode": statusCode,
        "status": status,
        "data": data?.toJson(),
        "validation": validation?.toJson(),
      };
}

class Data {
  int? totalCount;
  MultipleCurrency? multipleCurrency;
  List<ApprovedListing>? approvedListing;
  int? minPrice;
  int? maxPrice;
  int? defaultMinPrice;
  int? defaultMaxPrice;

  Data({
    this.totalCount,
    this.multipleCurrency,
    this.approvedListing,
    this.minPrice,
    this.maxPrice,
    this.defaultMinPrice,
    this.defaultMaxPrice,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
        totalCount: json["totalCount"],
        multipleCurrency: json["multipleCurrency"] == null
            ? null
            : MultipleCurrency.fromJson(json["multipleCurrency"]),
        approvedListing: json["approvedListing"] == null
            ? []
            : List<ApprovedListing>.from(json["approvedListing"]
                .map((x) => ApprovedListing.fromJson(x))),
        minPrice: json["minPrice"],
        maxPrice: json["maxPrice"],
    defaultMinPrice: json["defaultMinPrice"],
    defaultMaxPrice: json["defaultMaxPrice"],
      );

  Map<String, dynamic> toJson() => {
        "totalCount": totalCount,
        "multipleCurrency": multipleCurrency?.toJson(),
        "approvedListing": approvedListing == null
            ? []
            : List<dynamic>.from(approvedListing!.map((x) => x.toJson())),
        "minPrice": minPrice,
        "maxPrice": maxPrice,
        "defaultMinPrice": defaultMinPrice,
        "defaultMaxPrice": defaultMaxPrice,
      };
}

class ApprovedListing {
  String? id;
  Address? address;
  String? propertyName;
  String? propertyDesc;
  String? status;
  double? totalRatingCount;
  int? totalReviewCount;
  PriceData? priceData;
  List<AttachmentDatum>? attachmentData;
  UserData? userData;
  bool? wishlist;
  String? propertyTypeName;
  String? propertyCategoryName;

  ApprovedListing({
    this.id,
    this.address,
    this.propertyName,
    this.propertyDesc,
    this.status,
    this.totalRatingCount,
    this.totalReviewCount,
    this.priceData,
    this.attachmentData,
    this.userData,
    this.wishlist,
    this.propertyTypeName,
    this.propertyCategoryName,
  });

  factory ApprovedListing.fromJson(Map<String, dynamic> json) =>
      ApprovedListing(
        id: json["_id"],
        address:
            json["address"] == null ? null : Address.fromJson(json["address"]),
        propertyName: json["propertyName"],
        propertyDesc: json["propertyDesc"],
        status: json["status"],
        totalRatingCount: json["totalRatingCount"]?.toDouble(),
        totalReviewCount: json["totalReviewCount"],
        priceData: json["priceData"] == null
            ? null
            : PriceData.fromJson(json["priceData"]),
        attachmentData: json["attachmentData"] == null
            ? []
            : List<AttachmentDatum>.from(
                json["attachmentData"].map((x) => AttachmentDatum.fromJson(x))),
        userData: json["userData"] == null
            ? null
            : UserData.fromJson(json["userData"]),
        wishlist: json["wishlist"],
        propertyTypeName: json["propertyTypeName"],
        propertyCategoryName: json["propertyCategoryName"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "address": address?.toJson(),
        "propertyName": propertyName,
        "propertyDesc": propertyDesc,
        "status": status,
        "totalRatingCount": totalRatingCount,
        "totalReviewCount": totalReviewCount,
        "priceData": priceData?.toJson(),
        "attachmentData": attachmentData == null
            ? []
            : List<dynamic>.from(attachmentData!.map((x) => x.toJson())),
        "userData": userData?.toJson(),
        "wishlist": wishlist,
        "propertyTypeName": propertyTypeName,
        "propertyCategoryName": propertyCategoryName,
      };
}

class Address {
  String? city;
  String? state;
  String? country;
  String? zipcode;
  String? address;
  String? landmark;
  List<double>? coordinates;

  Address({
    this.city,
    this.state,
    this.country,
    this.zipcode,
    this.address,
    this.landmark,
    this.coordinates,
  });

  factory Address.fromJson(Map<String, dynamic> json) => Address(
        city: json["city"],
        state: json["state"],
        country: json["country"],
        zipcode: json["zipcode"],
        address: json["address"],
        landmark: json["landmark"],
        coordinates: json["coordinates"] == null
            ? []
            : List<double>.from(json["coordinates"].map((x) => x?.toDouble())),
      );

  Map<String, dynamic> toJson() => {
        "city": city,
        "state": state,
        "country": country,
        "zipcode": zipcode,
        "address": address,
        "landmark": landmark,
        "coordinates": coordinates == null
            ? []
            : List<dynamic>.from(coordinates!.map((x) => x)),
      };
}

class AttachmentDatum {
  ListingImage? image;
  List<Rule>? rules;

  AttachmentDatum({
    this.image,
    this.rules,
  });

  factory AttachmentDatum.fromJson(Map<String, dynamic> json) =>
      AttachmentDatum(
        image:
            json["image"] == null ? null : ListingImage.fromJson(json["image"]),
        rules: json["rules"] == null
            ? []
            : List<Rule>.from(json["rules"].map((x) => Rule.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "image": image?.toJson(),
        "rules": rules == null
            ? []
            : List<dynamic>.from(rules!.map((x) => x.toJson())),
      };
}

class ListingImage {
  String? coverImage;
  List<GroupImage>? groupImage;

  ListingImage({
    this.coverImage,
    this.groupImage,
  });

  factory ListingImage.fromJson(Map<String, dynamic> json) => ListingImage(
        coverImage: json["coverImage"],
        groupImage: json["groupImage"] == null
            ? []
            : List<GroupImage>.from(
                json["groupImage"].map((x) => GroupImage.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "coverImage": coverImage,
        "groupImage": groupImage == null
            ? []
            : List<dynamic>.from(groupImage!.map((x) => x.toJson())),
      };
}

class GroupImage {
  String? imagePath;
  String? id;

  GroupImage({
    this.imagePath,
    this.id,
  });

  factory GroupImage.fromJson(Map<String, dynamic> json) => GroupImage(
        imagePath: json["imagePath"],
        id: json["_id"],
      );

  Map<String, dynamic> toJson() => {
        "imagePath": imagePath,
        "_id": id,
      };
}

class Rule {
  String? title;
  String? desc;
  String? image;
  String? id;

  Rule({
    this.title,
    this.desc,
    this.image,
    this.id,
  });

  factory Rule.fromJson(Map<String, dynamic> json) => Rule(
        title: json["title"],
        desc: json["desc"],
        image: json["image"],
        id: json["_id"],
      );

  Map<String, dynamic> toJson() => {
        "title": title,
        "desc": desc,
        "image": image,
        "_id": id,
      };
}

class PriceData {
  String? id;
  String? listingId;
  int? v;
  List<BlockedDate>? blockedDates;
  BookingType? bookingType;
  DateTime? createdAt;
  Pricing? pricing;
  DateTime? updatedAt;
  int? availableCount;

  PriceData({
    this.id,
    this.listingId,
    this.v,
    this.blockedDates,
    this.bookingType,
    this.createdAt,
    this.pricing,
    this.updatedAt,
    this.availableCount,
  });

  factory PriceData.fromJson(Map<String, dynamic> json) => PriceData(
        id: json["_id"],
        listingId: json["listingId"],
        v: json["__v"],
        blockedDates: json["blockedDates"] == null
            ? []
            : List<BlockedDate>.from(
                json["blockedDates"].map((x) => BlockedDate.fromJson(x))),
        bookingType: json["bookingType"] == null
            ? null
            : BookingType.fromJson(json["bookingType"]),
        createdAt: json["createdAt"] == null
            ? null
            : DateTime.parse(json["createdAt"]),
        pricing:
            json["pricing"] == null ? null : Pricing.fromJson(json["pricing"]),
        updatedAt: json["updatedAt"] == null
            ? null
            : DateTime.parse(json["updatedAt"]),
        availableCount: json["availableCount"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "listingId": listingId,
        "__v": v,
        "blockedDates": blockedDates == null
            ? []
            : List<dynamic>.from(blockedDates!.map((x) => x.toJson())),
        "bookingType": bookingType?.toJson(),
        "createdAt": createdAt?.toIso8601String(),
        "pricing": pricing?.toJson(),
        "updatedAt": updatedAt?.toIso8601String(),
        "availableCount": availableCount,
      };
}

class BlockedDate {
  String? title;
  DateTime? start;
  DateTime? end;
  String? desc;
  String? id;

  BlockedDate({
    this.title,
    this.start,
    this.end,
    this.desc,
    this.id,
  });

  factory BlockedDate.fromJson(Map<String, dynamic> json) => BlockedDate(
        title: json["title"],
        start: json["start"] == null ? null : DateTime.parse(json["start"]),
        end: json["end"] == null ? null : DateTime.parse(json["end"]),
        desc: json["desc"],
        id: json["_id"],
      );

  Map<String, dynamic> toJson() => {
        "title": title,
        "start": start?.toIso8601String(),
        "end": end?.toIso8601String(),
        "desc": desc,
        "_id": id,
      };
}

class BookingType {
  int? extraGuest;
  int? extraGuestFee;
  int? maximumNight;
  int? minimumNight;

  BookingType({
    this.extraGuest,
    this.extraGuestFee,
    this.maximumNight,
    this.minimumNight,
  });

  factory BookingType.fromJson(Map<String, dynamic> json) => BookingType(
        extraGuest: json["extraGuest"],
        extraGuestFee: json["extraGuestFee"],
        maximumNight: json["maximumNight"],
        minimumNight: json["minimumNight"],
      );

  Map<String, dynamic> toJson() => {
        "extraGuest": extraGuest,
        "extraGuestFee": extraGuestFee,
        "maximumNight": maximumNight,
        "minimumNight": minimumNight,
      };
}

class Pricing {
  int? baseFare;
  int? perDay;
  int? perHour;
  int? discountPercentage;
  num? discountedPrice;

  Pricing({
    this.baseFare,
    this.perDay,
    this.perHour,
    this.discountPercentage,
    this.discountedPrice,
  });

  factory Pricing.fromJson(Map<String, dynamic> json) => Pricing(
    baseFare: json["baseFare"],
    perDay: json["perDay"],
    perHour: json["perHour"],
    discountPercentage: json["discountPercentage"],
    discountedPrice: json["discountedPrice"],
  );

  Map<String, dynamic> toJson() => {
    "baseFare": baseFare,
    "perDay": perDay,
    "perHour": perHour,
    "discountPercentage": discountPercentage,
    "discountedPrice": discountedPrice,
  };
}

class UserData {
  String? id;
  String? firstname;
  bool? instantBooking;

  UserData({
    this.id,
    this.firstname,
    this.instantBooking,
  });

  factory UserData.fromJson(Map<String, dynamic> json) => UserData(
        id: json["_id"],
        firstname: json["firstname"],
        instantBooking: json["instantBooking"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "firstname": firstname,
        "instantBooking": instantBooking,
      };
}

class MultipleCurrency {
  int? exchangeRate;
  String? toCode;
  String? toSymbol;

  MultipleCurrency({
    this.exchangeRate,
    this.toCode,
    this.toSymbol,
  });

  factory MultipleCurrency.fromJson(Map<String, dynamic> json) =>
      MultipleCurrency(
        exchangeRate: json["exchangeRate"],
        toCode: json["toCode"],
        toSymbol: json["toSymbol"],
      );

  Map<String, dynamic> toJson() => {
        "exchangeRate": exchangeRate,
        "toCode": toCode,
        "toSymbol": toSymbol,
      };
}

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation();

  Map<String, dynamic> toJson() => {};
}
