"use client";
import { Button } from "@/app/ui/components/_common/Button";
import { useRouter } from "next/navigation";
import React from "react";
import { FaUserGraduate } from "react-icons/fa6";
import { IoSparkles } from "react-icons/io5";

export default function RegisterSuccessfully() {
  const router = useRouter();
  return (
    <div className=" flex justify-center items-center bg-primary-light h-screen">
      <div className="relative overflow-hidden bg-background w-2/3 md:w-auto flex flex-col gap-5 lg:gap-7 py-8 px-6 md:px-10 lg:px-20 rounded-xl border-2 border-slate-400">
        <div className="flex items-center gap-3">
          <div className="text-lg md:text-2xl lg:text-3xl font-bold">
            Đăng ký <span className="text-highlight-text">thành công</span>
          </div>
          <IoSparkles className="size-5 md:size-8 lg:size-10 text-highlight-text" />
        </div>
        <div className="text-sm md:text-base">
          Chào mừng bạn đến với{" "}
          <span className="font-bold text-highlight-text">UStudy</span>! Cảm ơn
          bạn đã đăng ký, hãy chờ để được phê duyệt!
        </div>
        <Button
          onClick={() => router.push("/")}
          className="text-sm md:text-base w-full font-bold"
        >
          Quay về trang chủ
        </Button>
        <FaUserGraduate className="size-32 md:size-40 lg:size-48 absolute right-0 -bottom-4 text-primary-darkest opacity-10" />
      </div>
    </div>
  );
}
