import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiMethod } from "@/services/global";
import APICONSTANT from "@/services/config";

export interface Listing {
  _id: string;
  propertyName: string;
  propertyDesc: any;
  propertyCategory: string;
  propertyType: string;

  lat: number;
  lng: number;
  location: string;
  country: string;
  address: string;
  street: string;
  state: string;
  city: string;
  zipcode: string;
  houseNo: string;
  landmark: string;

  adult: number;
  children: number;
  pets: number;
  bedRoomCount: number;
  bathRoomCount: number;
  beds: number;

  bedRoomtype: any[];

  coverImage: any;
  groupImage: any[];
  imgFiles: any[];

  amenities: any[];
  amenityLst: any[];

  privilegeIds: any[];
  privileges: any[];
  privilegeCategories: any[];
  privilegeItems: any[];

  perDay: number;
  availableCount: number;
  minimumNight: number;
  maximumNight: number;
  maxNightSelect: boolean;
  cancellationPolicyId: any;
  ruletitle: string;
  ruledesc: string;
  extraGuest: number;
  discountPercentage: number;
  extraGuestFee: number;
  perHour: number;
  addAvailabilityCount: number;
  capacity: number;
  priceExists: boolean;

  area: string;
  hourlyChecking: string;
  disable: boolean;
  // edit Data
  availability: boolean;
  propertyCategoryName: string;
  propertyTypeName: string;
  rules: any[];
}
export interface ListInfo {
  ListInfo: Listing;
  isLoading: boolean;
}

const initialState: ListInfo = {
  ListInfo: {
    _id: "",
    propertyName: "",
    propertyCategoryName: "",
    propertyTypeName: "",
    propertyDesc: "Take a break and unwind at this peaceful oasis.",
    propertyCategory: "",
    propertyType: "",
    adult: 1,
    children: 0,
    pets: 0,
    bedRoomCount: 1,
    bathRoomCount: 0,
    beds: 0,
    bedRoomtype: [],
    houseNo: "",
    area: "",
    street: "",
    zipcode: "",
    location: "",
    city: "",
    landmark: "",
    state: "",
    country: "",
    address: "",

    coverImage: "",
    groupImage: [],
    imgFiles: [],

    disable: false,
    perDay: 100,
    priceExists: false,
    availableCount: 1,
    minimumNight: 1,
    maximumNight: 90, // should be same as backend default value
    maxNightSelect: true,
    cancellationPolicyId: null,
    ruletitle: "",
    ruledesc: "",
    extraGuest: 0,
    extraGuestFee: 0,
    discountPercentage: 0,
    amenities: [],
    amenityLst: [],

    privilegeIds: [],
    privileges: [],
    privilegeCategories: [],
    privilegeItems: [],

    perHour: 45,
    hourlyChecking: "",
    addAvailabilityCount: 1,
    capacity: 0,
    lat: 0,
    lng: 0,
    availability: false,
    rules: [],
  },
  isLoading: false,
};

export const propertySlice = createSlice({
  name: "property_slice",
  initialState,
  reducers: {
    extraGuestCount: (state, action: PayloadAction<number>) => {
      state.ListInfo.extraGuest = action.payload;
    },
    Discount: (state, action: PayloadAction<number>) => {
      state.ListInfo.discountPercentage = action.payload;
    },
    describeTitle: (state, action: PayloadAction<string>) => {
      state.ListInfo.propertyDesc = action.payload;
    },
    nextDisable: (state, action: PayloadAction<boolean>) => {
      state.ListInfo.disable = action.payload;
    },
    placeOffer: (state, action: PayloadAction<Listing>) => {
      state.ListInfo.amenities.push(action.payload);
    },
    setPrivilegeIds: (state, action: PayloadAction<Listing>) => {
      state.ListInfo.privilegeIds.push(action.payload);
    },
    addAvailablecount: (state, action: PayloadAction<number>) => {
      state.ListInfo.addAvailabilityCount = action.payload;
    },
    addCoverImg: (state, action: PayloadAction<any>) => {
      state.ListInfo.coverImage = action.payload;
    },
    addImage: (state, action: PayloadAction<any>) => {
      state.ListInfo.groupImage.push(action.payload);
    },
    addImageDel: (state, action: PayloadAction<any>) => {
      state.ListInfo.groupImage = action.payload;
    },
    HourlyChecking: (state, action: PayloadAction<string>) => {
      state.ListInfo.hourlyChecking = action.payload;
    },
    resetData: (state) => {
      state.ListInfo = initialState.ListInfo;
    },
    isLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setData: (state, action) => {
      state.ListInfo = { ...state.ListInfo, ...action.payload };
    },
  },
});

