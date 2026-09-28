import 'dart:convert';

UserReviewResponseModel viewReviewResponseModelFromJson(String str) => UserReviewResponseModel.fromJson(json.decode(str));

String viewReviewResponseModelToJson(UserReviewResponseModel data) => json.encode(data.toJson());

class UserReviewResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  UserReviewResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory UserReviewResponseModel.fromJson(Map<String, dynamic> json) => UserReviewResponseModel(
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
  ListingReview? listingReview;

  Data({
    this.listingReview,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    listingReview: json["listingReview"] == null ? null : ListingReview.fromJson(json["listingReview"]),
  );

  Map<String, dynamic> toJson() => {
    "listingReview": listingReview?.toJson(),
  };
}

class ListingReview {
  String? review;
  Rating? rating;
  String? userId;
  String? bookingId;
  bool? isReviewed;
  String? id;
  List<dynamic>? reply;
  DateTime? dateOfReview;

  ListingReview({
    this.review,
    this.rating,
    this.userId,
    this.bookingId,
    this.isReviewed,
    this.id,
    this.reply,
    this.dateOfReview,
  });

  factory ListingReview.fromJson(Map<String, dynamic> json) => ListingReview(
    review: json["review"],
    rating: json["rating"] == null ? null : Rating.fromJson(json["rating"]),
    userId: json["userId"],
    bookingId: json["bookingId"],
    isReviewed: json["isReviewed"],
    id: json["_id"],
    reply: json["reply"] == null ? [] : List<dynamic>.from(json["reply"]!.map((x) => x)),
    dateOfReview: json["dateOfReview"] == null ? null : DateTime.parse(json["dateOfReview"]),
  );

  Map<String, dynamic> toJson() => {
    "review": review,
    "rating": rating?.toJson(),
    "userId": userId,
    "bookingId": bookingId,
    "isReviewed": isReviewed,
    "_id": id,
    "reply": reply == null ? [] : List<dynamic>.from(reply!.map((x) => x)),
    "dateOfReview": dateOfReview?.toIso8601String(),
  };
}

class Rating {
  num? cleanliness;
  num? accuracy;
  num? communication;
  num? location;
  num? checkIn;
  num? value;

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

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation(
  );

  Map<String, dynamic> toJson() => {
  };
}
