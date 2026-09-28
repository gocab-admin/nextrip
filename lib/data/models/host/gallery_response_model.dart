// To parse this JSON data, do
//
//     final galleryResponseModel = galleryResponseModelFromJson(jsonString);

import 'dart:convert';

GalleryResponseModel galleryResponseModelFromJson(String str) => GalleryResponseModel.fromJson(json.decode(str));

String galleryResponseModelToJson(GalleryResponseModel data) => json.encode(data.toJson());

class GalleryResponseModel {
  bool? status;
  String? message;
  Data? data;
  int? totalCount;
  int? statusCode;

  GalleryResponseModel({
    this.status,
    this.message,
    this.data,
    this.totalCount,
    this.statusCode,
  });

  factory GalleryResponseModel.fromJson(Map<String, dynamic> json) => GalleryResponseModel(
    status: json["status"],
    message: json["message"],
    data: json["data"] == null ? null : Data.fromJson(json["data"]),
    totalCount: json["totalCount"],
    statusCode: json["statusCode"],
  );

  Map<String, dynamic> toJson() => {
    "status": status,
    "message": message,
    "data": data?.toJson(),
    "totalCount": totalCount,
    "statusCode": statusCode,
  };
}

class Data {
  List<GalleryImage>? galleryImage;

  Data({
    this.galleryImage,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    galleryImage: json["galleryImage"] == null ? [] : List<GalleryImage>.from(json["galleryImage"]!.map((x) => GalleryImage.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "galleryImage": galleryImage == null ? [] : List<dynamic>.from(galleryImage!.map((x) => x.toJson())),
  };
}

class GalleryImage {
  String? id;
  String? imageName;
  String? path;
  String? publicId;
  String? description;
  String? collectionName;
  bool? status;
  String? createdBy;
  String? addedBy;
  String? addedAt;
  bool? softdel;
  int? v;

  GalleryImage({
    this.id,
    this.imageName,
    this.path,
    this.publicId,
    this.description,
    this.collectionName,
    this.status,
    this.createdBy,
    this.addedBy,
    this.addedAt,
    this.softdel,
    this.v,
  });

  factory GalleryImage.fromJson(Map<String, dynamic> json) => GalleryImage(
    id: json["_id"],
    imageName: json["imageName"],
    path: json["path"],
    publicId: json["publicId"],
    description: json["description"],
    collectionName: json["collectionName"],
    status: json["status"],
    createdBy: json["createdBy"],
    addedBy: json["addedBy"],
    addedAt: json["addedAt"],
    softdel: json["softdel"],
    v: json["__v"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "imageName": imageName,
    "path": path,
    "publicId": publicId,
    "description": description,
    "collectionName": collectionName,
    "status": status,
    "createdBy": createdBy,
    "addedBy": addedBy,
    "addedAt": addedAt,
    "softdel": softdel,
    "__v": v,
  };
}
