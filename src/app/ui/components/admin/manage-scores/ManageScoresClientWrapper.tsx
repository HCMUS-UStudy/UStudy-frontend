"use client";
import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ManageScoresTable from "@/app/ui/components/admin/manage-scores/ManageScoresTable";
import { Search, BarChart3, Users } from "lucide-react";

export default function ManageScoresClientWrapper() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("query") || "";
  const sortBy = searchParams.get("sortBy") || "name";
  const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc";
  const page = Number(searchParams.get("page")) || 1;

  // Handler cập nhật URL
  const updateUrl = (paramsObj: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(paramsObj).forEach(([key, value]) => {
      params.set(key, value);
    });
    // Reset page về 1 khi filter/sort/search
    if (paramsObj.query || paramsObj.sortBy) {
      params.set("page", "1");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateUrl({ query: e.target.value });
  const handleSort = (column: string) => {
    const currentSortBy = searchParams.get("sortBy");
    const currentSortOrder = searchParams.get("sortOrder") || "asc";
    if (currentSortBy === column) {
      updateUrl({
        sortBy: column,
        sortOrder: currentSortOrder === "asc" ? "desc" : "asc",
      });
    } else {
      updateUrl({ sortBy: column, sortOrder: "asc" });
    }
  };
  const handlePageChange = (pageNum: number) =>
    updateUrl({ page: String(pageNum) });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý điểm học sinh
              </h1>
              <p className="text-gray-600 mt-1">
                Theo dõi và quản lý kết quả học tập của học sinh
              </p>
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm học sinh theo tên hoặc mã số..."
                  defaultValue={query}
                  onChange={handleSearch}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                />
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>Quản lý điểm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <ManageScoresTable
          search={query}
          selectedClass="all"
          selectedSubject="all"
          sortBy={sortBy}
          sortOrder={sortOrder}
          currentPage={page}
          onSort={handleSort}
          setCurrentPage={handlePageChange}
        />
      </div>
    </div>
  );
}
