// To parse this JSON data, do
//
//     final updatePrivilegesResponseModel = updatePrivilegesResponseModelFromJson(jsonString);

import 'dart:convert';

UpdatePrivilegesResponseModel updatePrivilegesResponseModelFromJson(String str) => UpdatePrivilegesResponseModel.fromJson(json.decode(str));

String updatePrivilegesResponseModelToJson(UpdatePrivilegesResponseModel data) => json.encode(data.toJson());

class UpdatePrivilegesResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  UpdatePrivilegesResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory UpdatePrivilegesResponseModel.fromJson(Map<String, dynamic> json) => UpdatePrivilegesResponseModel(
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
  ModuleCategory? moduleCategory;

  Data({
    this.moduleCategory,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    moduleCategory: json["moduleCategory"] == null ? null : ModuleCategory.fromJson(json["moduleCategory"]),
  );

  Map<String, dynamic> toJson() => {
    "moduleCategory": moduleCategory?.toJson(),
  };
}

class ModuleCategory {
  String? id;
  String? moduleId;
  String? moduleType;
  List<String>? privilegeId;
  List<String>? privilegeCategoryId;
  List<String>? privilegeItemId;
  dynamic deletedAt;
  String? createdAt;
  String? updatedAt;
  int? v;

  ModuleCategory({
    this.id,
    this.moduleId,
    this.moduleType,
    this.privilegeId,
    this.privilegeCategoryId,
    this.privilegeItemId,
    this.deletedAt,
    this.createdAt,
    this.updatedAt,
    this.v,
  });

  factory ModuleCategory.fromJson(Map<String, dynamic> json) => ModuleCategory(
    id: json["_id"],
    moduleId: json["moduleId"],
    moduleType: json["moduleType"],
    privilegeId: json["privilegeId"] == null ? [] : List<String>.from(json["privilegeId"]!.map((x) => x)),
    privilegeCategoryId: json["privilegeCategoryId"] == null ? [] : List<String>.from(json["privilegeCategoryId"]!.map((x) => x)),
    privilegeItemId: json["privilegeItemId"] == null ? [] : List<String>.from(json["privilegeItemId"]!.map((x) => x)),
    deletedAt: json["deletedAt"],
    createdAt: json["createdAt"],
    updatedAt: json["updatedAt"],
    v: json["__v"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "moduleId": moduleId,
    "moduleType": moduleType,
    "privilegeId": privilegeId == null ? [] : List<dynamic>.from(privilegeId!.map((x) => x)),
    "privilegeCategoryId": privilegeCategoryId == null ? [] : List<dynamic>.from(privilegeCategoryId!.map((x) => x)),
    "privilegeItemId": privilegeItemId == null ? [] : List<dynamic>.from(privilegeItemId!.map((x) => x)),
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
