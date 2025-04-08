"use client";

import { useState, useEffect } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarWidget() {
  const [date, setDate] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  // Đảm bảo chỉ render đầy đủ ở phía client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDateChange: CalendarProps["onChange"] = (selectedDate) => {
    setDate(selectedDate as Date);
    console.log("Selected Date:", selectedDate);
  };

  // Hàm formatShortWeekday được đảm bảo nhất quán
  const formatShortWeekday = (locale: string | undefined, date: Date) => {
    const weekdays = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
    return weekdays[date.getDay()];
  };

  // Hàm formatMonthYear được đảm bảo nhất quán
  const formatMonthYear = (locale: string | undefined, date: Date) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Hàm formatDay nhất quán
  const formatDay = (locale: string | undefined, date: Date) => {
    return date.getDate().toString();
  };

  // Hàm tạo aria-label nhất quán
  const formatLongDate = (locale: string | undefined, date: Date) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Hiển thị skeleton khi ở server-side hoặc chưa hydrate
  if (!isClient) {
    return (
      <div className="bg-gradient-to-br from-white to-indigo-100 rounded-2xl shadow-xl mb-8 h-[328px]">
        <div className="animate-pulse h-full"></div>
      </div>
    );
  }

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
        formatShortWeekday={formatShortWeekday}
        formatMonthYear={formatMonthYear}
        formatDay={formatDay}
        formatLongDate={formatLongDate}
        locale="en-US"
        prevLabel={<span className="text-blue-500">←</span>}
        nextLabel={<span className="text-blue-500">→</span>}
      />
    </div>
  );
}
