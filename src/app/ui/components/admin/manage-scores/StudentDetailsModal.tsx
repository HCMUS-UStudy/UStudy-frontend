"use client";

import React, { useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { StudentDetailsData } from "@/app/types/academicResult";
import Pagination from "@/app/ui/components/_common/Pagination";

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentDetails: StudentDetailsData | null;
}

const DETAILS_PAGE_SIZE = 5;

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  isOpen,
  onClose,
  studentDetails,
}) => {
  const [detailsSortBy, setDetailsSortBy] = useState<string>("subject");
  const [detailsSortOrder, setDetailsSortOrder] = useState<"asc" | "desc">(
    "asc",
  );
  const [currentDetailsPage, setCurrentDetailsPage] = useState(1);

  if (!isOpen || !studentDetails) return null;

  // Handle details modal sorting
  const handleDetailsSort = (column: string) => {
    if (detailsSortBy === column) {
      setDetailsSortOrder(detailsSortOrder === "asc" ? "desc" : "asc");
    } else {
      setDetailsSortBy(column);
      setDetailsSortOrder("asc");
    }
    // Reset to first page when sorting
    setCurrentDetailsPage(1);
  };

  // Render sort icon for details modal
  const renderDetailsSortIcon = (key: string) => {
    if (detailsSortBy !== key)
      return <ArrowUpDown className="inline ml-1 w-4 h-4 opacity-40" />;
    return detailsSortOrder === "asc" ? (
      <ArrowUp className="inline ml-1 w-4 h-4 text-primary-dark" />
    ) : (
      <ArrowDown className="inline ml-1 w-4 h-4 text-primary-dark" />
    );
  };

  // Sort details data
  const sortedDetails = [...studentDetails.details].sort((a, b) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
    let aValue: any = a[detailsSortBy as keyof typeof a];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
    let bValue: any = b[detailsSortBy as keyof typeof b];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return detailsSortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (typeof aValue === "number" && typeof bValue === "number") {
      return detailsSortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  // Pagination for details
  const totalDetailsPages =
    Math.ceil(sortedDetails.length / DETAILS_PAGE_SIZE) || 1;
  const paginatedDetails = sortedDetails.slice(
    (currentDetailsPage - 1) * DETAILS_PAGE_SIZE,
    currentDetailsPage * DETAILS_PAGE_SIZE,
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-primary-light p-6 text-black">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Chi tiết điểm học sinh</h2>
              <p className="text-gray-700 mt-1">
                {studentDetails.name} ({studentDetails.genId})
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th
                    className="pl-6 py-4 text-sm font-semibold text-slate-700 text-left cursor-pointer select-none hover:bg-slate-200 transition-colors"
                    onClick={() => handleDetailsSort("subject")}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Môn học</span>
                      {renderDetailsSortIcon("subject")}
                    </div>
                  </th>
                  <th
                    className="pl-6 py-4 text-sm font-semibold text-slate-700 text-left cursor-pointer select-none hover:bg-slate-200 transition-colors"
                    onClick={() => handleDetailsSort("class")}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Lớp</span>
                      {renderDetailsSortIcon("class")}
                    </div>
                  </th>
                  <th
                    className="pl-6 py-4 text-sm font-semibold text-slate-700 text-center cursor-pointer select-none hover:bg-slate-200 transition-colors"
                    onClick={() => handleDetailsSort("testScore")}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>Điểm kiểm tra</span>
                      {renderDetailsSortIcon("testScore")}
                    </div>
                  </th>
                  <th
                    className="pl-6 py-4 text-sm font-semibold text-slate-700 text-center cursor-pointer select-none hover:bg-slate-200 transition-colors"
                    onClick={() => handleDetailsSort("examScore")}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>Điểm thi</span>
                      {renderDetailsSortIcon("examScore")}
                    </div>
                  </th>
                  <th
                    className="pl-6 py-4 text-sm font-semibold text-slate-700 text-center cursor-pointer select-none hover:bg-slate-200 transition-colors"
                    onClick={() => handleDetailsSort("averageScore")}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>Điểm trung bình</span>
                      {renderDetailsSortIcon("averageScore")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedDetails.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-500 py-12">
                      <div className="flex flex-col items-center space-y-2">
                        <p className="text-lg font-medium">Không có dữ liệu</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedDetails.map((detail, index) => (
                    <tr
                      key={index}
                      className="hover:bg-blue-50 transition-all duration-200"
                    >
                      <td className="pl-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                            {detail.subject.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">
                            {detail.subject}
                          </span>
                        </div>
                      </td>
                      <td className="pl-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {detail.class}
                        </span>
                      </td>
                      <td className="pl-6 py-4 text-center">
                        <div className="w-12 h-8 bg-amber-500 rounded-lg flex items-center justify-center mx-auto">
                          <span className="text-white font-bold text-sm">
                            {detail.testScore}
                          </span>
                        </div>
                      </td>
                      <td className="pl-6 py-4 text-center">
                        <div className="w-12 h-8 bg-red-500 rounded-lg flex items-center justify-center mx-auto">
                          <span className="text-white font-bold text-sm">
                            {detail.examScore}
                          </span>
                        </div>
                      </td>
                      <td className="pl-6 py-4 text-center">
                        <div className="w-16 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto shadow-lg">
                          <span className="text-white font-bold">
                            {detail.averageScore}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination for details */}
          {totalDetailsPages > 1 && (
            <div className="flex justify-end mt-6">
              <Pagination
                currentPage={currentDetailsPage}
                totalPages={totalDetailsPages}
                handlePageClick={setCurrentDetailsPage}
                handlePreviousPage={() =>
                  setCurrentDetailsPage(Math.max(currentDetailsPage - 1, 1))
                }
                handleNextPage={() =>
                  setCurrentDetailsPage(
                    Math.min(currentDetailsPage + 1, totalDetailsPages),
                  )
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
