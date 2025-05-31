"use client";

import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Pagination from "@/app/ui/components/_common/Pagination";
import { getAllGrades } from "@/app/lib/services/grade";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../_common/Table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Tooltip from "../../_common/Tooltip";

interface GradeTableProps {
  searchQuery: string;
}

const GradeTable: React.FC<GradeTableProps> = ({ searchQuery }) => {
  // const [grades, setGrades] = useState<GradeItem[]>([]);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // const defaultGrade = gradeQuery === "All" ? "" : gradeQuery;

  const { data: grades, status } = useQuery({
    queryKey: ["Grades", currentPage - 1, searchQuery],
    queryFn: () => getAllGrades(searchQuery, 5, currentPage - 1),
    placeholderData: keepPreviousData,
  });

  // const fetchGrades = async () => {
  //   setLoading(true);
  //   setError("");

  //   try {
  //     const searchParam =
  //       searchQuery && defaultGrade
  //         ? `${defaultGrade} ${searchQuery}`
  //         : defaultGrade || searchQuery || "";

  //     const response = await getAllGrades(searchParam, 5, currentPage - 1);

  //     const filteredData: GradeItem[] = response.content.map((item) => ({
  //       id: item.id,
  //       name: item.name,
  //       description: item.description,
  //     }));

  //     setGrades(filteredData);
  //     setTotalPages(response.totalPages || 1);
  //   } catch (err) {
  //     console.error("Error fetching grades:", err);
  //     setError("Error fetching grades.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchGrades();
  // }, [currentPage, searchQuery, defaultGrade]);

  // const handleDetail = (id: string) => {
  //   console.log("View details for grade:", id);
  // };

  // const handleViewDetail = (id: string) => {
  //   console.log("Xem chi tiết cho khối:", id);
  //   // Điều hướng hoặc mở modal chi tiết tại đây
  // };

  return (
    <div>
      <Table>
        <TableHeader columns={["Tên khối", "Hành động"]} />
        <TableBody isLoading={status === "pending"}>
          {grades?.content
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((grade) => (
              <TableRow key={grade.id}>
                <TableCell className="w-1/2">{grade.name}</TableCell>
                <TableCell className="flex gap-2 justify-start">
                  <Tooltip text="Chỉnh sửa khối">
                    <button className="text-blue-600 hover:text-blue-800 transition-all">
                      <FaEdit className="h-5 w-5" />
                    </button>
                  </Tooltip>
                  <Tooltip text="Xóa khối">
                    <button className="text-red-600 hover:text-red-800 transition-all">
                      <FaTrashAlt className="h-5 w-5" />
                    </button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={grades?.totalPages || 1}
        handlePageClick={(page) => setCurrentPage(page)}
        handlePreviousPage={() =>
          setCurrentPage((prev) => Math.max(prev - 1, 1))
        }
        handleNextPage={() =>
          setCurrentPage((prev) => Math.min(prev + 1, grades?.totalPages || 1))
        }
      />
    </div>
  );
};

export default GradeTable;
