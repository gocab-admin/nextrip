import { createSlice } from "@reduxjs/toolkit";
import { getApiMethod, postApiMethod } from '@/services/global'
import APICONSTANT from "@/services/config";

const initialState = {
  aboutData: {},
  isLoading: false,
  gallery:[],
  totalCount:0,
  selectedImage:[]
}
const hostaboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    fetchAboutDataSuccess(state, action) {
      state.aboutData = action.payload
    },
    setLoading(state, action) {
      state.isLoading = action.payload
    },
    fetchGallery(state, action) {
      state.gallery = action.payload
    },
    fetchTotalCount(state,action) {
      state.totalCount = action.payload
    },
    selectedGalleryImg(state, action) {
      state.selectedImage = action.payload
    },
  }
})

export const {
  fetchAboutDataSuccess,
  setLoading,fetchGallery,selectedGalleryImg,fetchTotalCount
} = hostaboutSlice.actions


export const fetchHostAboutData = (id: any) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    const response = await getApiMethod(`${APICONSTANT.hostdetails  }/${id}`)
    if (response.statusCode === 200) {
      dispatch(setLoading(false))
      dispatch(fetchAboutDataSuccess(response.data.accountDeteails))
    } else {
      dispatch(setLoading(false))
    }
  } catch (error: any) {
    dispatch(setLoading(false))
    console.log(error)
  }
}

export const fetchGalleryModule = (data: any) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true))
    const response = await getApiMethod(`${APICONSTANT.Gallery  }`,data)
    if (response.statusCode === 200) {
      dispatch(setLoading(false))
      dispatch(fetchGallery(response?.data?.galleryImage))
      dispatch(fetchTotalCount(response?.totalCount))
    } else {
      dispatch(setLoading(false))
    }
  } catch (error: any) {
    dispatch(setLoading(false))
    console.log(error)
  }
}

export const SetImageGallery = (data: any) => async (dispatch: any) => {
  debugger
  try {
    dispatch(setLoading(true))
    const response = await postApiMethod(`${APICONSTANT.Gallery  }`,data)
    if (response.statusCode === 201) {
      dispatch(setLoading(false))
     return response
    } else {
      dispatch(setLoading(false))
    }
  } catch (error: any) {
    dispatch(setLoading(false))
    console.log(error)
  }
}
export const userSelector = (state: any) => state.userReducer;
export default hostaboutSlice.reducer;
