"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaEllipsisV, FaFolder } from "react-icons/fa";
import { Button } from "@/app/ui/components/_common/Button";
import Pagination from "@/app/ui/components/_common/Pagination";
import { CourseItem, GradeItem } from "@/app/types/type";
import { useRouter } from "next/navigation";
import { useCourseAdminContext } from "@/app/context/CourseAdminContext";
import { getGradesByCourseId } from "@/app/lib/services/grade";
import Loading from "@/app/ui/components/_common/Loading";
import SearchField from "../../_common/text-field/SearchField";
import { Select, SelectItem } from "../../_common/Select";

interface GradeGridProps {
  courseId: string;
}

const GradeGrid: React.FC<GradeGridProps> = ({
  courseId,
  // subject,
}) => {
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSelectMode] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { setGradeName } = useCourseAdminContext();

  // const { id } = useParams<{ id: string }>();

  const router = useRouter();

  const fetchGrades = async () => {
    let filteredData: GradeItem[] = [];
    setLoading(true);
    try {
      const response = await getGradesByCourseId(
        searchQuery,
        currentPage - 1,
        courseId,
      );

      filteredData = response.content.map((item: CourseItem) => ({
        id: item.id,
        name: item.name,
      }));

      //setGrades(response.data?.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error("Failed to fetch grades:", error);
    } finally {
      setGrades(filteredData);
      setLoading(false);
    }
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? "" : id);
  };

  // const handleSelectGrade = (id: string) => {
  //     setSelectedGrades((prev) => {
  //         const updated = new Set(prev);
  //         updated.has(id) ? updated.delete(id) : updated.add(id);
  //         return updated;
  //     });
  // };

  const renderDropdown = (id: string) => {
    return (
      activeDropdown === id && (
        <div
          ref={dropdownRef}
          className="absolute w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50"
        >
          <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
            Cut
          </button>
          <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
            Copy
          </button>
          <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
            Delete
          </button>
        </div>
      )
    );
  };

  useEffect(() => {
    fetchGrades();
  }, [courseId, currentPage, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Update search query
    setCurrentPage(1); // Reset to the first page when search query changes
  };

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="flex justify-end items-center space-x-4 mb-6">
        <SearchField
          className="w-[200px]"
          placeholder="Tìm theo tên khối học..."
          value={searchQuery} // Bind the value to searchQuery state
          onChange={handleSearchChange} // Handle input changes
        />
        <Select className="w-[200px]" defaultLabel="Tất cả khối học">
          <div className="max-h-[160px] overflow-auto">
            <SelectItem value="">Tất cả khối học</SelectItem>
            {Array.from({ length: 12 }, (_, index) => (
              <SelectItem key={index + 1} value={`Grade${index + 1}`}>
                Khối {index + 1}
              </SelectItem>
            ))}
          </div>
        </Select>
      </div>

      <div className="flex justify-end space-x-4 mb-4">
        <Button type="button" className="pl-6 pr-6">
          Tạo khối học
        </Button>
      </div>

      {/* Grades Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {loading ? (
          /*<div className="flex items-center justify-center col-span-full">
            <FaSpinner className="animate-spin text-blue-500 h-8 w-8" />
            <span className="ml-4 text-lg text-blue-500">Loading...</span>
          </div>*/
          <div className="flex items-center justify-center col-span-full">
            <Loading text="Loading..." />
          </div>
        ) : (
          grades.map((grade) => (
            <div
              key={grade.id}
              className="relative flex items-center p-4 rounded-xl shadow-lg bg-white group transform transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:bg-blue-50"
            >
              {/* Folder Icon */}
              <div className="flex items-center space-x-4">
                <div className="text-blue-500">
                  <FaFolder className="text-6xl" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {grade.name}
                  </h2>
                </div>
              </div>

              {/* Dropdown Button */}
              <Button
                onClick={() => toggleDropdown(grade.id)}
                className="absolute top-2 right-2 text-gray-400"
                variant="basic"
              >
                <FaEllipsisV />
              </Button>
              {renderDropdown(grade.id)}

              {/* Hover Overlay */}
              {!isSelectMode && (
                <div className="absolute inset-0 bg-gray-400 bg-opacity-80 flex items-center justify-center rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <Button
                    className="hover:bg-transparent text-white"
                    variant="basic"
                    onClick={() => {
                      // (window.location.href = `/admin/courses/courses-documents/${encodeURIComponent(courseId)}/${encodeURIComponent(subject)}/${encodeURIComponent(grade.id)}/${encodeURIComponent(grade.name)}`)
                      router.push(
                        `/admin/courses/course-documents/${courseId}/${grade.id}`,
                      );
                      setGradeName(grade.name);
                    }}
                  >
                    Xem thư mục
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageClick={(page) => setCurrentPage(page)}
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

export default GradeGrid;
