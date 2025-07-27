"use client";

import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
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
import EditGrade from "./EditGrade";
import { GradeItem } from "@/app/types";

interface GradeTableProps {
  searchQuery: string;
}

const GradeTable: React.FC<GradeTableProps> = ({ searchQuery }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: grades, status } = useQuery({
    queryKey: ["Grades", currentPage - 1, searchQuery],
    queryFn: () => getAllGrades(searchQuery, 5, currentPage - 1),
    placeholderData: keepPreviousData,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [grade, setGrade] = useState<GradeItem>();
  return (
    <div>
      <Table>
        <TableHeader columns={["Tên khối", "Hành động"]} />
        <TableBody isLoading={status === "pending"}>
          {grades?.content.slice().map((grade) => (
            <TableRow key={grade.id}>
              <TableCell className="w-1/2">{grade.name}</TableCell>
              <TableCell className="flex gap-2 justify-start">
                <Tooltip text="Chỉnh sửa khối">
                  <button
                    onClick={() => {
                      setIsOpen(true);
                      setGrade(grade);
                    }}
                    className="text-blue-600 hover:text-blue-800 transition-all"
                  >
                    <FaEdit className="size-4 md:size-5" />
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
      <EditGrade
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        grade={grade}
      />
    </div>
  );
};

export default GradeTable;
