import React from "react";

export default function ContactsLoading() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="relative flex items-center p-3 border rounded cursor-pointer animate-pulse bg-gray-50"
        >
          <div className="relative w-11 h-11 mr-3">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center" />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-gray-300 rounded-full border-2 border-white shadow-md"></span>
          </div>
          <div className="text-sm space-y-1 w-full">
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </>
  );
}
