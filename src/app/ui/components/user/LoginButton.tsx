"use client";
import React, { memo } from "react";
import { Button } from "../_common/Button";
import { useRouter } from "next/navigation";

const LoginButton = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        router.push("/login");
      }}
      className="text-sm sm:text-base md:text-xl text-nowrap px-3 py-2 sm:px-5 sm:py-2 md:px-10 md:py-3 bg-transparent border-2 border-primary-darkest text-primary-darkest"
    >
      Đăng nhập
    </Button>
  );
};

export default memo(LoginButton);
