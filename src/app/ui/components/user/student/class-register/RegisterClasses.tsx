"use client";

import React, { useState } from "react";
import Pagination from "@/app/ui/components/_common/Pagination";
import { getListClassToRegister } from "@/app/lib/services/class";
import { useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import RegisterClassesGrid from "../classes/RegisterClassesGrid";
import { Button } from "../../../_common/Button";

interface ClassRegisterProps {
  searchQuery: string;
  classQuery?: string;
}

const RegisterClasses: React.FC<ClassRegisterProps> = ({ searchQuery }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const searchParams = useSearchParams();
  const gradeQuery = searchParams?.get("gradeQuery") || "";
  const courseQuery = searchParams?.get("courseQuery") || "";

  const { data: classes, status } = useQuery({
    queryKey: [
      "Classes",
      currentPage - 1,
      searchQuery,
      courseQuery,
      gradeQuery,
    ],
    queryFn: () =>
      getListClassToRegister(
        searchQuery,
        currentPage - 1,
        6,
        courseQuery,
        gradeQuery,
      ),
    placeholderData: keepPreviousData,
  });

  const handleRegisterClass = (id: string) => {
    console.log(id);
  };

  return (
    <div>
      <RegisterClassesGrid
        status={status}
        classes={classes}
        renderAction={(item) => (
          <Button onClick={() => handleRegisterClass(item.id)}>
            Đăng ký học
          </Button>
        )}
      />
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

export default RegisterClasses;
