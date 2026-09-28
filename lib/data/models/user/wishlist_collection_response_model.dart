// To parse this JSON data, do
//
//     final wishlistCollectionResponseModel = wishlistCollectionResponseModelFromJson(jsonString);

import 'dart:convert';

WishlistCollectionResponseModel wishlistCollectionResponseModelFromJson(
        String str) =>
    WishlistCollectionResponseModel.fromJson(json.decode(str));

String wishlistCollectionResponseModelToJson(
        WishlistCollectionResponseModel data) =>
    json.encode(data.toJson());

class WishlistCollectionResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  WishlistCollectionResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory WishlistCollectionResponseModel.fromJson(Map<String, dynamic> json) =>
      WishlistCollectionResponseModel(
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
  List<WishList>? wishLists;

  Data({
    this.wishLists,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
        wishLists: json["wishLists"] == null
            ? []
            : List<WishList>.from(
                json["wishLists"]!.map((x) => WishList.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "wishLists": wishLists == null
            ? []
            : List<dynamic>.from(wishLists!.map((x) => x.toJson())),
      };
}

class WishList {
  String? id;
  String? collectionName;
  DateTime? createdAt;
  String? listingId;
  Address? address;
  String? categoryName;
  String? listingName;
  String? listingDesc;
  String? status;
  num? rating;
  num? review;
  Price? price;
  Image? image;

  WishList({
    this.id,
    this.collectionName,
    this.createdAt,
    this.listingId,
    this.address,
    this.categoryName,
    this.listingName,
    this.listingDesc,
    this.status,
    this.rating,
    this.review,
    this.price,
    this.image,
  });

  factory WishList.fromJson(Map<String, dynamic> json) => WishList(
        id: json["_id"],
        collectionName: json["collectionName"],
        createdAt: json["createdAt"] == null
            ? null
            : DateTime.parse(json["createdAt"]),
        listingId: json["listingId"],
        address:
            json["address"] == null ? null : Address.fromJson(json["address"]),
        categoryName: json["categoryName"],
        listingName: json["listingName"],
        listingDesc: json["listingDesc"],
        status: json["status"],
        rating: json["rating"],
        review: json["review"],
        price: json["price"] == null ? null : Price.fromJson(json["price"]),
        image: json["image"] == null ? null : Image.fromJson(json["image"]),
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "collectionName": collectionName,
        "createdAt": createdAt?.toIso8601String(),
        "listingId": listingId,
        "address": address?.toJson(),
        "categoryName": categoryName,
        "listingName": listingName,
        "listingDesc": listingDesc,
        "status": status,
        "rating": rating,
        "review": review,
        "price": price?.toJson(),
        "image": image?.toJson(),
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

class Image {
  String? coverImage;
  List<GroupImage>? groupImage;

  Image({
    this.coverImage,
    this.groupImage,
  });

  factory Image.fromJson(Map<String, dynamic> json) => Image(
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

class Price {
  int? baseFare;
  int? perDay;
  int? perHour;
  int? discountPercentage;
  num? discountedPrice;

  Price({
    this.baseFare,
    this.perDay,
    this.perHour,
    this.discountPercentage,
    this.discountedPrice,
  });

  factory Price.fromJson(Map<String, dynamic> json) => Price(
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

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation();

  Map<String, dynamic> toJson() => {};
}
