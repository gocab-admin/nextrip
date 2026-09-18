import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { putApiMethod } from '@/services/global'
export interface User {
  id: string;
  name: string;
  email: string;
}
export interface UserInfo {
  userInfo: User[],
}
const initialState: UserInfo = {
    userInfo: [{
			id: '1',
			name: 'John Doe',
			email: 'john@test.com'
		}]
}


export const hostSlice = createSlice({
  name: "host",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.userInfo.push(action.payload);
    }
  }
});

//Put APIs
export const updateHost = (userId: string, updatedValues: any, token: string, fcmId: any) => async (dispatch: any) => {
    try {
      const response = await putApiMethod(
        `auth/provider/${userId}`,
        updatedValues
      )
    } catch (error: any) {
      console.log(error)
    }
  }
export const { addUser } =
  hostSlice.actions;
export const userSelector = (state: RootState) => state.userReducer;
export default hostSlice.reducer;
