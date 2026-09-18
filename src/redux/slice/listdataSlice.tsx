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

export interface Guest {
  adult?: string | null | undefined;
  children?: string | null | undefined;
  pets?: string | null | undefined;
}

export interface BedRoomBedtype {
  bedRoom: string;
  bedType: string;
  bedCount: number;
  _id: string;
}

export interface BathRoom {
  bathRoomCount: number;
  shared: boolean;
}

export interface Accomodation {
  bathRoom: BathRoom;
  bedRoomCount: number;
  bedRoomBedtype: BedRoomBedtype[] | null | undefined;
}

export interface Image {
  coverImage: string;
  groupImage: { imagePath: string; _id: string }[];
}

export interface AttachmentData {
  image: Image;
  rules?: any[];
}

export interface BookingType {
  extraGuest: number;
  extraGuestFee: number;
  maximumNight: number;
  minimumNight: number;
}

export interface Pricing {
  baseFare: number;
  perDay: number;
  perHour: number;
}

export interface PriceData {
  blockedDates: any[];
  bookingType: BookingType;
  pricing: Pricing;
}

export interface Amenity {
  categoryId: string;
  name: string;
  desc: string;
  icon: string;
}

export interface AmenityCategory {
  _id: string;
  category: string;
  desc: string;
}

export interface ProviderData {
  firstname: string;
  _id: string;
  email: string;
  verifiedDate: string;
  profileImage: string;
}

export interface PropertyData {
  _id: string;
  address: Address;
  guest?: Guest | null | undefined;
  accomodation?: Accomodation | null | undefined;
  propertyName: string;
  propertyDesc: string;
  status: string;
  totalRatingCount?: number | null | undefined;
  totalReviewCount?: number | null | undefined;
  reviewRating?: any[] | null | undefined;
  placesToOffer?: any[] | null | undefined;
  attachmentData: AttachmentData[];
  priceData: PriceData[];
  amenities?: Amenity[] | null | undefined;
  amenityCategories?: AmenityCategory[] | null | undefined;
  propertyTypeName: string;
  propertyCategoryName: string;
  providerData: ProviderData | null | undefined;
  cancellationPolicyId?: number | null | undefined;
  isBooking: boolean;
  wishlist: boolean;
}
export interface ListDetail {
  ListingData: PropertyData | null | undefined;
  loading: boolean;
  amenities: {
    privileges: any[],
    privilegeItems: any[],
    privilegeCategories: any[]
  },
}

const initialState: ListDetail = {
  ListingData: {
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
    guest: {
      adult: "",
      children: "",
      pets: ""
    },
    accomodation: {
      bathRoom: {
        bathRoomCount: 0,
        shared: false
      },
      bedRoomCount: 0,
      bedRoomBedtype: []
    },
    propertyName: "",
    propertyDesc: "",
    status: "",
    totalRatingCount: 0,
    totalReviewCount: 0,
    reviewRating: [],
    placesToOffer: [],
    attachmentData: [],
    priceData: [],
    amenities: [],
    amenityCategories: [],
    propertyTypeName: "",
    propertyCategoryName: "",
    providerData: {
      firstname: "",
      _id: "",
      email: "",
      verifiedDate: "",
      profileImage: ""
    },
    cancellationPolicyId: 0,
    isBooking: false,
    wishlist: false
  },
  amenities: {
    privileges: [],
    privilegeItems: [],
    privilegeCategories: []
  },
  loading: true
};


const ListingDataSlice = createSlice({
  name: "listingdata",
  initialState,
  reducers: {
    getListData: (state, action) => {
      state.ListingData = action.payload;
    },
    setAmenities: (state, action) => {
      state.amenities = action.payload;
    },
    isLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { getListData, setAmenities, isLoading } = ListingDataSlice.actions;

export function getListingData(singleListId: any, UID: any) {
  return async (dispatch: any) => {
    try {
      const response = await getApiMethod(
        `${APICONSTANT.approvedListings  }/${singleListId}`,
        { userId: UID }
      );
      if (response.statusCode === 200) {
        dispatch(isLoading(false));
        dispatch(getListData(response?.data?.listing[0]));
        dispatch(setAmenities({privilegeCategories: Array.isArray(response?.data?.privilegeCategories)?response?.data?.privilegeCategories:[], 
          privilegeItems: Array.isArray(response?.data?.privilegeItems)?response?.data?.privilegeItems:[],
          privileges: Array.isArray(response?.data?.privileges)?response?.data?.privileges:[]
        }));
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

export default ListingDataSlice.reducer;
