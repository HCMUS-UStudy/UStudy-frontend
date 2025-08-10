"use client";

import { useState } from "react";
import { SearchField } from "@/app/ui/components/_common/text-field";
import RatingsNumber from "@/app/ui/components/admin/ratings/RatingsNumber";
import RatingsAdminPage from "@/app/ui/components/admin/ratings/RatingsAdminPage";
import RatingsTeacherPage from "@/app/ui/components/admin/ratings/RatingsTeacherPage";
import { useSearchParams } from "next/navigation";

export default function RatingPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("query") || "";
  const [activeTab, setActiveTab] = useState<"subject" | "teacher">("subject");

  return (
    <div className="px-2">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <RatingsNumber searchQuery={query} />
      </div>

      {/* Tabs */}
      <div className="mt-4 border-b border-gray-200">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab("subject")}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === "subject"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Môn + Khối
          </button>
          <button
            onClick={() => setActiveTab("teacher")}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === "teacher"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Giáo viên
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between mt-4 gap-2 md:gap-14">
        <SearchField
          className="w-full bg-primary-lighter"
          placeholder="Tìm kiếm đánh giá..."
        />
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "subject" ? (
          <RatingsAdminPage searchQuery={query} />
        ) : (
          <RatingsTeacherPage searchQuery={query} />
        )}
      </div>
    </div>
  );
}
