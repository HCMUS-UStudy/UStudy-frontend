/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import "react-calendar/dist/Calendar.css";
import HeaderHome from "@/app/ui/components/user/student/home/HeaderHome";
import Homework from "@/app/ui/components/user/student/home/Homework";
import ResultStudy from "@/app/ui/components/user/student/home/ResultStudy";
import Schedule from "@/app/ui/components/user/student/home/Schedule";

export default function Home() {
  return (
    <div className="px-2">
      <HeaderHome />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Homework />
        <ResultStudy />
      </div>

      <Schedule />
    </div>
  );
}
