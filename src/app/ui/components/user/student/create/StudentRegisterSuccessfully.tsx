"use client";
import { Button } from "@/app/ui/components/_common/Button";
import { useRouter } from "next/navigation";
import React from "react";
import { FaUserGraduate } from "react-icons/fa6";
import dynamic from "next/dynamic";
import successAnimation from "@/app/ui/lotties/success.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function RegisterSuccessfully() {
  const router = useRouter();
  return (
    <div className=" flex justify-center items-center bg-primary-light min-h-screen overflow-y-hidden">
      <div className="relative overflow-hidden bg-background w-2/3 flex flex-col gap-3 lg:gap-7 py-3 md:py-8 px-6 md:px-10 lg:px-20 rounded-xl border-2 border-slate-400">
        <div className="flex flex-col md:flex-row items-center md:gap-3">
          <Lottie
            animationData={successAnimation}
            loop={false}
            className="size-16"
          />
          <div className="text-xl md:text-2xl lg:text-3xl font-bold">
            Đăng ký <span className="text-highlight-text">thành công</span>
          </div>
          {/* <IoSparkles className="size-5 md:size-8 lg:size-10 text-highlight-text" /> */}
        </div>
        <div className="text-sm md:text-base">
          Chào mừng bạn đến với{" "}
          <span className="font-bold text-highlight-text text-wrap">
            UStudy
          </span>
          ! Cảm ơn bạn đã đăng ký, thư đã được gửi đến địa chỉ email bạn cung
          cấp, hãy vào email và chọn <strong>&quot;Xác nhận&quot;</strong> để
          hoàn tất quá trình đăng ký.
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
