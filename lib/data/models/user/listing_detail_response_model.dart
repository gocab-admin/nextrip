class ListingDetailResponseModel {
  final String? message;
  final int? statusCode;
  final bool? status;
  final Data? data;
  final Validation? validation;

  ListingDetailResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
    this.validation,
  });

  factory ListingDetailResponseModel.fromJson(Map<String, dynamic>? json) {
    if (json == null) return ListingDetailResponseModel();

    return ListingDetailResponseModel(
      message: json["message"],
      statusCode: json["statusCode"],
      status: json["status"],
      data: json["data"] != null ? Data.fromJson(json["data"]) : null,
      validation: json["validation"] != null ? Validation.fromJson(json["validation"]) : null,
    );
  }

  Map<String, dynamic> toJson() => {
    "message": message,
    "statusCode": statusCode,
    "status": status,
    "data": data?.toJson(),
    "validation": validation?.toJson(),
  };
}

class Data {
  final MultipleCurrency? multipleCurrency;
  final List<Listing>? listing;
  final List<Privilege>? privileges;
  final List<PrivilegeCategory>? privilegeCategories;
  final List<PrivilegeItem>? privilegeItems;
  final List<CancellationPolicy>? cancellationPolicy;

  Data({
    this.multipleCurrency,
    this.listing,
    this.privileges,
    this.privilegeCategories,
    this.privilegeItems,
    this.cancellationPolicy,
  });

  factory Data.fromJson(Map<String, dynamic>? json) {
    if (json == null) return Data();

    return Data(
      multipleCurrency: json["multipleCurrency"] != null ? MultipleCurrency.fromJson(json["multipleCurrency"]) : null,
      listing: json["listing"] != null ? List<Listing>.from(json["listing"].map((x) => Listing.fromJson(x))) : null,
      privileges: json["privileges"] != null ? List<Privilege>.from(json["privileges"].map((x) => Privilege.fromJson(x))) : null,
      privilegeCategories: json["privilegeCategories"] != null ? List<PrivilegeCategory>.from(json["privilegeCategories"].map((x) => PrivilegeCategory.fromJson(x))) : null,
      privilegeItems: json["privilegeItems"] != null ? List<PrivilegeItem>.from(json["privilegeItems"].map((x) => PrivilegeItem.fromJson(x))) : null,
      cancellationPolicy: json["cancellationPolicy"] != null ? List<CancellationPolicy>.from(json["cancellationPolicy"].map((x) => CancellationPolicy.fromJson(x))) : null,
    );
  }

  Map<String, dynamic> toJson() => {
    "multipleCurrency": multipleCurrency?.toJson(),
    "listing": listing != null ? List<dynamic>.from(listing!.map((x) => x.toJson())) : null,
    "privileges": privileges != null ? List<dynamic>.from(privileges!.map((x) => x.toJson())) : null,
    "privilegeCategories": privilegeCategories != null ? List<dynamic>.from(privilegeCategories!.map((x) => x.toJson())) : null,
    "privilegeItems": privilegeItems != null ? List<dynamic>.from(privilegeItems!.map((x) => x.toJson())) : null,
    "cancellationPolicy": cancellationPolicy != null ? List<dynamic>.from(cancellationPolicy!.map((x) => x.toJson())) : null,
  };
}

class CancellationPolicy {
  final int? id;
  final String? title;
  final String? desc;

  CancellationPolicy({
    this.id,
    this.title,
    this.desc,
  });

  factory CancellationPolicy.fromJson(Map<String, dynamic>? json) {
    if (json == null) return CancellationPolicy();

    return CancellationPolicy(
      id: json["id"],
      title: json["title"],
      desc: json["desc"],
    );
  }

  Map<String, dynamic> toJson() => {
    "id": id,
    "title": title,
    "desc": desc,
  };
}

