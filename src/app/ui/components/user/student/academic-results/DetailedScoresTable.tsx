import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "../../../_common/Table";
import { useQuery } from "@tanstack/react-query";
import { getAcademicResult } from "@/app/lib/services/academicResult";
import Pagination from "../../../_common/Pagination";

// interface Score {
//   subject: string;
//   midterm: number;
//   final: number;
//   average: number;
//   grade: string;
//   teacher: string;
// }

// interface Ranking {
//   label: string;
//   color: string;
// }

// interface DetailedScoresTableProps {
//   detailedScores: Score[];
//   overallAverage: number;
//   ranking: Ranking;
// }

// const testResults = [
//   {
//     id: 1,
//     examName: "Toán học kỳ 1",
//     score: 8.5,
//     averageScore: 7.0,
//     examDate: "2025-04-10",
//   },
//   {
//     id: 2,
//     examName: "Văn học kỳ 1",
//     score: 7.2,
//     averageScore: 6.8,
//     examDate: "2025-04-12",
//   },
//   {
//     id: 3,
//     examName: "Tiếng Anh giữa kỳ",
//     score: 9.0,
//     averageScore: 7.5,
//     examDate: "2025-03-28",
//   },
//   {
//     id: 4,
//     examName: "Lý học kỳ 2",
//     score: 6.8,
//     averageScore: 7.1,
//     examDate: "2025-05-05",
//   },
//   {
//     id: 5,
//     examName: "Hóa học kỳ 2",
//     score: 7.5,
//     averageScore: 7.0,
//     examDate: "2025-05-08",
//   },
// ];

export default function DetailedScoresTable({ classId }: { classId: string }) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: academicRes, status } = useQuery({
    queryKey: ["AcademicResults", currentPage - 1, classId],
    queryFn: () => getAcademicResult(classId, currentPage - 1, 5),
    enabled: classId !== "",
  });
  return (
    <Card className="border-primary-light bg-white hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle>Chi tiết điểm số</CardTitle>
      </CardHeader>
      <CardContent>
        {classId ? (
          <>
            <Table>
              <TableHeader
                columns={[
                  "Bài kiểm tra",
                  "Điểm",
                  "Điểm trung bình",
                  "Ngày làm bài",
                  "",
                ]}
              />
              <TableBody isLoading={status === "pending"}>
                {academicRes?.assignmentScores.content.map((result) => (
                  <TableRow key={result.title}>
                    <TableCell>{result.title}</TableCell>
                    <TableCell>{result.studentScore}</TableCell>
                    <TableCell>{result.classAverageScore}</TableCell>
                    <TableCell>
                      {new Date(result.submissionDate).toLocaleDateString(
                        "vi-VN",
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter
                columns={[
                  "ID",
                  "Bài kiểm tra",
                  "Điểm",
                  "Điểm trung bình",
                  "Ngày làm bài",
                ]}
                footerData={[
                  "Điểm trung bình",
                  "",
                  "",
                  "",
                  academicRes?.averageScore.toString() || "",
                ]}
              />
            </Table>
            <Pagination
              currentPage={currentPage}
              totalPages={academicRes?.assignmentScores.totalPages || 1}
              handlePageClick={(page) => setCurrentPage(page)}
              handleNextPage={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    academicRes?.assignmentScores.totalPages || 1,
                    prev + 1,
                  ),
                )
              }
              handlePreviousPage={() =>
                setCurrentPage((prev) => Math.max(1, prev - 1))
              }
            />
          </>
        ) : (
          <div className="text-primary-darkest">
            Vui lòng chọn lớp học để xem chi tiết
          </div>
        )}
        {/* <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary-lighter border-b border-primary-light">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Môn học
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Điểm giữa kỳ
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Điểm cuối kỳ
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Điểm TB
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Điểm chữ
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Giáo viên
                </th>
              </tr>
            </thead>
            <tbody>
              {detailedScores.map((score, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 hover:bg-primary-lighter transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {score.subject}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-700">
                    {score.midterm.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-700">
                    {score.final.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-primary-darkest">
                    {score.average.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-primary-darkest">
                    {score.grade}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {score.teacher}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-primary-lighter border-t border-primary-light">
                <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                  Điểm trung bình tổng
                </td>
                <td colSpan={2} className="px-4 py-3" />
                <td className="px-4 py-3 text-center text-sm font-bold text-primary-darkest">
                  {overallAverage.toFixed(1)}
                </td>
                <td
                  colSpan={2}
                  className="px-4 py-3 text-center text-sm font-bold text-primary-darkest"
                >
                  <span className={`font-bold ${ranking.color}`}>
                    {ranking.label}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div> */}
      </CardContent>
    </Card>
  );
}
