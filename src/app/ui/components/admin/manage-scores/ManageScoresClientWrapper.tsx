"use client";
import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ManageScoresTable from "@/app/ui/components/admin/manage-scores/ManageScoresTable";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import DropdownLocal from "@/app/ui/components/admin/manage-scores/DropdownLocal";

const classes = [
  { key: "all", label: "Tất cả lớp" },
  { key: "10A1", label: "10A1" },
  { key: "10A2", label: "10A2" },
  { key: "10A3", label: "10A3" },
];

const subjects = [
  { key: "all", label: "Tất cả môn" },
  { key: "toan", label: "Toán" },
  { key: "van", label: "Văn" },
  { key: "anh", label: "Anh" },
  { key: "ly", label: "Lý" },
  { key: "hoa", label: "Hóa" },
];

export default function ManageScoresClientWrapper() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("query") || "";
  const selectedClass = searchParams.get("class") || "all";
  const selectedSubject = searchParams.get("subject") || "all";
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
    if (
      paramsObj.query ||
      paramsObj.class ||
      paramsObj.subject ||
      paramsObj.sortBy
    ) {
      params.set("page", "1");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClassChange = (key: string) => updateUrl({ class: key });
  const handleSubjectChange = (key: string) => updateUrl({ subject: key });
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
    <div className="px-2">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between ">
        <h1 className="text-2xl font-bold">Quản lý điểm học sinh</h1>
      </div>
      <div className="flex items-center justify-between mt-4 gap-2 md:gap-14">
        <SearchField
          className="w-full bg-primary-lighter"
          placeholder="Tìm kiếm học sinh..."
          defaultValue={query}
          onChange={handleSearch}
        />
        <div className="flex items-center gap-6">
          <DropdownLocal
            label="Lọc lớp"
            items={classes}
            selected={selectedClass}
            position="bottom-right"
            onSelect={handleClassChange}
          />
          <DropdownLocal
            label="Lọc môn"
            items={subjects}
            selected={selectedSubject}
            position="bottom-right"
            onSelect={handleSubjectChange}
          />
        </div>
      </div>
      <ManageScoresTable
        search={query}
        selectedClass={selectedClass}
        selectedSubject={selectedSubject}
        sortBy={sortBy}
        sortOrder={sortOrder}
        currentPage={page}
        onSort={handleSort}
        setCurrentPage={handlePageChange}
      />
    </div>
  );
}
