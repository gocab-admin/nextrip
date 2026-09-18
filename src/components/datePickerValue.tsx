"use client"
import React, { useState } from 'react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';


const DatePickerValue = () => {

    const [startDate, setStartDate] = useState<any>(null);
    const [endDate, setEndDate] = useState<any>(null);
    const [focusedInput, setFocusedInput] = useState<any>("true");
    const [autoFocus, setautoFocus] = useState<any>("true");

    return (
        <>
            {/* <DateRangePicker
                onChange={(item: any) => {
                    setState([item.selection])
                }}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={state}
                direction="horizontal"
            /> */}
             

             
            {/* <DateRangePicker
            // isFocused
                keepFocusOnInput={focusedInput}
                startDateId="startDate"
                endDateId="endDate"
                startDate={startDate}
                endDate={endDate}
                onDatesChange={({ startDate, endDate }) => { 
                    setStartDate(startDate)
                    setEndDate(endDate)
                }}
                focusedInput={focusedInput}
                onFocusChange={(focusedInput) => { 
                    setFocusedInput(focusedInput)
                }}
            /> */}
        </>
    )
};

export default DatePickerValue;
