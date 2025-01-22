import React from "react";
import GradeDocumentsContent from "@/app/ui/components/admin/courses/GradeDocumentsContent";

export default async function GradeDocumentsPage({
  params,
}: {
  params: Promise<{ id: string; gradeId: string }>;
}) {
  const resolvedParams = await params; // Unwrap the promise
  const courseId = resolvedParams.id;
  const gradeId = resolvedParams.gradeId;

  if (!courseId || !gradeId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl text-gray-600">Loading...</span>
      </div>
    );
  }

  return <GradeDocumentsContent courseId={courseId} gradeId={gradeId} />;
}
