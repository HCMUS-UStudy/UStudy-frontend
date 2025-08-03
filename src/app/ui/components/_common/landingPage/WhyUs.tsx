"use client";
import dynamic from "next/dynamic";
import React from "react";
import booksAnimation from "@/app/ui/lotties/books.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function WhyUs() {
  return (
    <div className="mt-12 mx-9 md:mx-36 xl:mx-44">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2 hidden lg:flex">
          <Lottie animationData={booksAnimation} loop className="w-4/5" />
        </div>
        <div className="w-full lg:w-1/2 text-center">
          <div className="font-bold text-[30px] tracking-tighter md:tracking-normal md:text-[40px]">
            <span className="text-highlight-text">Vì sao</span> nên chọn UStudy?
          </div>
          <div className="text-gray-700 text-left text-sm md:text-base xl:text-lg font-thin mt-3">
            UStudy mang đến giải pháp quản lý học tập toàn diện, giúp giáo viên,
            học sinh, và phụ huynh kết nối dễ dàng và hiệu quả. Chúng tôi cung
            cấp các công cụ giúp bạn theo dõi tiến độ học tập, đánh giá và cải
            thiện chất lượng giảng dạy nhanh chóng và chính xác.
          </div>
        </div>
      </div>
    </div>
  );
}