class Listing {
  final String? id;
  final String? propertyName;
  final String? propertyDesc;
  final String? status;
  final Address? address;
  final Guest? guest;
  final Accomodation? accomodation;
  final num? totalRatingCount;
  final num? totalReviewCount;
  final List<dynamic>? reviewRating;
  final List<dynamic>? schedule;
  final List<dynamic>? placesToOffer;
  final List<AttachmentDatum>? attachmentData;
  final List<PriceDatum>? priceData;
  final bool? isBooking;
  final bool? wishlist;
  final String? propertyTypeId;
  final String? propertyTypeName;
  final String? propertyCategoryId;
  final String? propertyCategoryName;
  final ProviderData? providerData;
  final num? cancellationPolicyId;

  Listing({
    this.id,
    this.propertyName,
    this.propertyDesc,
    this.status,
    this.address,
    this.guest,
    this.accomodation,
    this.totalRatingCount,
    this.totalReviewCount,
    this.reviewRating,
    this.schedule,
    this.placesToOffer,
    this.attachmentData,
    this.priceData,
    this.isBooking,
    this.wishlist,
    this.propertyTypeId,
    this.propertyTypeName,
    this.propertyCategoryId,
    this.propertyCategoryName,
    this.providerData,
    this.cancellationPolicyId,
  });

  factory Listing.fromJson(Map<String, dynamic>? json) {
    if (json == null) return Listing();

    return Listing(
      id: json["_id"],
      propertyName: json["propertyName"],
      propertyDesc: json["propertyDesc"],
      status: json["status"],
      address: json["address"] != null ? Address.fromJson(json["address"]) : null,
      guest: json["guest"] != null ? Guest.fromJson(json["guest"]) : null,
      accomodation: json["accomodation"] != null ? Accomodation.fromJson(json["accomodation"]) : null,
      totalRatingCount: json["totalRatingCount"],
      totalReviewCount: json["totalReviewCount"],
      reviewRating: json["reviewRating"] != null ? List<dynamic>.from(json["reviewRating"].map((x) => x)) : null,
      schedule: json["schedule"] != null ? List<dynamic>.from(json["schedule"].map((x) => x)) : null,
      placesToOffer: json["placesToOffer"] != null ? List<dynamic>.from(json["placesToOffer"].map((x) => x)) : null,
      attachmentData: json["attachmentData"] != null ? List<AttachmentDatum>.from(json["attachmentData"].map((x) => AttachmentDatum.fromJson(x))) : null,
      priceData: json["priceData"] != null ? List<PriceDatum>.from(json["priceData"].map((x) => PriceDatum.fromJson(x))) : null,
      isBooking: json["isBooking"],
      wishlist: json["wishlist"],
      propertyTypeId: json["propertyTypeId"],
      propertyTypeName: json["propertyTypeName"],
      propertyCategoryId: json["propertyCategoryId"],
      propertyCategoryName: json["propertyCategoryName"],
      providerData: json["providerData"] != null ? ProviderData.fromJson(json["providerData"]) : null,
      cancellationPolicyId: json["cancellationPolicyId"],
    );
  }

  Map<String, dynamic> toJson() => {
    "_id": id,
    "propertyName": propertyName,
    "propertyDesc": propertyDesc,
    "status": status,
    "address": address?.toJson(),
    "guest": guest?.toJson(),
    "accomodation": accomodation?.toJson(),
    "totalRatingCount": totalRatingCount,
    "totalReviewCount": totalReviewCount,
    "reviewRating": reviewRating != null ? List<dynamic>.from(reviewRating!.map((x) => x)) : null,
    "schedule": schedule != null ? List<dynamic>.from(schedule!.map((x) => x)) : null,
    "placesToOffer": placesToOffer != null ? List<dynamic>.from(placesToOffer!.map((x) => x)) : null,
    "attachmentData": attachmentData != null ? List<dynamic>.from(attachmentData!.map((x) => x.toJson())) : null,
    "priceData": priceData != null ? List<dynamic>.from(priceData!.map((x) => x.toJson())) : null,
    "isBooking": isBooking,
    "wishlist": wishlist,
    "propertyTypeId": propertyTypeId,
    "propertyTypeName": propertyTypeName,
    "propertyCategoryId": propertyCategoryId,
    "propertyCategoryName": propertyCategoryName,
    "providerData": providerData?.toJson(),
    "cancellationPolicyId": cancellationPolicyId,
  };
}

