import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../_common/Card";
import { useState } from "react";
import Pagination from "../../../_common/Pagination";
import { Select, SelectItem } from "../../../_common/Select";

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

interface Props {
  mockAttendanceData: AttendanceData;
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
}

const ITEMS_PER_PAGE = 5;

// Month names in Vietnamese
const monthNames = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export default function AttendanceList({
  mockAttendanceData,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const getCurrentMonthData = () => {
    const filteredDates = Object.entries(mockAttendanceData.dates).filter(
      ([dateStr]) => {
        const date = new Date(dateStr);
        return (
          date.getMonth() === selectedMonth - 1 && // Fix month comparison
          date.getFullYear() === selectedYear
        );
      },
    );

    return filteredDates
      .map(([dateStr, data]) => ({
        date: new Date(dateStr),
        ...data,
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const data = getCurrentMonthData();
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Generate year options (current year - 2 to current year + 2)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const minYear = yearOptions[0];
  const maxYear = yearOptions[yearOptions.length - 1];

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    setCurrentPage(1); // Reset to first page when changing month
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setCurrentPage(1); // Reset to first page when changing year
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      if (selectedYear > minYear) {
        setSelectedMonth(12);
        setSelectedYear(selectedYear - 1);
      }
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
    setCurrentPage(1);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      if (selectedYear < maxYear) {
        setSelectedMonth(1);
        setSelectedYear(selectedYear + 1);
      }
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
    setCurrentPage(1);
  };

  const handlePreviousYear = () => {
    if (selectedYear > minYear) {
      setSelectedYear(selectedYear - 1);
      setCurrentPage(1);
    }
  };

  const handleNextYear = () => {
    if (selectedYear < maxYear) {
      setSelectedYear(selectedYear + 1);
      setCurrentPage(1);
    }
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary-light border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-lighter rounded-lg">
              <FaCalendarAlt className="text-primary-dark text-xl" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-800 font-semibold">
                Danh sách điểm danh
              </CardTitle>
              <CardDescription className="text-gray-600">
                Xem chi tiết điểm danh theo tháng
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Month/Year Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaCalendarAlt className="text-primary-dark" />
                Chọn thời gian:
              </label>

              {/* Month Selection */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousMonth}
                  className="p-2 hover:bg-primary-light rounded-lg transition-colors"
                  title="Tháng trước"
                  disabled={selectedMonth === 1 && selectedYear === minYear}
                >
                  <FaChevronLeft className="text-primary-dark" />
                </button>

                <Select
                  value={selectedMonth}
                  defaultLabel={monthNames[selectedMonth - 1]}
                  onValueChange={(value) => handleMonthChange(Number(value))}
                  className="min-w-[120px]"
                >
                  {monthNames.map((month, index) => (
                    <SelectItem key={index + 1} value={index + 1}>
                      {month}
                    </SelectItem>
                  ))}
                </Select>

                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-primary-light rounded-lg transition-colors"
                  title="Tháng sau"
                  disabled={selectedMonth === 12 && selectedYear === maxYear}
                >
                  <FaChevronRight className="text-primary-dark" />
                </button>
              </div>

              {/* Year Selection */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousYear}
                  className="p-2 hover:bg-primary-light rounded-lg transition-colors"
                  title="Năm trước"
                  disabled={selectedYear === minYear}
                >
                  <FaChevronLeft className="text-primary-dark" />
                </button>
                <Select
                  value={selectedYear}
                  defaultLabel={selectedYear.toString()}
                  onValueChange={(value) => handleYearChange(Number(value))}
                  className="min-w-[100px]"
                >
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </Select>
                <button
                  onClick={handleNextYear}
                  className="p-2 hover:bg-primary-light rounded-lg transition-colors"
                  title="Năm sau"
                  disabled={selectedYear === maxYear}
                >
                  <FaChevronRight className="text-primary-dark" />
                </button>
              </div>
            </div>

            {/* Current Selection Display */}
            <div className="text-right">
              <div className="text-sm text-gray-600">Đang xem:</div>
              <div className="text-lg font-bold text-primary-dark">
                {monthNames[selectedMonth - 1]} {selectedYear}
              </div>
            </div>
          </div>
        </div>

        {/* Attendance List */}
        {data.length > 0 ? (
          <>
            <div className="space-y-4">
              {paginatedData.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-primary-light transition-all duration-200 shadow-sm"
                >
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="font-semibold text-gray-800 text-lg">
                        {item.date.toLocaleDateString("vi-VN", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">
                            Môn học:
                          </span>
                          <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                            {item.subject}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">
                            Thời gian:
                          </span>
                          <span className="bg-white px-3 py-1 rounded-full text-sm text-gray-800">
                            {item.time}
                          </span>
                        </div>
                        {item.reason && (
                          <div className="flex items-start gap-2">
                            <span className="font-medium text-gray-700">
                              Lý do:
                            </span>
                            <span className="bg-blue-50 px-3 py-1 rounded-lg text-sm text-blue-800">
                              {item.reason}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex flex-col items-end gap-2">
                      {item.status === "present" && (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">
                          <FaCheckCircle className="text-lg" />
                          <span>Có mặt</span>
                        </div>
                      )}
                      {item.status === "absent" && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-full font-medium">
                          <FaTimesCircle className="text-lg" />
                          <span>Vắng mặt</span>
                        </div>
                      )}
                      {item.status === "late" && (
                        <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full font-medium">
                          <FaClock className="text-lg" />
                          <span>Đi muộn</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageClick={(page) => setCurrentPage(page)}
                  handlePreviousPage={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  handleNextPage={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <FaCalendarAlt className="text-gray-300 text-4xl mx-auto mb-3" />
            <h3 className="text-gray-600 font-medium mb-2">Không có dữ liệu</h3>
            <p className="text-gray-500 text-sm">
              Không có dữ liệu điểm danh trong {monthNames[selectedMonth - 1]}{" "}
              {selectedYear}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
