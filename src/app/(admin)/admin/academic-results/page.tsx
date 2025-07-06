import Loading from "@/app/ui/components/_common/loading/Loading";
import ManageScoresClientWrapper from "@/app/ui/components/admin/manage-scores/ManageScoresClientWrapper";
import React, { Suspense } from "react";

export default function ManageScoresPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ManageScoresClientWrapper />
    </Suspense>
  );
}
