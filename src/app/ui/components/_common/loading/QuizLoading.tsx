import React from "react";

export default function QuizLoading() {
  return (
    <>
      <div className="flex w-full max-w-6xl gap-6">
        {/* Skeleton Quiz Content */}
        <div className="bg-primary-lighter shadow-lg rounded-3xl max-w-4xl w-full p-8 backdrop-blur-md border border-primary-light animate-pulse">
          <div className="h-8 w-3/4 bg-gray-300 rounded mb-6 mx-auto"></div>

          <div className="flex justify-between items-center mb-4">
            <span className="h-4 w-20 bg-gray-300 rounded"></span>
          </div>

          <div className="w-full bg-primary-light rounded-full h-2 mb-6">
            <div className="bg-gray-300 h-2 rounded-full w-1/3"></div>
          </div>

          <div>
            <div className="h-6 w-full bg-gray-300 rounded mb-4"></div>
            <div className="h-6 w-3/4 bg-gray-300 rounded mb-4"></div>

            <div className="space-y-3 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-300 rounded-lg"></div>
              ))}
            </div>

            {/* Skeleton nút điều hướng */}
            <div className="flex justify-between">
              <div className="h-10 w-24 bg-gray-300 rounded-lg"></div>
              <div className="h-10 w-24 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Skeleton Quiz Navigation */}
        <div className="w-1/4 bg-primary-lighter shadow-lg rounded-3xl p-6 backdrop-blur-md border border-primary-light animate-pulse">
          <div className="flex items-center justify-center text-sm text-highlight-text mb-4 bg-primary-light py-2 rounded-md">
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
          </div>
          <div className="h-6 w-3/4 bg-gray-300 rounded mb-4 mx-auto"></div>
          <div className="grid grid-cols-4 gap-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-10 w-10 bg-gray-300 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
