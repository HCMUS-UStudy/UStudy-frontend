import ParentContactPage from "@/app/ui/components/user/member/ContactPage";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <ParentContactPage />
    </Suspense>
  );
}
