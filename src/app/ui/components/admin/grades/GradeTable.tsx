"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaEllipsisV } from "react-icons/fa";
import Pagination from "@/app/ui/components/_common/Pagination";
import { GradeItem } from "@/app/types/type";
import { getAllGrades } from "@/app/lib/services/grade";
import Loading from "../../_common/Loading";
import { FaFolder } from "react-icons/fa6";
import { Button } from "../../_common/Button";

interface GradeTableProps {
  searchQuery: string;
  gradeQuery: string;
}

const GradeTable: React.FC<GradeTableProps> = ({ searchQuery, gradeQuery }) => {
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const defaultGrade = gradeQuery === "All" ? "" : gradeQuery;

  const fetchGrades = async () => {
    setLoading(true);
    setError("");

    try {
      const searchParam =
        searchQuery && defaultGrade
          ? `${defaultGrade} ${searchQuery}`
          : defaultGrade || searchQuery || "";

      const response = await getAllGrades(searchParam, 5, currentPage - 1);

      const filteredData: GradeItem[] = response.content.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
      }));

      setGrades(filteredData);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.log(error);
      console.error("Error fetching grades:", err);
      setError("Error fetching grades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [currentPage, searchQuery, defaultGrade]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      dropdownRefs.current.forEach((ref) => {
        if (ref && !ref.contains(event.target as Node)) {
          setActiveDropdown(null);
        }
      });
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (id: string) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  return (
    <div className="overflow-x-auto max-h-[400px] animate-fadeIn">
      <div className="ml-4 mr-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="flex items-center justify-center col-span-full">
            <Loading text="Loading..." />
          </div>
        ) : (
          grades.map((grade) => (
            <div
              key={grade.id}
              className="relative flex items-center p-4 rounded-xl shadow-lg bg-white group transform transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:bg-primary-light"
            >
              <div className="flex items-center space-x-4">
                <div className="text-highlight-text">
                  <FaFolder className="text-6xl transition-transform duration-300 group-hover:rotate-12" />
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
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                variant="basic"
              >
                <FaEllipsisV />
              </Button>

              {/* Dropdown Menu */}
              <div
                ref={(el) => {
                  if (el) dropdownRefs.current.set(grade.id, el);
                  else dropdownRefs.current.delete(grade.id);
                }}
                className={`absolute right-2 top-10 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-[1000] transition-all duration-200 ${
                  activeDropdown === grade.id
                    ? "opacity-100 visible scale-100"
                    : "opacity-0 invisible scale-95"
                }`}
              >
                <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition">
                  Edit
                </button>
                <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition">
                  Delete
                </button>
              </div>
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

export default GradeTable;
