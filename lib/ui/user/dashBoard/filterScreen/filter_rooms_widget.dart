import 'package:airstar_flutter/viewModel/user/listing_view_model.dart';
import 'package:flutter/material.dart';

import 'package:airstar_flutter/utils/utils.dart';

enum RoomType {
  bedroom,
  bed,
  bathroom
}

class RoomsListWidget extends StatelessWidget {
  final ProductListingViewModel model;
  final RoomType roomType;
  final double height;
  final double horizontalPadding;
  final double borderRadius;
  final double fontSize;
  final int visibleLimit;

  const RoomsListWidget({
    Key? key,
    required this.model,
    required this.roomType,
    this.height = 40,
    this.horizontalPadding = 20,
    this.borderRadius = 25,
    this.fontSize = 14,
    this.visibleLimit = 4,
  }) : super(key: key);

  List<String> _getRoomItems() {
    List<dynamic> originalItems;
    switch (roomType) {
      case RoomType.bedroom:
        originalItems = model.bedrooms;
        break;
      case RoomType.bed:
        originalItems = model.beds;
        break;
      case RoomType.bathroom:
        originalItems = model.bathrooms;
        break;
    }

    if (originalItems.length <= visibleLimit) {
      return originalItems.map((e) => e.toString()).toList();
    }

    // Create a new list with the first (visibleLimit - 1) items plus the "4+" item
    List<String> limitedItems = originalItems
        .take(visibleLimit - 1)
        .map((e) => e.toString())
        .toList();
    limitedItems.add('${visibleLimit - 1}+');

    return limitedItems;
  }

  void _handleTap(int index, int totalItems) {
    // // If clicking the last item and it's a "4+" item
    // if (index == visibleLimit - 1 && totalItems > visibleLimit) {
    //   // You might want to handle this tap differently
    //   return;
    // }

    switch (roomType) {
      case RoomType.bedroom:
        model.updateCurrentBedroomIndex(index);
        break;
      case RoomType.bed:
        model.updateCurrentBedIndex(index);
        break;
      case RoomType.bathroom:
        model.updateCurrentBathroomIndex(index);
        break;
    }
  }

  int _getCurrentIndex() {
    switch (roomType) {
      case RoomType.bedroom:
        return model.currentBedroomIndex;
      case RoomType.bed:
        return model.currentBedIndex;
      case RoomType.bathroom:
        return model.currentBathroomIndex;
    }
  }

  @override
  Widget build(BuildContext context) {
    final items = _getRoomItems();
    final originalItemCount = _getOriginalItemCount();

    return Container(
      width: MediaQuery.of(context).size.width,
      height: height,
      margin: const EdgeInsets.symmetric(vertical: 10),
      child: ListView.builder(
        shrinkWrap: true,
        scrollDirection: Axis.horizontal,
        itemCount: items.length,
        itemBuilder: (context, index) => _buildRoomOption(index, items, originalItemCount),
      ),
    );
  }

  int _getOriginalItemCount() {
    switch (roomType) {
      case RoomType.bedroom:
        return model.bedrooms.length;
      case RoomType.bed:
        return model.beds.length;
      case RoomType.bathroom:
        return model.bathrooms.length;
    }
  }

  Widget _buildRoomOption(int index, List<String> items, int totalItems) {
    final isSelected = _getCurrentIndex() == index ;
     //   && !(index == visibleLimit - 1 && totalItems > visibleLimit);

    return GestureDetector(
      onTap: () => _handleTap(index, totalItems),
      child: Container(
        margin: const EdgeInsets.only(right: 10),
        padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
        decoration: BoxDecoration(
          border: Border.all(color: AppColorData.boxBorder),
          color: isSelected ? AppColorData.blackClr : Colors.transparent,
          borderRadius: BorderRadius.circular(borderRadius),
        ),
        child: Center(
          child: Text(
            items[index],
            style: TextStyle(
              fontWeight: FontWeight.w500,
              fontSize: fontSize,
              color: isSelected
                  ? AppColorData.appSecondaryColor
                  : AppColorData.blackButtonClr,
            ),
          ),
        ),
      ),
    );
  }
}


