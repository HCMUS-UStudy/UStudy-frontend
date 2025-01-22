"use client";

import React, { useEffect } from "react";
import { useCourseAdminContext } from "@/app/context/CourseAdminContext";
import { useBreadcrumbContext } from "@/app/context/BreadcrumbContext";
import { getCourseById } from "@/app/lib/services/course";
import { getGradeById } from "@/app/lib/services/grade";
import { getChapterById } from "@/app/lib/services/chapter";
import DocumentGrid from "./MaterialGrid";

interface ChapterDataContentProps {
  courseId: string;
  gradeId: string;
  chapterId: string;
}

const ChapterDataContent: React.FC<ChapterDataContentProps> = ({
  courseId,
  gradeId,
  chapterId,
}) => {
  const { setDynamicBreadcrumbs } = useBreadcrumbContext();
  const {
    courseName,
    setCourseName,
    gradeName,
    setGradeName,
    chapterName,
    setChapterName,
  } = useCourseAdminContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, gradeRes, chapterRes] = await Promise.all([
          getCourseById(courseId),
          getGradeById(gradeId),
          getChapterById(chapterId),
        ]);

        setCourseName(courseRes.name);
        setGradeName(gradeRes.name);
        setChapterName(chapterRes.name);
        setDynamicBreadcrumbs([courseRes.name, gradeRes.name, chapterRes.name]);
      } catch (e) {
        console.error("Error fetching chapter data:", e);
      }
    };

    if (courseName && gradeName && chapterName) {
      setDynamicBreadcrumbs([courseName, gradeName, chapterName]);
    } else {
      fetchData();
    }
  }, [courseId, gradeId, chapterId, setDynamicBreadcrumbs]);

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Tài liệu môn {courseName} - {gradeName} - {chapterName}
      </h1>

      <DocumentGrid courseId={courseId} chapterId={chapterId} />
    </div>
  );
};

export default ChapterDataContent;
