import React from "react";

export default function StudentClassesLoading() {
  return (
    <>
      <div className="flex flex-col space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-100 border border-gray-200 p-6 rounded-2xl animate-pulse"
          >
            <div className="w-14 h-14 rounded-full bg-gray-300 mr-6"></div>
            <div className="flex-grow">
              <div className="h-5 bg-gray-300 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
            <div className="w-24 h-8 bg-gray-300 rounded-full"></div>
          </div>
        ))}
      </div>
    </>
  );
}
