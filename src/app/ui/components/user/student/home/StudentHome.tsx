"use client";

import React from "react";
import "react-calendar/dist/Calendar.css";
import HeaderHome from "@/app/ui/components/user/student/home/HeaderHome";
import Homework from "@/app/ui/components/user/student/home/Homework";
import ResultStudy from "@/app/ui/components/user/student/home/ResultStudy";
import Schedule from "@/app/ui/components/user/student/home/Schedule";

export default function StudentHome() {
  return (
    <div className="px-2 md:px-6">
      <HeaderHome />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mt-4 md:mt-6">
        <Homework />
        <ResultStudy />
      </div>

      <div className="mt-4 md:mt-6">
        <Schedule />
      </div>
    </div>
  );
}
