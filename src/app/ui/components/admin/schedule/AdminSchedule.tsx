"use client";

import Calendar, { CalendarProps } from "react-calendar";

import { useState, useEffect } from "react";
import {
  FaChalkboardTeacher,
  FaBook,
  FaUserTie,
  FaSpinner,
  FaRegCalendarAlt,
} from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../_common/Card";

interface AdminScheduleRecord {
  classId: string;
  class: string;
  subject: string;
  grade: string;
  teachers: { id: string; name: string; avatar?: string }[];
  time: string;
}

interface AdminScheduleData {
  dates: Record<string, AdminScheduleRecord[]>;
}

interface TileProps {
  date: Date;
  view: string;
}

export default function AdminSchedule() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [scheduleData, setScheduleData] = useState<AdminScheduleData>({
    dates: {},
  });
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleActiveStartDateChange = (args: any) => {
    if (args.activeStartDate) {
      setActiveStartDate(args.activeStartDate);
    }
  };

  // TODO: Thay thế bằng API thực tế lấy lịch lớp cho admin
  const fetchSchedule = async (month: number, year: number) => {
    setLoading(true);
    try {
      // Mock data
      const mockData: AdminScheduleData = {
        dates: {
          [`${year}-${String(month).padStart(2, "0")}-10`]: [
            {
              classId: "1",
              class: "10A1",
              subject: "Toán",
              grade: "10",
              teachers: [
                { id: "t1", name: "Nguyễn Văn A", avatar: undefined },
                { id: "t2", name: "Trần Thị B", avatar: undefined },
              ],
              time: "07:00 - 09:00",
            },
          ],
          [`${year}-${String(month).padStart(2, "0")}-15`]: [
            {
              classId: "2",
              class: "11B2",
              subject: "Văn",
              grade: "11",
              teachers: [{ id: "t3", name: "Lê Văn C", avatar: undefined }],
              time: "09:30 - 11:00",
            },
            {
              classId: "8",
              class: "10C1",
              subject: "Anh",
              grade: "10",
              teachers: [{ id: "t8", name: "Trịnh Văn H", avatar: undefined }],
              time: "14:45 - 16:15",
            },
          ],
          [`${year}-${String(month).padStart(2, "0")}-20`]: [
            {
              classId: "3",
              class: "12A1",
              subject: "Lý",
              grade: "12",
              teachers: [{ id: "t4", name: "Phạm Văn D", avatar: undefined }],
              time: "07:00 - 08:30",
            },
            {
              classId: "4",
              class: "12A2",
              subject: "Hóa",
              grade: "12",
              teachers: [{ id: "t5", name: "Ngô Thị E", avatar: undefined }],
              time: "08:45 - 10:15",
            },
            {
              classId: "5",
              class: "11A1",
              subject: "Sinh",
              grade: "11",
              teachers: [{ id: "t6", name: "Đỗ Văn F", avatar: undefined }],
              time: "10:30 - 12:00",
            },
            {
              classId: "6",
              class: "10B1",
              subject: "Toán",
              grade: "10",
              teachers: [{ id: "t7", name: "Lý Thị G", avatar: undefined }],
              time: "13:00 - 14:30",
            },
            {
              classId: "7",
              class: "10C1",
              subject: "Anh",
              grade: "10",
              teachers: [{ id: "t8", name: "Trịnh Văn H", avatar: undefined }],
              time: "14:45 - 16:15",
            },
          ],
        },
      };
      setScheduleData(mockData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const month = activeStartDate.getMonth() + 1;
    const year = activeStartDate.getFullYear();
    fetchSchedule(month, year);
  }, [activeStartDate]);

  function formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const getScheduleForSelectedDate = (): AdminScheduleRecord[] => {
    const dateStr = formatDateLocal(selectedDate);
    return scheduleData.dates[dateStr] || [];
  };

  const getTileClassName = ({ date, view }: TileProps): string => {
    if (view !== "month") return "";
    const currentMonth = activeStartDate.getMonth();
    const tileMonth = date.getMonth();
    if (tileMonth !== currentMonth) {
      return "tile-outside-month";
    }
    const dateStr = formatDateLocal(date);
    const records = scheduleData.dates[dateStr];
    if (!records || records.length === 0) return "";
    return "tile-admin-has-class";
  };

  const renderTileContent = ({ date, view }: TileProps): React.ReactNode => {
    if (view !== "month") return null;
    const currentMonth = activeStartDate.getMonth();
    if (date.getMonth() !== currentMonth) {
      return null;
    }
    const dateStr = formatDateLocal(date);
    const records = scheduleData.dates[dateStr] || [];
    if (records.length === 0) return null;
    return (
      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        <span className="relative inline-block">
          {/* Số lượng lớp nếu >= 2 */}
          {records.length > 1 && (
            <span
              className="absolute -top-2 -right-2 bg-red-500 text-white font-semibold text-xs min-w-[18px] h-5 flex items-center justify-center rounded-full shadow-md border-2 border-white z-10"
              style={{ fontSize: 12 }}
            >
              {records.length}
            </span>
          )}
          <span className="text-white bg-gradient-to-r from-blue-500 to-green-400 rounded-full px-2 py-1 text-[18px] shadow-lg border-2 border-white flex items-center justify-center">
            <FaRegCalendarAlt />
          </span>
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 p-2 md:p-6">
      {/* Calendar Section */}
      <Card className="w-full lg:flex-[2] mb-4 lg:mb-0 bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden">
        <CardHeader className="p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-primary-darkest">
              🗓️ Quản lý lịch dạy
            </CardTitle>
            <CardDescription className="text-gray-600">
              Chọn ngày để xem chi tiết
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 overflow-visible relative">
          {/* Overlay loading cho Calendar */}
          <div className="relative">
            <div className={loading ? "pointer-events-none opacity-50" : ""}>
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                onActiveStartDateChange={handleActiveStartDateChange}
                activeStartDate={activeStartDate}
                locale="vi"
                className="w-full border-0"
                tileClassName={getTileClassName}
                tileContent={renderTileContent}
              />
            </div>
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/70 rounded-2xl">
                <FaSpinner className="animate-spin text-5xl mb-2 text-primary" />
                <p className="text-primary">Đang tải lịch lớp...</p>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-700 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-center mt-4">
            <div className="flex items-center gap-1">
              <span className="text-white bg-gradient-to-r from-blue-500 to-green-400 rounded-full px-2 py-1 text-[18px] shadow-lg border-2 border-white flex items-center justify-center">
                <FaRegCalendarAlt />
              </span>
              <span>Có lớp học</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Detail Section */}
      <Card className="w-full lg:flex-[1] bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden overflow-y-auto max-h-[350px] lg:max-h-none">
        <CardHeader className="p-6">
          <CardTitle className="text-2xl font-bold text-primary-darkest">
            📖 Chi tiết lớp học
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg font-medium">
            {selectedDate.toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-primary animate-pulse">
              <FaSpinner className="animate-spin text-5xl mb-2" />
              <p>Đang tải lịch lớp...</p>
            </div>
          ) : getScheduleForSelectedDate().length > 0 ? (
            <div className="space-y-8 text-gray-800 max-h-[600px] overflow-y-auto pr-2">
              {getScheduleForSelectedDate().map((record, index) => (
                <div
                  key={index}
                  className="space-y-4 border-b pb-6 last:border-none bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-5 shadow-md hover:shadow-xl transition-shadow duration-200"
                >
                  {/* Tên lớp */}
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <FaChalkboardTeacher className="text-purple-500" />
                    <span>Lớp học:</span>
                    <span className="text-primary-darkest">{record.class}</span>
                  </div>
                  {/* Môn học */}
                  <div className="flex items-center gap-2">
                    <FaBook className="text-blue-500" />
                    <span className="font-medium">Môn học:</span>
                    <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm font-semibold">
                      {record.subject}
                    </span>
                  </div>
                  {/* Khối */}
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Khối:</span>
                    <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-sm font-semibold">
                      {record.grade}
                    </span>
                  </div>
                  {/* Giáo viên */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <FaUserTie className="text-green-500" />
                    <span className="font-medium whitespace-nowrap">
                      Giáo viên:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {record.teachers.map((t) => (
                        <span
                          key={t.id}
                          className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-sm font-medium shadow-sm"
                        >
                          {/* Avatar nếu có */}
                          <span className="inline-block w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-darkest flex items-center justify-center text-white font-bold">
                            {t.avatar ? (
                              <img
                                src={t.avatar}
                                alt={t.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            ) : (
                              t.name.charAt(0)
                            )}
                          </span>
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Thời gian */}
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Thời gian:</span>
                    <span className="inline-block bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-sm font-semibold">
                      {record.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 flex flex-col items-center">
              <p className="text-2xl mb-2">😴</p>
              <p>Không có lớp học cho ngày này</p>
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
          justify-content: center;
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
        .react-calendar__tile {
          aspect-ratio: 1/1;
          max-width: 100%;
          padding: 8px 0;
          background: none;
          text-align: center;
          line-height: 16px;
          border-radius: 8px;
        }
        .tile-admin-has-class {
          background: linear-gradient(
            135deg,
            #e0f7fa 60%,
            #e6ffe6 100%
          ) !important;
          border-radius: 8px;
          border: 2px solid #3aa97a;
          box-shadow: 0 2px 8px 0 #3aa97a22;
        }
        .tile-outside-month {
          color: #9ca3af;
          opacity: 0.4;
          pointer-events: none;
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
