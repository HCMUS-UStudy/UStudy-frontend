"use client";

import React from "react";
import Pagination from "../../_common/Pagination";
import { Eye, Pencil, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import Tooltip from "../../_common/Tooltip";

// Mock data for demonstration
interface ScoreItem {
  id: string;
  name: string;
  class: string;
  subject: string;
  testScore: number;
  examScore: number;
  average: number;
  rank: string;
}

const mockScores: ScoreItem[] = [
  {
    id: "HS001",
    name: "Nguyễn Văn A",
    class: "10A1",
    subject: "Toán",
    testScore: 8.5,
    examScore: 9.0,
    average: 8.8,
    rank: "Giỏi",
  },
  {
    id: "HS002",
    name: "Trần Thị B",
    class: "10A2",
    subject: "Văn",
    testScore: 7.0,
    examScore: 7.5,
    average: 7.3,
    rank: "Khá",
  },
  {
    id: "HS003",
    name: "Lê Văn C",
    class: "10A1",
    subject: "Anh",
    testScore: 6.5,
    examScore: 7.0,
    average: 6.8,
    rank: "Trung bình",
  },
  {
    id: "HS004",
    name: "Phạm Thị D",
    class: "10A3",
    subject: "Lý",
    testScore: 9.0,
    examScore: 8.5,
    average: 8.8,
    rank: "Giỏi",
  },
  {
    id: "HS005",
    name: "Đỗ Văn E",
    class: "10A2",
    subject: "Hóa",
    testScore: 5.5,
    examScore: 6.0,
    average: 5.8,
    rank: "Yếu",
  },
  // Add more mock data as needed
];

const PAGE_SIZE = 5;

const sortKeys = {
  name: "name",
  class: "class",
  subject: "subject",
  average10: "average",
  average4: "average", // sort by average, display thang 4
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

const subjectMap: Record<string, string> = {
  toan: "Toán",
  van: "Văn",
  anh: "Anh",
  ly: "Lý",
  hoa: "Hóa",
};

const ManageScoresTable: React.FC<ManageScoresTableProps> = ({
  search,
  selectedClass,
  selectedSubject,
  sortBy,
  sortOrder,
  currentPage,
  onSort,
  setCurrentPage,
}) => {
  // Lọc dữ liệu
  let filtered = mockScores.filter((item) => {
    const matchSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    const matchClass = selectedClass === "all" || item.class === selectedClass;
    const matchSubject =
      selectedSubject === "all" ||
      item.subject === subjectMap[selectedSubject] ||
      item.subject.toLowerCase() === selectedSubject.toLowerCase();
    return matchSearch && matchClass && matchSubject;
  });

  // Sắp xếp dữ liệu
  if (sortBy && sortKeys[sortBy as keyof typeof sortKeys]) {
    filtered = filtered.sort((a, b) => {
      let aValue =
        a[sortKeys[sortBy as keyof typeof sortKeys] as keyof ScoreItem];
      let bValue =
        b[sortKeys[sortBy as keyof typeof sortKeys] as keyof ScoreItem];
      // Nếu sort theo average4 thì chia 2.5
      if (sortBy === "average4") {
        aValue = (a.average / 2.5) as number;
        bValue = (b.average / 2.5) as number;
      }
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
  const paginatedScores = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Render icon sort
  const renderSortIcon = (key: string) => {
    if (sortBy !== key)
      return <ArrowUpDown className="inline ml-1 w-4 h-4 opacity-40" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="inline ml-1 w-4 h-4 text-primary-dark" />
    ) : (
      <ArrowDown className="inline ml-1 w-4 h-4 text-primary-dark" />
    );
  };

  return (
    <div>
      <div className="overflow-x-auto mt-6 max-h-[400px]">
        <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-md">
          <thead className="bg-slate-100">
            <tr className="border-b-2 border-slate-200">
              <th
                rowSpan={2}
                className="pl-5 py-3 text-xs md:text-[14px] text-left"
              >
                Mã số học sinh
              </th>
              <th
                rowSpan={2}
                className="pl-5 py-3 text-xs md:text-[14px] text-left cursor-pointer select-none"
                onClick={() => {
                  if (typeof onSort === "function") onSort("name");
                }}
              >
                Họ tên {renderSortIcon("name")}
              </th>
              <th
                rowSpan={2}
                className="pl-5 py-3 text-xs md:text-[14px] text-left cursor-pointer select-none"
                onClick={() => {
                  if (typeof onSort === "function") onSort("class");
                }}
              >
                Lớp {renderSortIcon("class")}
              </th>
              <th
                rowSpan={2}
                className="pl-5 py-3 text-xs md:text-[14px] text-left cursor-pointer select-none"
                onClick={() => {
                  if (typeof onSort === "function") onSort("subject");
                }}
              >
                Môn học {renderSortIcon("subject")}
              </th>
              <th
                rowSpan={2}
                className="pl-5 py-3 text-xs md:text-[14px] text-left"
              >
                Điểm kiểm tra
              </th>
              <th
                rowSpan={2}
                className="pl-5 py-3 text-xs md:text-[14px] text-left"
              >
                Điểm thi
              </th>
              <th
                colSpan={2}
                className="pl-5 py-3 text-xs md:text-[14px] text-center"
              >
                Điểm trung bình
              </th>
              <th
                rowSpan={2}
                className="pl-5 py-3 text-xs md:text-[14px] text-left"
              >
                Đánh giá học lực
              </th>
              <th
                rowSpan={2}
                className="pl-5 py-3 text-xs md:text-[14px] text-left"
              >
                Hành động
              </th>
            </tr>
            <tr className="border-b-2 border-slate-200">
              <th
                className="pl-5 py-3 text-xs md:text-[14px] text-center cursor-pointer select-none"
                onClick={() => {
                  if (typeof onSort === "function") onSort("average10");
                }}
              >
                Thang 10 {renderSortIcon("average10")}
              </th>
              <th
                className="pl-5 py-3 text-xs md:text-[14px] text-center cursor-pointer select-none"
                onClick={() => {
                  if (typeof onSort === "function") onSort("average4");
                }}
              >
                Thang 4 {renderSortIcon("average4")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedScores.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center text-gray-400 py-6">
                  Không có dữ liệu phù hợp
                </td>
              </tr>
            ) : (
              paginatedScores.map((score) => (
                <tr
                  key={score.id}
                  className="hover:bg-primary-lighter cursor-pointer text-md"
                >
                  <td className="pl-5 py-3">{score.id}</td>
                  <td className="pl-5 py-3">{score.name}</td>
                  <td className="pl-5 py-3">{score.class}</td>
                  <td className="pl-5 py-3">{score.subject}</td>
                  <td className="pl-5 py-3">{score.testScore}</td>
                  <td className="pl-5 py-3">{score.examScore}</td>
                  <td className="pl-5 py-3 text-center">{score.average}</td>
                  <td className="pl-5 py-3 text-center">
                    {(score.average / 2.5).toFixed(2)}
                  </td>
                  <td className="pl-5 py-3">
                    <span
                      className={
                        score.rank === "Giỏi"
                          ? "text-green-600 font-bold"
                          : score.rank === "Khá"
                            ? "text-blue-600 font-bold"
                            : score.rank === "Trung bình"
                              ? "text-yellow-600 font-bold"
                              : "text-red-600 font-bold"
                      }
                    >
                      {score.rank}
                    </span>
                  </td>
                  <td className="pl-5 py-3 flex gap-2">
                    <button className="text-primary-dark hover:text-primary-darkest transition-colors">
                      <Tooltip text="Xem chi tiết">
                        <Eye className="size-4 md:size-5" />
                      </Tooltip>
                    </button>
                    <button className="text-blue-600 hover:text-blue-800 transition-colors">
                      <Tooltip text="Chỉnh sửa điểm">
                        <Pencil className="size-4 md:size-5" />
                      </Tooltip>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
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
    </div>
  );
};

export default ManageScoresTable;
