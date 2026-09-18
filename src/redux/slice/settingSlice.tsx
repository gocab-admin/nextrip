import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiMethod } from '@/services/global'
import { changeData, languageData } from "./CurrencySlice";


export interface Setting {
    settings: any,
    languages: any[],
    currency: any[],
    selCurrency:any[]
    languageLoading: boolean
}
const initialState: Setting = {
    settings: {},
    languageLoading: false,
    languages: [],
    currency: [],
    selCurrency:[]
}


export const settingSlice = createSlice({
    name: "setting",
    initialState,
    reducers: {
        fetchSettingApp: (state, action: PayloadAction<any>) => {
            state.settings = action.payload;
        },
        setLanguageLoading: (state, action: PayloadAction<any>) => {
            state.languages = action.payload;
        },
        setLanguages: (state, action: PayloadAction<any>) => {
            if(Array.isArray(action.payload))
            state.languages = action.payload;
        },
        setCurrency: (state, action: PayloadAction<any>) => {
            if(Array.isArray(action.payload))
            state.currency = action.payload;
        },
        setSelectedCurrency: (state, action: PayloadAction<any>) => {
          if(Array.isArray(action.payload))
          state.selCurrency = action.payload;
      }
    }
});
export const {
    fetchSettingApp,
    setLanguages,
    setLanguageLoading,
    setCurrency,
    setSelectedCurrency
} = settingSlice.actions;
export const settingSelector = (state: any) => state.settingReducer;

// fetch language
export const fetchLanguage = () => async (dispatch: any) => {
    try {
        dispatch(setLanguageLoading(true))
      const response = await getApiMethod(
        `translation/languages/user`
      )
      if (response.statusCode === 200) {
        dispatch(setLanguages(response.data.language))
        const DefaultLanguage = response?.data?.language.find((language: any) => language.default)
        dispatch(languageData(DefaultLanguage))
        // dispatch(false)
        return response
      }
    } catch (error: any) {
      console.log(error)
    }
  
  }


// fetch currency
export const fetchCurrency = () => async (dispatch: any) => {
  try {
      // dispatch(setLanguageLoading(true))
    const response = await getApiMethod(
      `Currency/currencies`
    )
    if (response.statusCode === 200) {
      dispatch(setCurrency(response?.data?.currency))
      const DefaultCurrency = response?.data?.currency.find((currency: any) => currency.default)
      dispatch(changeData(DefaultCurrency))
      // dispatch(setLanguageLoading(false))
      return response
    }
  } catch (error: any) {
    console.log(error)
  }

}

//fetch selected currency
export const fetchSelectedCurrency = () => async (dispatch: any) => {
  try {
      // dispatch(setLanguageLoading(true))
    const response = await getApiMethod(
      `Currency/currencies/INR`
    )
    if (response.statusCode === 200) {
      dispatch(setSelectedCurrency(response?.data?.currency))
      // dispatch(setLanguageLoading(false))
      return response
    }
  } catch (error: any) {
    console.log(error)
  }

}


export default settingSlice.reducer;
