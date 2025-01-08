import React from "react";
import { Button } from "./Button";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

interface PaginationAdminProps {
  currentPage: number;
  totalPages: number;
  handlePageClick: (page: number) => void;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}

const MAX_DISPLAY_PAGES = 3;

/**
 * Pagination component for admin pages
 *
 * @param currentPage Current page number (from 1)
 * @param totalPages Total number of pages
 * @param handlePageClick Function to handle page click
 * @param handlePreviousPage Function to handle previous page click
 * @param handleNextPage Function to handle next page click
 *
 * @returns Pagination component
 * */
const Pagination: React.FC<PaginationAdminProps> = ({
  currentPage,
  totalPages,
  handlePageClick,
  handlePreviousPage,
  handleNextPage,
}) => {
  if (totalPages === 0) return;

  const getPageNumbers = () => {
    const pages: number[] = [];
    const half = Math.floor(MAX_DISPLAY_PAGES / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage <= half) {
      end = Math.min(totalPages, MAX_DISPLAY_PAGES);
    } else if (currentPage + half >= totalPages) {
      start = Math.max(1, totalPages - MAX_DISPLAY_PAGES + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex justify-end mt-4 space-x-1">
      <Button
        variant="basic"
        onClick={handlePreviousPage}
        className="flex gap-1 items-center"
        disabled={currentPage === 1}
      >
        <FaAngleLeft />
        Trước
      </Button>

      {totalPages > MAX_DISPLAY_PAGES &&
        currentPage > Math.floor(MAX_DISPLAY_PAGES / 2) + 1 && (
          <Button variant="basic" onClick={() => handlePageClick(1)}>
            1
          </Button>
        )}

      {totalPages > MAX_DISPLAY_PAGES + 1 &&
        currentPage > Math.floor(MAX_DISPLAY_PAGES / 2) + 2 && (
          <span className="py-2 text-button-primary tracking-wider">...</span>
        )}

      {getPageNumbers().map((page) => (
        <Button
          key={page}
          variant="basic"
          onClick={() => handlePageClick(page)}
          className={`px-4 py-2 rounded-md font-semibold transition-all ${
            currentPage === page
              ? "bg-button-primary text-white hover:bg-button-primary"
              : ""
          }`}
        >
          {page}
        </Button>
      ))}

      {totalPages > MAX_DISPLAY_PAGES + 1 &&
        currentPage < totalPages - Math.floor(MAX_DISPLAY_PAGES / 2) - 1 && (
          <span className="py-2 text-button-primary tracking-wider">...</span>
        )}

      {totalPages > MAX_DISPLAY_PAGES &&
        currentPage < totalPages - Math.floor(MAX_DISPLAY_PAGES / 2) && (
          <Button variant="basic" onClick={() => handlePageClick(totalPages)}>
            {totalPages}
          </Button>
        )}

      <Button
        variant="basic"
        onClick={handleNextPage}
        className="flex gap-1 items-center"
        disabled={currentPage === totalPages}
      >
        Sau
        <FaAngleRight />
      </Button>
    </div>
  );
};

export default Pagination;
