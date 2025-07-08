"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  FileText,
} from "lucide-react";
import Pagination from "@/app/ui/components/_common/Pagination";
import { getAcademicResult } from "@/app/lib/services/academicResult";
import { AcademicResult, Content } from "@/app/types/academicResult";
import Loading from "../../_common/loading/Loading";

const PAGE_SIZE = 10;

const sortKeys = {
  title: "title",
  studentScore: "studentScore",
  classAverageScore: "classAverageScore",
  submissionDate: "submissionDate",
};

interface ManageScoresTableProps {
  classId: string;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  currentPage: number;
  onSort?: (column: string) => void;
  setCurrentPage?: (page: number) => void;
}

const ManageScoresTable: React.FC<ManageScoresTableProps> = ({
  classId,
  search,
  sortBy,
  sortOrder,
  currentPage,
  onSort,
  setCurrentPage,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [academicResult, setAcademicResult] = useState<AcademicResult | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  // Fetch academic result data
  useEffect(() => {
    const fetchAcademicResult = async () => {
      if (!classId) return;

      setLoading(true);
      setError(null);
      try {
        const response = await getAcademicResult(
          classId,
          currentPage,
          PAGE_SIZE,
        );
        console.log("API Response:", response);

        // Check if response has data, if not use mock data
        // if (
        //   response &&
        //   response.assignmentScores &&
        //   response.assignmentScores.content &&
        //   response.assignmentScores.content.length > 0
        // ) {
        //   setAcademicResult(response);
        //   setIsUsingMockData(false);
        // } else {
        //   console.log("No real data, using mock data");
        //   // Use mock data as fallback
        //   setAcademicResult({
        //     assignmentScores: {
        //       content: [
        //         {
        //           title: "Bài tập 1: Đại số tuyến tính",
        //           studentScore: 8.5,
        //           classAverageScore: 7.8,
        //           submissionDate: "2024-01-15",
        //         },
        //         {
        //           title: "Bài tập 2: Hình học không gian",
        //           studentScore: 9.0,
        //           classAverageScore: 8.2,
        //           submissionDate: "2024-01-20",
        //         },
        //         {
        //           title: "Bài kiểm tra giữa kỳ - Chương 1",
        //           studentScore: 7.5,
        //           classAverageScore: 7.0,
        //           submissionDate: "2024-02-01",
        //         },
        //         {
        //           title: "Bài tập 3: Phương trình bậc hai",
        //           studentScore: 9.2,
        //           classAverageScore: 8.5,
        //           submissionDate: "2024-02-10",
        //         },
        //         {
        //           title: "Bài tập 4: Bất phương trình",
        //           studentScore: 8.8,
        //           classAverageScore: 8.1,
        //           submissionDate: "2024-02-15",
        //         },
        //         {
        //           title: "Bài kiểm tra cuối kỳ",
        //           studentScore: 8.0,
        //           classAverageScore: 7.5,
        //           submissionDate: "2024-03-01",
        //         },
        //       ],
        //       totalPages: 1,
        //     },
        //     averageScore: 8.3,
        //   });
        //   setIsUsingMockData(true);
        // }
      } catch (error) {
        console.error("Failed to fetch academic result:", error);
        setError("Không thể tải dữ liệu điểm số");
        // Use mock data as fallback
        // setAcademicResult({
        //   assignmentScores: {
        //     content: [
        //       {
        //         title: "Bài tập 1: Đại số tuyến tính",
        //         studentScore: 8.5,
        //         classAverageScore: 7.8,
        //         submissionDate: "2024-01-15",
        //       },
        //       {
        //         title: "Bài tập 2: Hình học không gian",
        //         studentScore: 9.0,
        //         classAverageScore: 8.2,
        //         submissionDate: "2024-01-20",
        //       },
        //       {
        //         title: "Bài kiểm tra giữa kỳ - Chương 1",
        //         studentScore: 7.5,
        //         classAverageScore: 7.0,
        //         submissionDate: "2024-02-01",
        //       },
        //       {
        //         title: "Bài tập 3: Phương trình bậc hai",
        //         studentScore: 9.2,
        //         classAverageScore: 8.5,
        //         submissionDate: "2024-02-10",
        //       },
        //       {
        //         title: "Bài tập 4: Bất phương trình",
        //         studentScore: 8.8,
        //         classAverageScore: 8.1,
        //         submissionDate: "2024-02-15",
        //       },
        //       {
        //         title: "Bài kiểm tra cuối kỳ",
        //         studentScore: 8.0,
        //         classAverageScore: 7.5,
        //         submissionDate: "2024-03-01",
        //       },
        //     ],
        //     totalPages: 1,
        //   },
        //   averageScore: 8.3,
        // });
        // setIsUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicResult();
  }, [classId, currentPage]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">{error}</div>
          <div className="text-gray-500">Vui lòng thử lại sau</div>
        </div>
      </div>
    );
  }

  if (!academicResult) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500 text-lg">Không có dữ liệu điểm số</div>
        </div>
      </div>
    );
  }

  // Filter assignments based on search
  let filteredAssignments = academicResult.assignmentScores.content.filter(
    (assignment) => {
      const matchSearch =
        !search ||
        assignment.title.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    },
  );

  // Sort data
  if (sortBy && sortKeys[sortBy as keyof typeof sortKeys]) {
    filteredAssignments = filteredAssignments.sort((a, b) => {
      const aValue =
        a[sortKeys[sortBy as keyof typeof sortKeys] as keyof Content];
      const bValue =
        b[sortKeys[sortBy as keyof typeof sortKeys] as keyof Content];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }

  // Render sort icon
  const renderSortIcon = (key: string) => {
    if (sortBy !== key)
      return <ArrowUpDown className="inline ml-1 w-4 h-4 opacity-40" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="inline ml-1 w-4 h-4 text-primary-dark" />
    ) : (
      <ArrowDown className="inline ml-1 w-4 h-4 text-primary-dark" />
    );
  };

  // Get score color and icon
  const getScoreStyle = (score: number, average: number) => {
    const difference = score - average;
    if (difference >= 1) {
      return {
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        icon: <Award className="w-4 h-4" />,
      };
    } else if (difference >= 0) {
      return {
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: <TrendingUp className="w-4 h-4" />,
      };
    } else {
      return {
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        icon: <BookOpen className="w-4 h-4" />,
      };
    }
  };

  return (
    <div className="mt-6">
      {/* Mock Data Indicator */}
      {isUsingMockData && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-amber-700 font-medium">
              Đang hiển thị dữ liệu mẫu - API chưa có dữ liệu thực
            </span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Điểm trung bình
              </p>
              <p className="text-2xl font-bold text-primary-dark">
                {academicResult.averageScore.toFixed(1)}
              </p>
            </div>
            <div className="p-2 bg-primary-lighter rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng bài tập</p>
              <p className="text-2xl font-bold text-primary-dark">
                {academicResult.assignmentScores.content.length}
              </p>
            </div>
            <div className="p-2 bg-primary-lighter rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Trang hiện tại
              </p>
              <p className="text-2xl font-bold text-primary-dark">
                {currentPage}/{academicResult.assignmentScores.totalPages}
              </p>
            </div>
            <div className="p-2 bg-primary-lighter rounded-lg">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort?.("title")}
                >
                  <div className="flex items-center">
                    Tên bài tập
                    {renderSortIcon("title")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort?.("studentScore")}
                >
                  <div className="flex items-center">
                    Điểm học sinh
                    {renderSortIcon("studentScore")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort?.("classAverageScore")}
                >
                  <div className="flex items-center">
                    Điểm trung bình lớp
                    {renderSortIcon("classAverageScore")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => onSort?.("submissionDate")}
                >
                  <div className="flex items-center">
                    Ngày nộp
                    {renderSortIcon("submissionDate")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssignments.map((assignment, index) => {
                const scoreStyle = getScoreStyle(
                  assignment.studentScore,
                  assignment.classAverageScore,
                );
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {assignment.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${scoreStyle.bg} ${scoreStyle.border} ${scoreStyle.color}`}
                      >
                        {scoreStyle.icon}
                        <span className="ml-1">
                          {assignment.studentScore.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.classAverageScore.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(assignment.submissionDate).toLocaleDateString(
                        "vi-VN",
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {academicResult.assignmentScores.totalPages > 1 && (
          <div className="px-6 py-3 border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={academicResult.assignmentScores.totalPages}
              handlePageClick={(page: number) => setCurrentPage?.(page)}
              handlePreviousPage={() =>
                setCurrentPage?.(Math.max(currentPage - 1, 1))
              }
              handleNextPage={() =>
                setCurrentPage?.(
                  Math.min(
                    currentPage + 1,
                    academicResult.assignmentScores.totalPages,
                  ),
                )
              }
            />
          </div>
        )}
      </div>

      {/* No results message */}
      {filteredAssignments.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg">
            Không tìm thấy bài tập nào
          </div>
          <div className="text-gray-400 text-sm">
            Thử thay đổi từ khóa tìm kiếm
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageScoresTable;
