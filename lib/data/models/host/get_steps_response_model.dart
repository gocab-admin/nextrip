// To parse this JSON data, do
//
//     final getStepsResponseModel = getStepsResponseModelFromJson(jsonString);

import 'dart:convert';

GetStepsResponseModel getStepsResponseModelFromJson(String str) => GetStepsResponseModel.fromJson(json.decode(str));

String getStepsResponseModelToJson(GetStepsResponseModel data) => json.encode(data.toJson());

class GetStepsResponseModel {
  String? message;
  int? statusCode;
  bool? status;
  Data? data;

  GetStepsResponseModel({
    this.message,
    this.statusCode,
    this.status,
    this.data,
  });

  factory GetStepsResponseModel.fromJson(Map<String, dynamic> json) => GetStepsResponseModel(
    message: json["message"],
    statusCode: json["statusCode"],
    status: json["status"],
    data: json["data"] == null ? null : Data.fromJson(json["data"]),
  );

  Map<String, dynamic> toJson() => {
    "message": message,
    "statusCode": statusCode,
    "status": status,
    "data": data?.toJson(),
  };
}

class Data {
  List<Step>? steps;
  List<DataPage>? pages;

  Data({
    this.steps,
    this.pages,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    steps: json["steps"] == null ? [] : List<Step>.from(json["steps"]!.map((x) => Step.fromJson(x))),
    pages: json["pages"] == null ? [] : List<DataPage>.from(json["pages"]!.map((x) => DataPage.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "steps": steps == null ? [] : List<dynamic>.from(steps!.map((x) => x.toJson())),
    "pages": pages == null ? [] : List<dynamic>.from(pages!.map((x) => x.toJson())),
  };
}

class DataPage {
  String? name;
  Settings? settings;

  DataPage({
    this.name,
    this.settings,
  });

  factory DataPage.fromJson(Map<String, dynamic> json) => DataPage(
    name: json["name"],
    settings: json["settings"] == null ? null : Settings.fromJson(json["settings"]),
  );

  Map<String, dynamic> toJson() => {
    "name": name,
    "settings": settings?.toJson(),
  };
}

class Settings {
  Settings();

  factory Settings.fromJson(Map<String, dynamic> json) => Settings(
  );

  Map<String, dynamic> toJson() => {
  };
}

class Step {
  String? title;
  String? subTitle;
  String? description;
  String? icon;
  String? image;
  List<StepPage>? pages;

  Step({
    this.title,
    this.subTitle,
    this.description,
    this.icon,
    this.image,
    this.pages,
  });

  factory Step.fromJson(Map<String, dynamic> json) => Step(
    title: json["title"],
    subTitle: json["subTitle"],
    description: json["description"],
    icon: json["icon"],
    image: json["image"],
    pages: json["pages"] == null ? [] : List<StepPage>.from(json["pages"]!.map((x) => StepPage.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "title": title,
    "subTitle": subTitle,
    "description": description,
    "icon": icon,
    "image": image,
    "pages": pages == null ? [] : List<dynamic>.from(pages!.map((x) => x.toJson())),
  };
}

class StepPage {
  String? name;
  Settings? settings;
  bool? found;

  StepPage({
    this.name,
    this.settings,
    this.found,
  });

  factory StepPage.fromJson(Map<String, dynamic> json) => StepPage(
    name: json["name"],
    settings: json["settings"] == null ? null : Settings.fromJson(json["settings"]),
    found: json["found"],
  );

  Map<String, dynamic> toJson() => {
    "name": name,
    "settings": settings?.toJson(),
    "found": found,
  };
}
