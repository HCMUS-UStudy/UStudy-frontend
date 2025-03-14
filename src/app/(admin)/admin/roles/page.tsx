import React, { Suspense } from "react";

import AddCourseModal from "@/app/ui/components/admin/courses/AddCourseModal";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import { HiAdjustments } from "react-icons/hi";
import RoleDisplay from "@/app/ui/components/admin/roles/RoleDisplay";

// props: {
//   searchParams?: Promise<{
//     query?: string;
//     page?: string;
//     subject?: string;
//   }>;
// }

export default async function RolePage() {
  //const searchParams = await props.searchParams;
  // const query = searchParams?.query || "";
  // const subject = searchParams?.subject || "All";

  return (
    <>
      <div className="px-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Tổng số chức vụ ({4})</h2>
          <div className="flex items-center space-x-2">
            <AddCourseModal buttonLabel="Tạo chức vụ" />
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 gap-14">
          <Suspense>
            <SearchField
              className="w-full bg-primary-lighter py-[2px] rounded-2xl"
              placeholder="Tìm kiếm theo vai trò..."
            />
          </Suspense>
          <div className="flex items-center gap-6 px-4">
            <div className="flex items-center">
              {/* <DropdownCourse label="Lọc" /> */}
            </div>
            <div className="flex items-center">
              <HiAdjustments className="w-6 h-6 text-gray-500 rotate-90" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mt-6 max-h-[400px]">
          {/* <CourseTable searchQuery={query} subjectQuery={subject} /> */}
          <RoleDisplay />
        </div>
      </div>
    </>
  );
}
