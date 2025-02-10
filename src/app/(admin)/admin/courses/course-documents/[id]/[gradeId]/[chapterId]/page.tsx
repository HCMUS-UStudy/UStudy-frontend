import React from "react";
import ChapterDataContent from "@/app/ui/components/admin/courses/ChapterDataContent";

export default async function ChapterDocumentsPage(props: {
  params?: Promise<{
    id?: string;
    gradeId?: string;
    chapterId?: string;
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
  const chapterId = params?.chapterId || "";

  if (!courseId || !gradeId || !chapterId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <ChapterDataContent
      courseId={courseId}
      gradeId={gradeId}
      chapterId={chapterId}
      query={query}
    />
  );
}
