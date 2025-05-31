"use server";
import { getUserDataFromCookies } from "@/app/lib/action";
import ParentTuition from "@/app/ui/components/user/parent/tuition/ParentTuition";
import StudentTuition from "@/app/ui/components/user/student/tuition/StudentTuition";
import React from "react";

export default async function Tuition() {
  const defaultRoute = (await getUserDataFromCookies())?.role.defaultRoute;
  if (defaultRoute === "STUDENT") {
    return <StudentTuition />;
  }
  if (defaultRoute === "PARENT") {
    return <ParentTuition />;
  }
}
