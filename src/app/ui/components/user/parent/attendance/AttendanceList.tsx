"use client";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../_common/Card";
import { useState } from "react";
import Pagination from "../../../_common/Pagination";

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
}

const ITEMS_PER_PAGE = 5;

export default function AttendanceList({
  mockAttendanceData,
  selectedMonth,
  selectedYear,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const getCurrentMonthData = () => {
    const filteredDates = Object.entries(mockAttendanceData.dates).filter(
      ([dateStr]) => {
        const date = new Date(dateStr);
        return (
          date.getMonth() === selectedMonth &&
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

  return (
    <Card className="bg-white border border-primary-light shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-primary-darkest">
            Danh sách điểm danh
          </CardTitle>
          <CardDescription className="text-primary-dark text-lg">
            Tháng {selectedMonth + 1}/{selectedYear}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {data.length > 0 ? (
          <>
            <div className="space-y-4">
              {paginatedData.map((item, index) => (
                <div
                  key={index}
                  className="border border-primary-light rounded-xl p-4 bg-gray-50 hover:bg-primary-lighter transition-all duration-200 shadow-sm"
                >
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="font-semibold text-primary-darkest">
                        {item.date.toLocaleDateString("vi-VN", {
                          weekday: "long",
                          day: "numeric",
                          month: "numeric",
                        })}
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>
                          Môn học:{" "}
                          <span className="font-medium text-gray-800">
                            {item.subject}
                          </span>
                        </div>
                        <div>
                          Thời gian:{" "}
                          <span className="font-medium text-gray-800">
                            {item.time}
                          </span>
                        </div>
                        {item.reason && (
                          <div>
                            Lý do:{" "}
                            <span className="font-medium text-gray-800">
                              {item.reason}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex flex-col items-end gap-1 text-sm">
                      {item.status === "present" && (
                        <div className="flex items-center gap-1 text-green-600 font-medium">
                          <FaCheckCircle className="text-lg" />
                          <span>Có mặt</span>
                        </div>
                      )}
                      {item.status === "absent" && (
                        <div className="flex items-center gap-1 text-red-600 font-medium">
                          <FaTimesCircle className="text-lg" />
                          <span>Vắng mặt</span>
                        </div>
                      )}
                      {item.status === "late" && (
                        <div className="flex items-center gap-1 text-yellow-600 font-medium">
                          <FaClock className="text-lg" />
                          <span>Đi muộn {item.lateMinutes} phút</span>
                        </div>
                      )}
                      <div className="text-gray-600">
                        <span className="font-medium text-gray-800">
                          Thời gian: {item.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
          </>
        ) : (
          <div className="text-center py-10 text-gray-500">
            Không có dữ liệu điểm danh trong tháng này
          </div>
        )}
      </CardContent>
    </Card>
  );
}
