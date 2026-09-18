import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SetCurrency {
    currency: any,
}

export interface CurrencyList {
    CurrencyList: SetCurrency,
    currencyData: any,
    languageData: any
}
export const initialState: CurrencyList = {
    CurrencyList: {
        currency: '$'
    },
    currencyData: {},
    languageData: {}
}


export const currencySlice = createSlice({
    name: "currency",
    initialState,
    reducers: {
        changeCurrency: (state, action: PayloadAction<SetCurrency>) => {
            state.CurrencyList.currency = action.payload;
        },
        changeData: (state, action: PayloadAction<any>) => {
            state.currencyData =  action.payload;
        },
        languageData: (state, action: PayloadAction<any>) => {
            state.languageData = action.payload;
        }
    }
});

export const {
    changeCurrency,
    changeData,
    languageData
    // reset
} =
    currencySlice.actions;
export const currencySelector = (state: any) => state.currencyReducer;
export default currencySlice.reducer;
