import 'dart:io';

import 'package:airstar_flutter/commonWidgets/common_widgets.dart';
import 'package:airstar_flutter/data/models/host/basic_details_response_model.dart';
import 'package:airstar_flutter/data/models/host/gallery_response_model.dart';
import 'package:airstar_flutter/data/models/host/get_images_response_model.dart';
import 'package:airstar_flutter/data/models/host/get_steps_response_model.dart';
import 'package:airstar_flutter/data/models/host/price_response_model.dart';
import 'package:airstar_flutter/data/repositories/host/create_listing_repo.dart';
import 'package:airstar_flutter/viewModel/base_view_model/base_view_model.dart';
import 'package:country_picker/country_picker.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/cupertino.dart';
import 'package:image_picker/image_picker.dart';

import '../../data/models/host/add_info_response_model.dart';
import '../../data/models/host/privileges_response_model.dart';
import '../../data/models/host/update_privileges_response_model.dart';
import '../../data/models/user/category_response_model.dart';
import '../../ui/host/create_listing_steps/step1_process.dart';
import '../../ui/host/create_listing_steps/step2_process.dart';
import '../../ui/host/create_listing_steps/step3_process.dart';
import '../../utils/utils.dart';
import '../user/common_viewmodel.dart';
import '../user/listing_view_model.dart';
import 'host_listing_view_model.dart';

class CreateListingViewModel extends BaseViewModel {
  final CreateListingRepository _createListingRepository =
      locator<CreateListingRepository>();

  GetStepsResponseModel? _getStepsResponseModel;
  CategoryResponseModel? _categoryResponseModel;
  BasicDetailsResponseModel? _basicDetailsResponseModel;
  PrivilegesResponseModel? _privilegesResponseModel;
  UpdatePrivilegesResponseModel? _updatePrivilegesResponseModel;
  GalleryResponseModel? _galleryResponseModel;
  AddInfoResponseModel? _addInfoResponseModel;
  GetImagesResponseModel? _getImagesResponseModel;
  PriceResponseModel? _priceResponseModel;

  GetStepsResponseModel? get getStepsResponseModel => _getStepsResponseModel;
  CategoryResponseModel? get categoryResponseModel => _categoryResponseModel;
  BasicDetailsResponseModel? get basicDetailsResponseModel =>
      _basicDetailsResponseModel;
  PrivilegesResponseModel? get privilegesResponseModel =>
      _privilegesResponseModel;
  UpdatePrivilegesResponseModel? get updatePrivilegesResponseModel =>
      _updatePrivilegesResponseModel;
  GalleryResponseModel? get galleryResponseModel => _galleryResponseModel;
  AddInfoResponseModel? get addInfoResponseModel => _addInfoResponseModel;
  GetImagesResponseModel? get getImagesResponseModel => _getImagesResponseModel;
  PriceResponseModel? get priceResponseModel => _priceResponseModel;

  TextEditingController cityController = TextEditingController();
  TextEditingController stateController = TextEditingController();
  TextEditingController postCodeController = TextEditingController();
  TextEditingController streetController = TextEditingController();
  TextEditingController landMarkController = TextEditingController();

  TextEditingController titleController = TextEditingController();
  TextEditingController descController = TextEditingController();

  TextEditingController priceController = TextEditingController();
  TextEditingController hourPriceController = TextEditingController();
  TextEditingController guestPriceController = TextEditingController();

  // Progress indicator condition

  String categoryId = "";
  String propertyId = "";

  int currentStepIndex = 0;
  int currentPageIndex = -1;
  bool isSwitch = true;

  void toggleSwitch(bool newValue) {
    isSwitch = newValue;
    notify();
  }

  List<Step> get steps => _getStepsResponseModel?.data?.steps ?? [];
  Step get currentStep => steps[currentStepIndex];
  StepPage? get currentPage =>
      currentPageIndex >= 0 ? currentStep.pages![currentPageIndex] : null;

  bool get isIntroPage => currentPageIndex == -1;

