"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ManageScoresTable from "@/app/ui/components/admin/manage-scores/ManageScoresTable";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import DropdownLocal from "@/app/ui/components/admin/manage-scores/DropdownLocal";
import { getAllClasses } from "@/app/lib/services/class";
import { ClassItem } from "@/app/types";
import Loading from "../../_common/loading/Loading";
import { RootState } from "@/app/store/store";

export default function ManageScoresClientPage() {
  const { selectedBranchId } = useSelector((state: RootState) => state.branch);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch available classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        console.log("Fetching classes...");

        // Use page 0 like in ApproveClassStudentModal
        const response = await getAllClasses(
          "",
          0,
          100,
          undefined,
          undefined,
          selectedBranchId || undefined,
        );
        console.log("API Response:", response);
        console.log("Response content:", response.content);
        console.log("Response type:", typeof response);

        if (response.content && response.content.length > 0) {
          setClasses(response.content);
        } else {
          console.log("No classes found in response");
          setClasses([]);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [selectedBranchId]);

  // Convert classes to dropdown format - always show all classes including selected one
  const classOptions = [
    { key: "", label: "Chọn lớp" },
    ...classes.map((cls) => ({
      key: cls.id,
      label: cls.name,
      description: cls.description,
    })),
  ];

  // Handler khi click vào header để sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="px-2">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between ">
        <h1 className="text-2xl font-bold">Quản lý điểm học sinh</h1>
      </div>

      {/* Class Selection */}
      <div className="mt-6 p-6 bg-primary-lighter rounded-xl shadow-sm border border-primary-light">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-dark rounded-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Chọn lớp để xem điểm
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Chọn lớp học để xem chi tiết điểm số của học sinh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="w-4 h-4 border-2 border-primary-dark border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">
                  Đang tải danh sách lớp...
                </span>
              </div>
            ) : classes.length > 0 ? (
              <DropdownLocal
                label="Chọn lớp học"
                items={classOptions}
                selected={selectedClassId}
                position="bottom-left"
                onSelect={setSelectedClassId}
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-500 text-sm">
                Không có lớp học nào
              </div>
            )}
          </div>

          {selectedClassId && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-md text-green-700 font-medium">
                Đã chọn: {classes.find((c) => c.id === selectedClassId)?.name}
              </span>
            </div>
          )}
        </div>

        {classes.length === 0 && !loading && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span className="text-sm text-amber-700">
                Hiện tại chưa có lớp học nào trong hệ thống
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Results Section - Only show if class is selected */}
      {selectedClassId && (
        <>
          <div className="flex items-center justify-between mt-6 gap-2 md:gap-14">
            <SearchField
              className="w-full bg-primary-lighter"
              placeholder="Tìm kiếm bài tập..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <ManageScoresTable
            classId={selectedClassId}
            search={search}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}

      {/* No Class Selected Message */}
      {!selectedClassId && !loading && classes.length > 0 && (
        <div className="mt-8 text-center">
          <div className="p-12 bg-primary-light rounded-2xl border border-primary-light shadow-sm">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary-darker"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Chọn lớp để xem điểm
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Vui lòng chọn một lớp học từ dropdown bên trên để xem chi tiết
              điểm số và bài tập của học sinh
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
