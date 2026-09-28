import 'dart:convert';

ProfileUpdateResponseModel profileUpdateResponseModelFromJson(String str) => ProfileUpdateResponseModel.fromJson(json.decode(str));

String profileUpdateResponseModelToJson(ProfileUpdateResponseModel data) => json.encode(data.toJson());

class ProfileUpdateResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  ProfileUpdateResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory ProfileUpdateResponseModel.fromJson(Map<String, dynamic> json) => ProfileUpdateResponseModel(
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
  ProfileData? profileData;

  Data({
    this.profileData,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    profileData: json["profileData"] == null ? null : ProfileData.fromJson(json["profileData"]),
  );

  Map<String, dynamic> toJson() => {
    "profileData": profileData?.toJson(),
  };
}

class ProfileData {
  PasswordKeys? passwordKeys;
  Address? address;
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
  List<dynamic>? document;
  String? userBankId;

  ProfileData({
    this.passwordKeys,
    this.address,
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
    this.document,
    this.userBankId,
  });

  factory ProfileData.fromJson(Map<String, dynamic> json) => ProfileData(
    passwordKeys: json["passwordKeys"] == null ? null : PasswordKeys.fromJson(json["passwordKeys"]),
    address: json["address"] == null ? null : Address.fromJson(json["address"]),
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
    verifiedDate: json["verifiedDate"] == null ? null : DateTime.parse(json["verifiedDate"]),
    createdAt: json["createdAt"] == null ? null : DateTime.parse(json["createdAt"]),
    updatedAt: json["updatedAt"] == null ? null : DateTime.parse(json["updatedAt"]),
    hash: json["hash"],
    salt: json["salt"],
    v: json["__v"],
    document: json["document"] == null ? [] : List<dynamic>.from(json["document"]!.map((x) => x)),
    userBankId: json["userBankId"],
  );

  Map<String, dynamic> toJson() => {
    "passwordKeys": passwordKeys?.toJson(),
    "address": address?.toJson(),
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
    "document": document == null ? [] : List<dynamic>.from(document!.map((x) => x)),
    "userBankId": userBankId,
  };
}

class Address {
  String? city;
  String? state;
  String? country;
  String? zipcode;
  String? address;
  String? landmark;
  List<dynamic>? coordinates;

  Address({
    this.city,
    this.state,
    this.country,
    this.zipcode,
    this.address,
    this.landmark,
    this.coordinates,
  });

  factory Address.fromJson(Map<String, dynamic> json) => Address(
    city: json["city"],
    state: json["state"],
    country: json["country"],
    zipcode: json["zipcode"],
    address: json["address"],
    landmark: json["landmark"],
    coordinates: json["coordinates"] == null ? [] : List<dynamic>.from(json["coordinates"]!.map((x) => x)),
  );

  Map<String, dynamic> toJson() => {
    "city": city,
    "state": state,
    "country": country,
    "zipcode": zipcode,
    "address": address,
    "landmark": landmark,
    "coordinates": coordinates == null ? [] : List<dynamic>.from(coordinates!.map((x) => x)),
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

  factory Validation.fromJson(Map<String, dynamic> json) => Validation(
  );

  Map<String, dynamic> toJson() => {
  };
}
