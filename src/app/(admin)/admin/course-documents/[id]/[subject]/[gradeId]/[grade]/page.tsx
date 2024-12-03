import { Button } from "@/app/ui/components/button";
import React from "react";
import { FaSearch } from "react-icons/fa";

import ChapterGrid from "@/app/ui/components/ChapterGrid";
import Loading from "@/app/ui/components/loading";
import BreadCrumb from "@/app/ui/components/breadCrumb";

interface Params {
  id: string;
  subject: string;
  grade: string;
  gradeId: string;
}

const GradeDocumentsPage = async ({ params }: { params: Params }) => {
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
          <div className="flex items-center w-full border-2 border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all">
            <input
              type="text"
              placeholder="Tìm kiếm theo chương..."
              // value={searchQuery}
              // onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-l-full focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition ease-in-out"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-r-full bg-white text-black hover:bg-slate-100 focus:ring-2 focus:ring-blue-300">
              <FaSearch className="h-5 w-5" />
            </button>
          </div>
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
        courseId={decodedCourseId}
        subject={decodedSubject}
        gradeId={decodedGradeId}
        grade={decodedGrade}
        chaptersPerPage={5}
      />
    </div>
  );
};

export default GradeDocumentsPage;
