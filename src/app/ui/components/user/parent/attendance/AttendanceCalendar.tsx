import Calendar, { CalendarProps } from "react-calendar";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCalendarAlt,
  FaChartPie,
} from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../_common/Card";
import { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import React from "react";

interface AttendanceData {
  dates: Record<string, AttendanceRecord>;
  summary: AttendanceSummary;
  subjects: Record<string, SubjectAttendance>;
}

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

type AttendanceStatus = "present" | "absent" | "late";

interface TileProps {
  date: Date;
  view: string;
}

interface Props {
  mockAttendanceData: AttendanceData;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  selectedMonth?: number;
  selectedYear?: number;
}

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AttendanceCalendar({
  mockAttendanceData,
  setSelectedMonth,
  setSelectedYear,
  selectedMonth,
  selectedYear,
}: Props) {
  const pieChartData = {
    labels: ["Có mặt", "Vắng mặt", "Đi muộn"],
    datasets: [
      {
        data: [
          mockAttendanceData.summary.present,
          mockAttendanceData.summary.absent,
          mockAttendanceData.summary.late,
        ],
        backgroundColor: ["#10B981", "#EF4444", "#F59E0B"],
        borderColor: "#fff",
        borderWidth: 2,
        hoverBackgroundColor: ["#059669", "#DC2626", "#D97706"],
      },
    ],
  };

  // Use controlled date if month/year are provided, otherwise use current date
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    if (selectedMonth && selectedYear) {
      // If selected month/year is current month/year, use today's date
      if (
        selectedMonth === today.getMonth() + 1 &&
        selectedYear === today.getFullYear()
      ) {
        return today;
      }
      // Otherwise use the 1st of the selected month
      return new Date(selectedYear, selectedMonth - 1, 1);
    }
    return today;
  });

  // Update selectedDate when selectedMonth/selectedYear change
  React.useEffect(() => {
    if (selectedMonth && selectedYear) {
      const today = new Date();
      // If selected month/year is current month/year, use today's date
      if (
        selectedMonth === today.getMonth() + 1 &&
        selectedYear === today.getFullYear()
      ) {
        setSelectedDate(today);
      } else {
        // Otherwise use the 1st of the selected month
        setSelectedDate(new Date(selectedYear, selectedMonth - 1, 1));
      }
    }
  }, [selectedMonth, selectedYear]);

  // Xử lý khi chọn ngày trên lịch
  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  function formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Lấy dữ liệu điểm danh của ngày được chọn
  const getAttendanceForSelectedDate = (): AttendanceRecord | undefined => {
    const dateStr = formatDateLocal(selectedDate);
    return mockAttendanceData.dates[dateStr];
  };

  // Tính toán lớp CSS cho ngày trong lịch
  const getTileClassName = ({ date, view }: TileProps): string => {
    if (view !== "month") return "";

    const dateStr = formatDateLocal(date);
    const attendance = mockAttendanceData.dates[dateStr];

    if (!attendance) return "";

    let statusClass = "";
    switch (attendance.status) {
      case "present":
        statusClass = "bg-green-50 border-green-400 shadow-sm";
        break;
      case "absent":
        statusClass = "bg-red-50 border-red-400 shadow-sm";
        break;
      case "late":
        statusClass = "bg-yellow-50 border-yellow-400 shadow-sm";
        break;
      default:
        statusClass = "";
    }

    return `border-2 ${statusClass} hover:scale-105 transition-transform duration-200`;
  };

  // Hàm render nội dung cho các ô ngày trong lịch
  const renderTileContent = ({ date, view }: TileProps): React.ReactNode => {
    if (view !== "month") return null;

    const dateStr = formatDateLocal(date);
    const attendance = mockAttendanceData.dates[dateStr];

    if (!attendance) return null;

    let statusIcon;
    switch (attendance.status) {
      case "present":
        statusIcon = (
          <FaCheckCircle
            className="text-green-600 mx-auto drop-shadow-sm"
            size={14}
          />
        );
        break;
      case "absent":
        statusIcon = (
          <FaTimesCircle
            className="text-red-600 mx-auto drop-shadow-sm"
            size={14}
          />
        );
        break;
      case "late":
        statusIcon = (
          <FaClock
            className="text-yellow-600 mx-auto drop-shadow-sm"
            size={14}
          />
        );
        break;
      default:
        statusIcon = null;
    }

    return <div className="text-xs mt-1">{statusIcon}</div>;
  };

  // Kiểm tra có dữ liệu không
  const hasData = Object.keys(mockAttendanceData.dates).length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Section - Calendar */}
      <Card className="lg:col-span-2 bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-primary-light border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-lighter rounded-lg">
                <FaCalendarAlt className="text-primary-dark text-xl" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-800 font-semibold">
                  Lịch điểm danh
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Chọn ngày để xem chi tiết điểm danh
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="calendar-container">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              locale="vi"
              className="w-full rounded-lg border-0 shadow-sm"
              tileClassName={getTileClassName}
              tileContent={renderTileContent}
              onActiveStartDateChange={({ activeStartDate }) => {
                if (activeStartDate) {
                  const newMonth = activeStartDate.getMonth() + 1;
                  const newYear = activeStartDate.getFullYear();

                  // Only update if the month/year actually changed
                  if (newMonth !== selectedMonth || newYear !== selectedYear) {
                    setSelectedMonth(newMonth);
                    setSelectedYear(newYear);
                  }
                }
              }}
            />
          </div>

          {!hasData && (
            <div className="text-center py-8 mt-4 bg-gray-50 rounded-lg">
              <div className="mb-3">
                <FaCalendarAlt className="text-gray-300 text-4xl mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Không có dữ liệu điểm danh
              </h3>
              <p className="text-gray-500 text-sm">
                Tháng này chưa có dữ liệu điểm danh. Hãy thử chọn tháng khác.
              </p>
            </div>
          )}
        </CardContent>

        {/* Mô tả màu trạng thái */}
        {hasData && (
          <div className="px-6 pb-6">
            <div className="flex justify-center gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 border border-green-200 rounded-full bg-green-50 text-green-700 shadow-sm">
                <FaCheckCircle className="text-green-600" />
                <span className="font-medium">Có mặt</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 border border-red-200 rounded-full bg-red-50 text-red-700 shadow-sm">
                <FaTimesCircle className="text-red-600" />
                <span className="font-medium">Vắng mặt</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 border border-yellow-200 rounded-full bg-yellow-50 text-yellow-700 shadow-sm">
                <FaClock className="text-yellow-600" />
                <span className="font-medium">Đi muộn</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Right Section - Attendance Details & Statistics */}
      <div className="space-y-6 flex flex-col justify-between">
        {/* Card for Attendance Details */}
        <Card className="bg-white border border-gray-200 shadow-lg rounded-xl flex-grow">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaCheckCircle className="text-blue-600 text-lg" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-800 font-semibold">
                  Chi tiết điểm danh
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {selectedDate.toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {getAttendanceForSelectedDate() ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-semibold text-gray-700">
                      Môn học:
                    </span>
                    <span className="text-gray-800 bg-white px-3 py-1 rounded-full text-sm font-medium">
                      {getAttendanceForSelectedDate()?.subject}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-semibold text-gray-700">
                      Thời gian:
                    </span>
                    <span className="text-gray-800 bg-white px-3 py-1 rounded-full text-sm">
                      {getAttendanceForSelectedDate()?.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">
                      Trạng thái:
                    </span>
                    {getAttendanceForSelectedDate()?.status === "present" && (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <FaCheckCircle />
                        <span className="font-medium">Có mặt</span>
                      </div>
                    )}
                    {getAttendanceForSelectedDate()?.status === "absent" && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-full">
                        <FaTimesCircle />
                        <span className="font-medium">Vắng mặt</span>
                      </div>
                    )}
                    {getAttendanceForSelectedDate()?.status === "late" && (
                      <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                        <FaClock />
                        <span className="font-medium">Đi muộn</span>
                      </div>
                    )}
                  </div>
                </div>
                {getAttendanceForSelectedDate()?.reason && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-blue-700">
                        Lý do:
                      </span>
                      <span className="text-blue-800">
                        {getAttendanceForSelectedDate()?.reason}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaCalendarAlt className="text-gray-300 text-4xl mx-auto mb-3" />
                <h3 className="text-gray-600 font-medium mb-2">
                  Không có dữ liệu
                </h3>
                <p className="text-gray-500 text-sm">
                  Chọn ngày khác để xem chi tiết điểm danh
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card for Attendance Statistics (Pie Chart) */}
        <Card className="bg-white border border-gray-200 shadow-lg rounded-xl flex-grow">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaChartPie className="text-purple-600 text-lg" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-800 font-semibold">
                  Thống kê điểm danh
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Tổng quan tình hình điểm danh
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {hasData ? (
              <>
                <div className="flex justify-center items-center h-full">
                  <div className="w-full max-w-[300px] h-[300px] flex items-center justify-center">
                    <Pie
                      data={pieChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: {
                              font: {
                                size: 12,
                                weight: "bold",
                              },
                              color: "#374151",
                              padding: 15,
                              usePointStyle: true,
                            },
                          },
                          tooltip: {
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            titleColor: "#fff",
                            bodyColor: "#fff",
                            borderColor: "#fff",
                            borderWidth: 1,
                            callbacks: {
                              label: (tooltipItem) => {
                                const total =
                                  mockAttendanceData.summary.totalClasses;
                                const value = tooltipItem.raw as number;
                                const percentage =
                                  total > 0
                                    ? Math.round((value / total) * 100)
                                    : 0;
                                return `${tooltipItem.label}: ${value} (${percentage}%)`;
                              },
                            },
                          },
                        },
                        elements: {
                          arc: {
                            borderWidth: 3,
                            borderColor: "#fff",
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <FaChartPie className="text-gray-300 text-4xl mx-auto mb-3" />
                <h3 className="text-gray-600 font-medium mb-2">
                  Không có dữ liệu
                </h3>
                <p className="text-gray-500 text-sm">
                  Chưa có dữ liệu để hiển thị thống kê
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
