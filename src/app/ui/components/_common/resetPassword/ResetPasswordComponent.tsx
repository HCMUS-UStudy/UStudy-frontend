"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import FallingImages from "@/app/ui/components/_common/forgetPassword/FallingImages";
import ResetPasswordForm from "@/app/ui/components/_common/resetPassword/ResetPasswordForm";
import { forgotPasswordWithOtp } from "@/app/lib/services/auth";
import { useMutation } from "@tanstack/react-query";
import { useCustomToast } from "@/app/lib/hooks/useToast";

const ResetPasswordSchema = z
  .object({
    password: z
      .string({ message: "Vui lòng nhập mật khẩu mới" })
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
    confirmPassword: z.string({ message: "Vui lòng xác nhận mật khẩu" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ResetPasswordInputs = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordComponent() {
  const [isLoadingBack, setIsLoadingBack] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ResetPasswordInputs>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const email = searchParams?.get("email") || "";
  const otp = searchParams?.get("otp") || "";

  const { addToast } = useCustomToast();

  const mutation = useMutation({
    mutationFn: ({
      email,
      otp,
      newPassword,
    }: {
      email: string;
      otp: string;
      newPassword: string;
    }) => forgotPasswordWithOtp({ email, otp, newPassword }),
    onSuccess: () => {
      setIsLoading(false);
      addToast.success("Đặt lại mật khẩu thành công!");
      router.push("/login");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setIsLoading(false);
      addToast.error(error?.response?.data?.message || "Có lỗi xảy ra!");
    },
  });

  const onSubmit = (data: ResetPasswordInputs) => {
    setIsLoading(true);
    if (!email || !otp) {
      setIsLoading(false);
      addToast.error("Thiếu thông tin email hoặc mã xác thực!");
      return;
    }
    mutation.mutate({ email, otp, newPassword: data.password });
  };

  return (
    <>
      {isLoadingBack && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-30">
          <div className="w-12 h-12 border-4 border-primary-light border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {isLoading && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-30">
          <div className="w-12 h-12 border-4 border-primary-light border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="flex items-center justify-center h-screen overflow-hidden">
        <div className="hidden lg:flex flex-col items-center justify-center w-4/5 h-full bg-primary-light">
          <div className="relative  lg:h-[80px] lg:w-[250px] xl:h-[100px] xl:w-[300px]">
            <Image className="object-contain" src="/logo.png" alt="Logo" fill />
          </div>
          <h1 className="text-xl xl:text-2xl font-semibold text-[#273526] text-left">
            Đặt lại mật khẩu an toàn, bảo vệ tài khoản!
          </h1>
        </div>
        <div className="flex relative items-center h-full justify-center w-full bg-primary-light lg:bg-background">
          <FallingImages />
          <div className="w-full max-w-md mx-auto z-[100] px-4 md:px-0">
            <ResetPasswordForm
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
