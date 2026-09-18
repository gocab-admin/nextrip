import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/user/userSlice';
import listReducer from './slice/listingSlice'
import detailsReducer from './slice/detailSlice'
import categoryReducer from './slice/categoriesSlice'
import alertReducer from './slice/AlertSlice'
import currencyReducer from './slice/CurrencySlice'
import modalReducer from './slice/modalSlice'
import aboutReducer from './slice/user/userAboutDataSlice'
import hostaboutSlice from './slice/host/hostAboutDataSlice'
import latLngLocationReducer from './slice/mapDataSlice'
import bookingReducer from './slice/user/BookingSlice'
import ListingDataReducer from './slice/listdataSlice'
import bookingdateReducer from './slice/DateSlice'
import approvedlist from './approvedListSlice'
import BankDetailsSliceReducer from './slice/bankDetails'
import ProviderListingsliceReducer from './slice/host/providerlistingsSlice'
import LoadingSliceReducer from "./slice/isLoading" 
import ChatNotificationCount from "./slice/chatNotification"
import SearchValue from "./slice/searchValue"
import hostCalendarList from './slice/host/hostlistingCalendar';
import settingReducer from './slice/settingSlice';
import propertyReducer from './slice/propertySlice'
import cmsSlice from './slice/footerSlice'; 
import AdFormReducer from './slice/ads/AdFormSlice'
import AdsDataReducer from './slice/ads/adslistdataSlice'
// import hostCalendarList from "./slice/host/hostlistingCalendar"
// import FilterValue from "./slice/filterValue"

export const store = configureStore({
  reducer: {
    userReducer,
    listReducer,
    propertyReducer, // alternate for listReducer
    AdFormReducer,
    detailsReducer,
    categoryReducer,
    alertReducer,
    currencyReducer,
    modal: modalReducer,
    about: aboutReducer,
    hostAbout:hostaboutSlice,
    latLngLocation: latLngLocationReducer,
    bookingEstimation:bookingReducer,
    listingData:ListingDataReducer,
    adsData: AdsDataReducer,
    savedDate:bookingdateReducer,
    approvedlist,
    BankDetails:BankDetailsSliceReducer,
    listdata:ProviderListingsliceReducer,
    isLoader:LoadingSliceReducer,
    ChatNotificationCount,
    SearchValue,
    settingReducer,
    hostCalendarList,
    cmsSlice
  }
});
export const { dispatch } = store
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
