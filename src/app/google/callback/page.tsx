import GoogleCallback from "@/app/ui/components/_common/googleCallback/googleCallback";
import { Loading } from "@/app/ui/components/_common/loading";
import React, { Suspense } from "react";

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<Loading />}>
      <GoogleCallback />
    </Suspense>
  );
}
