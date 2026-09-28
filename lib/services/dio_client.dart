import 'package:dio/dio.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

import '../utils/utils.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._();
  static Dio? _dio;

  ApiClient._() {
    Duration millisec = const Duration(milliseconds: 10000);
    _dio = Dio(BaseOptions(connectTimeout: millisec));
    _dio!.options.baseUrl = EndPointConstants.baseurl;
    // _dio!.options.baseUrl = 'https://airstarapi.abservetechdemo.com/';
    //_dio!.options.baseUrl = 'https://airstar.abservetechdemo.com/';
    //_dio!.options.baseUrl = 'https://airstar.abservetechdemo.com';
    _dio!.interceptors.addAll([
      TokenOnHeaderInterceptor(),
      PrettyDioLogger(
        requestHeader: true,
        requestBody: true,
        responseBody: true,
        responseHeader: true,
        error: true,
        request: true,
        logPrint: (object) {
          Logger.appLogs("$object");
        },
      )
    ]);
  }

  factory ApiClient() => _instance;

  Future<dynamic> get(String url,
      {Map<String, dynamic>? queryParameters}) async {
    try {
      Response response;
      response = await _dio!.get(
        url,
        queryParameters: queryParameters,
      );
      final data = response.data;
      // Logger.appLogs('responseDio:: $data');

      return data;
    } on DioException catch (error) {
      if (error.response != null) {
        // Logger.appLogs('errorDio:: $error');
        throw AppException(
          error: error,
          type: ErrorType.dioError,
          statusCode: error.response!.statusCode,
        );
      }
    } catch (error) {
      throw AppException(
        error: error.toString(),
        type: ErrorType.appError,
      );
    }
  }

  Future<dynamic> post(String url, {body, Options? options, Map<String, dynamic>? queryParameters}) async {
    try {
      Response response;

      response = await _dio!.post(url, data: body, options: options, queryParameters: queryParameters);

      Logger.appLogs("response.statusCode ${response.statusCode}");

      final data = response.data;
      return data;
    } on DioException catch (error) {
      if (error.response != null) {
        // Logger.appLogs('errorDio:: $error');
        throw AppException(
            error: error,
            type: ErrorType.dioError,
            statusCode: error.response!.statusCode);
      }
    } catch (error) {
      // Logger.appLogs('errorPostStacktrace:: $stacktrace');
      throw AppException(
        error: error,
        type: ErrorType.appError,
      );
    }
  }

  Future<dynamic> put(String url, {body}) async {
    try {
      Response response;

      response = await _dio!.put(url, data: body);
      final data = response.data;
      return data;
    } on DioException catch (error) {
      if (error.response != null) {
        throw AppException(
            error: error,
            type: ErrorType.dioError,
            statusCode: error.response!.statusCode);
      }
    } catch (error) {
      // Logger.appLogs('errorPutStacktrace:: $stacktrace');
      throw AppException(
        error: error,
        type: ErrorType.appError,
      );
    }
  }

  Future<dynamic> delete(String url, {body, Map<String, dynamic>? queryParameters}) async {
    try {
      Response response;

      response = await _dio!.delete(url, data: body, queryParameters: queryParameters);
      final data = response.data;
      return data;
    } on DioException catch (error) {
      if (error.response != null) {
        throw AppException(
            error: error,
            type: ErrorType.dioError,
            statusCode: error.response!.statusCode);
      }
    } catch (error) {
      // Logger.appLogs('errorPutStacktrace:: $stacktrace');
      throw AppException(
        error: error,
        type: ErrorType.appError,
      );
    }
  }
}

/// Describes the info of file to upload.
// class FileInfo {
//   FileInfo(this.file, this.fileName, this.fieldName);

//   /// The file to upload.
//   final File file;

//   /// The file name which the server will receive.
//   final String fileName;

//   /// This field name will be used in the params for this file
//   final String fieldName;
// }

class TokenOnHeaderInterceptor extends Interceptor {
  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    try {
      String? token = '';
      /***********************Get your token here****************************/
      //TODO Write your token generation code and pass through the headers

      /********************************************************************/
      token = await PreferenceHelper.getString(PrefConstant.authToken);
      var storage = AppSecureStorage.getInstance();
      var oldLang = await storage.readSecureData(PrefConstant.currentLanguage);
      print(token);
      options.headers['Authorization'] = '$token';
      options.headers['Accept-Language'] = '$oldLang';
      // Logger.appLogs('auth_token:: $token');
      super.onRequest(options, handler);
    } catch (error) {
      AppException(
        error: Strings.checkInternet,
        type: ErrorType.appError,
      );
    }
  }
}
