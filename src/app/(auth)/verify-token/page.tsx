import React, { Suspense } from "react";
import VerifyTokenPage from "@/app/ui/components/_common/verifyToken/VerifyTokenPage";

// Simple fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
  </div>
);

export default function UserVerifyToken() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyTokenPage
        heading="Bảo mật tài khoản, an tâm sử dụng!"
        subheading="Nhập mã xác thực gồm 6 số đã gửi về email của bạn."
        onSuccessRedirect="/reset-password"
      />
    </Suspense>
  );
}
