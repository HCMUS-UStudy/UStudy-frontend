"use client";

import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  FaEdit,
  FaTrashAlt,
  FaPaperclip,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import Button from "@/app/ui/components/button";
import Link from "next/link";
import axios from "axios";
import { FaSpinner } from "react-icons/fa6";

const CoursePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(
    new Set()
  );
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [isFocused, setIsFocused] = useState({ creator: false, subject: false, description: false });

  //Modals
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 4;

  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onCreateCourse = () => {
    setShowModal(true);
  };

  const [formData, setFormData] = useState({
    creator: "",
    subject: "",
    attachments: 0,
    description: "",
    notes: "",
    createdAt: new Date().toLocaleDateString(),
    status: "Active",
  });

  useEffect(() => {
    console.log("useEffect triggered. Current Page:", currentPage);
    const fetchCourses = async () => {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");

      try {
        const response = await axios.get(
          `http://localhost:8080/api/course/admin/get-list-course`,
          {
            params: {
              page: currentPage - 1, // Kiểm tra giá trị truyền vào API
              limit: coursesPerPage
            },
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        console.log("Fetched Users:", response.data); // Kiểm tra dữ liệu trả về
        setCourses(response.data?.content || []);
        setTotalPages(response.data?.totalPages || 0);
      } catch (err) {
        setError("Error fetching users.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage, searchQuery]);

  const Loading = () => (
    <div className="flex items-center justify-center h-full">
      <FaSpinner className="animate-spin text-blue-500 h-8 w-8" />
      <span className="ml-4 text-lg text-blue-500">Đang tải dữ liệu...</span>
    </div>
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveCourse = () => {
    setCourses((prevCourses) => [...prevCourses, formData]);
    setShowModal(false);
  };

  const filteredCourses = courses.filter((course) => {
    return (
      (selectedSubject ? course.name === selectedSubject : true) &&
      (searchQuery
        ? course.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true)
    );
  });

  const handleAttachmentClick = (subject: string) => {
    return `/admin/course-documents/${encodeURIComponent(subject)}`;
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Search query submitted:", searchQuery);
  };

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

  //Files
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourses((prevSelectedCourses) => {
      const updatedCourses = new Set(prevSelectedCourses);
      if (updatedCourses.has(courseId)) {
        updatedCourses.delete(courseId); // Bỏ chọn
      } else {
        updatedCourses.add(courseId); // Chọn
      }
      return updatedCourses;
    });
  };

  const handleSelectAll = () => {
    if (selectedCourses.size === filteredCourses.length) {
      setSelectedCourses(new Set()); // Bỏ chọn tất cả
    } else {
      const allCourseIds = filteredCourses.map((course) => course.name); // Sử dụng subject làm khóa ID
      setSelectedCourses(new Set(allCourseIds)); // Chọn tất cả
    }
  };

  const handleSelectButtonClick = () => {
    setIsSelectMode((prev) => {
      if (prev) {
        setSelectedCourses(new Set());
      }
      return !prev;
    });
  };

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight my-4">
        Quản lý tài liệu môn học
      </h2>
      <h2 className="text-xl tracking-tight mb-6">
        Tìm tất cả tài liệu của nền tảng tại đây
      </h2>

      <div className="flex items-center justify-between mt-8 mr-6">
        <h2 className="text-2xl font-bold">
          Tổng số môn học ({filteredCourses.length})
        </h2>
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center space-x-4 w-full md:w-96 lg:w-[30rem]">
          <div className="flex items-center w-full border-2 border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all">
            <input
              type="text"
              placeholder="Tìm kiếm môn học..."
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
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border-2 bg-sky-100 border-gray-300 rounded-full px-6 py-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all">
            <option value="">Tất cả môn học</option>
            <option value="math">Toán học</option>
            <option value="literature">Ngữ văn</option>
            <option value="english">Tiếng Anh</option>
            <option value="physics">Vật lý</option>
            <option value="chemistry">Hóa học</option>
            <option value="biology">Sinh học</option>
            <option value="history">Lịch sử</option>
            <option value="geography">Địa lý</option>
            <option value="civics">Giáo dục công dân</option>
            <option value="informatics">Tin học</option>
            <option value="technology">Công nghệ</option>
          </select>
        </form>
      </div>

      <div className="flex justify-between items-center space-x-4 mb-2 mt-6">
        {/* Select Mode Button */}
        <div className="flex">
          <Button onClick={handleSelectButtonClick} className="mr-4">
            {isSelectMode ? "Cancel" : "Select Courses"}
          </Button>

          {/* Conditional buttons for Delete All and Move All */}
          {isSelectMode && (
            <div className="flex">
              <Button className="bg-red-500 text-white mr-2">Delete All</Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <Button
            onClick={onCreateCourse}
            type="button"
            className="pl-6 pr-6 mr-6">
            Tạo môn học
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto mt-6 max-h-[400px] mr-6">
        <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              {isSelectMode && (
                <th className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCourses.size === courses.length}
                    onChange={handleSelectAll}
                    className="form-checkbox"
                  />
                </th>
              )}
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                Người tạo
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                Môn học
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                Tệp đính kèm
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                Mô tả
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                Ghi chú
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={isSelectMode ? 9 : 8} className="text-center py-4">
                  <Loading />
                </td>
              </tr>
            ) : (courses.map((course, index) => (
              <tr
                key={course.name}
                className={`transition-all duration-200 ${selectedCourses.has(course.name)
                  ? "bg-blue-100"
                  : "bg-white"
                  }`}>
                {isSelectMode && (
                  <td className="py-2 px-4">
                    <input
                      type="checkbox"
                      checked={selectedCourses.has(course.name)}
                      onChange={() => toggleCourseSelection(course.name)}
                      className="form-checkbox"
                    />
                  </td>
                )}
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {course.createdBy?.name || "Trống"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {course.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 mt-3 text-center">
                  <Link
                    href={handleAttachmentClick(course.name)}
                    className="flex justify-center items-center mx-auto"
                  >
                    {course.attachments || 0}
                    <FaPaperclip className="ml-2 mt-1 text-green-500" />
                  </Link>
                </td>

                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {course.description || "Trống"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {course.createdAt}
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-700">
                  <span
                    className={`px-2 py-1 rounded-full text-white ${course.status === "Active" ? "bg-green-500" : "bg-red-500"
                      }`}>
                    {course.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  {course.content || "Trống"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 flex justify-center items-center space-x-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <FaTrashAlt className="h-4 w-4" />
                  </button>
                </td>

              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {/* Show modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-[90%] max-w-lg">
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
              Tạo môn học mới
            </h2>

            <form className="space-y-6">
              {/* Người tạo */}
              <div className="relative mb-6">
                <input
                  type="text"
                  name="creator"
                  value={localStorage.getItem('creator') || ''}
                  readOnly
                  className="w-full p-3 pl-4 bg-transparent text-gray-800 border border-gray-300 rounded-xl cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Người tạo"
                />
                <label
                  htmlFor="creator"
                  className="absolute left-4 transition-all duration-200 -top-3.5 text-xs text-indigo-600 bg-white px-1">
                  Người tạo
                </label>
              </div>

              <div className="relative mb-6">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  onFocus={() => setIsFocused((prev) => ({ ...prev, subject: true }))}
                  onBlur={() => setIsFocused((prev) => ({ ...prev, subject: false }))}
                  className="w-full p-3 pl-4 bg-transparent text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <label
                  htmlFor="subject"
                  className={`absolute left-4 transition-all duration-200 ${formData.subject || isFocused.subject ? "-top-3.5 text-xs text-indigo-600 bg-white px-1" : "top-1/2 transform -translate-y-1/2 text-gray-400"}`}
                >
                  Tên môn
                </label>
              </div>


              {/* Mô tả */}
              <div className="relative mb-6">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  onFocus={() => setIsFocused((prev) => ({ ...prev, description: true }))}
                  onBlur={() => setIsFocused((prev) => ({ ...prev, description: false }))}
                  className="w-full p-3 pl-4 bg-transparent text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <label
                  htmlFor="description"
                  className={`absolute left-4 transition-all duration-200 ${formData.description || isFocused.description ? "-top-3.5 text-xs text-indigo-600 bg-white px-1" : "top-1/2 transform -translate-y-1/2 text-gray-400 pb-2"}`}
                >
                  Mô tả môn học
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-300 text-black rounded-full hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition duration-200">
                  Hủy
                </Button>
                <Button
                  onClick={handleSaveCourse}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200">
                  Lưu
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pagination Section */}
      <div className="flex justify-end mt-6 mr-6 space-x-2">
        <button
          onClick={handlePreviousPage}
          className={`px-4 py-2 rounded-md text-white font-semibold transition-all ${currentPage === 1
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
            }`}
          disabled={currentPage === 1}>
          Previous
        </button>

        {totalPages === 1 ? (
          <Button
            key={1}
            onClick={() => setCurrentPage(1)}
            className={`px-4 py-2 rounded-md font-semibold transition-all ${currentPage === 1
              ? "bg-blue-700 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
            1
          </Button>
        ) : (
          getPageNumbers().map((page) => (
            <Button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-md font-semibold transition-all ${currentPage === page
                ? "bg-blue-700 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}>
              {page}
            </Button>
          ))
        )}

        <Button
          onClick={handleNextPage}
          className={`px-4 py-2 rounded-md text-white font-semibold transition-all ${currentPage === totalPages
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

export default CoursePage;
