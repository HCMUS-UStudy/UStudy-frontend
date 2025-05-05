import React from "react";

export default function PaymentLoadingSkeleton() {
  return (
    <div className="space-y-6 p-4 animate-pulse">
      {/* Skeleton for Header cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="bg-gray-100 rounded shadow p-6 h-32" />
        ))}
      </div>

      {/* Skeleton for Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mt-4">
        <div className="h-12 bg-gray-100 rounded-t" /> {/* Fake header */}
        {[...Array(5)].map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between px-4 py-3 border-t border-gray-200"
          >
            {[...Array(7)].map((_, colIdx) => (
              <div key={colIdx} className="h-4 bg-gray-300 rounded w-1/6" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
