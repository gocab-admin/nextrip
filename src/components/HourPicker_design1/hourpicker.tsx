import React, { useMemo } from 'react'
import { DateObject } from 'react-multi-date-picker'

import { usePageContext } from "@/components/Providers/PageContext";


const hourinMilliSecond = 60 *60 * 1000;
export default function HourPicker({
  state,
  onChange,
  minDate,
  maxDate,
  highlightToday,
  dateChangeKey
}: any) {
  const {i18} = usePageContext();
  const {
    today = new DateObject(),
    onlyShowInRangeDates,
    year = 2021
  } = state

  let minYear = today.year - 4

  minYear -= 12 * Math.ceil((minYear - year) / 12)

  const hoursList = useMemo(() => {
    const hours = []
    let hour = 1

    for (let i = 0; i < 6; i++) {
      const array = []

      for (let j = 0; j < 4; j++) {
        array.push(hour)
        hour++
      }

      hours.push(array)
    }

    return hours
  }, [dateChangeKey])
  
  // min Time
  const minDateInTime = minDate?.toJSON();
  const maxDateInTime = maxDate?.toJSON();
  // selected Date without Hour part
  const selectedTime = useMemo(()=>new DateObject(state?.date?.toDate()).setHour(0).setMinute(0).setSecond(0).toJSON(),[dateChangeKey])

  function selectHour(hour: any) {
    if (notInRange(hour)) return
    const date = new DateObject(state.date).setHour(hour)

    onChange(date, {
      ...state,
      date,
      mustShowYearPicker: false
    })

  }

  function getClassName(hour: any) {
    const names = ['rmdp-day text-center']
    const { selectedDate } = state
    if (names.includes('rmdp-disabled') && onlyShowInRangeDates) return
    if (today.hour === hour && highlightToday) names.push('rmdp-today')
    // heighlight selected hour
  let selectedHour = selectedDate?.hour;
  if(selectedHour===0) {
    selectedHour = 24;
  }
    if (hour === selectedHour) {
      names.push('rmdp-range')
    }

    if (notInRange(hour)) names.push('rmdp-disabled')
    return names.join(' ')
  }

  function notInRange(hour: any) {
    
    const withHour = selectedTime + (hour * hourinMilliSecond);
    return ((minDateInTime+59*60*1000) > withHour) || (maxDateInTime < withHour);
  }

  return (
    <div style={{ width: "100%" }}>
      <div style={{ fontSize: '18px', marginBottom: '35px' }}>{i18?.BOOKINGPAGE?.SELECTHOURRANGE || "Select Hour Range"}</div>
      {hoursList.map((array, i) => (
        <div style={{ marginBottom: '10px' }}
          key={i}
          className="rmdp-ym"
        >
          {array.map((hour, j) => (
            <div style={{ paddingLeft: '30px', paddingRight: '30px' }}
              key={j}
              className={getClassName(hour)}
              onClick={() => selectHour(hour)}
            >
              <span className="sd">
                {/* {hour} */}
                {new DateObject().setHour(hour).format('h A')}
                {/* {toLocaleDigits(year.toString(), digits)} */}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