  double getStepProgress(int index) {
    if (index < currentStepIndex) return 1.0;
    if (index > currentStepIndex) return 0.0;

    final total = currentStep.pages!.length;
    return (currentPageIndex + 1) / total;
  }

  void nextPage() {
    if (isIntroPage) {
      // Move to the first page of the current step
      currentPageIndex = 0;
    } else if (currentPageIndex < currentStep.pages!.length - 1) {
      currentPageIndex++;
    } else if (currentStepIndex < steps.length - 1) {
      currentStepIndex++;
      currentPageIndex = -1; // Show intro page of the next step
    }
    notify();
  }

  void previousPage() {
    if (currentPageIndex > 0) {
      currentPageIndex--;
    } else if (currentPageIndex == 0) {
      currentPageIndex = -1; // Go back to intro
    } else if (currentStepIndex > 0) {
      currentStepIndex--;
      currentPageIndex = steps[currentStepIndex].pages!.length - 1;
    }
    notify();
  }

  int getProgressPercentage() {
    int completedSteps = currentStepIndex;
    int completedPagesInCurrentStep = currentPageIndex + 1;

    int totalProgress = 0;

    for (int i = 0; i < completedSteps; i++) {
      totalProgress += steps[i].pages?.length ?? 0;
    }

    totalProgress += completedPagesInCurrentStep;

    return totalProgress;
  }

