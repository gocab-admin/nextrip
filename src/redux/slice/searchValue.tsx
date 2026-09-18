import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Address = {
  lat: string;
  lng: string;
  location: string;
};

export type Dates = {
  startDate: string;
  endDate: string;
  timeanddate: [];
};

export type Guest = {
  adult: number | string;
  children: number | string;
  pets: number | string;
};

export type Accomendation = {
  bathRoom: number;
  bedRoom: number;
};
export type Pricing = {
  minPrice: number;
  maxPrice: number;
  minMaxVal: {};
};

export interface FilterData {
  propertyCategory: string;
  propertyType: string;
  instantbooking: boolean;
  // amenities: string[];
  privileges: string[];
  searchdate: Dates;
  address: Address;
  guests: Guest;
  accomendation: Accomendation;
  priceData: Pricing;
  productName: string;
  datesFilter: string;
  smartSorting: string;
}

const initialState: FilterData = {
  address: { lat: "", lng: "", location: "" },
  guests: {
    adult: 0,
    children: 0,
    pets: 0
  },
  accomendation: {
    bathRoom: 0,
    bedRoom: 0
  },
  propertyCategory: "",
  propertyType: "",
  priceData: {
    minPrice: 0,
    maxPrice: 0,
    minMaxVal: { min: 10, max: 100 }
  },
  privileges: [],
  // amenities: [],
  instantbooking: false,
  searchdate: {
    startDate: "",
    endDate: "",
    timeanddate: []
  },
  productName: "",
  datesFilter: "",
  smartSorting: "",
};

const CommonFilter = createSlice({
  name: "filtervalues",
  initialState,
  reducers: {
    updateProductName: (state, action) => {
      state.productName = action.payload;
    },
    updatePropertyCategory: (state, action) => {
      state.propertyCategory = action.payload;
    },
    updatePropertyType: (state, action) => {
      state.propertyType = action.payload;
    },
    updatePrivileges: (state, action) => {
      state.privileges = action.payload;
    },
    updateInstantbooking: (state, action) => {
      state.instantbooking = action.payload;
    },
    // updateAmenities: (state, action: PayloadAction<Partial<any[]>>) => {
    //   state.amenities = action.payload;
    // },
    updateSearchDate: (state, action: PayloadAction<Partial<Dates>>) => {
      state.searchdate = {
        ...state.searchdate,
        ...action.payload
      };
    },
    updateTimeDate: (state, action: PayloadAction<Partial<[]>>) => {
      state.searchdate.timeanddate = action.payload;
    },
    updateAddress: (state, action: PayloadAction<Partial<Address>>) => {
      state.address = {
        ...state.address,
        ...action.payload
      };
    },
    updateGuest: (state, action: PayloadAction<Partial<Guest>>) => {
      state.guests = {
        ...state.guests,
        ...action.payload
      };
    },
    updateAccomodation: (
      state,
      action: PayloadAction<Partial<Accomendation>>
    ) => {
      state.accomendation = {
        ...state.accomendation,
        ...action.payload
      };
    },
    updatePricing: (state, action: PayloadAction<Partial<Pricing>>) => {
      state.priceData = {
        ...state.priceData,
        ...action.payload
      };
    },
    setFilterValues: (state, action: PayloadAction<Partial<FilterData | Address | Guest>>) => ({
      ...state,
      ...action.payload
    }),
    resetFilter: () => initialState
  }
});
export const {
  updateProductName,
  updatePropertyCategory,
  updatePropertyType,
  updateInstantbooking,
  // updateAmenities,
  updateSearchDate,
  updateTimeDate,
  updateAddress,
  updateGuest,
  updateAccomodation,
  updatePrivileges,
  updatePricing,
  setFilterValues,
  resetFilter
} = CommonFilter.actions;

export const searchSelector = (state: any) => state.SearchValue;
export default CommonFilter.reducer;
