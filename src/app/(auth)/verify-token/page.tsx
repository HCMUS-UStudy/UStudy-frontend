import React from "react";
import VerifyTokenPage from "@/app/ui/components/_common/verifyToken/VerifyTokenPage";

export default function UserVerifyToken() {
  return (
    <VerifyTokenPage
      heading="Bảo mật tài khoản, an tâm sử dụng!"
      subheading="Nhập mã xác thực gồm 6 số đã gửi về email của bạn."
      onSuccessRedirect="/reset-password"
    />
  );
}
