import React from "react";

import CourseTable from "@/app/ui/components/admin/courses/CourseTable";
import AddCourseModal from "@/app/ui/components/admin/courses/AddCourseModal";
import CourseNumber from "@/app/ui/components/admin/courses/CourseNumber";

//import DropdownCourse from "@/app/ui/components/admin/courses/DropdownCourse";

export default async function CoursePage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    subject?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  return (
    <>
      <div className="px-2">
        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between w-full ">
          <CourseNumber searchQuery={query} />
          <AddCourseModal buttonLabel="Tạo môn học" />
        </div>

        <CourseTable searchQuery={query} />
      </div>
    </>
  );
}
