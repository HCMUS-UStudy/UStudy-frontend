"use client";
import React from "react";
import { Button } from "@/app/ui/components/_common/Button";

interface NotificationHeaderProps {
  onRefresh: () => void;
  totalCount: number;
  unreadCount: number;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  onRefresh,
  totalCount,
  unreadCount,
}) => {
  return (
    <div className="relative rounded-t-lg overflow-hidden">
      <div className="relative px-4 sm:px-6 mt-4">
        <div className="flex sm:items-center justify-between gap-4 mb-4">
          <div className="flex gap-5 ml-2 items-center">
            <h1 className="text-primary-darkest text-xl sm:text-2xl font-bold">
              Thông báo
            </h1>

            {/* Stats */}
            <div className="flex justify-center items-center gap-3 mt-[1px]">
              <div className="flex gap-2 items-center">
                <span className="text-xs sm:text-sm text-primary-dark">
                  Tổng cộng
                </span>
                <div className="text-md sm:text-lg font-bold text-primary-darkest">
                  {totalCount}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-xs sm:text-sm text-primary-dark">
                  Chưa đọc
                </span>
                <div className="text-md sm:text-lg font-bold text-yellow-600">
                  {unreadCount}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="basic"
              onClick={onRefresh}
              className="flex items-center gap-2 bg-primary-light backdrop-blur-sm border-white/30
               hover:bg-primary transition-all duration-300 text-[13px] sm:text-sm group"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:animate-spin"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="hidden sm:inline">Làm mới</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationHeader;
