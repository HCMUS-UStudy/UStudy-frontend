"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/ui/components/_common/Button";
import { useQuery } from "@tanstack/react-query";
import { getAllGrades } from "@/app/lib/services/grade";
import { getCoursesByGradeId } from "@/app/lib/services/course";
import { getQuestionList } from "@/app/lib/services/question";
import { getUserDataFromCookies } from "@/app/lib/action";
import { UserData, Question } from "@/app/types";
import Tooltip from "@/app/ui/components/_common/Tooltip";
import { toast } from "react-toastify";
import QuestionModal from "@/app/ui/components/user/teacher/QuestionModal";

const QuestionList = () => {
  const [search, setSearch] = React.useState("");
  const [selectedGradeId, setSelectedGradeId] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [user, setUser] = useState<UserData | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getUserDataFromCookies();
      setUser(userInfo);
    };
    fetchData();
  }, []);

  const router = useRouter();

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
    queryFn: () =>
      getQuestionList(selectedCourseId, selectedGradeId, user?.genId || ""),
    enabled: !!user,
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
          q.grade.name.toLowerCase().includes(s) ||
          q.course.name.toLowerCase().includes(s),
      );
    // Sort giảm dần theo lastModified
    return data
      .slice()
      .sort(
        (a, b) =>
          new Date(b.lastModified).getTime() -
          new Date(a.lastModified).getTime(),
      );
  }, [search, questions]);

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

  return (
    <div className="p-2 sm:p-4 max-w-7xl mx-auto">
      <div className="mb-2 sm:mb-4 flex items-center justify-between">
        <h1 className="text-[20px] sm:text-[22px] font-extrabold text-primary-darker tracking-wide drop-shadow">
          Danh sách câu hỏi
        </h1>
        <Button
          onClick={() => {
            if (!selectedGradeId || !selectedCourseId) {
              toast.warning(
                "Vui lòng chọn khối và môn trước khi tạo câu hỏi!",
                {
                  position: "top-right",
                  autoClose: 2500,
                  pauseOnHover: false,
                  closeOnClick: true,
                },
              );
              return;
            }
            setShowModal(true);
          }}
        >
          <span className="px-2">+ Tạo câu hỏi</span>
        </Button>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center justify-between">
        <input
          type="text"
          className="w-full sm:w-80 px-3 py-2 border-2 border-primary-light rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-light text-base"
          placeholder="Tìm kiếm theo mô tả, môn, khối..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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
              <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-left">
                Mô tả
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-center">
                Khối
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-center">
                Môn
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-700 text-center">
                Loại
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 rounded-tr-xl font-semibold text-gray-700 text-center">
                Cập nhật lần cuối
              </th>
            </tr>
          </thead>
          <tbody className="rounded-b-xl">
            {filteredData.map((q, idx) => (
              <tr
                key={q.id}
                className="bg-white hover:bg-primary-lighter transition-all cursor-pointer"
                onClick={() => router.push(`/teacher/questions/${q.id}`)}
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
                      <span className="text-gray-900">
                        {q.description.slice(0, 40)}...
                      </span>
                    </Tooltip>
                  ) : (
                    q.description
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
                    {q.description.slice(0, 40)}...
                  </span>
                </Tooltip>
              ) : (
                q.description
              )}
            </div>
            <div className="flex gap-3 text-sm mt-1">
              <span className="bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded">
                {q.grade.name}
              </span>
              <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded">
                {q.course.name}
              </span>
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
