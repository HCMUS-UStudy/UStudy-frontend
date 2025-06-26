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

const QuestionList = () => {
  const [search, setSearch] = React.useState("");
  const [selectedGradeId, setSelectedGradeId] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [user, setUser] = useState<UserData | null>(null);

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
    queryKey: ["Questions", selectedCourseId, selectedGradeId, user?.genId],
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
    return data;
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
        <h1 className="text-xl sm:text-2xl font-extrabold text-primary-darker tracking-wide drop-shadow">
          Danh sách câu hỏi
        </h1>
        <Button>
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
      <div className="hidden md:block overflow-x-auto rounded-2xl shadow-lg bg-white">
        <table className="min-w-[700px] w-full border border-gray-200 rounded-2xl text-base">
          <thead className="bg-primary-light">
            <tr>
              <th className="px-2 sm:px-4 py-2 sm:py-3 border font-semibold text-gray-700">
                #
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 border font-semibold text-gray-700 text-left">
                Mô tả
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 border font-semibold text-gray-700 text-center">
                Khối
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 border font-semibold text-gray-700 text-center">
                Môn
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 border font-semibold text-gray-700 text-center">
                Thời gian
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((q, idx) => (
              <tr
                key={q.id}
                className="bg-white hover:bg-primary-lighter transition-all cursor-pointer"
                onClick={() => router.push(`/teacher/questions/${q.id}`)}
              >
                <td className="px-2 sm:px-4 py-2 sm:py-3 border align-top text-center text-md text-gray-700">
                  {idx + 1}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 border align-top min-w-[180px] sm:min-w-[260px]">
                  <div className="text-gray-900 mb-1 line-clamp-2">
                    {q.description}
                  </div>
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 border align-top text-center text-indigo-900 font-medium">
                  {q.grade.name}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 border align-top text-center text-green-700 font-medium">
                  {q.course.name}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 border align-top text-center text-gray-700">
                  {new Date(q.createdAt).toLocaleString("vi-VN")}
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
                {new Date(q.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="font-semibold text-gray-900 text-base line-clamp-2">
              {q.description}
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
            Không tìm thấy câu hỏi phù hợp.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionList;
