import { Loading } from "@/app/ui/components/_common/loading";
import RatingPage from "@/app/ui/components/_common/ratings/ratingPage";
import React, { Suspense } from "react";

export default function RatingsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <RatingPage />
    </Suspense>
  );
}
