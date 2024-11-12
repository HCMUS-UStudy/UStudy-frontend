"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/ui/components/card";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBuilding,
  FaEdit,
  FaTrashAlt,
  FaSearch,
} from "react-icons/fa";
import { Label } from "@/app/ui/components/label";
import { Input } from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";

const AccountPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, name: false });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    birthDate: "",
    role: "",
  });

  const onCreateUser = () => {
    setShowModal(true); // Show modal when "Tạo người dùng" is clicked
  };

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New user details:", newUser);
    setShowModal(false); // Close modal after submission
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Sample users (10 users)
  const users = Array.from({ length: 10 }, (_, index) => ({
    name: `Nguyễn Văn ${String.fromCharCode(65 + index)}`,
    id: `1234${index}`,
    role: index % 2 === 0 ? "Học viên" : "Giáo viên",
    status: "Hoạt động",
    createdAt: `01/01/2024`,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 2;

  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + usersPerPage);

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight my-4">
        Quản lý tài khoản người dùng
      </h2>
      <h2 className="text-xl tracking-tight mb-6">
        Tìm tất cả người dùng của nền tảng tại đây
      </h2>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mr-6">
        <Card className="rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-3">
          <CardHeader className="flex flex-row items-center justify-between p-2 bg-gray-50 rounded-t-md">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Tổng số học viên
            </CardTitle>
            <FaUserGraduate className="h-5 w-5 text-black" />
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-2xl font-bold text-gray-900 flex items-center">
              11.000
              <span className="ml-2 text-xs text-blue-600 border border-blue-600 rounded-full px-1 py-0.5">
                +5.00%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-3">
          <CardHeader className="flex flex-row items-center justify-between p-2 bg-gray-50 rounded-t-md">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Tổng số giáo viên
            </CardTitle>
            <FaChalkboardTeacher className="h-5 w-5 text-black" />
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-2xl font-bold text-gray-900 flex items-center">
              3000
              <span className="ml-2 text-xs text-green-600 border border-green-600 rounded-full px-1 py-0.5">
                +5.00%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-3">
          <CardHeader className="flex flex-row items-center justify-between p-2 bg-gray-50 rounded-t-md">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Tổng số giáo vụ
            </CardTitle>
            <FaBuilding className="h-5 w-5 text-black" />
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-2xl font-bold text-gray-900 flex items-center">
              50
              <span className="ml-2 text-xs text-red-600 border border-red-600 rounded-full px-1 py-0.5">
                +5.00%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mt-8 mr-6">
        <h2 className="text-2xl font-bold">Tổng số người dùng (14.050)</h2>
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

      <div className="flex justify-end mt-6 mr-6">
        <Button onClick={onCreateUser} type="button" className="pl-6 pr-6">
          Tạo người dùng
        </Button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-96 max-w-lg">
            <h3 className="text-3xl font-semibold mb-6 text-center text-gray-800">
              Tạo người dùng mới
            </h3>

            <form onSubmit={handleSubmitModal} className="space-y-6">
              {/* Floating Label for Email */}
              <div className="relative mb-6">
                <Input
                  className="p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 
                  focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200 
                  placeholder-transparent"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() =>
                    setIsFocused((prev) => ({ ...prev, email: true }))
                  }
                  onBlur={() =>
                    setIsFocused((prev) => ({ ...prev, email: false }))
                  }
                  placeholder="Enter your email"
                  required
                />
                <Label
                  htmlFor="email"
                  className={`absolute left-4 transition-all duration-200 ${
                    isFocused.email || email
                      ? "-top-3.5 text-xs text-indigo-600 bg-white px-1"
                      : "top-1/2 transform -translate-y-1/2 text-gray-400"
                  }`}>
                  Enter your email
                </Label>
              </div>

              {/* Floating Label for Name */}
              <div className="relative mb-6">
                <Input
                  className="p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 
                  focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200 
                  placeholder-transparent"
                  type="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() =>
                    setIsFocused((prev) => ({ ...prev, name: true }))
                  }
                  onBlur={() =>
                    setIsFocused((prev) => ({ ...prev, name: false }))
                  }
                  placeholder="Enter your name"
                  required
                />
                <Label
                  htmlFor="name"
                  className={`absolute left-4 transition-all duration-200 ${
                    isFocused.name || name
                      ? "-top-3.5 text-xs text-indigo-600 bg-white px-1"
                      : "top-1/2 transform -translate-y-1/2 text-gray-400"
                  }`}>
                  Enter your name
                </Label>
              </div>

              {/* Floating Label for Birthdate */}
              <div className="relative mb-6">
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={newUser.birthDate}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 
                  focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200 
                  placeholder-transparent"
                />
                <label
                  htmlFor="birthDate"
                  className="absolute left-4 transition-all duration-200 -top-3.5 text-xs text-indigo-600 bg-white px-1">
                  Ngày sinh
                </label>
              </div>

              {/* Floating Label for Role */}
              <div className="relative mb-6">
                <select
                  id="role"
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-4 bg-transparent rounded-xl text-gray-800 border border-gray-300 
                  focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200 
                  placeholder-transparent"
                  required>
                  <option value="">Chọn chức vụ</option>
                  <option value="student">Học viên</option>
                  <option value="teacher">Giáo viên</option>
                  <option value="staff">Giáo vụ</option>
                </select>
                <label
                  htmlFor="role"
                  className="absolute left-4 transition-all duration-200 -top-3.5 text-xs text-indigo-600 bg-white px-1">
                  Chức vụ
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gray-300 text-black rounded-full hover:bg-gray-400 focus:outline-none 
                  focus:ring-2 focus:ring-gray-600 transition duration-200">
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none 
                  focus:ring-2 focus:ring-indigo-500 transition duration-200">
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table Section */}
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
            {paginatedUsers.map((user, index) => (
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
                    <FaTrashAlt className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-6 mr-6 space-x-2">
        {/* Previous Button */}
        <Button
          onClick={handlePreviousPage}
          className={`px-4 py-2 rounded-md text-white font-semibold transition-all duration-200 ${
            currentPage === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={currentPage === 1}>
          Previous
        </Button>

        {/* Page Numbers with a Max of 3 Pages */}
        {Array.from({ length: Math.min(3, totalPages) }, (_, index) => {
          const page =
            Math.min(totalPages - 2, Math.max(1, currentPage - 1)) + index;
          return (
            <button
              key={index}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
                currentPage === page
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <Button
          onClick={handleNextPage}
          className={`px-4 py-2 rounded-md text-white font-semibold transition-all duration-200 ${
            currentPage === totalPages
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </>
  );
};

export default AccountPage;
