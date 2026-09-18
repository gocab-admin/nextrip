import React from "react";
import { Controller, Control } from "react-hook-form";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

interface TimePickerMuiProps {
  control: Control<
    {
      schedule: {
        day: string;
        openingTime: string;
        closingTime: string;
      }[];
    },
    any
  >;
  name: any;
  className?: string;
  format: string;
  defaultValue?: string;
}

const TimePickerMui: React.FC<TimePickerMuiProps> = ({
  control,
  name,
  className,
  format,
  defaultValue,
}) => (
  <Controller
    name={name}
    control={control}
    rules={{ required: true }}
    render={({ field }) => (
      <TimePicker
        {...field}
        value={dayjs(field.value, format)} // convert from string format
        onChange={(data) => {
          field.onChange(data?.format(format)); // change to string format
        }}
        label=""
        className={className}
        format={format}
        //   id="icon_s"
      />
    )}
  />
);

export default TimePickerMui;
