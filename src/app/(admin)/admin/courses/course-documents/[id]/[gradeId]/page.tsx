"use client";

import { Button } from "@/app/ui/components/_common/Button";
import React, { useEffect } from "react";

import ChapterGrid from "@/app/ui/components/admin/courses/ChapterGrid";
import Loading from "@/app/ui/components/_common/Loading";
import { useBreadcrumbContext } from "@/app/context/BreadcrumbContext";
import { useCourseAdminContext } from "@/app/context/CourseAdminContext";
import { useParams, useSearchParams } from "next/navigation";
import { getCourseById } from "@/app/lib/services/course";
import { getGradeById } from "@/app/lib/services/grade";
import { Select, SelectItem } from "@/app/ui/components/_common/Select";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";

interface Params {
  id: string;
  // subject: string;
  // grade: string;
  gradeId: string;
}

const GradeDocumentsPage = () => {
  // const resolvedSearchParams = await searchParams;
  // const query = resolvedSearchParams?.query || "";
  //
  // // Decode the params here
  // const { id, subject, gradeId, grade } = await params;
  //
  // const decodedCourseId = decodeURIComponent(id);
  // const decodedSubject = decodeURIComponent(decodeURIComponent(subject));
  // const decodedGrade = decodeURIComponent(grade);
  // const decodedGradeId = decodeURIComponent(gradeId);
  //
  // if (!decodedCourseId || !decodedSubject || !decodedGrade || !decodedGradeId) {
  //   return <Loading />;
  // }
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const { id, gradeId } = useParams<{ id: string; gradeId: string }>();
  const { setDynamicBreadcrumbs } = useBreadcrumbContext();
  const { courseName, setCourseName, gradeName, setGradeName } =
    useCourseAdminContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, gradeRes] = await Promise.all([
          getCourseById(id),
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
  }, []);

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      {/*<BreadCrumb
        courseId={id}
        subject={decodedSubject}
        grade={grade}
        gradeId={gradeId}
      />*/}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Tài liệu môn {courseName} - {gradeName}
      </h1>

      {/* Search and Filter Section */}
      <div className="flex justify-end items-center space-x-4 mb-6">
        <div className="flex items-center space-x-4">
          <SearchField
            className="w-[200px]"
            placeholder="Tìm theo tên chương học..."
          />
          {/*<select
            // value={selectedFilter}
            // onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Tất cả chương</option>
            <option value="Chapter">Chương 1</option>
            <option value="Exercises">Chương 2</option>
          </select>*/}
          <Select
            className="w-[200px]"
            defaultLabel="Tất cả chương"
            // onValueChange={(value) => setSelectedFilter(value)}
          >
            <SelectItem value="">Tất cả khối học</SelectItem>
            <SelectItem value="chapter-1">Chương 1</SelectItem>
            <SelectItem value="chapter-2">Chương 2</SelectItem>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mb-4">
        <Button
          //onClick={onCreateCourse}
          type="button"
          className="pl-6 pr-6"
        >
          Tạo chương
        </Button>
      </div>

      <ChapterGrid searchQuery={query} courseId={id} gradeId={gradeId} />
    </div>
  );
};

export default GradeDocumentsPage;
