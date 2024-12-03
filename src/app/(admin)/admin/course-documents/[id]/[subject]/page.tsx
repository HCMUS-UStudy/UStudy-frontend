"use client";

import { Button } from "@/app/ui/components/button";
import React, { useState, useEffect, useRef } from "react";
import { FaFolder, FaEllipsisV, FaSearch } from "react-icons/fa";
import ReactDOM from "react-dom";
import axios from "axios";
import { FaSpinner } from "react-icons/fa6";
import { Input } from "@/app/ui/components/input";

interface Params {
  id: string;
  subject: string;
}

const CourseDocumentsPage = ({ params }: { params: Promise<Params> }) => {
  const [courseId, setcourseId] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [selectedGrades, setSelectedGrades] = useState<Set<number>>(
    new Set()
  );
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [allSelected, setAllSelected] = useState(false); // Track select all state
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const gradesPerPage = 5;

  const [grades, setGrades] = useState<any[]>([]);

  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const Loading = () => (
    <div className="flex items-center justify-center h-full">
      <FaSpinner className="animate-spin text-blue-500 h-8 w-8" />
      <span className="ml-4 text-lg text-blue-500">Đang tải dữ liệu...</span>
    </div>
  );

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      if (!courseId) return;

      setLoading(true);
      const authToken = localStorage.getItem("authToken");

      try {
        const response = await axios.get(
          "http://localhost:8080/api/grade/admin/get-grades-by-course",
          {
            params: {
              page: currentPage - 1,
              limit: gradesPerPage,
              courseId,
            },
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setGrades(response.data?.content || []);
        setTotalPages(response.data?.totalPages || 0);

      } catch (error) {
        console.error("Failed to fetch grades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [courseId, currentPage, searchQuery]);


  const toggleDropdown = (id: number, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setActiveDropdown(activeDropdown === id ? null : id);
  };


  useEffect(() => {
    // Close dropdown if clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    params.then((resolvedParams) => {
      if (resolvedParams?.id) {
        setcourseId(decodeURIComponent(resolvedParams.id));
      }
      if (resolvedParams?.subject) {
        setSubject(decodeURIComponent(resolvedParams.subject));
      }
    });
  }, [params]);

  const renderDropdown = (id: number) => {
    return ReactDOM.createPortal(
      activeDropdown === id && (
        <div
          ref={dropdownRef} // Attach the ref to the dropdown element
          className="absolute w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}>
          <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
            Cut
          </button>
          <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
            Copy
          </button>
          <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
            Move to
          </button>
          <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
            Rename
          </button>
          <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
            Delete
          </button>
        </div>
      ),
      document.body
    );
  };

  const renderBreadcrumb = () => {
    if (!subject || !courseId) return null; // Wait until the subject is set
    return (
      <div className="mb-4 text-gray-700">
        <span className="text-sm">
          <a
            href="/admin/courses"
            className=" text-black hover:text-blue-600 hover:underline mr-2">
            Quản lý môn học
          </a>
          {" > "}
          <a
            href={`/admin/course-documents/${courseId}/${subject}`}
            className="text-blue-600 hover:underline ml-2">
            {decodeURIComponent(subject)}
          </a>
        </span>
      </div>
    );
  };

  const handleSelectGrade = (id: number) => {
    setSelectedGrades((prevSelectedGrades) => {
      const newSelectedGrades = new Set(prevSelectedGrades);
      if (newSelectedGrades.has(id)) {
        newSelectedGrades.delete(id);
      } else {
        newSelectedGrades.add(id);
      }
      return newSelectedGrades;
    });
  };

  const handleSelectButtonClick = () => {
    setIsSelectMode((prev) => {
      if (prev) {
        setSelectedGrades(new Set());
      }
      return !prev;
    });
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedGrades(new Set());
    } else {
      setSelectedGrades(new Set(grades.map((grade) => grade.id))); // Select all folders on all pages
    }
    setAllSelected(!allSelected);
  };

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (!subject) return <Loading />; // Show loading state while waiting for the subject

  const handleAttachmentClick = (id: string, subject: string, gradeId: string, grade: string) => {
    return `/admin/course-documents/${encodeURIComponent(id)}/${encodeURIComponent(subject)}/${encodeURIComponent(gradeId)}/${encodeURIComponent(grade)}`;
  };

  if (!courseId || !subject) {
    return <Loading />;
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxPages = Math.min(3, totalPages);

    const start = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
    for (let i = start; i < start + maxPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      {renderBreadcrumb()}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Tài liệu môn {decodeURIComponent(subject)}
      </h1>

      {/* Search and Filter Section */}
      <div className="flex justify-between items-center space-x-4 mb-6 mr-6">
        {/* Select Mode Button */}
        <div className="flex">
          <Button onClick={handleSelectButtonClick} className="mr-4">
            {isSelectMode ? "Hủy bỏ" : "Chọn nhiều"}
          </Button>

          {/* Conditional buttons for Delete All and Move All */}
          {isSelectMode && (
            <div className="flex">
              <Button
                onClick={handleSelectAll}
                className="bg-sky-400 text-white mr-2">
                {allSelected ? "Hủy chọn" : "Chọn tất cả"}
              </Button>
              <Button className="bg-red-500 text-white mr-2">Xóa tất cả</Button>
              <Button className="bg-green-500 text-white">Di chuyển</Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center w-full border-2 border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all">
            <Input
              type="text"
              placeholder="Tìm kiếm khối lớp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-l-full focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition ease-in-out"
            />
            <Button
              type="submit"
              className="px-4 py-2 rounded-r-full bg-white text-black hover:bg-slate-100 focus:ring-2 focus:ring-blue-300">
              <FaSearch className="h-5 w-5" />
            </Button>
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md">
            <option value="">Tất cả khối học</option>
            <option value="Chapter">Khối 1</option>
            <option value="Exercises">Khối 2</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mb-4">
        <Button
          //onClick={onCreateCourse}
          type="button"
          className="pl-6 pr-6 mr-6">
          Tạo khối học
        </Button>
      </div>

      {/* Folders Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 px-6">
        {grades.map((grade) => (
          <div
            key={grade.id}
            className="relative flex items-center p-4 rounded-xl shadow-lg bg-white group transform transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:bg-blue-50">

            {/* Folder Icon and Name */}
            <div className="flex items-center space-x-4">
              {/* Folder Icon */}
              <div className="text-blue-500">
                <FaFolder className="text-6xl" />
              </div>

              {/* Folder Name */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {grade.name}
                </h2>
              </div>
            </div>

            {/* Dropdown Button */}
            <Button
              onClick={(e) => toggleDropdown(grade.id, e)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              <FaEllipsisV />
            </Button>

            {renderDropdown(grade.id)}

            {/* Select Checkbox (only shown in select mode) */}
            {isSelectMode && (
              <div className="absolute top-2 right-2">
                <Input
                  type="checkbox"
                  checked={selectedGrades.has(grade.id)}
                  onChange={() => handleSelectGrade(grade.id)}
                  className="h-5 w-5"
                />
              </div>
            )}

            {/* Hover Overlay */}
            {!isSelectMode && (
              <div className="absolute inset-0 bg-gray-300 bg-opacity-80 flex items-center justify-center rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Button
                  className="text-white font-semibold py-2 px-4 rounded-md shadow-md transition"
                  onClick={() =>
                  (window.location.href = handleAttachmentClick(
                    courseId as string,
                    subject as string,
                    grade.id,
                    grade.name
                  ))
                  }>
                  Xem thư mục
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>


      {/* Pagination Controls */}
      <div className="flex justify-end mt-6 mr-6 space-x-2">
        <Button
          onClick={handlePreviousPage}
          className={`px-4 py-2 rounded-md text-white font-semibold transition-all ${currentPage === 1
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
            }`}
          disabled={currentPage === 1}>
          Trước
        </Button>

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
          Sau
        </Button>
      </div>
    </div>
  );
};

export default CourseDocumentsPage;
