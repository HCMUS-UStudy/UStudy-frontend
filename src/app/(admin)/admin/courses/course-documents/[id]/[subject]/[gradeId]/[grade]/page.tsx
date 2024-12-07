import { Button } from "@/app/ui/components/button";
import React from "react";

import ChapterGrid from "@/app/ui/components/ChapterAdmin/ChapterGrid";
import Loading from "@/app/ui/components/loading";
import BreadCrumb from "@/app/ui/components/breadCrumb";
import { SearchField } from "@/app/ui/components/input";

interface Params {
  id: string;
  subject: string;
  grade: string;
  gradeId: string;
}

const GradeDocumentsPage = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";

  // Decode the params here
  const { id, subject, gradeId, grade } = await params;

  const decodedCourseId = decodeURIComponent(id);
  const decodedSubject = decodeURIComponent(decodeURIComponent(subject));
  const decodedGrade = decodeURIComponent(grade);
  const decodedGradeId = decodeURIComponent(gradeId);

  if (!decodedCourseId || !decodedSubject || !decodedGrade || !decodedGradeId) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      <BreadCrumb courseId={id} subject={decodedSubject} grade={grade} gradeId={gradeId} />
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Tài liệu môn {decodedSubject} - {decodedGrade}
      </h1>

      {/* Search and Filter Section */}
      <div className="flex justify-end items-center space-x-4 mb-6">
        <div className="flex items-center space-x-4">
          <SearchField className="w-[200px]" placeholder="Tìm theo tên chương học..." />
          <select
            // value={selectedFilter}
            // onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md">
            <option value="">Tất cả chương</option>
            <option value="Chapter">Chương 1</option>
            <option value="Exercises">Chương 2</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mb-4">
        <Button
          //onClick={onCreateCourse}
          type="button"
          className="pl-6 pr-6">
          Tạo chương
        </Button>
      </div>

      <ChapterGrid
        searchQuery={query}
        courseId={decodedCourseId}
        subject={decodedSubject}
        gradeId={decodedGradeId}
        grade={decodedGrade}
      />
    </div>
  );
};

export default GradeDocumentsPage;
