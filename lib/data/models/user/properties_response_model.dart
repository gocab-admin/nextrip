// To parse this JSON data, do
//
//     final propertiesResponseModel = propertiesResponseModelFromJson(jsonString);

import 'dart:convert';

PropertiesResponseModel propertiesResponseModelFromJson(String str) =>
    PropertiesResponseModel.fromJson(json.decode(str));

String propertiesResponseModelToJson(PropertiesResponseModel data) =>
    json.encode(data.toJson());

class PropertiesResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  PropertiesResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory PropertiesResponseModel.fromJson(Map<String, dynamic> json) =>
      PropertiesResponseModel(
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
  List<Property>? properties;

  Data({
    this.properties,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
        properties: json["properties"] == null
            ? []
            : List<Property>.from(
                json["properties"]!.map((x) => Property.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "properties": properties == null
            ? []
            : List<dynamic>.from(properties!.map((x) => x.toJson())),
      };
}

class Property {
  String? id;
  String? property;
  String? icon;
  String? desc;

  Property({
    this.id,
    this.property,
    this.icon,
    this.desc,
  });

  factory Property.fromJson(Map<String, dynamic> json) => Property(
        id: json["_id"],
        property: json["property"],
        icon: json["icon"],
        desc: json["desc"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "property": property,
        "icon": icon,
        "desc": desc,
      };
}

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation();

  Map<String, dynamic> toJson() => {};
}
