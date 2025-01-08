import CreateClass from "@/app/ui/components/admin/classes/CreateClass";
import { SearchField } from "@/app/ui/components/_common/Input";
import React from "react";
import ClassesTable from "@/app/ui/components/admin/classes/ClassesTable";

export default async function Classes(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between">
        <SearchField className="w-[200px]" placeholder="Tìm theo tên lớp..." />
        <CreateClass />
      </div>
      <ClassesTable query={query} currentPage={currentPage} />
    </div>
  );
}
