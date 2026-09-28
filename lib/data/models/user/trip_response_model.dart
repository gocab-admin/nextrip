// To parse this JSON data, do
//
//     final tripResponseModel = tripResponseModelFromJson(jsonString);

import 'dart:convert';

TripResponseModel tripResponseModelFromJson(String str) =>
    TripResponseModel.fromJson(json.decode(str));

String tripResponseModelToJson(TripResponseModel data) =>
    json.encode(data.toJson());

class TripResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  TripResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory TripResponseModel.fromJson(Map<String, dynamic> json) =>
      TripResponseModel(
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
  List<BookingHistory>? bookingHistory;
  List<CancellationPolicy>? cancellationPolicy;

  Data({
    this.totalCount,
    this.bookingHistory,
    this.cancellationPolicy,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
        totalCount: json["totalCount"],
        bookingHistory: json["bookingHistory"] == null
            ? []
            : List<BookingHistory>.from(
                json["bookingHistory"]!.map((x) => BookingHistory.fromJson(x))),
        cancellationPolicy: json["cancellationPolicy"] == null
            ? []
            : List<CancellationPolicy>.from(json["cancellationPolicy"]!
                .map((x) => CancellationPolicy.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "totalCount": totalCount,
        "bookingHistory": bookingHistory == null
            ? []
            : List<dynamic>.from(bookingHistory!.map((x) => x.toJson())),
        "cancellationPolicy": cancellationPolicy == null
            ? []
            : List<dynamic>.from(cancellationPolicy!.map((x) => x.toJson())),
      };
}

class BookingHistory {
  String? id;
  Address? address;
  String? propertyName;
  Bookingdata? bookingdata;
  String? propertyCategoryName;
  String? userFirstname;
  String? userlastname;
  String? userId;
  ListingImages? listingImages;
  int? cancellationPolicyId;
  bool? isReviewed;

  BookingHistory({
    this.id,
    this.address,
    this.propertyName,
    this.bookingdata,
    this.propertyCategoryName,
    this.userFirstname,
    this.userlastname,
    this.userId,
    this.listingImages,
    this.cancellationPolicyId,
    this.isReviewed
  });

  factory BookingHistory.fromJson(Map<String, dynamic> json) => BookingHistory(
        id: json["_id"],
        address:
            json["address"] == null ? null : Address.fromJson(json["address"]),
        propertyName: json["propertyName"],
        bookingdata: json["bookingdata"] == null
            ? null
            : Bookingdata.fromJson(json["bookingdata"]),
        propertyCategoryName: json["propertyCategoryName"],
        userFirstname: json["userFirstname"],
        userlastname: json["userlastname"],
        userId: json["userId"],
        listingImages: json["listingImages"] == null
            ? null
            : ListingImages.fromJson(json["listingImages"]),
        cancellationPolicyId: json["cancellationPolicyId"],
    isReviewed: json["isReviewed"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "address": address?.toJson(),
        "propertyName": propertyName,
        "bookingdata": bookingdata?.toJson(),
        "propertyCategoryName": propertyCategoryName,
        "userFirstname": userFirstname,
        "userlastname": userlastname,
        "userId": userId,
        "listingImages": listingImages?.toJson(),
        "cancellationPolicyId": cancellationPolicyId,
    "isReviewed": isReviewed,
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
            : List<double>.from(json["coordinates"]!.map((x) => x?.toDouble())),
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

class Bookingdata {
  String? id;
  BookedDates? bookedDates;
  BookedHours? bookedHours;
  Cancellation? cancellation;
  int? adults;
  int? children;
  int? pets;
  int? perDay;
  int? perHour;
  String? currency;
  String? currencySymbol;
  DateTime? paidDate;
  double? paidAmount;
  String? paymentMode;
  String? status;
  num? refundAmount;
  String? paymentId;
  double? fareAmount;
  DateTime? createdAt;
  DateTime? confirmedDate;
  int? discountAmount;
  String? discountCode;
  DateTime? checkOutDate;

  Bookingdata({
    this.id,
    this.bookedDates,
    this.bookedHours,
    this.cancellation,
    this.adults,
    this.children,
    this.pets,
    this.perDay,
    this.perHour,
    this.currency,
    this.currencySymbol,
    this.paidDate,
    this.paidAmount,
    this.paymentMode,
    this.status,
    this.refundAmount,
    this.paymentId,
    this.fareAmount,
    this.createdAt,
    this.confirmedDate,
    this.discountAmount,
    this.discountCode,
    this.checkOutDate,
  });

  factory Bookingdata.fromJson(Map<String, dynamic> json) => Bookingdata(
        id: json["_id"],
        bookedDates: json["bookedDates"] == null
            ? null
            : BookedDates.fromJson(json["bookedDates"]),
        bookedHours: json["bookedHours"] == null
            ? null
            : BookedHours.fromJson(json["bookedHours"]),
        cancellation: json["cancellation"] == null
            ? null
            : Cancellation.fromJson(json["cancellation"]),
        adults: json["adults"],
        children: json["children"],
        pets: json["pets"],
        perDay: json["perDay"],
        perHour: json["perHour"],
        currency: json["currency"],
    currencySymbol: json["currencySymbol"],
        paidDate:
            json["paidDate"] == null ? null : DateTime.parse(json["paidDate"]),
        paidAmount: json["paidAmount"]?.toDouble(),
        paymentMode: json["paymentMode"],
        status: json["status"],
        refundAmount: json["refundAmount"],
        paymentId: json["paymentId"],
        fareAmount: json["fareAmount"]?.toDouble(),
        createdAt: json["createdAt"] == null
            ? null
            : DateTime.parse(json["createdAt"]),
        confirmedDate: json["confirmedDate"] == null
            ? null
            : DateTime.parse(json["confirmedDate"]),
        discountAmount: json["discountAmount"],
        discountCode: json["discountCode"],
        checkOutDate: json["checkOutDate"] == null
            ? null
            : DateTime.parse(json["checkOutDate"]),
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "bookedDates": bookedDates?.toJson(),
        "bookedHours": bookedHours?.toJson(),
        "cancellation": cancellation?.toJson(),
        "adults": adults,
        "children": children,
        "pets": pets,
        "perDay": perDay,
        "perHour": perHour,
        "currency": currency,
        "currencySymbol": currencySymbol,
        "paidDate": paidDate?.toIso8601String(),
        "paidAmount": paidAmount,
        "paymentMode": paymentMode,
        "status": status,
        "refundAmount": refundAmount,
        "paymentId": paymentId,
        "fareAmount": fareAmount,
        "createdAt": createdAt?.toIso8601String(),
        "confirmedDate": confirmedDate?.toIso8601String(),
        "discountAmount": discountAmount,
        "discountCode": discountCode,
        "checkOutDate": checkOutDate?.toIso8601String(),
      };
}

class BookedDates {
  DateTime? start;
  DateTime? end;

  BookedDates({
    this.start,
    this.end,
  });

  factory BookedDates.fromJson(Map<String, dynamic> json) => BookedDates(
        start: json["start"] == null ? null : DateTime.parse(json["start"]),
        end: json["end"] == null ? null : DateTime.parse(json["end"]),
      );

  Map<String, dynamic> toJson() => {
        "start": start?.toIso8601String(),
        "end": end?.toIso8601String(),
      };
}

class BookedHours {
  int? nights;
  int? hours;

  BookedHours({
    this.nights,
    this.hours,
  });

  factory BookedHours.fromJson(Map<String, dynamic> json) => BookedHours(
        nights: json["nights"],
        hours: json["hours"],
      );

  Map<String, dynamic> toJson() => {
        "nights": nights,
        "hours": hours,
      };
}

class Cancellation {
  String? reason;
  String? cancledBy;
  DateTime? cancleDate;

  Cancellation({
    this.reason,
    this.cancledBy,
    this.cancleDate,
  });

  factory Cancellation.fromJson(Map<String, dynamic> json) => Cancellation(
        reason: json["Reason"],
        cancledBy: json["cancledBy"],
        cancleDate: json["cancleDate"] == null
            ? null
            : DateTime.parse(json["cancleDate"]),
      );

  Map<String, dynamic> toJson() => {
        "Reason": reason,
        "cancledBy": cancledBy,
        "cancleDate": cancleDate?.toIso8601String(),
      };
}

class ListingImages {
  String? coverImage;
  List<GroupImage>? groupImage;

  ListingImages({
    this.coverImage,
    this.groupImage,
  });

  factory ListingImages.fromJson(Map<String, dynamic> json) => ListingImages(
        coverImage: json["coverImage"],
        groupImage: json["groupImage"] == null
            ? []
            : List<GroupImage>.from(
                json["groupImage"]!.map((x) => GroupImage.fromJson(x))),
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

class CancellationPolicy {
  int? id;
  String? title;
  String? desc;

  CancellationPolicy({
    this.id,
    this.title,
    this.desc,
  });

  factory CancellationPolicy.fromJson(Map<String, dynamic> json) =>
      CancellationPolicy(
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

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation();

  Map<String, dynamic> toJson() => {};
}
