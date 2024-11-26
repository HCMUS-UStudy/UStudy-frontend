import { getAllClasses } from "@/app/lib/api";
import { SearchField } from "@/app/ui/components/input";
import Pagination from "@/app/ui/components/pagination";
import { TableSkeleton } from "@/app/ui/components/skeleton";
import { ClassesTable } from "@/app/ui/components/table";
import React, { Suspense } from "react";

export default async function Classes(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 0;
  const data = await getAllClasses(query, currentPage);
  const totalPages = data.totalPages;

  return (
    <div className="flex flex-col gap-5">
      {/* <ClassesComponent /> */}
      <SearchField // client
        className="w-[200px]"
        placeholder="Tìm theo tên lớp..."
      />
      {/* server */}
      <Suspense fallback={<TableSkeleton />}>
        <ClassesTable query={query} currentPage={currentPage} />
      </Suspense>

      {/* client */}
      <div className="justify-items-end mr-3">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
