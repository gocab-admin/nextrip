// To parse this JSON data, do
//
//     final sendOtpResponseModel = sendOtpResponseModelFromJson(jsonString);

import 'dart:convert';

SendOtpResponseModel sendOtpResponseModelFromJson(String str) => SendOtpResponseModel.fromJson(json.decode(str));

String sendOtpResponseModelToJson(SendOtpResponseModel data) => json.encode(data.toJson());

class SendOtpResponseModel {
  String message;
  int statusCode;
  bool status;
  Data data;
  Validation validation;

  SendOtpResponseModel({
    required this.message,
    required this.statusCode,
    required this.status,
    required this.data,
    required this.validation,
  });

  factory SendOtpResponseModel.fromJson(Map<String, dynamic> json) => SendOtpResponseModel(
    message: json["message"],
    statusCode: json["statusCode"],
    status: json["status"],
    data: Data.fromJson(json["data"]),
    validation: Validation.fromJson(json["validation"]),
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
  Otp otp;

  Data({
    required this.otp,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    otp: Otp.fromJson(json["otp"]),
  );

  Map<String, dynamic> toJson() => {
    "otp": otp.toJson(),
  };
}

class Otp {
  String id;
  String phoneCode;
  String phoneNumber;
  String userType;
  int v;
  String createdAt;
  String email;
  bool expired;
  String otp;
  String updatedAt;
  bool verified;
  String verifyBy;
  String verifyFrom;

  Otp({
    required this.id,
    required this.phoneCode,
    required this.phoneNumber,
    required this.userType,
    required this.v,
    required this.createdAt,
    required this.email,
    required this.expired,
    required this.otp,
    required this.updatedAt,
    required this.verified,
    required this.verifyBy,
    required this.verifyFrom,
  });

  factory Otp.fromJson(Map<String, dynamic> json) => Otp(
    id: json["_id"],
    phoneCode: json["phoneCode"],
    phoneNumber: json["phoneNumber"],
    userType: json["userType"],
    v: json["__v"],
    createdAt: json["createdAt"],
    email: json["email"],
    expired: json["expired"],
    otp: json["otp"],
    updatedAt: json["updatedAt"],
    verified: json["verified"],
    verifyBy: json["verifyBy"],
    verifyFrom: json["verifyFrom"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "phoneCode": phoneCode,
    "phoneNumber": phoneNumber,
    "userType": userType,
    "__v": v,
    "createdAt": createdAt,
    "email": email,
    "expired": expired,
    "otp": otp,
    "updatedAt": updatedAt,
    "verified": verified,
    "verifyBy": verifyBy,
    "verifyFrom": verifyFrom,
  };
}

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation(
  );

  Map<String, dynamic> toJson() => {
  };
}
