// import SessionManagement from "@/app/ui/components/admin/branches/SessionManagement";
import SessionManagement from "@/app/ui/components/admin/sessions/SessionPage";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <SessionManagement />
    </Suspense>
  );
}
