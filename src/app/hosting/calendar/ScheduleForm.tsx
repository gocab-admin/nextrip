"use client";

import React, { useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TimePickerMui from "@/components/TimePicker";
import styles from "./page.module.scss";
import { updateListingCalendarData } from "@/redux/slice/host/hostlistingCalendar";
import { useAppDispatch } from "@/redux/hooks";
import { useSelector } from "react-redux";

type ScheduleEntry = {
  day: string;
  openingTime: string;
  closingTime: string;
};

type FormValues = {
  schedule: ScheduleEntry[];
};

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const ScheduleForm = ({ value }: any) => {
  const dispatch = useAppDispatch();
  const { calendarData } = useSelector((state: any) => state?.hostCalendarList);

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      schedule: days.map((day) => ({
        day,
        openingTime: "12:00 PM",
        closingTime: "11:00 AM",
      })),
    },
  });

  useEffect(() => {
    reset({ schedule: calendarData?.schedule });
  }, [calendarData]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("✅ Submitted Schedule:", data, value);
    try {
      const res = await dispatch(updateListingCalendarData(value, data));
    } catch (err) {}
  };

  return (
    // <LocalizationProvider dateAdapter={AdapterDayjs}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={`${styles.content}`}>
        <p className={`${styles.head}`}>Availability</p>
      </div>

      {days.map((day, index) => (
        <div key={day} className={`${styles.timepicker}`}>
          <p className={`${styles.day}`}>{day}</p>
          <div className={`${styles.timeField}`}>
            {/* Hidden input for the day */}
            <Controller
              name={`schedule.${index}.day`}
              control={control}
              render={({ field }) => (
                <input type="hidden" {...field} value={day} />
              )}
            />

            {/* Opening Time */}
            <TimePickerMui
              name={`schedule.${index}.openingTime`}
              control={control}
              className="w-[200px]"
              format="hh:mm A"
            />

            {/* Closing Time */}
            <TimePickerMui
              name={`schedule.${index}.closingTime`}
              control={control}
              className="w-[200px]"
              format="hh:mm A"
            />
          </div>
        </div>
      ))}

      <button type="submit" className={`${styles.submit}`}>
        Submit
      </button>
    </form>
    // </LocalizationProvider>
  );
};

export default ScheduleForm;
