import { createSlice } from '@reduxjs/toolkit'
import {getApiMethod, postApiMethod } from '@/services/global'
import APICONSTANT from '@/services/config'

const initialDateState: any = {
  dateValue: null,
  BlockedDates:null,
  calendarDates: []
}

export const bookingdateSlice = createSlice({
  name: 'bookingDates',
  initialState: initialDateState,
  reducers: {
   
    setDateValue(state, action) {
      state.dateValue = action.payload
    },
    setCalendarDates(state, action) {
      state.calendarDates = action.payload
    },
    setFetchData(state, action) {
        state.BlockedDates = action.payload
    }
  }
})

export const {
   setDateValue,setFetchData, setCalendarDates
} = bookingdateSlice.actions

export const saveBookingDates = (startDate:any, endDate:any,id:any) => async (dispatch:any) => {

  try {
    const response = await postApiMethod(`${APICONSTANT.blockedDates  }/${id}`, {

      start: startDate,
      end: endDate,
      progressPercentage:21
    })
    return response
  } catch (error) {
    debugger;
    console.error('Error:', error)
  }
}

export const fetchCalendar = () => async (dispatch:any) => {

  try {
    const response = await getApiMethod(`${APICONSTANT.calendarDates}`)
    dispatch(setCalendarDates(response.data))
    return response
  } catch (error) {
    console.error('Error:', error)
  }
}

export const fetchBlockedDates = (id:any) => async (dispatch:any) => {

    try {
      const response = await getApiMethod(`${APICONSTANT.blockedDates  }/${id}`)
      dispatch(setFetchData(response))
      return response
    } catch (error) {
      console.error('Error:', error)
    }
  }
export default bookingdateSlice.reducer
