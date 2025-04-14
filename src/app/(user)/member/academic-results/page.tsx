"use server";
import { getUserDataFromCookies } from "@/app/lib/action";
import ParentAcademicResults from "@/app/ui/components/user/parent/academic-results/ParentAcademicResults";
import StudentAcademicResults from "@/app/ui/components/user/student/academic-results/StudentAcademicResults";
import React from "react";

export default async function AcademicResults() {
  const defaultRoute = (await getUserDataFromCookies())?.role.defaultRoute;
  if (defaultRoute === "PARENT") {
    return <ParentAcademicResults />;
  }
  if (defaultRoute === "STUDENT") {
    return <StudentAcademicResults />;
  }
}
