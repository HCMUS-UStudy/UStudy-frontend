"use client";

import Calendar, { CalendarProps } from "react-calendar";

import { useState, useEffect } from "react";
import { FaSpinner, FaRegCalendarAlt } from "react-icons/fa";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../_common/Card";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { getBranchSchedule } from "@/app/lib/services/classSchedule";
import { BranchSchedule } from "@/app/types";
import Image from "next/image";

interface AdminScheduleRecord {
  classId: string;
  class: string;
  subject: string;
  grade: string;
  teachers: { id: string; name: string; avatar?: string }[];
  time: string;
  room: string;
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

  const { selectedBranchId } = useSelector((state: RootState) => state.branch);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleActiveStartDateChange = (args: any) => {
    if (args.activeStartDate) {
      setActiveStartDate(args.activeStartDate);
    }
  };

  useEffect(() => {
    const fetchSchedule = async (month: number, year: number) => {
      if (!selectedBranchId) {
        console.log("No branch selected");
        return;
      }

      setLoading(true);
      try {
        const response = await getBranchSchedule(selectedBranchId, month, year);
        const branchSchedules: BranchSchedule[] = response.data.data;

        console.log("Branch schedule response:", response.data);
        console.log("Branch schedules:", branchSchedules);

        // Transform API data to our format
        const transformedData: AdminScheduleData = {
          dates: {},
        };

        branchSchedules.forEach((schedule) => {
          if (schedule.classSession && schedule.classSession.clazz) {
            const dateStr = schedule.date;
            const classSession = schedule.classSession;
            const clazz = classSession.clazz;

            const record: AdminScheduleRecord = {
              classId: clazz.id || "",
              class: clazz.name || "",
              subject: clazz.course?.name || "",
              grade: clazz.grade?.name || "",
              teachers: Array.isArray(classSession.clazz.teacher)
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  classSession.clazz.teacher.map((teacher: any) => ({
                    id: teacher.id,
                    name: teacher.name,
                    avatar: undefined, // API không trả về avatar
                  }))
                : classSession.clazz.teacher
                  ? [
                      {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        id: (classSession.clazz.teacher as any).id,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        name: (classSession.clazz.teacher as any).name,
                        avatar: undefined,
                      },
                    ]
                  : [],
              time: `${classSession.session?.startTime || ""} - ${classSession.session?.endTime || ""}`,
              room: classSession.room?.name || "Chưa có phòng",
            };

            if (!transformedData.dates[dateStr]) {
              transformedData.dates[dateStr] = [];
            }
            transformedData.dates[dateStr].push(record);
          }
        });

        console.log(transformedData);
        setScheduleData(transformedData);
      } catch (error) {
        console.error("Failed to fetch branch schedule:", error);
        // Fallback to empty data
        setScheduleData({ dates: {} });
      } finally {
        setLoading(false);
      }
    };

    if (selectedBranchId) {
      const month = activeStartDate.getMonth() + 1;
      const year = activeStartDate.getFullYear();
      fetchSchedule(month, year);
    }
  }, [activeStartDate, selectedBranchId]);

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
            <span className="absolute -top-2 -right-2 bg-red-500 text-white font-semibold text-[10px] min-w-[18px] h-5 flex items-center justify-center rounded-full shadow-md z-10">
              {records.length}
            </span>
          )}
          <span className="text-white bg-primary-dark rounded-full px-2 py-1 size-8 shadow-lg flex items-center justify-center">
            <FaRegCalendarAlt />
          </span>
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Calendar Section */}
      <div className="w-full lg:flex-[2] mb-4 lg:mb-0 bg-white overflow-hidden">
        <CardHeader className="p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-primary-darkest">
              Lịch dạy và học
            </CardTitle>
            <div className="hidden lg:block">
              <div className="flex items-center gap-2">
                <CardDescription className="text-gray-600">
                  Chọn ngày để xem chi tiết
                </CardDescription>
              </div>
            </div>
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
              <span className="text-white bg-primary-dark rounded-full px-2 py-1 size-8  flex items-center justify-center">
                <FaRegCalendarAlt />
              </span>
              <span>Có lớp học</span>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Schedule Detail Section */}
      <div className="w-full lg:flex-[1] bg-white  overflow-hidden overflow-y-auto max-h-[350px] lg:max-h-none">
        <CardHeader className="p-6">
          <CardTitle className="text-2xl font-bold text-primary-darkest">
            Chi tiết lớp học
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
          {!selectedBranchId ? (
            <div className="text-center py-10 text-gray-400 flex flex-col items-center">
              <p className="text-2xl mb-2">🏢</p>
              <p>Vui lòng chọn chi nhánh để xem lịch học</p>
            </div>
          ) : loading ? (
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
                  <div className="flex items-center gap-1 text-lg font-semibold">
                    <span>Lớp học:</span>
                    <span className="text-primary-darkest">{record.class}</span>
                  </div>
                  {/* Môn học */}
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Môn học:</span>
                    <span className="inline-block px-2 py-0.5 rounded-full text-sm font-semibold">
                      {record.subject}
                    </span>
                  </div>
                  {/* Khối */}
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Khối:</span>
                    <span className="inline-block px-2 py-0.5 rounded-full text-sm font-semibold">
                      {record.grade}
                    </span>
                  </div>
                  {/* Phòng học */}
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Phòng học:</span>
                    <span className="inline-block px-2 py-0.5 rounded-full text-sm font-semibold">
                      {record.room}
                    </span>
                  </div>
                  {/* Giáo viên */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="font-medium whitespace-nowrap">
                      Giáo viên:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {record.teachers.map((t) => (
                        <span
                          key={t.id}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium shadow-sm"
                        >
                          {/* Avatar nếu có */}
                          <span className=" w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-darkest flex items-center justify-center text-white font-bold">
                            {t.avatar ? (
                              <Image
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
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Thời gian:</span>
                    <span className="inline-block px-2 py-0.5 rounded-full text-sm font-semibold">
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
      </div>

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

        .react-calendar__month-view__days {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }

        .react-calendar__tile {
          aspect-ratio: 1/1;
          max-width: 100%;
          background: white;
          padding: 8px 0;
          text-align: center;
          line-height: 16px;
          border-radius: 8px;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .react-calendar__tile:enabled:hover {
          background-color: #e0f7f1;
        }

        .react-calendar__tile:enabled:focus {
          background-color: #e0f7f1;
          border: 2px solid #0f766e;
          outline: none;
        }

        .tile-admin-has-class {
          background: #f6fdfb !important;
          transition: all 0.2s ease-in-out;
        }

        .tile-admin-has-class:hover {
          background: #5e9172 !important;
          border-color: #22c55e;
          box-shadow: 0 4px 12px 0 #22c55e33;
          transform: translateY(-1px);
        }

        .tile-outside-month {
          color: #9ca3af;
          opacity: 0.4;
          pointer-events: none;
        }

        .react-calendar__tile--now {
          background: #bee5d1;
        }

        .react-calendar__tile--now:enabled:hover,
        .react-calendar__tile--now:enabled:focus {
          background: #add7c1;
        }

        .react-calendar__tile--active {
          background: #4f9c6d !important;
          color: white !important;
          border: 2px solid #16a34a !important;
          box-shadow: 0 4px 12px 0 #22c55e44 !important;
          font-weight: bold;
        }

        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: #5e9172 !important;
          border-color: #15803d !important;
          box-shadow: 0 6px 16px 0 #22c55e55 !important;
        }
      `}</style>
    </div>
  );
}
