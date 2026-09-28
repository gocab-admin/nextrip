// To parse this JSON data, do
//
//     final socialLoginResponseModel = socialLoginResponseModelFromJson(jsonString);

import 'dart:convert';

SocialLoginResponseModel socialLoginResponseModelFromJson(String str) =>
    SocialLoginResponseModel.fromJson(json.decode(str));

String socialLoginResponseModelToJson(SocialLoginResponseModel data) =>
    json.encode(data.toJson());

class SocialLoginResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  int? userListings;
  Data? data;
  Validation? validation;

  SocialLoginResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.userListings,
    this.data,
    this.validation,
  });

  factory SocialLoginResponseModel.fromJson(Map<String, dynamic> json) =>
      SocialLoginResponseModel(
        message: json["message"],
        statusCode: json["statusCode"],
        status: json["status"],
        userListings: json["userListings"],
        data: Data.fromJson(json["data"]),
        validation: Validation.fromJson(json["validation"]),
      );

  Map<String, dynamic> toJson() => {
    "message": message,
    "statusCode": statusCode,
    "status": status,
    "userListings": userListings,
    "data": data?.toJson(),
    "validation": validation?.toJson(),
  };
}

class Data {
  SocialLogin? socialLogin;

  Data({this.socialLogin});

  factory Data.fromJson(Map<String, dynamic> json) =>
      Data(socialLogin: SocialLogin.fromJson(json["socialLogin"]));

  Map<String, dynamic> toJson() => {"socialLogin": socialLogin?.toJson()};
}

class SocialLogin {
  String? id;
  String? email;
  bool? verifiedEmail;
  String? name;
  String? givenName;
  String? familyName;
  String? picture;
  String? userId;
  bool? verified;
  String? token;

  SocialLogin({
    this.id,
    this.email,
    this.verifiedEmail,
    this.name,
    this.givenName,
    this.familyName,
    this.picture,
    this.userId,
    this.verified,
    this.token,
  });

  factory SocialLogin.fromJson(Map<String, dynamic> json) => SocialLogin(
    id: json["id"],
    email: json["email"],
    verifiedEmail: json["verified_email"],
    name: json["name"],
    givenName: json["given_name"],
    familyName: json["family_name"],
    picture: json["picture"],
    userId: json["userId"],
    verified: json["verified"],
    token: json["token"],
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "email": email,
    "verified_email": verifiedEmail,
    "name": name,
    "given_name": givenName,
    "family_name": familyName,
    "picture": picture,
    "userId": userId,
    "verified": verified,
    "token": token,
  };
}

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation();

  Map<String, dynamic> toJson() => {};
}
