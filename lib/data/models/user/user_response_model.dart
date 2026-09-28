// To parse this JSON data, do
//
//     final userResponseModel = userResponseModelFromJson(jsonString);

import 'dart:convert';

UserResponseModel userResponseModelFromJson(String str) =>
    UserResponseModel.fromJson(json.decode(str));

String userResponseModelToJson(UserResponseModel data) =>
    json.encode(data.toJson());

class UserResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  int? totalCount;
  Data? data;
  Validation? validation;

  UserResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.totalCount,
    this.data,
    this.validation,
  });

  factory UserResponseModel.fromJson(Map<String, dynamic> json) =>
      UserResponseModel(
        message: json["message"],
        statusCode: json["statusCode"],
        status: json["status"],
        totalCount: json["totalCount"],
        data: json["data"] == null ? null : Data.fromJson(json["data"]),
        validation: json["validation"] == null
            ? null
            : Validation.fromJson(json["validation"]),
      );

  Map<String, dynamic> toJson() => {
        "message": message,
        "statusCode": statusCode,
        "status": status,
        "totalCount": totalCount,
        "data": data?.toJson(),
        "validation": validation?.toJson(),
      };
}

class Data {
  UserDetail? userDetail;

  Data({
    this.userDetail,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
        userDetail: json["userDetail"] == null
            ? null
            : UserDetail.fromJson(json["userDetail"]),
      );

  Map<String, dynamic> toJson() => {
        "userDetail": userDetail?.toJson(),
      };
}

class UserDetail {
  String? id;
  String? firstname;
  String? lastname;
  String? fullname;
  String? phoneCode;
  String? phone;
  String? email;
  String? profileImage;
  String? gender;
  String? dob;
  String? language;
  String? school;
  String? work;
  String? pet;
  String? song;
  String? obsessed;
  String? funFact;
  String? useLessSkill;
  String? bio;
  String? hobby;
  String? desc;
  String? mode;
  PasswordKeys? passwordKeys;
  Address? address;
  String? currency;
  bool? verified;
  String? verifiedBy;
  bool? isActive;
  int? emailOtp;
  bool? softdel;
  dynamic refBy;
  String? fcmId;
  String? permitCopy;
  int? cancellationPolicyId;
  bool? instantBooking;
  DateTime? verifiedDate;
  DateTime? createdAt;
  DateTime? updatedAt;
  String? hash;
  String? salt;
  int? v;
  String? type;

  UserDetail({
    this.id,
    this.firstname,
    this.lastname,
    this.fullname,
    this.phoneCode,
    this.phone,
    this.email,
    this.profileImage,
    this.gender,
    this.dob,
    this.language,
    this.school,
    this.work,
    this.pet,
    this.song,
    this.obsessed,
    this.funFact,
    this.useLessSkill,
    this.bio,
    this.hobby,
    this.desc,
    this.mode,
    this.passwordKeys,
    this.address,
    this.currency,
    this.verified,
    this.verifiedBy,
    this.isActive,
    this.emailOtp,
    this.softdel,
    this.refBy,
    this.fcmId,
    this.permitCopy,
    this.cancellationPolicyId,
    this.instantBooking,
    this.verifiedDate,
    this.createdAt,
    this.updatedAt,
    this.hash,
    this.salt,
    this.v,
    this.type,
  });

  factory UserDetail.fromJson(Map<String, dynamic> json) => UserDetail(
        id: json["_id"],
        firstname: json["firstname"],
        lastname: json["lastname"],
        fullname: json["fullname"],
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
        mode: json["mode"],
        passwordKeys: json["passwordKeys"] == null
            ? null
            : PasswordKeys.fromJson(json["passwordKeys"]),
        address:
            json["address"] == null ? null : Address.fromJson(json["address"]),
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
        verifiedDate: json["verifiedDate"] == null
            ? null
            : DateTime.parse(json["verifiedDate"]),
        createdAt: json["createdAt"] == null
            ? null
            : DateTime.parse(json["createdAt"]),
        updatedAt: json["updatedAt"] == null
            ? null
            : DateTime.parse(json["updatedAt"]),
        hash: json["hash"],
        salt: json["salt"],
        v: json["__v"],
        type: json["type"],
      );

  Map<String, dynamic> toJson() => {
        "_id": id,
        "firstname": firstname,
        "lastname": lastname,
        "fullname": fullname,
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
        "mode": mode,
        "passwordKeys": passwordKeys?.toJson(),
        "address": address?.toJson(),
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
        "verifiedDate": verifiedDate?.toIso8601String(),
        "createdAt": createdAt?.toIso8601String(),
        "updatedAt": updatedAt?.toIso8601String(),
        "hash": hash,
        "salt": salt,
        "__v": v,
        "type": type,
      };
}

class Address {
  String? address;
  List<dynamic>? coordinates;

  Address({
    this.address,
    this.coordinates,
  });

  factory Address.fromJson(Map<String, dynamic> json) => Address(
    address: json["address"],
        coordinates: json["coordinates"] == null
            ? []
            : List<dynamic>.from(json["coordinates"]!.map((x) => x)),
      );

  Map<String, dynamic> toJson() => {
    "address": address,
        "coordinates": coordinates == null
            ? []
            : List<dynamic>.from(coordinates!.map((x) => x)),
      };
}

class PasswordKeys {
  String? forgetPasswordKey;
  bool? isValidKey;
  dynamic resetDate;

  PasswordKeys({
    this.forgetPasswordKey,
    this.isValidKey,
    this.resetDate,
  });

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
