import React from "react";
import {
  FaSearch,
} from "react-icons/fa"; // Import new icons

import Loading from "@/app/ui/components/loading";
import DocumentGrid from "@/app/ui/components/materialGrid";
import BreadCrumb from "@/app/ui/components/breadCrumb";

interface Params {
  id: string;
  subject: string;
  grade: string;
  gradeId: string;
  chapterId: string;
  chapter: string
}

const ChapterDocumentsPage = async ({ params }: { params: Params }) => {

  const { id, subject, gradeId, grade, chapterId, chapter } = await params;

  const decodedCourseId = decodeURIComponent(id);
  const decodedSubject = decodeURIComponent(subject);
  const decodedGrade = decodeURIComponent(grade);
  const decodedChapter = decodeURIComponent(chapter);
  const decodedChapterId = decodeURIComponent(chapterId);

  if (!id || !subject || !grade || !gradeId || !chapter || !chapterId) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      <BreadCrumb courseId={id} subject={decodedSubject} grade={grade} gradeId={gradeId} chapter={chapter} chapterId={chapterId}/>
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Tài liệu môn {decodedSubject} - {decodedGrade} - {decodedChapter}
      </h1>

      {/* Search and Filter Section */}
      <div className="flex justify-end items-center space-x-4 mb-6">

        <div className="flex items-center space-x-4">
          <div className="flex items-center w-full border-2 border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all">
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
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
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả tài liệu</option>
            <option value="pdf">Tài liệu PDF</option>
            <option value="docx">Tài liệu DOCX</option>
          </select>
        </div>
      </div>

      <DocumentGrid
        courseId={decodedCourseId}
        chapterId={decodedChapterId}
        documentsPerPage={5}
      />
    </div>
  );
};

export default ChapterDocumentsPage;
