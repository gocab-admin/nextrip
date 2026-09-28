import 'dart:convert';

AmenitiesResponseModel amenitiesResponseModelFromJson(String str) =>
    AmenitiesResponseModel.fromJson(json.decode(str));

String amenitiesResponseModelToJson(AmenitiesResponseModel data) =>
    json.encode(data.toJson());

class AmenitiesResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  AmenitiesResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory AmenitiesResponseModel.fromJson(Map<String, dynamic> json) =>
      AmenitiesResponseModel(
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
  List<Amenity>? amenities;
  int? totalCount;

  Data({
    this.amenities,
    this.totalCount
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
        amenities: json["privilegeItemList"] == null
            ? []
            : List<Amenity>.from(
                json["privilegeItemList"]!.map((x) => Amenity.fromJson(x))),
    totalCount: json["totalCount"],
      );

  Map<String, dynamic> toJson() => {
        "privilegeItemList": amenities == null
            ? []
            : List<dynamic>.from(amenities!.map((x) => x.toJson())),
    "totalCount": totalCount,
      };
}

class Amenity {
  String? id;
  String? privilegeId;
  String? privilegeCategoryId;
  String? name;
  String? description;
  String? icon;
  String? publicId;
  bool? isChecked;

  Amenity({this.id,this.privilegeId,this.privilegeCategoryId, this.name, this.description, this.icon,this.publicId, this.isChecked});

  factory Amenity.fromJson(Map<String, dynamic> json) => Amenity(
      id: json["_id"],
      privilegeId: json["privilegeId"],
      privilegeCategoryId: json["privilegeCategoryId"],
      name: json["name"],
      description: json["description"],
      icon: json["icon"],
      publicId: json["publicId"],
      isChecked: false);

  Map<String, dynamic> toJson() => {
        "_id": id,
    "privilegeId":privilegeId,
    "privilegeCategoryId":privilegeCategoryId,
    "name": name,
        "desc": description,
        "icon": icon,
    "publicId":publicId
      };
}

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation();

  Map<String, dynamic> toJson() => {};
}
