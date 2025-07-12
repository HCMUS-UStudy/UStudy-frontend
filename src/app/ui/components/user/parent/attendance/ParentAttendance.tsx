"use client";

import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { Tab, TabList, TabPanel, Tabs } from "@/app/ui/components/_common/Tabs";
import { Select, SelectItem } from "@/app/ui/components/_common/Select";
import AttendanceCalendar from "@/app/ui/components/user/parent/attendance/AttendanceCalendar";
import AttendanceList from "@/app/ui/components/user/parent/attendance/AttendanceList";
import AttendanceSummary from "@/app/ui/components/user/parent/attendance/AttendanceSummary";
import { getListUserClass } from "@/app/lib/services/class";
import { getAttendanceListByStudent } from "@/app/lib/services/attendance";
import { ClassUserItem, AttendanceListByStudentResponse } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/app/store/store";
import {
  FaGraduationCap,
  FaCalendarAlt,
  FaSpinner,
  FaUsers,
  FaBook,
  FaStar,
} from "react-icons/fa";

// Định nghĩa types
type AttendanceStatus = "present" | "absent" | "late";

interface AttendanceRecord {
  status: AttendanceStatus;
  subject: string;
  time: string;
  reason?: string;
  lateMinutes?: number;
}

interface AttendanceSummary {
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  presentPercentage: number;
  absentPercentage: number;
  latePercentage: number;
}

interface SubjectAttendance {
  present: number;
  absent: number;
  late: number;
  total: number;
}

interface AttendanceData {
  dates: Record<string, AttendanceRecord>;
  summary: AttendanceSummary;
  subjects: Record<string, SubjectAttendance>;
}

