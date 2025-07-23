"use client";

import { useState, useEffect, useMemo } from "react";

// primary: "#BEE5D1",
// "primary-light": "#d5e9e1",
// "primary-lighter": "#EBF8F4",
// "hover-primary": "#9dc9b2",
// "primary-dark": "#78AE91",
// "primary-darker": "#4ea677",
// "primary-darkest": "#1F845A",
const calendarPrimaryStyle = `
.react-calendar {
  border: 2px solid #4ea677 !important; /* primary-darker */
  border-radius: 1rem;
  min-height: 400px;
  width: 100%;
  padding: 1.5rem 1rem 0rem 1rem;
  /* tăng padding và chiều cao */
}
.react-calendar__viewContainer {
  min-height: 340px;
}
.react-calendar__tile {
  min-height: 56px;
  padding: 0.5rem 0.25rem;
}
.react-calendar__tile--active,
.react-calendar__tile:enabled:focus {
  background: #BEE5D1 !important; /* primary */
  border-radius: 0.5rem;
  color: #000 !important;
}
.react-calendar__tile--now {
  background: #dbeafe !important; /* primary-100 */
  color: #2563eb !important; /* primary-100 */
  border-radius: 0.5rem;
}
.react-calendar__tile:enabled:hover,
.react-calendar__tile--now:enabled:hover {
  background: #d5e9e1 !important; /* primary-light */
  color: #000 !important;
  border-radius: 0.5rem;
}
.react-calendar__navigation {
  margin-bottom: 0.5rem;
}
.react-calendar__navigation button {
  min-width: 44px;
  min-height: 44px;
  border-radius: 0.5rem;
}
.react-calendar__navigation button:enabled:hover,
.react-calendar__navigation button:enabled:focus {
  background: #d5e9e1 !important; /* primary-light */
  color: #000 !important;
}
.react-calendar__navigation__label {
  color: #1F845A !important; /* primary-darkest */
  font-weight: bold;
  font-size: 16px;
}
.react-calendar__month-view__weekdays__weekday {
  color: #1F845A !important; /* primary-darkest */
  font-size: 14px;
}
.react-calendar__month-view__days__day--weekend {
  color: #000 !important;
}
`;
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getPersonalClassSchedule } from "@/app/lib/services/classSchedule";
import { useQuery } from "@tanstack/react-query";
import { ClassSession } from "@/app/types";

// const classData = [
//   {
//     date: "2025-05-05",
//     classSession: {
//       clazz: { name: "test lớp" },
//       session: { name: "Chiều", startTime: "17:00", endTime: "19:00" },
//       room: { name: "P2" },
//     },
//   },
//   {
//     date: "2025-05-05",
//     classSession: {
//       clazz: { name: "11 Lý" },
//       session: { name: "Chiều", startTime: "19:00", endTime: "21:00" },
//       room: { name: "P5" },
//     },
//   },
//   {
//     date: "2025-05-12",
//     classSession: {
//       clazz: { name: "test lớp" },
//       session: { name: "Chiều", startTime: "17:00", endTime: "19:00" },
//       room: { name: "P2" },
//     },
//   },
//   {
//     date: "2025-05-19",
//     classSession: {
//       clazz: { name: "test lớp" },
//       session: { name: "Chiều", startTime: "17:00", endTime: "19:00" },
//       room: { name: "P2" },
//     },
//   },
//   {
//     date: "2025-05-26",
//     classSession: {
//       clazz: { name: "test lớp" },
//       session: { name: "Chiều", startTime: "17:00", endTime: "19:00" },
//       room: { name: "P2" },
//     },
//   },
//   {
//     date: "2025-05-02",
//     classSession: {
//       clazz: { name: "11S2" },
//       session: { name: "Sáng", startTime: "07:00", endTime: "10:00" },
//       room: { name: "P4" },
//     },
//   },
//   {
//     date: "2025-05-05",
//     classSession: {
//       clazz: { name: "11S2" },
//       session: { name: "Sáng", startTime: "07:00", endTime: "10:00" },
//       room: { name: "P4" },
//     },
//   },
// ];

const SchedulePage = () => {
  const [calendarYearMonth, setCalendarYearMonth] = useState<{
    year: number;
    month: number;
  }>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const classSchedule = useQuery({
    queryKey: [
      "classSchedule",
      calendarYearMonth.year,
      calendarYearMonth.month,
    ],
    queryFn: () =>
      getPersonalClassSchedule(calendarYearMonth.month, calendarYearMonth.year),
  });

  // Nếu là AxiosResponse thì lấy .data.data, nếu không thì []
  const classData = useMemo(
    () =>
      classSchedule.data && Array.isArray(classSchedule.data.data)
        ? classSchedule.data.data
        : [],
    [classSchedule.data],
  );

  // Inject custom calendar style
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = calendarPrimaryStyle;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSessions, setSelectedSessions] = useState<ClassSession[]>([]);

  // Tạo map ngày -> danh sách buổi học
  const dateMap = classData.reduce(
    (acc, item) => {
      acc[item.date] = acc[item.date] || [];
      acc[item.date].push(item);
      return acc;
    },
    {} as Record<string, typeof classData>,
  );

  // Hàm custom tile để highlight ngày có buổi học
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const d = date.toISOString().slice(0, 10);
      if (dateMap[d]) {
        return <div className="w-2 h-2 bg-sky-600 rounded-full mx-auto mt-2" />;
      }
    }
    return null;
  };

  // Khi click vào ngày
  const handleChange = (val: Date) => {
    setSelectedDate(val);
    const d = val.toISOString().slice(0, 10);
    setSelectedSessions(dateMap[d] || []);
  };

  // Khi chuyển tháng/năm trên calendar
  const handleActiveStartDateChange = ({
    activeStartDate,
  }: {
    activeStartDate: Date | null;
  }) => {
    if (!activeStartDate) return;
    setCalendarYearMonth({
      year: activeStartDate.getFullYear(),
      month: activeStartDate.getMonth() + 1,
    });
  };

  return (
    <div className="p-4 flex gap-6">
      <div className="flex items-center justify-center w-3/5 sm:w-2/3">
        <Calendar
          onChange={(val) => handleChange(val as Date)}
          value={selectedDate}
          tileContent={tileContent}
          className="rounded-xl border shadow w-full"
          onActiveStartDateChange={handleActiveStartDateChange}
        />
      </div>
      <div className="flex-1">
        {selectedSessions.length > 0 ? (
          <div className="bg-white rounded-xl border shadow p-4">
            <div className="font-bold text-lg mb-2">Thông tin buổi học</div>
            {selectedSessions.map((session, idx) => (
              <div
                key={idx}
                className="mb-4 border-b last:border-b-0 pb-2 last:pb-0"
              >
                <div>
                  <b>Lớp:</b> {session.clazz.name}
                </div>
                <div>
                  <b>Phòng:</b> {session.room?.name}
                </div>
                <div>
                  <b>Ca:</b> {session.session.name} ({session.session.startTime}{" "}
                  - {session.session.endTime})
                </div>
                <div>
                  <b>Ngày:</b> {selectedDate.toLocaleDateString("vi-VN")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 mt-8">
            Chọn ngày có buổi học để xem chi tiết
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
