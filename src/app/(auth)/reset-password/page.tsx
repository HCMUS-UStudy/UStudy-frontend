import ResetPasswordComponent from "@/app/ui/components/_common/resetPassword/ResetPasswordComponent";
import React, { Suspense } from "react";

// Simple fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
  </div>
);

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordComponent />
    </Suspense>
  );
}
