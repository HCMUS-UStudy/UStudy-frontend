import React from "react";

export default function ReviewQuizLoading() {
  return (
    <>
      <div className="bg-white shadow-lg rounded-3xl w-full p-8 border border-gray-300 animate-pulse">
        <div className="h-8 w-3/4 bg-gray-300 rounded mb-6 mx-auto"></div>

        <div className="flex justify-between items-center mb-4">
          <span className="h-4 w-20 bg-gray-300 rounded"></span>
        </div>

        <div className="h-6 w-full bg-gray-300 rounded mb-4"></div>
        <div className="h-6 w-3/4 bg-gray-300 rounded mb-4"></div>

        <div className="space-y-3 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-300 rounded-lg"></div>
          ))}
        </div>

        <div className="flex justify-between">
          <div className="h-10 w-24 bg-gray-300 rounded-lg"></div>
          <div className="h-10 w-24 bg-gray-300 rounded-lg"></div>
        </div>
      </div>

      <div className="w-1/4 bg-gray-100 shadow-lg rounded-3xl p-6 animate-pulse">
        <div className="h-6 w-3/4 bg-gray-300 rounded mb-4 mx-auto"></div>
        <div className="grid grid-cols-4 gap-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-10 w-10 bg-gray-300 rounded-full"></div>
          ))}
        </div>
      </div>
    </>
  );
}
