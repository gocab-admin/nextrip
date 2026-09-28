// To parse this JSON data, do
//
//     final verifyOtpResponseModel = verifyOtpResponseModelFromJson(jsonString);

import 'dart:convert';

VerifyOtpResponseModel verifyOtpResponseModelFromJson(String str) =>
    VerifyOtpResponseModel.fromJson(json.decode(str));

String verifyOtpResponseModelToJson(VerifyOtpResponseModel data) =>
    json.encode(data.toJson());

class VerifyOtpResponseModel {
  String message;
  int statusCode;
  bool status;
  Data data;
  Validation validation;

  VerifyOtpResponseModel({
    required this.message,
    required this.statusCode,
    required this.status,
    required this.data,
    required this.validation,
  });

  factory VerifyOtpResponseModel.fromJson(Map<String, dynamic> json) =>
      VerifyOtpResponseModel(
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
  Verification verification;

  Data({
    required this.verification,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
        verification: Verification.fromJson(json["verification"]),
      );

  Map<String, dynamic> toJson() => {
        "verification": verification.toJson(),
      };
}

class Verification {
  PasswordKeys passwordKeys;
  Address address;
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
  String currency;
  bool verified;
  String verifiedBy;
  bool isActive;
  bool softdel;
  dynamic refBy;
  String fcmId;
  String permitCopy;
  int cancellationPolicyId;
  bool instantBooking;
  String verifiedDate;
  String createdAt;
  String updatedAt;
  String hash;
  String salt;
  int v;
  int emailOtp;
  String fullname;

  Verification({
    required this.passwordKeys,
    required this.address,
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
    required this.currency,
    required this.verified,
    required this.verifiedBy,
    required this.isActive,
    required this.softdel,
    required this.refBy,
    required this.fcmId,
    required this.permitCopy,
    required this.cancellationPolicyId,
    required this.instantBooking,
    required this.verifiedDate,
    required this.createdAt,
    required this.updatedAt,
    required this.hash,
    required this.salt,
    required this.v,
    required this.emailOtp,
    required this.fullname,
  });

  factory Verification.fromJson(Map<String, dynamic> json) => Verification(
        passwordKeys: PasswordKeys.fromJson(json["passwordKeys"]),
        address: Address.fromJson(json["address"]),
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
        currency: json["currency"],
        verified: json["verified"],
        verifiedBy: json["verifiedBy"],
        isActive: json["isActive"],
        softdel: json["softdel"],
        refBy: json["refBy"],
        fcmId: json["fcmId"],
        permitCopy: json["permitCopy"],
        cancellationPolicyId: json["cancellationPolicyId"],
        instantBooking: json["instantBooking"],
        verifiedDate: json["verifiedDate"],
        createdAt: json["createdAt"],
        updatedAt: json["updatedAt"],
        hash: json["hash"],
        salt: json["salt"],
        v: json["__v"],
        emailOtp: json["emailOtp"],
        fullname: json["fullname"],
      );

  Map<String, dynamic> toJson() => {
        "passwordKeys": passwordKeys.toJson(),
        "address": address.toJson(),
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
        "currency": currency,
        "verified": verified,
        "verifiedBy": verifiedBy,
        "isActive": isActive,
        "softdel": softdel,
        "refBy": refBy,
        "fcmId": fcmId,
        "permitCopy": permitCopy,
        "cancellationPolicyId": cancellationPolicyId,
        "instantBooking": instantBooking,
        "verifiedDate": verifiedDate,
        "createdAt": createdAt,
        "updatedAt": updatedAt,
        "hash": hash,
        "salt": salt,
        "__v": v,
        "emailOtp": emailOtp,
        "fullname": fullname,
      };
}

class Address {
  String city;
  String state;
  String country;
  String zipcode;
  String address;
  String landmark;
  List<int> coordinates;

  Address({
    required this.city,
    required this.state,
    required this.country,
    required this.zipcode,
    required this.address,
    required this.landmark,
    required this.coordinates,
  });

  factory Address.fromJson(Map<String, dynamic> json) => Address(
        city: json["city"],
        state: json["state"],
        country: json["country"],
        zipcode: json["zipcode"],
        address: json["address"],
        landmark: json["landmark"],
        coordinates: List<int>.from(json["coordinates"].map((x) => x ?? 0)),
      );

  Map<String, dynamic> toJson() => {
        "city": city,
        "state": state,
        "country": country,
        "zipcode": zipcode,
        "address": address,
        "landmark": landmark,
        "coordinates": List<dynamic>.from(coordinates.map((x) => x)),
      };
}

class PasswordKeys {
  dynamic resetDate;
  String forgetPasswordKey;
  bool isValidKey;

  PasswordKeys({
    required this.resetDate,
    required this.forgetPasswordKey,
    required this.isValidKey,
  });

  factory PasswordKeys.fromJson(Map<String, dynamic> json) => PasswordKeys(
        resetDate: json["resetDate"],
        forgetPasswordKey: json["forgetPasswordKey"],
        isValidKey: json["isValidKey"],
      );

  Map<String, dynamic> toJson() => {
        "resetDate": resetDate,
        "forgetPasswordKey": forgetPasswordKey,
        "isValidKey": isValidKey,
      };
}

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation();

  Map<String, dynamic> toJson() => {};
}
