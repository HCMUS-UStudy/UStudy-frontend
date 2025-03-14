import Dropdown from "@/app/ui/components/_common/Dropdown";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import AddAccountModal from "@/app/ui/components/admin/accounts/AddAccountModal";
import MaterialsGrid from "@/app/ui/components/admin/materials/MaterialsGrid";
import { HiAdjustments } from "react-icons/hi";

const roles = {
  All: "Tất cả",
  Admin: "Admin",
  Teacher: "Giáo viên",
  Parent: "Phụ huynh",
  Clerk: "Giáo vụ",
  Student: "Học sinh",
};

export default async function MaterialsPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const query = searchParams?.query || "";

  const role = "All";

  return (
    <div className="px-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Tổng số tài liệu</h2>
        <div className="flex items-center space-x-2 mr-4">
          <AddAccountModal buttonLabel="Thêm tài liệu" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 gap-14">
        <SearchField
          className="w-full bg-primary-lighter py-[2px] rounded-2xl"
          placeholder="Tìm kiếm tài liệu..."
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
        <MaterialsGrid searchQuery={query} />
      </div>
    </div>
  );
}
