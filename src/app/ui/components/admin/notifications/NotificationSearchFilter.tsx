"use client";
import React from "react";
import { Select, SelectItem } from "@/app/ui/components/_common/Select";
import { SearchField } from "../../_common/text-field";

interface NotificationSearchFilterProps {
  searchTerm: string;
  filterType: string;
  filterStatus: string;
  totalCount: number;
  unreadCount: number;
  onSearchChange: (value: string) => void;
  onFilterTypeChange: (value: string) => void;
  onFilterStatusChange: (value: string) => void;
}

const NotificationSearchFilter: React.FC<NotificationSearchFilterProps> = ({
  searchTerm,
  filterType,
  filterStatus,
  totalCount,
  unreadCount,
  onSearchChange,
  onFilterTypeChange,
  onFilterStatusChange,
}) => {
  return (
    <div className="relative -mt-4 sm:-mt-6 mx-4 sm:mx-6 mb-6 sm:mb-8">
      <div className="bg-white rounded-2xl shadow-xl border border-primary-light p-4 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-primary-darkest mb-2">
              Tìm kiếm
            </label>
            <div className="relative">
              <SearchField
                className="w-full bg-white"
                placeholder="Tìm kiếm lớp học..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 sm:flex-none">
              <label className="block text-sm font-semibold text-primary-darkest mb-2">
                Loại thông báo
              </label>
              <Select
                defaultValue={filterType}
                defaultLabel="Tất cả loại"
                onValueChange={(value: string | number) =>
                  onFilterTypeChange(value as string)
                }
                className="w-full sm:w-48"
                showClearButton={false}
              >
                <SelectItem value="ALL">Tất cả loại</SelectItem>
                <SelectItem value="SYSTEM">Hệ thống</SelectItem>
                <SelectItem value="CLASS">Lớp học</SelectItem>
                <SelectItem value="USER">Cá nhân</SelectItem>
              </Select>
            </div>
            <div className="flex-1 sm:flex-none">
              <label className="block text-sm font-semibold text-primary-darkest mb-2">
                Trạng thái
              </label>
              <Select
                defaultValue={filterStatus}
                defaultLabel="Tất cả trạng thái"
                onValueChange={(value: string | number) =>
                  onFilterStatusChange(value as string)
                }
                className="w-full sm:w-48"
                showClearButton={false}
              >
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                <SelectItem value="UNREAD">Chưa đọc</SelectItem>
                <SelectItem value="READ">Đã đọc</SelectItem>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-primary-light">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-lighter rounded-lg">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-primary-dark"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <span className="text-xs sm:text-sm text-primary-dark">
                Tổng cộng
              </span>
              <div className="text-lg sm:text-xl font-bold text-primary-darkest">
                {totalCount}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 animate-pulse"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <span className="text-xs sm:text-sm text-primary-dark">
                Chưa đọc
              </span>
              <div className="text-lg sm:text-xl font-bold text-red-600">
                {unreadCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSearchFilter;
