import React from "react";

export default function ExerciseLoading() {
  return (
    <div className="bg-primary-lighter rounded-xl w-full p-8 backdrop-blur-md shadow-lg animate-pulse">
      <div className="h-10 w-3/4 bg-gray-300 rounded-lg mx-auto mb-6"></div>

      <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <div className="h-6 w-1/2 bg-gray-300 rounded-lg mb-6"></div>

        <div className="h-4 w-full bg-gray-300 rounded-lg mb-2"></div>
        <div className="h-4 w-3/4 bg-gray-300 rounded-lg mb-6"></div>

        <div className="p-6 bg-gray-300 border  rounded-lg shadow-md mb-6">
          <div className="h-6 w-1/3 bg-gray-300 rounded-lg mb-3"></div>
          <div className="h-10 w-full bg-gray-300 rounded-lg"></div>
        </div>

        <div className="space-y-4">
          <div className="h-24 w-full bg-gray-300 rounded-lg"></div>
          <div className="flex gap-3">
            <div className="h-10 w-20 bg-gray-300 rounded-lg"></div>
            <div className="h-10 w-24 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
