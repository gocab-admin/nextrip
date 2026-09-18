import React, { useEffect, useState, useMemo } from 'react'
import { Calendar, DateObject } from 'react-multi-date-picker'

import { formatDateTime } from '@/services/utils/datetime'
import { dispatch } from '@/redux/store'
import { updateTimeDate } from '@/redux/slice/searchValue'
import { usePageContext } from "@/components/Providers/PageContext";
import HourPicker from './hourPicker'

// const getDatesBetween = (startDate: Date, endDate: Date): string[] => {
//     const dates: string[] = [];
//     const currentDate: Date = new Date(startDate);

//     while (currentDate <= endDate) {
//         const formattedDate = formatDate(currentDate);
//         dates.push(formattedDate);
//         currentDate.setDate(currentDate.getDate() + 1); 
//     }

//     return dates;
// }
// const currentDate = new DateObject()
// default Max Date
const maxDateSelectable = new DateObject().add('6','month');
const DateHourBox = ({
    value, onChange, time, type='from'
}: any) => {
    const { i18 } = usePageContext();
    const [date, setDate] = useState<DateObject>()
    const [hour, setHour] = useState<DateObject | null>(new DateObject())
    const [minDate, setMinDate] = useState<DateObject>(new DateObject())
    const [dateChangeKey, setDateChangeKey] = useState(Date.now())
    const [maxDate, setMaxDate] = useState<DateObject>(maxDateSelectable)

    useEffect(()=>{
        // min date is ony for to date
        if(time) {
        if(type==='from') {
            setMinDate(new DateObject(time[0]?.toDate()))
        } else if(type==='to' && time[1]) {
            setMaxDate(new DateObject(time[1]?.toDate()))
        }

        const objDate = type==='from' ? time[0]: time[1];
        if(objDate) {
        const currentParams = new URLSearchParams(
            window.location.search
        );
        const dateHour: any = formatDateTime(objDate?.toDate())
        if (type==='from') {
            currentParams.set("startDate", dateHour);
        }
        else if (type==='to') {
            currentParams.set("endDate", dateHour);
        }
        window.history.replaceState(
            { path: `?${  currentParams.toString()}` },
            "",
            `?${  currentParams.toString()}`
        );
        }
    }
    },[time])
    
    const handleHourChange = (value: DateObject) => {
        // value.setMinute(0).setSecond(0)
        const dateObj = new DateObject();
        dateObj.setYear(minDate.year)
          .setMonth(minDate.monthIndex + 1)
          .setDay(type==="from" ? minDate.day : maxDate.day)
          .setHour(value.hour)
          .setMinute(0)
          .setSecond(0);

        // setHour(dateObj);
        onChange(dateObj)
    }
    const handleDateChange = (selDate: DateObject) => {
            const dateObj = new DateObject();
            let hourInt = 0;
            if(hour)
            hourInt = parseInt(hour?.format('H')) || 0;
            // hourInt = (hourInt + 2) % 24;

            dateObj.setYear(selDate.year)
              .setMonth(selDate.monthIndex + 1)
              .setDay(selDate.day)
              .setHour(hourInt)
              .setMinute(0)
              .setSecond(0);

              setDate(dateObj);
              setHour(null);
            //   setDate(dateObj)
            setDateChangeKey(Date.now());
            onChange(dateObj)
    }

    useEffect(() => {
        if (value && !Array.isArray(value)) {
            const dateObj = new DateObject(value.toDate());

            setHour(dateObj);
            setDate(dateObj);

            setDateChangeKey(Date.now());
            dispatch(updateTimeDate(value))
        }
    }, [value])

    const getNextDay = () => {
        const nextDay = new Date()
        nextDay.setDate(nextDay.getDate() + 1)
        return nextDay
    }

    const hourPickerState = useMemo(()=>({
            date: date,
            selectedDate: hour,
            range: true,
            className: 'rmdp-prime',
            value: hour
        }),[hour, date])
    
    return (
        <div>
            <div className="row">
                <div className="col-12 py-2" style={{width: "100vw"}} >
                    <h6 className='mt-2'>{type=='from'? i18?.ROOMPAGE?.CHECKIN || "Check In":i18?.ROOMPAGE?.CHECKOUT || "Check Out" }:</h6>
                    <div style={{gap:"50px"}}>
                    <Calendar
                        multiple={false}
                        highlightToday={false}
                        numberOfMonths={1}
                        // following props is changing original object, so we need to clone props, to avoid change of original object
                        minDate={new DateObject(minDate.toDate())}
                        maxDate={new DateObject(maxDate.toDate())}
                        value={date}
                        onChange={handleDateChange}
                        className="rmdpprime"
                        format="DD/MM/YYYY"
                    />

                    <HourPicker
                        state={hourPickerState}
                        minDate={minDate}
                        maxDate={maxDate}
                        /*Date change key is for handling refresh key*/
                        dateChangeKey={dateChangeKey}
                        onChange={handleHourChange}
                        type={type}
                    />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default DateHourBox
