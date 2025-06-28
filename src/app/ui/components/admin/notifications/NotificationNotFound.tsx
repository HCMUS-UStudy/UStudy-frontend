"use client";
import React from "react";

interface NotificationNotFoundProps {
  onBackToList: () => void;
}

const NotificationNotFound: React.FC<NotificationNotFoundProps> = ({
  onBackToList,
}) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-lighter to-primary-light rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="w-12 h-12 text-primary-dark animate-pulse"
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
        <h3 className="text-xl font-bold text-primary-darkest mb-3">
          Không tìm thấy thông báo
        </h3>
        <p className="text-primary-dark text-base max-w-sm mx-auto mb-4">
          Thông báo này có thể đã bị xóa hoặc không tồn tại trong hệ thống.
        </p>
        <button
          onClick={onBackToList}
          className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center gap-2 mx-auto text-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Quay lại danh sách
        </button>
      </div>
    </div>
  );
};

export default NotificationNotFound;
