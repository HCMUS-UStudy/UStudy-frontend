"use client";

import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

const AttendancePage = () => {
  const [year, setYear] = useState("2022");
  const [month, setMonth] = useState("7");
  const [session, setSession] = useState("20");

  const sessions: Record<number, string[]> = {
    7: ["20", "21", "22", "23", "24"],
    8: ["10", "15", "18", "25"],
  };

  const students = [
    { id: 1, name: "Nguyễn Hoài An", dob: "13/09/2008", status: "present" },
    { id: 2, name: "Đặng Phương Anh", dob: "30/07/2008", status: "present" },
    { id: 3, name: "Mai Bảo Châu", dob: "03/10/2008", status: "present" },
    { id: 4, name: "Bùi Thị Thanh Chúc", dob: "03/10/2008", status: "present" },
    { id: 5, name: "Trần Duy Dũng", dob: "03/10/2008", status: "present" },
    { id: 6, name: "Nguyễn Tiến Đạt", dob: "29/09/2008", status: "present" },
  ];

  // Hàm lấy thứ trong tuần
  const getDayOfWeek = (year: string, month: string, day: string) => {
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const daysOfWeek = [
      "Chủ Nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    return daysOfWeek[date.getDay()];
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <select
            className="border rounded px-3 py-1"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="2022">2022</option>
            <option value="2023">2023</option>
          </select>

          <select
            className="border rounded px-3 py-1"
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setSession(sessions[Number(e.target.value)][0]);
            }}
          >
            <option value="7">Tháng 7</option>
            <option value="8">Tháng 8</option>
          </select>

          <select
            className="border rounded px-3 py-1"
            value={session}
            onChange={(e) => setSession(e.target.value)}
          >
            {sessions[Number(month)]?.map((day) => (
              <option key={day} value={day}>
                Buổi {day}
              </option>
            ))}
          </select>

          {/* Hiển thị thứ, ngày, tháng, năm */}
          <span className="font-semibold">
            {getDayOfWeek(year, month, session)}, ngày {session}/{month}/{year}
          </span>

          <FaCalendarAlt className="text-gray-500" />
        </div>

        <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
          Thông báo cho PH
        </button>
      </div>

      <table className="w-full border-collapse border rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">STT</th>
            <th className="border px-4 py-2">Họ tên</th>
            <th className="border px-4 py-2">Ngày sinh</th>
            <th className="border px-4 py-2">Có mặt</th>
            <th className="border px-4 py-2">Nghỉ có phép</th>
            <th className="border px-4 py-2">Nghỉ không phép</th>
            <th className="border px-4 py-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id} className="text-center">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{student.name}</td>
              <td className="border px-4 py-2">{student.dob}</td>
              <td className="border px-4 py-2">
                {student.status === "present" ? "✔️" : ""}
              </td>
              <td className="border px-4 py-2">
                {student.status === "excused" ? "⭕" : ""}
              </td>
              <td className="border px-4 py-2">
                {student.status === "unexcused" ? "❌" : ""}
              </td>
              <td className="border px-4 py-2 text-red-500">Chưa thông báo</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendancePage;
