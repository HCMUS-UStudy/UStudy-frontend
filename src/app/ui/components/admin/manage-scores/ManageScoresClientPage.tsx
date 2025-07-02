"use client";

import React, { useState } from "react";
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

export default function ManageScoresClientPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClassState, setSelectedClass] = useState("all");
  const [selectedSubjectState, setSelectedSubject] = useState("all");

  // Handler khi click vào header để sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="px-2">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between ">
        <h1 className="text-2xl font-bold">Quản lý điểm học sinh</h1>
      </div>
      <div className="flex items-center justify-between mt-4 gap-2 md:gap-14">
        <SearchField
          className="w-full bg-primary-lighter"
          placeholder="Tìm kiếm học sinh..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-6">
          <DropdownLocal
            label="Lọc lớp"
            items={classes}
            selected={selectedClassState}
            position="bottom-right"
            onSelect={setSelectedClass}
          />
          <DropdownLocal
            label="Lọc môn"
            items={subjects}
            selected={selectedSubjectState}
            position="bottom-right"
            onSelect={setSelectedSubject}
          />
        </div>
      </div>
      <ManageScoresTable
        search={search}
        selectedClass={selectedClassState}
        selectedSubject={selectedSubjectState}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
