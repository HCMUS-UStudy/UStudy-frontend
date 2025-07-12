import {
  FaChartPie,
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
  selectedYear: number;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
}

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

export default function AttendanceSummary({
  mockAttendanceData,
  selectedYear,
  selectedMonth,
  setSelectedMonth,
  setSelectedYear,
}: Props) {
  // Generate year options (current year - 2 to current year + 2)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const minYear = yearOptions[0];
  const maxYear = yearOptions[yearOptions.length - 1];

  const handlePreviousYear = () => {
    if (selectedYear > minYear) {
      setSelectedYear(selectedYear - 1);
    }
  };

  const handleNextYear = () => {
    if (selectedYear < maxYear) {
      setSelectedYear(selectedYear + 1);
    }
  };

  return (
    <div>
      {/* Main Statistics Card */}
      <Card className="lg:col-span-2 bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-primary-light border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-lighter rounded-lg">
                <FaChartPie className="text-primary-dark text-xl" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-800 font-semibold">
                  Thống kê điểm danh
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Tỷ lệ điểm danh năm học {selectedYear - 1}-{selectedYear}
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
                  <FaCalendarAlt className="text-green-500" />
                  Chọn thời gian:
                </label>

                {/* Month Selection */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreviousMonth}
                    className="p-2 hover:bg-green-100 rounded-lg transition-colors"
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
                    className="p-2 hover:bg-green-100 rounded-lg transition-colors"
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
                    className="p-2 hover:bg-green-100 rounded-lg transition-colors"
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
                    className="p-2 hover:bg-green-100 rounded-lg transition-colors"
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

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center p-6 bg-green-50 rounded-xl border border-green-200 shadow-sm">
              <div className="text-4xl font-bold text-primary-dark mb-3">
                {mockAttendanceData.summary.presentPercentage}%
              </div>
              <div className="flex items-center gap-2 mb-2">
                <FaCheckCircle className="text-primary-dark text-lg" />
                <span className="text-green-800 font-semibold">Có mặt</span>
              </div>
              <div className="text-primary-dark text-center text-sm">
                {mockAttendanceData.summary.present}/
                {mockAttendanceData.summary.totalClasses} buổi
              </div>
            </div>

            <div className="flex flex-col items-center p-6 bg-red-50 rounded-xl border border-red-200 shadow-sm">
              <div className="text-4xl font-bold text-red-600 mb-3">
                {mockAttendanceData.summary.absentPercentage}%
              </div>
              <div className="flex items-center gap-2 mb-2">
                <FaTimesCircle className="text-red-600 text-lg" />
                <span className="text-red-800 font-semibold">Vắng mặt</span>
              </div>
              <div className="text-red-600 text-center text-sm">
                {mockAttendanceData.summary.absent}/
                {mockAttendanceData.summary.totalClasses} buổi
              </div>
            </div>

            <div className="flex flex-col items-center p-6 bg-yellow-50 rounded-xl border border-yellow-200 shadow-sm">
              <div className="text-4xl font-bold text-yellow-600 mb-3">
                {mockAttendanceData.summary.latePercentage}%
              </div>
              <div className="flex items-center gap-2 mb-2">
                <FaClock className="text-yellow-600 text-lg" />
                <span className="text-yellow-800 font-semibold">Đi muộn</span>
              </div>
              <div className="text-yellow-600 text-center text-sm">
                {mockAttendanceData.summary.late}/
                {mockAttendanceData.summary.totalClasses} buổi
              </div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Tổng quan điểm danh
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
              <div className="flex h-4 rounded-full overflow-hidden">
                <div
                  className="bg-green-500 h-4 transition-all duration-300"
                  style={{
                    width: `${mockAttendanceData.summary.presentPercentage}%`,
                  }}
                ></div>
                <div
                  className="bg-yellow-500 h-4 transition-all duration-300"
                  style={{
                    width: `${mockAttendanceData.summary.latePercentage}%`,
                  }}
                ></div>
                <div
                  className="bg-red-500 h-4 transition-all duration-300"
                  style={{
                    width: `${mockAttendanceData.summary.absentPercentage}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Subject-wise Statistics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Theo môn học
            </h3>
            <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
              {Object.entries(mockAttendanceData.subjects).map(
                ([subject, data]) => (
                  <div
                    key={subject}
                    className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-semibold text-gray-800">
                        {subject}
                      </div>
                      <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                        {data.total} buổi học
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                      <div className="flex h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-green-500 h-3"
                          style={{
                            width: `${(data.present / data.total) * 100}%`,
                          }}
                        ></div>
                        <div
                          className="bg-yellow-500 h-3"
                          style={{
                            width: `${(data.late / data.total) * 100}%`,
                          }}
                        ></div>
                        <div
                          className="bg-red-500 h-3"
                          style={{
                            width: `${(data.absent / data.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs mt-3">
                      <span className="text-primary-dark font-medium">
                        Có mặt: {data.present}
                      </span>
                      <span className="text-yellow-600 font-medium">
                        Đi muộn: {data.late}
                      </span>
                      <span className="text-red-600 font-medium">
                        Vắng mặt: {data.absent}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
