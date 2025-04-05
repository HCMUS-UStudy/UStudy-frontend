"use client";

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Pagination from "@/app/ui/components/_common/Pagination";
import { GradeItem } from "@/app/types";
import { getAllGrades } from "@/app/lib/services/grade";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../_common/Table";

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
      console.error("Error fetching grades:", err);
      setError("Error fetching grades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [currentPage, searchQuery, defaultGrade]);

  const handleDetail = (id: string) => {
    console.log("View details for grade:", id);
  };

  const handleViewDetail = (id: string) => {
    console.log("Xem chi tiết cho khối:", id);
    // Điều hướng hoặc mở modal chi tiết tại đây
  };

  return (
    <div>
      <Table>
        <TableHeader
          columns={["Tên khối", "Hành động", ""]}
          className="bg-gray-100 text-lg"
        />
        <TableBody isLoading={loading}>
          {error ? (
            <TableRow>
              <TableCell colSpan={5} className="text-red-500">
                {error}
              </TableCell>
            </TableRow>
          ) : grades.length > 0 ? (
            grades.map((grade) => (
              <TableRow
                key={grade.id}
                className="hover:bg-primary-lighter cursor-pointer"
              >
                <TableCell
                  onClick={() => handleDetail(grade.id)}
                  className="w-1/2 text-lg"
                >
                  {grade.name}
                </TableCell>
                <TableCell className="flex justify-center items-center space-x-3 text-center">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <FaTrashAlt className="h-4 w-4" />
                  </button>
                </TableCell>
                <TableCell className="w-1/4 text-center">
                  <button
                    className="px-4 py-1 text-white bg-primary rounded-md hover:bg-hover-primary shadow-sm transition-all duration-200"
                    onClick={() => handleViewDetail(grade.id)}
                  >
                    Xem chi tiết
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>Không có dữ liệu.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

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
