"use server";
import React, { Suspense } from "react";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import CreateClassButton from "@/app/ui/components/admin/classes/create/CreateClassButton";
import ClassesTable from "@/app/ui/components/admin/classes/ClassesTable";

export default async function Classes() {
  return (
    <Suspense>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between gap-10">
          <SearchField className="" placeholder="Tìm theo tên lớp..." />
          <div className="flex">
            <CreateClassButton />
          </div>
        </div>
        <ClassesTable />
      </div>
    </Suspense>
  );
}
