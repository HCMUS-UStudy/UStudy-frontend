import React from "react";

export default function ClassDetailLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-gray-300 p-3 rounded-lg shadow w-12 h-12"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}
