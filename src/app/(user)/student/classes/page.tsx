"use client";

import { Button } from "@/app/ui/components/_common/Button";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaSpinner } from "react-icons/fa6";

export default function Classes() {
  const [date, setDate] = useState(new Date());
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [classDetails, setClassDetails] = useState<{ [key: string]: any }>({});

  const classesPerPage = 4;

  const Loading = () => (
    <div className="flex items-center justify-center h-full">
      <FaSpinner className="animate-spin text-blue-500 h-8 w-8" />
      <span className="ml-4 text-lg text-blue-500">Đang tải dữ liệu...</span>
    </div>
  );

  const handleDateChange = (selectedDate: any) => {
    setDate(selectedDate);
    console.log("Selected Date:", selectedDate);
  };

  const fetchClasses = async () => {
    setLoading(true);
    const authToken = localStorage.getItem("accessToken");

    try {
      const response = await axios.get(
        `http://localhost:8080/api/user/all/get-list-class`,
        {
          params: {
            page: currentPage - 1,
            limit: classesPerPage,
            filter: "",
          },
          headers: { Authorization: `Bearer ${authToken}` },
        },
      );
      console.log("Fetched Classes:", response.data);

      setClasses(response.data?.content || []);
      setTotalPages(response.data?.totalPages || 0);
    } catch (err) {
      console.error("Error fetching classes:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassDetails = async (classId: string) => {
    if (classDetails[classId]) {
      console.log(
        `Class details for ${classId} already fetched:`,
        classDetails[classId],
      );
      return; // Avoid fetching if details already exist
    }

    const authToken = localStorage.getItem("accessToken");

    try {
      const response = await axios.get(
        `http://localhost:8080/api/class/all/get-one`,
        {
          params: { classId },
          headers: { Authorization: `Bearer ${authToken}` },
        },
      );

      setClassDetails((prevDetails) => {
        const updatedDetails = { ...prevDetails, [classId]: response.data };
        console.log("Updated classes details:", updatedDetails); // Log the updated state
        return updatedDetails;
      });
    } catch (err) {
      console.error("Error fetching classes details:", err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [currentPage]);

  useEffect(() => {
    if (classes.length > 0) {
      classes.forEach((classItem) => fetchClassDetails(classItem.id));
    }
  }, [classes]);

  useEffect(() => {
    if (classes.length > 0) {
      const fetchDetails = async () => {
        await Promise.all(
          classes.map((classItem) => fetchClassDetails(classItem.id)),
        );
      };
      fetchDetails();
    }
  }, [classes]);

  const handlePreviousPage = () =>
    setCurrentPage((prev) => {
      const newPage = Math.max(prev - 1, 1);
      console.log("Previous Page:", newPage); // Kiểm tra giá trị
      return newPage;
    });

  const handleNextPage = () =>
    setCurrentPage((prev) => {
      const newPage = Math.min(prev + 1, totalPages);
      console.log("Next Page:", newPage); // Kiểm tra giá trị
      return newPage;
    });

  const getPageNumbers = () => {
    const pages = [];
    const maxPages = Math.min(3, totalPages);

    let start = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
    for (let i = start; i < start + maxPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-tr from-blue-50 via-white to-gray-100 rounded-3xl">
      {/* Body Content */}
      <div className="flex-grow p-6 md:p-10">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-8">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">
            Danh sách lớp học
          </span>
        </h2>
        <div className="flex flex-col space-y-6">
          {classes.map((classItem) => (
            <div
              key={classItem.id}
              className="flex items-center bg-gradient-to-r from-white to-blue-50 shadow-xl border border-gray-200 p-6 rounded-2xl hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-extrabold text-lg mr-6 shadow-inner">
                {classDetails[classItem.id]?.course?.name.charAt(0)}
              </div>
              {/* Class Details */}
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-700 mb-1">
                  {classDetails[classItem.id]?.course?.name
                    ? `${classDetails[classItem.id]?.course?.name} ${classDetails[classItem.id]?.grade?.name} - Lớp ${classItem.name}`
                    : classItem.name}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Giáo viên:</strong>{" "}
                  {classDetails[classItem.id]?.teacher?.name ||
                    "Chưa có giáo viên"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Phòng học:</strong> {classItem.room.name}
                </p>
              </div>
              {/* Action */}
              <button
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full shadow-md hover:bg-blue-600 transition-all"
                onClick={() => fetchClassDetails(classItem.id)}
              >
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>

        {/* Pagination Section */}
        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={handlePreviousPage}
            className={`px-4 py-2 rounded-md text-white font-semibold transition-all ${
              currentPage === 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={currentPage === 1}
          >
            Trước
          </button>

          {totalPages === 1 ? (
            <Button
              key={1}
              onClick={() => setCurrentPage(1)}
              className={`px-4 py-2 rounded-md font-semibold transition-all ${
                currentPage === 1
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              1
            </Button>
          ) : (
            getPageNumbers().map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-md font-semibold transition-all ${
                  currentPage === page
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </Button>
            ))
          )}

          <Button
            onClick={handleNextPage}
            className={`px-4 py-2 rounded-md text-white font-semibold transition-all ${
              currentPage === totalPages
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={currentPage === totalPages}
          >
            Sau
          </Button>
        </div>
      </div>
      {/* Calendar Section */}
      <div className="w-full md:w-1/4 bg-white bg-opacity-90 backdrop-blur-md shadow-lg border-t md:border-l border-gray-200 p-6 rounded-t-3xl md:rounded-l-3xl">
        <h3 className="text-2xl font-extrabold mb-4 text-gray-800 text-center md:text-left">
          Lịch cá nhân
        </h3>
        <div className="p-4 bg-gradient-to-br from-white to-indigo-100 rounded-2xl shadow-xl">
          <Calendar
            onChange={handleDateChange}
            value={date}
            className="w-full rounded-lg overflow-hidden shadow-md"
            tileClassName={({ date, view }) =>
              `transition-all duration-300 ${
                view === "month" &&
                date.toDateString() === new Date().toDateString()
                  ? "bg-indigo-500 text-white font-bold rounded-lg shadow-md"
                  : "hover:bg-blue-100 hover:text-blue-700 rounded-md"
              }`
            }
            formatShortWeekday={(locale, date) => {
              const weekdays = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
              return weekdays[date.getDay()];
            }}
            formatMonthYear={(locale, date) => {
              const options: { year: "numeric"; month: "short" } = {
                year: "numeric",
                month: "short",
              };
              return new Intl.DateTimeFormat("en-US", options).format(date);
            }}
            prevLabel={<span className="text-blue-500">←</span>}
            nextLabel={<span className="text-blue-500">→</span>}
          />
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-700 mb-3">
            Bài tập gần đây
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <p className="text-gray-600 text-sm">Bài tập toán ngày mai</p>
            </li>
            <li className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <p className="text-gray-600 text-sm">Bài tập lý cuối tuần</p>
            </li>
            <li className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              <p className="text-gray-600 text-sm">Bài kiểm tra hóa học</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
