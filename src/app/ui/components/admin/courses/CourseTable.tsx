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
import SearchField from "../../_common/text-field/SearchField";
import AddCourseModal from "./AddCourseModal";

const CourseTable: React.FC = () => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { setCourseName } = useCourseAdminContext();

  const router = useRouter();

  const fetchCourses = async () => {
    let filteredData: CourseItem[] = [];
    setLoading(true);

    try {
      const response = await getAllCourses(searchQuery, currentPage - 1);

      filteredData = response.content.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        createdBy: {
          // name: item.createdBy.name,
          name: "",
        },

        createdAt: item.createdAt,
        status: item.status,
        totalGrades: item.totalGrades,
      }));

      // setCourses(response.content || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Error fetching courses.");
    } finally {
      setCourses(filteredData);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Update search query
    setCurrentPage(1); // Reset to the first page when search query changes
  };

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
    <div>
      {/* Search Field */}
      <div className="flex justify-between items-center mt-6 mb-6">
        <SearchField
          className="w-[200px]"
          placeholder="Tìm theo tên môn học..."
          value={searchQuery} // Bind the value to searchQuery state
          onChange={handleSearchChange} // Handle input changes
        />
        <div className="flex items-center mr-6">
          <AddCourseModal buttonLabel="Tạo môn học" />
        </div>
      </div>

      <div className="overflow-x-auto mt-6 max-h-[400px] mr-6">
        <Table>
          <TableHeader
            columns={[
              "Môn học",
              "Tệp đính kèm",
              "Mô tả",
              "Người tạo",
              "Ngày tạo",
              "Trạng thái",
              "Hành động",
            ]}
          />
          <TableBody isLoading={loading}>
            {error ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-4 text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => {
                        router.push(
                          `/admin/courses/course-documents/${course.id}`,
                        );
                        setCourseName(course.name);
                      }}
                      className="flex justify-center items-center mx-auto"
                    >
                      {course.totalGrades}
                      <FaPaperclip className="ml-2 mt-1 text-green-500" />
                    </button>
                  </TableCell>
                  <TableCell>{course.description || "Trống"}</TableCell>
                  <TableCell>{course.createdBy?.name || "Trống"}</TableCell>
                  <TableCell>
                    {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-white ${
                        course.status ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {course.status ? "Hoạt động" : "Tạm ngưng"}
                    </span>
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
    </div>
  );
};

export default CourseTable;
