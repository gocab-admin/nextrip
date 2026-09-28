// To parse this JSON data, do
//
//     final addInfoResponseModel = addInfoResponseModelFromJson(jsonString);

import 'dart:convert';

AddInfoResponseModel addInfoResponseModelFromJson(String str) => AddInfoResponseModel.fromJson(json.decode(str));

String addInfoResponseModelToJson(AddInfoResponseModel data) => json.encode(data.toJson());

class AddInfoResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  AddInfoResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory AddInfoResponseModel.fromJson(Map<String, dynamic> json) => AddInfoResponseModel(
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
  InfoListing? listing;

  Data({
    this.listing,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    listing: json["listing"] == null ? null : InfoListing.fromJson(json["listing"]),
  );

  Map<String, dynamic> toJson() => {
    "listing": listing?.toJson(),
  };
}

class InfoListing {
  String? userId;
  dynamic propertyCategory;
  dynamic propertyType;
  String? propertyName;
  String? propertyDesc;
  String? status;
  Address? address;
  List<num>? location;
  Guest? guest;
  bool? availability;
  Accomodation? accomodation;
  int? totalCleanlinessRate;
  int? totalAccuracyRate;
  int? totalCommunicationRate;
  int? totalLocationRate;
  int? totalValueRate;
  int? totalCheckInRate;
  int? totalRatingCount;
  int? totalReviewCount;
  int? cancellationPolicyId;
  bool? softdel;
  String? id;
  List<dynamic>? events;
  List<dynamic>? reviewRating;
  List<dynamic>? schedule;
  List<dynamic>? placesToOffer;
  String? createdAt;
  String? updatedAt;
  int? v;
  String? listingId;

  InfoListing({
    this.userId,
    this.propertyCategory,
    this.propertyType,
    this.propertyName,
    this.propertyDesc,
    this.status,
    this.address,
    this.location,
    this.guest,
    this.availability,
    this.accomodation,
    this.totalCleanlinessRate,
    this.totalAccuracyRate,
    this.totalCommunicationRate,
    this.totalLocationRate,
    this.totalValueRate,
    this.totalCheckInRate,
    this.totalRatingCount,
    this.totalReviewCount,
    this.cancellationPolicyId,
    this.softdel,
    this.id,
    this.events,
    this.reviewRating,
    this.schedule,
    this.placesToOffer,
    this.createdAt,
    this.updatedAt,
    this.v,
    this.listingId,
  });

  factory InfoListing.fromJson(Map<String, dynamic> json) => InfoListing(
    userId: json["userId"],
    propertyCategory: json["propertyCategory"],
    propertyType: json["propertyType"],
    propertyName: json["propertyName"],
    propertyDesc: json["propertyDesc"],
    status: json["status"],
    address: json["address"] == null ? null : Address.fromJson(json["address"]),
    location: json["location"] == null ? [] : List<num>.from(json["location"]!.map((x) => x)),
    guest: json["guest"] == null ? null : Guest.fromJson(json["guest"]),
    availability: json["availability"],
    accomodation: json["accomodation"] == null ? null : Accomodation.fromJson(json["accomodation"]),
    totalCleanlinessRate: json["totalCleanlinessRate"],
    totalAccuracyRate: json["totalAccuracyRate"],
    totalCommunicationRate: json["totalCommunicationRate"],
    totalLocationRate: json["totalLocationRate"],
    totalValueRate: json["totalValueRate"],
    totalCheckInRate: json["totalCheckInRate"],
    totalRatingCount: json["totalRatingCount"],
    totalReviewCount: json["totalReviewCount"],
    cancellationPolicyId: json["cancellationPolicyId"],
    softdel: json["softdel"],
    id: json["_id"],
    events: json["events"] == null ? [] : List<dynamic>.from(json["events"]!.map((x) => x)),
    reviewRating: json["reviewRating"] == null ? [] : List<dynamic>.from(json["reviewRating"]!.map((x) => x)),
    schedule: json["schedule"] == null ? [] : List<dynamic>.from(json["schedule"]!.map((x) => x)),
    placesToOffer: json["placesToOffer"] == null ? [] : List<dynamic>.from(json["placesToOffer"]!.map((x) => x)),
    createdAt: json["createdAt"],
    updatedAt: json["updatedAt"],
    v: json["__v"],
    listingId: json["id"],
  );

  Map<String, dynamic> toJson() => {
    "userId": userId,
    "propertyCategory": propertyCategory,
    "propertyType": propertyType,
    "propertyName": propertyName,
    "propertyDesc": propertyDesc,
    "status": status,
    "address": address?.toJson(),
    "location": location == null ? [] : List<dynamic>.from(location!.map((x) => x)),
    "guest": guest?.toJson(),
    "availability": availability,
    "accomodation": accomodation?.toJson(),
    "totalCleanlinessRate": totalCleanlinessRate,
    "totalAccuracyRate": totalAccuracyRate,
    "totalCommunicationRate": totalCommunicationRate,
    "totalLocationRate": totalLocationRate,
    "totalValueRate": totalValueRate,
    "totalCheckInRate": totalCheckInRate,
    "totalRatingCount": totalRatingCount,
    "totalReviewCount": totalReviewCount,
    "cancellationPolicyId": cancellationPolicyId,
    "softdel": softdel,
    "_id": id,
    "events": events == null ? [] : List<dynamic>.from(events!.map((x) => x)),
    "reviewRating": reviewRating == null ? [] : List<dynamic>.from(reviewRating!.map((x) => x)),
    "schedule": schedule == null ? [] : List<dynamic>.from(schedule!.map((x) => x)),
    "placesToOffer": placesToOffer == null ? [] : List<dynamic>.from(placesToOffer!.map((x) => x)),
    "createdAt": createdAt,
    "updatedAt": updatedAt,
    "__v": v,
    "id": listingId,
  };
}

class Accomodation {
  BathRoom? bathRoom;
  int? bedRoomCount;
  List<dynamic>? bedRoomBedtype;

  Accomodation({
    this.bathRoom,
    this.bedRoomCount,
    this.bedRoomBedtype,
  });

  factory Accomodation.fromJson(Map<String, dynamic> json) => Accomodation(
    bathRoom: json["bathRoom"] == null ? null : BathRoom.fromJson(json["bathRoom"]),
    bedRoomCount: json["bedRoomCount"],
    bedRoomBedtype: json["bedRoomBedtype"] == null ? [] : List<dynamic>.from(json["bedRoomBedtype"]!.map((x) => x)),
  );

  Map<String, dynamic> toJson() => {
    "bathRoom": bathRoom?.toJson(),
    "bedRoomCount": bedRoomCount,
    "bedRoomBedtype": bedRoomBedtype == null ? [] : List<dynamic>.from(bedRoomBedtype!.map((x) => x)),
  };
}

class BathRoom {
  int? bathRoomCount;
  bool? shared;

  BathRoom({
    this.bathRoomCount,
    this.shared,
  });

  factory BathRoom.fromJson(Map<String, dynamic> json) => BathRoom(
    bathRoomCount: json["bathRoomCount"],
    shared: json["shared"],
  );

  Map<String, dynamic> toJson() => {
    "bathRoomCount": bathRoomCount,
    "shared": shared,
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
  List<num>? coordinates;

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
    coordinates: json["coordinates"] == null ? [] : List<num>.from(json["coordinates"]!.map((x) => x)),
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

class Guest {
  int? adult;
  int? children;
  int? pets;

  Guest({
    this.adult,
    this.children,
    this.pets,
  });

  factory Guest.fromJson(Map<String, dynamic> json) => Guest(
    adult: json["adult"],
    children: json["children"],
    pets: json["pets"],
  );

  Map<String, dynamic> toJson() => {
    "adult": adult,
    "children": children,
    "pets": pets,
  };
}

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation(
  );

  Map<String, dynamic> toJson() => {
  };
}
