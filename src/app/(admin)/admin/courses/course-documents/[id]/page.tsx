import React from "react";
import CourseDocuments from "@/app/ui/components/admin/courses/CourseDocuments";

export default async function CourseDocumentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params; // Unwrap the promise
  const courseId = resolvedParams.id;

  if (!courseId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl text-gray-600">Loading...</span>
      </div>
    );
  }

  return <CourseDocuments courseId={courseId} />;
}
