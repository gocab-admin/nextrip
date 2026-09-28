import 'package:dio/dio.dart';
import 'package:airstar_flutter/services/exceptions/error_constants.dart';

class DataException implements Exception {
  DataException({required this.message});

  DataException.fromDioError(DioExceptionType dioError) {
    switch (dioError) {
      case DioExceptionType.cancel:
        message = LocaleKeys.errorRequestCancelled;
        break;
      case DioExceptionType.connectionTimeout:
        message = LocaleKeys.errorConnectionTimeout;
        break;
      case DioExceptionType.receiveTimeout:
        message = LocaleKeys.errorReceiveTimeout;
        break;
      case DioExceptionType.badResponse:
        message = errorResponseHandler(dioError as DioException);
        break;
      case DioExceptionType.sendTimeout:
        message = LocaleKeys.errorSendTimeout;
        break;
      /* case DioExceptionType.other:
        message = LocaleKeys.errorSocketException;
        break;*/
      default:
        message = LocaleKeys.errorInternetConnection;
        break;
    }
  }

  String message = "";

  static String handleError(int statusCode) {
    switch (statusCode) {
      case 403:
        return LocaleKeys.errorForbidden;
      case 401:
        return LocaleKeys.errorSendTimeout;

      case 400:
        return LocaleKeys.errorBadRequest;
      case 404:
        return LocaleKeys.errorRequestNotFound;
      case 500:
        return LocaleKeys.errorInternalServer;
      default:
        return LocaleKeys.errorSomethingWentWrong;
    }
  }

  @override
  String toString() => message;

  static String errorResponseHandler(DioException error) {
    switch (error.response!.statusCode) {
      case 403:
        if (error.response!.data != null) {
          return error.response!.data['message'];
        } else {
          return LocaleKeys.errorForbidden;
        }
      case 401:
        if (error.response!.data != null) {
          return error.response!.data['message'];
        } else {
          return LocaleKeys.errorSendTimeout;
        }
      case 422:
        if (error.response!.data != null) {
          return error.response!.data['message'];
        } else {
          return LocaleKeys.errorSendTimeout;
        }
      case 400:
        if (error.response!.data != null) {
          return error.response!.data['message'];
        } else {
          return LocaleKeys.errorBadRequest;
        }
      case 404:
        if (error.response!.data != null) {
          return error.response!.data['message'];
        } else {
          return LocaleKeys.errorRequestNotFound;
        }
      case 500:
        if (error.response!.data != null) {
          return error.response!.data['message'];
        }
        return LocaleKeys.errorInternalServer;
      case 409:
        if (error.response!.data != null) {
          return error.response!.data['message'];
        }
        return LocaleKeys.errorSomethingWentWrong;
      default:
        return LocaleKeys.errorSomethingWentWrong;
    }
  }
}
