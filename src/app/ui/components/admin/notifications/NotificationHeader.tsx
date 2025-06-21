"use client";
import React from "react";
import { Button } from "@/app/ui/components/_common/Button";

interface NotificationHeaderProps {
  onRefresh: () => void;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  onRefresh,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary-dark via-primary-darker to-primary-darkest shadow-xl">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-white">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm animate-pulse">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8"
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
              Thông báo
            </h1>
            <p className="text-primary-lighter text-base sm:text-lg">
              Quản lý và xem tất cả thông báo của bạn
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="basic"
              onClick={onRefresh}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300 text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 animate-spin"
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
              <span className="sm:hidden">Làm mới</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationHeader;
