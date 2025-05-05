import Calendar, { CalendarProps } from "react-calendar";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
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
}

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AttendanceCalendar({
  mockAttendanceData,
  setSelectedMonth,
  setSelectedYear,
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
        backgroundColor: ["#34D399", "#F87171", "#FBBF24"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Xử lý khi chọn ngày trên lịch
  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  // Lấy dữ liệu điểm danh của ngày được chọn
  const getAttendanceForSelectedDate = (): AttendanceRecord | undefined => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    return mockAttendanceData.dates[dateStr];
  };

  // Tính toán lớp CSS cho ngày trong lịch
  const getTileClassName = ({ date, view }: TileProps): string => {
    if (view !== "month") return "";

    const dateStr = date.toISOString().split("T")[0];
    const attendance = mockAttendanceData.dates[dateStr];

    if (!attendance) return "";

    let statusClass = "";
    switch (attendance.status) {
      case "present":
        statusClass = "bg-green-100 border-green-500";
        break;
      case "absent":
        statusClass = "bg-red-100 border-red-500";
        break;
      case "late":
        statusClass = "bg-yellow-100 border-yellow-500";
        break;
      default:
        statusClass = "";
    }

    return `border-2 ${statusClass}`;
  };

  // Hàm render nội dung cho các ô ngày trong lịch
  const renderTileContent = ({ date, view }: TileProps): React.ReactNode => {
    if (view !== "month") return null;

    const dateStr = date.toISOString().split("T")[0];
    const attendance = mockAttendanceData.dates[dateStr];

    if (!attendance) return null;

    let statusIcon;
    switch (attendance.status) {
      case "present":
        statusIcon = (
          <FaCheckCircle className="text-green-500 mx-auto" size={12} />
        );
        break;
      case "absent":
        statusIcon = (
          <FaTimesCircle className="text-red-500 mx-auto" size={12} />
        );
        break;
      case "late":
        statusIcon = <FaClock className="text-yellow-500 mx-auto" size={12} />;
        break;
      default:
        statusIcon = null;
    }

    return <div className="text-xs mt-1">{statusIcon}</div>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Section - Calendar */}
      <Card className="lg:col-span-2 bg-white border border-primary-light shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-primary-darkest">
              Lịch điểm danh
            </CardTitle>
            <CardDescription className="text-primary-dark">
              Chọn ngày để xem chi tiết
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="calendar-container">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              locale="vi"
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
          </div>
        </CardContent>

        {/* Mô tả màu trạng thái */}
        <div className="mt-4 mb-4 pt-4 border-t border-gray-200">
          <div className="flex justify-center gap-3 text-sm flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1 border border-green-200 rounded-full bg-green-50 text-green-700">
              <FaCheckCircle className="text-green-600" />
              <span>Có mặt</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 border border-red-200 rounded-full bg-red-50 text-red-700">
              <FaTimesCircle className="text-red-600" />
              <span>Vắng mặt</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 border border-yellow-200 rounded-full bg-yellow-50 text-yellow-700">
              <FaClock className="text-yellow-600" />
              <span>Đi muộn</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Right Section - Attendance Details & Statistics */}
      <div className="space-y-6 flex flex-col justify-between">
        {/* Card for Attendance Details */}
        <Card className="bg-white border border-primary-light shadow-md flex-grow">
          <CardHeader>
            <CardTitle className="text-xl text-primary-darkest">
              Chi tiết điểm danh
            </CardTitle>
            <CardDescription className="text-primary-dark">
              {selectedDate.toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
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
                  {getAttendanceForSelectedDate()?.status === "present" && (
                    <div className="flex items-center gap-1 text-green-600">
                      <FaCheckCircle />
                      <span>Có mặt</span>
                    </div>
                  )}
                  {getAttendanceForSelectedDate()?.status === "absent" && (
                    <div className="flex items-center gap-1 text-red-600">
                      <FaTimesCircle />
                      <span>Vắng mặt</span>
                    </div>
                  )}
                  {getAttendanceForSelectedDate()?.status === "late" && (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <FaClock />
                      <span>
                        Đi muộn {getAttendanceForSelectedDate()?.lateMinutes}{" "}
                        phút
                      </span>
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

        {/* Card for Attendance Statistics (Pie Chart) */}
        <Card className="bg-white border border-primary-light shadow-md flex-grow">
          <CardHeader>
            <CardTitle className="text-xl text-primary-darkest">
              Thống kê lịch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-full">
              {" "}
              {/* Centering horizontally and vertically */}
              <div className="w-full max-w-[500px] h-[400px] flex items-center justify-center">
                {" "}
                {/* Ensuring centering inside */}
                <Pie
                  data={pieChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          font: {
                            size: 14,
                            weight: "bold",
                          },
                          color: "#333",
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: (tooltipItem) => {
                            return `${tooltipItem.label}: ${tooltipItem.raw}%`; // Show percentage on hover
                          },
                        },
                      },
                    },
                    elements: {
                      arc: {
                        borderWidth: 2, // Adds border around pie slices
                      },
                    },
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
