import React from "react";

export default function QuizListLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="p-5 border-2 rounded-lg animate-pulse">
          <div className="h-40 bg-gray-300 rounded-lg"></div>
          <div className="h-5 w-3/4 bg-gray-300 rounded-lg mt-4"></div>
          <div className="h-4 w-1/2 bg-gray-300 rounded-lg mt-2"></div>
          <div className="flex items-center mt-4">
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            <div className="ml-2 h-4 w-20 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
