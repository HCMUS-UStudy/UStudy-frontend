"use client";

import Calendar, { CalendarProps } from "react-calendar";
import {
  FaMapMarkerAlt,
  FaStickyNote,
  FaClock,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../_common/Card";
import { useState, useEffect } from "react";
import { FaBook, FaRegClipboard } from "react-icons/fa6";
import { getPersonalClassSchedule } from "@/app/lib/services/classSchedule";
import { ClassSchedule } from "@/app/types";
import { useRouter } from "next/navigation";

interface ScheduleData {
  dates: Record<string, ScheduleRecord[]>;
}

interface ScheduleRecord {
  classId: string;
  class: string;
  subject: string;
  title?: string;
  time: string;
  location?: string;
  note?: string;
  type: "Task" | "Reminder";
  submitted?: boolean;
}

interface TileProps {
  date: Date;
  view: string;
}

export default function StudentSchedule() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [scheduleData, setScheduleData] = useState<ScheduleData>({ dates: {} });
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleActiveStartDateChange = (args: any) => {
    if (args.activeStartDate) {
      setActiveStartDate(args.activeStartDate);
    }
  };

  const router = useRouter();

  const fetchSchedule = async (month: number, year: number) => {
    setLoading(true);
    try {
      const response = await getPersonalClassSchedule(month, year);
      const fetchedClassSchedules = response.data.data;

      const newScheduleData: ScheduleData = { dates: {} };

      fetchedClassSchedules.forEach((item: ClassSchedule) => {
        const dateStr = item.date;

        if (!newScheduleData.dates[dateStr]) {
          newScheduleData.dates[dateStr] = [];
        }

        if (item.classSession) {
          const { clazz, session, room } = item.classSession;

          newScheduleData.dates[dateStr].push({
            classId: clazz.id,
            class: clazz.name,
            subject: `${clazz.course.name} - ${clazz.grade.name}`,
            time: `${session.startTime} - ${session.endTime}`,
            location: room?.name,
            note: clazz.description,
            type: "Reminder",
          });
        }

        if (item.assignment) {
          const { title, endTime, clazz, format, submitted } = item.assignment;

          const time = new Date(endTime).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          });

          const [year, month, day] = item.date.split("-").map(Number);
          const localDate = new Date(year, month - 1, day);
          const formattedDate = localDate.toLocaleDateString("vi-VN");

          let formatLabel = "";
          switch (format.toLocaleLowerCase()) {
            case "mixed":
              formatLabel = "trắc nghiệm & tự luận";
              break;
            case "multiple_choice":
              formatLabel = "trắc nghiệm";
              break;
            case "essay":
              formatLabel = "tự luận";
              break;
            default:
              formatLabel = format;
          }

          newScheduleData.dates[dateStr].push({
            classId: clazz.id,
            class: clazz.name,
            subject: `${clazz.course.name} - ${clazz.grade.name}`,
            title: title,
            time: `${time} - ${formattedDate}`,
            note: `Bài tập ${formatLabel}`,
            type: "Task",
            submitted: submitted === true,
          });
        }
      });

      setScheduleData(newScheduleData);
    } catch (error) {
      console.error("Failed to fetch class schedule", error);
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

  const getScheduleForSelectedDate = (): ScheduleRecord[] => {
    const dateStr = formatDateLocal(selectedDate);
    return scheduleData.dates[dateStr] || [];
  };

  const getTileClassName = ({ date, view }: TileProps): string => {
    if (view !== "month") return "";

    const currentMonth = activeStartDate.getMonth(); // dùng activeStartDate thay vì selectedDate
    const tileMonth = date.getMonth();

    // Nếu ngày không thuộc tháng hiện tại -> làm mờ
    if (tileMonth !== currentMonth) {
      return "tile-outside-month";
    }

    const dateStr = formatDateLocal(date);
    const records = scheduleData.dates[dateStr];

    if (!records || records.length === 0) return "";

    const hasTask = records.some((r) => r.type === "Task");
    const hasReminder = records.some((r) => r.type === "Reminder");

    if (hasTask && hasReminder) return "tile-both";
    if (hasTask) return "tile-task";
    if (hasReminder) return "tile-reminder";

    return "";
  };

  const renderTileContent = ({ date, view }: TileProps): React.ReactNode => {
    if (view !== "month") return null;

    const currentMonth = activeStartDate.getMonth();
    if (date.getMonth() !== currentMonth) {
      return null; // không hiển thị icon, số lượng bài học cho ngày ngoài tháng
    }

    const dateStr = formatDateLocal(date);
    const records = scheduleData.dates[dateStr] || [];

    const taskCount = records.filter((r) => r.type === "Task").length;
    const reminderCount = records.filter((r) => r.type === "Reminder").length;

    if (taskCount === 0 && reminderCount === 0) return null;

    return (
      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        {taskCount > 0 && (
          <div className="relative inline-block">
            {taskCount > 1 && (
              <span
                className="
          absolute -top-2 -right-2 
          bg-blue-600 text-white font-semibold text-[11px] 
          min-w-[14px] h-5 flex items-center justify-center 
          rounded-full shadow-md
          animate-pulse
          select-none
        "
              >
                {taskCount}
              </span>
            )}
            <span
              className="
        text-white bg-blue-500 rounded-full px-2 py-1 
        text-[15px] shadow-lg
      "
            >
              📘
            </span>
          </div>
        )}

        {reminderCount > 0 && (
          <div className="relative inline-block">
            {reminderCount > 1 && (
              <span
                className="
          absolute -top-2 -right-2
          bg-yellow-500 text-white font-semibold text-[11px]
          min-w-[14px] h-5 flex items-center justify-center 
          rounded-full shadow-md
          select-none
        "
              >
                {reminderCount}
              </span>
            )}
            <span
              className="
        text-white bg-yellow-400 rounded-full px-2 py-1 
        text-[15px] shadow-lg
      "
            >
              ⏰
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 p-2 md:p-4">
      {/* Calendar Section */}
      <Card className="w-full lg:flex-[2] mb-4 lg:mb-0 bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden">
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
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <FaSpinner className="animate-spin text-4xl mb-2 text-gray-400" />
                <p className="text-gray-400">Đang tải lịch học...</p>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-600 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-center mt-4">
            <div className="flex items-center gap-1">
              <span className="text-[14px]">📘</span>
              <span>Bài học</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[14px]">⏰</span>
              <span>Nhắc nhở</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Detail Section */}
      <Card className="w-full lg:flex-[1] bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden overflow-y-auto max-h-[350px] lg:max-h-none">
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400 animate-pulse">
              <FaSpinner className="animate-spin text-4xl mb-2" />
              <p>Đang tải lịch học...</p>
            </div>
          ) : getScheduleForSelectedDate().length > 0 ? (
            <div className="space-y-6 text-gray-700">
              {getScheduleForSelectedDate().map((record, index) => (
                <div
                  key={index}
                  className="space-y-4 border-b pb-4 last:border-none"
                >
                  {/* Tên lớp */}
                  {record.class && (
                    <div className="flex items-center gap-2">
                      <FaChalkboardTeacher className="text-purple-400" />
                      <span className="font-medium">Lớp học:</span>
                      <span>{record.class}</span>
                    </div>
                  )}

                  {/* Môn học */}
                  {record.subject && (
                    <div className="flex items-center gap-2">
                      <FaBook className="text-blue-400" />
                      <span className="font-medium">Môn học:</span>
                      <span>{record.subject}</span>
                    </div>
                  )}

                  {/* Tiêu đề bài tập */}
                  {record.title && (
                    <div className="flex items-center gap-2">
                      <FaRegClipboard className="text-indigo-400" />
                      <span className="font-medium">Tiêu đề:</span>
                      <span>{record.title}</span>
                    </div>
                  )}

                  {/* Thời gian */}
                  <div className="flex items-center gap-2">
                    <FaClock className="text-green-400" />
                    <span className="font-medium">
                      {record.type === "Task" ? "Hạn nộp:" : "Thời gian:"}
                    </span>
                    <span>{record.time}</span>
                  </div>

                  {/* Địa điểm */}
                  {record.location && (
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-400" />
                      <span className="font-medium">Địa điểm:</span>
                      <span>{record.location}</span>
                    </div>
                  )}

                  {/* Loại */}
                  {record.note && (
                    <div className="flex items-center gap-2">
                      <FaStickyNote className="text-yellow-400" />
                      <span className="font-medium">Phân loại:</span>
                      <span>{record.note}</span>
                    </div>
                  )}

                  {record.type === "Task" && (
                    <div className="flex items-center gap-2">
                      <FaCheckCircle
                        className={`${
                          record.submitted ? "text-green-500" : "text-gray-400"
                        }`}
                      />
                      <span className="font-medium">Trạng thái:</span>
                      <span>
                        {record.submitted ? "Đã nộp bài" : "Chưa nộp bài"}
                      </span>
                    </div>
                  )}

                  {/* Nút xem chi tiết */}
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        router.push(
                          record.type === "Task"
                            ? `/member/classes/${record.classId}/assignment`
                            : `/member/classes/${record.classId}/participant`,
                        )
                      }
                      className="group inline-flex items-center gap-2 bg-primary-darkest text-white px-4 py-2 rounded-xl hover:bg-primary transition-all duration-200 ease-in-out transform hover:scale-105 shadow-md"
                    >
                      <span className="text-sm font-medium">Xem chi tiết</span>
                      <svg
                        className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
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
        .tile-task {
          background-color: #e6f4ff !important; /* xanh nhạt */
          border-radius: 8px;
        }

        .tile-reminder {
          background-color: #fff7e6 !important; /* vàng nhạt */
          border-radius: 8px;
        }

        .tile-both {
          background-color: #d9c6ff !important; /* ví dụ tím nhạt */
          border-radius: 8px;
        }

        .tile-outside-month {
          color: #9ca3af; /* tương đương text-gray-400 */
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
        .tile-task:enabled:hover {
          background-color: #add7c1 !important;
        }
        .tile-task:enabled:focus {
          background-color: #1f845a !important;
        }

        .tile-reminder:enabled:hover {
          background-color: #add7c1 !important;
        }
        .tile-reminder:enabled:focus {
          background-color: #1f845a !important;
        }

        .tile-both:enabled:hover {
          background-color: #add7c1 !important;
        }
        .tile-both:enabled:focus {
          background-color: #1f845a !important;
        }

        /* Khi ngày được chọn (active) */
        .tile-task.react-calendar__tile--active,
        .tile-reminder.react-calendar__tile--active,
        .tile-both.react-calendar__tile--active {
          background: #3aa97a !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
}
