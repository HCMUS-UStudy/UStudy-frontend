"use server";
import React, { Suspense } from "react";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import CreateClassButton from "@/app/ui/components/admin/classes/create/CreateClassButton";
import ClassesTable from "@/app/ui/components/admin/classes/ClassesTable";
import { SearchParamsRadioGroup } from "@/app/ui/components/_common/text-field";

export default async function Classes() {
  return (
    <Suspense>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between gap-10">
          <SearchField className="w-1/2" placeholder="Tìm theo tên lớp..." />
          <SearchParamsRadioGroup
            className="text-sm text-nowrap w-full sm:w-auto"
            options={[
              {
                label: "Tất cả lớp",
                value: "",
              },
              { label: "Lớp phụ trách", value: "isAssigned" },
            ]}
            queryKey="type"
          />
          <div className="flex">
            <CreateClassButton />
          </div>
        </div>
        <ClassesTable />
      </div>
    </Suspense>
  );
}
