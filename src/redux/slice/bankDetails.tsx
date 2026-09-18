import { createSlice } from "@reduxjs/toolkit";
import { getApiMethod } from '@/services/global'
import APICONSTANT from "@/services/config";

const initialState = {
    BankDetails: {}
  }

  const BankDetailsSlice = createSlice({
    name: "listingdata",
    initialState,
    reducers: {
      getBankData: (state, action) => {
        state.BankDetails = action.payload;
      }
    }
  })
  export const {
    getBankData
  } = BankDetailsSlice.actions;

  export function getBankDetailsData() {
    return async (dispatch: any) => {
      try {
        const response = await getApiMethod(APICONSTANT.addBank)
        dispatch(getBankData(response.data.bankDetail))
        return response
      } catch (error: any) {
        console.log(error)
      }
    }
  }
  
  export default BankDetailsSlice.reducer;
