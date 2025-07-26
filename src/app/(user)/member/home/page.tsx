"use server";

import { getUserDataFromCookies } from "@/app/lib/action";
import ParentHome from "@/app/ui/components/user/parent/home/ParentHome";
import StudentHome from "@/app/ui/components/user/student/home/StudentHome";
import React from "react";

export default async function Home() {
  const userData = await getUserDataFromCookies();
  if (userData?.role.defaultRoute === "STUDENT") {
    return <StudentHome />;
  }
  if (userData?.role.defaultRoute === "PARENT") {
    return <ParentHome />;
  }
}
