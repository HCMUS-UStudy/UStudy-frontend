"use client";

import { useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarWidget() {
  const [date, setDate] = useState(new Date());

  const handleDateChange: CalendarProps["onChange"] = (selectedDate) => {
    setDate(selectedDate as Date);
  };

  return (
    <div className="bg-gradient-to-br from-white to-indigo-100 rounded-2xl shadow-xl mb-8">
      <Calendar
        onChange={handleDateChange}
        value={date}
        className="w-full rounded-lg overflow-hidden shadow-md"
        tileClassName={({ date, view }) =>
          `transition-all duration-300 ${
            view === "month" &&
            date.toDateString() === new Date().toDateString()
              ? "bg-indigo-500 text-white font-bold rounded-lg shadow-md"
              : "hover:bg-blue-100 hover:text-blue-700 rounded-md"
          }`
        }
        formatShortWeekday={(locale, date) => {
          const weekdays = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
          return weekdays[date.getDay()];
        }}
        formatMonthYear={(locale, date) => {
          const options: { year: "numeric"; month: "short" } = {
            year: "numeric",
            month: "short",
          };
          return new Intl.DateTimeFormat("en-US", options).format(date);
        }}
        prevLabel={<span className="text-blue-500">←</span>}
        nextLabel={<span className="text-blue-500">→</span>}
      />
    </div>
  );
}
