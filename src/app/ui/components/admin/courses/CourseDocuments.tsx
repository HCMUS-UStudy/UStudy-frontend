"use client";

import React, { useEffect, useState } from "react";
import GradeGrid from "@/app/ui/components/admin/courses/GradeGrid";
import { getCourseById } from "@/app/lib/services/course";
import { useBreadcrumbContext } from "@/app/context/BreadcrumbContext";
import { useCourseAdminContext } from "@/app/context/CourseAdminContext";

interface CourseDocumentsProps {
  courseId: string;
}

const CourseDocuments: React.FC<CourseDocumentsProps> = ({ courseId }) => {
  const [courseName, setCourseName] = useState<string>("");
  const { setDynamicBreadcrumbs } = useBreadcrumbContext();
  const { setCourseName: setContextCourseName } = useCourseAdminContext();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const course = await getCourseById(courseId);
        setCourseName(course.name);
        setContextCourseName(course.name);
        setDynamicBreadcrumbs([course.name]);
      } catch (error) {
        console.error("Failed to fetch course data:", error);
      }
    };

    fetchCourseData();
  }, [courseId, setDynamicBreadcrumbs, setContextCourseName]);

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Tài liệu môn {courseName || "Loading..."}
      </h1>

      <GradeGrid courseId={courseId} />
    </div>
  );
};

export default CourseDocuments;
