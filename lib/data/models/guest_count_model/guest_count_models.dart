import '../../../viewModel/user/product_detail_view_model.dart';


class GuestCount {
  int adult;
  int children;
  int pets;

  GuestCount({
    this.adult = 1,
    this.children = 0,
    this.pets = 0,
  });

  Map<String, int> toMap() {
    return {
      'adult': adult,
      'children': children,
      'pets': pets,
    };
  }

  factory GuestCount.fromMap(Map<String, int> map) {
    return GuestCount(
      adult: map['adult'] ?? 1,
      children: map['children'] ?? 0,
      pets: map['pets'] ?? 0,
    );
  }

  // Method to update a guest count by GuestMode
  void updateGuest(GuestMode mode, int value) {
    switch (mode) {
      case GuestMode.Adult:
        if (value > 0) adult = value;
        break;
      case GuestMode.Children:
        if (value >= 0) children = value;
        break;
      case GuestMode.Pets:
        if (value >= 0) pets = value;
        break;
    }
  }

  int getByGuestMode(GuestMode mode) {
    switch (mode) {
      case GuestMode.Adult:
        return adult;
      case GuestMode.Children:
        return children;
      case GuestMode.Pets:
        return pets;
    }
  }
}