"use client";

import React from "react";
import { getAllCourses } from "@/app/lib/services/course";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

interface CourseNumberProps {
  searchQuery: string;
}

const CourseNumber: React.FC<CourseNumberProps> = ({ searchQuery }) => {
  const { data: courses, status } = useQuery({
    queryKey: ["Courses"],
    queryFn: () => getAllCourses(searchQuery, 10000, 0),
    placeholderData: keepPreviousData,
  });

  return (
    <h2
      className={`text-2xl font-bold ${
        status === "pending" ? "animate-pulse text-gray-400" : ""
      }`}
    >
      Tổng số môn học (
      {status === "pending"
        ? "Đang tải..."
        : courses?.totalElements.toLocaleString("vi-VN")}
      )
    </h2>
  );
};

export default CourseNumber;
