// To parse this JSON data, do
//
//     final usersListingResponseModel = usersListingResponseModelFromJson(jsonString);

import 'dart:convert';

UsersListingResponseModel usersListingResponseModelFromJson(String str) => UsersListingResponseModel.fromJson(json.decode(str));

String usersListingResponseModelToJson(UsersListingResponseModel data) => json.encode(data.toJson());

class UsersListingResponseModel {
  String message;
  int statusCode;
  bool status;
  Data data;
  Validation validation;

  UsersListingResponseModel({
    required this.message,
    required this.statusCode,
    required this.status,
    required this.data,
    required this.validation,
  });

  factory UsersListingResponseModel.fromJson(Map<String, dynamic> json) => UsersListingResponseModel(
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
  List<UserListing> userListings;

  Data({
    required this.userListings,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    userListings: List<UserListing>.from(json["userListings"].map((x) => UserListing.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "userListings": List<dynamic>.from(userListings.map((x) => x.toJson())),
  };
}

class UserListing {
  Id id;
  List<Datum> data;

  UserListing({
    required this.id,
    required this.data,
  });

  factory UserListing.fromJson(Map<String, dynamic> json) => UserListing(
    id: Id.fromJson(json["_id"]),
    data: List<Datum>.from(json["data"].map((x) => Datum.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "_id": id.toJson(),
    "data": List<dynamic>.from(data.map((x) => x.toJson())),
  };
}

class Datum {
  Guest guest;
  Accomodation accomodation;
  String userId;
  String propertyName;
  String propertyDesc;
  String status;
  bool availability;
  int totalRatingCount;
  int totalReviewCount;
  ListingattachmentsData listingattachmentsData;

  Datum({
    required this.guest,
    required this.accomodation,
    required this.userId,
    required this.propertyName,
    required this.propertyDesc,
    required this.status,
    required this.availability,
    required this.totalRatingCount,
    required this.totalReviewCount,
    required this.listingattachmentsData,
  });

  factory Datum.fromJson(Map<String, dynamic> json) => Datum(
    guest: Guest.fromJson(json["guest"]),
    accomodation: Accomodation.fromJson(json["accomodation"]),
    userId: json["userId"],
    propertyName: json["propertyName"],
    propertyDesc: json["propertyDesc"],
    status: json["status"],
    availability: json["availability"],
    totalRatingCount: json["totalRatingCount"],
    totalReviewCount: json["totalReviewCount"],
    listingattachmentsData: ListingattachmentsData.fromJson(json["listingattachmentsData"]),
  );

  Map<String, dynamic> toJson() => {
    "guest": guest.toJson(),
    "accomodation": accomodation.toJson(),
    "userId": userId,
    "propertyName": propertyName,
    "propertyDesc": propertyDesc,
    "status": status,
    "availability": availability,
    "totalRatingCount": totalRatingCount,
    "totalReviewCount": totalReviewCount,
    "listingattachmentsData": listingattachmentsData.toJson(),
  };
}

class Accomodation {
  BathRoom bathRoom;
  int bedRoomCount;
  List<BedRoomBedtype> bedRoomBedtype;

  Accomodation({
    required this.bathRoom,
    required this.bedRoomCount,
    required this.bedRoomBedtype,
  });

  factory Accomodation.fromJson(Map<String, dynamic> json) => Accomodation(
    bathRoom: BathRoom.fromJson(json["bathRoom"]),
    bedRoomCount: json["bedRoomCount"],
    bedRoomBedtype: List<BedRoomBedtype>.from(json["bedRoomBedtype"].map((x) => BedRoomBedtype.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "bathRoom": bathRoom.toJson(),
    "bedRoomCount": bedRoomCount,
    "bedRoomBedtype": List<dynamic>.from(bedRoomBedtype.map((x) => x.toJson())),
  };
}

class BathRoom {
  int bathRoomCount;
  bool shared;

  BathRoom({
    required this.bathRoomCount,
    required this.shared,
  });

  factory BathRoom.fromJson(Map<String, dynamic> json) => BathRoom(
    bathRoomCount: json["bathRoomCount"],
    shared: json["shared"],
  );

  Map<String, dynamic> toJson() => {
    "bathRoomCount": bathRoomCount,
    "shared": shared,
  };
}

class BedRoomBedtype {
  String bedRoom;
  String bedType;
  int bedCount;
  String id;

  BedRoomBedtype({
    required this.bedRoom,
    required this.bedType,
    required this.bedCount,
    required this.id,
  });

  factory BedRoomBedtype.fromJson(Map<String, dynamic> json) => BedRoomBedtype(
    bedRoom: json["bedRoom"],
    bedType: json["bedType"],
    bedCount: json["bedCount"],
    id: json["_id"],
  );

  Map<String, dynamic> toJson() => {
    "bedRoom": bedRoom,
    "bedType": bedType,
    "bedCount": bedCount,
    "_id": id,
  };
}

class Guest {
  String adult;
  String children;
  String pets;

  Guest({
    required this.adult,
    required this.children,
    required this.pets,
  });

  factory Guest.fromJson(Map<String, dynamic> json) => Guest(
    adult: json["adult"],
    children: json["children"],
    pets: json["pets"],
  );

  Map<String, dynamic> toJson() => {
    "adult": adult,
    "children": children,
    "pets": pets,
  };
}

class ListingattachmentsData {
  Image image;

  ListingattachmentsData({
    required this.image,
  });

  factory ListingattachmentsData.fromJson(Map<String, dynamic> json) => ListingattachmentsData(
    image: Image.fromJson(json["image"]),
  );

  Map<String, dynamic> toJson() => {
    "image": image.toJson(),
  };
}

class Image {
  String coverImage;
  List<GroupImage> groupImage;

  Image({
    required this.coverImage,
    required this.groupImage,
  });

  factory Image.fromJson(Map<String, dynamic> json) => Image(
    coverImage: json["coverImage"],
    groupImage: List<GroupImage>.from(json["groupImage"].map((x) => GroupImage.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "coverImage": coverImage,
    "groupImage": List<dynamic>.from(groupImage.map((x) => x.toJson())),
  };
}

class GroupImage {
  String imagePath;
  String id;

  GroupImage({
    required this.imagePath,
    required this.id,
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

class Id {
  String listing;

  Id({
    required this.listing,
  });

  factory Id.fromJson(Map<String, dynamic> json) => Id(
    listing: json["listing"],
  );

  Map<String, dynamic> toJson() => {
    "listing": listing,
  };
}

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation(
  );

  Map<String, dynamic> toJson() => {
  };
}
