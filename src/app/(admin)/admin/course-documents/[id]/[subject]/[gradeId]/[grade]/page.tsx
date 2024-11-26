"use client";

import { Button } from "@/app/ui/components/button";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { FaFolder, FaEllipsisV, FaSearch } from "react-icons/fa";
import ReactDOM from "react-dom";
import axios from "axios";
import { FaSpinner } from "react-icons/fa6";

interface Params {
  id: string;
  subject: string;
  grade: string;
  gradeId: string
}

const GradeDocumentsPage = ({ params }: { params: Promise<Params> }) => {
  const [courseId, setcourseId] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [grade, setGrade] = useState<string | null>(null);
  const [gradeId, setGradeId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [selectedChapter, setSelectedChapter] = useState<Set<number>>(
    new Set()
  );
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [allSelected, setAllSelected] = useState(false); // Track select all state
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const chaptersPerPage = 5;

  const [chapters, setChapters] = useState<any[]>([]);

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
          "http://localhost:8080/api/chapter/clerk/get-list-chapter",
          {
            params: {
              page: currentPage - 1,
              limit: chaptersPerPage,
              courseId,
              gradeId
            },
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setChapters(response.data?.content || []);
        setTotalPages(response.data?.totalPages || 0);

      } catch (error) {
        console.error("Failed to fetch grades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [courseId, currentPage, searchQuery]);


  // Safely access folders by subject using type assertion
  const filteredChapters = chapters.filter((chapter) => {
    return (
      (selectedChapter ? chapter.name === selectedChapter : true) &&
      (searchQuery
        ? chapter.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true)
    );
  });

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
      if (resolvedParams?.gradeId) {
        setGradeId(decodeURIComponent(resolvedParams.gradeId));
      }
      if (resolvedParams?.grade) {
        setGrade(decodeURIComponent(resolvedParams.grade));
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
    if (!subject || !courseId || !grade || !gradeId) return null; // Wait until the subject is set
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
            className="text-black hover:text-blue-600 hover:underline mr-2 ml-2">
            {decodeURIComponent(subject)}
          </a>
          {" > "}
          <a
            href={`/admin/course-documents/${courseId}/${subject}/${gradeId}/${grade}`}
            className="text-blue-600 hover:underline ml-2">
            {decodeURIComponent(grade)}
          </a>
        </span>
      </div>
    );
  };

  const handleSelectChapter = (id: number) => {
    setSelectedChapter((prevSelectedChapters) => {
      const newSelectedChapters = new Set(prevSelectedChapters);
      if (newSelectedChapters.has(id)) {
        newSelectedChapters.delete(id);
      } else {
        newSelectedChapters.add(id);
      }
      return newSelectedChapters;
    });
  };

  const handleSelectButtonClick = () => {
    setIsSelectMode((prev) => {
      if (prev) {
        setSelectedChapter(new Set());
      }
      return !prev;
    });
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedChapter(new Set());
    } else {
      setSelectedChapter(new Set(chapters.map((chapter) => chapter.id))); // Select all folders on all pages
    }
    setAllSelected(!allSelected);
  };

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (!subject) return <Loading />; // Show loading state while waiting for the subject

  const handleAttachmentClick = (id: string, subject: string, gradeId: string, grade: string, chapterId: string, chapter: string) => {
    return `/admin/course-documents/${encodeURIComponent(id)}/${encodeURIComponent(subject)}/${encodeURIComponent(gradeId)}/${encodeURIComponent(grade)}/${encodeURIComponent(chapterId)}/${encodeURIComponent(chapter)}`;
  };

  if (!courseId || !subject || !grade || !gradeId) {
    return <Loading />;
  }

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
    <div className="p-6 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      {renderBreadcrumb()}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Tài liệu môn {decodeURIComponent(subject)} - {decodeURIComponent(grade)}
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
            <input
              type="text"
              placeholder="Tìm kiếm theo chương..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-l-full focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition ease-in-out"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-r-full bg-white text-black hover:bg-slate-100 focus:ring-2 focus:ring-blue-300">
              <FaSearch className="h-5 w-5" />
            </button>
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md">
            <option value="">Tất cả chương</option>
            <option value="Chapter">Chương 1</option>
            <option value="Exercises">Chương 2</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mb-4">
        <Button
          //onClick={onCreateCourse}
          type="button"
          className="pl-6 pr-6 mr-6">
          Tạo chương
        </Button>
      </div>

      {/* Folders Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 px-6">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="relative flex items-center p-4 rounded-xl shadow-lg bg-white group transform transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:bg-blue-50">

            {/* Folder Icon and Name */}
            <div className="flex items-center space-x-4">
              {/* Folder Icon */}
              <div className="text-blue-500">
                <FaFolder className="text-6xl" />
              </div>

              {/* Folder Name */}
              <div className="flex flex-col justify-center h-full">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {chapter.name}
                </h2>
                <p className="text-gray-600 text-sm">{chapter.description}</p>
              </div>
            </div>

            {/* Dropdown Button */}
            <button
              onClick={(e) => toggleDropdown(chapter.id, e)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              <FaEllipsisV />
            </button>

            {renderDropdown(chapter.id)}

            {/* Select Checkbox (only shown in select mode) */}
            {isSelectMode && (
              <div className="absolute top-2 right-2">
                <input
                  type="checkbox"
                  checked={selectedChapter.has(chapter.id)}
                  onChange={() => handleSelectChapter(chapter.id)}
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
                    gradeId as string,
                    grade as string,
                    chapter.id,
                    chapter.name
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
        <button
          onClick={handlePreviousPage}
          className={`px-4 py-2 rounded-md text-white font-semibold transition-all ${currentPage === 1
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
            }`}
          disabled={currentPage === 1}>
          Trước
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
          Sau
        </Button>
      </div>
    </div>
  );
};

export default GradeDocumentsPage;
