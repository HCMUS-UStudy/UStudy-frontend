"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CheckTuition() {
  const [date, setDate] = useState(new Date());
  const [paymentStatus] = useState<boolean>(false);

  const handleDateChange = (selectedDate: any) => {
    setDate(selectedDate);
    console.log("Selected Date:", selectedDate);
  };

  const data = {
    semester1: [
      { id: 1, name: "Toán học", fee: 1500000 },
      { id: 2, name: "Vật lý", fee: 1200000 },
      { id: 3, name: "Hóa học", fee: 1300000 },
    ],
    semester2: [
      { id: 1, name: "Ngữ văn", fee: 1400000 },
      { id: 2, name: "Lịch sử", fee: 1100000 },
      { id: 3, name: "Địa lý", fee: 1250000 },
    ],
  };

  type SemesterKey = keyof typeof data; // Chỉ định rõ các key hợp lệ là "semester1" hoặc "semester2"
  const [selectedSemester, setSelectedSemester] = useState<SemesterKey | "">("");

  const subjects = selectedSemester ? data[selectedSemester] : [];
  const totalFee = subjects.reduce((sum, subject) => sum + subject.fee, 0);


  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-tr from-blue-50 via-white to-gray-100 rounded-3xl">

      {/* Body Content */}
      <div className="w-full p-8 bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-2xl">
        <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-8">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Kiểm Tra Học Phí
          </span>
        </h2>

        {/* Thông tin sinh viên */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Thông Tin Sinh Viên</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-lg text-gray-700"><strong>Tên Sinh Viên:</strong> Nguyễn Gia Bảo</p>
              <p className="text-lg text-gray-700"><strong>Mã Sinh Viên:</strong> 123456</p>
            </div>
            <div>
              <p className="text-lg text-gray-700"><strong>Ngày Sinh:</strong> 01/01/2000</p>
              <p className="text-lg text-gray-700"><strong>Chuyên Ngành:</strong> Công Nghệ Thông Tin</p>
            </div>
          </div>
        </div>

        {/* Chọn học kỳ */}
        <div className="mb-8">
          <label htmlFor="semester" className="block text-lg text-gray-700 font-medium mb-3">
            Chọn học kỳ
          </label>
          <select
            id="semester"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="" disabled>
              -- Chọn học kỳ --
            </option>
            <option value="semester1">Học kỳ 1</option>
            <option value="semester2">Học kỳ 2</option>
          </select>
        </div>

        {/* Danh sách môn học */}
        {subjects.length > 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Danh Sách Môn Học</h3>
            <p
              className={`text-lg font-semibold ${paymentStatus ? 'text-green-600' : 'text-red-600'
                }`}
            >
              {paymentStatus ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}
            </p>
            </div>
            <table className="w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Môn học</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Học phí</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr
                    key={subject.id}
                    className="hover:bg-blue-50 transition"
                  >
                    <td className="border border-gray-300 px-4 py-2">{subject.name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-blue-600 font-medium">
                      {subject.fee.toLocaleString()} VNĐ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Tổng học phí */}
            <div className="mt-6 text-right text-xl text-gray-800 font-semibold">
              Tổng học phí: <span className="text-blue-600">{totalFee.toLocaleString()} VNĐ</span>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            Vui lòng chọn học kỳ để xem học phí.
          </div>
        )}
      </div>
      {/* Calendar Section */}
      <div className="w-full md:w-1/4 bg-white bg-opacity-90 backdrop-blur-md border-t md:border-2 border-slate-200 p-6 rounded-t-lg md:rounded-l-lg">
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