// To parse this JSON data, do
//
//     final basicDetailsResponseMoel = basicDetailsResponseMoelFromJson(jsonString);

import 'dart:convert';

BasicDetailsResponseModel basicDetailsResponseMoelFromJson(String str) => BasicDetailsResponseModel.fromJson(json.decode(str));

String basicDetailsResponseMoelToJson(BasicDetailsResponseModel data) => json.encode(data.toJson());

class BasicDetailsResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  BasicDetailsResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory BasicDetailsResponseModel.fromJson(Map<String, dynamic> json) => BasicDetailsResponseModel(
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
  Listing? listing;

  Data({
    this.listing,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    listing: json["listing"] == null ? null : Listing.fromJson(json["listing"]),
  );

  Map<String, dynamic> toJson() => {
    "listing": listing?.toJson(),
  };
}

class Listing {
  Address? address;
  Guest? guest;
  Accomodation? accomodation;
  String? id;
  String? userId;
  String? propertyCategory;
  String? propertyType;
  String? propertyName;
  String? propertyDesc;
  String? status;
  List<num>? location;
  bool? availability;
  num? totalCleanlinessRate;
  num? totalAccuracyRate;
  num? totalCommunicationRate;
  num? totalLocationRate;
  num? totalValueRate;
  num? totalCheckInRate;
  num? totalRatingCount;
  num? totalReviewCount;
  num? cancellationPolicyId;
  bool? softdel;
  List<dynamic>? events;
  List<dynamic>? reviewRating;
  List<dynamic>? schedule;
  List<dynamic>? placesToOffer;
  String? createdAt;
  String? updatedAt;
  int? v;
  String? progress;
  String? listingId;

  Listing({
    this.address,
    this.guest,
    this.accomodation,
    this.id,
    this.userId,
    this.propertyCategory,
    this.propertyType,
    this.propertyName,
    this.propertyDesc,
    this.status,
    this.location,
    this.availability,
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
    this.events,
    this.reviewRating,
    this.schedule,
    this.placesToOffer,
    this.createdAt,
    this.updatedAt,
    this.v,
    this.progress,
    this.listingId,
  });

  factory Listing.fromJson(Map<String, dynamic> json) => Listing(
    address: json["address"] == null ? null : Address.fromJson(json["address"]),
    guest: json["guest"] == null ? null : Guest.fromJson(json["guest"]),
    accomodation: json["accomodation"] == null ? null : Accomodation.fromJson(json["accomodation"]),
    id: json["_id"],
    userId: json["userId"],
    propertyCategory: json["propertyCategory"],
    propertyType: json["propertyType"],
    propertyName: json["propertyName"],
    propertyDesc: json["propertyDesc"],
    status: json["status"],
    location: json["location"] == null ? [] : List<num>.from(json["location"]!.map((x) => x)),
    availability: json["availability"],
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
    events: json["events"] == null ? [] : List<dynamic>.from(json["events"]!.map((x) => x)),
    reviewRating: json["reviewRating"] == null ? [] : List<dynamic>.from(json["reviewRating"]!.map((x) => x)),
    schedule: json["schedule"] == null ? [] : List<dynamic>.from(json["schedule"]!.map((x) => x)),
    placesToOffer: json["placesToOffer"] == null ? [] : List<dynamic>.from(json["placesToOffer"]!.map((x) => x)),
    createdAt: json["createdAt"],
    updatedAt: json["updatedAt"],
    v: json["__v"],
    progress: json["progress"],
    listingId: json["id"],
  );

  Map<String, dynamic> toJson() => {
    "address": address?.toJson(),
    "guest": guest?.toJson(),
    "accomodation": accomodation?.toJson(),
    "_id": id,
    "userId": userId,
    "propertyCategory": propertyCategory,
    "propertyType": propertyType,
    "propertyName": propertyName,
    "propertyDesc": propertyDesc,
    "status": status,
    "location": location == null ? [] : List<dynamic>.from(location!.map((x) => x)),
    "availability": availability,
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
    "events": events == null ? [] : List<dynamic>.from(events!.map((x) => x)),
    "reviewRating": reviewRating == null ? [] : List<dynamic>.from(reviewRating!.map((x) => x)),
    "schedule": schedule == null ? [] : List<dynamic>.from(schedule!.map((x) => x)),
    "placesToOffer": placesToOffer == null ? [] : List<dynamic>.from(placesToOffer!.map((x) => x)),
    "createdAt": createdAt,
    "updatedAt": updatedAt,
    "__v": v,
    "progress": progress,
    "id": listingId,
  };
}

class Accomodation {
  int? bedRoomCount;
  List<dynamic>? bedRoomBedtype;
  BathRoom? bathRoom;

  Accomodation({
    this.bedRoomCount,
    this.bedRoomBedtype,
    this.bathRoom,
  });

  factory Accomodation.fromJson(Map<String, dynamic> json) => Accomodation(
    bedRoomCount: json["bedRoomCount"],
    bedRoomBedtype: json["bedRoomBedtype"] == null ? [] : List<dynamic>.from(json["bedRoomBedtype"]!.map((x) => x)),
    bathRoom: json["bathRoom"] == null ? null : BathRoom.fromJson(json["bathRoom"]),
  );

  Map<String, dynamic> toJson() => {
    "bedRoomCount": bedRoomCount,
    "bedRoomBedtype": bedRoomBedtype == null ? [] : List<dynamic>.from(bedRoomBedtype!.map((x) => x)),
    "bathRoom": bathRoom?.toJson(),
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
