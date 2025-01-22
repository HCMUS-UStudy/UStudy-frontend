import React from "react";
import ChapterDataContent from "@/app/ui/components/admin/courses/ChapterDataContent";

export default async function ChapterDocumentsPage({
  params,
}: {
  params: Promise<{ id: string; gradeId: string; chapterId: string }>;
}) {
  const resolvedParams = await params; // Unwrap the promise
  const courseId = resolvedParams.id;
  const gradeId = resolvedParams.gradeId;
  const chapterId = resolvedParams.chapterId;

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
    />
  );
}
