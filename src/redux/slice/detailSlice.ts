import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Details {
  image: any[];
  price: number;
  discountprice: number;
  hourprice: number;
  discountpercentage: number;
  rating: object;
  coordinate: object;
  location: any;
  address: object;
}
export interface DetailsList {
  DetailsList: Details;
  shouldFetchLocation: boolean;
  selectedMarkerRedux: any;
}
const initialState: DetailsList = {
  DetailsList: {
    image: [],
    price: 0,
    discountprice: 0,
    discountpercentage: 0,
    hourprice: 0,
    rating: {},
    coordinate: {
      latitude: 9.933491,
      longitude: 78.127579,
    },
    location: "",
    address: {
      Area: "",
      City: "",
      State: "",
      Pincode: "",
      Country: "",
    },
  },
  shouldFetchLocation: false,
  selectedMarkerRedux: {},
};

export const detailsSlice = createSlice({
  name: "details",
  initialState,
  reducers: {
    addListPrice: (state, action: PayloadAction<number>) => {
      state.DetailsList.price = action.payload;
    },
    addListDiscountPrice: (state, action: PayloadAction<number>) => {
      state.DetailsList.discountprice = action.payload;
    },
    addListDiscountPercentage: (state, action: PayloadAction<number>) => {
      state.DetailsList.discountpercentage = action.payload;
    },
    addListHourPrice: (state, action: PayloadAction<number>) => {
      state.DetailsList.hourprice = action.payload;
    },
    addArrImage: (state, action: PayloadAction<Details[]>) => {
      state.DetailsList.image = action.payload;
    },
    addRating: (state, action: PayloadAction<Details>) => {
      state.DetailsList.rating = action.payload;
    },
    setCoordinate: (
      state,
      action: PayloadAction<{ latitude: number; longitude: number }>
    ) => {
      state.DetailsList.coordinate = {
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
      };
    },
    addLocation: (state, action: PayloadAction<string>) => {
      state.DetailsList.location = action.payload;
    },
    setAddress: (
      state,
      action: PayloadAction<{
        Area: any;
        City: any;
        State: any;
        Pincode: any;
        Country: any;
      }>
    ) => {
      state.DetailsList.address = {
        Area: action.payload.Area,
        City: action.payload.City,
        State: action.payload.State,
        Pincode: action.payload.Pincode,
        Country: action.payload.Country,
      };
    },
    setShouldFetchLocation: (state, action: PayloadAction<boolean>) => {
      state.shouldFetchLocation = action.payload;
    },
    setSelectedMarkerRedux: (state, action: PayloadAction<any>) => {
      state.selectedMarkerRedux = action.payload;
    },
  },
});

export const {
  addListPrice,
  addListDiscountPrice,
  addListDiscountPercentage,
  addListHourPrice,
  addArrImage,
  addRating,
  setCoordinate,
  addLocation,
  setAddress,
  setShouldFetchLocation,
  setSelectedMarkerRedux,
} = detailsSlice.actions;
export const detailSelector = (state: any) => state.detailsReducer;
export default detailsSlice.reducer;
