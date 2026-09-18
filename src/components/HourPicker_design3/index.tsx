import React, { useEffect, useState, useMemo } from 'react'
import { Calendar, DateObject } from 'react-multi-date-picker'
import { dispatch } from '@/redux/store'
import { updateTimeDate } from '@/redux/slice/searchValue'
import { usePageContext } from "@/components/Providers/PageContext";
import { toast } from "react-toastify";
import HourPicker from './hourPicker'

const maxDateSelectable = new DateObject().add('6', 'month');
const DateHourBox = ({
  value, onChange, time, type = 'from', list, mobileView, schedule, bookedhours
}: any) => {
  const { i18 } = usePageContext();
  const [date, setDate] = useState<DateObject | null>(null)
  const [hour, setHour] = useState<DateObject | null>(null)
  const [minDate, setMinDate] = useState<DateObject>(new DateObject())
  const [dateChangeKey, setDateChangeKey] = useState(Date.now())
  const [maxDate, setMaxDate] = useState<DateObject>(maxDateSelectable)

  useEffect(() => {
    // min date is ony for to date
    if (time) {
      if (type === 'to') {
        setMinDate(new DateObject(time[0]?.toDate()).add(2, "hours"))
      } else if (type === 'from' && time[1]) {
        setMaxDate(new DateObject(time[1]?.toDate()))
      }
    }
  }, [time])

  const handleHourChange = (value: DateObject) => {
    // value.setMinute(0).setSecond(0)
    const dateObj = new DateObject();
    if (date) {
      dateObj.setYear(date.year)
        .setMonth(date.monthIndex + 1)
        .setDay(date.day)
        .setHour(value.hour)
        .setMinute(0)
        .setSecond(0);
      // setHour(dateObj);
      onChange(dateObj)
    }
  }
  const handleDateChange = (selDate: DateObject) => {
    const dateObj = new DateObject();
    let hourInt = 0;
    if (hour)
      hourInt = parseInt(hour?.format('H')) || 0;

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

  const hourPickerState = useMemo(() => ({
    date: date,
    selectedDate: hour,
    range: true,
    className: 'rmdp-prime',
    value: hour
  }), [hour, date])

  return (
    <div>
      <div className="row">
        <div className="col-12 px-5 py-2" >
          {!mobileView && <h6>{type == 'from' ? i18?.ROOMPAGE?.CHECKIN || "Check In" : i18?.ROOMPAGE?.CHECKOUT || "Check Out"}:</h6>}
          <div style={{
            display: "flex", gap: "50px",
            flexDirection: mobileView ? 'column' : 'row'
          }}>
            <Calendar
              multiple={false}
              highlightToday={false}
              numberOfMonths={1}
              mapDays={({ date }) => {
                const formattedDate = date.format("DD-MM-YYYY");
                const isblocked = list.includes(formattedDate);
                if (isblocked) {
                  return {
                    disabled: true,
                    style: {
                      backgroundColor: "#ccc",
                      color: "#fff",
                    },
                    onClick: () => toast.info("This date is unavailable"),
                  };
                }
              }}
              // following props is changing original object, so we need to clone props, to avoid change of original object
              // minDate={new DateObject().add(2, "days")}
              minDate={new Date(new Date().setHours(0, 0, 0, 0))}
              // maxDate={new DateObject(maxDate.toDate())}
              value={date}
              onChange={handleDateChange}
              className="rmdpprime"
              format="DD/MM/YYYY"
            />
            <HourPicker
              state={hourPickerState}
              minDate={minDate}
              maxDate={maxDate}
              mobileView={mobileView}
              bookedhours={bookedhours}
              /*Date change key is for handling refresh key*/
              dateChangeKey={dateChangeKey}
              onChange={handleHourChange}
              type={type}
              schedule={schedule}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default DateHourBox
