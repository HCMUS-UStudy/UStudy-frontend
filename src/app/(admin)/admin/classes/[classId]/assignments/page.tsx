"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Tooltip from "@/app/ui/components/_common/Tooltip";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { getClassesForTeacher } from "@/app/lib/services";
import { useQuery } from "@tanstack/react-query";
import {
  getAssignmentByClassId,
  getAllAssignments,
} from "@/app/lib/services/assignment";
import { AssignmentItem, ClassDetail } from "@/app/types";
import AssignmentModal from "@/app/ui/components/user/teacher/AssignmentModal";
import { useParams } from "next/navigation";

const AssignmentList = () => {
  const params = useParams<{ classId: string }>();
  const classId = params?.classId as string;

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [sortField, setSortField] = useState<
    "title" | "class" | "format" | "mode" | "endTime" | "startTime"
  >("endTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const router = useRouter();

  // Lấy danh sách lớp từ API
  const { data: classData } = useQuery({
    queryKey: ["teacher-classes"],
    queryFn: getClassesForTeacher,
  });

  // Lấy danh sách bài tập từ API
  const { data: assignmentData } = useQuery({
    queryKey: ["assignments", classId],
    queryFn: () =>
      classId
        ? getAssignmentByClassId(0, 100, classId)
        : getAllAssignments(0, 100),
  });

  // Lấy dữ liệu assignment từ API (không còn dùng mock)
  const assignmentList: AssignmentItem[] = React.useMemo(() => {
    if (!assignmentData) return [];
    if (classId) {
      // assignmentData là object có content là mảng
      return Array.isArray(assignmentData.content)
        ? assignmentData.content
        : [];
    } else {
      // getAllAssignments trả về object có content là mảng
      return Array.isArray(assignmentData.content)
        ? assignmentData.content
        : [];
    }
  }, [assignmentData, classId]);

  const filteredData = React.useMemo(() => {
    let data: AssignmentItem[] = assignmentList;
    const s = search.trim().toLowerCase();
    if (s)
      data = data.filter(
        (a: AssignmentItem) =>
          a.title.toLowerCase().includes(s) ||
          a.aclass.name.toLowerCase().includes(s),
      );
    return data;
  }, [search, assignmentList]);

  const handleSort = (
    field: "title" | "class" | "format" | "mode" | "endTime" | "startTime",
  ) => {
    if (sortField !== field) {
      setSortField(field);
      setSortOrder("desc");
    } else {
      setSortOrder((prev) =>
        prev === "desc" ? "asc" : prev === "asc" ? "none" : "desc",
      );
    }
  };

  const sortedData = React.useMemo(() => {
    if (sortOrder === "none") return filteredData;
    return [...filteredData].sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      switch (sortField) {
        case "title":
          aValue = a.title;
          bValue = b.title;
          break;
        case "format":
          aValue = a.format;
          bValue = b.format;
          break;
        case "mode":
          aValue = a.mode;
          bValue = b.mode;
          break;
        case "startTime":
          aValue = new Date(a.startTime).getTime();
          bValue = new Date(b.startTime).getTime();
          break;
        case "endTime":
        default:
          aValue = new Date(a.endTime).getTime();
          bValue = new Date(b.endTime).getTime();
          break;
      }
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortOrder]);

  return (
    <>
      <div className="p-2 sm:p-4 max-w-7xl mx-auto">
        <div className="mb-2 sm:mb-4 flex items-center justify-between">
          <h1 className="text-[20px] sm:text-[22px] font-extrabold text-primary-darker tracking-wide drop-shadow">
            Danh sách bài tập
          </h1>
        </div>
        <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center justify-between">
          <input
            type="text"
            className="w-full sm:w-80 px-3 py-2 border-2 border-primary-light rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-light text-sm"
            placeholder="Tìm kiếm theo tiêu đề"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="hidden md:block shadow-lg bg-white rounded-b-xl">
          <table className="min-w-[700px] w-full rounded-b-xl text-sm">
            <thead className="bg-primary-light text-sm">
              <tr>
                <th className="px-2 sm:px-3 py-2 sm:py-3 rounded-tl-xl font-semibold text-gray-700">
                  #
                </th>
                <th
                  className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-left cursor-pointer select-none"
                  onClick={() => handleSort("title")}
                >
                  Tiêu đề
                  {sortField === "title" && sortOrder === "desc" && (
                    <FaSortDown className="inline ml-1" />
                  )}
                  {sortField === "title" && sortOrder === "asc" && (
                    <FaSortUp className="inline ml-1" />
                  )}
                  {sortField === "title" && sortOrder === "none" && (
                    <FaSort className="inline ml-1" />
                  )}
                  {sortField !== "title" && (
                    <FaSort className="inline ml-1 text-gray-400" />
                  )}
                </th>
                <th
                  className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-center cursor-pointer select-none"
                  onClick={() => handleSort("format")}
                >
                  Loại
                  {sortField === "format" && sortOrder === "desc" && (
                    <FaSortDown className="inline ml-1" />
                  )}
                  {sortField === "format" && sortOrder === "asc" && (
                    <FaSortUp className="inline ml-1" />
                  )}
                  {sortField === "format" && sortOrder === "none" && (
                    <FaSort className="inline ml-1" />
                  )}
                  {sortField !== "format" && (
                    <FaSort className="inline ml-1 text-gray-400" />
                  )}
                </th>
                <th
                  className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-center cursor-pointer select-none"
                  onClick={() => handleSort("mode")}
                >
                  Chế độ
                  {sortField === "mode" && sortOrder === "desc" && (
                    <FaSortDown className="inline ml-1" />
                  )}
                  {sortField === "mode" && sortOrder === "asc" && (
                    <FaSortUp className="inline ml-1" />
                  )}
                  {sortField === "mode" && sortOrder === "none" && (
                    <FaSort className="inline ml-1" />
                  )}
                  {sortField !== "mode" && (
                    <FaSort className="inline ml-1 text-gray-400" />
                  )}
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-center">
                  Số lần làm
                </th>
                <th
                  className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-center cursor-pointer select-none"
                  onClick={() => handleSort("startTime")}
                >
                  Bắt đầu
                  {sortField === "startTime" && sortOrder === "desc" && (
                    <FaSortDown className="inline ml-1" />
                  )}
                  {sortField === "startTime" && sortOrder === "asc" && (
                    <FaSortUp className="inline ml-1" />
                  )}
                  {sortField === "startTime" && sortOrder === "none" && (
                    <FaSort className="inline ml-1" />
                  )}
                  {sortField !== "startTime" && (
                    <FaSort className="inline ml-1 text-gray-400" />
                  )}
                </th>
                <th
                  className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-center cursor-pointer select-none"
                  onClick={() => handleSort("endTime")}
                >
                  Kết thúc
                  {sortField === "endTime" && sortOrder === "desc" && (
                    <FaSortDown className="inline ml-1" />
                  )}
                  {sortField === "endTime" && sortOrder === "asc" && (
                    <FaSortUp className="inline ml-1" />
                  )}
                  {sortField === "endTime" && sortOrder === "none" && (
                    <FaSort className="inline ml-1" />
                  )}
                  {sortField !== "endTime" && (
                    <FaSort className="inline ml-1 text-gray-400" />
                  )}
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 rounded-tr-xl font-semibold text-gray-700 text-center">
                  Người tạo
                </th>
              </tr>
            </thead>
            <tbody className="rounded-b-xl text-sm">
              {sortedData.map((a: AssignmentItem, idx: number) => (
                <tr
                  key={a.id}
                  className="bg-white hover:bg-primary-lighter transition-all cursor-pointer text-sm"
                  onClick={() =>
                    router.push(`/admin/classes/${classId}/assignments/${a.id}`)
                  }
                >
                  <td
                    className={`px-2 sm:px-3 py-2 sm:py-4 align-top text-center text-md text-gray-700 ${idx === sortedData.length - 1 ? "rounded-bl-xl" : ""}`}
                  >
                    {idx + 1}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 align-top min-w-[180px] sm:min-w-[220px] overflow-visible">
                    {a.title.length > 40 ? (
                      <Tooltip text={a.title}>
                        <span className="text-gray-900">
                          {a.title.slice(0, 40)}...
                        </span>
                      </Tooltip>
                    ) : (
                      a.title
                    )}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 align-top text-center font-medium">
                    {a.format === "MULTIPLE_CHOICE"
                      ? "Trắc nghiệm"
                      : a.format === "ESSAY"
                        ? "Tự luận"
                        : a.format === "MIXED"
                          ? "Tổng hợp"
                          : a.format}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 align-top text-center font-medium">
                    {a.mode === "TEST"
                      ? "Kiểm tra"
                      : a.mode === "PRACTICE"
                        ? "Luyện tập"
                        : a.mode}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 align-top text-center">
                    {a.numAttempts}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 align-top text-center whitespace-nowrap">
                    {new Date(a.startTime).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    {new Date(a.startTime).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 align-top text-center whitespace-nowrap">
                    {new Date(a.endTime).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    {new Date(a.endTime).toLocaleDateString("vi-VN")}
                  </td>
                  <td
                    className={`px-2 sm:px-4 py-2 sm:py-4 align-top text-center ${idx === sortedData.length - 1 ? "rounded-br-xl" : ""}`}
                  >
                    {a.createdBy.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedData.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Không tìm thấy bài tập phù hợp.
            </div>
          )}
        </div>
        {/* Card view for mobile */}
        <div className="md:hidden space-y-4">
          {sortedData.map((a: AssignmentItem, idx: number) => (
            <div
              key={a.id}
              className="bg-white rounded-xl shadow border border-gray-100 p-4 flex flex-col gap-2 cursor-pointer hover:bg-primary-lighter transition"
              onClick={() => router.push(`/teacher/assignments/${a.id}`)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">#{idx + 1}</span>
                <span className="text-xs text-gray-500">
                  {new Date(a.endTime).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="text-gray-900 text-base line-clamp-2">
                {a.title.length > 40 ? (
                  <Tooltip text={a.title}>
                    <span className="text-gray-900">
                      {a.title.slice(0, 40)}...
                    </span>
                  </Tooltip>
                ) : (
                  a.title
                )}
              </div>
              <div className="flex gap-3 text-sm mt-1">
                <span className="bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded">
                  {a.aclass.grade.name}
                </span>
                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded">
                  {a.aclass.course.name}
                </span>
              </div>
            </div>
          ))}
          {sortedData.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Không tìm thấy bài tập.
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <AssignmentModal
          onClose={() => setShowModal(false)}
          classId={classId}
          courseId={
            classData?.find((c: ClassDetail) => c.id === classId)?.course.id
          }
          gradeId={
            classData?.find((c: ClassDetail) => c.id === classId)?.grade.id
          }
        />
      )}
    </>
  );
};

export default AssignmentList;
