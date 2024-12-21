"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaEllipsisV, FaFolder, FaSpinner } from "react-icons/fa";
import { Button } from "../Button";
import PaginationAdmin from "../paginationAdmin";
import { ChapterItem } from "@/app/types/type";
import { getChapterByCourse_GradeId } from "@/app/lib/api";

interface ChapterGridProps {
  courseId: string;
  subject: string;
  gradeId: string;
  grade: string;
  searchQuery: string;
}

const ChapterGrid: React.FC<ChapterGridProps> = ({
  searchQuery,
  courseId,
  subject,
  gradeId,
  grade,
}) => {
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const fetchChapters = async () => {
    console.log(courseId);
    console.log(gradeId);
    let filteredData: ChapterItem[] = [];
    setLoading(true);

    try {
      const response = await getChapterByCourse_GradeId(
        searchQuery,
        currentPage - 1,
        courseId,
        gradeId,
      );

      filteredData = response.content.map((item: ChapterItem) => ({
        id: item.id,
        name: item.name,
        description: item.description,
      }));

      setTotalPages(response.data?.totalPages || 0);
    } catch (error) {
      console.error("Failed to fetch chapters:", error);
    } finally {
      setChapters(filteredData);
      setLoading(false);
    }
  };

  const toggleDropdown = (id: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setActiveDropdown(activeDropdown === id ? "" : id);
  };

  const renderDropdown = (id: string) => {
    return (
      activeDropdown === id && (
        <div
          ref={dropdownRef}
          className="absolute w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
        >
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
      )
    );
  };

  const handleAttachmentClick = (
    id: string,
    subject: string,
    gradeId: string,
    grade: string,
    chapterId: string,
    chapter: string,
  ) => {
    return `/admin/courses/course-documents/${encodeURIComponent(id)}/${encodeURIComponent(subject)}/${encodeURIComponent(gradeId)}/${encodeURIComponent(grade)}/${encodeURIComponent(chapterId)}/${encodeURIComponent(chapter)}`;
  };

  useEffect(() => {
    fetchChapters();
  }, [courseId, gradeId, currentPage, searchQuery]);

  return (
    <div>
      {/* Chapters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="flex items-center justify-center col-span-full">
            <FaSpinner className="animate-spin text-blue-500 h-8 w-8" />
            <span className="ml-4 text-lg text-blue-500">Loading...</span>
          </div>
        ) : (
          chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="relative flex items-center p-4 rounded-xl shadow-lg bg-white group transform transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:bg-blue-50"
            >
              {/* Folder Icon and Name */}
              <div className="flex items-center space-x-4">
                <div className="text-blue-500">
                  <FaFolder className="text-6xl" />
                </div>
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
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <FaEllipsisV />
              </button>

              {renderDropdown(chapter.id)}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gray-300 bg-opacity-80 flex items-center justify-center rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Button
                  className="text-white font-semibold py-2 px-4 rounded-md shadow-md transition"
                  onClick={() =>
                    (window.location.href = handleAttachmentClick(
                      courseId,
                      subject,
                      gradeId,
                      grade,
                      chapter.id.toString(),
                      chapter.name,
                    ))
                  }
                >
                  Xem thư mục
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <PaginationAdmin
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        handlePreviousPage={() =>
          setCurrentPage((prev) => Math.max(prev - 1, 1))
        }
        handleNextPage={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
      />
    </div>
  );
};

export default ChapterGrid;
