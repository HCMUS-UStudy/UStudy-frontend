"use client";

import Calendar, { CalendarProps } from "react-calendar";
import {
  FaMapMarkerAlt,
  FaStickyNote,
  FaClock,
  FaChalkboardTeacher,
} from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../_common/Card";
import { useState, useEffect } from "react";

interface ScheduleData {
  dates: Record<string, ScheduleRecord>;
}

interface ScheduleRecord {
  subject: string;
  time: string;
  location?: string;
  note?: string;
}

interface TileProps {
  date: Date;
  view: string;
}

export default function ParentSchedule() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [scheduleData, setScheduleData] = useState<ScheduleData>({ dates: {} });

  useEffect(() => {
    const fakeData: ScheduleData = {
      dates: {
        "2025-05-01": {
          subject: "Toán",
          time: "08:00 - 09:30",
          location: "Phòng A1",
          note: "Ôn tập chương 1",
        },
        "2025-05-03": {
          subject: "Văn",
          time: "10:00 - 11:30",
        },
      },
    };
    setScheduleData(fakeData);
  }, []);

  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const getScheduleForSelectedDate = (): ScheduleRecord | undefined => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    return scheduleData.dates[dateStr];
  };

  const getTileClassName = ({ date, view }: TileProps): string => {
    if (view !== "month") return "";
    const dateStr = date.toISOString().split("T")[0];
    if (scheduleData.dates[dateStr]) {
      return "relative";
    }
    return "";
  };

  const renderTileContent = ({ date, view }: TileProps): React.ReactNode => {
    if (view !== "month") return null;
    const dateStr = date.toISOString().split("T")[0];
    if (scheduleData.dates[dateStr]) {
      return (
        <div className="flex justify-center mt-1">
          <span className="bg-blue-500 text-white rounded-full px-1 text-[10px]">
            📚
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
      {/* Calendar Section */}
      <Card className="lg:col-span-2 bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden">
        <CardHeader className="p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-primary-darkest">
              📅 Lịch học
            </CardTitle>
            <CardDescription className="text-gray-600">
              Chọn ngày để xem chi tiết
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            locale="vi"
            className="w-full border-0"
            tileClassName={getTileClassName}
            tileContent={renderTileContent}
          />
        </CardContent>
      </Card>

      {/* Schedule Detail Section */}
      <Card className="bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden">
        <CardHeader className="p-6">
          <CardTitle className="text-2xl font-bold text-primary-darkest">
            📖 Chi tiết lịch học
          </CardTitle>
          <CardDescription className="text-gray-600">
            {selectedDate.toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          {getScheduleForSelectedDate() ? (
            <div className="space-y-5 text-gray-700">
              <div className="flex items-center gap-2">
                <FaChalkboardTeacher className="text-blue-400" />
                <span className="font-medium">Môn học:</span>
                <span>{getScheduleForSelectedDate()?.subject}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-green-400" />
                <span className="font-medium">Thời gian:</span>
                <span>{getScheduleForSelectedDate()?.time}</span>
              </div>
              {getScheduleForSelectedDate()?.location && (
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-400" />
                  <span className="font-medium">Địa điểm:</span>
                  <span>{getScheduleForSelectedDate()?.location}</span>
                </div>
              )}
              {getScheduleForSelectedDate()?.note && (
                <div className="flex items-start gap-2">
                  <FaStickyNote className="text-yellow-400" />
                  <span className="font-medium">Ghi chú:</span>
                  <span>{getScheduleForSelectedDate()?.note}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <p className="text-2xl mb-2">😴</p>
              <p>Không có lịch học cho ngày này</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Global calendar style overrides */}
      <style jsx global>{`
        .react-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
        }

        .react-calendar__navigation {
          margin-bottom: 1rem;
          display: flex;
          justify-content: center; /* Căn giữa các nút */
          gap: 0.5rem;
        }
        .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          font-size: 16px;
          color: #3aa97a;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #f0f0f0;
        }

        .react-calendar__month-view__weekdays {
          display: flex;
          justify-content: center;
          font-weight: 600;
          color: #1f845a;
          margin-bottom: 0.5rem;
        }
        .react-calendar__month-view__weekdays__weekday {
          flex: 1;
          text-align: center;
        }

        /* Giao diện các ngày */
        .react-calendar__tile {
          aspect-ratio: 1/1;
          max-width: 100%;
          padding: 8px 0;
          background: none;
          text-align: center;
          line-height: 16px;
          border-radius: 8px;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #ebf8f4;
        }
        .react-calendar__tile--now {
          background: #bee5d1;
        }
        .react-calendar__tile--now:enabled:hover,
        .react-calendar__tile--now:enabled:focus {
          background: #add7c1;
        }
        .react-calendar__tile--active {
          background: #3aa97a;
          color: white;
        }
        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: #1f845a;
        }
      `}</style>
    </div>
  );
}
