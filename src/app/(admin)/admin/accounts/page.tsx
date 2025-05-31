import React from "react";
import AddAccountModal from "@/app/ui/components/admin/accounts/AddAccountModal";
import AccountTable from "@/app/ui/components/admin/accounts/AccountTable";
// import AccountRegisterModal from "@/app/ui/components/admin/accounts/AccountRegisterModal";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import Dropdown from "@/app/ui/components/_common/Dropdown";
import AccountNumber from "@/app/ui/components/admin/accounts/AccountNumber";

const roles = {
  All: "Tất cả",
  ADMIN: "Admin",
  TEACHER: "Giáo viên",
  PARENT: "Phụ huynh",
  STUDENT: "Học sinh",
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
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between ">
        <AccountNumber searchQuery={query} roleQuery={role} />
        <div className="flex items-center">
          {/* <AccountRegisterModal buttonLabel="Duyệt đăng ký" /> */}
          <AddAccountModal buttonLabel="Tạo người dùng" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 gap-2 md:gap-14">
        <SearchField
          className="w-full bg-primary-lighter"
          placeholder="Tìm kiếm người dùng..."
        />
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <Dropdown
              label="Lọc"
              items={Object.entries(roles).map(([key, label]) => ({
                key,
                label,
              }))}
              selected={role}
              position="bottom-right"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-6 max-h-[400px]">
        <AccountTable searchQuery={query} roleQuery={role} />
      </div>
    </div>
  );
}
