// components/ClassCardSkeleton.tsx

import React from "react";

const ClassCardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border p-6 flex flex-col md:flex-row gap-6"
        >
          <div className="bg-gray-200 w-full md:w-1/4 h-40 rounded-xl"></div>

          <div className="flex-1 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>

            <div className="flex space-x-3 mt-6">
              <div className="h-10 w-24 bg-gray-200 rounded"></div>
              <div className="h-10 w-28 bg-gray-200 rounded"></div>
              <div className="h-10 w-36 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassCardSkeleton;
