"use client";

import React from "react";

interface BlockingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const BlockingOverlay: React.FC<BlockingOverlayProps> = ({
  isVisible,
  message = "Vui lòng hoàn thành bài tập trước khi thao tác khác",
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg
              className="h-6 w-6 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Đang làm bài
          </h3>
          <p className="text-sm text-gray-500 mb-6">{message}</p>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default BlockingOverlay;
