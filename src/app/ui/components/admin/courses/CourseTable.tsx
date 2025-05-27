"use client";

import React, { useState } from "react";
import { FaEdit, FaTrashAlt, FaPaperclip } from "react-icons/fa";
import Pagination from "@/app/ui/components/_common/Pagination"; // Import Pagination
import { getAllCourses } from "@/app/lib/services/course";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";
import SearchField from "../../_common/text-field/SearchField";
import { HiAdjustments } from "react-icons/hi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import EmptyListOrTable from "../../_common/EmptyListOrTable";
import Tooltip from "../../_common/Tooltip";

interface CourseTableProps {
  searchQuery: string;
}

const CourseTable: React.FC<CourseTableProps> = ({ searchQuery }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // const fetchCourses = async () => {
  //   setLoading(true);
  //   setError("");

  //   try {
  //     const searchParam =
  //       searchQuery && defaultSubject
  //         ? `${defaultSubject} ${searchQuery}`
  //         : defaultSubject || searchQuery || "";

  //     const response = await getAllCourses(searchParam, 5, currentPage - 1);

  //     setCourses(response.content);
  //     setTotalPages(response.totalPages || 1);
  //   } catch (err) {
  //     console.error("Error fetching courses:", err);
  //     setError("Error fetching courses.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchCourses();
  // }, [currentPage, searchQuery, defaultSubject]);

  const { data: courses, status } = useQuery({
    queryKey: ["Courses", currentPage - 1, searchQuery],
    queryFn: () => getAllCourses(searchQuery, 5, currentPage - 1),
    placeholderData: keepPreviousData,
  });

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
      <div className="flex items-center justify-between mt-2 gap-14">
        <SearchField className="w-full" placeholder="Tìm kiếm môn học..." />
        <div className="flex items-center gap-6 px-4">
          <div className="flex items-center">
            {/* <DropdownCourse label="Lọc" onSelectCourse={setSelectedCourse} /> */}
          </div>
          <div className="flex items-center">
            <HiAdjustments className="w-6 h-6 text-gray-500 rotate-90" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto mt-6 ">
        {courses?.totalElements === 0 ? (
          <EmptyListOrTable message="Không tìm thấy môn học" />
        ) : (
          <Table>
            <TableHeader
              columns={["Môn học", "Tài liệu", "Người tạo", "Hành động"]}
            />
            <TableBody isLoading={status === "pending"}>
              {courses?.content.map((course) => (
                <TableRow key={course.detailedCourseDto.id}>
                  <TableCell>{course.detailedCourseDto.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center mx-auto">
                      {course.totalGrades}
                      <FaPaperclip className="ml-2 mt-1 text-green-500" />
                    </div>
                  </TableCell>
                  <TableCell>
                    {course.detailedCourseDto.createdBy?.name || "Trống"}
                  </TableCell>
                  <TableCell className="flex items-center gap-3">
                    <Tooltip text="Chỉnh sửa môn học">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FaEdit className="h-5 w-5" />
                      </button>
                    </Tooltip>
                    <Tooltip text="Xóa môn học">
                      <button className="text-red-600 hover:text-red-800">
                        <FaTrashAlt className="h-4 w-4" />
                      </button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={courses?.totalPages || 1}
          handlePageClick={(page) => setCurrentPage(page)}
          handlePreviousPage={() =>
            setCurrentPage((prev) => Math.max(prev - 1, 1))
          }
          handleNextPage={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, courses?.totalPages || 1),
            )
          }
        />
      </div>
    </div>
  );
};

export default CourseTable;
