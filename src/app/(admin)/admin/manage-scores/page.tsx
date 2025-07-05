import ManageScoresClientWrapper from "@/app/ui/components/admin/manage-scores/ManageScoresClientWrapper";
import React, { Suspense } from "react";

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary"></div>
  </div>
);

export default function ManageScoresPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ManageScoresClientWrapper />
    </Suspense>
  );
}
