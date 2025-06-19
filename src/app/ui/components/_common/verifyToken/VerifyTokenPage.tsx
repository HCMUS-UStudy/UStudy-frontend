"use client";
import React, { useState } from "react";
import Image from "next/image";
import FallingImages from "@/app/ui/components/_common/forgetPassword/FallingImages";
import VerifyTokenAnimation from "@/app/ui/components/_common/verifyToken/VerifyTokenAnimation";
import { useRouter } from "next/navigation";

interface VerifyTokenPageProps {
  heading?: string;
  subheading?: string;
  onSuccessRedirect?: string;
}

export default function VerifyTokenPage({
  heading = "Bảo mật tài khoản, an tâm sử dụng!",
  subheading = "Nhập mã xác thực gồm 6 số đã gửi về email của bạn.",
  onSuccessRedirect = "/",
}: VerifyTokenPageProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const router = useRouter();

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
    if (code.join("").length !== 6) {
      setError("Vui lòng nhập đủ 6 số xác thực!");
      return;
    }
    // TODO: Xác thực mã thực tế ở đây
    alert("Xác thực thành công!");
    router.push(onSuccessRedirect);
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
        <div className="w-full max-w-md mx-auto z-[100]">
          {/* <div className="flex flex-col items-center gap-0 mb-2">
            <VerifyTokenAnimation className="w-40 h-40 md:w-40 md:h-40 mx-auto -mb-4" />
          </div> */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-md py-10 px-8 md:px-12 rounded-3xl shadow-2xl border border-primary-light/40 flex flex-col gap-6 items-center"
          >
            <div className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-dark via-highlight-text to-primary-darker drop-shadow-lg text-center">
              Xác thực mã OTP
            </div>
            <div className="flex flex-col items-center gap-0 mb-2">
              <VerifyTokenAnimation className="w-40 h-40 md:w-40 md:h-40 mx-auto -mb-4" />
            </div>
            <p className="text-gray-600 text-center text-base md:text-lg max-w-xs mb-2">
              {subheading}
            </p>
            <div className="flex gap-3 mb-2">
              {code.map((num, idx) => (
                <input
                  key={idx}
                  id={`code-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-14 text-center text-2xl border-2 border-primary-light rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm bg-white/80"
                  value={num}
                  onChange={(e) => handleChange(e.target.value, idx)}
                />
              ))}
            </div>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-dark to-highlight-text text-white font-bold py-2 rounded-xl shadow-md hover:scale-[1.02] transition-transform duration-200 text-lg"
            >
              Xác nhận
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
