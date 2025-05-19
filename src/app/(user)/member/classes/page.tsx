"use server";

import { getUserDataFromCookies } from "@/app/lib/action";
import ParentClasses from "@/app/ui/components/user/parent/classes/ParentClasses";
import StudentClassesPage from "@/app/ui/components/user/student/classes/StudentClassesPage";

export default async function Classes() {
  const defaultRoute = (await getUserDataFromCookies())?.role.defaultRoute;
  if (defaultRoute === "STUDENT") {
    return <StudentClassesPage />;
  }
  if (defaultRoute === "PARENT") {
    return <ParentClasses />;
  }
}
