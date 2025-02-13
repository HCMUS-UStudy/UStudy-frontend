import React from "react";
import GradeDocumentsContent from "@/app/ui/components/admin/courses/GradeDocumentsContent";

export default async function GradeDocumentsPage(props: {
  params?: Promise<{
    id?: string;
    gradeId?: string;
  }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const query = searchParams?.query || "";
  const courseId = params?.id || "";
  const gradeId = params?.gradeId || "";

  if (!courseId || !gradeId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <GradeDocumentsContent
      courseId={courseId}
      gradeId={gradeId}
      query={query}
    />
  );
}
