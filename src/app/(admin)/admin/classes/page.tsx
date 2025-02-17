import React from "react";
import AddAccountModal from "@/app/ui/components/admin/accounts/AddAccountModal";
import AccountTable from "@/app/ui/components/admin/accounts/AccountTable";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import { HiAdjustments } from "react-icons/hi";
import Dropdown from "@/app/ui/components/_common/Dropdown";
import ClassRegisterModal from "@/app/ui/components/admin/classes/ClassRegisterModal";

const roles = {
  All: "Tất cả",
  Admin: "Admin",
  Teacher: "Giáo viên",
  Parent: "Phụ huynh",
  Clerk: "Giáo vụ",
  Student: "Học sinh",
};

export default async function ClassPage(props: {
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
        <h2 className="text-2xl font-bold">Tổng số lớp học(14.050)</h2>
        <div className="flex items-center space-x-2">
          <ClassRegisterModal buttonLabel="Duyệt đăng ký" />
          <AddAccountModal buttonLabel="Tạo người dùng" />
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <SearchField
            className="w-full bg-green-50 border border-green-300 rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="Tìm kiếm lớp học"
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Dropdown
              label="Lọc"
              items={Object.entries(roles).map(([key, label]) => ({
                key,
                label,
              }))}
              selected={role}
            />
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
