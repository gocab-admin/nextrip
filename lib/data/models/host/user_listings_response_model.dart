// To parse this JSON data, do
//
//     final userListingsResponseModel = userListingsResponseModelFromJson(jsonString);

import 'dart:convert';

UserListingsResponseModel userListingsResponseModelFromJson(String str) => UserListingsResponseModel.fromJson(json.decode(str));

String userListingsResponseModelToJson(UserListingsResponseModel data) => json.encode(data.toJson());

class UserListingsResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  UserListingsResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory UserListingsResponseModel.fromJson(Map<String, dynamic> json) => UserListingsResponseModel(
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
  int? total;
  List<ProviderListing>? providerListings;

  Data({
    this.total,
    this.providerListings,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    total: json["total"],
    providerListings: json["providerListings"] == null ? [] : List<ProviderListing>.from(json["providerListings"]!.map((x) => ProviderListing.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "total": total,
    "providerListings": providerListings == null ? [] : List<dynamic>.from(providerListings!.map((x) => x.toJson())),
  };
}

class ProviderListing {
  String? id;
  String? propertyName;
  String? propertyDesc;
  String? status;
  Address? address;
  bool? availability;
  Accomodation? accomodation;
  String? updatedAt;
  String? progress;
  List<PrivilegeItemDatum>? privilegeItemData;
  String? coverImage;
  String? providerId;
  bool? instantBooking;
  PriceData? priceData;

  ProviderListing({
    this.id,
    this.propertyName,
    this.propertyDesc,
    this.status,
    this.address,
    this.availability,
    this.accomodation,
    this.updatedAt,
    this.progress,
    this.privilegeItemData,
    this.coverImage,
    this.providerId,
    this.instantBooking,
    this.priceData,
  });

  factory ProviderListing.fromJson(Map<String, dynamic> json) => ProviderListing(
    id: json["_id"],
    propertyName: json["propertyName"],
    propertyDesc: json["propertyDesc"],
    status: json["status"],
    address: json["address"] == null ? null : Address.fromJson(json["address"]),
    availability: json["availability"],
    accomodation: json["accomodation"] == null ? null : Accomodation.fromJson(json["accomodation"]),
    updatedAt: json["updatedAt"],
    progress: json["progress"]?.toString(),
    privilegeItemData: json["privilegeItemData"] == null ? [] : List<PrivilegeItemDatum>.from(json["privilegeItemData"]!.map((x) => PrivilegeItemDatum.fromJson(x))),
    coverImage: json["coverImage"],
    providerId: json["providerId"],
    instantBooking: json["instantBooking"],
    priceData: json["priceData"] == null ? null : PriceData.fromJson(json["priceData"]),
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "propertyName": propertyName,
    "propertyDesc": propertyDesc,
    "status": status,
    "address": address?.toJson(),
    "availability": availability,
    "accomodation": accomodation?.toJson(),
    "updatedAt": updatedAt,
    "progress": progress,
    "privilegeItemData": privilegeItemData == null ? [] : List<dynamic>.from(privilegeItemData!.map((x) => x.toJson())),
    "coverImage": coverImage,
    "providerId": providerId,
    "instantBooking": instantBooking,
    "priceData": priceData?.toJson(),
  };
}

class Accomodation {
  int? bedRoomCount;
  List<BedRoomBedtype>? bedRoomBedtype;
  BathRoom? bathRoom;

  Accomodation({
    this.bedRoomCount,
    this.bedRoomBedtype,
    this.bathRoom,
  });

  factory Accomodation.fromJson(Map<String, dynamic> json) => Accomodation(
    bedRoomCount: json["bedRoomCount"],
    bedRoomBedtype: json["bedRoomBedtype"] == null ? [] : List<BedRoomBedtype>.from(json["bedRoomBedtype"]!.map((x) => BedRoomBedtype.fromJson(x))),
    bathRoom: json["bathRoom"] == null ? null : BathRoom.fromJson(json["bathRoom"]),
  );

  Map<String, dynamic> toJson() => {
    "bedRoomCount": bedRoomCount,
    "bedRoomBedtype": bedRoomBedtype == null ? [] : List<dynamic>.from(bedRoomBedtype!.map((x) => x.toJson())),
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

class BedRoomBedtype {
  String? bedRoom;
  String? bedType;
  int? bedCount;
  String? id;

  BedRoomBedtype({
    this.bedRoom,
    this.bedType,
    this.bedCount,
    this.id,
  });

  factory BedRoomBedtype.fromJson(Map<String, dynamic> json) => BedRoomBedtype(
    bedRoom: json["bedRoom"],
    bedType: json["bedType"],
    bedCount: json["bedCount"],
    id: json["_id"],
  );

  Map<String, dynamic> toJson() => {
    "bedRoom": bedRoom,
    "bedType": bedType,
    "bedCount": bedCount,
    "_id": id,
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

class PriceData {
  Pricing? pricing;

  PriceData({
    this.pricing,
  });

  factory PriceData.fromJson(Map<String, dynamic> json) => PriceData(
    pricing: json["pricing"] == null ? null : Pricing.fromJson(json["pricing"]),
  );

  Map<String, dynamic> toJson() => {
    "pricing": pricing?.toJson(),
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

class PrivilegeItemDatum {
  String? id;
  String? privilegeCategoryId;
  String? name;
  String? description;
  String? icon;

  PrivilegeItemDatum({
    this.id,
    this.privilegeCategoryId,
    this.name,
    this.description,
    this.icon,
  });

  factory PrivilegeItemDatum.fromJson(Map<String, dynamic> json) => PrivilegeItemDatum(
    id: json["_id"],
    privilegeCategoryId: json["privilegeCategoryId"],
    name: json["name"],
    description: json["description"],
    icon: json["icon"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "privilegeCategoryId": privilegeCategoryId,
    "name": name,
    "description": description,
    "icon": icon,
  };
}

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation(
  );

  Map<String, dynamic> toJson() => {
  };
}
