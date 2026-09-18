import { createSlice } from "@reduxjs/toolkit";
import { getApiMethod } from "@/services/global";
import APICONSTANT, { APIURLS } from "@/services/config";

const initialState = {
    getCmsList: [],
    getWishlistData: [],
};

const cmsSlice = createSlice({
    name: "cmsListing",
    initialState,
    reducers: {
      setCmsList: (state, action) => {
        state.getCmsList = action.payload;
      },
      setWishlistData: (state, action) => {
        state.getWishlistData = action.payload;
      }
    }
});

export const {  setCmsList, setWishlistData } = cmsSlice.actions;

export function fetchCmsListingData() {
  return async (dispatch: any) => {
    try {
      const url = `${APICONSTANT.cmsList}`
      const response = await getApiMethod(url);
      if (response?.statusCode === 200) {
        dispatch(setCmsList(response?.data))
      }
    } catch (error) {
      console.error("Error fetching in cms", error);
    }
  }
}

export function getWishlistCollection(id: any) {
  return async (dispatch: any) => {
    try {
      const url = `${APICONSTANT.wishList}/${id}`;
      const response = await getApiMethod(url);
      if(response?.statusCode === 200) {
        dispatch(setWishlistData(response?.data?.wishLists))
      }
    } catch(error) {
      console.error("Error fetching in wishlist", error);
      
    }
  }
}

export default cmsSlice.reducer;