class Accomodation {
  final int? bedRoomCount;
  final List<BedRoomBedtype>? bedRoomBedtype;
  final BathRoom? bathRoom;

  Accomodation({
    this.bedRoomCount,
    this.bedRoomBedtype,
    this.bathRoom,
  });

  factory Accomodation.fromJson(Map<String, dynamic>? json) {
    if (json == null) return Accomodation();

    return Accomodation(
      bedRoomCount: json["bedRoomCount"],
      bedRoomBedtype: json["bedRoomBedtype"] != null ? List<BedRoomBedtype>.from(json["bedRoomBedtype"].map((x) => BedRoomBedtype.fromJson(x))) : null,
      bathRoom: json["bathRoom"] != null ? BathRoom.fromJson(json["bathRoom"]) : null,
    );
  }

  Map<String, dynamic> toJson() => {
    "bedRoomCount": bedRoomCount,
    "bedRoomBedtype": bedRoomBedtype != null ? List<dynamic>.from(bedRoomBedtype!.map((x) => x.toJson())) : null,
    "bathRoom": bathRoom?.toJson(),
  };
}

class BathRoom {
  final int? bathRoomCount;
  final bool? shared;

  BathRoom({
    this.bathRoomCount,
    this.shared,
  });

  factory BathRoom.fromJson(Map<String, dynamic>? json) {
    if (json == null) return BathRoom();

    return BathRoom(
      bathRoomCount: json["bathRoomCount"],
      shared: json["shared"],
    );
  }

  Map<String, dynamic> toJson() => {
    "bathRoomCount": bathRoomCount,
    "shared": shared,
  };
}

class BedRoomBedtype {
  final String? bedRoom;
  final String? bedType;
  final int? bedCount;
  final String? id;

  BedRoomBedtype({
    this.bedRoom,
    this.bedType,
    this.bedCount,
    this.id,
  });

  factory BedRoomBedtype.fromJson(Map<String, dynamic>? json) {
    if (json == null) return BedRoomBedtype();

    return BedRoomBedtype(
      bedRoom: json["bedRoom"],
      bedType: json["bedType"],
      bedCount: json["bedCount"],
      id: json["_id"],
    );
  }

  Map<String, dynamic> toJson() => {
    "bedRoom": bedRoom,
    "bedType": bedType,
    "bedCount": bedCount,
    "_id": id,
  };
}

class Address {
  final String? city;
  final String? state;
  final String? country;
  final String? zipcode;
  final String? address;
  final String? landmark;
  final String? location;
  final List<double>? coordinates;

  Address({
    this.city,
    this.state,
    this.country,
    this.zipcode,
    this.address,
    this.landmark,
    this.location,
    this.coordinates,
  });

  factory Address.fromJson(Map<String, dynamic>? json) {
    if (json == null) return Address();

    return Address(
      city: json["city"],
      state: json["state"],
      country: json["country"],
      zipcode: json["zipcode"],
      address: json["address"],
      landmark: json["landmark"],
      location: json["location"],
      coordinates: json["coordinates"] != null ? List<double>.from(json["coordinates"].map((x) => x?.toDouble())) : null,
    );
  }

  Map<String, dynamic> toJson() => {
    "city": city,
    "state": state,
    "country": country,
    "zipcode": zipcode,
    "address": address,
    "landmark": landmark,
    "location": location,
    "coordinates": coordinates != null ? List<dynamic>.from(coordinates!.map((x) => x)) : null,
  };
}

class AttachmentDatum {
  final Images? image;
  final List<dynamic>? rules;

  AttachmentDatum({
    this.image,
    this.rules,
  });

