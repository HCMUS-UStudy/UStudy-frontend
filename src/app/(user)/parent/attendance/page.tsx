"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/ui/components/_common/Card";
import { Button } from "@/app/ui/components/_common/Button";
import { Select, SelectItem } from "@/app/ui/components/_common/Select";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { Tabs, TabList, Tab, TabPanel } from "@/app/ui/components/_common/Tabs";

// Định nghĩa types
type AttendanceStatus = 'present' | 'absent' | 'late';

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

interface TileProps {
  date: Date;
  view: string;
}

interface Student {
  id: number;
  name: string;
}

// Giả lập dữ liệu điểm danh
const mockAttendanceData: AttendanceData = {
  // Dữ liệu điểm danh theo ngày
  dates: {
    "2024-11-01": { status: "present", subject: "Toán học", time: "08:00 - 09:30" },
    "2024-11-03": { status: "absent", subject: "Tiếng Anh", time: "14:00 - 15:30", reason: "Lý do gia đình" },
    "2024-11-05": { status: "late", subject: "Vật lý", time: "10:00 - 11:30", lateMinutes: 15 },
    "2024-11-08": { status: "present", subject: "Hóa học", time: "07:30 - 09:00" },
    "2024-11-10": { status: "present", subject: "Sinh học", time: "15:30 - 17:00" },
    "2024-11-12": { status: "absent", subject: "Ngữ Văn", time: "09:30 - 11:00", reason: "Ốm" },
    "2024-11-15": { status: "late", subject: "Tiếng Anh", time: "13:30 - 15:00", lateMinutes: 10 },
    "2024-11-17": { status: "present", subject: "Toán học", time: "08:00 - 09:30" },
    "2024-11-20": { status: "present", subject: "Vật lý", time: "10:00 - 11:30" },
    "2024-11-22": { status: "late", subject: "Hóa học", time: "07:30 - 09:00", lateMinutes: 5 },
    "2024-11-25": { status: "present", subject: "Sinh học", time: "15:30 - 17:00" },
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
  }
};

const mockStudentList: Student[] = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Nguyễn Thị B" },
  { id: 3, name: "Trần Văn C" },
];

