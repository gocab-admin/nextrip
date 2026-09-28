// To parse this JSON data, do
//
//     final rulesIconsResponseModel = rulesIconsResponseModelFromJson(jsonString);

import 'dart:convert';

RulesIconsResponseModel rulesIconsResponseModelFromJson(String str) => RulesIconsResponseModel.fromJson(json.decode(str));

String rulesIconsResponseModelToJson(RulesIconsResponseModel data) => json.encode(data.toJson());

class RulesIconsResponseModel {
  bool? status;
  String? message;
  Data? data;
  Validation? validation;
  int? statusCode;

  RulesIconsResponseModel({
    this.status,
    this.message,
    this.data,
    this.validation,
    this.statusCode,
  });

  factory RulesIconsResponseModel.fromJson(Map<String, dynamic> json) => RulesIconsResponseModel(
    status: json["status"],
    message: json["message"],
    data: json["data"] == null ? null : Data.fromJson(json["data"]),
    validation: json["validation"] == null ? null : Validation.fromJson(json["validation"]),
    statusCode: json["statusCode"],
  );

  Map<String, dynamic> toJson() => {
    "status": status,
    "message": message,
    "data": data?.toJson(),
    "validation": validation?.toJson(),
    "statusCode": statusCode,
  };
}

class Data {
  int? totalCount;
  List<Icon>? icons;

  Data({
    this.totalCount,
    this.icons,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    totalCount: json["totalCount"],
    icons: json["icons"] == null ? [] : List<Icon>.from(json["icons"]!.map((x) => Icon.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "totalCount": totalCount,
    "icons": icons == null ? [] : List<dynamic>.from(icons!.map((x) => x.toJson())),
  };
}

class Icon {
  String? id;
  String? name;
  String? icon;
  String? label;
  String? createdAt;
  int? v;

  Icon({
    this.id,
    this.name,
    this.icon,
    this.label,
    this.createdAt,
    this.v,
  });

  factory Icon.fromJson(Map<String, dynamic> json) => Icon(
    id: json["_id"],
    name: json["name"],
    icon: json["icon"],
    label: json["label"],
    createdAt: json["createdAt"],
    v: json["__v"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "name": name,
    "icon": icon,
    "label": label,
    "createdAt": createdAt,
    "__v": v,
  };
}

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation(
  );

  Map<String, dynamic> toJson() => {
  };
}
