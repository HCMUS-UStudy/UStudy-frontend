import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import { SearchParamsRadioGroup } from "@/app/ui/components/_common/text-field/SearchParamsRadioGroup";
import ClassFilter from "@/app/ui/components/user/student/class-register/ClassFilter";
import RegisterClasses from "@/app/ui/components/user/student/class-register/RegisterClasses";
import React from "react";

const options = [
  {
    value: "",
    label: "Tất cả",
  },
  {
    value: "WAITING",
    label: "Chưa thanh toán",
  },
  {
    value: "ACCEPTED",
    label: "Đã thanh toán",
  },
];

export default async function ClassRegister(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    classQuery?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  return (
    <div className="bg-foreground">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-bold">Các lớp học hiện có</h2>
      </div>

      <div className="flex items-center justify-between mt-2 gap-14">
        <SearchField className="w-full " placeholder="Tìm kiếm lớp học..." />
        <div className="flex gap-5 items-center">
          <SearchParamsRadioGroup
            className="text-sm text-nowrap"
            options={options}
            queryKey="statusQuery"
          />
          <ClassFilter />
        </div>
      </div>

      <div className="relative mt-4 max-h-[400px]">
        <RegisterClasses searchQuery={query} />
      </div>
    </div>
  );
}