  Future<void> restoreProgressListing(
    String listingId,
    ProductListingViewModel productModel,
    HostListingViewModel value,
  ) async {
    var listing = value.hostListingResponseModel?.data?.listing?.firstWhere(
      (l) => l.id == listingId,
    );

    if (listing != null) {
      if (listing.progress != null) {
        int progress = int.tryParse(listing.progress!) ?? 0;
        setProgressIndices(progress);
      } else {
        currentStepIndex = 0;
        currentPageIndex = -1;
      }

      categoryId = listing.propertyCategory ?? '';
      propertyId = listing.propertyType ?? '';
      titleController.text = listing.propertyName ?? '';
      descController.text = listing.propertyDesc ?? '';
      stateController.text = listing.address?.state ?? '';
      cityController.text = listing.address?.city ?? '';
      postCodeController.text = listing.address?.zipcode ?? '';
      streetController.text = listing.address?.address ?? '';
      landMarkController.text = listing.address?.landmark ?? '';
      productModel.address = listing.address?.location ?? '';
      productModel.country = listing.address?.country ?? '';
      productModel.addressState = listing.address?.state ?? '';
      productModel.postalCode = listing.address?.zipcode ?? '';
      productModel.city = listing.address?.city ?? '';

      getGuestBedDetails = [
        GuestBedDetails(title: "adults", count: listing.guest?.adult ?? 1),
        GuestBedDetails(title: "children", count: listing.guest?.children ?? 0),
        GuestBedDetails(title: "pets", count: listing.guest?.pets ?? 0),
        GuestBedDetails(
          title: "bedRooms",
          count: listing.accomodation?.bedRoomCount ?? 1,
        ),
        GuestBedDetails(
          title: "bathRooms",
          count: listing.accomodation?.bathRoom?.bathRoomCount ?? 0,
        ),
      ];
      // To the bed details
      bedrooms.clear();
      if (listing.accomodation?.bedRoomBedtype != null) {
        final bedRoomCount = listing.accomodation?.bedRoomCount ?? 1;

        for (int i = 1; i <= bedRoomCount; i++) {
          final bedsForRoom =
              listing.accomodation?.bedRoomBedtype
                  ?.where((b) => b.bedRoom == i)
                  .map(
                    (b) =>
                        BedType(type: b.bedType ?? '', count: b.bedCount ?? 0),
                  )
                  .toList() ??
              [];

          final defaultBeds = [
            BedType(type: "King", count: 1),
            BedType(type: "Queen", count: 0),
            BedType(type: "Double", count: 0),
          ];

          for (var beds in bedsForRoom) {
            final matchIndex = defaultBeds.indexWhere(
              (d) => d.type == beds.type,
            );
            if (matchIndex != -1) {
              defaultBeds[matchIndex] = beds;
            } else {
              defaultBeds.add(beds);
            }
          }
          bedrooms.add(Bedroom(label: "Bedroom $i", beds: defaultBeds));
        }
      }

      // TO restore the images
      selectedImages.clear();
      await fetchImages();

      final allGalleryImages = galleryResponseModel?.data?.galleryImage ?? [];

      if (listing.attachmentData?.image?.coverImage != null) {
        final coverImagePath = listing.attachmentData!.image!.coverImage!;

        try {
          final coverImage = allGalleryImages.firstWhere(
            (img) => img.path == coverImagePath,
          );
          selectedImages.add(coverImage.id!);
        } catch (e) {
          Logger.appLogs("Cover image not found in gallery: $coverImagePath");
        }
      }
      if (listing.attachmentData?.image?.groupImage != null) {
        for (var groupImage in listing.attachmentData!.image!.groupImage!) {
          if (groupImage.imagePath != null &&
              groupImage.imagePath!.isNotEmpty) {
            try {
              final galleryImage = allGalleryImages.firstWhere(
                (img) => img.path == groupImage.imagePath,
              );
              selectedImages.add(galleryImage.id!);
            } catch (e) {
              // Image not found in gallery, skip it
              Logger.appLogs(
                "Group image not found in gallery: ${groupImage.imagePath}",
              );
            }
          }
        }
      }
      selectedTempImages = List.from(selectedImages);
      // To restore the privileges
      if (value.hostListingResponseModel?.data?.privilegeItems != null) {
        List<String> selectedAmenityIds = value
            .hostListingResponseModel!
            .data!
            .privilegeItems!
            .map((item) => item.id ?? '')
            .where((id) => id.isNotEmpty)
            .toList();
        productModel.selectedAmenitiesId = selectedAmenityIds;
      }

      // RESTORE PRICING DATA
      if (listing.priceData != null) {
        // Restore daily and hourly prices
        priceController.text =
            listing.priceData!.pricing?.perDay?.toString() ?? '100';
        hourPriceController.text =
            listing.priceData!.pricing?.perHour?.toString() ?? '25';

        // Restore guest price
        guestPriceController.text =
            listing.priceData!.bookingType?.extraGuestFee?.toString() ?? '25';

        // Then update with restored values
        if (listing.priceData!.bookingType != null) {
          final bookingType = listing.priceData!.bookingType!;

          // Update available count
          final availableCountIndex = priceDetails.indexWhere(
            (item) => item.title == "availableCount",
          );
          if (availableCountIndex != -1) {
            priceDetails[availableCountIndex].count =
                listing.priceData!.availableCount ?? 1;
          }

          // Update switch state
          isSwitch = listing.priceData!.maxNightSelect ?? true;

          // Update minimum night
          final minNightIndex = priceDetails.indexWhere(
            (item) => item.title == "minimumNight",
          );
          if (minNightIndex != -1) {
            priceDetails[minNightIndex].count = bookingType.minimumNight ?? 1;
          }

          // Update maximum night
          final maxNightIndex = priceDetails.indexWhere(
            (item) => item.title == "maximumNight",
          );
          if (maxNightIndex != -1) {
            priceDetails[maxNightIndex].count = bookingType.maximumNight ?? 5;
          }

          // Update extra guest count
          final extraGuestIndex = priceDetails.indexWhere(
            (item) => item.title == "extraGuestAfter",
          );
          if (extraGuestIndex != -1) {
            priceDetails[extraGuestIndex].count = bookingType.extraGuest ?? 1;
          }
        }
      }
    } else {
      Logger.appLogs("Error in restoring the data >>> ");
    }

    notify();
  }

  GalleryImage? findImageById(String id) {
    final galleryList = galleryResponseModel?.data?.galleryImage ?? [];
    try {
      return galleryList.firstWhere((img) => img.id == id);
    } catch (e) {
      return null;
    }
  }

