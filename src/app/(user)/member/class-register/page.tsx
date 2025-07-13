import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import { SearchParamsRadioGroup } from "@/app/ui/components/_common/text-field/SearchParamsRadioGroup";
import RegisterClasses from "@/app/ui/components/user/student/class-register/RegisterClasses";
import React from "react";

const options = [
  {
    value: "",
    label: "Tất cả",
  },
  {
    value: "PENDING",
    label: "Chưa thanh toán",
  },
  {
    value: "COMPLETED",
    label: "Đã thanh toán",
  },
  {
    value: "OVERDUE",
    label: "Quá hạn",
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
        <h2 className="text-lg md:text-2xl font-bold">Các lớp học hiện có</h2>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between mt-2 xl:gap-14 gap-4">
        <SearchField className="w-full" placeholder="Tìm kiếm lớp học..." />
        <div className="flex flex-col lg:items-center lg:flex-row gap-4 lg:gap-5 w-full lg:w-auto">
          <SearchParamsRadioGroup
            className="text-sm text-nowrap w-full sm:w-auto"
            options={options}
            queryKey="statusQuery"
          />
          <div className="w-full sm:w-auto">{/* <ClassFilter /> */}</div>
        </div>
      </div>

      <div className="relative mt-4  overflow-auto">
        <RegisterClasses searchQuery={query} />
      </div>
    </div>
  );
}
