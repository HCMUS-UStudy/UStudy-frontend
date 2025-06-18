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
 * Pagination component
 *
 * @param currentPage Current page number (from 1)
 * @param totalPages Total number of pages
 * @param handlePageClick Function to handle page click
 * @param handlePreviousPage Function to handle previous page click
 * @param handleNextPage Function to handle next page click
 *
 * @example
 * ```tsx
 * <Pagination
 *  currentPage={currentPage}
 *  totalPages={totalPages}
 *  handlePageClick={handlePageClick}
 *  handlePreviousPage={handlePreviousPage}
 *  handleNextPage={handleNextPage}
 * />
 *
 * @returns Pagination component
 * */
const Pagination = ({
  currentPage,
  totalPages,
  handlePageClick,
  handlePreviousPage,
  handleNextPage,
}: PaginationAdminProps) => {
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
    <div className="flex justify-end mt-4 space-x-1 h-8 md:h-auto">
      <Button
        variant="basic"
        onClick={handlePreviousPage}
        className="text-xs px-3 sm:text-base sm:px-4 sm:py-2 flex md:hidden gap-1 items-center hover:bg-primary-lighter hover:text-primary-darkest disabled:hover:bg-transparent disabled:text-disabled-dark"
        disabled={currentPage === 1}
      >
        <FaAngleLeft />
      </Button>
      <Button
        variant="basic"
        onClick={handlePreviousPage}
        className="text-xs px-3 sm:text-base sm:px-4 sm:py-2 hidden md:flex gap-1 items-center hover:bg-primary-lighter hover:text-primary-darkest disabled:hover:bg-transparent disabled:text-disabled-dark"
        disabled={currentPage === 1}
      >
        <FaAngleLeft />
        Trước
      </Button>

      {totalPages > MAX_DISPLAY_PAGES &&
        currentPage > Math.floor(MAX_DISPLAY_PAGES / 2) + 1 && (
          <Button
            className="text-xs md:text-base px-3 md:px-4 md:py-2 hover:bg-primary-lighter hover:text-primary-darkest"
            variant="basic"
            onClick={() => handlePageClick(1)}
          >
            1
          </Button>
        )}

      {totalPages > MAX_DISPLAY_PAGES + 1 &&
        currentPage > Math.floor(MAX_DISPLAY_PAGES / 2) + 2 && (
          <span className="py-2 tracking-wider">...</span>
        )}

      {getPageNumbers().map((page) => (
        <Button
          key={page}
          variant="basic"
          onClick={() => handlePageClick(page)}
          className={`text-xs md:text-base px-3 md:px-4 md:py-2 rounded-md transition-all ${
            currentPage === page
              ? "bg-primary-dark text-white hover:bg-primary-darker shadow-md"
              : "hover:bg-primary-lighter hover:text-primary-darkest"
          }`}
        >
          {page}
        </Button>
      ))}

      {totalPages > MAX_DISPLAY_PAGES + 1 &&
        currentPage < totalPages - Math.floor(MAX_DISPLAY_PAGES / 2) - 1 && (
          <span className="py-2 tracking-wider text-primary-dark">...</span>
        )}

      {totalPages > MAX_DISPLAY_PAGES &&
        currentPage < totalPages - Math.floor(MAX_DISPLAY_PAGES / 2) && (
          <Button
            className="text-xs md:text-base px-3 md:px-4 md:py-2 hover:bg-primary-lighter hover:text-primary-darkest"
            variant="basic"
            onClick={() => handlePageClick(totalPages)}
          >
            {totalPages}
          </Button>
        )}

      <Button
        variant="basic"
        onClick={handleNextPage}
        className="text-xs md:text-base px-3 md:px-4 md:py-2 hidden md:flex gap-1 items-center hover:bg-primary-lighter hover:text-primary-darkest disabled:hover:bg-transparent disabled:text-disabled-dark"
        disabled={currentPage === totalPages}
      >
        Sau
        <FaAngleRight />
      </Button>
      <Button
        variant="basic"
        onClick={handleNextPage}
        className="text-xs md:text-base px-3 md:px-4 md:py-2 flex md:hidden gap-1 items-center hover:bg-primary-lighter hover:text-primary-darkest disabled:hover:bg-transparent disabled:text-disabled-dark"
        disabled={currentPage === totalPages}
      >
        <FaAngleRight />
      </Button>
    </div>
  );
};

export default Pagination;