  void setProgressIndices(int progress) {
    if (progress <= 0) {
      currentStepIndex = 0;
      currentPageIndex = -1; // Intro page
      return;
    }

    int cumulativePages = 0;
    for (int stepIndex = 0; stepIndex < steps.length; stepIndex++) {
      final step = steps[stepIndex];
      final pagesInStep = step.pages?.length ?? 0;

      if (progress <= cumulativePages + pagesInStep) {
        currentStepIndex = stepIndex;
        currentPageIndex =
            progress - cumulativePages - 1; // Convert to 0-based index
        return;
      }

      cumulativePages += pagesInStep;
    }

    // If progress exceeds total pages, go to last step/page
    currentStepIndex = steps.length - 1;
    currentPageIndex = (steps.last.pages?.length ?? 1) - 1;
  }

  void resetProgress(ProductListingViewModel productModel) {
    currentStepIndex = 0;
    currentPageIndex = -1;

    categoryId = '';
    propertyId = '';
    productModel.address = '';
    productModel.addressState = '';
    productModel.city = '';
    productModel.country = '';
    selectedImages.clear();
    selectedTempImages.clear();
    bedrooms.clear();
    titleController.clear();
    descController.clear();
    streetController.clear();
    landMarkController.clear();
    cityController.clear();
    postCodeController.clear();

    getGuestBedDetails = [
      GuestBedDetails(title: "adults", count: 1),
      GuestBedDetails(title: "children", count: 0),
      GuestBedDetails(title: "pets", count: 0),
      GuestBedDetails(title: "bedRooms", count: 1),
      GuestBedDetails(title: "bathRooms", count: 0),
    ];
    productModel.selectedAmenitiesId = [];

    priceController.text = '100';
    hourPriceController.text = '25';
    guestPriceController.text = '25';
    isSwitch = true;
    notify();
  }

  final List<String> pageRoutes = [
    '/category-select/',
    '/select-place/',
    '/select-location/',
    '/confirm-location/',
    '/people-bed-count/',
    '/bed-types/',
    '/privileges/',
    '/image-select/',
    '/title/',
    '/description/',
    '/guest-price/',
    '/review-property-listing/',
  ];

  bool isNextButtonEnabled(ProductListingViewModel productModel) {
    if (isIntroPage) return true;
    return pageSteps[currentPage?.name]?.validate(productModel) ?? true;
  }

  Country? selectedCountryCode;

  void updateCountryCode(Country value) {
    selectedCountryCode = value;
    notify();
  }

  List<Bedroom> bedrooms = [];

  List<GuestBedDetails> getGuestBedDetails = [
    GuestBedDetails(title: "adults", count: 1),
    GuestBedDetails(title: "children", count: 0),
    GuestBedDetails(title: "pets", count: 0),
    GuestBedDetails(title: "bedRooms", count: 1),
    GuestBedDetails(title: "bathRooms", count: 0),
  ];

  List<PriceDetails> priceDetails = [];

  void buildPriceDetailsFromSettings(CommonViewModel commonModel) {
    final listings = commonModel.settingsResponseModel?.data?.listings;

    final bool showAvailableCount = listings?.availableCount == "1";
    final bool showAdditions = listings?.pricings?.additions == "1";

    final items = <PriceDetails>[];

    if (showAvailableCount) {
      items.add(
        PriceDetails(
          title: ("availableCount"),
          type: "Increment",
          dividerShow: true,
          count: 1,
          minimumRequired: 1,
        ),
      );
    }

    if (showAdditions) {
      items.addAll([
        PriceDetails(
          title: ("maximumNightSelect"),
          type: "Switch",
          dividerShow: true,
          count: 0,
          minimumRequired: 1,
        ),
        PriceDetails(
          title: ("minimumNight"),
          type: "Increment",
          dividerShow: true,
          count: 1,
          minimumRequired: 1,
        ),
        PriceDetails(
          title: ("maximumNight"),
          type: "Increment",
          dividerShow: true,
          count: 5,
          minimumRequired: 2,
        ),
      ]);
    }

    // Always include hourly price (per your original list)
    items.add(
      PriceDetails(
        title: ("setYourHourly"),
        type: "Number",
        dividerShow: false,
        count: 1,
        minimumRequired: 1,
      ),
    );

    if (showAdditions) {
      items.addAll([
        PriceDetails(
          title: ("extraGuestAfter"),
          type: "Increment",
          dividerShow: true,
          count: 1,
          minimumRequired: 1,
        ),
        PriceDetails(
          title: ("extraPricePerGuest"),
          type: "Number",
          dividerShow: false,
          count: 1,
          minimumRequired: 1,
        ),
      ]);
    }

    priceDetails = items;

    priceController.text = "100";
    hourPriceController.text = "25";
    guestPriceController.text = "25";
    notify();
  }

