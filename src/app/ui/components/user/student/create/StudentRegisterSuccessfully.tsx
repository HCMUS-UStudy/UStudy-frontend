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
      <div className="relative overflow-hidden bg-background flex flex-col gap-7 py-8 px-20 rounded-xl border-2 border-slate-400">
        <div className="flex gap-3">
          <div className="text-3xl font-bold">
            Đăng ký <span className="text-highlight-text">thành công</span>
          </div>
          <IoSparkles className="size-10 text-highlight-text" />
        </div>
        <div>
          Chào mừng bạn đến với{" "}
          <span className="font-bold text-highlight-text">UStudy</span>!. Cảm ơn
          bạn đã đăng ký, hãy chờ để được phê duyệt!
        </div>
        <Button onClick={() => router.push("/")} className="w-full font-bold">
          Quay về trang chủ
        </Button>
        <FaUserGraduate className="size-48 absolute right-0 -bottom-4 text-primary-darkest opacity-10" />
      </div>
    </div>
  );
}
