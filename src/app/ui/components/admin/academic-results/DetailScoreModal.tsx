"use client";

import { AcademicResultManage } from "@/app/types";
import { Loading } from "../../_common/loading";

const DetailScoreModal = ({
  setSelectedId,
  data,
  isLoading,
}: {
  setSelectedId: (id: string | null) => void;
  data: AcademicResultManage;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-primary-dark text-2xl font-bold"
          onClick={() => setSelectedId(null)}
          aria-label="Đóng"
        >
          ×
        </button>
        <div className="flex mb-2 gap-3">
          <span className="font-semibold text-primary-dark">
            Chi tiết điểm:
          </span>
          <span>
            {data.student.genId} - {data.student.name}
          </span>
        </div>
        <table className="min-w-full border border-gray-200 rounded-lg text-sm">
          <thead className="bg-primary-light">
            <tr>
              <th className="px-4 py-2 text-left">Bài tập</th>
              <th className="px-4 py-2 text-center">Điểm của học sinh</th>
              <th className="px-4 py-2 text-center">Điểm TB lớp</th>
              <th className="px-4 py-2 text-center">Ngày nộp</th>
            </tr>
          </thead>
          <tbody>
            {data.assignmentScores.map((item, idx2) => (
              <tr key={idx2} className="border-b">
                <td className="px-4 py-2">{item.title}</td>
                <td className="px-4 py-2 text-center">
                  {Number(item.studentScore) % 1 === 0
                    ? Number(item.studentScore)
                    : Number(item.studentScore).toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center">
                  {Number(item.classAverageScore) % 1 === 0
                    ? Number(item.classAverageScore)
                    : Number(item.classAverageScore).toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center">
                  {item.submissionDate
                    ? new Date(item.submissionDate).toLocaleDateString("vi-VN")
                    : "Chưa nộp"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-right font-bold text-sm">
          Điểm trung bình:{" "}
          <span className="text-primary-dark">
            {Number(data.averageScore) % 1 === 0
              ? Number(data.averageScore)
              : Number(data.averageScore).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DetailScoreModal;
