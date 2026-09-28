// To parse this JSON data, do
//
//     final chatListResponseModel = chatListResponseModelFromJson(jsonString);

import 'dart:convert';

ChatListResponseModel chatListResponseModelFromJson(String str) => ChatListResponseModel.fromJson(json.decode(str));

String chatListResponseModelToJson(ChatListResponseModel data) => json.encode(data.toJson());

class ChatListResponseModel {
  bool? status;
  String? message;
  List<Datum>? data;
  Validation? validation;
  int? statusCode;

  ChatListResponseModel({
    this.status,
    this.message,
    this.data,
    this.validation,
    this.statusCode,
  });

  factory ChatListResponseModel.fromJson(Map<String, dynamic> json) => ChatListResponseModel(
    status: json["status"],
    message: json["message"],
    data: json["data"] == null ? [] : List<Datum>.from(json["data"]!.map((x) => Datum.fromJson(x))),
    validation: json["validation"] == null ? null : Validation.fromJson(json["validation"]),
    statusCode: json["statusCode"],
  );

  Map<String, dynamic> toJson() => {
    "status": status,
    "message": message,
    "data": data == null ? [] : List<dynamic>.from(data!.map((x) => x.toJson())),
    "validation": validation?.toJson(),
    "statusCode": statusCode,
  };
}

class Datum {
  String? id;
  List<Participant>? participants;
  List<DeliverMessage>? deliverMessage;
  List<UserDetail>? userDetails;
  String? lastMessage;
  DateTime? lastMessageDate;
  String? listingName;
  ListingImages? listingImages;

  Datum({
    this.id,
    this.participants,
    this.deliverMessage,
    this.userDetails,
    this.lastMessage,
    this.lastMessageDate,
    this.listingName,
    this.listingImages,
  });

  factory Datum.fromJson(Map<String, dynamic> json) => Datum(
    id: json["_id"],
    participants: json["participants"] == null ? [] : List<Participant>.from(json["participants"]!.map((x) => Participant.fromJson(x))),
    deliverMessage: json["deliverMessage"] == null ? [] : List<DeliverMessage>.from(json["deliverMessage"]!.map((x) => DeliverMessage.fromJson(x))),
    userDetails: json["userDetails"] == null ? [] : List<UserDetail>.from(json["userDetails"]!.map((x) => UserDetail.fromJson(x))),
    lastMessage: json["lastMessage"],
    lastMessageDate: json["lastMessageDate"] == null ? null : DateTime.parse(json["lastMessageDate"]),
    listingName: json["listingName"],
    listingImages: json["listingImages"] == null ? null : ListingImages.fromJson(json["listingImages"]),
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "participants": participants == null ? [] : List<dynamic>.from(participants!.map((x) => x.toJson())),
    "deliverMessage": deliverMessage == null ? [] : List<dynamic>.from(deliverMessage!.map((x) => x.toJson())),
    "userDetails": userDetails == null ? [] : List<dynamic>.from(userDetails!.map((x) => x.toJson())),
    "lastMessage": lastMessage,
    "lastMessageDate": lastMessageDate?.toIso8601String(),
    "listingName": listingName,
    "listingImages": listingImages?.toJson(),
  };
}

class DeliverMessage {
  String? messageId;
  String? userId;
  String? type;
  String? message;
  bool? softdel;
  dynamic deleteAt;
  DateTime? date;
  dynamic fileId;
  dynamic imageDetails;
  String? status;
  String? id;

  DeliverMessage({
    this.messageId,
    this.userId,
    this.type,
    this.message,
    this.softdel,
    this.deleteAt,
    this.date,
    this.fileId,
    this.imageDetails,
    this.status,
    this.id,
  });

  factory DeliverMessage.fromJson(Map<String, dynamic> json) => DeliverMessage(
    messageId: json["messageId"],
    userId: json["userId"],
    type: json["type"],
    message: json["message"],
    softdel: json["softdel"],
    deleteAt: json["deleteAt"],
    date: json["date"] == null ? null : DateTime.parse(json["date"]),
    fileId: json["file_id"],
    imageDetails: json["imageDetails"],
    status: json["status"],
    id: json["_id"],
  );

  Map<String, dynamic> toJson() => {
    "messageId": messageId,
    "userId": userId,
    "type": type,
    "message": message,
    "softdel": softdel,
    "deleteAt": deleteAt,
    "date": date?.toIso8601String(),
    "file_id": fileId,
    "imageDetails": imageDetails,
    "status": status,
    "_id": id,
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

class Participant {
  String? userId;
  String? status;
  bool? blockStatus;
  bool? delChat;
  bool? archived;
  int? unseen;
  String? id;

  Participant({
    this.userId,
    this.status,
    this.blockStatus,
    this.delChat,
    this.archived,
    this.unseen,
    this.id,
  });

  factory Participant.fromJson(Map<String, dynamic> json) => Participant(
    userId: json["userId"],
    status: json["status"],
    blockStatus: json["blockStatus"],
    delChat: json["delChat"],
    archived: json["archived"],
    unseen: json["unseen"],
    id: json["_id"],
  );

  Map<String, dynamic> toJson() => {
    "userId": userId,
    "status": status,
    "blockStatus": blockStatus,
    "delChat": delChat,
    "archived": archived,
    "unseen": unseen,
    "_id": id,
  };
}

class UserDetail {
  String? id;
  String? userId;
  String? name;
  String? profilePicture;

  UserDetail({
    this.id,
    this.userId,
    this.name,
    this.profilePicture,
  });

  factory UserDetail.fromJson(Map<String, dynamic> json) => UserDetail(
    id: json["_id"],
    userId: json["userId"],
    name: json["name"],
    profilePicture: json["profilePicture"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "userId": userId,
    "name": name,
    "profilePicture": profilePicture,
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