  factory AttachmentDatum.fromJson(Map<String, dynamic>? json) {
    if (json == null) return AttachmentDatum();

    return AttachmentDatum(
      image: json["image"] != null ? Images.fromJson(json["image"]) : null,
      rules: json["rules"] != null ? List<dynamic>.from(json["rules"].map((x) => x)) : null,
    );
  }

  Map<String, dynamic> toJson() => {
    "image": image?.toJson(),
    "rules": rules != null ? List<dynamic>.from(rules!.map((x) => x)) : null,
  };
}

class Images {
  final String? coverImage;
  final List<dynamic>? groupImage;
  final String? imageId;
  final String? publicId;

  Images({
    this.coverImage,
    this.groupImage,
    this.imageId,
    this.publicId,
  });

  factory Images.fromJson(Map<String, dynamic>? json) {
    if (json == null) return Images();

    return Images(
      coverImage: json["coverImage"],
      groupImage: json["groupImage"] != null ? List<dynamic>.from(json["groupImage"].map((x) => x)) : null,
      imageId: json["imageId"],
      publicId: json["publicId"],
    );
  }

  Map<String, dynamic> toJson() => {
    "coverImage": coverImage,
    "groupImage": groupImage != null ? List<dynamic>.from(groupImage!.map((x) => x)) : null,
    "imageId": imageId,
    "publicId": publicId,
  };
}

class Guest {
  final int? adult;
  final int? children;
  final int? pets;

  Guest({
    this.adult,
    this.children,
    this.pets,
  });

  factory Guest.fromJson(Map<String, dynamic>? json) {
    if (json == null) return Guest();

    return Guest(
      adult: json["adult"],
      children: json["children"],
      pets: json["pets"],
    );
  }

  Map<String, dynamic> toJson() => {
    "adult": adult,
    "children": children,
    "pets": pets,
  };
}

class PriceDatum {
  final List<dynamic>? blockedDates;
  final BookingType? bookingType;
  final Pricing? pricing;

  PriceDatum({
    this.blockedDates,
    this.bookingType,
    this.pricing,
  });

  factory PriceDatum.fromJson(Map<String, dynamic>? json) {
    if (json == null) return PriceDatum();

    return PriceDatum(
      blockedDates: json["blockedDates"] != null ? List<dynamic>.from(json["blockedDates"].map((x) => x)) : null,
      bookingType: json["bookingType"] != null ? BookingType.fromJson(json["bookingType"]) : null,
      pricing: json["pricing"] != null ? Pricing.fromJson(json["pricing"]) : null,
    );
  }

  Map<String, dynamic> toJson() => {
    "blockedDates": blockedDates != null ? List<dynamic>.from(blockedDates!.map((x) => x)) : null,
    "bookingType": bookingType?.toJson(),
    "pricing": pricing?.toJson(),
  };
}

class BookingType {
  final int? extraGuest;
  final int? extraGuestFee;
  final int? maximumNight;
  final int? minimumNight;

  BookingType({
    this.extraGuest,
    this.extraGuestFee,
    this.maximumNight,
    this.minimumNight,
  });

  factory BookingType.fromJson(Map<String, dynamic>? json) {
    if (json == null) return BookingType();

    return BookingType(
      extraGuest: json["extraGuest"],
      extraGuestFee: json["extraGuestFee"],
      maximumNight: json["maximumNight"],
      minimumNight: json["minimumNight"],
    );
  }

  Map<String, dynamic> toJson() => {
    "extraGuest": extraGuest,
    "extraGuestFee": extraGuestFee,
    "maximumNight": maximumNight,
    "minimumNight": minimumNight,
  };
}

class Pricing {
  num? baseFare;
  num? perDay;
  num? perHour;
  num? discountPercentage;
  num? discountedPrice;

  Pricing({
    this.baseFare,
    this.perDay,
    this.perHour,
    this.discountPercentage,
    this.discountedPrice,
  });