  void incrementGuestCount(int index) {
    getGuestBedDetails[index].count++;
    if (getGuestBedDetails[index].title == 'bedRooms') {
      print("bedrooms count >> ${bedrooms.length}");
      updateBedroomCount(getGuestBedDetails[index].count);
    }
    notify();
  }

  void decrementGuestCount(int index) {
    final guestDetail = getGuestBedDetails[index];

    if (guestDetail.title == "adults" || guestDetail.title == "bedRooms") {
      if (guestDetail.count > 1) {
        guestDetail.count--;
      }
    } else if (guestDetail.count > 0) {
      guestDetail.count--;
    }

    if (guestDetail.title == 'bedRooms') {
      print("bedrooms count >> ${bedrooms.length}");
      updateBedroomCount(guestDetail.count);
    }
    notify();
  }

  void incrementPriceCount(int index) {
    priceDetails[index].count++;
    notify();
  }

  void decrementPriceCount(int index) {
    if (priceDetails[index].count != 1) {
      priceDetails[index].count--;
      notify();
    }
  }

  void initializeBedroomData() {
    if (bedrooms.isEmpty) {
      print("data>>>>");
      final bedRoomDetail = getGuestBedDetails.firstWhere(
        (bed) => bed.title == 'bedRooms',
        orElse: () => GuestBedDetails(title: "bedRooms", count: 1),
      );
      updateBedroomCount(bedRoomDetail.count);
    }
  }

  void updateBedroomCount(int count) {
    bedrooms = List.generate(count, (index) {
      return Bedroom(
        label: "Bedroom ${index + 1}",
        beds: [
          BedType(type: "king", count: 1),
          BedType(type: "queen", count: 0),
          BedType(type: "double", count: 0),
        ],
      );
    });
    notify();
  }

  String? selectedField;

  void selectField(String field) {
    selectedField = field;
    notify();
  }

  List<String> uploadImageType = [tr("LOCAL"), tr("GALLERY")];

  List<String> selectedImages = [];
  List<String> selectedTempImages = [];

  final ImagePicker _picker = ImagePicker();
  File? image;

  int getMaxImageCount(CommonViewModel commonModel) {
    final imageCount = commonModel
        .settingsResponseModel
        ?.data
        ?.hiddenSettings
        ?.listingImageCount;

    if (imageCount == null || imageCount == 'Default') {
      return 50;
    }
    return int.tryParse(imageCount) ?? 5;
  }

  void toggleSelectedImages(String id, int maxCount) {
    if (selectedTempImages.contains(id)) {
      selectedTempImages.remove(id);
    } else {
      if (selectedTempImages.length < maxCount) {
        selectedTempImages.add(id);
      } else {
        ToastUtil.showMessage("You have already selected $maxCount images");
      }
    }
    notify();
  }

  void saveSelectedImages() {
    selectedImages = List.from(selectedTempImages);
    notify();
  }

  void clearTempSelectedImages() {
    selectedTempImages = List.from(selectedImages);
    notify();
  }

  void handleSelectedImageAction(int index, String action) {
    if (index < 0 || index >= selectedImages.length) return;

    String imageId = selectedImages[index];

    switch (action) {
      case "delete":
        selectedImages.removeAt(index);
        break;
      case "moveForward":
        if (index < selectedImages.length - 1) {
          selectedImages.removeAt(index);
          selectedImages.insert(index + 1, imageId);
        }
        break;
      case "moveBackward":
        if (index > 0) {
          selectedImages.removeAt(index);
          selectedImages.insert(index - 1, imageId);
        }
        break;
      case "makeCoverPhoto":
        if (index != 0) {
          selectedImages.removeAt(index);
          selectedImages.insert(0, imageId);
        }
        break;
    }
    notify();
  }

