// To parse this JSON data, do
//
//     final getImagesResponseModel = getImagesResponseModelFromJson(jsonString);

import 'dart:convert';

GetImagesResponseModel getImagesResponseModelFromJson(String str) => GetImagesResponseModel.fromJson(json.decode(str));

String getImagesResponseModelToJson(GetImagesResponseModel data) => json.encode(data.toJson());

class GetImagesResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  GetImagesResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory GetImagesResponseModel.fromJson(Map<String, dynamic> json) => GetImagesResponseModel(
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
  ListImg? listImg;

  Data({
    this.listImg,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    listImg: json["listImg"] == null ? null : ListImg.fromJson(json["listImg"]),
  );

  Map<String, dynamic> toJson() => {
    "listImg": listImg?.toJson(),
  };
}

class ListImg {
  Image? image;
  String? id;
  String? listingId;
  int? v;
  List<dynamic>? amenity;
  String? createdAt;
  List<dynamic>? rules;
  String? updatedAt;

  ListImg({
    this.image,
    this.id,
    this.listingId,
    this.v,
    this.amenity,
    this.createdAt,
    this.rules,
    this.updatedAt,
  });

  factory ListImg.fromJson(Map<String, dynamic> json) => ListImg(
    image: json["image"] == null ? null : Image.fromJson(json["image"]),
    id: json["_id"],
    listingId: json["listingId"],
    v: json["__v"],
    amenity: json["amenity"] == null ? [] : List<dynamic>.from(json["amenity"]!.map((x) => x)),
    createdAt: json["createdAt"],
    rules: json["rules"] == null ? [] : List<dynamic>.from(json["rules"]!.map((x) => x)),
    updatedAt: json["updatedAt"],
  );

  Map<String, dynamic> toJson() => {
    "image": image?.toJson(),
    "_id": id,
    "listingId": listingId,
    "__v": v,
    "amenity": amenity == null ? [] : List<dynamic>.from(amenity!.map((x) => x)),
    "createdAt": createdAt,
    "rules": rules == null ? [] : List<dynamic>.from(rules!.map((x) => x)),
    "updatedAt": updatedAt,
  };
}

class Image {
  String? coverImage;
  List<GroupImage>? groupImage;
  String? imageId;
  String? publicId;

  Image({
    this.coverImage,
    this.groupImage,
    this.imageId,
    this.publicId,
  });

  factory Image.fromJson(Map<String, dynamic> json) => Image(
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

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation(
  );

  Map<String, dynamic> toJson() => {
  };
}
