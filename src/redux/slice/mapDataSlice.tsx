import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LatLngLocation {
  latitude: number;
  longitude: number;
  locationName: string;
}

const initialState: LatLngLocation = {
  latitude:  9.933491,
  longitude: 78.127579,
  locationName: "madurai"
};

export const latLngLocationSlice = createSlice({
  name: "latLngLocation",
  initialState,
  reducers: {
    setCoordinates: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.locationName = action.payload;
    }
  }
});

export const { setCoordinates, setLocation } = latLngLocationSlice.actions;
export const latLngLocationSelector = (state: any) => state.latLngLocation;
export default latLngLocationSlice.reducer;
