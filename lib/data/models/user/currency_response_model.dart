// To parse this JSON data, do
//
//     final currencyResponseModel = currencyResponseModelFromJson(jsonString);

import 'dart:convert';

CurrencyResponseModel currencyResponseModelFromJson(String str) => CurrencyResponseModel.fromJson(json.decode(str));

String currencyResponseModelToJson(CurrencyResponseModel data) => json.encode(data.toJson());

class CurrencyResponseModel {
  String message;
  int statusCode;
  bool status;
  int totalCount;
  Data data;

  CurrencyResponseModel({
    required this.message,
    required this.statusCode,
    required this.status,
    required this.totalCount,
    required this.data,
  });

  factory CurrencyResponseModel.fromJson(Map<String, dynamic> json) => CurrencyResponseModel(
    message: json["message"],
    statusCode: json["statusCode"],
    status: json["status"],
    totalCount: json["totalCount"],
    data: Data.fromJson(json["data"]),
  );

  Map<String, dynamic> toJson() => {
    "message": message,
    "statusCode": statusCode,
    "status": status,
    "totalCount": totalCount,
    "data": data.toJson(),
  };
}

class Data {
  List<Currency> currency;

  Data({
    required this.currency,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    currency: List<Currency>.from(json["currency"].map((x) => Currency.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "currency": List<dynamic>.from(currency.map((x) => x.toJson())),
  };
}

class Currency {
  String id;
  String code;
  bool currencyDefault;
  String name;
  String? symbol;
  String exchangeRate;
  dynamic deletedAt;
  String createdAt;
  String updatedAt;
  int v;

  Currency({
    required this.id,
    required this.code,
    required this.currencyDefault,
    required this.name,
    this.symbol,
    required this.exchangeRate,
    required this.deletedAt,
    required this.createdAt,
    required this.updatedAt,
    required this.v,
  });

  factory Currency.fromJson(Map<String, dynamic> json) => Currency(
    id: json["_id"],
    code: json["code"],
    currencyDefault: json["default"],
    name: json["name"],
    symbol: json["symbol"],
    exchangeRate: json["exchange_rate"],
    deletedAt: json["deletedAt"],
    createdAt: json["createdAt"],
    updatedAt: json["updatedAt"],
    v: json["__v"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "code": code,
    "default": currencyDefault,
    "name": name,
    "symbol": symbol,
    "exchange_rate": exchangeRate,
    "deletedAt": deletedAt,
    "createdAt": createdAt,
    "updatedAt": updatedAt,
    "__v": v,
  };
}
