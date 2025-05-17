"use client";

import React, { useState } from "react";
import Pagination from "@/app/ui/components/_common/Pagination";
import { getAllStudentClasses } from "@/app/lib/services/class";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ClassList from "./ClassList";

interface StudentClassesProps {
  searchQuery: string;
  classQuery?: string;
}

const StudentClasses: React.FC<StudentClassesProps> = ({ searchQuery }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: classes, status } = useQuery({
    queryKey: ["Classes", currentPage - 1, searchQuery],
    queryFn: () => getAllStudentClasses(currentPage - 1, 5, searchQuery),
    placeholderData: keepPreviousData,
  });

  return (
    <div>
      <ClassList status={status} classes={classes} />
      {classes?.totalElements !== 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={classes?.totalPages || 1}
          handlePageClick={(page) => setCurrentPage(page)}
          handlePreviousPage={() =>
            setCurrentPage((prev) => Math.max(prev - 1, 1))
          }
          handleNextPage={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, classes?.totalPages || 1),
            )
          }
        />
      )}
    </div>
  );
};

export default StudentClasses;
