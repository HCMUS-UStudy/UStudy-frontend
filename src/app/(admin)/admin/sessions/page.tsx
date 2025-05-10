import SessionManagement from "@/app/ui/components/admin/branches/SessionManagement";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <SessionManagement />
    </Suspense>
  );
}
