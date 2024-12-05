"use client";

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPaperclip } from "react-icons/fa";
import Loading from "./loading";
import PaginationAdmin from "./paginationAdmin"; // Import PaginationAdmin
import { useRouter } from "next/navigation";
import { getAllCourses } from "@/app/lib/api";
import { CourseItem } from "@/app/types/type";

interface CourseTableProps {
    searchQuery: string;
}

const CourseTable: React.FC<CourseTableProps> = ({ searchQuery }) => {
    const [courses, setCourses] = useState<CourseItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const Router = useRouter();

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
                    name: item.createdBy.name,
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

    // useEffect(() => {
    //     const fetchCourseData = async () => {
    //         const authToken = localStorage.getItem("accessToken");

    //         const courseRequests = courses.map(async (course) => {
    //             const { data } = await axios.get(
    //                 'http://localhost:8080/api/grade/admin/get-grades-by-course',
    //                 {
    //                     params: {
    //                         page: 0,
    //                         limit: 1,
    //                         courseId: course.id, // Giả sử mỗi khóa học có trường 'id'
    //                     },
    //                     headers: { Authorization: `Bearer ${authToken}` },
    //                 }
    //             );

    //             return {
    //                 ...course,
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
            <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-lg">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center whitespace-nowrap">
                            Môn học
                        </th>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center whitespace-nowrap">
                            Tệp đính kèm
                        </th>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center whitespace-nowrap">
                            Mô tả
                        </th>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center whitespace-nowrap">
                            Người tạo
                        </th>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center whitespace-nowrap">
                            Ngày tạo
                        </th>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center whitespace-nowrap">
                            Trạng thái
                        </th>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center whitespace-nowrap">
                            Hành động
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={8} className="text-center py-4">
                                <Loading />
                            </td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={8} className="text-center py-4 text-red-500">
                                {error}
                            </td>
                        </tr>
                    ) : courses.length > 0 ? (
                        courses.map((course) => (
                            <tr key={course.id}>
                                <td className="px-6 py-4 text-sm text-gray-700 text-center">{course.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                                    <button
                                        onClick={() => Router.push(`/admin/courses/course-documents/${encodeURIComponent(course.id)}/${encodeURIComponent(course.name)}`)}
                                        className="flex justify-center items-center mx-auto"
                                    >
                                        {course.totalGrades}
                                        <FaPaperclip className="ml-2 mt-1 text-green-500" />
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 text-center">{course.description || "Trống"}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                                    {course.createdBy?.name || "Trống"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                                    {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                                </td>
                                <td className="px-6 py-4 text-sm text-center">
                                    <span
                                        className={`px-2 py-1 rounded-full text-white ${course.status ? "bg-green-500" : "bg-red-500"}`}
                                    >
                                        {course.status ? "Hoạt động" : "Tạm ngưng"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 flex justify-center items-center space-x-3">
                                    <button className="text-blue-600 hover:text-blue-800">
                                        <FaEdit className="h-5 w-5" />
                                    </button>
                                    <button className="text-red-600 hover:text-red-800">
                                        <FaTrashAlt className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} className="text-center py-4">
                                Không tìm thấy khóa học.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <PaginationAdmin
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                handlePreviousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                handleNextPage={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            />
        </div>
    );
};

export default CourseTable;
