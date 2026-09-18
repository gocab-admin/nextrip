import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loader : true,
    forgot : false
  }

  const LoadingSlice = createSlice({
    name: "LoadingSlice",
    initialState,
    reducers: {
      setLoader: (state, action) => {
        state.loader = action.payload;
      },
      setforgot: (state, action) => {
        state.forgot = action.payload;
      }
    }
  })
  export const {
    setLoader,setforgot
  } = LoadingSlice.actions;

  export default LoadingSlice.reducer;
