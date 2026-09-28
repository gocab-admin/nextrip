// To parse this JSON data, do
//
//     final todayMenuResponseModel = todayMenuResponseModelFromJson(jsonString);

import 'dart:convert';

TodayMenuResponseModel todayMenuResponseModelFromJson(String str) => TodayMenuResponseModel.fromJson(json.decode(str));

String todayMenuResponseModelToJson(TodayMenuResponseModel data) => json.encode(data.toJson());

class TodayMenuResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  TodayMenuResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory TodayMenuResponseModel.fromJson(Map<String, dynamic> json) => TodayMenuResponseModel(
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
  Reservation? reservation;

  Data({
    this.reservation,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    reservation: json["reservation"] == null ? null : Reservation.fromJson(json["reservation"]),
  );

  Map<String, dynamic> toJson() => {
    "reservation": reservation?.toJson(),
  };
}

class Reservation {
  int? checkingOut;
  int? arrivingSoon;

  Reservation({
    this.checkingOut,
    this.arrivingSoon,
  });

  factory Reservation.fromJson(Map<String, dynamic> json) => Reservation(
    checkingOut: json["checkingOut"],
    arrivingSoon: json["arrivingSoon"],
  );

  Map<String, dynamic> toJson() => {
    "checkingOut": checkingOut,
    "arrivingSoon": arrivingSoon,
  };
}

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation(
  );

  Map<String, dynamic> toJson() => {
  };
}
