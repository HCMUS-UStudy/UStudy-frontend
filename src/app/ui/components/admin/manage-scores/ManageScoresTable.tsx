"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Users,
  TrendingUp,
  Award,
  BookOpen,
} from "lucide-react";
import Pagination from "@/app/ui/components/_common/Pagination";
import Tooltip from "@/app/ui/components/_common/Tooltip";
import {
  getStudentSummary,
  getStudentDetails,
} from "@/app/lib/services/academicResult";
import { StudentSummary, StudentDetailsData } from "@/app/types/academicResult";
import { FaEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import StudentDetailsModal from "./StudentDetailsModal";

const PAGE_SIZE = 5;

const sortKeys = {
  genId: "genId",
  name: "name",
  average10: "averageScore",
};

interface ManageScoresTableProps {
  search: string;
  selectedClass: string;
  selectedSubject: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  currentPage: number;
  onSort?: (column: string) => void;
  setCurrentPage?: (page: number) => void;
}

const ManageScoresTable: React.FC<ManageScoresTableProps> = ({
  search,
  sortBy,
  sortOrder,
  currentPage,
  onSort,
  setCurrentPage,
}) => {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentDetails, setSelectedStudentDetails] =
    useState<StudentDetailsData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch student summary data
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await getStudentSummary();
        setStudents(response.data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        // Use mock data as fallback
        setStudents([
          {
            genId: "HS001",
            name: "Nguyễn Văn A",
            averageScore: 8.8,
            academicRank: "Giỏi",
          },
          {
            genId: "HS002",
            name: "Trần Thị B",
            averageScore: 7.3,
            academicRank: "Khá",
          },
          {
            genId: "HS003",
            name: "Lê Văn C",
            averageScore: 6.8,
            academicRank: "Trung bình",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Fetch student details
  const handleViewDetails = async (studentId: string) => {
    try {
      const response = await getStudentDetails(studentId);
      setSelectedStudentDetails(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Failed to fetch student details:", error);
    }
  };

  // Filter students based on search
  let filtered = students.filter((student) => {
    const matchSearch =
      !search ||
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.genId.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  // Sort data
  if (sortBy && sortKeys[sortBy as keyof typeof sortKeys]) {
    filtered = filtered.sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
      let aValue: any =
        a[sortKeys[sortBy as keyof typeof sortKeys] as keyof StudentSummary];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
      let bValue: any =
        b[sortKeys[sortBy as keyof typeof sortKeys] as keyof StudentSummary];

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

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginatedStudents = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

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

  // Get rank color and icon
  const getRankStyle = (rank: string) => {
    switch (rank) {
      case "Giỏi":
        return {
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          icon: <Award className="w-4 h-4" />,
        };
      case "Khá":
        return {
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: <TrendingUp className="w-4 h-4" />,
        };
      case "Trung bình":
        return {
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-200",
          icon: <BookOpen className="w-4 h-4" />,
        };
      default:
        return {
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-200",
          icon: <Users className="w-4 h-4" />,
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-500 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Tổng học sinh</p>
              <p className="text-2xl font-bold">{students.length}</p>
            </div>
            <Users className="w-8 h-8 opacity-80" />
          </div>
        </div>
        <div className="bg-emerald-500 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Học sinh giỏi</p>
              <p className="text-2xl font-bold">
                {students.filter((s) => s.academicRank === "Giỏi").length}
              </p>
            </div>
            <Award className="w-8 h-8 opacity-80" />
          </div>
        </div>
        <div className="bg-blue-500 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Học sinh khá</p>
              <p className="text-2xl font-bold">
                {students.filter((s) => s.academicRank === "Khá").length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
        </div>
        <div className="bg-amber-500 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Điểm TB chung</p>
              <p className="text-2xl font-bold">
                {(
                  students.reduce((sum, s) => sum + s.averageScore, 0) /
                  students.length
                ).toFixed(1)}
              </p>
            </div>
            <BookOpen className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100">
              <tr>
                <th
                  className="pl-6 py-4 text-sm font-semibold text-slate-700 cursor-pointer select-none hover:bg-slate-200 transition-colors"
                  onClick={() => {
                    if (typeof onSort === "function") onSort("genId");
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span>Mã số học sinh</span>
                    {renderSortIcon("genId")}
                  </div>
                </th>
                <th
                  className="pl-6 py-4 text-sm font-semibold text-slate-700 cursor-pointer select-none hover:bg-slate-200 transition-colors"
                  onClick={() => {
                    if (typeof onSort === "function") onSort("name");
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span>Họ tên</span>
                    {renderSortIcon("name")}
                  </div>
                </th>
                <th
                  className="pl-6 py-4 text-sm font-semibold text-slate-700 cursor-pointer select-none hover:bg-slate-200 transition-colors"
                  onClick={() => {
                    if (typeof onSort === "function") onSort("average10");
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span>Điểm trung bình</span>
                    {renderSortIcon("average10")}
                  </div>
                </th>
                <th className="pl-6 py-4 text-sm font-semibold text-slate-700">
                  Đánh giá học lực
                </th>
                <th className="pl-6 py-4 text-sm font-semibold text-slate-700">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-12">
                    <div className="flex flex-col items-center space-y-2">
                      <Users className="w-12 h-12 text-gray-300" />
                      <p className="text-lg font-medium">
                        Không có dữ liệu phù hợp
                      </p>
                      <p className="text-sm text-gray-400">
                        Thử thay đổi từ khóa tìm kiếm
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => {
                  const rankStyle = getRankStyle(student.academicRank);
                  return (
                    <tr
                      key={student.genId}
                      className="hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
                    >
                      <td className="pl-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                            {student.genId.slice(-2)}
                          </div>
                          <span className="font-medium text-gray-900">
                            {student.genId}
                          </span>
                        </div>
                      </td>
                      <td className="pl-6 py-4">
                        <span className="font-medium text-gray-900">
                          {student.name}
                        </span>
                      </td>
                      <td className="pl-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {student.averageScore}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">/ 10</span>
                        </div>
                      </td>
                      <td className="pl-6 py-4">
                        <div
                          className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${rankStyle.bg} ${rankStyle.border}`}
                        >
                          <span
                            className={`${rankStyle.color} font-semibold text-sm`}
                          >
                            {student.academicRank}
                          </span>
                          {rankStyle.icon}
                        </div>
                      </td>
                      <td className="pl-6 py-4">
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            className="text-primary-dark hover:text-primary-darkest transition-colors"
                            onClick={() => handleViewDetails(student.genId)}
                          >
                            <Tooltip text="Xem chi tiết">
                              <FaEye className="size-4 md:size-5" />
                            </Tooltip>
                          </button>
                          <button className="text-blue-600 hover:text-blue-800 transition-all">
                            <Tooltip text="Chỉnh sửa điểm">
                              <FaEdit className="size-4 md:size-5" />
                            </Tooltip>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageClick={setCurrentPage ? setCurrentPage : () => {}}
          handlePreviousPage={() =>
            setCurrentPage ? setCurrentPage(Math.max(currentPage - 1, 1)) : {}
          }
          handleNextPage={() =>
            setCurrentPage
              ? setCurrentPage(Math.min(currentPage + 1, totalPages))
              : {}
          }
        />
      </div>

      {/* Details Modal */}
      <StudentDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        studentDetails={selectedStudentDetails}
      />
    </div>
  );
};

export default ManageScoresTable;
