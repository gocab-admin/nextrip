// To parse this JSON data, do
//
//     final hostReserveResponseModel = hostReserveResponseModelFromJson(jsonString);

import 'dart:convert';

HostReserveResponseModel hostReserveResponseModelFromJson(String str) => HostReserveResponseModel.fromJson(json.decode(str));

String hostReserveResponseModelToJson(HostReserveResponseModel data) => json.encode(data.toJson());

class HostReserveResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  HostReserveResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory HostReserveResponseModel.fromJson(Map<String, dynamic> json) => HostReserveResponseModel(
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
  int? totalCount;
  List<BookingHistory>? bookingHistory;
  List<BookingHistory>? bookingApprovalHistory;
  List<CancellationPolicy>? cancellationPolicy;

  Data({
    this.totalCount,
    this.bookingHistory,
    this.bookingApprovalHistory,
    this.cancellationPolicy,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    totalCount: json["totalCount"],
    bookingHistory: json["bookingHistory"] == null ? [] : List<BookingHistory>.from(json["bookingHistory"]!.map((x) => BookingHistory.fromJson(x))),
    bookingApprovalHistory: json["bookingApprovalHistory"] == null
        ? []
        : List<BookingHistory>.from(json["bookingApprovalHistory"]!
        .map((x) => BookingHistory.fromJson(x))),
    cancellationPolicy: json["cancellationPolicy"] == null ? [] : List<CancellationPolicy>.from(json["cancellationPolicy"]!.map((x) => CancellationPolicy.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "totalCount": totalCount,
    "bookingHistory": bookingHistory == null ? [] : List<dynamic>.from(bookingHistory!.map((x) => x.toJson())),
    "bookingApprovalHistory": bookingApprovalHistory == null
        ? []
        : List<dynamic>.from(
        bookingApprovalHistory!.map((x) => x.toJson())),
    "cancellationPolicy": cancellationPolicy == null ? [] : List<dynamic>.from(cancellationPolicy!.map((x) => x.toJson())),
  };

  List<BookingHistory> get allBookingHistory {
    if (bookingApprovalHistory != null && bookingApprovalHistory!.isNotEmpty) {
      return bookingApprovalHistory!;
    }
    return bookingHistory ?? [];
  }
}

class BookingHistory {
  String? id;
  String? propertyName;
  Address? address;
  Bookingdata? bookingdata;
  String? propertyCategoryName;
  String? userFirstname;
  String? userlastname;
  String? userFullName;
  String? userPhoneCode;
  String? userPhoneNumber;
  String? userEmail;
  String? providerFullName;
  String? providerPhoneCode;
  String? providerPhoneNumber;
  String? providerEmail;
  String? userId;
  ListingImages? listingImages;

  BookingHistory({
    this.id,
    this.propertyName,
    this.address,
    this.bookingdata,
    this.propertyCategoryName,
    this.userFirstname,
    this.userlastname,
    this.userFullName,
    this.userPhoneCode,
    this.userPhoneNumber,
    this.userEmail,
    this.providerFullName,
    this.providerPhoneCode,
    this.providerPhoneNumber,
    this.providerEmail,
    this.userId,
    this.listingImages,
  });

  factory BookingHistory.fromJson(Map<String, dynamic> json) => BookingHistory(
    id: json["_id"],
    propertyName: json["propertyName"],
    address: json["address"] == null ? null : Address.fromJson(json["address"]),
    bookingdata: json["bookingdata"] == null ? null : Bookingdata.fromJson(json["bookingdata"]),
    propertyCategoryName: json["propertyCategoryName"],
    userFirstname: json["userFirstname"],
    userlastname: json["userlastname"],
    userFullName: json["userFullName"],
    userPhoneCode: json["userPhoneCode"],
    userPhoneNumber: json["userPhoneNumber"],
    userEmail: json["userEmail"],
    providerFullName: json["providerFullName"],
    providerPhoneCode: json["providerPhoneCode"],
    providerPhoneNumber: json["providerPhoneNumber"],
    providerEmail: json["providerEmail"],
    userId: json["userId"],
    listingImages: json["listingImages"] == null ? null : ListingImages.fromJson(json["listingImages"]),
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "propertyName": propertyName,
    "address": address?.toJson(),
    "bookingdata": bookingdata?.toJson(),
    "propertyCategoryName": propertyCategoryName,
    "userFirstname": userFirstname,
    "userlastname": userlastname,
    "userFullName": userFullName,
    "userPhoneCode": userPhoneCode,
    "userPhoneNumber": userPhoneNumber,
    "userEmail": userEmail,
    "providerFullName": providerFullName,
    "providerPhoneCode": providerPhoneCode,
    "providerPhoneNumber": providerPhoneNumber,
    "providerEmail": providerEmail,
    "userId": userId,
    "listingImages": listingImages?.toJson(),
  };
}

class Address {
  String? city;
  String? state;
  String? country;
  String? zipcode;
  String? address;
  String? landmark;
  String? location;
  List<double>? coordinates;

  Address({
    this.city,
    this.state,
    this.country,
    this.zipcode,
    this.address,
    this.landmark,
    this.location,
    this.coordinates,
  });

  factory Address.fromJson(Map<String, dynamic> json) => Address(
    city: json["city"],
    state: json["state"],
    country: json["country"],
    zipcode: json["zipcode"],
    address: json["address"],
    landmark: json["landmark"],
    location: json["location"],
    coordinates: json["coordinates"] == null ? [] : List<double>.from(json["coordinates"]!.map((x) => x?.toDouble())),
  );

  Map<String, dynamic> toJson() => {
    "city": city,
    "state": state,
    "country": country,
    "zipcode": zipcode,
    "address": address,
    "landmark": landmark,
    "location": location,
    "coordinates": coordinates == null ? [] : List<dynamic>.from(coordinates!.map((x) => x)),
  };
}

class Bookingdata {
  String? id;
  int? adults;
  int? children;
  int? pets;
  BookedDates? bookedDates;
  BookedHours? bookedHours;
  int? perDay;
  int? perHour;
  String? currency;
  String? currencySymbol;
  String? paidDate;
  int? paidAmount;
  int? hostAmount;
  String? paymentMode;
  String? paymentMethod;
  String? status;
  int? cancellationPolicyId;
  Cancellation? cancellation;
  int? refundAmount;
  String? paymentId;
  int? fareAmount;
  int? commission;
  int? tax;
  int? discountAmount;
  String? discountCode;
  String? createdAt;
  int? bookingNo;
  String? confirmedDate;

  Bookingdata({
    this.id,
    this.adults,
    this.children,
    this.pets,
    this.bookedDates,
    this.bookedHours,
    this.perDay,
    this.perHour,
    this.currency,
    this.currencySymbol,
    this.paidDate,
    this.paidAmount,
    this.hostAmount,
    this.paymentMode,
    this.paymentMethod,
    this.status,
    this.cancellationPolicyId,
    this.cancellation,
    this.refundAmount,
    this.paymentId,
    this.fareAmount,
    this.commission,
    this.tax,
    this.discountAmount,
    this.discountCode,
    this.createdAt,
    this.bookingNo,
    this.confirmedDate,
  });

  factory Bookingdata.fromJson(Map<String, dynamic> json) => Bookingdata(
    id: json["_id"],
    adults: json["adults"],
    children: json["children"],
    pets: json["pets"],
    bookedDates: json["bookedDates"] == null ? null : BookedDates.fromJson(json["bookedDates"]),
    bookedHours: json["bookedHours"] == null ? null : BookedHours.fromJson(json["bookedHours"]),
    perDay: json["perDay"],
    perHour: json["perHour"],
    currency: json["currency"],
    currencySymbol: json["currencySymbol"],
    paidDate: json["paidDate"],
    paidAmount: json["paidAmount"],
    hostAmount: json["hostAmount"],
    paymentMode: json["paymentMode"],
    paymentMethod: json["paymentMethod"],
    status: json["status"],
    cancellationPolicyId: json["cancellationPolicyId"],
    cancellation: json["cancellation"] == null ? null : Cancellation.fromJson(json["cancellation"]),
    refundAmount: json["refundAmount"],
    paymentId: json["paymentId"],
    fareAmount: json["fareAmount"],
    commission: json["commission"],
    tax: json["tax"],
    discountAmount: json["discountAmount"],
    discountCode: json["discountCode"],
    createdAt: json["createdAt"],
    bookingNo: json["bookingNo"],
    confirmedDate: json["confirmedDate"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "adults": adults,
    "children": children,
    "pets": pets,
    "bookedDates": bookedDates?.toJson(),
    "bookedHours": bookedHours?.toJson(),
    "perDay": perDay,
    "perHour": perHour,
    "currency": currency,
    "currencySymbol": currencySymbol,
    "paidDate": paidDate,
    "paidAmount": paidAmount,
    "hostAmount": hostAmount,
    "paymentMode": paymentMode,
    "paymentMethod": paymentMethod,
    "status": status,
    "cancellationPolicyId": cancellationPolicyId,
    "cancellation": cancellation?.toJson(),
    "refundAmount": refundAmount,
    "paymentId": paymentId,
    "fareAmount": fareAmount,
    "commission": commission,
    "tax": tax,
    "discountAmount": discountAmount,
    "discountCode": discountCode,
    "createdAt": createdAt,
    "bookingNo": bookingNo,
    "confirmedDate": confirmedDate,
  };
}

class BookedDates {
  String? start;
  String? end;

  BookedDates({
    this.start,
    this.end,
  });

  factory BookedDates.fromJson(Map<String, dynamic> json) => BookedDates(
    start: json["start"],
    end: json["end"],
  );

  Map<String, dynamic> toJson() => {
    "start": start,
    "end": end,
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
  String? cancleDate;

  Cancellation({
    this.reason,
    this.cancledBy,
    this.cancleDate,
  });

  factory Cancellation.fromJson(Map<String, dynamic> json) => Cancellation(
    reason: json["Reason"],
    cancledBy: json["cancledBy"],
    cancleDate: json["cancleDate"],
  );

  Map<String, dynamic> toJson() => {
    "Reason": reason,
    "cancledBy": cancledBy,
    "cancleDate": cancleDate,
  };
}

class ListingImages {
  String? coverImage;
  List<GroupImage>? groupImage;
  String? imageId;
  String? publicId;

  ListingImages({
    this.coverImage,
    this.groupImage,
    this.imageId,
    this.publicId,
  });

  factory ListingImages.fromJson(Map<String, dynamic> json) => ListingImages(
    coverImage: json["coverImage"],
    groupImage: json["groupImage"] == null ? [] : List<GroupImage>.from(json["groupImage"]!.map((x) => GroupImage.fromJson(x))),
    imageId: json["imageId"],
    publicId: json["publicId"],
  );

  Map<String, dynamic> toJson() => {
    "coverImage": coverImage,
    "groupImage": groupImage == null ? [] : List<dynamic>.from(groupImage!.map((x) => x.toJson())),
    "imageId": imageId,
    "publicId": publicId,
  };
}

class GroupImage {
  String? imagePath;
  String? groupImageId;
  String? publicId;
  String? id;

  GroupImage({
    this.imagePath,
    this.groupImageId,
    this.publicId,
    this.id,
  });

  factory GroupImage.fromJson(Map<String, dynamic> json) => GroupImage(
    imagePath: json["imagePath"],
    groupImageId: json["groupImageId"],
    publicId: json["publicId"],
    id: json["_id"],
  );

  Map<String, dynamic> toJson() => {
    "imagePath": imagePath,
    "groupImageId": groupImageId,
    "publicId": publicId,
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

  factory CancellationPolicy.fromJson(Map<String, dynamic> json) => CancellationPolicy(
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

  factory Validation.fromJson(Map<String, dynamic> json) => Validation(
  );

  Map<String, dynamic> toJson() => {
  };
}
