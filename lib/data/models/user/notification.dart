// To parse this JSON data, do
//
//     final notificationResponseModel = notificationResponseModelFromJson(jsonString);

import 'dart:convert';

NotificationResponseModel notificationResponseModelFromJson(String str) =>
    NotificationResponseModel.fromJson(json.decode(str));

String notificationResponseModelToJson(NotificationResponseModel data) =>
    json.encode(data.toJson());

class NotificationResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  NotificationResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory NotificationResponseModel.fromJson(Map<String, dynamic> json) =>
      NotificationResponseModel(
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
  int? totalCount;
  List<Notifications>? notifications;

  Data({
    this.totalCount,
    this.notifications,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
        totalCount: json["totalCount"],
        notifications: json["notifications"] == null
            ? []
            : List<Notifications>.from(
                json["notifications"]!.map((x) => Notifications.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "totalCount": totalCount,
        "notifications": notifications == null
            ? []
            : List<dynamic>.from(notifications!.map((x) => x.toJson())),
      };
}

class Notifications {
  String? id;
  String? image;
  String? title;
  String? link;
  String? status;
  String? fromWhom;
  String? userType;
  String? message;
  bool? softdel;
  DateTime? createdAt;
  String? forWhom;
  int? v;

  Notifications({
    this.id,
    this.image,
    this.title,
    this.link,
    this.status,
    this.fromWhom,
    this.userType,
    this.message,
    this.softdel,
    this.createdAt,
    this.forWhom,
    this.v,
  });

  factory Notifications.fromJson(Map<String, dynamic> json) => Notifications(
        id: json["_id"],
        image: json["image"],
        title: json["title"],
        link: json["link"],
        status: json["status"],
        fromWhom: json["fromWhom"],
        userType: json["userType"],
        message: json["message"],
        softdel: json["softdel"],
        createdAt: json["createdAt"] == null
            ? null
            : DateTime.parse(json["createdAt"]),
        forWhom: json["forWhom"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "image": image,
        "title": title,
        "link": link,
        "status": status,
        "fromWhom": fromWhom,
        "userType": userType,
        "message": message,
        "softdel": softdel,
        "createdAt": createdAt?.toIso8601String(),
        "forWhom": forWhom,
      };
}

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation();

  Map<String, dynamic> toJson() => {};
}
