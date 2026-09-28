// To parse this JSON data, do
//
//     final cancelPolicyResponseModel = cancelPolicyResponseModelFromJson(jsonString);

import 'dart:convert';

CancelPolicyResponseModel cancelPolicyResponseModelFromJson(String str) => CancelPolicyResponseModel.fromJson(json.decode(str));

String cancelPolicyResponseModelToJson(CancelPolicyResponseModel data) => json.encode(data.toJson());

class CancelPolicyResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  CancelPolicyResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory CancelPolicyResponseModel.fromJson(Map<String, dynamic> json) => CancelPolicyResponseModel(
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
  List<Policy>? policies;

  Data({
    this.policies,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    policies: json["policies"] == null ? [] : List<Policy>.from(json["policies"]!.map((x) => Policy.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "policies": policies == null ? [] : List<dynamic>.from(policies!.map((x) => x.toJson())),
  };
}

class Policy {
  int? id;
  String? title;
  String? desc;

  Policy({
    this.id,
    this.title,
    this.desc,
  });

  factory Policy.fromJson(Map<String, dynamic> json) => Policy(
    id: json["id"],
    title: json["title"],
    desc: json["desc"],
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "title": title,
    "desc": desc,
  };
}

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation(
  );

  Map<String, dynamic> toJson() => {
  };
}
