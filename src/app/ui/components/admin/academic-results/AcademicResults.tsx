"use client";
import { AcademicResultManage } from "@/app/types/academicResult";
import { useState } from "react";
import { FaSortUp, FaSortDown } from "react-icons/fa6";

export default function AcademicResultsTable({
  data,
  selectedId,
  setSelectedId,
}: {
  data: AcademicResultManage[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}) {
  const [sortAsc, setSortAsc] = useState(true);

  const sortedData = Array.isArray(data) ? [...data] : [];
  if (sortedData.length > 0) {
    sortedData.sort((a, b) => {
      const codeA = a.student?.genId || "";
      const codeB = b.student?.genId || "";
      if (sortAsc) {
        return codeA.localeCompare(codeB, "vi", { numeric: true });
      } else {
        return codeB.localeCompare(codeA, "vi", { numeric: true });
      }
    });
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Không có dữ liệu học sinh
      </div>
    );
  }
  const assignmentTitles = Array.from(
    new Set(
      sortedData.flatMap((student) =>
        Array.isArray(student?.assignmentScores)
          ? student.assignmentScores.map((a) => a.title)
          : [],
      ),
    ),
  );
  return (
    <div className="overflow-x-auto mb-8">
      <table
        className="min-w-full border border-gray-200 rounded-lg
        border-separate border-spacing-0 text-[14px]"
      >
        <thead className="bg-primary-light">
          <tr>
            <th className="pl-6 pr-4 py-2 text-left rounded-tl-lg">
              <span className="flex items-center gap-2">
                Mã người dùng
                <button
                  type="button"
                  className="ml-1 text-sm px-2 py-1 transition flex flex-col items-center"
                  onClick={() => setSortAsc((v) => !v)}
                  aria-label="Sắp xếp mã người dùng"
                >
                  <FaSortUp
                    className={sortAsc ? "text-black" : "text-gray-400"}
                    style={{ marginBottom: "-6px" }}
                  />
                  <FaSortDown
                    className={!sortAsc ? "text-black" : "text-gray-400"}
                    style={{ marginTop: "-6px" }}
                  />
                </button>
              </span>
            </th>
            <th className="px-4 py-2 text-left">Tên học viên</th>
            {assignmentTitles.map((title, i) => (
              <th
                key={title}
                className={`px-4 py-2 text-center${i === assignmentTitles.length - 1 ? "" : ""}`}
              >
                {title}
              </th>
            ))}
            <th className="px-4 py-2 text-center">Điểm trung bình</th>
            <th className="px-4 py-2 text-center rounded-tr-lg">
              Xem chi tiết
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((student, idx) => (
            <tr
              key={student.student.genId}
              className={`border-t border-gray-200${idx === data.length - 1 ? " last:rounded-b-lg" : ""}
               hover:bg-primary-lighter`}
            >
              <td
                className={`pl-6 pr-4 py-2${idx === data.length - 1 ? " rounded-bl-lg" : ""}`}
              >
                {student.student.genId}
              </td>
              <td className="px-4 py-2">{student.student.name}</td>
              {assignmentTitles.map((title, i) => {
                const found = Array.isArray(student.assignmentScores)
                  ? student.assignmentScores.find((a) => a.title === title)
                  : undefined;
                return (
                  <td
                    key={title}
                    className={`px-4 py-2 text-center${idx === data.length - 1 && i === assignmentTitles.length - 1 ? " rounded-br-lg" : ""}`}
                  >
                    {found
                      ? Number(found.studentScore) % 1 === 0
                        ? Number(found.studentScore)
                        : Number(found.studentScore).toFixed(2)
                      : "-"}
                  </td>
                );
              })}
              <td
                className={`px-4 py-2 text-center${idx === data.length - 1 ? "" : ""}`}
              >
                {typeof student.averageScore === "number"
                  ? Number(student.averageScore) % 1 === 0
                    ? Number(student.averageScore)
                    : Number(student.averageScore).toFixed(2)
                  : student.averageScore}
              </td>
              <td
                className={`px-4 py-2 text-center${idx === data.length - 1 ? " rounded-br-lg" : ""}`}
              >
                <button
                  className={`px-3 py-1 rounded bg-primary-light hover:bg-primary-dark hover:text-white transition
                         ${selectedId === student.student.id ? "ring-2 ring-primary-dark" : ""}`}
                  onClick={() => setSelectedId(student.student.id)}
                >
                  Xem
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
