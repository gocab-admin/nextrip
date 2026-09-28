// To parse this JSON data, do
//
//     final wishlistResponseModel = wishlistResponseModelFromJson(jsonString);

import 'dart:convert';

WishlistResponseModel wishlistResponseModelFromJson(String str) =>
    WishlistResponseModel.fromJson(json.decode(str));

String wishlistResponseModelToJson(WishlistResponseModel data) =>
    json.encode(data.toJson());

class WishlistResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  WishlistResponseModelData? data;
  Validation? validation;

  WishlistResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory WishlistResponseModel.fromJson(Map<String, dynamic> json) =>
      WishlistResponseModel(
        message: json["message"],
        statusCode: json["statusCode"],
        status: json["status"],
        data: json["data"] == null
            ? null
            : WishlistResponseModelData.fromJson(json["data"]),
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

class WishlistResponseModelData {
  List<WishList>? wishLists;

  WishlistResponseModelData({
    this.wishLists,
  });

  factory WishlistResponseModelData.fromJson(Map<String, dynamic> json) =>
      WishlistResponseModelData(
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
  WishListData? data;
  num? collectionDataCount;

  WishList({this.id, this.data, this.collectionDataCount});

  factory WishList.fromJson(Map<String, dynamic> json) => WishList(
      id: json["_id"],
      data: json["data"] == null ? null : WishListData.fromJson(json["data"]),
      collectionDataCount: json['collectionDataCount']);

  Map<String, dynamic> toJson() => {
        "_id": id,
        "data": data?.toJson(),
        "collectionDataCount": collectionDataCount
      };
}

class WishListData {
  String? img;
  String? collectionName;

  WishListData({
    this.img,
    this.collectionName,
  });

  factory WishListData.fromJson(Map<String, dynamic> json) => WishListData(
        img: json["img"],
        collectionName: json["collectionName"],
      );

  Map<String, dynamic> toJson() => {
        "img": img,
        "collectionName": collectionName,
      };
}

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation();

  Map<String, dynamic> toJson() => {};
}
