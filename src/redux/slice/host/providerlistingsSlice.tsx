import { createSlice } from '@reduxjs/toolkit'
import {getApiMethod } from '@/services/global'
import APICONSTANT from '@/services/config'

const initialState = {
    listData:{},
    loading:true
}

const ProviderListingslice = createSlice({
    name: 'providerListing',
    initialState,
    reducers: {
        getProviderlist :(state,action) =>{
            state.listData =  action.payload
        },
        isLoading :(state,action) =>{
          state.loading =  action.payload
      }
    }
})

export const {
    getProviderlist,isLoading
} = ProviderListingslice.actions;

  export function fetchProviderListingData(data?: any,status?:any) {
    return async (dispatch: any) => {
      try {
        dispatch(isLoading(true))
        const response = await getApiMethod(`${APICONSTANT.hostListings  }?status=${status}`, data)
        if(response.statusCode === 200){
          dispatch(isLoading(false))
          dispatch(getProviderlist(response))
          return response
        }
        
      } catch (error: any) {
        dispatch(isLoading(false))
        console.log(error)
      }
    }
  }

  export const userSelector = (state: any) => state.userReducer;
export default ProviderListingslice.reducer;
