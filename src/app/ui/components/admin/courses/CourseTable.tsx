"use client";

import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
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
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import EmptyListOrTable from "../../_common/EmptyListOrTable";
import Tooltip from "../../_common/Tooltip";
import EditCourse from "./EditCourse";
import { CourseItem } from "@/app/types";

interface CourseTableProps {
  searchQuery: string;
}

const CourseTable: React.FC<CourseTableProps> = ({ searchQuery }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [course, setCourse] = useState<CourseItem>();

  const { data: courses, status } = useQuery({
    queryKey: ["Courses", currentPage - 1, searchQuery],
    queryFn: () => getAllCourses(searchQuery, 10, currentPage - 1),
    placeholderData: keepPreviousData,
  });

  return (
    <div>
      <div className="flex items-center justify-between mt-2 gap-14">
        <SearchField className="w-full" placeholder="Tìm kiếm môn học..." />
      </div>
      <div className="overflow-x-auto mt-3 ">
        {courses?.totalElements === 0 ? (
          <EmptyListOrTable message="Không tìm thấy môn học" />
        ) : (
          <Table>
            <TableHeader
              columns={[
                "Môn học",
                "Số khối tương ứng",
                "Người tạo",
                "Hành động",
              ]}
            />
            <TableBody isLoading={status === "pending"}>
              {courses?.content.map((course) => (
                <TableRow key={course.detailedCourseDto.id}>
                  <TableCell>{course.detailedCourseDto.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center mx-auto">
                      {course.totalGrades}
                    </div>
                  </TableCell>
                  <TableCell>
                    {course.detailedCourseDto.createdBy?.name || "Trống"}
                  </TableCell>
                  <TableCell className="flex items-center gap-3 px-10">
                    <Tooltip text="Chỉnh sửa môn học">
                      <button
                        onClick={() => {
                          setCourse(course);
                          setIsOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit className="h-5 w-5" />
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
      <EditCourse
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        course={course}
      />
    </div>
  );
};

export default CourseTable;
