import AdminResetPasswordComponent from "@/app/ui/components/_common/resetPassword/AdminResetPasswordComponent";
import React, { Suspense } from "react";

// Simple fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
  </div>
);

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminResetPasswordComponent />
    </Suspense>
  );
}
