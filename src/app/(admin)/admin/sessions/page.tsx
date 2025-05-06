import SessionManagement from "@/app/ui/components/admin/branches/Session";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <SessionManagement />
    </Suspense>
  );
}
