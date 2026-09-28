import 'package:google_sign_in/google_sign_in.dart';

import '../utils/config/debugger/logger.dart';

/// G-mail Login  FLow
class SignInWithGoogleService {
  final _googleSignIn = GoogleSignIn.instance;
  bool _isGoogleSignInInitialized = false;

  SignInWithGoogleService() {
    _initializeGoogleSignIn();
  }

  Future<void> _initializeGoogleSignIn() async {
    try {
      await _googleSignIn.initialize();
      _isGoogleSignInInitialized = true;
    } catch (e) {
      Logger.appLogs('Failed to initialize Google Sign-In: $e');
    }
  }

  /// Always check Google sign in initialization before use
  Future<void> _ensureGoogleSignInInitialized() async {
    if (!_isGoogleSignInInitialized) {
      await _initializeGoogleSignIn();
    }
  }

  Future<GoogleSignInAccount> signInWithGoogle() async {
    await _ensureGoogleSignInInitialized();

    try {
      final GoogleSignInAccount account = await _googleSignIn.authenticate(
        // These scopes ensure you get an ID Token and basic user info.
        // The resulting authentication object will also contain an Access Token.
        scopeHint: ['openid', 'profile', 'email'],
      );
      return account;
    } on GoogleSignInException catch (e) {
      Logger.appLogs(
        'Google Sign In error: code: ${e.code.name} description:${e.description} details:${e.details}, error: $e',
      );
      rethrow;
    } catch (error) {
      Logger.appLogs('Unexpected Google Sign-In error: $error');
      rethrow;
    }
  }

  GoogleSignInAuthentication getAuthTokens(GoogleSignInAccount account) {
    // authentication is now synchronous
    return account.authentication;
  }

  Future<String?> getAccessTokenForScopes(List<String> scopes) async {
    await _ensureGoogleSignInInitialized();

    try {
      final authClient = _googleSignIn.authorizationClient;

      // Try to get existing authorization
      var authorization = await authClient.authorizationForScopes(scopes);

      if (authorization == null) {
        // Request new authorization from user
        authorization = await authClient.authorizeScopes(scopes);
      }

      return authorization.accessToken;
    } catch (error) {
      print('Failed to get access token for scopes: $error');
      return null;
    }
  }

  Future<void> signOut() async {
    await _googleSignIn.signOut();
  }
}
