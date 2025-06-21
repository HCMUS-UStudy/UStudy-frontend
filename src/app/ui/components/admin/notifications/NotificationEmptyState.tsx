"use client";
import React from "react";

interface NotificationEmptyStateProps {
  searchTerm: string;
  filterType: string;
  filterStatus: string;
}

const NotificationEmptyState: React.FC<NotificationEmptyStateProps> = ({
  searchTerm,
  filterType,
  filterStatus,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12 text-center">
      <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
        Không có thông báo nào
      </h3>
      <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
        {searchTerm || filterType !== "ALL" || filterStatus !== "ALL"
          ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem kết quả khác"
          : "Bạn chưa có thông báo nào. Các thông báo mới sẽ xuất hiện ở đây."}
      </p>
    </div>
  );
};

export default NotificationEmptyState;
