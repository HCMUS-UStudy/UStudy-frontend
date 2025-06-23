import { ContactPage } from "@/app/ui/components/contact";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <ContactPage />
    </Suspense>
  );
}
