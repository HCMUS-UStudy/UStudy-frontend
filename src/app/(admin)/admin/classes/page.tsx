import React from "react";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import CreateClassButton from "@/app/ui/components/admin/classes/CreateClassButton";
import ClassesTable from "@/app/ui/components/admin/classes/ClassesTable";
import ClassRegisterModal from "@/app/ui/components/admin/classes/ClassRegisterModal";

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
        <SearchField
          className="w-[200px] outline-none placeholder:text-gray-500 focus:ring-1 focus:ring-blue-800 rounded"
          placeholder="Tìm theo tên lớp..."
        />
        <div className="flex">
          <ClassRegisterModal buttonLabel="Duyệt đăng ký" />
          <CreateClassButton />
        </div>
      </div>
      <ClassesTable query={query} currentPage={currentPage} />
    </div>
  );
}
