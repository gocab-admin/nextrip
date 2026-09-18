import React, { useEffect, useState } from 'react'
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

const DateHourBox = ({
    beds, baths, value, onChange, onSave
}: any) => {
    const [hourRange, setHourRange] = useState<DateObject[]>([new DateObject()])
    const handleHourChange = (value: DateObject[]) => {
        if(value[0]) {
            value[0].setMinute(0).setSecond(0)
        }
        if(value[1]) {
            value[1].setMinute(0).setSecond(0)
        }
        const startDate: any = value[0] && formatDateTime(value[0]?.toDate())
        const endDate: any = value[1] && formatDateTime(value[1]?.toDate())
        onChange(value)
        const currentParams = new URLSearchParams(
            window.location.search
        );
        if (value[0]) {
            currentParams.set("from", startDate);
        }
        if (value[1]) {
            currentParams.set("to", endDate);
        }
        // router.replace(`?${currentParams}`, {
        //   scroll: false,
        // })
        window.history.replaceState(
            { path: `?${  currentParams.toString()}` },
            "",
            `?${  currentParams.toString()}`
        );
    }
    const handleDateChange = (selDate: DateObject) => {
        if (hourRange[0]) {
            hourRange[0].setYear(selDate.year)
              .setMonth(selDate.monthIndex + 1)
              .setDay(selDate.day)
          }
          if (hourRange[1]) {
            hourRange[1].setYear(selDate.year)
              .setMonth(selDate.monthIndex + 1)
              .setDay(selDate.day)
          }
          if (hourRange[0] && hourRange[1]) {
            onChange([hourRange[0], hourRange[1]])
          } else if (hourRange[0]) {
            onChange([hourRange[0]])
          } else {
            onChange([selDate])
          }
        const currentParams = new URLSearchParams(
            window.location.search
        );
        if (hourRange[0]) {
            const fromDate = formatDateTime(hourRange[0].toDate());
            if(fromDate)
            currentParams.set("from", fromDate);
        }
        if (hourRange[1]) {
            const endDate = formatDateTime(hourRange[1].toDate());
            if(endDate)
            currentParams.set("to", endDate);

        }
        // router.replace(`?${currentParams}`, {
        //   scroll: false,
        // })
        window.history.replaceState(
            { path: `?${  currentParams.toString()}` },
            "",
            `?${  currentParams.toString()}`
        );

    }
    useEffect(() => {
        if (value) {
            setHourRange(value)
            dispatch(updateTimeDate(value))
        }
    }, [value])
    const getNextDay = () => {
        const nextDay = new Date()
        nextDay.setDate(nextDay.getDate() + 1)
        return nextDay
    }
    const saveDate = () => {
        onSave(hourRange)
    }
    function deselect(date: any) {
        if (!Array.isArray(hourRange)) return

        const selectedDate = hourRange.filter((d: any) => d !== date)
        onChange(selectedDate)
    }
    //   const blockedDate:any = useSelector((state: RootState) => state.listing?.blockedDate)
    const from = hourRange[0]?.format?.('D/M/YYYY h A')
    const to = hourRange[1]?.format?.('D/M/YYYY h A')
    const [list, setlist] = useState<string[]>([])
    //   const blcDate = () => {
    //     if (Array.isArray(blockedDate) && blockedDate.length > 0) {
    //       const lists: string[][] = [];
    //       blockedDate?.map((date: any) => {
    //         const startDate = new Date(date.start);
    //         const endDate = new Date(date.end);
    //         const dates = getDatesBetween(startDate, endDate);
    //         lists.push(dates);
    //       });
    //       setlist(lists.flat());
    //     }
    //   };

    //  useEffect(()=>{
    //   blcDate()
    //  },[])
    return (
        <div>
            <div className="row">
                <div className="col-12 col-sm-6">
                    <Calendar
                        multiple={false}
                        highlightToday={false}
                        numberOfMonths={1}
                        minDate={getNextDay()}
                        value={hourRange[0]}
                        onChange={handleDateChange}
                        className="rmdpprime"
                        format="DD/MM/YYYY"
                    />

                </div>
                <div className="col-12 col-sm-6" style={{ padding: '10px' }}>
                    <HourPicker
                        state={{
                            date: hourRange[0] || new DateObject(),
                            selectedDate: hourRange,
                            range: true,
                            className: 'rmdp-prime',
                            minDate: getNextDay(),
                            value: hourRange
                        }}
                        handleFocusedDate={(item: any) => {
                            //   setSelectedDaterange([item])
                        }}
                        rangeHover
                        onChange={handleHourChange}
                    />
                </div>
            </div>
        </div>
    )
}
export default DateHourBox
