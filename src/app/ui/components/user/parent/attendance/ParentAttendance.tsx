"use client";

import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { Tab, TabList, TabPanel, Tabs } from "@/app/ui/components/_common/Tabs";
import AttendanceCalendar from "@/app/ui/components/user/parent/attendance/AttendanceCalendar";
import AttendanceList from "@/app/ui/components/user/parent/attendance/AttendanceList";
import AttendanceSummary from "@/app/ui/components/user/parent/attendance/AttendanceSummary";

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

// Giả lập dữ liệu điểm danh
const mockAttendanceData: AttendanceData = {
  // Dữ liệu điểm danh theo ngày
  dates: {
    "2025-04-01": {
      status: "present",
      subject: "Toán học",
      time: "08:00 - 09:30",
    },
    "2025-04-03": {
      status: "absent",
      subject: "Tiếng Anh",
      time: "14:00 - 15:30",
      reason: "Lý do gia đình",
    },
    "2025-04-05": {
      status: "late",
      subject: "Vật lý",
      time: "10:00 - 11:30",
      lateMinutes: 15,
    },
    "2025-04-08": {
      status: "present",
      subject: "Hóa học",
      time: "07:30 - 09:00",
    },
    "2025-04-10": {
      status: "present",
      subject: "Sinh học",
      time: "15:30 - 17:00",
    },
    "2025-04-12": {
      status: "absent",
      subject: "Ngữ Văn",
      time: "09:30 - 11:00",
      reason: "Ốm",
    },
    "2025-04-15": {
      status: "late",
      subject: "Tiếng Anh",
      time: "13:30 - 15:00",
      lateMinutes: 10,
    },
    "2025-04-17": {
      status: "present",
      subject: "Toán học",
      time: "08:00 - 09:30",
    },
    "2025-04-20": {
      status: "present",
      subject: "Vật lý",
      time: "10:00 - 11:30",
    },
    "2025-04-22": {
      status: "late",
      subject: "Hóa học",
      time: "07:30 - 09:00",
      lateMinutes: 5,
    },
    "2025-04-25": {
      status: "present",
      subject: "Sinh học",
      time: "15:30 - 17:00",
    },
  },

  // Thống kê tổng quan
  summary: {
    totalClasses: 20,
    present: 14,
    absent: 3,
    late: 3,
    presentPercentage: 70,
    absentPercentage: 15,
    latePercentage: 15,
  },

  // Dữ liệu theo môn học
  subjects: {
    "Toán học": { present: 5, absent: 0, late: 1, total: 6 },
    "Tiếng Anh": { present: 2, absent: 1, late: 1, total: 4 },
    "Vật lý": { present: 3, absent: 0, late: 1, total: 4 },
    "Hóa học": { present: 2, absent: 0, late: 1, total: 3 },
    "Sinh học": { present: 2, absent: 0, late: 0, total: 2 },
    "Ngữ Văn": { present: 0, absent: 1, late: 0, total: 1 },
  },
};

export default function ParentAttendance() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth(),
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );

  return (
    <div className="px-2">
      <Tabs value={activeTab} onTabChange={setActiveTab} className="mb-6">
        <TabList className="mb-4">
          <Tab label="Lịch điểm danh" value="calendar" />
          <Tab label="Danh sách điểm danh" value="list" />
          <Tab label="Nhận xét & Thống kê" value="summary" />
        </TabList>

        <TabPanel value="calendar">
          <AttendanceCalendar
            mockAttendanceData={mockAttendanceData}
            setSelectedMonth={setSelectedMonth}
            setSelectedYear={setSelectedYear}
          />
        </TabPanel>

        <TabPanel value="list">
          <AttendanceList
            mockAttendanceData={mockAttendanceData}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            setSelectedMonth={function (): void {
              throw new Error("Function not implemented.");
            }}
            setSelectedYear={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        </TabPanel>

        <TabPanel value="summary">
          <AttendanceSummary
            mockAttendanceData={mockAttendanceData}
            selectedYear={selectedYear}
            selectedMonth={0}
            setSelectedMonth={function (): void {
              throw new Error("Function not implemented.");
            }}
            setSelectedYear={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        </TabPanel>
      </Tabs>

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
