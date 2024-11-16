"use client";

import { Button } from "@/app/ui/components/button";
import React, { useState, useEffect, useRef } from "react";
import {
  FaFilePdf,
  FaFileWord,
  FaEye,
  FaDownload,
  FaEllipsisV,
} from "react-icons/fa"; // Import new icons
import ReactDOM from "react-dom";

interface Params {
  subject: string;
  chapter: string;
}

const sampleDocuments = [
  {
    name: "Mathematics_Chapter1.pdf",
    type: "pdf",
    url: "/files/Mathematics_Chapter1.pdf",
  },
  {
    name: "Science_Chapter1.docx",
    type: "docx",
    url: "/files/Science_Chapter1.docx",
  },
  {
    name: "History_Chapter1.pdf",
    type: "pdf",
    url: "/files/History_Chapter1.pdf",
  },
  {
    name: "Literature_Chapter1.docx",
    type: "docx",
    url: "/files/Literature_Chapter1.docx",
  },
];

const SubjectDocumentsPage = ({ params }: { params: Promise<Params> }) => {
  const [subject, setSubject] = useState<string | null>(null);
  const [chapter, setChapter] = useState<string | null>(null);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const documentsPerPage = 2;

  useEffect(() => {
    params.then((resolvedParams) => {
      if (resolvedParams?.subject) {
        setSubject(decodeURIComponent(resolvedParams.subject));
      }
      if (resolvedParams?.chapter) {
        setChapter(decodeURIComponent(resolvedParams.chapter));
      }
    });
  }, [params]);

  const renderBreadcrumb = () => {
    if (!subject || !chapter) return null;
    return (
      <div className="mb-4 text-gray-700">
        <span className="text-sm">
          <a
            href="/admin/courses"
            className="text-black hover:text-blue-600 hover:underline mr-2">
            Quản lý môn học
          </a>
          {" > "}
          <a
            href={`/admin/course-documents/${subject}`}
            className="text-black hover:text-blue-600 hover:underline ml-2 mr-2">
            {subject}
          </a>
          {" > "}
          <a
            href={`/admin/course-documents/${subject}/${chapter}`}
            className="text-blue-600 hover:underline ml-2">
            {chapter}
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
      setSelectedDocuments(sampleDocuments.map((doc) => doc.name));
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

  const filteredDocuments = sampleDocuments.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter ? doc.type === selectedFilter : true;
    return matchesSearch && matchesFilter;
  });

  const totalDocuments = filteredDocuments.length;
  const totalPages = Math.ceil(totalDocuments / documentsPerPage);
  const startIndex = (currentPage - 1) * documentsPerPage;

  const paginatedDocuments = filteredDocuments.slice(
    startIndex,
    startIndex + documentsPerPage
  );

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

  if (!subject || !chapter) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      {renderBreadcrumb()}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Tài liệu môn {subject} - {chapter}
      </h1>

      {/* Search and Filter Section */}
      <div className="flex justify-between items-center space-x-4 mb-6">
        {/* Select Mode Button */}
        <div className="flex space-x-4">
          <Button onClick={handleSelectButtonClick} className="mr-4">
            {isSelectMode ? "Cancel" : "Select Files"}
          </Button>

          {/* Conditional buttons for Delete All and Move All */}
          {isSelectMode && (
            <div className="flex space-x-2">
              <Button
                onClick={handleSelectAll}
                className="bg-sky-400 text-white hover:bg-sky-500 transition">
                {allSelected ? "Unselect All" : "Select All"}
              </Button>
              <Button className="bg-red-500 text-white hover:bg-red-600 transition">
                Delete All
              </Button>
              <Button className="bg-green-500 text-white hover:bg-green-600 transition">
                Move All
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files"
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="">All Files</option>
            <option value="pdf">PDF Files</option>
            <option value="docx">DOCX Files</option>
          </select>
        </div>
      </div>

      {/* Files List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginatedDocuments.map((doc, index) => (
          <div
            key={doc.name}
            className={`border p-4 rounded-lg shadow-md ${
              selectedDocuments.includes(doc.name) ? "bg-blue-100" : "bg-white"
            } hover:shadow-lg transition`}>
            <div className="flex items-center space-x-4 mb-3">
              {doc.type === "pdf" ? (
                <FaFilePdf className="text-red-500 text-3xl" />
              ) : (
                <FaFileWord className="text-blue-500 text-3xl" />
              )}
              <h3 className="font-semibold flex-1">{doc.name}</h3>

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
                onClick={() => window.open(doc.url, "_blank")}
                className="bg-blue-500 text-white hover:bg-blue-600 transition p-2">
                <FaEye className="text-white text-sm" />
              </Button>
              <Button
                onClick={() => window.open(doc.url, "_blank")}
                className="bg-green-500 text-white hover:bg-green-600 transition p-2">
                <FaDownload className="text-white text-sm" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {/* Pagination Controls */}
      <div className="flex justify-end mt-6 mr-6 space-x-2">
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

        {/* Render page buttons */}
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1; // Correct the page number by adding 1
          return (
            <button
              key={page}
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
    </div>
  );
};

export default SubjectDocumentsPage;
