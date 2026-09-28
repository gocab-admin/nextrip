class AppValidators {
  final RegExp emailRegExp = RegExp(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$");

  bool isEmail(String email) {
    if (emailRegExp.hasMatch(email.trim())) {
      return true;
    }
    return false;
  }

  bool isMobileNumber(String value) {
    if (value.length >= 8) {
      return true;
    }
    return false;
  }

  bool isPassword(String password) {
    if (password.trim().length >= 6) {
      return true;
    }
    return false;
  }

  final RegExp nameRegExp = RegExp(r'^[a-zA-Z ]+$');

  bool isName(String name) {
    final trimmedName = name.trim();
    if (nameRegExp.hasMatch(trimmedName) && trimmedName.length >= 3) {
      return true;
    }
    return false;
  }

  String? validateEmail(String email) {
    if (email.isEmpty) {
      return 'Please enter email address';
    } else if (!emailRegExp.hasMatch(email.trim())) {
      return 'Enter a valid email address';
    }
    return null;
  }

  String? validateMobileNumber(String value) {
    if (value.isEmpty) {
      return 'please enter the phone number';
    } else {
      return 'phone number not valid';
    }
  }

  String? validateReason(String reason) {
    if (reason.isEmpty) {
      return 'Please enter reason';
    } else if (reason.length < 3) {
      return 'Please enter reason';
    }
    return null;
  }

  String? validatePassword(String oldPassword) {
    if (oldPassword.trim().isEmpty) {
      return 'Please enter a password';
    } else if (oldPassword.trim().length < 6) {
      return 'Enter a valid password';
    }
    return null;
  }

  String? validateConfirmPassword(String password, String confirmPassword) {
    if (password != confirmPassword) {
      return 'Password mismatch';
    }
    return null;
  }
}
