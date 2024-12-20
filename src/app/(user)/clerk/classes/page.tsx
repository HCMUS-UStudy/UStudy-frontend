import CreateClass from "@/app/ui/components/createClass";
import { SearchField } from "@/app/ui/components/Input";
import Pagination from "@/app/ui/components/pagination";
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
        <SearchField className="w-[200px]" placeholder="Tìm theo tên lớp..." />
        <CreateClass />
      </div>
      <ClassesTable query={query} currentPage={currentPage} />
      <div className="justify-items-end mr-3">
        <Pagination />
      </div>
    </div>
  );
}
