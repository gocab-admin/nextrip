import { createSlice } from "@reduxjs/toolkit";
import {getApiMethod } from '@/services/global'
import APICONSTANT from "@/services/config";


const initialState = {
    aboutData: {},
  GetReview: {},
  loader:false

  }
  const aboutSlice = createSlice({
    name: 'about',
    initialState,
    reducers: {
      fetchAboutDataSuccess(state, action) {
        state.aboutData = action.payload
      },
      getReviews: (state, action:any) => {
        state.GetReview = action.payload;
      },
      Loading: (state,action) => {
        state.loader = action.payload;
      }
    }
  })
  
  export const {
    fetchAboutDataSuccess,getReviews,Loading
  } = aboutSlice.actions
  
  
  export const fetchUserAboutData = () => async (dispatch: any) => {
    try {
      const response = await getApiMethod(APICONSTANT.signup)
      dispatch(fetchAboutDataSuccess(response))
      return response
    } catch (error: any) {
      console.log(error)
    }
  }

  export const viewReview = (postId: string, bookId: string) => async (dispatch: any) => {
    dispatch(Loading(true))
    try {
      const response = await getApiMethod(
        `${APICONSTANT.getreviewRating}/${postId}/${bookId}?_page=1&_limit=90`
      )
      if (response.statusCode === 200) {
        dispatch(getReviews(response.data))
        // setTimeout(() => dispatch(Loading(false)), 4000);
        dispatch(Loading(false))
        return response
      } 
    } catch (error: any) {
      dispatch(Loading(false))
      console.log(error)
    }
  
  }
export const userSelector = (state: any) => state.userReducer;
export default aboutSlice.reducer;
