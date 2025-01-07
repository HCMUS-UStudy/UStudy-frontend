"use client";

import React, { useEffect } from "react";
import Loading from "@/app/ui/components/common/Loading";
import DocumentGrid from "@/app/ui/components/MaterialAdmin/materialGrid";
import { SearchField } from "@/app/ui/components/common/Input";
import { useCourseAdminContext } from "@/app/context/CourseAdminContext";
import { useParams, useSearchParams } from "next/navigation";
import { useBreadcrumbContext } from "@/app/context/BreadcrumbContext";
import { getCourseById } from "@/app/lib/services/course";
import { getGradeById } from "@/app/lib/services/grade";
import { getChapterById } from "@/app/lib/services/chapter";

interface Params {
  id: string;
  subject: string;
  grade: string;
  gradeId: string;
  chapterId: string;
  chapter: string;
}

const ChapterDocumentsPage = () => {
  // const resolvedSearchParams = await searchParams;
  // const query = resolvedSearchParams?.query || "";
  //
  // const { id, subject, gradeId, grade, chapterId, chapter } = await params;
  //
  // const decodedCourseId = decodeURIComponent(id);
  // const decodedSubject = decodeURIComponent(subject);
  // const decodedGrade = decodeURIComponent(grade);
  // const decodedChapter = decodeURIComponent(chapter);
  // const decodedChapterId = decodeURIComponent(chapterId);
  //
  // if (!id || !subject || !grade || !gradeId || !chapter || !chapterId) {
  //   return <Loading />;
  // }

  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const { id, gradeId, chapterId } = useParams<{
    id: string;
    gradeId: string;
    chapterId: string;
  }>();

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
          getCourseById(id),
          getGradeById(gradeId),
          getChapterById(chapterId),
        ]);
        setCourseName(courseRes.name);
        setGradeName(gradeRes.name);
        setChapterName(chapterRes.name);
        setDynamicBreadcrumbs([courseRes.name, gradeRes.name, chapterRes.name]);
      } catch (e) {
        console.error(e);
      }
    };

    if (courseName && gradeName && chapterName) {
      setDynamicBreadcrumbs([courseName, gradeName, chapterName]);
    } else {
      fetchData();
    }
  }, []);

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      {/*<BreadCrumb
        courseId={id}
        subject={decodedSubject}
        grade={grade}
        gradeId={gradeId}
        chapter={chapter}
        chapterId={chapterId}
      />*/}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Tài liệu môn {courseName} - {gradeName} - {chapterName}
      </h1>

      {/* Search and Filter Section */}
      <div className="flex justify-end items-center space-x-4 mb-6">
        <div className="flex items-center space-x-4">
          <SearchField
            className="w-[200px]"
            placeholder="Tìm kiếm theo tên tài liệu..."
          />
          <select
            // value={selectedFilter}
            // onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả tài liệu</option>
            <option value="pdf">Tài liệu PDF</option>
            <option value="docx">Tài liệu DOCX</option>
          </select>
        </div>
      </div>

      <DocumentGrid searchQuery={query} courseId={id} chapterId={chapterId} />
    </div>
  );
};

export default ChapterDocumentsPage;
