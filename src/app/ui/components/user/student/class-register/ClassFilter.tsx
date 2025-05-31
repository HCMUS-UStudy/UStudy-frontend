"use client";
import React from "react";
import { Select, SelectItem } from "../../../_common/Select";
import { useQueries } from "@tanstack/react-query";
import { getAllGrades } from "@/app/lib/services/grade";
import { getAllCourses } from "@/app/lib/services/course";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ClassFilter() {
  const results = useQueries({
    queries: [
      {
        queryKey: ["Grades"],
        queryFn: () => getAllGrades("", 100, 0),
      },
      {
        queryKey: ["Courses"],
        queryFn: () => getAllCourses("", 100, 0),
      },
    ],
  });
  const [grades, courses] = results;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const gradeQuery = "gradeQuery";
  const courseQuery = "courseQuery";

  const handleQuery = (key: string, value: string) => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-start sm:flex-row gap-3">
      <Select
        className="text-nowrap min-w-32 w-full sm:w-auto"
        isLoading={grades.status === "pending"}
        onValueChange={(gradeId) => handleQuery(gradeQuery, gradeId as string)}
        defaultLabel="Lọc khối học"
      >
        {grades.data?.content.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.name}
          </SelectItem>
        ))}
      </Select>
      <Select
        className="text-nowrap min-w-40 w-full sm:w-auto"
        isLoading={courses.status === "pending"}
        onValueChange={(courseId) =>
          handleQuery(courseQuery, courseId as string)
        }
        defaultLabel="Lọc môn học"
      >
        {courses.data?.content.map((item) => (
          <SelectItem
            key={item.detailedCourseDto.id}
            value={item.detailedCourseDto.id}
          >
            {item.detailedCourseDto.name}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
