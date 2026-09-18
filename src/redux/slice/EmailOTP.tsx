import { createSlice } from "@reduxjs/toolkit";
import { postApiMethod } from '@/services/global'
import APICONSTANT from "@/services/config";


const initialState = {
    emailResponse :{},
    emailOtpResponse : {}
  }


  const MailVerify = createSlice({
    name: "value",
    initialState,
    reducers: {
        getSendEmail :  (state, action) => {
            state.emailResponse = action.payload;
          },
          getVerifyEmail :  (state, action) => {
            state.emailOtpResponse = action.payload;
          }
    }
  })
  export const {
    getSendEmail,getVerifyEmail
  } = MailVerify.actions;

   export function getSendByEmail(data:any) {
    return async (dispatch: any) => {
      try {
        const response = await postApiMethod(APICONSTANT.sendEmail,data)
        // dispatch(getSendEmail(response.data.bankDetail))
        return response
      } catch (error: any) {
        return error
        console.log(error)
      }
    }
  }


  export  function getVerifyByEmail(data:any) {
    return async (dispatch: any) => {
      try {
        const response = await postApiMethod(APICONSTANT.verifyEmail,data)
        dispatch(getVerifyEmail(response))
        return response
      } catch (error: any) {
        console.log(error)
      }
    }
  }
