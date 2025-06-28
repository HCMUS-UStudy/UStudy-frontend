"use client";
import React, { useState } from "react";
import Image from "next/image";
import FallingImages from "@/app/ui/components/_common/forgetPassword/FallingImages";
import VerifyTokenAnimation from "@/app/ui/components/_common/verifyToken/VerifyTokenAnimation";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/ui/components/_common/Button";
import { verifyOtp } from "@/app/lib/services/auth";
import { useMutation } from "@tanstack/react-query";

interface VerifyTokenPageProps {
  heading?: string;
  subheading?: string;
  onSuccessRedirect?: string;
  sampleCode?: string;
}

export default function VerifyTokenPage({
  heading = "Bảo mật tài khoản, an tâm sử dụng!",
  subheading = "Nhập mã xác thực gồm 6 số đã gửi về email của bạn.",
}: VerifyTokenPageProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";

  const mutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyOtp({ email, otp }),
    onSuccess: (_data, variables) => {
      router.push(
        `/reset-password?email=${encodeURIComponent(email)}&otp=${variables.otp}`,
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setError(error?.response?.data?.message || "Mã xác thực không đúng!");
      setIsLoading(false);
    },
  });

  const handleChange = (value: string, idx: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[idx] = value;
    setCode(newCode);
    setError("");
    if (value && idx < 5) {
      const next = document.getElementById(`code-${idx + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (code.join("").length !== 6) {
      setError("Vui lòng nhập đủ 6 số xác thực!");
      return;
    }
    setIsLoading(true);
    if (!email) {
      setError("Không tìm thấy email xác thực!");
      setIsLoading(false);
      return;
    }
    mutation.mutate({ email, otp: code.join("") });
  };

  return (
    <div className="flex items-center justify-center h-screen overflow-hidden">
      <div className="hidden lg:flex flex-col items-center justify-center w-4/5 h-full bg-primary-light">
        <div className="relative  lg:h-[80px] lg:w-[250px] xl:h-[100px] xl:w-[300px]">
          <Image className="object-contain" src="/logo.png" alt="Logo" fill />
        </div>
        <h1 className="text-xl xl:text-2xl font-semibold text-[#273526] text-left">
          {heading}
        </h1>
      </div>
      <div className="flex relative items-center h-full justify-center w-full bg-primary-light lg:bg-background">
        <FallingImages />
        <div className="w-full max-w-md mx-auto z-[100] px-4 md:px-0">
          {/* <div className="flex flex-col items-center gap-0 mb-2">
            <VerifyTokenAnimation className="w-40 h-40 md:w-40 md:h-40 mx-auto -mb-4" />
          </div> */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-md py-8 px-4 md:py-10 md:px-8 rounded-3xl shadow-2xl border border-primary-light/40 flex flex-col gap-6 items-center"
          >
            <div className="text-highlight-text text-2xl md:text-3xl font-bold flex justify-center">
              Xác thực mã OTP
            </div>
            <div className="flex flex-col items-center gap-0 mb-2">
              <VerifyTokenAnimation className="w-32 h-32 md:w-40 md:h-40 mx-auto -mb-4" />
            </div>
            <p className="text-gray-600 text-center text-sm md:text-lg max-w-xs mb-2">
              {subheading}
            </p>
            <div className="flex gap-2 md:gap-3 mb-2 max-[350px]:gap-1 max-[300px]:gap-0.5">
              {code.map((num, idx) => (
                <input
                  key={idx}
                  id={`code-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-10 h-12 md:w-12 md:h-14 text-center text-xl md:text-2xl max-[350px]:w-8 max-[350px]:h-10 max-[350px]:text-base max-[300px]:w-6 max-[300px]:h-8 max-[300px]:text-xs border-2 border-primary-light rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm bg-white/80"
                  value={num}
                  onChange={(e) => handleChange(e.target.value, idx)}
                />
              ))}
            </div>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <Button
              type="submit"
              className="flex items-center justify-center w-full transition-all duration-200 group-hover:-translate-x-2"
              isPending={isLoading}
              disabled={isLoading}
            >
              Xác nhận
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
