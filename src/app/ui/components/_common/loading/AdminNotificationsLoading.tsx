import React from "react";

export default function AdminNotificationsLoading() {
  return (
    <div className="grid grid-cols-1 space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-2 rounded-lg animate-pulse"
        >
          <div className="p-2 bg-gray-200 rounded-full">
            <div className="w-5 h-5 bg-gray-300 rounded-full" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="w-full h-5 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
