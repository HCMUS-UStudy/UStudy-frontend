"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import FallingImages from "@/app/ui/components/_common/forgetPassword/FallingImages";
import ForgotPasswordForm from "@/app/ui/components/_common/forgetPassword/ForgotPasswordForm";

const ForgotPasswordSchema = z.object({
  email: z
    .string({ message: "Vui lòng nhập email" })
    .email({ message: "Email không hợp lệ" }),
});

type ForgotPasswordInputs = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoadingBack, setIsLoadingBack] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const validEmails = ["admin@example.com"];

  const onSubmit = (data: ForgotPasswordInputs) => {
    setIsLoading(true);
    if (validEmails.includes(data.email)) {
      router.push("/admin/verify-token");
    } else {
      setIsLoading(false);
      alert("Email không hợp lệ hoặc không tồn tại!");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen overflow-hidden">
        <div className="hidden lg:flex flex-col items-center justify-center w-4/5 h-full bg-primary-light">
          <div className="relative  lg:h-[80px] lg:w-[250px] xl:h-[100px] xl:w-[300px]">
            <Image className="object-contain" src="/logo.png" alt="Logo" fill />
          </div>
          <h1 className="text-xl xl:text-2xl font-semibold text-[#273526]">
            Khôi phục mật khẩu dễ dàng, tiếp bước hành trình tri thức!
          </h1>
        </div>
        <div className="flex relative items-center h-full justify-center w-full bg-primary-light lg:bg-background">
          <FallingImages />
          <div className="w-full max-w-md mx-auto z-[100]">
            <ForgotPasswordForm
              onSubmit={onSubmit}
              errors={errors}
              register={register}
              isLoading={isLoading}
              isLoadingBack={isLoadingBack}
              router={router}
              setIsLoadingBack={setIsLoadingBack}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}
