import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiMethod, putApiMethod } from '@/services/global'

export interface UserInfo {
  userInfo: any;
  status: any
}
export interface GetReview {
  GetReview: any
}
const initialState: UserInfo = {
  userInfo: {},
  status: {
    loginStatus: false,
    userType: "USER",
    listCount: 0
  }
}


export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
    },
    updateStatus: (state, action: PayloadAction<any>) => {
      state.status = {
        ...state.status,
        ...action.payload
      };
    },
    clearData: (state) => {
      state.userInfo = initialState
    }
    
  }
});

//Put APIs
export const updateUser = (userId: string, updatedValues: any) => async (dispatch: any) => {
  try {
    const response = await putApiMethod(
      `auth/user/${userId}`,
      updatedValues
    )
    if (response.statusCode === 200) {
      return response
    } else {
      localStorage.clear()
    }
  } catch (error: any) {
    console.log(error)
  }

}


export const { addUser, updateStatus } =
  userSlice.actions;
export const userSelector = (state: any) => state.userReducer;
export default userSlice.reducer;
