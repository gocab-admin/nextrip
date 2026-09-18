import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SetNotify {
    isOpen: any,
    message: string,
    type: string,
    severity: string,
}
export interface Alert {
    alert: SetNotify;
}
export interface AlertList {
    AlertList: Alert
}
export const initialState: AlertList = {
    AlertList: {
        alert: {
            isOpen: false,
            message: '',
            type: '',
            severity: ''
        }
    }
}


export const alertSlice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        addAlert: (state, action: PayloadAction<SetNotify>) => {
            state.AlertList.alert = action.payload;
        },
        reset: (state) => {
            state.AlertList.alert =  initialState.AlertList.alert
        }
    }
});

export const {addAlert,reset} =alertSlice.actions;
export const alertSelector = (state: any) => state.alertReducer;
export default alertSlice.reducer;
