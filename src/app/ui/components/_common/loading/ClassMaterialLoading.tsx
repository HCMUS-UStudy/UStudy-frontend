import React from "react";

export default function ClassMaterialLoading({
  numberOfItems,
}: {
  numberOfItems: number;
}) {
  return (
    <div className="animate-pulse">
      <div className="mb-4 flex items-center space-x-2">
        <div className="h-4 w-16 bg-gray-300 rounded"></div>
        <span className="text-gray-400">/</span>
        <div className="h-4 w-24 bg-gray-300 rounded"></div>
      </div>

      <div className="flex items-center justify-between mt-2 gap-14 ml-4 mr-4">
        <div className="w-full h-10 bg-gray-300 rounded-2xl"></div>
        <div className="flex space-x-2">
          <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
          <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
        </div>
      </div>

      <div className="px-4 py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(numberOfItems)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-4 flex flex-col"
          >
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-24 bg-gray-300 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
