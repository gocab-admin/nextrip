// To parse this JSON data, do
//
//     final reviewResponseModel = reviewResponseModelFromJson(jsonString);

import 'dart:convert';

ReviewResponseModel reviewResponseModelFromJson(String str) =>
    ReviewResponseModel.fromJson(json.decode(str));

String reviewResponseModelToJson(ReviewResponseModel data) =>
    json.encode(data.toJson());

class ReviewResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  ReviewResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory ReviewResponseModel.fromJson(Map<String, dynamic> json) =>
      ReviewResponseModel(
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
  List<ReviewAndRating>? reviewAndRating;

  Data({
    this.totalCount,
    this.reviewAndRating,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
        totalCount: json["totalCount"],
        reviewAndRating: json["reviewAndRating"] == null
            ? []
            : List<ReviewAndRating>.from(json["reviewAndRating"]!
                .map((x) => ReviewAndRating.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "totalCount": totalCount,
        "reviewAndRating": reviewAndRating == null
            ? []
            : List<dynamic>.from(reviewAndRating!.map((x) => x.toJson())),
      };
}

class ReviewAndRating {
  String? id;
  ReviewRating? reviewRating;
  String? userFirstname;
  String? userId;
  String? userProfileImage;

  ReviewAndRating({
    this.id,
    this.reviewRating,
    this.userFirstname,
    this.userId,
    this.userProfileImage,
  });

  factory ReviewAndRating.fromJson(Map<String, dynamic> json) =>
      ReviewAndRating(
        id: json["_id"],
        reviewRating: json["reviewRating"] == null
            ? null
            : ReviewRating.fromJson(json["reviewRating"]),
        userFirstname: json["userFirstname"],
        userId: json["userId"],
        userProfileImage: json["userProfileImage"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "reviewRating": reviewRating?.toJson(),
        "userFirstname": userFirstname,
        "userId": userId,
        "userProfileImage": userProfileImage,
      };
}

class ReviewRating {
  String? review;
  Rating? rating;
  String? userId;
  String? id;
 // List<dynamic>? reply;
  List<Reply>? reply;
  DateTime? dateOfReview;

  ReviewRating({
    this.review,
    this.rating,
    this.userId,
    this.id,
    this.reply,
    this.dateOfReview,
  });

  factory ReviewRating.fromJson(Map<String, dynamic> json) => ReviewRating(
        review: json["review"],
        rating: json["rating"] == null ? null : Rating.fromJson(json["rating"]),
        userId: json["userId"],
        id: json["_id"],
        // reply: json["reply"] == null
        //     ? []
        //     : List<dynamic>.from(json["reply"]!.map((x) => x)),
       reply: json["reply"] == null ? [] : List<Reply>.from(json["reply"]!.map((x) => Reply.fromJson(x))),
        dateOfReview: json["dateOfReview"] == null
            ? null
            : DateTime.parse(json["dateOfReview"]),
      );

  Map<String, dynamic> toJson() => {
        "review": review,
        "rating": rating?.toJson(),
        "userId": userId,
        "_id": id,
        //"reply": reply == null ? [] : List<dynamic>.from(reply!.map((x) => x)),
        "reply": reply == null ? [] : List<dynamic>.from(reply!.map((x) => x.toJson())),
        "dateOfReview": dateOfReview?.toIso8601String(),
      };
}

class Rating {
  int? cleanliness;
  int? accuracy;
  int? communication;
  int? location;
  int? checkIn;
  int? value;

  Rating({
    this.cleanliness,
    this.accuracy,
    this.communication,
    this.location,
    this.checkIn,
    this.value,
  });

  factory Rating.fromJson(Map<String, dynamic> json) => Rating(
        cleanliness: json["Cleanliness"],
        accuracy: json["Accuracy"],
        communication: json["Communication"],
        location: json["Location"],
        checkIn: json["Check_in"],
        value: json["Value"],
      );

  Map<String, dynamic> toJson() => {
        "Cleanliness": cleanliness,
        "Accuracy": accuracy,
        "Communication": communication,
        "Location": location,
        "Check_in": checkIn,
        "Value": value,
      };
}

class Reply {
  String? userId;
  String? userType;
  String? response;
  String? id;
  String? dateOfReview;

  Reply({
    this.userId,
    this.userType,
    this.response,
    this.id,
    this.dateOfReview,
  });

  factory Reply.fromJson(Map<String, dynamic> json) => Reply(
    userId: json["userId"],
    userType: json["userType"],
    response: json["response"],
    id: json["_id"],
    dateOfReview: json["dateOfReview"],
  );

  Map<String, dynamic> toJson() => {
    "userId": userId,
    "userType": userType,
    "response": response,
    "_id": id,
    "dateOfReview": dateOfReview,
  };
}

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation();

  Map<String, dynamic> toJson() => {};
}
