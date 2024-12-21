"use client";

import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Button } from "../Button";
import PaginationAdmin from "../paginationAdmin";
import { confirmRegister, getRegister, rejectRegister } from "@/app/lib/api";
import Loading from "../loading";
import { RegisterItem } from "@/app/types/type";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

interface AccountRegisterModalProps {
  buttonLabel: string;
}

const AccountRegisterModal: React.FC<AccountRegisterModalProps> = ({
  buttonLabel,
}) => {
  const [showModalRe, setShowModalRe] = useState(false);
  const handleOpenModal = () => setShowModalRe(true);

  const [activeTab, setActiveTab] = useState("students"); // "students" or "teachers"
  const [students, setStudents] = useState<RegisterItem[]>([]);
  const [teachers, setTeachers] = useState<RegisterItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPageStu, setCurrentPageStu] = useState(1);
  const [currentPageTea, setCurrentPageTea] = useState(1);
  const [totalPagesStu, setTotalPagesStu] = useState(0);
  const [totalPagesTea, setTotalPagesTea] = useState(0);

  const fetchStudents = async () => {
    let StudentData: RegisterItem[] = [];
    setLoading(true);

    try {
      const response = await getRegister("STUDENT", currentPageStu - 1);

      StudentData = response.content.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        address: item.address,
        birthday: item.birthday,
        phone: item.phone,
        gender: item.gender,
      }));

      // Set total pages for students based on API response
      setTotalPagesStu(response.totalPages || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setStudents(StudentData);
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    let TeacherData: RegisterItem[] = [];
    setLoading(true);

    try {
      const response = await getRegister("TEACHER", currentPageStu - 1);

      TeacherData = response.content.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        address: item.address,
        birthday: item.birthday,
        phone: item.phone,
        gender: item.gender,
      }));
      // Set total pages for teachers based on API response
      setTotalPagesTea(response.totalPages || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setTeachers(TeacherData);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
  }, [currentPageStu, currentPageTea]); // Trigger fetch when page changes

  const handleApprove = async (userId: string) => {
    setLoading(true);

    try {
      const response = await confirmRegister(userId);

      if (response.status === 200) {
        toast.success("Phê duyệt thành công! Đang chuyển hướng...", {
          position: "bottom-right",
          autoClose: 3000,
        });

        fetchStudents();
        fetchTeachers();
      } else {
        toast.error("Đã xảy ra lỗi khi phê duyệt.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (userId: string) => {
    setLoading(true);

    try {
      const response = await rejectRegister(userId);

      if (response.status === 200) {
        toast.success("Từ chối thành công! Đang chuyển hướng...", {
          position: "bottom-right",
          autoClose: 3000,
        });

        fetchStudents();
        fetchTeachers();
      } else {
        toast.error("Đã xảy ra lỗi khi phê duyệt.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.log(error);
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
      <ToastContainer />
      <Button onClick={handleOpenModal} className="pl-6 pr-6">
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
                className={`py-2 px-4 text-lg font-semibold ${
                  activeTab === "students"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-700"
                }`}
                onClick={() => setActiveTab("students")}
              >
                Học viên
              </button>
              <button
                className={`py-2 px-4 text-lg font-semibold ${
                  activeTab === "teachers"
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
                      <th className="py-3 px-6 text-left text-gray-700">
                        Email
                      </th>
                      <th className="py-3 px-6 text-left text-gray-700">
                        Địa chỉ
                      </th>
                      <th className="py-3 px-6 text-left text-gray-700">
                        Ngày sinh
                      </th>
                      <th className="py-3 px-6 text-left text-gray-700">
                        Số điện thoại
                      </th>
                      <th className="py-3 px-6 text-left text-gray-700">
                        Giới tính
                      </th>

                      <th className="py-3 px-6 text-center text-gray-700">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                          <Loading />
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="py-4 px-6 border-b text-gray-600">
                            {student.name}
                          </td>
                          <td className="py-4 px-6 border-b text-gray-600">
                            {student.email}
                          </td>
                          <td className="py-4 px-6 border-b text-gray-600">
                            {student.address}
                          </td>
                          <td className="py-4 px-6 border-b text-gray-600">
                            {new Date(student.birthday).toLocaleDateString(
                              "vi-VN",
                            )}
                          </td>
                          <td className="py-4 px-6 border-b text-gray-600">
                            {student.phone}
                          </td>
                          <td className="py-4 px-6 border-b text-gray-600">
                            {student.gender}
                          </td>
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
                      ))
                    )}
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
                      <th className="py-3 px-6 text-left text-gray-700">
                        Email
                      </th>
                      <th className="py-3 px-6 text-left text-gray-700">
                        Địa chỉ
                      </th>
                      <th className="py-3 px-6 text-left text-gray-700">
                        Ngày sinh
                      </th>
                      <th className="py-3 px-6 text-left text-gray-700">
                        Số điện thoại
                      </th>
                      <th className="py-3 px-6 text-left text-gray-700">
                        Giới tính
                      </th>

                      <th className="py-3 px-6 text-center text-gray-700">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6 border-b text-gray-600">
                          {teacher.name}
                        </td>
                        <td className="py-4 px-6 border-b text-gray-600">
                          {teacher.email}
                        </td>
                        <td className="py-4 px-6 border-b text-gray-600">
                          {teacher.address}
                        </td>
                        <td className="py-4 px-6 border-b text-gray-600">
                          {new Date(teacher.birthday).toLocaleDateString(
                            "vi-VN",
                          )}
                        </td>
                        <td className="py-4 px-6 border-b text-gray-600">
                          {teacher.phone}
                        </td>
                        <td className="py-4 px-6 border-b text-gray-600">
                          {teacher.gender}
                        </td>
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
