import CreateClass from "@/app/ui/components/createClass";
import { SearchField } from "@/app/ui/components/input";
import { ClassesTable } from "@/app/ui/components/table";
import React from "react";

export default async function Classes(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <SearchField
          className="w-[200px] outline-none placeholder:text-gray-500 focus:ring-1 focus:ring-blue-800 rounded"
          placeholder="Tìm theo tên lớp..."
        />
        <CreateClass />
      </div>
      <ClassesTable query={query} currentPage={currentPage} />
    </div>
  );
}
