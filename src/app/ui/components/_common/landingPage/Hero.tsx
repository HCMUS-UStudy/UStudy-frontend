"use client";
import React from "react";
import learningSystemAnimation from "@/app/ui/lotties/learningSystem.json";
import StudentRegisterBtn from "../../user/student/register/StudentRegisterBtn";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Hero() {
  return (
    <div className="flex flex-col md:grid grid-cols-5 justify-between gap-3 px-3 md:px-5 lg:px-2 pt-10">
      <div className="flex flex-col gap-6 md:col-span-3 text-[35px] lg:text-[40px] xl:text-[50px] md:mr-10 font-bold">
        <div className="leading-tight md:leading-normal">
          <div className=" tracking-tight md:tracking-normal">
            <span className="text-highlight-text">Kết nối</span> tri thức
          </div>
          <div className=" tracking-tight md:tracking-normal">
            <span className="text-highlight-text">Chinh phục</span> mọi mục tiêu
          </div>
          <div className="text-secondary-text font-light text-sm md:text-sm lg:text-base mt-2">
            UStudy giúp giáo viên, học viên và phụ huynh kết nối dễ dàng trong
            môi trường học tập hiện đại. Với các công cụ hỗ trợ tạo lớp học,
            giao bài tập, chấm điểm, theo dõi tiến độ và điểm danh, UStudy mang
            đến trải nghiệm học tập hiệu quả và tiện lợi. Hãy bắt đầu hành trình
            chinh phục tri thức của bạn ngay hôm nay!
          </div>
        </div>
        <StudentRegisterBtn />
      </div>
      {/* <Image
        className="object-cover border-4 border-primary-darker rounded-[24px] aspect-auto md:flex hidden"
        src="/tutorSystem3.webp"
        width={500}
        height={450}
        alt="tutorSystem"
        loading="lazy"
      /> */}
      <div className="relative col-span-2 w-full md:h-[350px] lg:h-[300px]">
        <Lottie
          className="w-full"
          animationData={learningSystemAnimation}
          loop
        />
        {/* <Image
          className="object-cover border-4 aspect-auto md:flex hidden border-primary-darker rounded-[24px]"
          src="/tutorSystem3.webp"
          alt="tutorSystem"
          loading="lazy"
          fill
        /> */}
      </div>
    </div>
  );
}
