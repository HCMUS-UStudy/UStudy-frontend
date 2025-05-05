"use server";

import { getUserDataFromCookies } from "@/app/lib/action";
import ParentClasses from "@/app/ui/components/user/parent/classes/ParentClasses";
import StudentClasses from "@/app/ui/components/user/student/classes/StudentClasses";

export default async function Classes() {
  const defaultRoute = (await getUserDataFromCookies())?.role.defaultRoute;
  if (defaultRoute === "STUDENT") {
    return <StudentClasses />;
  }
  if (defaultRoute === "PARENT") {
    return <ParentClasses />;
  }
}
