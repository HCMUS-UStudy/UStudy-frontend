"use client";

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPaperclip } from "react-icons/fa";
import Pagination from "@/app/ui/components/_common/Pagination"; // Import Pagination
import { useRouter } from "next/navigation";
import { CourseItem } from "@/app/types/type";
import { useCourseAdminContext } from "@/app/context/CourseAdminContext";
import { getAllCourses } from "@/app/lib/services/course";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";

interface CourseTableProps {
  searchQuery: string;
  subjectQuery: string;
}

const CourseTable: React.FC<CourseTableProps> = ({
  searchQuery,
  subjectQuery,
}) => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { setCourseName } = useCourseAdminContext();

  const router = useRouter();

  const defaultSubject = subjectQuery === "All" ? "" : subjectQuery;

  const fetchCourses = async () => {
    setLoading(true);
    setError("");

    try {
      const searchParam =
        searchQuery && defaultSubject
          ? `${defaultSubject} ${searchQuery}`
          : defaultSubject || searchQuery || "";

      const response = await getAllCourses(searchParam, 5, currentPage - 1);

      setCourses(response.content);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Error fetching courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchQuery, defaultSubject]);

  // useEffect(() => {
  //     const fetchCourseData = async () => {
  //         const authToken = localStorage.getItem("accessToken");

  //         const courseRequests = courses.map(async (courses) => {
  //             const { data } = await axios.get(
  //                 'http://localhost:8080/api/grade/admin/get-grades-by-course',
  //                 {
  //                     params: {
  //                         page: 0,
  //                         limit: 1,
  //                         courseId: courses.id, // Giả sử mỗi khóa học có trường 'id'
  //                     },
  //                     headers: { Authorization: `Bearer ${authToken}` },
  //                 }
  //             );

  //             return {
  //                 ...courses,
  //                 totalElements: data.totalElements || 0, // Lưu trữ tổng số phần tử hoặc 0 nếu không có dữ liệu
  //             };
  //         });

  //         const updatedCourses = await Promise.all(courseRequests);
  //         setCourseData(updatedCourses); // Cập nhật dữ liệu khóa học với totalElements
  //     };

  //     fetchCourseData();
  // }, [courses]); // Chạy lại khi danh sách khóa học thay đổi

  return (
    <div className="overflow-x-auto max-h-[400px]">
      <Table>
        <TableHeader
          columns={["Môn học", "Tài liệu", "Người tạo", "Hành động"]}
        />
        <TableBody isLoading={loading}>
          {error ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4 text-red-500">
                {error}
              </TableCell>
            </TableRow>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <TableRow key={course.courseDto.id}>
                <TableCell>{course.courseDto.name}</TableCell>
                <TableCell>
                  <button
                    onClick={() => {
                      router.push(
                        `/admin/courses/course-documents/${course.courseDto.id}`,
                      );
                      setCourseName(course.courseDto.name);
                    }}
                    className="flex justify-center items-center mx-auto"
                  >
                    {course.totalGrades}
                    <FaPaperclip className="ml-2 mt-1 text-green-500" />
                  </button>
                </TableCell>
                <TableCell>
                  {course.courseDto.createdBy?.name || "Trống"}
                </TableCell>
                <TableCell className="flex justify-center items-center space-x-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <FaTrashAlt className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                Không tìm thấy khóa học.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageClick={(page) => setCurrentPage(page)}
        handlePreviousPage={() =>
          setCurrentPage((prev) => Math.max(prev - 1, 1))
        }
        handleNextPage={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
      />
    </div>
  );
};

export default CourseTable;