export const {
  nextDisable,
  describeTitle,
  placeOffer,
  setPrivilegeIds,
  addCoverImg,
  addImage,
  addImageDel,
  extraGuestCount,
  Discount,
  addAvailablecount,
  HourlyChecking,
  resetData,
  setData,
  isLoading,
} = propertySlice.actions;

export const getListingData: any =
  (singleListId: any) => async (dispatch: any) => {
    try {
      const response = await getApiMethod(
        `${APICONSTANT.getListing}/${singleListId}`
      );
      console.log("response", response);
      if (response.statusCode === 200) {
        dispatch(isLoading(false));
        let data = response?.data?.listing[0] || {};
        debugger;
        if (data?.address?.coordinates && data.address.coordinates[0]) {
          data.lat = data.address.coordinates[0];
          data.lng = data.address.coordinates[1];
        }
        if (data?.address) data = { ...data, ...data.address };

        data.adult = parseInt(data.guest?.adult || 0);
        data.children = parseInt(data.guest?.children || 0);
        data.pets = parseInt(data.guest?.pets || 0);
        data.bedRoomCount = parseInt(data.accomodation?.bedRoomCount) || 1;
        data.bathRoomCount = parseInt(
          data.accomodation?.bathRoom?.bathRoomCount || 0
        );

        data.bedRoomtype = data.accomodation?.bedRoomBedtype || [];

        data.propertyCategoryName = data?.propertyCategoryName?.category || "";
        data.propertyTypeName = data?.propertyTypeName?.property || "";
        data.rules = data.attachmentData?.rules || [];
        data.coverImage = {
          imagePath: data.attachmentData?.image?.coverImage,
          ImageId: data.attachmentData?.image?.imageId,
        };
        const groupImages = data.attachmentData?.image?.groupImage || [];
        data.groupImage = groupImages.map((item: any) => ({
          imagePath: item.imagePath,
          ImageId: item.groupImageId,
        }));
        const coverImgArr = data.coverImage?.imagePath ? [data.coverImage] : [];
        data.imgFiles = [...coverImgArr, ...data.groupImage];

        if (Array.isArray(data.amenities)) {
          data.amenityLst = data.amenities;
          data.amenities = data.amenities.map((item: any) => item._id);
        }

        if (Array.isArray(response?.data?.privilegeItems)) {
          // data.amenityLst = data.amenities;
          data.privilegeIds = response?.data?.privilegeItems.map(
            (item: any) => item._id
          );
        }
        data.privilegeItems = Array.isArray(response?.data?.privilegeItems)
          ? response?.data?.privilegeItems
          : [];
        data.privileges = Array.isArray(response?.data?.privileges)
          ? response?.data?.privileges
          : [];
        data.privilegeCategories = Array.isArray(
          response?.data?.privilegeCategories
        )
          ? response?.data?.privilegeCategories
          : [];

        data.perDay = data?.priceData?.pricing?.perDay || 100;
        data.perHour = data?.priceData?.pricing?.perHour || 25;
        data.baseFare = data?.priceData?.pricing?.baseFare || 100;
        data.discountPercentage =
          data?.priceData?.pricing?.discountPercentage || 0;
        data.priceExists = data?.priceData?.pricing ? true : false;

        data.extraGuest = data?.priceData?.bookingType?.extraGuest || 0;
        data.extraGuestFee = data?.priceData?.bookingType?.extraGuestFee || 0;
        data.maximumNight = data?.priceData?.bookingType?.maximumNight || 5;
        data.minimumNight = data?.priceData?.bookingType?.minimumNight || 1;
        data.maxNightSelect = data?.priceData?.maxNightSelect ? true : false;
        data.cancellationPolicyId = data?.cancellationPolicyId;
        data.availableCount = data?.priceData?.availableCount || 1;
        dispatch(setData(data));
        return response;
      } else {
        dispatch(isLoading(true));
      }
    } catch (error: any) {
      dispatch(isLoading(true));
      console.log(error);
    }
  };
export const propertySelector = (state: any) => state.propertyReducer;
export default propertySlice.reducer;
