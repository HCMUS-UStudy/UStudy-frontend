import React from "react";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import { HiAdjustments } from "react-icons/hi";
import GradeTable from "@/app/ui/components/admin/grades/GradeTable";
import AddGradeModal from "@/app/ui/components/admin/grades/AddGradeModal";
import DropdownGrade from "@/app/ui/components/admin/grades/DropdownGrade";
import GradeNumber from "@/app/ui/components/admin/grades/GradeNumber";

export default async function GradePage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    grade?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const grade = searchParams?.grade || "All";

  return (
    <div className="px-2">
      <div className="flex items-center justify-between mb-6">
        <GradeNumber searchQuery={query} gradeQuery={grade} />
        <div className="flex items-center space-x-2">
          <AddGradeModal buttonLabel="Tạo khối học" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 gap-14">
        <SearchField
          className="w-full bg-primary-lighter py-[2px] rounded-2xl"
          placeholder="Tìm kiếm khối học..."
        />
        <div className="flex items-center gap-6 px-4">
          <div className="flex items-center">
            <DropdownGrade label="Lọc" />
          </div>
          <div className="flex items-center">
            <HiAdjustments className="w-6 h-6 text-gray-500 rotate-90" />
          </div>
        </div>
      </div>

      <div className="relative mt-6 max-h-[400px]">
        <GradeTable searchQuery={query} gradeQuery={grade} />
      </div>
    </div>
  );
}
