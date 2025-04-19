"use client";

import React, { useState, useEffect } from "react";
import { CourseItem } from "@/app/types";
import { getAllCourses } from "@/app/lib/services/course";

interface CourseNumberProps {
  searchQuery: string;
  subjectQuery: string;
}

const CourseNumber: React.FC<CourseNumberProps> = ({
  searchQuery,
  subjectQuery,
}) => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const defaultSubject = subjectQuery === "All" ? "" : subjectQuery;

  const fetchCourses = async () => {
    setLoading(true);

    try {
      const searchParam =
        searchQuery && defaultSubject
          ? `${defaultSubject} ${searchQuery}`
          : defaultSubject || searchQuery || "";

      const response = await getAllCourses(searchParam, 10000, 0);

      setCourses(response.content);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [searchQuery, subjectQuery]);

  return (
    <h2
      className={`text-2xl font-bold ${
        loading ? "animate-pulse text-gray-400" : ""
      }`}
    >
      Tổng số môn học (
      {loading ? "Đang tải..." : courses.length.toLocaleString("vi-VN")})
    </h2>
  );
};

export default CourseNumber;
