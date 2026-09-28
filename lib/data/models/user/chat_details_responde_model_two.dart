// To parse this JSON data, do
//
//     final chatDetailsResponseModel2 = chatDetailsResponseModel2FromJson(jsonString);

import 'dart:convert';

import 'package:airstar_flutter/data/models/user/chat_details_response_model.dart';

InboxChatDetailsResponseModel2 chatDetailsResponseModel2FromJson(String str) => InboxChatDetailsResponseModel2.fromJson(json.decode(str));

String chatDetailsResponseModel2ToJson(InboxChatDetailsResponseModel2 data) => json.encode(data.toJson());

class InboxChatDetailsResponseModel2 {
  bool? status;
  String? message;
  List<Datum>? data;
  List<ListingDetail>? listingDetails;
  List<UserDatum>? userData;
  Validation? validation;
  int? statusCode;

  InboxChatDetailsResponseModel2({
    this.status,
    this.message,
    this.data,
    this.listingDetails,
    this.userData,
    this.validation,
    this.statusCode,
  });

  factory InboxChatDetailsResponseModel2.fromJson(Map<String, dynamic> json) => InboxChatDetailsResponseModel2(
    status: json["status"],
    message: json["message"],
    data: json["data"] == null ? [] : List<Datum>.from(json["data"]!.map((x) => Datum.fromJson(x))),
    listingDetails: json["listingDetails"] == null ? [] : List<ListingDetail>.from(json["listingDetails"]!.map((x) => ListingDetail.fromJson(x))),
    userData: json["userData"] == null ? [] : List<UserDatum>.from(json["userData"]!.map((x) => UserDatum.fromJson(x))),
    validation: json["validation"] == null ? null : Validation.fromJson(json["validation"]),
    statusCode: json["statusCode"],
  );

  Map<String, dynamic> toJson() => {
    "status": status,
    "message": message,
    "data": data == null ? [] : List<dynamic>.from(data!.map((x) => x.toJson())),
    "listingDetails": listingDetails == null ? [] : List<dynamic>.from(listingDetails!.map((x) => x.toJson())),
    "userData": userData == null ? [] : List<dynamic>.from(userData!.map((x) => x.toJson())),
    "validation": validation?.toJson(),
    "statusCode": statusCode,
  };
}

class Datum {
  String? id;
  List<Message>? message;

  Datum({
    this.id,
    this.message,
  });

  factory Datum.fromJson(Map<String, dynamic> json) => Datum(
    id: json["_id"],
    message: json["message"] == null ? [] : List<Message>.from(json["message"]!.map((x) => Message.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "message": message == null ? [] : List<dynamic>.from(message!.map((x) => x.toJson())),
  };
}

enum Status {
  SEEN
}

final statusValues = EnumValues({
  "seen": Status.SEEN
});

enum Type {
  TEXT
}

final typeValues = EnumValues({
  "text": Type.TEXT
});

class ListingDetail {
  String? id;
  String? listingId;
  String? listingName;
  String? listingCategoryName;
  ListingImages? listingImages;

  ListingDetail({
    this.id,
    this.listingId,
    this.listingName,
    this.listingCategoryName,
    this.listingImages,
  });

  factory ListingDetail.fromJson(Map<String, dynamic> json) => ListingDetail(
    id: json["_id"],
    listingId: json["listingId"],
    listingName: json["listingName"],
    listingCategoryName: json["listingCategoryName"],
    listingImages: json["listingImages"] == null ? null : ListingImages.fromJson(json["listingImages"]),
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "listingId": listingId,
    "listingName": listingName,
    "listingCategoryName": listingCategoryName,
    "listingImages": listingImages?.toJson(),
  };
}

class ListingImages {
  String? coverImage;
  List<GroupImage>? groupImage;

  ListingImages({
    this.coverImage,
    this.groupImage,
  });

  factory ListingImages.fromJson(Map<String, dynamic> json) => ListingImages(
    coverImage: json["coverImage"],
    groupImage: json["groupImage"] == null ? [] : List<GroupImage>.from(json["groupImage"]!.map((x) => GroupImage.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "coverImage": coverImage,
    "groupImage": groupImage == null ? [] : List<dynamic>.from(groupImage!.map((x) => x.toJson())),
  };
}

class GroupImage {
  String? imagePath;
  String? id;

  GroupImage({
    this.imagePath,
    this.id,
  });

  factory GroupImage.fromJson(Map<String, dynamic> json) => GroupImage(
    imagePath: json["imagePath"],
    id: json["_id"],
  );

  Map<String, dynamic> toJson() => {
    "imagePath": imagePath,
    "_id": id,
  };
}

class UserDatum {
  String? id;
  List<UserDetail>? userDetails;

  UserDatum({
    this.id,
    this.userDetails,
  });

  factory UserDatum.fromJson(Map<String, dynamic> json) => UserDatum(
    id: json["_id"],
    userDetails: json["userDetails"] == null ? [] : List<UserDetail>.from(json["userDetails"]!.map((x) => UserDetail.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "userDetails": userDetails == null ? [] : List<dynamic>.from(userDetails!.map((x) => x.toJson())),
  };
}

class UserDetail {
  String? userId;
  String? name;
  String? profileImage;

  UserDetail({
    this.userId,
    this.name,
    this.profileImage,
  });

  factory UserDetail.fromJson(Map<String, dynamic> json) => UserDetail(
    userId: json["userId"],
    name: json["name"],
    profileImage: json["profileImage"],
  );

  Map<String, dynamic> toJson() => {
    "userId": userId,
    "name": name,
    "profileImage": profileImage,
  };
}

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation(
  );

  Map<String, dynamic> toJson() => {
  };
}

class EnumValues<T> {
  Map<String, T> map;
  late Map<T, String> reverseMap;

  EnumValues(this.map);

  Map<T, String> get reverse {
    reverseMap = map.map((k, v) => MapEntry(v, k));
    return reverseMap;
  }
}
