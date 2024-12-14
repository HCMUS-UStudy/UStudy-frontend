import { Button } from "@/app/ui/components/button";
import React from "react";

import GradeGrid from "@/app/ui/components/GradeAdmin/GradeGrid";
import BreadCrumb from "@/app/ui/components/bread_crumb";
import { SearchField } from "@/app/ui/components/input";

// params are automatically passed to the page component in App Router
interface Params {
  id: string;
  subject: string;
}

const CourseDocumentsPage = async ({
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

  // Await the params to get access to the properties
  const { id, subject } = await params;

  if (!id || !subject) {
    // Render a loading state when courseId or subject is null
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      <BreadCrumb courseId={id} subject={subject} />
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Tài liệu môn {decodeURIComponent(subject)}
      </h1>

      {/* Search and Filter Section */}
      <div className="flex justify-end items-center space-x-4 mb-6">
        <div className="flex items-center space-x-4">
          <SearchField
            className="w-[200px]"
            placeholder="Tìm theo tên khối học..."
          />
          <select className="px-4 py-2 border border-gray-300 rounded-md">
            <option value="">Tất cả khối học</option>
            <option value="Chapter">Khối 1</option>
            <option value="Exercises">Khối 2</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mb-4">
        <Button type="button" className="pl-6 pr-6">
          Tạo khối học
        </Button>
      </div>

      <GradeGrid searchQuery={query} courseId={id} subject={subject} />
    </div>
  );
};

export default CourseDocumentsPage;
