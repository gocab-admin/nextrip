// To parse this JSON data, do
//
//     final chatDetailsResponseModel = chatDetailsResponseModelFromJson(jsonString);

import 'dart:convert';

ChatDetailsResponseModel chatDetailsResponseModelFromJson(String str) =>
    ChatDetailsResponseModel.fromJson(json.decode(str));

String chatDetailsResponseModelToJson(ChatDetailsResponseModel data) =>
    json.encode(data.toJson());

class ChatDetailsResponseModel {
  bool? status;
  ChatData? data;
  String? listingName;
  ListingImages? listingImages;
  num? code;
  String? message;

  ChatDetailsResponseModel({
    this.status,
    this.data,
    this.listingName,
    this.listingImages,
    this.code,
    this.message,
  });

  factory ChatDetailsResponseModel.fromJson(Map<String, dynamic> json) =>
      ChatDetailsResponseModel(
        status: json["status"],
        data: json["data"] == null ? null : ChatData.fromJson(json["data"]),
        listingName: json["listingName"],
        listingImages: json["listingImages"] == null
            ? null
            : ListingImages.fromJson(json["listingImages"]),
        code: json["code"],
        message: json["message"],
      );

  Map<String, dynamic> toJson() => {
        "status": status,
        "data": data?.toJson(),
        "listingName": listingName,
        "listingImages": listingImages?.toJson(),
        "code": code,
        "message": message,
      };
}

class SocketMessageData {
  final String chatId;
  final List<Message> newMessages;

  SocketMessageData({
    required this.chatId,
    required this.newMessages,
  });

  factory SocketMessageData.fromJson(Map<String, dynamic> json) {
    var messagesJson = json['newMessages'] as List;
    List<Message> messagesList =
        messagesJson.map((msg) => Message.fromJson(msg['message'])).toList();

    return SocketMessageData(
      chatId: json['chatId'],
      newMessages: messagesList,
    );
  }
}

class ChatData {
  String? id;
  List<Participant>? participants;
  List<Message>? message;
  List<DeliverMessage>? deliverMessage;
  DateTime? createdAt;
  DateTime? updatedAt;
  String? adsId;
  String? catId;
  num? v;

  ChatData({
    this.id,
    this.participants,
    this.message,
    this.deliverMessage,
    this.createdAt,
    this.updatedAt,
    this.adsId,
    this.catId,
    this.v,
  });

  factory ChatData.fromJson(Map<String, dynamic> json) => ChatData(
        id: json["_id"],
        participants: json["participants"] == null
            ? []
            : List<Participant>.from(
                json["participants"]!.map((x) => Participant.fromJson(x))),
        message: json["message"] == null
            ? []
            : List<Message>.from(
                json["message"]!.map((x) => Message.fromJson(x))),
        deliverMessage: json["deliverMessage"] == null
            ? []
            : List<DeliverMessage>.from(
                json["deliverMessage"]!.map((x) => DeliverMessage.fromJson(x))),
        createdAt: json["createdAt"] == null
            ? null
            : DateTime.parse(json["createdAt"]),
        updatedAt: json["updatedAt"] == null
            ? null
            : DateTime.parse(json["updatedAt"]),
        adsId: json["adsId"],
        catId: json["catId"],
        v: json["__v"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "participants": participants == null
            ? []
            : List<dynamic>.from(participants!.map((x) => x.toJson())),
        "message": message == null
            ? []
            : List<dynamic>.from(message!.map((x) => x.toJson())),
        "deliverMessage": deliverMessage == null
            ? []
            : List<dynamic>.from(deliverMessage!.map((x) => x.toJson())),
        "createdAt": createdAt?.toIso8601String(),
        "updatedAt": updatedAt?.toIso8601String(),
        "adsId": adsId,
        "catId": catId,
        "__v": v,
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

class Message {
  String? userId;
  String? message;
  dynamic replyId;
  String? type;
  String? status;
  DateTime? date;
  dynamic imageDetails;
  dynamic fileId;
  String? id;

  Message({
    this.userId,
    this.message,
    this.replyId,
    this.type,
    this.status,
    this.date,
    this.imageDetails,
    this.fileId,
    this.id,
  });

  factory Message.fromJson(Map<String, dynamic> json) => Message(
        userId: json["userId"],
        message: json["message"],
        replyId: json["replyId"],
        type: json["type"],
        status: json["status"],
        date: json["date"] == null ? null : DateTime.parse(json["date"]),
        imageDetails: json["imageDetails"],
        fileId: json["file_id"],
        id: json["_id"],
      );

  Map<String, dynamic> toJson() => {
        "userId": userId,
        "message": message,
        "replyId": replyId,
        "type": type,
        "status": status,
        "date": date?.toIso8601String(),
        "imageDetails": imageDetails,
        "file_id": fileId,
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

class ListingImages {
  String? coverImage;
  List<GroupImage>? groupImage;

  ListingImages({
    this.coverImage,
    this.groupImage,
  });

  factory ListingImages.fromJson(Map<String, dynamic> json) => ListingImages(
        coverImage: json["coverImage"],
        groupImage: json["groupImage"] == null
            ? []
            : List<GroupImage>.from(
                json["groupImage"]!.map((x) => GroupImage.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "coverImage": coverImage,
        "groupImage": groupImage == null
            ? []
            : List<dynamic>.from(groupImage!.map((x) => x.toJson())),
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
