"use client";
import React from "react";
import { Select, SelectItem } from "@/app/ui/components/_common/Select";
import { SearchField } from "../../_common/text-field";

interface NotificationSearchFilterProps {
  searchTerm: string;
  filterType: string;
  filterStatus: string;
  onSearchChange: (value: string) => void;
  onFilterTypeChange: (value: string) => void;
  onFilterStatusChange: (value: string) => void;
}

const NotificationSearchFilter: React.FC<NotificationSearchFilterProps> = ({
  searchTerm,
  filterType,
  filterStatus,
  onSearchChange,
  onFilterTypeChange,
  onFilterStatusChange,
}) => {
  return (
    <div className="relative mx-4 sm:mx-6 mb-6">
      <div>
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <SearchField
                className="w-full bg-white"
                placeholder="Tìm kiếm theo tên..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 sm:flex-none">
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
      </div>
    </div>
  );
};

export default NotificationSearchFilter;
