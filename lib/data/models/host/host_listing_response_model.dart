// To parse this JSON data, do
//
//     final hostListingResponseModel = hostListingResponseModelFromJson(jsonString);

import 'dart:convert';

HostListingResponseModel hostListingResponseModelFromJson(String str) => HostListingResponseModel.fromJson(json.decode(str));

String hostListingResponseModelToJson(HostListingResponseModel data) => json.encode(data.toJson());

class HostListingResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;
  Validation? validation;

  HostListingResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory HostListingResponseModel.fromJson(Map<String, dynamic> json) => HostListingResponseModel(
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
  List<HostListing>? listing;
  List<Privilege>? privileges;
  List<PrivilegeCategory>? privilegeCategories;
  List<PrivilegeItem>? privilegeItems;

  Data({
    this.listing,
    this.privileges,
    this.privilegeCategories,
    this.privilegeItems,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    listing: json["listing"] == null ? [] : List<HostListing>.from(json["listing"]!.map((x) => HostListing.fromJson(x))),
    privileges: json["privileges"] == null ? [] : List<Privilege>.from(json["privileges"]!.map((x) => Privilege.fromJson(x))),
    privilegeCategories: json["privilegeCategories"] == null ? [] : List<PrivilegeCategory>.from(json["privilegeCategories"]!.map((x) => PrivilegeCategory.fromJson(x))),
    privilegeItems: json["privilegeItems"] == null ? [] : List<PrivilegeItem>.from(json["privilegeItems"]!.map((x) => PrivilegeItem.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "listing": listing == null ? [] : List<dynamic>.from(listing!.map((x) => x.toJson())),
    "privileges": privileges == null ? [] : List<dynamic>.from(privileges!.map((x) => x.toJson())),
    "privilegeCategories": privilegeCategories == null ? [] : List<dynamic>.from(privilegeCategories!.map((x) => x.toJson())),
    "privilegeItems": privilegeItems == null ? [] : List<dynamic>.from(privilegeItems!.map((x) => x.toJson())),
  };
}

class HostListing {
  String? id;
  String? userId;
  String? propertyCategory;
  String? propertyType;
  String? propertyName;
  String? propertyDesc;
  String? status;
  ListingAddress? address;
  List<double>? location;
  Guest? guest;
  bool? availability;
  Accomodation? accomodation;
  int? totalCleanlinessRate;
  int? totalAccuracyRate;
  int? totalCommunicationRate;
  int? totalLocationRate;
  int? totalValueRate;
  int? totalCheckInRate;
  int? totalRatingCount;
  int? totalReviewCount;
  int? cancellationPolicyId;
  bool? softdel;
  List<dynamic>? events;
  List<dynamic>? reviewRating;
  List<dynamic>? schedule;
  List<dynamic>? placesToOffer;
  String? createdAt;
  String? updatedAt;
  int? v;
  String? progress;
  UserData? userData;
  AttachmentData? attachmentData;
  PriceData? priceData;
  PropertyTypeName? propertyTypeName;
  PropertyCategoryName? propertyCategoryName;

  HostListing({
    this.id,
    this.userId,
    this.propertyCategory,
    this.propertyType,
    this.propertyName,
    this.propertyDesc,
    this.status,
    this.address,
    this.location,
    this.guest,
    this.availability,
    this.accomodation,
    this.totalCleanlinessRate,
    this.totalAccuracyRate,
    this.totalCommunicationRate,
    this.totalLocationRate,
    this.totalValueRate,
    this.totalCheckInRate,
    this.totalRatingCount,
    this.totalReviewCount,
    this.cancellationPolicyId,
    this.softdel,
    this.events,
    this.reviewRating,
    this.schedule,
    this.placesToOffer,
    this.createdAt,
    this.updatedAt,
    this.v,
    this.progress,
    this.userData,
    this.attachmentData,
    this.priceData,
    this.propertyTypeName,
    this.propertyCategoryName,
  });

  factory HostListing.fromJson(Map<String, dynamic> json) => HostListing(
    id: json["_id"],
    userId: json["userId"],
    propertyCategory: json["propertyCategory"],
    propertyType: json["propertyType"],
    propertyName: json["propertyName"],
    propertyDesc: json["propertyDesc"],
    status: json["status"],
    address: json["address"] == null ? null : ListingAddress.fromJson(json["address"]),
    location: json["location"] == null ? [] : List<double>.from(json["location"]!.map((x) => x?.toDouble())),
    guest: json["guest"] == null ? null : Guest.fromJson(json["guest"]),
    availability: json["availability"],
    accomodation: json["accomodation"] == null ? null : Accomodation.fromJson(json["accomodation"]),
    totalCleanlinessRate: json["totalCleanlinessRate"],
    totalAccuracyRate: json["totalAccuracyRate"],
    totalCommunicationRate: json["totalCommunicationRate"],
    totalLocationRate: json["totalLocationRate"],
    totalValueRate: json["totalValueRate"],
    totalCheckInRate: json["totalCheckInRate"],
    totalRatingCount: json["totalRatingCount"],
    totalReviewCount: json["totalReviewCount"],
    cancellationPolicyId: json["cancellationPolicyId"],
    softdel: json["softdel"],
    events: json["events"] == null ? [] : List<dynamic>.from(json["events"]!.map((x) => x)),
    reviewRating: json["reviewRating"] == null ? [] : List<dynamic>.from(json["reviewRating"]!.map((x) => x)),
    schedule: json["schedule"] == null ? [] : List<dynamic>.from(json["schedule"]!.map((x) => x)),
    placesToOffer: json["placesToOffer"] == null ? [] : List<dynamic>.from(json["placesToOffer"]!.map((x) => x)),
    createdAt: json["createdAt"],
    updatedAt: json["updatedAt"],
    v: json["__v"],
    progress: json["progress"],
    userData: json["userData"] == null ? null : UserData.fromJson(json["userData"]),
    attachmentData: json["attachmentData"] == null ? null : AttachmentData.fromJson(json["attachmentData"]),
    priceData: json["priceData"] == null ? null : PriceData.fromJson(json["priceData"]),
    propertyTypeName: json["propertyTypeName"] == null ? null : PropertyTypeName.fromJson(json["propertyTypeName"]),
    propertyCategoryName: json["propertyCategoryName"] == null ? null : PropertyCategoryName.fromJson(json["propertyCategoryName"]),
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "userId": userId,
    "propertyCategory": propertyCategory,
    "propertyType": propertyType,
    "propertyName": propertyName,
    "propertyDesc": propertyDesc,
    "status": status,
    "address": address?.toJson(),
    "location": location == null ? [] : List<dynamic>.from(location!.map((x) => x)),
    "guest": guest?.toJson(),
    "availability": availability,
    "accomodation": accomodation?.toJson(),
    "totalCleanlinessRate": totalCleanlinessRate,
    "totalAccuracyRate": totalAccuracyRate,
    "totalCommunicationRate": totalCommunicationRate,
    "totalLocationRate": totalLocationRate,
    "totalValueRate": totalValueRate,
    "totalCheckInRate": totalCheckInRate,
    "totalRatingCount": totalRatingCount,
    "totalReviewCount": totalReviewCount,
    "cancellationPolicyId": cancellationPolicyId,
    "softdel": softdel,
    "events": events == null ? [] : List<dynamic>.from(events!.map((x) => x)),
    "reviewRating": reviewRating == null ? [] : List<dynamic>.from(reviewRating!.map((x) => x)),
    "schedule": schedule == null ? [] : List<dynamic>.from(schedule!.map((x) => x)),
    "placesToOffer": placesToOffer == null ? [] : List<dynamic>.from(placesToOffer!.map((x) => x)),
    "createdAt": createdAt,
    "updatedAt": updatedAt,
    "__v": v,
    "progress": progress,
    "userData": userData?.toJson(),
    "attachmentData": attachmentData?.toJson(),
    "priceData": priceData?.toJson(),
    "propertyTypeName": propertyTypeName?.toJson(),
    "propertyCategoryName": propertyCategoryName?.toJson(),
  };
}

class Accomodation {
  int? bedRoomCount;
  List<BedRoomBedtype>? bedRoomBedtype;
  BathRoom? bathRoom;

  Accomodation({
    this.bedRoomCount,
    this.bedRoomBedtype,
    this.bathRoom,
  });

  factory Accomodation.fromJson(Map<String, dynamic> json) => Accomodation(
    bedRoomCount: json["bedRoomCount"],
    bedRoomBedtype: json["bedRoomBedtype"] == null ? [] : List<BedRoomBedtype>.from(json["bedRoomBedtype"]!.map((x) => BedRoomBedtype.fromJson(x))),
    bathRoom: json["bathRoom"] == null ? null : BathRoom.fromJson(json["bathRoom"]),
  );

  Map<String, dynamic> toJson() => {
    "bedRoomCount": bedRoomCount,
    "bedRoomBedtype": bedRoomBedtype == null ? [] : List<dynamic>.from(bedRoomBedtype!.map((x) => x.toJson())),
    "bathRoom": bathRoom?.toJson(),
  };
}

class BathRoom {
  int? bathRoomCount;
  bool? shared;

  BathRoom({
    this.bathRoomCount,
    this.shared,
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
  String? bedRoom;
  String? bedType;
  int? bedCount;
  String? id;

  BedRoomBedtype({
    this.bedRoom,
    this.bedType,
    this.bedCount,
    this.id,
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

class ListingAddress {
  String? city;
  String? state;
  String? country;
  String? zipcode;
  String? address;
  String? landmark;
  String? location;
  List<double>? coordinates;

  ListingAddress({
    this.city,
    this.state,
    this.country,
    this.zipcode,
    this.address,
    this.landmark,
    this.location,
    this.coordinates,
  });

  factory ListingAddress.fromJson(Map<String, dynamic> json) => ListingAddress(
    city: json["city"],
    state: json["state"],
    country: json["country"],
    zipcode: json["zipcode"],
    address: json["address"],
    landmark: json["landmark"],
    location: json["location"],
    coordinates: json["coordinates"] == null ? [] : List<double>.from(json["coordinates"]!.map((x) => x?.toDouble())),
  );

  Map<String, dynamic> toJson() => {
    "city": city,
    "state": state,
    "country": country,
    "zipcode": zipcode,
    "address": address,
    "landmark": landmark,
    "location": location,
    "coordinates": coordinates == null ? [] : List<dynamic>.from(coordinates!.map((x) => x)),
  };
}

class AttachmentData {
  String? id;
  String? listingId;
  int? v;
  List<dynamic>? amenity;
  String? createdAt;
  Image? image;
  List<dynamic>? rules;
  String? updatedAt;

  AttachmentData({
    this.id,
    this.listingId,
    this.v,
    this.amenity,
    this.createdAt,
    this.image,
    this.rules,
    this.updatedAt,
  });

  factory AttachmentData.fromJson(Map<String, dynamic> json) => AttachmentData(
    id: json["_id"],
    listingId: json["listingId"],
    v: json["__v"],
    amenity: json["amenity"] == null ? [] : List<dynamic>.from(json["amenity"]!.map((x) => x)),
    createdAt: json["createdAt"],
    image: json["image"] == null ? null : Image.fromJson(json["image"]),
    rules: json["rules"] == null ? [] : List<dynamic>.from(json["rules"]!.map((x) => x)),
    updatedAt: json["updatedAt"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "listingId": listingId,
    "__v": v,
    "amenity": amenity == null ? [] : List<dynamic>.from(amenity!.map((x) => x)),
    "createdAt": createdAt,
    "image": image?.toJson(),
    "rules": rules == null ? [] : List<dynamic>.from(rules!.map((x) => x)),
    "updatedAt": updatedAt,
  };
}

class Image {
  String? coverImage;
  List<GroupImage>? groupImage;
  String? imageId;
  String? publicId;

  Image({
    this.coverImage,
    this.groupImage,
    this.imageId,
    this.publicId,
  });

  factory Image.fromJson(Map<String, dynamic> json) => Image(
    coverImage: json["coverImage"],
    groupImage: json["groupImage"] == null ? [] : List<GroupImage>.from(json["groupImage"]!.map((x) => GroupImage.fromJson(x))),
    imageId: json["imageId"],
    publicId: json["publicId"],
  );

  Map<String, dynamic> toJson() => {
    "coverImage": coverImage,
    "groupImage": groupImage == null ? [] : List<dynamic>.from(groupImage!.map((x) => x.toJson())),
    "imageId": imageId,
    "publicId": publicId,
  };
}

class GroupImage {
  String? imagePath;
  String? groupImageId;
  String? publicId;
  String? id;

  GroupImage({
    this.imagePath,
    this.groupImageId,
    this.publicId,
    this.id,
  });

  factory GroupImage.fromJson(Map<String, dynamic> json) => GroupImage(
    imagePath: json["imagePath"],
    groupImageId: json["groupImageId"],
    publicId: json["publicId"],
    id: json["_id"],
  );

  Map<String, dynamic> toJson() => {
    "imagePath": imagePath,
    "groupImageId": groupImageId,
    "publicId": publicId,
    "_id": id,
  };
}

class Guest {
  int? adult;
  int? children;
  int? pets;

  Guest({
    this.adult,
    this.children,
    this.pets,
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

class PriceData {
  String? id;
  String? listingId;
  int? v;
  int? availableCount;
  List<dynamic>? blockedDates;
  BookingType? bookingType;
  String? createdAt;
  bool? maxNightSelect;
  Pricing? pricing;
  String? updatedAt;

  PriceData({
    this.id,
    this.listingId,
    this.v,
    this.availableCount,
    this.blockedDates,
    this.bookingType,
    this.createdAt,
    this.maxNightSelect,
    this.pricing,
    this.updatedAt,
  });

  factory PriceData.fromJson(Map<String, dynamic> json) => PriceData(
    id: json["_id"],
    listingId: json["listingId"],
    v: json["__v"],
    availableCount: json["availableCount"],
    blockedDates: json["blockedDates"] == null ? [] : List<dynamic>.from(json["blockedDates"]!.map((x) => x)),
    bookingType: json["bookingType"] == null ? null : BookingType.fromJson(json["bookingType"]),
    createdAt: json["createdAt"],
    maxNightSelect: json["maxNightSelect"],
    pricing: json["pricing"] == null ? null : Pricing.fromJson(json["pricing"]),
    updatedAt: json["updatedAt"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "listingId": listingId,
    "__v": v,
    "availableCount": availableCount,
    "blockedDates": blockedDates == null ? [] : List<dynamic>.from(blockedDates!.map((x) => x)),
    "bookingType": bookingType?.toJson(),
    "createdAt": createdAt,
    "maxNightSelect": maxNightSelect,
    "pricing": pricing?.toJson(),
    "updatedAt": updatedAt,
  };
}

class BookingType {
  int? extraGuest;
  int? extraGuestFee;
  int? maximumNight;
  int? minimumNight;

  BookingType({
    this.extraGuest,
    this.extraGuestFee,
    this.maximumNight,
    this.minimumNight,
  });

  factory BookingType.fromJson(Map<String, dynamic> json) => BookingType(
    extraGuest: json["extraGuest"],
    extraGuestFee: json["extraGuestFee"],
    maximumNight: json["maximumNight"],
    minimumNight: json["minimumNight"],
  );

  Map<String, dynamic> toJson() => {
    "extraGuest": extraGuest,
    "extraGuestFee": extraGuestFee,
    "maximumNight": maximumNight,
    "minimumNight": minimumNight,
  };
}

class Pricing {
  int? baseFare;
  int? discountPercentage;
  int? discountedPrice;
  int? perDay;
  int? perHour;

  Pricing({
    this.baseFare,
    this.discountPercentage,
    this.discountedPrice,
    this.perDay,
    this.perHour,
  });

  factory Pricing.fromJson(Map<String, dynamic> json) => Pricing(
    baseFare: json["baseFare"],
    discountPercentage: json["discountPercentage"],
    discountedPrice: json["discountedPrice"],
    perDay: json["perDay"],
    perHour: json["perHour"],
  );

  Map<String, dynamic> toJson() => {
    "baseFare": baseFare,
    "discountPercentage": discountPercentage,
    "discountedPrice": discountedPrice,
    "perDay": perDay,
    "perHour": perHour,
  };
}

class PropertyCategoryName {
  String? id;
  String? category;
  String? icon;
  String? createdAt;
  String? updatedAt;
  int? v;
  bool? isAll;

  PropertyCategoryName({
    this.id,
    this.category,
    this.icon,
    this.createdAt,
    this.updatedAt,
    this.v,
    this.isAll,
  });

  factory PropertyCategoryName.fromJson(Map<String, dynamic> json) => PropertyCategoryName(
    id: json["_id"],
    category: json["category"],
    icon: json["icon"],
    createdAt: json["createdAt"],
    updatedAt: json["updatedAt"],
    v: json["__v"],
    isAll: json["isAll"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "category": category,
    "icon": icon,
    "createdAt": createdAt,
    "updatedAt": updatedAt,
    "__v": v,
    "isAll": isAll,
  };
}

class PropertyTypeName {
  String? id;
  String? categoryId;
  String? property;
  String? icon;
  String? desc;
  String? createdAt;
  int? v;

  PropertyTypeName({
    this.id,
    this.categoryId,
    this.property,
    this.icon,
    this.desc,
    this.createdAt,
    this.v,
  });

  factory PropertyTypeName.fromJson(Map<String, dynamic> json) => PropertyTypeName(
    id: json["_id"],
    categoryId: json["categoryId"],
    property: json["property"],
    icon: json["icon"],
    desc: json["desc"],
    createdAt: json["createdAt"],
    v: json["__v"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "categoryId": categoryId,
    "property": property,
    "icon": icon,
    "desc": desc,
    "createdAt": createdAt,
    "__v": v,
  };
}

class UserData {
  String? id;
  String? firstname;
  String? lastname;
  String? fullname;
  String? phoneCode;
  String? phone;
  String? email;
  String? profileImage;
  String? publicId;
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
  PasswordKeys? passwordKeys;
  UserDataAddress? address;
  String? currency;
  bool? verified;
  String? verifiedBy;
  bool? isActive;
  int? emailOtp;
  String? userBankId;
  bool? softdel;
  dynamic refBy;
  String? fcmId;
  String? permitCopy;
  int? cancellationPolicyId;
  bool? instantBooking;
  List<dynamic>? document;
  String? verifiedDate;
  String? createdAt;
  String? updatedAt;
  String? hash;
  String? salt;
  int? v;

  UserData({
    this.id,
    this.firstname,
    this.lastname,
    this.fullname,
    this.phoneCode,
    this.phone,
    this.email,
    this.profileImage,
    this.publicId,
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
    this.passwordKeys,
    this.address,
    this.currency,
    this.verified,
    this.verifiedBy,
    this.isActive,
    this.emailOtp,
    this.userBankId,
    this.softdel,
    this.refBy,
    this.fcmId,
    this.permitCopy,
    this.cancellationPolicyId,
    this.instantBooking,
    this.document,
    this.verifiedDate,
    this.createdAt,
    this.updatedAt,
    this.hash,
    this.salt,
    this.v,
  });

  factory UserData.fromJson(Map<String, dynamic> json) => UserData(
    id: json["_id"],
    firstname: json["firstname"],
    lastname: json["lastname"],
    fullname: json["fullname"],
    phoneCode: json["phoneCode"],
    phone: json["phone"],
    email: json["email"],
    profileImage: json["profileImage"],
    publicId: json["publicId"],
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
    passwordKeys: json["passwordKeys"] == null ? null : PasswordKeys.fromJson(json["passwordKeys"]),
    address: json["address"] == null ? null : UserDataAddress.fromJson(json["address"]),
    currency: json["currency"],
    verified: json["verified"],
    verifiedBy: json["verifiedBy"],
    isActive: json["isActive"],
    emailOtp: json["emailOtp"],
    userBankId: json["userBankId"],
    softdel: json["softdel"],
    refBy: json["refBy"],
    fcmId: json["fcmId"],
    permitCopy: json["permitCopy"],
    cancellationPolicyId: json["cancellationPolicyId"],
    instantBooking: json["instantBooking"],
    document: json["document"] == null ? [] : List<dynamic>.from(json["document"]!.map((x) => x)),
    verifiedDate: json["verifiedDate"],
    createdAt: json["createdAt"],
    updatedAt: json["updatedAt"],
    hash: json["hash"],
    salt: json["salt"],
    v: json["__v"],
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
    "publicId": publicId,
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
    "passwordKeys": passwordKeys?.toJson(),
    "address": address?.toJson(),
    "currency": currency,
    "verified": verified,
    "verifiedBy": verifiedBy,
    "isActive": isActive,
    "emailOtp": emailOtp,
    "userBankId": userBankId,
    "softdel": softdel,
    "refBy": refBy,
    "fcmId": fcmId,
    "permitCopy": permitCopy,
    "cancellationPolicyId": cancellationPolicyId,
    "instantBooking": instantBooking,
    "document": document == null ? [] : List<dynamic>.from(document!.map((x) => x)),
    "verifiedDate": verifiedDate,
    "createdAt": createdAt,
    "updatedAt": updatedAt,
    "hash": hash,
    "salt": salt,
    "__v": v,
  };
}

class UserDataAddress {
  List<dynamic>? coordinates;

  UserDataAddress({
    this.coordinates,
  });

  factory UserDataAddress.fromJson(Map<String, dynamic> json) => UserDataAddress(
    coordinates: json["coordinates"] == null ? [] : List<dynamic>.from(json["coordinates"]!.map((x) => x)),
  );

  Map<String, dynamic> toJson() => {
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

class PrivilegeCategory {
  String? id;
  String? privilegeId;
  String? name;
  String? description;
  dynamic deletedAt;
  String? createdAt;
  String? updatedAt;
  int? v;

  PrivilegeCategory({
    this.id,
    this.privilegeId,
    this.name,
    this.description,
    this.deletedAt,
    this.createdAt,
    this.updatedAt,
    this.v,
  });

  factory PrivilegeCategory.fromJson(Map<String, dynamic> json) => PrivilegeCategory(
    id: json["_id"],
    privilegeId: json["privilegeId"],
    name: json["name"],
    description: json["description"],
    deletedAt: json["deletedAt"],
    createdAt: json["createdAt"],
    updatedAt: json["updatedAt"],
    v: json["__v"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "privilegeId": privilegeId,
    "name": name,
    "description": description,
    "deletedAt": deletedAt,
    "createdAt": createdAt,
    "updatedAt": updatedAt,
    "__v": v,
  };
}

class PrivilegeItem {
  String? inputType;
  String? id;
  String? privilegeId;
  String? privilegeCategoryId;
  String? name;
  String? description;
  String? icon;
  String? publicId;
  dynamic deletedAt;
  String? createdAt;
  String? updatedAt;
  int? v;

  PrivilegeItem({
    this.inputType,
    this.id,
    this.privilegeId,
    this.privilegeCategoryId,
    this.name,
    this.description,
    this.icon,
    this.publicId,
    this.deletedAt,
    this.createdAt,
    this.updatedAt,
    this.v,
  });

  factory PrivilegeItem.fromJson(Map<String, dynamic> json) => PrivilegeItem(
    inputType: json["inputType"],
    id: json["_id"],
    privilegeId: json["privilegeId"],
    privilegeCategoryId: json["privilegeCategoryId"],
    name: json["name"],
    description: json["description"],
    icon: json["icon"],
    publicId: json["publicId"],
    deletedAt: json["deletedAt"],
    createdAt: json["createdAt"],
    updatedAt: json["updatedAt"],
    v: json["__v"],
  );

  Map<String, dynamic> toJson() => {
    "inputType": inputType,
    "_id": id,
    "privilegeId": privilegeId,
    "privilegeCategoryId": privilegeCategoryId,
    "name": name,
    "description": description,
    "icon": icon,
    "publicId": publicId,
    "deletedAt": deletedAt,
    "createdAt": createdAt,
    "updatedAt": updatedAt,
    "__v": v,
  };
}

class Privilege {
  String? id;
  String? name;
  String? description;
  dynamic deletedAt;
  String? createdAt;
  String? updatedAt;
  int? v;

  Privilege({
    this.id,
    this.name,
    this.description,
    this.deletedAt,
    this.createdAt,
    this.updatedAt,
    this.v,
  });

  factory Privilege.fromJson(Map<String, dynamic> json) => Privilege(
    id: json["_id"],
    name: json["name"],
    description: json["description"],
    deletedAt: json["deletedAt"],
    createdAt: json["createdAt"],
    updatedAt: json["updatedAt"],
    v: json["__v"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "name": name,
    "description": description,
    "deletedAt": deletedAt,
    "createdAt": createdAt,
    "updatedAt": updatedAt,
    "__v": v,
  };
}

class Validation {
  Validation();

  factory Validation.fromJson(Map<String, dynamic> json) => Validation(
  );

  Map<String, dynamic> toJson() => {
  };
}
