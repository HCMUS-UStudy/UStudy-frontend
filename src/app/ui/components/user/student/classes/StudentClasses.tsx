import React from "react";
import ClassRow from "@/app/ui/components/user/student/classes/ClassRow";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";

export default async function StudentClasses(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    classQuery?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  // const classQuery = searchParams?.classQuery || "All";

  return (
    <div className="p-4 bg-foreground">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Danh sách lớp học</h2>
      </div>

      <div className="flex items-center justify-between mt-2 gap-14">
        <SearchField className="w-full " placeholder="Tìm kiếm lớp học..." />
        {/* <div className="flex items-center gap-6 px-4">
          <div className="flex items-center">
            <DropdownGrade label="Lọc" />
          </div>
          <div className="flex items-center">
            <HiAdjustments className="w-6 h-6 text-gray-500 rotate-90" />
          </div>
        </div> */}
      </div>

      <div className="relative mt-6 max-h-[400px]">
        <ClassRow searchQuery={query} />
      </div>
    </div>
  );
}
