import React, { useState } from "react";
import { DatePicker } from "antd";
import moment from "moment";
import dayjs from "dayjs";

export default function Calendar(props) {
  const disabledHours = () => {
    const hours = [];
    for (let i = 0; i < 10; i++) {
      hours.push(i);
    }
    for (let i = 17; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  };

  const disabledMinutes = (selectedHour) => {
    const minutes = [];
    for (let i = 0; i < 60; i++) {
      if (i % 30 !== 0) {
        minutes.push(i);
      }
    }
    return minutes;
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf("day").add(1, "days");
  };

  return (
    <div>
      <DatePicker
        placeholder={props.placeholder}
        showTime={{
          defaultValue: dayjs("00:00", "HH:mm"),
          format: "HH:mm",
        }}
        format="YYYY-MM-DD HH:mm"
        onChange={props.onChange}
        disabled={props.disabled}
        disabledHours={disabledHours}
        disabledMinutes={disabledMinutes}
        disabledDate={disabledDate}
      />
    </div>
  );
}
