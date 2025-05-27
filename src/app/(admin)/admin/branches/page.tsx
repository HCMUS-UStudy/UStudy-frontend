"use client";
import BranchPage from "@/app/ui/components/admin/branches/BranchPage";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <BranchPage />
    </Suspense>
  );
}
