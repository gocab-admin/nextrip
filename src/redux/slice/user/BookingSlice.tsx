import { createSlice } from "@reduxjs/toolkit";
import { getApiMethod, postApiMethod } from "@/services/global";
import APICONSTANT from "@/services/config";
import { addAlert } from "@/redux/slice/AlertSlice";

// interface BookingData {
//     hour: string;
//     startDate: string;
//     endDate: string;
//     guest: number;
//     paymentMode: any;
//     nights: any;
//     fareAmount: any;
//   }

const initialState = {
  estimation: {
    Adult: 0,
    Children: 0,
    Pets: 0,
    fareAmount: 0
  },
  bookingData: {},
  paymentData: null,
  pendinBookingData: null,
  acceptBookingData: null,
  cancelBookingData: null,
  historyData: null,
  selectedRowId: null,
  bookingId: "",
  loading: true,
  loadingPayment: false,
  response: 422,
  isReviewed: false,
  getAdsCheckoutDetails: {},
  getSubscriptionStatus: [],
  getPackageData: [],
};

const Bookingslice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    getRespnse: (state, action) => {
      state.response = action.payload;
    },
    getBookingEstimationSuccess: (state, action) => {
      state.estimation = action.payload;
    },
    resetEstimation: (state) => {
      state.estimation.fareAmount = 0;
    },
    getBookingSuccess: (state, action) => {
      state.bookingData = action.payload;
    },
    getStatusSuccess: (state, action) => {
      state.paymentData = action.payload;
    },
    getPendingSuccess: (state, action) => {
      state.pendinBookingData = action.payload;
    },
    getAcceptSuccess: (state, action) => {
      state.acceptBookingData = action.payload;
    },
    getCancelSuccess: (state, action) => {
      state.cancelBookingData = action.payload;
    },
    getHistorySuccess: (state, action) => {
      state.historyData = action.payload;
    },
    selectRow: (state, action) => {
      state.selectedRowId = action.payload;
    },
    BookingID: (state, action) => {
      state.bookingId = action.payload;
    },
    isLoading: (state, action) => {
      state.loading = action.payload;
    },
    isLoadingPayment: (state, action) => {
      state.loadingPayment = action.payload;
    },
    reviewStatus: (state, action) => {
      state.isReviewed = action.payload;
    },
    setAdsCheckoutDetails: (state, action) => {
      state.getAdsCheckoutDetails = action.payload
    },
    setSubscriptionStatus: (state, action) => {
      state.getSubscriptionStatus = action.payload
    },
    setPackageData: (state, action) => {
      state.getPackageData = action.payload
    }
  }
});

export const {
  getBookingEstimationSuccess,
  resetEstimation,
  getBookingSuccess,
  getRespnse,
  getStatusSuccess,
  getPendingSuccess,
  getAcceptSuccess,
  getCancelSuccess,
  getHistorySuccess,
  selectRow,
  BookingID,
  isLoading,
  isLoadingPayment,
  reviewStatus,
  setAdsCheckoutDetails,
  setSubscriptionStatus,
  setPackageData,
} = Bookingslice.actions;

export const fetchBookingData = (ListId: any, queryString: any) => async (dispatch: any) => {
  try {
    const response = await getApiMethod(
      `${APICONSTANT.estimation}/${ListId}`,
      queryString
    );
    dispatch(getRespnse(response.statusCode));
    if (response.statusCode === 200) {
      // dispatch(isLoading(false));
      dispatch(getBookingEstimationSuccess(response.data.estimation));
      return response;
    } else {
      dispatch(resetEstimation());
      dispatch(
        addAlert({
          isOpen: true,
          message: response.response.data.message,
          type: "error",
          severity: "error"
        })
      );
    }
  } catch (error: any) {
    console.log(error);
  }
};

export function getBookingData(id: any, data: any) {
  return async (dispatch: any) => {
    try {
      const currency = data.currency;
      delete data.currency;
      const response = await postApiMethod(
        `${APICONSTANT.booking}/${id}?currency=${currency}`,
        data
      );
      if (response.statusCode == 200) {
        // dispatch(isLoading(false))
        await dispatch(getBookingSuccess(response));
        return response;
      } else if (response.response) {
        return response.response.data;
      }
    } catch (error: any) {
      console.log(error);
      return error;
    }
  };
}

