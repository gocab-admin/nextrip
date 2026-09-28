// To parse this JSON data, do
//
//     final privilegesResponseModel = privilegesResponseModelFromJson(jsonString);

import 'dart:convert';

PrivilegesResponseModel privilegesResponseModelFromJson(String str) => PrivilegesResponseModel.fromJson(json.decode(str));

String privilegesResponseModelToJson(PrivilegesResponseModel data) => json.encode(data.toJson());

class PrivilegesResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  PrivilegesResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory PrivilegesResponseModel.fromJson(Map<String, dynamic> json) => PrivilegesResponseModel(
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
  int? totalCount;
  List<PrivilegeList>? privilegeList;

  Data({
    this.totalCount,
    this.privilegeList,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    totalCount: json["totalCount"],
    privilegeList: json["privilegeList"] == null ? [] : List<PrivilegeList>.from(json["privilegeList"]!.map((x) => PrivilegeList.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "totalCount": totalCount,
    "privilegeList": privilegeList == null ? [] : List<dynamic>.from(privilegeList!.map((x) => x.toJson())),
  };
}

class PrivilegeList {
  String? id;
  String? name;
  String? description;
  dynamic deletedAt;
  String? createdAt;
  String? updatedAt;
  int? v;

  PrivilegeList({
    this.id,
    this.name,
    this.description,
    this.deletedAt,
    this.createdAt,
    this.updatedAt,
    this.v,
  });

  factory PrivilegeList.fromJson(Map<String, dynamic> json) => PrivilegeList(
    id: json["_id"],
    name: json["name"],
    description: json["description"],
    deletedAt: json["deletedAt"],
    createdAt: json["createdAt"],
    updatedAt: json["updatedAt"],
    v: json["__v"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "name": name,
    "description": description,
    "deletedAt": deletedAt,
    "createdAt": createdAt,
    "updatedAt": updatedAt,
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
