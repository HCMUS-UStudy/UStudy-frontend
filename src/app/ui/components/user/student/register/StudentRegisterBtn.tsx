"use client";
import React from "react";
import { Button } from "../../../_common/Button";
import { IoSparkles } from "react-icons/io5";
import { FaUserGraduate } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function StudentRegisterBtn() {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push("/register")}
      className="w-full rounded-lg overflow-hidden md:w-[240px] text-base lg:text-xl py-4 hover:scale-110"
      type="submit"
    >
      Ghi danh
      {/* <span className="absolute -translate-y-1 translate-x-1 opacity-20">
                  Bắt đầu
                </span> */}
      <IoSparkles className="absolute size-10 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <IoSparkles className="absolute size-12 left-5 bottom-1 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      <FaUserGraduate className="absolute size-14 -right-7 -bottom-2 origin-bottom group-hover:-rotate-[30deg] opacity-0 group-hover:opacity-100 transition-all duration-300" />
    </Button>
  );
}
