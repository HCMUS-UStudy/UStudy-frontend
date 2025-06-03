import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Card";

export default function ClassSettingLoading() {
  return (
    <div className="mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col gap-3 md:flex-row justify-between items-center">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="flex flex-row gap-1 md:gap-3 w-full md:w-auto">
              <div className="h-10 flex-1 md:flex-none md:w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 flex-1 md:flex-none md:w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="flex flex-col gap-4 mb-3">
              {/* Form fields skeleton */}
              {[...Array(5)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>

            <div className="h-full">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-full min-h-52 max-h-52 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-8">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                          <div className="h-4 w-24 bg-gray-200 rounded" />
                          <div className="h-4 w-32 bg-gray-200 rounded" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
