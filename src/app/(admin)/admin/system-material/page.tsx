"use server";
// import AddAccountModal from "@/app/ui/components/admin/accounts/AddAccountModal";
// import MaterialsGrid from "@/app/ui/components/admin/materials/MaterialsGrid";
import { Suspense } from "react";

export default async function MaterialsPage() {
  return (
    <div className="px-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Tổng số tài liệu</h2>
        <div className="flex items-center space-x-2 mr-4">
          {/* <AddAccountModal buttonLabel="Thêm tài liệu" /> */}
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <Suspense>{/* <MaterialsGrid /> */}</Suspense>
      </div>
    </div>
  );
}