export default function ParentAttendance() {
  const selectedChild = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.children.selectedChild,
  );
  const [activeTab, setActiveTab] = useState("calendar");
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    currentDate.getMonth() + 1, // getMonth() returns 0-11, so add 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    currentDate.getFullYear(),
  );
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  // Fetch student classes for selected child
  const { data: classes, isLoading: isLoadingClasses } = useQuery({
    queryKey: ["studentClasses", selectedChild?.id],
    queryFn: () => getListUserClass(selectedChild?.id || "", "", 0, 100),
    enabled: !!selectedChild?.id,
  });

  // Fetch attendance data when class is selected
  const { data: attendanceData, isLoading: isLoadingAttendance } = useQuery({
    queryKey: [
      "attendanceByStudent",
      selectedClassId,
      selectedMonth,
      selectedYear,
      selectedChild?.id,
    ],
    queryFn: () =>
      getAttendanceListByStudent({
        classId: selectedClassId,
        month: selectedMonth,
        year: selectedYear,
        studentId: selectedChild?.id,
      }),
    enabled: !!selectedClassId && !!selectedChild?.id,
  });

  // Convert API data to component format
  const convertAttendanceData = (
    apiData: AttendanceListByStudentResponse,
  ): AttendanceData => {
    const dates: Record<string, AttendanceRecord> = {};
    const subjects: Record<string, SubjectAttendance> = {};
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;

    apiData.data.forEach((record) => {
      // Convert date format from API to YYYY-MM-DD format
      const dateObj = new Date(record.date);
      const date = dateObj.toISOString().split("T")[0]; // Format: YYYY-MM-DD

      const status = record.status.toLowerCase() as AttendanceStatus;
      const subject = record.classSession.session.name;
      const time = `${record.classSession.session.startTime} - ${record.classSession.session.endTime}`;

      // Add to dates
      dates[date] = {
        status,
        subject,
        time,
        reason: record.note,
      };

      // Count by status
      if (status === "present") totalPresent++;
      else if (status === "absent") totalAbsent++;
      else if (status === "late") totalLate++;

      // Count by subject
      if (!subjects[subject]) {
        subjects[subject] = { present: 0, absent: 0, late: 0, total: 0 };
      }
      subjects[subject][status]++;
      subjects[subject].total++;
    });

    const totalClasses = totalPresent + totalAbsent + totalLate;

    return {
      dates,
      summary: {
        totalClasses,
        present: totalPresent,
        absent: totalAbsent,
        late: totalLate,
        presentPercentage:
          totalClasses > 0
            ? Math.round((totalPresent / totalClasses) * 100)
            : 0,
        absentPercentage:
          totalClasses > 0 ? Math.round((totalAbsent / totalClasses) * 100) : 0,
        latePercentage:
          totalClasses > 0 ? Math.round((totalLate / totalClasses) * 100) : 0,
      },
      subjects,
    };
  };

  const convertedAttendanceData = attendanceData
    ? convertAttendanceData(attendanceData)
    : {
        dates: {},
        summary: {
          totalClasses: 0,
          present: 0,
          absent: 0,
          late: 0,
          presentPercentage: 0,
          absentPercentage: 0,
          latePercentage: 0,
        },
        subjects: {},
      };

  const handleClassChange = (value: string | number) => {
    setSelectedClassId(value.toString());
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  // Show loading state if no child is selected
  if (!selectedChild?.id) {
    return (
      <div className="px-2">
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="mb-4">
            <FaGraduationCap className="text-gray-300 text-6xl mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Chưa chọn học sinh
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Vui lòng chọn học sinh từ danh sách để xem thông tin điểm danh
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2">
      {/* Class Selection Header */}
      <div className="mb-6">
        <div className="bg-primary-lighter rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-light rounded-lg">
              <FaGraduationCap className="text-primary-dark text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                Trang điểm danh
              </h2>
              <p className="text-gray-600 text-sm">
                Theo dõi tình hình điểm danh của {selectedChild.name}
              </p>
            </div>
          </div>

          {/* Compact Class Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Class Selection Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaGraduationCap className="text-primary-darker" />
                Chọn lớp học
              </label>

              <Select
                defaultValue={selectedClassId}
                defaultLabel="Chọn lớp để xem điểm danh"
                onValueChange={handleClassChange}
                className="w-full bg-white"
              >
                {isLoadingClasses ? (
                  <SelectItem value="">
                    <div className="flex items-center gap-2 p-2">
                      <FaSpinner className="animate-spin text-primary-dark" />
                      <span className="text-sm">Đang tải danh sách lớp...</span>
                    </div>
                  </SelectItem>
                ) : classes?.content && classes.content.length > 0 ? (
                  classes.content.map((classItem: ClassUserItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      <div className="flex items-center gap-3 p-2 rounded-lg transition-colors">
                        <div className="p-2 bg-primary-light rounded-lg">
                          <FaUsers className="text-highlight-text" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-800">
                              {classItem.name}
                            </span>
                            <span className="px-2 py-0.5 bg-primary-light text-primary-darker text-xs font-medium rounded-full">
                              Đang học
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <FaBook className="text-primary-darker" />
                              {classItem.course.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaStar className="text-yellow-500" />
                              {classItem.grade.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="">
                    <div className="flex items-center gap-2 p-2 text-gray-500">
                      <FaGraduationCap />
                      <span className="text-sm">Không có lớp nào</span>
                    </div>
                  </SelectItem>
                )}
              </Select>
            </div>

            {/* Compact Current Selection Info */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaCalendarAlt className="text-primary-darker" />
                Thông tin hiện tại
              </label>

              <div className="bg-white border border-gray-200 rounded-lg p-3">
                {selectedClassId ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Học sinh:</span>
                      <span className="font-medium text-gray-800">
                        {selectedChild.name}
                      </span>
                    </div>

                    {/* <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Lớp:</span>
                      <span className="font-medium text-gray-800">
                        {classes?.content?.find((c: ClassUserItem) => c.id === selectedClassId)
                          ?.name || "Đang tải..."}
                      </span>
                    </div> */}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Thời gian:</span>
                      <span className="font-medium text-gray-800">
                        {isLoadingAttendance ? (
                          <div className="flex items-center gap-1">
                            <FaSpinner className="animate-spin text-primary-darker text-xs" />
                            <span>Đang tải...</span>
                          </div>
                        ) : (
                          `Tháng ${selectedMonth}/${selectedYear}`
                        )}
                      </span>
                    </div>

                    {!isLoadingAttendance && attendanceData && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Số buổi:</span>
                        <span className="font-medium text-primary-darker">
                          {attendanceData.data.length} buổi
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <FaGraduationCap className="text-gray-300 text-xl mx-auto mb-1" />
                    <p className="text-xs text-gray-500">
                      Vui lòng chọn lớp để xem điểm danh
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedClassId ? (
        <Tabs value={activeTab} onTabChange={setActiveTab} className="mb-6">
          <TabList className="mb-4">
            <Tab label="Lịch điểm danh" value="calendar" />
            <Tab label="Danh sách điểm danh" value="list" />
            <Tab label="Nhận xét & Thống kê" value="summary" />
          </TabList>

          <TabPanel value="calendar">
            <AttendanceCalendar
              mockAttendanceData={convertedAttendanceData}
              setSelectedMonth={handleMonthChange}
              setSelectedYear={handleYearChange}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          </TabPanel>

          <TabPanel value="list">
            <AttendanceList
              mockAttendanceData={convertedAttendanceData}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setSelectedMonth={handleMonthChange}
              setSelectedYear={handleYearChange}
            />
          </TabPanel>

          <TabPanel value="summary">
            <AttendanceSummary
              mockAttendanceData={convertedAttendanceData}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              setSelectedMonth={handleMonthChange}
              setSelectedYear={handleYearChange}
            />
          </TabPanel>
        </Tabs>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="mb-4">
            <FaGraduationCap className="text-gray-300 text-6xl mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Chưa chọn lớp học
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Vui lòng chọn lớp học từ danh sách bên trên để xem thông tin điểm
            danh chi tiết
          </p>
        </div>
      )}

      <style jsx global>{`
        .react-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
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
        .react-calendar__month-view__weekdays {
          font-weight: 600;
          color: #1f845a;
        }
        .react-calendar__navigation {
          margin-bottom: 1rem;
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
