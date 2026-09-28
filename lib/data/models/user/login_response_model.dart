// To parse this JSON data, do
//
//     final loginResponseModel = loginResponseModelFromJson(jsonString);

import 'dart:convert';

LoginResponseModel loginResponseModelFromJson(String str) => LoginResponseModel.fromJson(json.decode(str));

String loginResponseModelToJson(LoginResponseModel data) => json.encode(data.toJson());

class LoginResponseModel {
  String message;
  int statusCode;
  bool status;
  int userListings;
  Data data;
  Validation validation;

  LoginResponseModel({
    required this.message,
    required this.statusCode,
    required this.status,
    required this.userListings,
    required this.data,
    required this.validation,
  });

  factory LoginResponseModel.fromJson(Map<String, dynamic> json) => LoginResponseModel(
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
    "data": data.toJson(),
    "validation": validation.toJson(),
  };
}

class Data {
  User user;

  Data({required this.user});

  factory Data.fromJson(Map<String, dynamic> json) => Data(user: User.fromJson(json["user"]));

  Map<String, dynamic> toJson() => {"user": user.toJson()};
}

class User {
  String id;
  String firstname;
  String lastname;
  String phoneCode;
  String phone;
  String email;
  String profileImage;
  String gender;
  String dob;
  String language;
  String school;
  String work;
  String pet;
  String song;
  String obsessed;
  String funFact;
  String useLessSkill;
  String bio;
  String hobby;
  String desc;
  PasswordKeys passwordKeys;
  Address address;
  String currency;
  bool verified;
  String verifiedBy;
  bool isActive;
  int emailOtp;
  bool softdel;
  dynamic refBy;
  String fcmId;
  String permitCopy;
  int cancellationPolicyId;
  bool instantBooking;
  String verifiedDate;
  String createdAt;
  String updatedAt;
  String mode;
  String hash;
  String salt;
  int v;
  String token;

  User({
    required this.id,
    required this.firstname,
    required this.lastname,
    required this.phoneCode,
    required this.phone,
    required this.email,
    required this.profileImage,
    required this.gender,
    required this.dob,
    required this.language,
    required this.school,
    required this.work,
    required this.pet,
    required this.song,
    required this.obsessed,
    required this.funFact,
    required this.useLessSkill,
    required this.bio,
    required this.hobby,
    required this.desc,
    required this.passwordKeys,
    required this.address,
    required this.currency,
    required this.verified,
    required this.verifiedBy,
    required this.isActive,
    required this.emailOtp,
    required this.softdel,
    required this.refBy,
    required this.fcmId,
    required this.permitCopy,
    required this.cancellationPolicyId,
    required this.instantBooking,
    required this.verifiedDate,
    required this.createdAt,
    required this.updatedAt,
    required this.mode,
    required this.hash,
    required this.salt,
    required this.v,
    required this.token,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
    id: json["_id"],
    firstname: json["firstname"],
    lastname: json["lastname"],
    phoneCode: json["phoneCode"],
    phone: json["phone"],
    email: json["email"],
    profileImage: json["profileImage"],
    gender: json["gender"],
    dob: json["dob"],
    language: json["language"],
    school: json["school"],
    work: json["work"],
    pet: json["pet"],
    song: json["song"],
    obsessed: json["obsessed"],
    funFact: json["funFact"],
    useLessSkill: json["useLessSkill"],
    bio: json["bio"],
    hobby: json["hobby"],
    desc: json["desc"],
    passwordKeys: PasswordKeys.fromJson(json["passwordKeys"]),
    address: Address.fromJson(json["address"]),
    currency: json["currency"],
    verified: json["verified"],
    verifiedBy: json["verifiedBy"],
    isActive: json["isActive"],
    emailOtp: json["emailOtp"],
    softdel: json["softdel"],
    refBy: json["refBy"],
    fcmId: json["fcmId"],
    permitCopy: json["permitCopy"],
    cancellationPolicyId: json["cancellationPolicyId"],
    instantBooking: json["instantBooking"],
    verifiedDate: json["verifiedDate"],
    createdAt: json["createdAt"],
    updatedAt: json["updatedAt"],
    mode: json["mode"],
    hash: json["hash"],
    salt: json["salt"],
    v: json["__v"],
    token: json["token"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "firstname": firstname,
    "lastname": lastname,
    "phoneCode": phoneCode,
    "phone": phone,
    "email": email,
    "profileImage": profileImage,
    "gender": gender,
    "dob": dob,
    "language": language,
    "school": school,
    "work": work,
    "pet": pet,
    "song": song,
    "obsessed": obsessed,
    "funFact": funFact,
    "useLessSkill": useLessSkill,
    "bio": bio,
    "hobby": hobby,
    "desc": desc,
    "passwordKeys": passwordKeys.toJson(),
    "address": address.toJson(),
    "currency": currency,
    "verified": verified,
    "verifiedBy": verifiedBy,
    "isActive": isActive,
    "emailOtp": emailOtp,
    "softdel": softdel,
    "refBy": refBy,
    "fcmId": fcmId,
    "permitCopy": permitCopy,
    "cancellationPolicyId": cancellationPolicyId,
    "instantBooking": instantBooking,
    "verifiedDate": verifiedDate,
    "createdAt": createdAt,
    "updatedAt": updatedAt,
    "mode": mode,
    "hash": hash,
    "salt": salt,
    "__v": v,
    "token": token,
  };
}

class Address {
  List<dynamic> coordinates;

  Address({required this.coordinates});

  factory Address.fromJson(Map<String, dynamic> json) =>
      Address(coordinates: List<dynamic>.from(json["coordinates"].map((x) => x)));

  Map<String, dynamic> toJson() => {"coordinates": List<dynamic>.from(coordinates.map((x) => x))};
}

class PasswordKeys {
  String forgetPasswordKey;
  bool isValidKey;
  dynamic resetDate;

  PasswordKeys({required this.forgetPasswordKey, required this.isValidKey, required this.resetDate});

  factory PasswordKeys.fromJson(Map<String, dynamic> json) => PasswordKeys(
    forgetPasswordKey: json["forgetPasswordKey"],
    isValidKey: json["isValidKey"],
    resetDate: json["resetDate"],
  );

  Map<String, dynamic> toJson() => {
    "forgetPasswordKey": forgetPasswordKey,
    "isValidKey": isValidKey,
    "resetDate": resetDate,
  };
}

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation();

  Map<String, dynamic> toJson() => {};
}
