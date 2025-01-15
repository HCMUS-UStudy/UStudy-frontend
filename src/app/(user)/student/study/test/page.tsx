"use client";

import PaginationAdmin from "@/app/ui/components/paginationAdmin";
import ExerciseItem from "@/app/ui/components/TestStudent/ExerciseItem";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FiBook, FiFilter } from "react-icons/fi";

export default function ExercisesPage() {
  const [tab, setTab] = useState<'incomplete' | 'complete'>('incomplete');
  const [date, setDate] = useState(new Date());

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  const handleDateChange = (selectedDate: any) => {
    setDate(selectedDate);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-tr from-blue-50 via-white to-gray-100 rounded-3xl">
      {/* Main Content */}
      <div className="flex-1 mx-auto p-4 sm:p-6 bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-lg mt-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 text-center mb-10">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Bài tập & Kiểm tra
          </span>
        </h2>

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex gap-2 sm:gap-4">
            <button
              className={`px-4 sm:px-6 py-2 rounded-full font-medium transition ${tab === 'incomplete'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              onClick={() => setTab('incomplete')}
            >
              Chưa hoàn thành
            </button>
            <button
              className={`px-4 sm:px-6 py-2 rounded-full font-medium transition ${tab === 'complete'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              onClick={() => setTab('complete')}
            >
              Đã hoàn thành
            </button>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <select className="appearance-none px-4 py-2 border rounded-full text-gray-700 bg-white shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none pr-8">
                <option value="all">Tất cả các môn</option>
                <option value="math">Toán</option>
                <option value="literature">Ngữ văn</option>
                <option value="english">Tiếng Anh</option>
              </select>
              <FiFilter className="absolute right-3 top-3 text-gray-500" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition">
              <FiBook />
              Bài tập tham khảo
            </button>
          </div>
        </div>

        {/* Exercise List */}
        <div className="grid gap-4">
          <ExerciseItem
            image="https://via.placeholder.com/50"
            id="1"
            title="Ôn tập Ngữ văn 6"
            status="Hoàn thành"
            deadline="2025-01-10"
            completedQuestions={0}
            totalQuestions={5}
            grade="6A1+7A4"
            subject="Ngữ văn"
          />
          <ExerciseItem
            image="https://via.placeholder.com/50"
            id="2"
            title="Ôn luyện Tiếng Anh"
            status="Chưa hoàn thành"
            deadline="2025-01-12"
            completedQuestions={2}
            totalQuestions={10}
            grade="6A1+7A4"
            subject="Tiếng Anh"
          />
        </div>

        {/* Pagination */}
        <PaginationAdmin
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
        />
      </div>

      {/* Calendar Section */}
      <div className="w-full md:w-1/4 bg-white bg-opacity-90 backdrop-blur-md shadow-lg border-t md:border-l border-gray-200 p-4 sm:p-6 rounded-t-3xl md:rounded-l-3xl">
        <h3 className="text-2xl font-extrabold mb-4 text-gray-800 text-center md:text-left">
          Lịch cá nhân
        </h3>
        <div className="p-4 bg-gradient-to-br from-white to-indigo-100 rounded-2xl shadow-xl">
          <Calendar
            onChange={handleDateChange}
            value={date}
            className="w-full rounded-lg overflow-hidden shadow-md"
            tileClassName={({ date, view }) =>
              `transition-all duration-300 ${view === "month" &&
                date.toDateString() === new Date().toDateString()
                ? "bg-indigo-500 text-white font-bold rounded-lg shadow-md"
                : "hover:bg-blue-100 hover:text-blue-700 rounded-md"
              }`
            }
          />
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-700 mb-3">Bài tập gần đây</h3>
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
