import React from "react";
import AddAccountModal from "@/app/ui/components/admin/accounts/AddAccountModal";
import AccountTable from "@/app/ui/components/admin/accounts/AccountTable";
import AccountRegisterModal from "@/app/ui/components/admin/accounts/AccountRegisterModal";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import { HiAdjustments } from "react-icons/hi";
import Dropdown from "@/app/ui/components/_common/Dropdown";

const roles = {
  All: "Tất cả",
  Admin: "Admin",
  Teacher: "Giáo viên",
  Parent: "Phụ huynh",
  Clerk: "Giáo vụ",
  Student: "Học sinh",
};

export default async function AccountPage(props: {
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
        <h2 className="text-2xl font-bold">Tổng số người dùng (14.050)</h2>
        <div className="flex items-center space-x-2">
          <AccountRegisterModal buttonLabel="Duyệt đăng ký" />
          <AddAccountModal buttonLabel="Tạo người dùng" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 gap-14">
        <SearchField
          className="w-full bg-primary-lighter py-[2px] rounded-2xl"
          placeholder="Tìm kiếm người dùng..."
        />
        <div className="flex items-center gap-6 px-4">
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
