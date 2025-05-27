"use server";

import { getUserDataFromCookies } from "@/app/lib/action";
import ParentSchedule from "@/app/ui/components/user/parent/schedule/ParentSchedule";
import StudentSchedule from "@/app/ui/components/user/student/schedule/StudentSchedule";

export default async function Schedule() {
  const defaultRoute = (await getUserDataFromCookies())?.role.defaultRoute;
  if (defaultRoute === "STUDENT") {
    return <StudentSchedule />;
  }
  if (defaultRoute === "PARENT") {
    return <ParentSchedule />;
  }
}
