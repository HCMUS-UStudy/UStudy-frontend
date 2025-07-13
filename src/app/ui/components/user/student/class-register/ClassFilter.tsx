"use client";
import React from "react";
import { Select, SelectItem } from "../../../_common/Select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/app/store/store";

const ClassFilter: React.FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const gradeQuery = "gradeQuery";

  const { grades } = useAppSelector((state) => state.grades);
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
        onValueChange={(gradeId) => handleQuery(gradeQuery, gradeId as string)}
        defaultLabel="Lọc khối học"
      >
        {grades.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.name}
          </SelectItem>
        ))}
      </Select>
      {/* <Select
        className="text-nowrap min-w-40 w-full sm:w-auto"
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
      </Select> */}
    </div>
  );
};

export default ClassFilter;
