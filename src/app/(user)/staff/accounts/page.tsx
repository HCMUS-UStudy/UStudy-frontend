"use client";
import React, { useState } from "react";
import { FaEdit, FaSearch, FaTrashAlt } from "react-icons/fa";

export default function Accounts() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Search query submitted:", searchQuery);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Selected filter:", event.target.value);
  };

  const users = Array.from({ length: 10 }, (_, index) => ({
    name: `Nguyễn Văn ${String.fromCharCode(65 + index)}`,
    id: `1234${index}`,
    role: index % 2 === 0 ? "Học viên" : "Giáo viên",
    status: "Hoạt động",
    createdAt: `01/01/2024`,
  }));
  return (
    <>
      <div className="flex items-center justify-between mt-8 mr-6">
        <h2 className="text-2xl font-bold">Tổng số tài khoản (14.050)</h2>
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center space-x-4 w-full md:w-96 lg:w-[30rem]">
          <div className="flex items-center w-full border-2 border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all">
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-l-full focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition ease-in-out"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-r-full bg-white text-black hover:bg-slate-100 focus:ring-2 focus:ring-blue-300">
              <FaSearch className="h-5 w-5" />
            </button>
          </div>
          <select
            onChange={handleFilterChange}
            className="ml-4 border-2 border-gray-300 rounded-full px-4 py-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all">
            <option value="">Lọc</option>
            <option value="student">Học viên</option>
            <option value="teacher">Giáo viên</option>
            <option value="staff">Giáo vụ</option>
          </select>
        </form>
      </div>

      <div className="overflow-x-auto mt-6 max-h-[400px] mr-6">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Họ tên
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Mã số
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Chức vụ
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-b">
                <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.role}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.status}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.createdAt}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 flex items-center space-x-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <FaTrashAlt className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
