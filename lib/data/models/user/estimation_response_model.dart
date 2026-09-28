// To parse this JSON data, do
//
//     final estimationResponseModel = estimationResponseModelFromJson(jsonString);

import 'dart:convert';

EstimationResponseModel estimationResponseModelFromJson(String str) =>
    EstimationResponseModel.fromJson(json.decode(str));

String estimationResponseModelToJson(EstimationResponseModel data) =>
    json.encode(data.toJson());

class EstimationResponseModel {
  String? message;
  num? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  EstimationResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory EstimationResponseModel.fromJson(Map<String, dynamic> json) =>
      EstimationResponseModel(
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
  MultipleCurrency? multipleCurrency;
  Estimation? estimation;

  Data({
    this.multipleCurrency,
    this.estimation,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
        multipleCurrency: json["multipleCurrency"] == null
            ? null
            : MultipleCurrency.fromJson(json["multipleCurrency"]),
        estimation: json["estimation"] == null
            ? null
            : Estimation.fromJson(json["estimation"]),
      );

  Map<String, dynamic> toJson() => {
        "multipleCurrency": multipleCurrency?.toJson(),
        "estimation": estimation?.toJson(),
      };
}

class Estimation {
  String? listingId;
  String? bookingType;
  num? nights;
  num? hours;
  DateTime? startDate;
  DateTime? endDate;
  String? adult;
  String? children;
  num? extraGuestCount;
  num? extraGuestAmount;
  String? pets;
  num? perHour;
  num? perDay;
  num? dayFare;
  num? hourFare;
  int? discountPercentage;
  num? discountedPrice;
  num? totalAmountBeforeTax;
  num? taxAmount;
  num? taxPercentage;
  num? commissionAmount;
  num? commissionPercentage;
  num? fareAmount;
  dynamic discountData;

  Estimation({
    this.listingId,
    this.bookingType,
    this.nights,
    this.hours,
    this.startDate,
    this.endDate,
    this.adult,
    this.children,
    this.extraGuestCount,
    this.extraGuestAmount,
    this.pets,
    this.perHour,
    this.perDay,
    this.dayFare,
    this.hourFare,
    this.discountPercentage,
    this.discountedPrice,
    this.totalAmountBeforeTax,
    this.taxAmount,
    this.taxPercentage,
    this.commissionAmount,
    this.commissionPercentage,
    this.fareAmount,
    this.discountData,
  });

  factory Estimation.fromJson(Map<String, dynamic> json) => Estimation(
        listingId: json["listingId"],
        bookingType: json["bookingType"],
        nights: json["nights"],
        hours: json["hours"],
        startDate: json["startDate"] == null
            ? null
            : DateTime.parse(json["startDate"]),
        endDate:
            json["endDate"] == null ? null : DateTime.parse(json["endDate"]),
        adult: json["Adult"],
        children: json["Children"],
        extraGuestCount: json["extraGuestCount"],
        extraGuestAmount: json["extraGuestAmount"],
        pets: json["Pets"],
        perHour: json["perHour"],
        perDay: json["perDay"],
        dayFare: json["dayFare"],
        hourFare: json["hourFare"],
        discountPercentage: json["discountPercentage"],
        discountedPrice: json["discountedPrice"],
        totalAmountBeforeTax: json["totalAmountBeforeTax"],
        taxAmount: json["taxAmount"],
        taxPercentage: json["taxPercentage"],
        commissionAmount: json["commissionAmount"],
        commissionPercentage: json["commissionPercentage"],
        fareAmount: json["fareAmount"],
        discountData: json["discountData"],
      );

  Map<String, dynamic> toJson() => {
        "listingId": listingId,
        "bookingType": bookingType,
        "nights": nights,
        "hours": hours,
        "startDate": startDate?.toIso8601String(),
        "endDate": endDate?.toIso8601String(),
        "Adult": adult,
        "Children": children,
        "extraGuestCount": extraGuestCount,
        "extraGuestAmount": extraGuestAmount,
        "Pets": pets,
        "perHour": perHour,
        "perDay": perDay,
        "dayFare": dayFare,
        "hourFare": hourFare,
        "discountPercentage": discountPercentage,
        "discountedPrice": discountedPrice,
        "totalAmountBeforeTax": totalAmountBeforeTax,
        "taxAmount": taxAmount,
        "taxPercentage": taxPercentage,
        "commissionAmount": commissionAmount,
        "commissionPercentage": commissionPercentage,
        "fareAmount": fareAmount,
        "discountData": discountData,
      };
}

class MultipleCurrency {
  num? exchangeRate;
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
