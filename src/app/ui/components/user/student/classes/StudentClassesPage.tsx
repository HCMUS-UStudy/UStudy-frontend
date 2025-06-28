"use client";

import React, { useState, useEffect } from "react";
import StudentClasses from "@/app/ui/components/user/student/classes/StudentClasses";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import { useSearchParams } from "next/navigation";

export default function StudentClassesPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const searchQuery = searchParams?.get("query") || "";
    setQuery(searchQuery);
  }, [searchParams]);

  return (
    <div className=" bg-foreground">
      <div className="flex items-center justify-between ">
        <h2 className="text-lg md:text-2xl font-bold">Danh sách lớp học</h2>
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
        <StudentClasses searchQuery={query} />
      </div>
    </div>
  );
}