  factory Pricing.fromJson(Map<String, dynamic> json) => Pricing(
    baseFare: json["baseFare"],
    perDay: json["perDay"],
    perHour: json["perHour"],
    discountPercentage: json["discountPercentage"],
    discountedPrice: json["discountedPrice"],
  );

  Map<String, dynamic> toJson() => {
    "baseFare": baseFare,
    "perDay": perDay,
    "perHour": perHour,
    "discountPercentage": discountPercentage,
    "discountedPrice": discountedPrice,
  };
}

class ProviderData {
  final String? firstname;
  final String? id;
  final String? email;
  final DateTime? verifiedDate;
  final String? profileImage;

  ProviderData({
    this.firstname,
    this.id,
    this.email,
    this.verifiedDate,
    this.profileImage,
  });

  factory ProviderData.fromJson(Map<String, dynamic>? json) {
    if (json == null) return ProviderData();

    return ProviderData(
      firstname: json["firstname"],
      id: json["_id"],
      email: json["email"],
      verifiedDate: json["verifiedDate"] != null ? DateTime.parse(json["verifiedDate"]) : null,
      profileImage: json["profileImage"],
    );
  }

  Map<String, dynamic> toJson() => {
    "firstname": firstname,
    "_id": id,
    "email": email,
    "verifiedDate": verifiedDate?.toIso8601String(),
    "profileImage": profileImage,
  };
}

class MultipleCurrency {
  final int? exchangeRate;
  final String? toCode;
  final String? toSymbol;

  MultipleCurrency({
    this.exchangeRate,
    this.toCode,
    this.toSymbol,
  });

  factory MultipleCurrency.fromJson(Map<String, dynamic>? json) {
    if (json == null) return MultipleCurrency();

    return MultipleCurrency(
      exchangeRate: json["exchangeRate"],
      toCode: json["toCode"],
      toSymbol: json["toSymbol"],
    );
  }

  Map<String, dynamic> toJson() => {
    "exchangeRate": exchangeRate,
    "toCode": toCode,
    "toSymbol": toSymbol,
  };
}

class PrivilegeCategory {
  final String? id;
  final String? privilegeId;
  final String? name;
  final String? description;
  final dynamic deletedAt;
  final String? createdAt;
  final String? updatedAt;
  final int? v;

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

  factory PrivilegeCategory.fromJson(Map<String, dynamic>? json) {
    if (json == null) return PrivilegeCategory();

    return PrivilegeCategory(
      id: json["_id"],
      privilegeId: json["privilegeId"],
      name: json["name"],
      description: json["description"],
      deletedAt: json["deletedAt"],
      createdAt: json["createdAt"],
      updatedAt: json["updatedAt"],
      v: json["__v"],
    );
  }

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
  final String? inputType;
  final String? id;
  final String? privilegeId;
  final String? privilegeCategoryId;
  final String? name;
  final String? description;
  final String? icon;
  final String? publicId;
  final dynamic deletedAt;
  final String? createdAt;
  final String? updatedAt;
  final int? v;

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

  factory PrivilegeItem.fromJson(Map<String, dynamic>? json) {
    if (json == null) return PrivilegeItem();

    return PrivilegeItem(
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
  }

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
  final String? id;
  final String? name;
  final String? description;
  final dynamic deletedAt;
  final String? createdAt;
  final String? updatedAt;
  final int? v;

  Privilege({
    this.id,
    this.name,
    this.description,
    this.deletedAt,
    this.createdAt,
    this.updatedAt,
    this.v,
  });

  factory Privilege.fromJson(Map<String, dynamic>? json) {
    if (json == null) return Privilege();

    return Privilege(
      id: json["_id"],
      name: json["name"],
      description: json["description"],
      deletedAt: json["deletedAt"],
      createdAt: json["createdAt"],
      updatedAt: json["updatedAt"],
      v: json["__v"],
    );
  }

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

  factory Validation.fromJson(Map<String, dynamic>? json) => Validation();

  Map<String, dynamic> toJson() => {};
}