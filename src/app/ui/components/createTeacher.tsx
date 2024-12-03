"use client";
import React from "react";
import { Input } from "./input";
import { Button } from "./button";

export default function CreateTeacher() {
  return (
    <div>
      <div className="font-bold text-[30px] md:text-[50px] tracking-tighter md:tracking-normal text-center">
        Trở thành<span className="text-highlight_text"> Giáo Viên</span>
      </div>
      <div className="w-[80vw] md:w-[500px] mt-4 flex flex-col gap-3 md:gap-5">
        <Input
          className="w-full h-11 text-base text-gray-700"
          placeholder="Họ tên"
        />
        <Input
          className="w-full h-11 text-base text-gray-700"
          placeholder="Email"
        />
        <Input
          className="w-full h-11 text-base text-gray-700"
          placeholder="Giới tính"
        />
        <Input
          className="w-full h-11 text-base text-gray-700"
          placeholder="Ngày sinh"
        />
        <Input
          className="w-full h-11 text-base text-gray-700"
          placeholder="Số điện thoại"
        />
        <Input
          className="w-full h-11 text-base text-gray-700"
          placeholder="Địa chỉ"
        />
        <Button className=" mt-5">Đăng ký</Button>
      </div>
    </div>
  );
}
