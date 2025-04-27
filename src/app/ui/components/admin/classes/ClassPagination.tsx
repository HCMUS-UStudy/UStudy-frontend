"use client";
import React from "react";
import Pagination from "../../_common/Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ClassPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handlePrevClick = () => {
    if (currentPage > 1) {
      currentPage--;
      const params = new URLSearchParams(searchParams);
      params.set("page", currentPage.toString());
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      const params = new URLSearchParams(searchParams);
      params.set("page", currentPage.toString());
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  const handlePageClick = (page: number) => {
    currentPage = page;
    const params = new URLSearchParams(searchParams);
    params.set("page", currentPage.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      handlePageClick={(page) => handlePageClick(page)}
      handlePreviousPage={handlePrevClick}
      handleNextPage={handleNextClick}
    />
  );
}
