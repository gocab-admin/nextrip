import React, { useEffect, useState, useMemo } from 'react'
import { Calendar, DateObject } from 'react-multi-date-picker'

import { formatDateTime } from '@/services/utils/datetime'
import { dispatch } from '@/redux/store'
import { updateTimeDate } from '@/redux/slice/searchValue'

import HourPicker from './hourpicker'



// function formatDate(date: Date) {
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are 0-indexed
//     const year = date.getFullYear().toString();
//     return `${day}-${month}-${year}`;
// }

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

// default Max Date
const maxDateSelectable = new DateObject().add('6','month');
const DateHourBox = ({
    value, onChange, time, type='from'
}: any) => {
    const [date, setDate] = useState<DateObject>(new DateObject())
    const [hour, setHour] = useState<DateObject | null>(new DateObject())
    const [minDate, setMinDate] = useState<DateObject>(new DateObject())
    const [dateChangeKey, setDateChangeKey] = useState(Date.now())
    const [maxDate, setMaxDate] = useState<DateObject>(maxDateSelectable)

    useEffect(()=>{
        // min date is ony for to date
        if(time) {
        if(type==='to') {
            setMinDate(new DateObject(time[0]?.toDate()))
        } else if(type==='from' && time[1]) {
            setMaxDate(new DateObject(time[1]?.toDate()))
        }

        const objDate = type==='from' ? time[0]: time[1];
        if(objDate) {
        const currentParams = new URLSearchParams(
            window.location.search
        );
        const dateHour: any = formatDateTime(objDate?.toDate())
        if (type==='from') {
            currentParams.set("from", dateHour);
        }
        else if (type==='to') {
            currentParams.set("to", dateHour);
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
        dateObj.setYear(date.year)
          .setMonth(date.monthIndex + 1)
          .setDay(date.day)
          .setHour(value.hour)
          .setMinute(0)
          .setSecond(0);
        // setHour(dateObj);
        onChange(dateObj)
    }
    const handleDateChange = (selDate: DateObject) => {
            const dateObj = new DateObject();
            dateObj.setYear(selDate.year)
              .setMonth(selDate.monthIndex + 1)
              .setDay(selDate.day)
              .setHour(0)
              .setMinute(0)
              .setSecond(0);

              setDate(dateObj);
              setHour(null);
            //   setDate(dateObj)
            setDateChangeKey(Date.now());
            // onChange(dateObj)
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
                <div className="col-12 col-sm-6">
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
                </div>
                <div className="col-12 col-sm-6" style={{ padding: '10px' }}>
            
                    <HourPicker
                        state={hourPickerState}
                        minDate={minDate}
                        maxDate={maxDate}
                        /*Date change key is for handling refresh key*/
                        dateChangeKey={dateChangeKey}
                        onChange={handleHourChange}
                    />
                </div>
            </div>
        </div>
    )
}
export default DateHourBox
