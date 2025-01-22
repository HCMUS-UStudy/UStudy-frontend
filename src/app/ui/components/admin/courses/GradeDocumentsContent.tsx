"use client";

import React, { useEffect } from "react";
import { getCourseById } from "@/app/lib/services/course";
import { getGradeById } from "@/app/lib/services/grade";
import ChapterGrid from "@/app/ui/components/admin/courses/ChapterGrid";
import { useBreadcrumbContext } from "@/app/context/BreadcrumbContext";
import { useCourseAdminContext } from "@/app/context/CourseAdminContext";

interface GradeDocumentsContentProps {
  courseId: string;
  gradeId: string;
}

const GradeDocumentsContent: React.FC<GradeDocumentsContentProps> = ({
  courseId,
  gradeId,
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

      <ChapterGrid courseId={courseId} gradeId={gradeId} />
    </div>
  );
};

export default GradeDocumentsContent;
