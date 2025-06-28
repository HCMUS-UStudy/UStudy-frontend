"use client";

import React, { useState, useEffect, useCallback } from "react";
import { GradeItem } from "@/app/types";
import { getAllGrades } from "@/app/lib/services/grade";

interface GradeNumberProps {
  searchQuery: string;
  gradeQuery: string;
}

const GradeNumber: React.FC<GradeNumberProps> = ({
  searchQuery,
  gradeQuery,
}) => {
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const defaultGrade = gradeQuery === "All" ? "" : gradeQuery;

  const fetchGrades = useCallback(async () => {
    setLoading(true);

    try {
      const searchParam =
        searchQuery && defaultGrade
          ? `${defaultGrade} ${searchQuery}`
          : defaultGrade || searchQuery || "";

      const response = await getAllGrades(searchParam, 10000, 0);

      const filteredData: GradeItem[] = response.content.map((item) => ({
        id: item.id,
        name: item.name,
      }));

      setGrades(filteredData);
    } catch (err) {
      console.error("Error fetching grades:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, defaultGrade, setGrades, setLoading]);

  useEffect(() => {
    fetchGrades();
  }, [searchQuery, gradeQuery, fetchGrades]);

  return (
    <h2
      className={`text-lg md:text-2xl font-bold ${
        loading ? "animate-pulse text-gray-400" : ""
      }`}
    >
      Tổng số khối học (
      {loading ? "Đang tải..." : grades.length.toLocaleString("vi-VN")})
    </h2>
  );
};

export default GradeNumber;
