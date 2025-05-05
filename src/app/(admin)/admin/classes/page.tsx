"use server";
import React from "react";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import CreateClassButton from "@/app/ui/components/admin/classes/create/CreateClassButton";
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
      <div className="flex justify-between gap-10">
        <SearchField className="" placeholder="Tìm theo tên lớp..." />
        <div className="flex">
          <CreateClassButton />
        </div>
      </div>
      <ClassesTable query={query} currentPage={currentPage} />
    </div>
  );
}
