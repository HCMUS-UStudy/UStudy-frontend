"use client";

import React, { useEffect } from "react";
import { getCourseById } from "@/app/lib/services/course";
import { getGradeById } from "@/app/lib/services/grade";
import ChapterGrid from "@/app/ui/components/admin/courses/ChapterGrid";
import { useBreadcrumbContext } from "@/app/context/BreadcrumbContext";
import { useCourseAdminContext } from "@/app/context/CourseAdminContext";
import SearchField from "../../_common/text-field/SearchField";
import { Select, SelectItem } from "../../_common/Select";
import { Button } from "../../_common/Button";

interface GradeDocumentsContentProps {
  courseId: string;
  gradeId: string;
  query: string;
}

const GradeDocumentsContent: React.FC<GradeDocumentsContentProps> = ({
  courseId,
  gradeId,
  query,
}) => {
  const { courseName, setCourseName, gradeName, setGradeName } =
    useCourseAdminContext();

  const { setDynamicBreadcrumbs } = useBreadcrumbContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, gradeRes] = await Promise.all([
          getCourseById(courseId),
          getGradeById(gradeId),
        ]);
        setCourseName(courseRes.name);
        setGradeName(gradeRes.name);
        setDynamicBreadcrumbs([courseRes.name, gradeRes.name]);
      } catch (e) {
        console.error(e);
      }
    };

    if (courseName && gradeName) {
      setDynamicBreadcrumbs([courseName, gradeName]);
    } else {
      fetchData();
    }
  }, [courseId, gradeId, setDynamicBreadcrumbs]);

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Tài liệu môn {courseName} - {gradeName}
      </h1>

      <div className="flex justify-end items-center space-x-4 mb-6">
        <div className="flex items-center space-x-4">
          <SearchField
            className="w-[200px]"
            placeholder="Tìm theo tên chương học..."
          />
          <Select className="w-[200px]" defaultLabel="Tất cả chương học">
            <SelectItem value="">Tất cả chương học</SelectItem>
            <SelectItem value="Chapter">Chương 1</SelectItem>
            <SelectItem value="Exercises">Chương 2</SelectItem>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mb-4">
        <Button type="button" className="pl-6 pr-6">
          Tạo chương
        </Button>
      </div>

      <ChapterGrid searchQuery={query} courseId={courseId} gradeId={gradeId} />
    </div>
  );
};

export default GradeDocumentsContent;
