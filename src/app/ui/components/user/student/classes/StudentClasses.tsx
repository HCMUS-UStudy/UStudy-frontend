"use client";

import React, { useMemo, useState } from "react";
import Pagination from "@/app/ui/components/_common/Pagination";
import ClassList from "./ClassList";
import { ClassUserItem } from "@/app/types/class";
import { Loading } from "../../../_common/loading";

interface StudentClassesProps {
  classes: ClassUserItem[];
  isLoading: boolean;
  itemsPerPage?: number;
}

const StudentClasses: React.FC<StudentClassesProps> = ({
  classes = [],
  isLoading = false,
  itemsPerPage = 5,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Calculate pagination
  const totalPages = Math.ceil(classes.length / itemsPerPage);
  const paginatedClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return classes.slice(startIndex, startIndex + itemsPerPage);
  }, [classes, currentPage, itemsPerPage]);

  // Format data to match expected structure
  const classData = useMemo(
    () => ({
      content: paginatedClasses,
      totalElements: classes.length,
      totalPages,
      pageNumber: currentPage - 1,
      pageSize: itemsPerPage,
      last: currentPage === totalPages,
    }),
    [paginatedClasses, classes.length, totalPages, currentPage, itemsPerPage],
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <ClassList
        status={isLoading ? "pending" : "success"}
        classes={classData}
        type="row"
      />
      {classes.length > 0 && (
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
      )}
    </div>
  );
};

export default StudentClasses;
