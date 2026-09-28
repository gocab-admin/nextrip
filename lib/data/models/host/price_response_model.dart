// To parse this JSON data, do
//
//     final priceResponseModel = priceResponseModelFromJson(jsonString);

import 'dart:convert';

PriceResponseModel priceResponseModelFromJson(String str) => PriceResponseModel.fromJson(json.decode(str));

String priceResponseModelToJson(PriceResponseModel data) => json.encode(data.toJson());

class PriceResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  PriceResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory PriceResponseModel.fromJson(Map<String, dynamic> json) => PriceResponseModel(
    message: json["message"],
    statusCode: json["statusCode"],
    status: json["status"],
    data: json["data"] == null ? null : Data.fromJson(json["data"]),
    validation: json["validation"] == null ? null : Validation.fromJson(json["validation"]),
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
  ListingPrice? listingPrice;

  Data({
    this.listingPrice,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    listingPrice: json["listingPrice"] == null ? null : ListingPrice.fromJson(json["listingPrice"]),
  );

  Map<String, dynamic> toJson() => {
    "listingPrice": listingPrice?.toJson(),
  };
}

class ListingPrice {
  Pricing? pricing;
  BookingType? bookingType;
  String? id;
  String? listingId;
  int? v;
  int? availableCount;
  List<dynamic>? blockedDates;
  String? createdAt;
  bool? maxNightSelect;
  String? updatedAt;

  ListingPrice({
    this.pricing,
    this.bookingType,
    this.id,
    this.listingId,
    this.v,
    this.availableCount,
    this.blockedDates,
    this.createdAt,
    this.maxNightSelect,
    this.updatedAt,
  });

  factory ListingPrice.fromJson(Map<String, dynamic> json) => ListingPrice(
    pricing: json["pricing"] == null ? null : Pricing.fromJson(json["pricing"]),
    bookingType: json["bookingType"] == null ? null : BookingType.fromJson(json["bookingType"]),
    id: json["_id"],
    listingId: json["listingId"],
    v: json["__v"],
    availableCount: json["availableCount"],
    blockedDates: json["blockedDates"] == null ? [] : List<dynamic>.from(json["blockedDates"]!.map((x) => x)),
    createdAt: json["createdAt"],
    maxNightSelect: json["maxNightSelect"],
    updatedAt: json["updatedAt"],
  );

  Map<String, dynamic> toJson() => {
    "pricing": pricing?.toJson(),
    "bookingType": bookingType?.toJson(),
    "_id": id,
    "listingId": listingId,
    "__v": v,
    "availableCount": availableCount,
    "blockedDates": blockedDates == null ? [] : List<dynamic>.from(blockedDates!.map((x) => x)),
    "createdAt": createdAt,
    "maxNightSelect": maxNightSelect,
    "updatedAt": updatedAt,
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
  int? discountPercentage;
  int? discountedPrice;
  int? perDay;
  int? perHour;

  Pricing({
    this.baseFare,
    this.discountPercentage,
    this.discountedPrice,
    this.perDay,
    this.perHour,
  });

  factory Pricing.fromJson(Map<String, dynamic> json) => Pricing(
    baseFare: json["baseFare"],
    discountPercentage: json["discountPercentage"],
    discountedPrice: json["discountedPrice"],
    perDay: json["perDay"],
    perHour: json["perHour"],
  );

  Map<String, dynamic> toJson() => {
    "baseFare": baseFare,
    "discountPercentage": discountPercentage,
    "discountedPrice": discountedPrice,
    "perDay": perDay,
    "perHour": perHour,
  };
}

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation(
  );

  Map<String, dynamic> toJson() => {
  };
}
