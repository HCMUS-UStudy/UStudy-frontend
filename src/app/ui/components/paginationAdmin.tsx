import React from "react";
import { Button } from "./common/Button";

// Define the expected prop types for PaginationAdmin component
interface PaginationAdminProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}

const PaginationAdmin: React.FC<PaginationAdminProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
  handlePreviousPage,
  handleNextPage,
}) => {
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPages = Math.min(3, totalPages);

    let start = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
    for (let i = start; i < start + maxPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex justify-end mt-6 space-x-2">
      <Button
        onClick={handlePreviousPage}
        className={`px-4 py-2 rounded-md text-white font-semibold transition-all ${
          currentPage === 1
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={currentPage === 1}
      >
        Trước
      </Button>

      {totalPages === 1 ? (
        <Button
          key={1}
          onClick={() => setCurrentPage(1)}
          className={`px-4 py-2 rounded-md font-semibold transition-all ${
            currentPage === 1
              ? "bg-blue-700 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          1
        </Button>
      ) : (
        getPageNumbers().map((page) => (
          <Button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-md font-semibold transition-all ${
              currentPage === page
                ? "bg-blue-700 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {page}
          </Button>
        ))
      )}

      <Button
        onClick={handleNextPage}
        className={`px-4 py-2 rounded-md text-white font-semibold transition-all ${
          currentPage === totalPages
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={currentPage === totalPages}
      >
        Sau
      </Button>
    </div>
  );
};

export default PaginationAdmin;
