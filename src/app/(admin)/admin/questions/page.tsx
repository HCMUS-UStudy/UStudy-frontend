"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/ui/components/_common/Button";
import { useQuery } from "@tanstack/react-query";
import { getAllGrades } from "@/app/lib/services/grade";
import { getCoursesByGradeId } from "@/app/lib/services/course";
import { getQuestionList } from "@/app/lib/services/question";
import { Question, UserData } from "@/app/types";
import Tooltip from "@/app/ui/components/_common/Tooltip";
import QuestionModal from "@/app/ui/components/user/teacher/QuestionModal";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import { getUserDataFromCookies } from "@/app/lib/action";
import Checkbox from "@/app/ui/components/_common/Checkbox";
import MarkdownInput from "@/app/ui/components/_common/text-field/MarkdownInput";
import { safeSliceMathMarkdown } from "@/app/lib/utils";

const QuestionList = () => {
  const [search, setSearch] = React.useState("");
  const [showMine, setShowMine] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [selectedGradeId, setSelectedGradeId] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [sortField, setSortField] = useState<string>("lastModified");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc" | "none">("desc");

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const u = await getUserDataFromCookies();
      setUser(u);
    };
    fetchUser();
  }, []);

  const { data: gradesData } = useQuery({
    queryKey: ["Grades"],
    queryFn: () => getAllGrades("", 100, 0),
    refetchOnWindowFocus: false,
  });

  const { data: coursesData, isLoading: isLoadingCourse } = useQuery({
    queryKey: ["Courses", selectedGradeId],
    queryFn: () => getCoursesByGradeId(selectedGradeId),
    enabled: !!selectedGradeId, // KHÔNG gọi khi chọn tất cả khối
    refetchOnWindowFocus: false,
  });

  // Đảm bảo useQuery gọi lại khi selectedGradeId hoặc selectedCourseId thay đổi
  const questionQuery = useQuery({
    queryKey: ["Questions", selectedCourseId, selectedGradeId],
    queryFn: () => getQuestionList(selectedCourseId, selectedGradeId),
    refetchOnWindowFocus: false,
  });

  const questions: Question[] = React.useMemo(
    () => questionQuery.data || [],
    [questionQuery.data],
  );

  const filteredData = React.useMemo(() => {
    let data = questions;
    const s = search.trim().toLowerCase();
    if (s)
      data = data.filter(
        (q) =>
          q.description.toLowerCase().includes(s) ||
          q.createdBy.name.toLowerCase().includes(s),
      );
    if (showMine && user?.genId) {
      data = data.filter((q) => q.createdBy?.genId === user.genId);
    }
    // Sort giảm dần theo lastModified
    return data
      .slice()
      .sort(
        (a, b) =>
          new Date(b.lastModified).getTime() -
          new Date(a.lastModified).getTime(),
      );
  }, [search, questions, showMine, user]);

  // Sửa useEffect: chỉ set mặc định khi lần đầu vào trang (selectedGradeId === undefined)
  useEffect(() => {
    if (gradesData?.content?.length && selectedGradeId === undefined) {
      setSelectedGradeId(gradesData.content[0].id);
      setSelectedCourseId("");
    }
  }, [gradesData, selectedGradeId]);

  useEffect(() => {
    if (coursesData && coursesData.content && coursesData.content.length > 0) {
      setSelectedCourseId(coursesData.content[0].id);
    } else {
      setSelectedCourseId("");
    }
  }, [coursesData]);

  const handleSort = (field: string) => {
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
      let aValue: string | number = "",
        bValue: string | number = "";
      switch (sortField) {
        case "description":
          aValue = a.description;
          bValue = b.description;
          break;
        case "grade":
          aValue = a.grade.name;
          bValue = b.grade.name;
          break;
        case "course":
          aValue = a.course.name;
          bValue = b.course.name;
          break;
        case "questionType":
          aValue = a.questionType;
          bValue = b.questionType;
          break;
        case "createdBy":
          aValue = a.createdBy.genId;
          bValue = b.createdBy.genId;
          break;
        case "lastModified":
        default:
          aValue = new Date(a.lastModified).getTime();
          bValue = new Date(b.lastModified).getTime();
          break;
      }
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortOrder]);
  const { addToast } = useCustomToast();

  return (
    <div className="p-2 sm:p-4 mx-auto">
      <div className="mb-2 sm:mb-4 flex items-center justify-between">
        <h1 className="text-[20px] sm:text-[22px] font-extrabold text-primary-darker tracking-wide drop-shadow">
          Danh sách câu hỏi
        </h1>
        <Button
          onClick={() => {
            if (!selectedGradeId || !selectedCourseId) {
              addToast.warning(
                "Vui lòng chọn khối và môn trước khi tạo câu hỏi!",
              );
              return;
            }
            setShowModal(true);
          }}
        >
          <span className="px-2">+ Tạo câu hỏi</span>
        </Button>
      </div>
      <div className="mb-4 flex flex-col lg:flex-row gap-2 lg:gap-6 items-center lg:justify-between">
        <input
          type="text"
          className="w-full lg:w-2/3 px-3 py-2 border-2 border-primary-light rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-light text-sm"
          placeholder="Tìm kiếm theo mô tả, người tạo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex lg:justify-end gap-2 w-full items-center mr-1">
          <select
            className="border rounded-lg border-primary-dark px-2 py-1 focus:outline-none
            focus:ring-1 focus:ring-primary-dark z-auto text-[14.5px]"
            value={selectedGradeId}
            onChange={(e) => {
              const newGradeId = e.target.value;
              setSelectedGradeId(newGradeId);
              setSelectedCourseId("");
            }}
          >
            <option value="">Tất cả khối</option>
            {gradesData?.content.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            className="border rounded-lg border-primary-dark px-2 py-1 focus:outline-none
            focus:ring-1 focus:ring-primary-dark z-auto text-[14.5px]"
            value={selectedCourseId}
            disabled={isLoadingCourse}
            onChange={(e) => {
              const newCourseId = e.target.value;
              setSelectedCourseId(newCourseId);
            }}
          >
            <option value="">Tất cả môn</option>
            {isLoadingCourse ? (
              <option value="" disabled>
                Đang tải môn học...
              </option>
            ) : coursesData?.content && coursesData.content.length > 0 ? (
              coursesData.content.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                Không có môn học
              </option>
            )}
          </select>
          <div
            className="flex items-center gap-1 cursor-pointer ml-2 select-none"
            onClick={() => setShowMine(!showMine)}
          >
            <Checkbox
              checked={showMine}
              onChange={() => setShowMine(!showMine)}
              className="border-primary-dark"
            />
            <span className="text-[13px] sm:text-[14.5px] whitespace-nowrap">
              <span className="hidden sm:inline">Câu hỏi của tôi</span>
              <span className="inline sm:hidden">Hiện của tôi</span>
            </span>
          </div>
        </div>
      </div>
      {/* Table for desktop, card for mobile */}
      <div className="hidden md:block shadow-lg bg-white rounded-b-xl">
        <table className="min-w-[700px] w-full rounded-b-xl">
          <thead className="bg-primary-light">
            <tr>
              <th className="px-2 sm:px-3 py-2 sm:py-3 rounded-tl-xl font-semibold text-gray-700">
                #
              </th>
              <th
                className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-left cursor-pointer select-none"
                onClick={() => handleSort("description")}
              >
                Mô tả
                {sortField === "description" && sortOrder === "desc" && (
                  <FaSortDown className="inline ml-1" />
                )}
                {sortField === "description" && sortOrder === "asc" && (
                  <FaSortUp className="inline ml-1" />
                )}
                {sortField === "description" && sortOrder === "none" && (
                  <FaSort className="inline ml-1" />
                )}
                {sortField !== "description" && (
                  <FaSort className="inline ml-1 text-gray-400" />
                )}
              </th>
              <th
                className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-center cursor-pointer select-none"
                onClick={() => handleSort("grade")}
              >
                Khối
                {sortField === "grade" && sortOrder === "desc" && (
                  <FaSortDown className="inline ml-1" />
                )}
                {sortField === "grade" && sortOrder === "asc" && (
                  <FaSortUp className="inline ml-1" />
                )}
                {sortField === "grade" && sortOrder === "none" && (
                  <FaSort className="inline ml-1" />
                )}
                {sortField !== "grade" && (
                  <FaSort className="inline ml-1 text-gray-400" />
                )}
              </th>
              <th
                className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-center cursor-pointer select-none"
                onClick={() => handleSort("course")}
              >
                Môn
                {sortField === "course" && sortOrder === "desc" && (
                  <FaSortDown className="inline ml-1" />
                )}
                {sortField === "course" && sortOrder === "asc" && (
                  <FaSortUp className="inline ml-1" />
                )}
                {sortField === "course" && sortOrder === "none" && (
                  <FaSort className="inline ml-1" />
                )}
                {sortField !== "course" && (
                  <FaSort className="inline ml-1 text-gray-400" />
                )}
              </th>
              <th
                className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-center cursor-pointer select-none"
                onClick={() => handleSort("questionType")}
              >
                Loại
                {sortField === "questionType" && sortOrder === "desc" && (
                  <FaSortDown className="inline ml-1" />
                )}
                {sortField === "questionType" && sortOrder === "asc" && (
                  <FaSortUp className="inline ml-1" />
                )}
                {sortField === "questionType" && sortOrder === "none" && (
                  <FaSort className="inline ml-1" />
                )}
                {sortField !== "questionType" && (
                  <FaSort className="inline ml-1 text-gray-400" />
                )}
              </th>
              <th
                className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-center cursor-pointer select-none"
                onClick={() => handleSort("createdBy")}
              >
                Người tạo
                {sortField === "createdBy" && sortOrder === "desc" && (
                  <FaSortDown className="inline ml-1" />
                )}
                {sortField === "createdBy" && sortOrder === "asc" && (
                  <FaSortUp className="inline ml-1" />
                )}
                {sortField === "createdBy" && sortOrder === "none" && (
                  <FaSort className="inline ml-1" />
                )}
                {sortField !== "createdBy" && (
                  <FaSort className="inline ml-1 text-gray-400" />
                )}
              </th>
              <th
                className="px-2 sm:px-4 py-2 sm:py-3 rounded-tr-xl font-semibold text-gray-700 text-center cursor-pointer select-none"
                onClick={() => handleSort("lastModified")}
              >
                Cập nhật lần cuối
                {sortField === "lastModified" && sortOrder === "desc" && (
                  <FaSortDown className="inline ml-1" />
                )}
                {sortField === "lastModified" && sortOrder === "asc" && (
                  <FaSortUp className="inline ml-1" />
                )}
                {sortField === "lastModified" && sortOrder === "none" && (
                  <FaSort className="inline ml-1" />
                )}
                {sortField !== "lastModified" && (
                  <FaSort className="inline ml-1 text-gray-400" />
                )}
              </th>
            </tr>
          </thead>
          <tbody className="rounded-b-xl">
            {sortedData.map((q, idx) => (
              <tr
                key={q.id}
                className="bg-white hover:bg-primary-lighter transition-all cursor-pointer"
                onClick={() => router.push(`/admin/questions/${q.id}`)}
              >
                <td
                  className={`px-2 sm:px-3 py-2 sm:py-3 align-top text-center text-md text-gray-700
                  ${idx === filteredData.length - 1 ? "rounded-bl-xl" : ""}
                  `}
                >
                  {idx + 1}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 align-top min-w-[180px] sm:min-w-[260px] overflow-visible">
                  {q.description.length > 40 ? (
                    <Tooltip text={q.description}>
                      <span className="flex text-gray-900">
                        <MarkdownInput
                          content={safeSliceMathMarkdown(q.description, 40)}
                        />{" "}
                        <div>...</div>
                      </span>
                    </Tooltip>
                  ) : (
                    <MarkdownInput content={q.description} />
                  )}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 align-top text-center text-indigo-900 font-medium">
                  {q.grade.name}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 align-top text-center text-green-700 font-medium">
                  {q.course.name}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 align-top text-center font-medium">
                  {q.questionType === "MULTIPLE_CHOICE"
                    ? "Trắc nghiệm"
                    : "Tự luận"}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 align-top text-center font-medium">
                  {q.createdBy?.name || ""}
                </td>
                <td
                  className={`px-2 sm:px-4 py-2 sm:py-3 align-top text-center text-gray-700
                    ${idx === filteredData.length - 1 ? "rounded-br-xl" : ""}
                  `}
                >
                  {new Date(q.lastModified).toLocaleString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Không tìm thấy câu hỏi phù hợp.
          </div>
        )}
      </div>
      {/* Card view for mobile */}
      <div className="md:hidden space-y-4">
        {filteredData.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white rounded-xl shadow border border-gray-100 p-4 flex flex-col gap-2 cursor-pointer hover:bg-primary-lighter transition"
            onClick={() => router.push(`/teacher/questions/${q.id}`)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">#{idx + 1}</span>
              <span className="text-xs text-gray-500">
                {new Date(q.lastModified).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="text-gray-900 text-base line-clamp-2">
              {q.description.length > 40 ? (
                <Tooltip text={q.description}>
                  <span className="text-gray-900">
                    <MarkdownInput
                      content={safeSliceMathMarkdown(q.description, 40)}
                    />
                  </span>
                </Tooltip>
              ) : (
                <MarkdownInput content={q.description} />
              )}
            </div>
            <div className="flex gap-3 text-sm mt-1 justify-between">
              <div className="flex gap-2">
                <span className="bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded">
                  {q.grade.name}
                </span>
                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded">
                  {q.course.name}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="bg-gray-50 text-gray-700 px-2 py-0.5 rounded">
                  {q.questionType === "MULTIPLE_CHOICE"
                    ? "Trắc nghiệm"
                    : "Tự luận"}
                </span>
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                  {q.createdBy?.name || ""}
                </span>
              </div>
            </div>
          </div>
        ))}
        {filteredData.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Không tìm thấy câu hỏi.
          </div>
        )}
      </div>
      {showModal && (
        <QuestionModal
          onGoBack={() => setShowModal(false)}
          onClose={() => setShowModal(false)}
          gradeId={selectedGradeId}
          courseId={selectedCourseId}
          returnButton={false}
        />
      )}
    </div>
  );
};

export default QuestionList;
