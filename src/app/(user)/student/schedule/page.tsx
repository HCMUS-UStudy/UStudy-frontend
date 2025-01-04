"use client";

import React, { useState } from "react";
import studies from "@/app/types/studies";
import { Calendar as BigCalendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/vi"; // Import Vietnamese locale for moment
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
import { vi } from "date-fns/locale"; // Import Vietnamese locale for date-fns

// Set the locale to Vietnamese for moment
moment.locale("vi");
const localizer = momentLocalizer(moment);

const allViews = Object.keys(Views)
  .filter((k) => (k !== "WORK_WEEK"))
  .map((k) => Views[k as keyof typeof Views]);

// Vietnamese translations for React Big Calendar
const messages = {
  today: "Hôm Nay",
  previous: "Trước",
  next: "Tiếp Theo",
  month: "Tháng",
  week: "Tuần",
  day: "Ngày",
  agenda: "Lịch Trình",
  work_week: "Tuần Làm Việc",
  allDay: "Cả Ngày",
  date: "Ngày",
  time: "Thời Gian",
  event: "Sự Kiện",
  noEventsInRange: "Không có sự kiện trong khoảng thời gian này",
  showMore: (total: number) => `+Xem thêm ${total} sự kiện`,
};

export default function CustomCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date()); 

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setCurrentDate(date); 
    }
  };

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 py-10">
      {/* Header */}
      <h1 className="text-5xl font-extrabold text-center mb-12 text-gray-800">
        📅 <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Lịch Học</span>
      </h1>

      {/* Month and Year Selector */}
      <div className="flex items-center justify-between px-5 mb-6">
        <div className="relative z-50 flex items-center space-x-3">
          {/* Label for the DatePicker */}
          <label htmlFor="date-picker" className="text-lg font-semibold text-gray-700">Chọn Tháng và Năm:</label>

          <DatePicker
            id="date-picker"
            selected={currentDate}
            onChange={handleDateChange}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            locale={vi} // Set locale to Vietnamese
            className="p-3 border-2 border-indigo-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg"
          />
        </div>
      </div>

      {/* Calendar Container */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <BigCalendar
          localizer={localizer}
          events={studies}
          step={60}
          views={allViews}
          date={currentDate}
          popup={false}
          onNavigate={handleNavigate} 
          //onShowMore={(events) => handleShowMore(events as Event[])}
          style={{ height: 600, borderRadius: "12px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
          messages={messages} // Pass the messages for Vietnamese translation
        />
      </div>

    </div>
  );
}
