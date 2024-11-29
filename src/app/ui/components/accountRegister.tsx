"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaCheck, FaTimes } from "react-icons/fa";
import PaginationAdmin from "./paginationAdmin"; // Make sure the correct path is used
import { Button } from "./button";

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  birthday: string;
  phone: string;
  gender: string;
}

interface AccountRegisterModalProps {
  buttonLabel: string;
}

const AccountRegisterModal: React.FC<AccountRegisterModalProps> = ({ buttonLabel }) => {

  const [showModalRe, setShowModalRe] = useState(false);
  const handleOpenModal = () => setShowModalRe(true);
  const handleCloseModal = () => setShowModalRe(false);

  const [activeTab, setActiveTab] = useState("students"); // "students" or "teachers"
  const [students, setStudents] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPageStu, setCurrentPageStu] = useState(1);
  const [currentPageTea, setCurrentPageTea] = useState(1);
  const [totalPagesStu, setTotalPagesStu] = useState(0);
  const [totalPagesTea, setTotalPagesTea] = useState(0);

  const fetchStudents = async () => {
    setLoading(true);
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await axios.get(`http://localhost:8080/api/register/clerk/waiting-register`, {
        params: {
          page: currentPageStu - 1, // Adjust page for API (zero-indexed)
          limit: 1,
          role: "STUDENT"
        },
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setStudents(response.data?.content || []);
      // Set total pages for students based on API response
      setTotalPagesStu(response.data?.totalPages || 0);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Lỗi khi tải dữ liệu học sinh",
        text: error.response?.data?.message || "Không thể tải dữ liệu học sinh.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    setLoading(true);
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await axios.get(`http://localhost:8080/api/register/clerk/waiting-register`, {
        params: {
          page: currentPageTea - 1, // Adjust page for API (zero-indexed)
          limit: 4,
          role: "TEACHER"
        },
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setTeachers(response.data?.content || []);
      // Set total pages for teachers based on API response
      setTotalPagesTea(response.data?.totalPages || 0);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Lỗi khi tải dữ liệu giáo viên",
        text: error.response?.data?.message || "Không thể tải dữ liệu giáo viên.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
  }, [currentPageStu, currentPageTea]); // Trigger fetch when page changes

  const handleApprove = async (userId: string) => {
    setLoading(true);
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await axios.put(
        `http://localhost:8080/api/register/admin/confirm?registerId=${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Phê duyệt thành công",
          text: "Người dùng đã được phê duyệt thành công!",
          timer: 8000,
          showConfirmButton: false,
        });

        fetchStudents();
        fetchTeachers();
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Phê duyệt thất bại",
        text: error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (userId: string) => {
    setLoading(true);
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await axios.put(
        `http://localhost:8080/api/register/admin/reject?registerId=${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Từ chối thành công",
          text: "Người dùng không được phê duyệt!",
          timer: 8000,
          showConfirmButton: false,
        });

        fetchStudents();
        fetchTeachers();
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Từ chối thất bại",
        text: error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại!",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle previous and next page functions
  const handlePreviousPageStu = () => {
    if (currentPageStu > 1) setCurrentPageStu(currentPageStu - 1);
  };

  const handleNextPageStu = () => {
    if (currentPageStu < totalPagesStu) setCurrentPageStu(currentPageStu + 1);
  };

  const handlePreviousPageTea = () => {
    if (currentPageTea > 1) setCurrentPageTea(currentPageTea - 1);
  };

  const handleNextPageTea = () => {
    if (currentPageTea < totalPagesTea) setCurrentPageTea(currentPageTea + 1);
  };

  return (
    <>
      <Button
        onClick={handleOpenModal}
        className="pl-6 pr-6"
      >
        {buttonLabel}
      </Button>
      {showModalRe && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowModalRe(false)}
        >
          <div
            className="bg-white p-12 rounded-xl w-4/5 max-w-6xl overflow-y-auto shadow-2xl transform transition-all ease-in-out duration-300 scale-95 hover:scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-semibold text-gray-800">
                Thông tin người dùng cần xác nhận
              </h2>
              <button
                onClick={() => setShowModalRe(false)}
                className="text-gray-600 hover:text-gray-800 text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            {/* Tab Buttons */}
            <div className="flex space-x-4 border-b mb-6">
              <button
                className={`py-2 px-4 text-lg font-semibold ${activeTab === "students"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-700"
                  }`}
                onClick={() => setActiveTab("students")}
              >
                Học viên
              </button>
              <button
                className={`py-2 px-4 text-lg font-semibold ${activeTab === "teachers"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-700"
                  }`}
                onClick={() => setActiveTab("teachers")}
              >
                Giáo viên
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "students" && (
              <>
                <table className="w-full table-auto mb-8">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="py-3 px-6 text-left text-gray-700">Tên</th>
                      <th className="py-3 px-6 text-left text-gray-700">Email</th>
                      <th className="py-3 px-6 text-left text-gray-700">Địa chỉ</th>
                      <th className="py-3 px-6 text-left text-gray-700">Ngày sinh</th>
                      <th className="py-3 px-6 text-left text-gray-700">Số điện thoại</th>
                      <th className="py-3 px-6 text-left text-gray-700">Giới tính</th>

                      <th className="py-3 px-6 text-center text-gray-700">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6 border-b text-gray-600">{student.name}</td>
                        <td className="py-4 px-6 border-b text-gray-600">{student.email}</td>
                        <td className="py-4 px-6 border-b text-gray-600">{student.address}</td>
                        <td className="py-4 px-6 border-b text-gray-600">
                          {new Date(student.birthday).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="py-4 px-6 border-b text-gray-600">{student.phone}</td>
                        <td className="py-4 px-6 border-b text-gray-600">{student.gender}</td>
                        <td className="py-4 px-6 border-b text-center">
                          <div className="flex">
                            <button
                              onClick={() => handleApprove(student.id)}
                              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleReject(student.id)}
                              className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 ml-4"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <PaginationAdmin
                  currentPage={currentPageStu}
                  totalPages={totalPagesStu}
                  setCurrentPage={setCurrentPageStu}
                  handlePreviousPage={handlePreviousPageStu}
                  handleNextPage={handleNextPageStu}
                />
              </>
            )}

            {activeTab === "teachers" && (
              <>
                <table className="w-full table-auto mb-8">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="py-3 px-6 text-left text-gray-700">Tên</th>
                      <th className="py-3 px-6 text-left text-gray-700">Email</th>
                      <th className="py-3 px-6 text-left text-gray-700">Địa chỉ</th>
                      <th className="py-3 px-6 text-left text-gray-700">Ngày sinh</th>
                      <th className="py-3 px-6 text-left text-gray-700">Số điện thoại</th>
                      <th className="py-3 px-6 text-left text-gray-700">Giới tính</th>

                      <th className="py-3 px-6 text-center text-gray-700">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6 border-b text-gray-600">{teacher.name}</td>
                        <td className="py-4 px-6 border-b text-gray-600">{teacher.email}</td>
                        <td className="py-4 px-6 border-b text-gray-600">{teacher.address}</td>
                        <td className="py-4 px-6 border-b text-gray-600">
                          {new Date(teacher.birthday).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="py-4 px-6 border-b text-gray-600">{teacher.phone}</td>
                        <td className="py-4 px-6 border-b text-gray-600">{teacher.gender}</td>
                        <td className="py-4 px-6 border-b text-center">
                          <div className="flex">
                            <button
                              onClick={() => handleApprove(teacher.id)}
                              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleReject(teacher.id)}
                              className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 ml-4"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <PaginationAdmin
                  currentPage={currentPageTea}
                  totalPages={totalPagesTea}
                  setCurrentPage={setCurrentPageTea}
                  handlePreviousPage={handlePreviousPageTea}
                  handleNextPage={handleNextPageTea}
                />
              </>
            )}
          </div>
        </div>
      )}
    </>

  );
};

export default AccountRegisterModal;
