import { createSlice } from "@reduxjs/toolkit";
import { getApiMethod } from "@/services/global";
import APICONSTANT from "@/services/config";

export interface Address {
  city: string;
  state: string;
  country: string;
  zipcode: string;
  address: string;
  landmark: string;
  coordinates: number[];
}

export interface Image {
  coverImage: string;
  coverImageId: string;
  groupImage: { imagePath: string; _id: string }[];
}

export interface AttachmentData {
  image: Image;
}

export interface ProviderData {
  firstname: string;
  _id: string;
  email: string;
  verifiedDate: string;
  profileImage: string;
}

export interface AdsPropertyData {
  _id: string;
  address: Address;
  name: string;
  desc: string;
  status: string;
  price: number;
  attachmentData: AttachmentData[];
  subCategoryName: string;
  subCategoryId: string;
  categoryName: string;
  categoryId: string;
  providerData: ProviderData | null | undefined;
  isBooking: boolean;
  wishlist: boolean;
}
export interface AdsDetail {
  AdsData: AdsPropertyData | null | undefined;
  loading: boolean;
}

const initialState: AdsDetail = {
  AdsData: {
    _id: "",
    address: {
      city: "",
      state: "",
      country: "",
      zipcode: "",
      address: "",
      landmark: "",
      coordinates: []
    },
    name: "",
    desc: "",
    status: "",
    price: 0,
    attachmentData: [],
    subCategoryName: "",
    subCategoryId: '',
    categoryName: "",
    categoryId: '',

    providerData: {
      firstname: "",
      _id: "",
      email: "",
      verifiedDate: "",
      profileImage: ""
    },
    isBooking: false,
    wishlist: false
  },
  loading: true
};


const AdsDataSlice = createSlice({
  name: "adslistingdata",
  initialState,
  reducers: {
    getListData: (state, action) => {
      state.AdsData = action.payload;
    },
    isLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { getListData, isLoading } = AdsDataSlice.actions;

export function getListingData(singleListId: any, UID: any) {
  return async (dispatch: any) => {
    try {
      const response = await getApiMethod(
        `${APICONSTANT.approvedadsListings  }/${singleListId}`,
        { userId: UID }
      );
      if (response.statusCode === 200) {
        dispatch(isLoading(false));
        dispatch(getListData(response?.data?.listing[0]));
        return response;
      } else {
        dispatch(isLoading(true));
      }
    } catch (error: any) {
      dispatch(isLoading(true));
      console.log(error);
    }
  };
}

export default AdsDataSlice.reducer;
