"use client";

import { useEffect } from "react";
import { Button } from "@/app/ui/components/_common/Button";
import { Select, SelectItem } from "@/app/ui/components/_common/Select";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import { useBreadcrumbContext } from "@/app/context/BreadcrumbContext";
import { useCourseAdminContext } from "@/app/context/CourseAdminContext";
import { getCourseById } from "@/app/lib/services/course";
import MaterialsGrid from "./MaterialsGrid";

interface MaterialsContentProps {
  courseId: string;
  query: string;
}

export default function MaterialsContent({
  courseId,
  query,
}: MaterialsContentProps) {
  const { setDynamicBreadcrumbs } = useBreadcrumbContext();
  const { courseName, setCourseName } = useCourseAdminContext();

  useEffect(() => {
    // Get courses by id
    const fetchCourseData = async () => {
      try {
        const res = await getCourseById(courseId);
        // setCourse(res);
        setCourseName(res.name);
        setDynamicBreadcrumbs([res.name]);
      } catch (error) {
        console.error(error);
      }
    };
    if (courseName) {
      setDynamicBreadcrumbs([courseName]);
    } else {
      fetchCourseData();
    }
  }, [courseName]);

  return (
    <>
      <div className="p-6 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
          Tài liệu môn {courseName}
        </h1>
        <div className="flex justify-end items-center space-x-4 mb-6">
          <div className="flex items-center space-x-4">
            <SearchField
              className="w-[200px]"
              placeholder="Tìm theo tên khối học..."
            />
            <Select className="w-[200px]" defaultLabel="Tất cả khối học">
              <SelectItem value="">Tất cả khối học</SelectItem>
              <SelectItem value="Chapter">Khối 1</SelectItem>
              <SelectItem value="Exercises">Khối 2</SelectItem>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mb-4">
          <Button type="button" className="pl-6 pr-6">
            Tạo khối học
          </Button>
        </div>

        <MaterialsGrid searchQuery={query} courseId={courseId} />
      </div>
    </>
  );
}
