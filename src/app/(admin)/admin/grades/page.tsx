import React from "react";
import AddAccountModal from "@/app/ui/components/admin/accounts/AddAccountModal";
import AccountTable from "@/app/ui/components/admin/accounts/AccountTable";
import AccountRegisterModal from "@/app/ui/components/admin/accounts/AccountRegisterModal";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import { HiAdjustments } from "react-icons/hi";
import DropdownCourse from "@/app/ui/components/admin/courses/DropdownCourse";

export default async function GradePage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    role?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const role = searchParams?.role || "All";

  return (
    <div className="px-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Tổng số khối học (11)</h2>
        <div className="flex items-center space-x-2">
          <AccountRegisterModal buttonLabel="Duyệt đăng ký" />
          <AddAccountModal buttonLabel="Tạo khối học" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 gap-14">
        <SearchField
          className="w-full bg-primary-lighter py-[2px] rounded-2xl"
          placeholder="Tìm kiếm khối học..."
        />
        <div className="flex items-center gap-6 px-4">
          <div className="flex items-center">
            <DropdownCourse label="Lọc" />
          </div>
          <div className="flex items-center">
            <HiAdjustments className="w-6 h-6 text-gray-500 rotate-90" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-6 max-h-[400px]">
        <AccountTable searchQuery={query} roleQuery={role} />
      </div>
    </div>
  );
}