  int selectedUploadImageType = 0;

  void selectUploadImageType(int index) {
    selectedUploadImageType = index;
    notify();
  }

  Future<void> pickImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      image = File(pickedFile.path);
      notify();

      await uploadImages(image!);
      await fetchImages();
      selectUploadImageType(1);
    }
  }

  bool isExpanded = true;
  bool hideEdit = false;

  void toggleEdit() {
    hideEdit = !hideEdit;
    notify();
  }

  void jumpToPage(String routeName) {
    final stepIndex = steps.indexWhere(
      (s) => s.pages?.any((p) => p.name == routeName) ?? false,
    );

    if (stepIndex != -1) {
      currentStepIndex = stepIndex;
      final pageIndex = steps[stepIndex].pages!.indexWhere(
        (p) => p.name == routeName,
      );
      currentPageIndex = pageIndex;
      notify();
    }
  }

  Map<String, PageStepConfig> get pageSteps => {
    pageRoutes[0]: PageStepConfig(
      pageRoute: () => SelectCategoryPage(),
      validate: (_) => categoryId.isNotEmpty,
      getParams: (_) =>
          categoryId.isNotEmpty ? {'propertyCategory': categoryId} : {},
    ),
    pageRoutes[1]: PageStepConfig(
      pageRoute: () => SelectPlacePage(),
      validate: (_) => propertyId.isNotEmpty,
      getParams: (_) =>
          propertyId.isNotEmpty ? {'propertyType': propertyId} : {},
    ),
    pageRoutes[2]: PageStepConfig(
      pageRoute: () => SelectLocationPage(),
      validate: (p) => p.address?.isNotEmpty ?? false,
      getParams: (p) => {
        if (p.city != null) 'city': p.city,
        if (p.country != null) 'country': p.country,
        if (p.addressLat != null) 'lat': p.addressLat,
        if (p.addressLng != null) 'lng': p.addressLng,
        if (p.address != null) 'location': p.address,
        if (p.addressState != null) 'state': p.addressState,
        if (p.postalCode != null) 'zipcode': p.postalCode,
      },
    ),
    pageRoutes[3]: PageStepConfig(
      pageRoute: () => ConfirmLocationPage(),
      validate: (_) =>
          streetController.text.isNotEmpty &&
          cityController.text.isNotEmpty &&
          postCodeController.text.isNotEmpty,
      getParams: (_) => {
        if (streetController.text.isNotEmpty) 'Address': streetController.text,
        if (landMarkController.text.isNotEmpty)
          'nearlandmark': landMarkController.text,
        if (cityController.text.isNotEmpty) 'city': cityController.text,
        if (postCodeController.text.isNotEmpty)
          'zipcode': postCodeController.text,
      },
    ),
    pageRoutes[4]: PageStepConfig(
      pageRoute: () => AddGuestCount(),
      validate: (_) => true,
      getParams: (_) => {
        'adult': getGuestBedDetails[0].count,
        'children': getGuestBedDetails[1].count,
        'pets': getGuestBedDetails[2].count,
        'bedRoomCount': getGuestBedDetails[3].count,
        'bathRoomCount': getGuestBedDetails[4].count,
      },
    ),
    pageRoutes[5]: PageStepConfig(
      validate: (_) => true,
      pageRoute: () => AddBedroomCount(),
      getParams: (_) {
        List<Map<String, dynamic>> bedRoomType = [];
        for (int i = 0; i < bedrooms.length; i++) {
          for (var bed in bedrooms[i].beds) {
            bedRoomType.add({
              'bedRoom': "${i + 1}",
              'bedType': bed.type.toLowerCase(),
              'bedCount': bed.count,
            });
          }
        }
        return {'bedRoomtype': bedRoomType};
      },
    ),
    pageRoutes[6]: PageStepConfig(
      pageRoute: () => SelectPrivileges(),
      validate: (p) => p.selectedAmenitiesId.isNotEmpty,
      getParams: (p) => {},
    ),
    pageRoutes[7]: PageStepConfig(
      pageRoute: () => SelectImagePage(),
      validate: (_) => selectedImages.isNotEmpty,
      getParams: (_) =>
          selectedImages.isNotEmpty ? {'images': selectedImages} : {},
    ),
    pageRoutes[8]: PageStepConfig(
      pageRoute: () => TitlePage(),
      validate: (_) => titleController.text.isNotEmpty,
      getParams: (_) => {},
    ),
    pageRoutes[9]: PageStepConfig(
      pageRoute: () => DescriptionPage(),
      validate: (_) => descController.text.isNotEmpty,
      getParams: (_) => {},
    ),
    pageRoutes[10]: PageStepConfig(
      pageRoute: () => GuestPricePage(),
      validate: (_) =>
          (priceController.text.isNotEmpty &&
          hourPriceController.text.isNotEmpty),
      getParams: (_) => {},
    ),
    pageRoutes[11]: PageStepConfig(
      pageRoute: () => ReviewListingPage(),
      validate: (_) => true,
      getParams: (_) => {},
    ),
  };

  // API's

  Map<String, dynamic> getCurrentPageParams(
    ProductListingViewModel productModel,
  ) {
    return pageSteps[currentPage?.name]?.getParams(productModel) ?? {};
  }

  Future<GetStepsResponseModel?> getSteps() async {
   // String? userMode = await PreferenceHelper.getString(PrefConstant.userMode);
    // if (userMode != "host") {
    //   return null;
    // }
    setState(ViewState.busy);
    try {
      var data = await _createListingRepository.getSteps();
      if (data != null) {
        _getStepsResponseModel = data;
        setState(ViewState.success);
        return data;
      }
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<bool?> fetchPendingList() async {
    setState(ViewState.busy);
    try {
      var data = await _createListingRepository.fetchPendingList();

      if (data != null) {
        return data;
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      Logger.appLogs(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<AddInfoResponseModel?> fetchInfo({String? listingId}) async {
    setState(ViewState.busy);
    try {
      var userId = await PreferenceHelper.getString(PrefConstant.userId);
      var data = await _createListingRepository.fetchInfo(
        listingId: listingId,
        userId: userId,
        title: titleController.text.trim().isNotEmpty
            ? titleController.text.trim()
            : "untitled",
        description: descController.text.trim().isNotEmpty
            ? descController.text.trim()
            : Strings.takeBreak,
      );

      if (data != null) {
        _addInfoResponseModel = data;
        await PreferenceHelper.setString(
          PrefConstant.listingId,
          data.data?.listing?.id ?? '',
        );
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<BasicDetailsResponseModel?> fetchBasicDetails({
    Map<String, dynamic>? params,
  }) async {
    setState(ViewState.busy);
    try {
      Map<String, dynamic> body = {
        "progressPercentage": getProgressPercentage(),
      };

      if (params != null && params.isNotEmpty) {
        body.addAll(params);
      }

      var listingId = await PreferenceHelper.getString(PrefConstant.listingId);
      var data = await _createListingRepository.fetchBasicDetails(
        listingId: listingId,
        body: body,
      );

      if (data != null) {
        _basicDetailsResponseModel = data;
        setState(ViewState.success);
      }
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<PrivilegesResponseModel?> fetchPrivileges() async {
    setState(ViewState.busy);
    try {
      var data = await _createListingRepository.fetchPrivileges();

      if (data != null) {
        _privilegesResponseModel = data;
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<UpdatePrivilegesResponseModel?> updatePrivileges({
    required String listingId,
    ProductListingViewModel? productModel,
  }) async {
    setState(ViewState.busy);
    try {
      var body = {
        "progressPercentage": getProgressPercentage(),
        'privilegeItemId': productModel?.selectedAmenitiesId ?? [],
        'moduleType': 'listings',
      };

      var data = await _createListingRepository.updatePrivileges(
        listingId: listingId,
        body: body,
      );

      if (data != null) {
        _updatePrivilegesResponseModel = data;
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<GalleryResponseModel?> fetchImages() async {
    setState(ViewState.busy);

    try {
      var data = await _createListingRepository.fetchImages();

      if (data != null) {
        _galleryResponseModel = data;
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<GalleryResponseModel?> uploadImages(File images) async {
    setState(ViewState.secondaryLoader);

    try {
      var data = await _createListingRepository.uploadImages(images);

      if (data != null) {
        _galleryResponseModel = data;
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<bool?> deleteImages(List<String> ids) async {
    setState(ViewState.busy);

    try {
      var data = await _createListingRepository.deleteImages(ids: ids);
      if (data != null) {
        selectedTempImages.removeWhere((id) => ids.contains(id));
        selectedImages.removeWhere((id) => ids.contains(id));
        return data['status'];
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<GetImagesResponseModel?> addCoverImage() async {
    setState(ViewState.busy);

    try {
      var listingId = await PreferenceHelper.getString(PrefConstant.listingId);
      var data = await _createListingRepository.addCoverImage(
        selectedImage: selectedImages.first,
        listingId: listingId,
        progressPercentage: getProgressPercentage(),
      );
      if (data != null) {
        _getImagesResponseModel = data;
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<GetImagesResponseModel?> addGroupImage() async {
    setState(ViewState.busy);

    try {
      var listingId = await PreferenceHelper.getString(PrefConstant.listingId);
      final groupImages = selectedImages.skip(1).toList();

      var data = await _createListingRepository.addGroupImage(
        selectedImages: groupImages,
        listingId: listingId,
        progressPercentage: getProgressPercentage(),
      );
      if (data != null) {
        _getImagesResponseModel = data;
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<PriceResponseModel?> fetchPriceData() async {
    setState(ViewState.busy);
    try {
      var body = {
        "progressPercentage": getProgressPercentage(),
        "availableCount": priceDetails[0].count,
        "extraGuest": priceDetails[5].count,
        "extraGuestFee": int.parse(guestPriceController.text),
        "maximumNight": priceDetails[3].count,
        "minimumNight": priceDetails[2].count,
        "perDay": int.parse(priceController.text),
        "perHour": int.parse(hourPriceController.text),
      };

      var listingId = await PreferenceHelper.getString(PrefConstant.listingId);
      var data = await _createListingRepository.fetchPriceData(
        listingId: listingId,
        body: body,
      );

      if (data != null) {
        _priceResponseModel = data;
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }

  Future<BasicDetailsResponseModel?> updateStatus() async {
    setState(ViewState.busy);

    try {
      var listingId = await PreferenceHelper.getString(PrefConstant.listingId);
      var data = await _createListingRepository.updateStatus(
        listingId: listingId,
      );

      if (data != null) {
        _basicDetailsResponseModel = data;
      }
      setState(ViewState.success);
    } on AppException catch (appException) {
      errorMsg = errorHandler(appException);
      setState(ViewState.idle);
    }
    return null;
  }
}

class GuestBedDetails {
  GuestBedDetails({required this.title, required this.count});

  String title;
  int count;
}

class BedType {
  String type;
  int count;

  BedType({required this.type, this.count = 0});
}

class Bedroom {
  String label;
  List<BedType> beds;

  Bedroom({required this.label, required this.beds});
}

class PriceDetails {
  String title;
  String type;
  bool dividerShow;
  int count;
  int minimumRequired;

  PriceDetails({
    required this.title,
    required this.type,
    required this.dividerShow,
    required this.count,
    required this.minimumRequired,
  });
}

class PageStepConfig {
  final Widget Function() pageRoute;
  final bool Function(ProductListingViewModel) validate;
  final Map<String, dynamic> Function(ProductListingViewModel) getParams;

  PageStepConfig({
    required this.pageRoute,
    required this.validate,
    required this.getParams,
  });
}
