import React, { useMemo, useState } from 'react'
import { DateObject } from 'react-multi-date-picker'

import { usePageContext } from "@/components/Providers/PageContext";

function selectRange(selectedDate: any, focused: any) {
  // if (weekPicker)
  //   return [
  //     new DateObject(focused).toFirstOfWeek(),
  //     new DateObject(focused).toLastOfWeek(),
  //   ];
  if (selectedDate.length === 2 || selectedDate.length === 0) {
    return [focused]
  }
  if (selectedDate.length === 1) {
    return [selectedDate[0], focused].sort((a, b) => a - b)
  }
  return []
}

function selectDate(
  date: any,
  {
    range,
    selectedDate,
    format,
    focused: previousFocused,
  }: any,
) {
  date.setFormat(format)

  const focused = new DateObject(date)

  selectedDate = selectRange(selectedDate, focused)

  return [selectedDate, focused]
}

export default function HourPicker({
  state,
  onChange,
  sort,
  handleFocusedDate,
  onYearChange,
  rangeHover,
  highlightToday,
}: any) {
  const {
    date,
    today = new DateObject(),
    minDate,
    maxDate,
    onlyYearPicker,
    range,
    onlyShowInRangeDates,
    year = 2021,
  } = state

  // const mustShowYearPicker = state.mustShowYearPicker || onlyYearPicker
  // const digits = 2
  const [yearHovered, setyearHovered] = useState<any>()
  const {i18} = usePageContext();
  
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
  }, [minYear])

  return (
    <div style={{ width: "100%" }}>
      <div style={{ fontSize: '18px', marginBottom: '35px' }}>{i18?.BOOKINGPAGE?.SELECTHOURRANGE ||  "Select Hour Range"}</div>
      {hoursList.map((array, i) => (
        <div style={{ marginBottom: '10px' }}
          key={i}
          className="rmdp-ym"
          onMouseLeave={() => rangeHover && setyearHovered(null)}
        >
          {array.map((hour, j) => (
            <div style={{ paddingLeft: '30px', paddingRight: '30px' }}
              key={j}
              className={getClassName(hour)}
              onClick={() => selectHour(hour)}
              onMouseEnter={() => rangeHover && setyearHovered(hour)}
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

  function selectHour(hour: any) {
    if (notInRange(hour)) return
    const date = new DateObject(state.date).setHour(hour)
    // const { selectedDate, focused } = state

    const [selectedDate, focused] = selectDate(date, state)

    onChange(selectedDate, {
      ...state,
      date,
      focused,
      selectedDate,
      mustShowYearPicker: false,
    })

    handleFocusedDate(focused, date)
  }


  function getClassName(hour: any) {
    const names = ['rmdp-day text-center']
    const { date, selectedDate, multiple } = state

    if (notInRange(hour)) names.push('rmdp-disabled')

    if (names.includes('rmdp-disabled') && onlyShowInRangeDates) return
    if (today.hour === hour && highlightToday) names.push('rmdp-today')

    getRangeClass(selectedDate)

    function getRangeClass(selectedDate: any) {
      const first = selectedDate[0]
      const second = selectedDate[1]

      if (selectedDate.length === 1) {
        if (hour === first.hour) names.push('rmdp-range')
        if (hour === 24 && first.hour === 0) names.push('rmdp-range')

        if (rangeHover) {
          const selectedYear = selectedDate[0].hour

          if (
            (hour > selectedYear && hour <= yearHovered)
            || (hour < selectedYear && hour >= yearHovered)
          ) {
            names.push('rmdp-range-hover')

            if (hour === yearHovered) {
              names.push(yearHovered > selectedYear ? 'end' : 'start')
            }
          }
        }
      } else if (selectedDate.length === 2) {
        const secondHour = second?.hour === 0 ? 24 : second?.hour
        if (hour >= first?.hour && hour <= secondHour) names.push('rmdp-range')
        if (hour === first?.hour) names.push('start')
        if (hour === secondHour) names.push('end')
      }
    }

    return names.join(' ')
  }

  function notInRange(hour: any) {
    return (minDate && hour < minDate.hour) || (maxDate && hour > maxDate.hour)
  }
}
