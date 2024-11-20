"use client";

import { Button } from "@/app/ui/components/button";
import React, { useState, useEffect, useRef } from "react";
import {
  FaFilePdf,
  FaFileWord,
  FaEye,
  FaDownload,
  FaEllipsisV,
  FaSearch,
} from "react-icons/fa"; // Import new icons
import ReactDOM from "react-dom";
import { FaSpinner } from "react-icons/fa6";
import axios from "axios";

interface Params {
  id: string;
  subject: string;
  grade: string;
  gradeId: string;
  chapterId: string;
  chapter: string
}

const ChapterDocumentsPage = ({ params }: { params: Promise<Params> }) => {

  const [courseId, setcourseId] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [grade, setGrade] = useState<string | null>(null);
  const [gradeId, setGradeId] = useState<string | null>(null);
  const [chapterId, setChapterId] = useState<string | null>(null);
  const [chapter, setChapter] = useState<string | null>(null);

  const [documents, setDocuments] = useState<any[]>([]);

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const documentsPerPage = 2;

  const Loading = () => (
    <div className="flex items-center justify-center h-full">
      <FaSpinner className="animate-spin text-blue-500 h-8 w-8" />
      <span className="ml-4 text-lg text-blue-500">Đang tải dữ liệu...</span>
    </div>
  );

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
      if (resolvedParams?.chapterId) {
        setChapterId(decodeURIComponent(resolvedParams.chapterId));
      }
      if (resolvedParams?.chapter) {
        setChapter(decodeURIComponent(resolvedParams.chapter));
      }
    });
  }, [params]);

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      if (!courseId) return;

      setLoading(true);
      const authToken = localStorage.getItem("authToken");

      try {
        const response = await axios.get(
          "http://localhost:8080/api/material/all/get-materials",
          {
            params: {
              page: currentPage - 1,
              limit: documentsPerPage,
              chapterId
            },
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setDocuments(response.data?.content || []);
        setTotalPages(response.data?.totalPages || 0);

      } catch (error) {
        console.error("Failed to fetch grades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [courseId, currentPage, searchQuery]);

  const renderBreadcrumb = () => {
    if (!subject || !courseId || !grade || !gradeId || !chapter || !chapterId) return null;
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
            className="text-black hover:text-blue-600 hover:underline mr-2 ml-2">
            {decodeURIComponent(grade)}
          </a>
          {" > "}
          <a
            href={`/admin/course-documents/${courseId}/${subject}/${gradeId}/${grade}/${chapterId}/${chapter}`}
            className="text-blue-600 hover:underline ml-2">
            {decodeURIComponent(chapter)}
          </a>
        </span>
      </div>
    );
  };

  const handleSelectButtonClick = () => {
    if (isSelectMode) {
      // Reset selected documents and unselect all
      setSelectedDocuments([]);
      setAllSelected(false);
    }
    setIsSelectMode((prev) => !prev);
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(documents.map((doc) => doc.name));
    }
    setAllSelected(!allSelected);
  };

  const handleDocumentSelect = (docName: string) => {
    setSelectedDocuments((prevSelected) => {
      if (prevSelected.includes(docName)) {
        return prevSelected.filter((name) => name !== docName);
      } else {
        return [...prevSelected, docName];
      }
    });
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter
      ? getFileType(doc.title) === selectedFilter
      : true;
    return matchesSearch && matchesFilter;
  });

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

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

  const getFileType = (title: string) => {
    const extension = title.split('.').pop()?.toLowerCase(); // Lấy phần mở rộng của tệp
    if (extension === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(extension || '')) return 'docx';
    return 'other'; // Mặc định cho các loại tệp không xác định
  };


  if (!courseId || !subject || !grade || !gradeId || !chapter || !chapterId) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      {renderBreadcrumb()}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Tài liệu môn {subject} - {grade} - {chapter}
      </h1>

      {/* Search and Filter Section */}
      <div className="flex justify-between items-center space-x-4 mb-6">
        {/* Select Mode Button */}
        <div className="flex space-x-4">
          <Button onClick={handleSelectButtonClick} className="mr-4">
            {isSelectMode ? "Hủy bỏ" : "Chọn nhiều"}
          </Button>

          {/* Conditional buttons for Delete All and Move All */}
          {isSelectMode && (
            <div className="flex space-x-2">
              <Button
                onClick={handleSelectAll}
                className="bg-sky-400 text-white hover:bg-sky-500 transition">
                {allSelected ? "Hủy chọn" : "Chọn tất cả"}
              </Button>
              <Button className="bg-red-500 text-white hover:bg-red-600 transition">
                Xóa tất cả
              </Button>
              <Button className="bg-green-500 text-white hover:bg-green-600 transition">
                Di chuyển
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center w-full border-2 border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all">
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
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
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả tài liệu</option>
            <option value="pdf">Tài liệu PDF</option>
            <option value="docx">Tài liệu DOCX</option>
          </select>
        </div>
      </div>

      {/* Files List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {documents.map((doc, index) => (
          <div
            key={doc.id || index}
            className={`border p-4 rounded-lg shadow-md ${selectedDocuments.includes(doc.name) ? "bg-blue-100" : "bg-white"
              } hover:shadow-lg transition`}>
            <div className="flex items-center space-x-4 mb-3">
              {getFileType(doc.title) === "pdf" ? (
                <FaFilePdf className="text-red-500 text-3xl" />
              ) : (
                <FaFileWord className="text-blue-500 text-3xl" />
              )}
              <h3 className="font-semibold flex-1">{doc.title}</h3>

              <button
                className="text-gray-600"
                onClick={(e) => toggleDropdown(index, e)}>
                <FaEllipsisV />
              </button>
              {renderDropdown(index)}
              {isSelectMode && (
                <input
                  type="checkbox"
                  checked={selectedDocuments.includes(doc.name)}
                  onChange={() => handleDocumentSelect(doc.name)}
                  className="ml-4"
                />
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => window.open(doc.filePath, "_blank")}
                className="bg-blue-500 text-white hover:bg-blue-600 transition p-2">
                <FaEye className="text-white text-sm" />
              </Button>
              <Button
                onClick={() => window.open(doc.filePath, "_blank")}
                className="bg-green-500 text-white hover:bg-green-600 transition p-2">
                <FaDownload className="text-white text-sm" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end mt-6 mr-6 space-x-2">
        <Button
          onClick={handlePreviousPage}
          className={`px-4 py-2 rounded-md text-white font-semibold transition-all duration-200 ${currentPage === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
            }`}
          disabled={currentPage === 1}>
          Trước
        </Button>

        {/* Render page buttons */}
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1; // Correct the page number by adding 1
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 ${currentPage === page
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}>
              {page}
            </button>
          );
        })}

        <Button
          onClick={handleNextPage}
          className={`px-4 py-2 rounded-md text-white font-semibold transition-all duration-200 ${currentPage === totalPages
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

export default ChapterDocumentsPage;