export default function ParentAttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedView, setSelectedView] = useState<"calendar" | "list" | "summary">("calendar");
  const [selectedChild, setSelectedChild] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  // Xử lý khi chọn ngày trên lịch
  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  // Lấy dữ liệu điểm danh của ngày được chọn
  const getAttendanceForSelectedDate = (): AttendanceRecord | undefined => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return mockAttendanceData.dates[dateStr];
  };

  // Tính toán lớp CSS cho ngày trong lịch
  const getTileClassName = ({ date, view }: TileProps): string => {
    if (view !== 'month') return '';
    
    const dateStr = date.toISOString().split('T')[0];
    const attendance = mockAttendanceData.dates[dateStr];
    
    if (!attendance) return '';
    
    let statusClass = '';
    switch (attendance.status) {
      case 'present':
        statusClass = 'bg-green-100 border-green-500';
        break;
      case 'absent':
        statusClass = 'bg-red-100 border-red-500';
        break;
      case 'late':
        statusClass = 'bg-yellow-100 border-yellow-500';
        break;
      default:
        statusClass = '';
    }
    
    return `border-2 ${statusClass}`;
  };

  // Hàm render nội dung cho các ô ngày trong lịch
  const renderTileContent = ({ date, view }: TileProps): React.ReactNode => {
    if (view !== 'month') return null;
    
    const dateStr = date.toISOString().split('T')[0];
    const attendance = mockAttendanceData.dates[dateStr];
    
    if (!attendance) return null;
    
    let statusIcon;
    switch (attendance.status) {
      case 'present':
        statusIcon = <FaCheckCircle className="text-green-500 mx-auto" size={12} />;
        break;
      case 'absent':
        statusIcon = <FaTimesCircle className="text-red-500 mx-auto" size={12} />;
        break;
      case 'late':
        statusIcon = <FaClock className="text-yellow-500 mx-auto" size={12} />;
        break;
      default:
        statusIcon = null;
    }
    
    return (
      <div className="text-xs mt-1">
        {statusIcon}
      </div>
    );
  };

  // Lọc dữ liệu điểm danh theo tháng hiện tại
  const getCurrentMonthData = () => {
    const filteredDates = Object.entries(mockAttendanceData.dates).filter(([dateStr]) => {
      const date = new Date(dateStr);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });
    
    return filteredDates.map(([dateStr, data]) => ({
      date: new Date(dateStr),
      ...data
    })).sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-darkest mb-2">Điểm danh của học sinh</h1>
        <p className="text-gray-600">Theo dõi tình hình điểm danh của con bạn tại trường</p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-64">
          <div className="border border-control-border rounded-md">
            <select 
              value={selectedChild} 
              onChange={(e) => setSelectedChild(parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-control-ring outline-none"
            >
              {mockStudentList.map(child => (
                <option key={child.id} value={child.id}>{child.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button
            variant={selectedView === "calendar" ? "primary" : "outlined"}
            onClick={() => setSelectedView("calendar")}
            className={selectedView === "calendar" ? "bg-primary-darkest text-white" : "border-primary-dark text-primary-dark"}
          >
            Lịch
          </Button>
          <Button
            variant={selectedView === "list" ? "primary" : "outlined"}
            onClick={() => setSelectedView("list")}
            className={selectedView === "list" ? "bg-primary-darkest text-white" : "border-primary-dark text-primary-dark"}
          >
            Danh sách
          </Button>
          <Button
            variant={selectedView === "summary" ? "primary" : "outlined"}
            onClick={() => setSelectedView("summary")}
            className={selectedView === "summary" ? "bg-primary-darkest text-white" : "border-primary-dark text-primary-dark"}
          >
            Thống kê
          </Button>
        </div>
      </div>

      {selectedView === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white border border-primary-light shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-primary-darkest">Lịch điểm danh</CardTitle>
              <CardDescription className="text-primary-dark">
                Chọn ngày để xem chi tiết điểm danh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="calendar-container">
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  className="w-full rounded-lg border-0"
                  tileClassName={getTileClassName}
                  tileContent={renderTileContent}
                  onActiveStartDateChange={({ activeStartDate }) => {
                    if (activeStartDate) {
                      setSelectedMonth(activeStartDate.getMonth());
                      setSelectedYear(activeStartDate.getFullYear());
                    }
                  }}
                />
                <div className="flex justify-center mt-4 gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span>Có mặt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span>Vắng mặt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span>Đi muộn</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-primary-light shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-primary-darkest">
                Chi tiết điểm danh
              </CardTitle>
              <CardDescription className="text-primary-dark">
                {selectedDate.toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getAttendanceForSelectedDate() ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Môn học:</span>
                    <span>{getAttendanceForSelectedDate()?.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Thời gian:</span>
                    <span>{getAttendanceForSelectedDate()?.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Trạng thái:</span>
                    {getAttendanceForSelectedDate()?.status === 'present' && (
                      <div className="flex items-center gap-1 text-green-600">
                        <FaCheckCircle />
                        <span>Có mặt</span>
                      </div>
                    )}
                    {getAttendanceForSelectedDate()?.status === 'absent' && (
                      <div className="flex items-center gap-1 text-red-600">
                        <FaTimesCircle />
                        <span>Vắng mặt</span>
                      </div>
                    )}
                    {getAttendanceForSelectedDate()?.status === 'late' && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <FaClock />
                        <span>Đi muộn {getAttendanceForSelectedDate()?.lateMinutes} phút</span>
                      </div>
                    )}
                  </div>
                  {getAttendanceForSelectedDate()?.reason && (
                    <div className="flex items-start gap-2">
                      <span className="font-semibold">Lý do:</span>
                      <span>{getAttendanceForSelectedDate()?.reason}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  Không có dữ liệu điểm danh cho ngày này
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {selectedView === "list" && (
        <Card className="bg-white border border-primary-light shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-primary-darkest">Danh sách điểm danh</CardTitle>
            <CardDescription className="text-primary-dark">
              Tháng {selectedMonth + 1}/{selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {getCurrentMonthData().length > 0 ? (
              <div className="space-y-3">
                {getCurrentMonthData().map((item, index) => (
                  <div 
                    key={index} 
                    className="border border-primary-light rounded-lg p-4 hover:bg-primary-lighter transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-semibold">
                        {item.date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })}
                      </div>
                      {item.status === 'present' && (
                        <div className="flex items-center gap-1 text-green-600">
                          <FaCheckCircle />
                          <span>Có mặt</span>
                        </div>
                      )}
                      {item.status === 'absent' && (
                        <div className="flex items-center gap-1 text-red-600">
                          <FaTimesCircle />
                          <span>Vắng mặt</span>
                        </div>
                      )}
                      {item.status === 'late' && (
                        <div className="flex items-center gap-1 text-yellow-600">
                          <FaClock />
                          <span>Đi muộn {item.lateMinutes} phút</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Môn học: {item.subject}</span>
                        <span>Thời gian: {item.time}</span>
                      </div>
                      {item.reason && (
                        <div className="mt-1">
                          <span>Lý do: {item.reason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                Không có dữ liệu điểm danh trong tháng này
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedView === "summary" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white border border-primary-light shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-primary-darkest">Thống kê điểm danh</CardTitle>
              <CardDescription className="text-primary-dark">
                Tỷ lệ điểm danh năm học {selectedYear - 1}-{selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">{mockAttendanceData.summary.presentPercentage}%</div>
                  <div className="text-green-800 text-center">Có mặt</div>
                  <div className="text-green-600 text-center mt-1">{mockAttendanceData.summary.present}/{mockAttendanceData.summary.totalClasses} buổi</div>
                </div>
                <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-3xl font-bold text-red-600 mb-2">{mockAttendanceData.summary.absentPercentage}%</div>
                  <div className="text-red-800 text-center">Vắng mặt</div>
                  <div className="text-red-600 text-center mt-1">{mockAttendanceData.summary.absent}/{mockAttendanceData.summary.totalClasses} buổi</div>
                </div>
                <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">{mockAttendanceData.summary.latePercentage}%</div>
                  <div className="text-yellow-800 text-center">Đi muộn</div>
                  <div className="text-yellow-600 text-center mt-1">{mockAttendanceData.summary.late}/{mockAttendanceData.summary.totalClasses} buổi</div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                <div className="flex h-4 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-4 transition-all duration-300"
                    style={{ width: `${mockAttendanceData.summary.presentPercentage}%` }}
                  ></div>
                  <div
                    className="bg-yellow-500 h-4 transition-all duration-300"
                    style={{ width: `${mockAttendanceData.summary.latePercentage}%` }}
                  ></div>
                  <div
                    className="bg-red-500 h-4 transition-all duration-300"
                    style={{ width: `${mockAttendanceData.summary.absentPercentage}%` }}
                  ></div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-primary-darkest mb-4">Theo môn học</h3>
              <div className="space-y-4">
                {Object.entries(mockAttendanceData.subjects).map(([subject, data]) => (
                  <div key={subject} className="border border-primary-light rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold">{subject}</div>
                      <div className="text-sm text-gray-600">
                        {data.total} buổi học
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="flex h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-green-500 h-2.5"
                          style={{ width: `${(data.present / data.total) * 100}%` }}
                        ></div>
                        <div
                          className="bg-yellow-500 h-2.5"
                          style={{ width: `${(data.late / data.total) * 100}%` }}
                        ></div>
                        <div
                          className="bg-red-500 h-2.5"
                          style={{ width: `${(data.absent / data.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs mt-2">
                      <span className="text-green-600">Có mặt: {data.present}</span>
                      <span className="text-yellow-600">Đi muộn: {data.late}</span>
                      <span className="text-red-600">Vắng mặt: {data.absent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-primary-light shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-primary-darkest">Tư vấn & Nhận xét</CardTitle>
              <CardDescription className="text-primary-dark">
                Đánh giá từ giáo viên
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-primary-lighter rounded-lg border border-primary-light">
                  <p className="text-sm text-gray-700 italic">
                    "Học sinh có tần suất tham gia lớp học tốt, tuy nhiên cần cải thiện việc đi học đúng giờ ở môn Tiếng Anh và Hóa học."
                  </p>
                  <div className="mt-3 text-xs text-right text-gray-500">
                    - Giáo viên chủ nhiệm, 15/11/2024
                  </div>
                </div>
                
                <h3 className="font-semibold text-primary-darkest mt-4">Gợi ý cải thiện</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">•</span>
                    <span>Cần chú ý đến việc đi học đúng giờ, đặc biệt là các buổi học sáng sớm.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">•</span>
                    <span>Nên thông báo trước với giáo viên khi có việc đột xuất không thể tham gia lớp học.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">•</span>
                    <span>Chuẩn bị sẵn sàng đồ dùng học tập từ tối hôm trước để tránh quên và đi trễ.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
          color: #1F845A;
        }
        .react-calendar__navigation {
          margin-bottom: 1rem;
        }
        .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          font-size: 16px;
          color: #3AA97A;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #f0f0f0;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #EBF8F4;
        }
        .react-calendar__tile--now {
          background: #BEE5D1;
        }
        .react-calendar__tile--now:enabled:hover,
        .react-calendar__tile--now:enabled:focus {
          background: #ADD7C1;
        }
        .react-calendar__tile--active {
          background: #3AA97A;
          color: white;
        }
        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: #1F845A;
        }
      `}</style>
    </div>
  );
} 