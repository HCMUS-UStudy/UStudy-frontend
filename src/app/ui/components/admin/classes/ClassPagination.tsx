"use client";
import React, { useState, useEffect } from "react";
import Pagination from "../../_common/Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ClassPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrevClick = () => {
    if (!mounted) return;
    if (currentPage > 1) {
      currentPage--;
      const params = new URLSearchParams(searchParams ?? "");
      params.set("page", currentPage.toString());
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  const handleNextClick = () => {
    if (!mounted) return;
    if (currentPage < totalPages) {
      currentPage++;
      const params = new URLSearchParams(searchParams ?? "");
      params.set("page", currentPage.toString());
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  const handlePageClick = (page: number) => {
    if (!mounted) return;
    currentPage = page;
    const params = new URLSearchParams(searchParams ?? "");
    params.set("page", currentPage.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  if (!mounted) {
    return null;
  }

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
