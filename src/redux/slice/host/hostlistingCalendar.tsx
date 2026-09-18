import { createSlice } from "@reduxjs/toolkit";
import { getApiMethod, putApiMethod } from "@/services/global";
import APICONSTANT from "@/services/config";
import { addAlert } from "@/redux/slice/AlertSlice";

const initialState = {
  calendarData: [],
  loading: true,
};

const hostCalendarList = createSlice({
  name: "hostCalendarList",
  initialState,
  reducers: {
    getCalendarlist: (state, action) => {
      state.calendarData = action.payload;
    },
    isLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { getCalendarlist, isLoading } = hostCalendarList.actions;

export function fetchListingCalendarData(data?: any) {
  return async (dispatch: any) => {
    try {
      // dispatch(isLoading(true))

      const response = await getApiMethod(`${APICONSTANT.getListing}/${data}`);
      if (response?.data?.listing[0]) {
        dispatch(getCalendarlist(response?.data?.listing[0]));
      }
      // if (response.statusCode === 200) {
      //     dispatch(isLoading(false))
      //     dispatch(getCalendarlist(response))
      //     return response
      // }
    } catch (error: any) {
      dispatch(isLoading(false));
      console.log(error);
    }
  };
}

export function updateListingCalendarData(id?: any, data?: any) {
  return async (dispatch: any) => {
    try {
      // dispatch(isLoading(true))

      const response = await putApiMethod(
        `${APICONSTANT.calenderListings}/${id}`,
        data
      );
      if (response.statusCode === 200) {
        //     dispatch(isLoading(false))
        //     dispatch(getCalendarlist(response))
        //     return response
        dispatch(
          addAlert({
            isOpen: true,
            message: response.message,
            type: "success",
            severity: "success",
          })
        );
      }
    } catch (error: any) {
      dispatch(isLoading(false));
      console.log(error);
    }
  };
}

export const userSelector = (state: any) => state.userReducer;
export default hostCalendarList.reducer;
