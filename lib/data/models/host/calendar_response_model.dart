import 'dart:convert';

CalendarResponseModel calendarResponseModelFromJson(String str) => CalendarResponseModel.fromJson(json.decode(str));

String calendarResponseModelToJson(CalendarResponseModel data) => json.encode(data.toJson());

class CalendarResponseModel {
  bool? status;
  String? message;
  int? statusCode;
  List<CalendarDatum>? data;

  CalendarResponseModel({
    this.status,
    this.message,
    this.statusCode,
    this.data,
  });

  factory CalendarResponseModel.fromJson(Map<String, dynamic> json) => CalendarResponseModel(
    status: json["status"],
    message: json["message"],
    statusCode: json["statusCode"],
    data: json["data"] == null ? [] : List<CalendarDatum>.from(json["data"]!.map((x) => CalendarDatum.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "status": status,
    "message": message,
    "statusCode": statusCode,
    "data": data == null ? [] : List<dynamic>.from(data!.map((x) => x.toJson())),
  };
}

class CalendarDatum {
  String? id;
  String? start;
  String? end;
  String? summary;
  List<Category>? categories;
  String? description;

  CalendarDatum({
    this.id,
    this.start,
    this.end,
    this.summary,
    this.categories,
    this.description,
  });

  factory CalendarDatum.fromJson(Map<String, dynamic> json) => CalendarDatum(
    id: json["_id"],
    start: json["start"],
    end: json["end"],
    summary: json["summary"],
    categories: json["categories"] == null ? [] : List<Category>.from(json["categories"]!.map((x) => Category.fromJson(x))),
    description: json["description"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "start": start,
    "end": end,
    "summary": summary,
    "categories": categories == null ? [] : List<dynamic>.from(categories!.map((x) => x.toJson())),
    "description": description,
  };
}

class Category {
  String? name;

  Category({
    this.name,
  });

  factory Category.fromJson(Map<String, dynamic> json) => Category(
    name: json["name"],
  );

  Map<String, dynamic> toJson() => {
    "name": name,
  };
}
