import { createSlice } from "@reduxjs/toolkit";
import { getApiMethod } from '@/services/global'
import APICONSTANT from "@/services/config";

const initialState = {
    chatCount:0
  }

  const ChatNotificationCount = createSlice({
    name: "listingdata",
    initialState,
    reducers: {
      getCount: (state, action) => {
        state.chatCount = action.payload;
      }
    }
  })
  export const {
    getCount
  } = ChatNotificationCount.actions;

  export function getChatCount() {
    return async (dispatch: any) => {
      try {
        const response = await getApiMethod(APICONSTANT.burgerCount)
        dispatch(getCount(response?.data))
        return response
      } catch (error: any) {
        console.log(error)
      }
    }
  }
  
  export default ChatNotificationCount.reducer;
