import React, { useMemo, useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DateObject } from "react-multi-date-picker";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { usePageContext } from "@/components/Providers/PageContext";
import dayjs from "dayjs";
import "./page.scss";

const hourinMilliSecond = 60 * 60 * 1000;
export default function HourPicker({
  state,
  onChange,
  minDate,
  maxDate,
  dateChangeKey,
  type,
  mobileView,
  schedule,
  bookedhours,
}: any) {
  const { i18 } = usePageContext();
  const [selectedTimes, setSelectedTimes] = useState<any>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const { today = new DateObject(), year = 2021 } = state;

  useEffect(() => {
    setSelectedTimes(state.value);
  }, [state.value])


  // const searchParams = useSearchParams()

  // useEffect(()=>{

  //   let from:any = searchParams.get('startDate')
  //   let to:any = searchParams.get('endDate')
  //   let fromTime = new Date(from);
  //   let toTime = new Date(to);

  //   if(from && type === "from"){
  //     const hours = fromTime.getUTCHours().toString().padStart(2, '0');
  //     setSelectedTimes(parseInt(`${hours}`,10))
  //   }
  //   if(to && type === "to"){
  //     const hours = toTime.getUTCHours().toString().padStart(2, '0');
  //     setSelectedTimes(parseInt(`${hours}`,10))
  //   }
  // },[searchParams])

  let minYear = today.year - 4

  minYear -= 12 * Math.ceil((minYear - year) / 12)

  const hoursList = useMemo(() => {
    const hours = []
    for (let i = 0; i <= 23; i++) {
      //@todo: Filter booked hours here
      hours.push(i)
    }
    return hours
  }, [dateChangeKey])

  // min Time
  // const minDateInTime = minDate?.toJSON();
  // console.log("minDateInTime", minDate);
  // const maxDateInTime = maxDate?.toJSON();
  const minDateInTime = minDate?.toJSON();
  console.log('minDateInTime', minDate)
  const maxDateInTime = maxDate?.toJSON();
  // selected Date without Hour part
  // const selectedTime = useMemo(
  //   () =>
  //     new DateObject(state?.date?.toDate())
  //       .setHour(0)
  //       .setMinute(0)
  //       .setSecond(0)
  //       .toJSON(),
  //   [dateChangeKey]
  // );

  const selectedTime = useMemo(() => new DateObject(state?.date?.toDate()).setHour(0).setMinute(0).setSecond(0).toJSON(), [dateChangeKey])

  function selectHour(hour: any) {
    if (notInRange(hour)) return
    const date = new DateObject(state.date).setHour(hour)

    onChange(date, {
      ...state,
      date,
      mustShowYearPicker: false
    })

  }

  function notInRange(hour: any) {
    const calcHourMilli = hour * hourinMilliSecond;
    const withHour = selectedTime + calcHourMilli;
    // 59 * 60 * 1000
    let isInvalid = ((minDateInTime) > withHour) || (maxDateInTime < withHour);
    if (state.date === null || isInvalid)
      return true;
    const date = new DateObject(state.date);
    const day = date.weekDay.index;
    const scheduleInfo = schedule[day] || null;
    if (scheduleInfo) {
      const startTime = new DateObject({
        date: scheduleInfo.openingTime,
        format: 'HH:mm A'
      })

      const closingTime = new DateObject({
        date: scheduleInfo.closingTime,
        format: 'HH:mm A'
      })
      const startHour = startTime.hour * hourinMilliSecond;
      const endHour = closingTime.hour * hourinMilliSecond;
      if (calcHourMilli < startHour || calcHourMilli > endHour)
        return true;
    }

    const hourInUnix = date.setHour(hour).setMinute(0).setSecond(0).toUnix();
    const isVald = bookedhours.some((item: any) => item[0] <= hourInUnix && item[1] >= hourInUnix)
    return isVald;
  }

  const handleChangeHour = (e: any) => {
    const value = e || 0;
    setSelectedTimes(value)
    selectHour(parseInt(value))
  }

  const handleClickHour = (e: any) => {
    const value = e.currentTarget.dataset.val || 0;
    setSelectedTimes(value)
    selectHour(parseInt(value))
  }

  const handleScrollUp = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollBy({
        top: -50, // Adjust this value as needed
        behavior: 'smooth'
      });
    }
  };

  const handleScrollDown = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollBy({
        top: 50, // Adjust this value as needed
        behavior: 'smooth'
      });
    }
  };
  if (mobileView) {
    return (
      <div style={{ width: "100%" }}>
        <div>{i18?.ROOMPAGE?.TIME || "Time"}</div>
        <div className="hour-picker-container">
          {hoursList.map((hour, i) => {
            const formatHour = new DateObject().setHour(hour).format("H:00");
            const isInvalid = notInRange(hour);
            return (
              <button
                key={i}
                onClick={handleClickHour}
                data-val={hour}
                className={`hour-picker-item${isInvalid ? " disabled" : ""} ${state?.selectedDate?.hour === hour && !isInvalid
                  ? " selected"
                  : ""
                  }`}
              >
                {formatHour}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <>
      {/* /////////////////////////////////////////// */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            marginBottom: "8px",
            display: "flex",
            columnGap: "8px",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div>{i18?.ROOMPAGE?.TIME || "Time"}</div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div onClick={handleScrollUp}>
              <KeyboardArrowUpOutlinedIcon sx={{ fontWeight: 600 }} />
            </div>
            <div
              className="time-picker"
              ref={scrollableRef}
              style={{
                height: "200px",
                overflowY: "scroll",
                width: "150px",
                padding: "10px",
              }}
            >
              {/* <option>Select Time</option> */}
              {hoursList.map((hour, i) => {
                const formatHour = new DateObject()
                  .setHour(hour)
                  .format("H:00");
                const isDisabled = notInRange(hour);
                // return (<div key={i} value={hour} disabled={notInRange(hour)}>{formatHour}</div>)
                return (
                  <div
                    key={i}
                    // className={`time-option ${selectedTimes === hour ? 'selected color' : ''}`}
                    className={`time-option ${selectedTimes === hour ? "selected color" : ""
                      } ${isDisabled ? "disabled" : ""}`}
                    onClick={() => {
                      if (!isDisabled) {
                        handleChangeHour(hour);
                      }
                    }}
                  >
                    <div className="padding pointer">{formatHour}</div>
                  </div>
                );
              })}
            </div>
            <div onClick={handleScrollDown}>
              <KeyboardArrowDownOutlinedIcon sx={{ fontWeight: 600 }} />
            </div>
          </div>
        </div>
        {/* /////////////////// */}
        {/* <div onClick={handleScrollUp} ><KeyboardArrowUpOutlinedIcon sx={{ fontWeight: 600 }} /></div>
      <div className="time-picker" ref={scrollableRef} style={{ maxHeight: "200px", overflowY: 'scroll', width: "150px", padding: "10px" }}>
        {timeOptions.map((time) => (
          <div
            key={time}
            className={`time-option ${selectedTimes === time ? 'selected color' : ''}`}
            onClick={() => setSelectedTimes(time)}
          >
            <div className='padding pointer'>{time}</div>
          </div>
        ))}
      </div>
      <div onClick={handleScrollDown}><KeyboardArrowDownOutlinedIcon sx={{ fontWeight: 600 }} /></div> */}
      </div>
    </>
  );
}
