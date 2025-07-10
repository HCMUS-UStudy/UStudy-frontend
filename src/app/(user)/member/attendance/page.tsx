"use server";
import { getUserDataFromCookies } from "@/app/lib/action";
import ParentAttendance from "@/app/ui/components/user/parent/attendance/ParentAttendance";
import StudentAttendance from "@/app/ui/components/user/student/attendance/StudentAttendance";
import React from "react";

export default async function AttendancePage() {
  const defaultRoute = (await getUserDataFromCookies())?.role.defaultRoute;
  if (defaultRoute === "PARENT") {
    return <ParentAttendance />;
  }
  if (defaultRoute === "STUDENT") {
    return <StudentAttendance />;
  }
}