export function paymentStatus(id1: any, data: any) {
  return async (dispatch: any) => {
    try {
      let response;
      if (id1 === null) {
        response = await postApiMethod(
          `${APICONSTANT.paymentStatus}`,
          data
        );
      } else {
        response = await postApiMethod(
          `${APICONSTANT.paymentStatus}?id=${id1}`,
          data
        );
      }

      dispatch(getStatusSuccess(response.data.data));
      return response.data;
    } catch (error: any) {
      console.log(error);
    }
  };
}
export function getPendingBooking(page: any, limit: any, searchValue: any) {
  return async (dispatch: any) => {
    try {
      const response = await getApiMethod(
        `${APICONSTANT.pendingBooking
        }?_page=${page}&_limit=${limit}&search=${searchValue}`
      );
      if (response.statusCode === 200) {
        // dispatch(isLoading(false))
        dispatch(getPendingSuccess(response));
        return response;
      }
    } catch (error: any) {
      console.log(error);
    }
  };
}
export function getAcceptedBooking(page = 1, limit = 10, searchValue = "") {
  return async (dispatch: any) => {
    try {
      const response = await getApiMethod(
        `${APICONSTANT.acceptedBooking
        }?_page=${page}&_limit=${limit}&_search=${searchValue}`
      );
      if (response.statusCode == 200) {
        // dispatch(isLoading(false))
        dispatch(getAcceptSuccess(response));
        return response;
      }
    } catch (error: any) {
      console.log(error);
    }
  };
}
export function getCancelHistory(page: any, limit: any, searchValue: any) {
  return async (dispatch: any) => {
    try {
      const response = await getApiMethod(
        `${APICONSTANT.cancelledBooking
        }?_page=${page}&_limit=${limit}&search=${searchValue}&type=user`
      );
      if (response.statusCode == 200) {
        dispatch(isLoading(false));
        dispatch(getCancelSuccess(response));
        return response;
      }
    } catch (error: any) {
      console.log(error);
    }
  };
}

export function getBookingHistory(page = 1, limit = 10, searchValue = "") {
  return async (dispatch: any) => {
    try {
      const response = await getApiMethod(
        `${APICONSTANT.bookingHistory
        }?_page=${page}&_limit=${limit}&search=${searchValue}&type=user`
      );
      if (response.statusCode == 200) {
        // dispatch(isLoading(false))
        dispatch(getHistorySuccess(response));
        return response;
      }
    } catch (error: any) {
      console.log(error);
    }
  };
}

export function adsPackageList() {
  return async (dispatch: any) => {
    try {
      const url = `${APICONSTANT.packageDatas}`;
      const response = await getApiMethod(url);
      if (response?.statusCode === 200) {
        await dispatch(setPackageData(response))
      }
    } catch (error) {
      console.error("Error fetching package list", error);

    }
  }
}

export function adsCheckoutData(id: any, currency: any, totalPrice: any) {
  return async (dispatch: any) => {
    try {
      const payload = {
        amount: totalPrice
      }
      const response = await postApiMethod(`${APICONSTANT.packagesSubscription}/${id}?currency=${currency}`, payload);
      if (response?.statusCode === 200) {
        await dispatch(setAdsCheckoutDetails(response));
        return response;
      }
    } catch (error: any) {
      console.error("Error fetching checkout data", error);
    }
  }
}

export function adsPaymentStatus(id: any, data: any) {
  return async (dispatch: any) => {
    try {
      const url = id === null ? `${APICONSTANT.adsPaymentStatus}` : `${APICONSTANT.adsPaymentStatus}/${id}`
      const response = await postApiMethod(url, data);
      // console.log(response);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching payment status", error);

    }
  }
}

export function adsSubscriptionStatus(status: any, searchValue = "", page = 1, limit = 10) {
  return async (dispatch: any) => {
    try {
      const url = status === null ? `${APICONSTANT.subscriptionStatus}?status=active` : `${APICONSTANT.subscriptionStatus}?status=${status}?_page=${page}&_limit=${limit}&_search=${searchValue}`
      const response = await getApiMethod(url);
      // console.log(response);
      if (response?.statusCode === 200) {
        dispatch(setSubscriptionStatus(response?.data?.userPackages))
      }
    } catch (error) {
      console.error("Error fetching subscription status", error);
    }
  }
}

export default Bookingslice.reducer;
