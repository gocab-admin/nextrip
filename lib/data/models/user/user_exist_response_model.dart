// To parse this JSON data, do
//
//     final userExistResponseModel = userExistResponseModelFromJson(jsonString);

import 'dart:convert';

UserExistResponseModel userExistResponseModelFromJson(String str) => UserExistResponseModel.fromJson(json.decode(str));

String userExistResponseModelToJson(UserExistResponseModel data) => json.encode(data.toJson());

class UserExistResponseModel {
  String message;
  int statusCode;
  bool status;
  Data data;
  Data validation;

  UserExistResponseModel({
    required this.message,
    required this.statusCode,
    required this.status,
    required this.data,
    required this.validation,
  });

  factory UserExistResponseModel.fromJson(Map<String, dynamic> json) => UserExistResponseModel(
    message: json["message"],
    statusCode: json["statusCode"],
    status: json["status"],
    data: Data.fromJson(json["data"]),
    validation: Data.fromJson(json["validation"]),
  );

  Map<String, dynamic> toJson() => {
    "message": message,
    "statusCode": statusCode,
    "status": status,
    "data": data.toJson(),
    "validation": validation.toJson(),
  };
}

class Data {
  Data();

  factory Data.fromJson(Map<String, dynamic> json) => Data(
  );

  Map<String, dynamic> toJson() => {
  };
}
