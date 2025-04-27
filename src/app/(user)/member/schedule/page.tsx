"use server";

import { getUserDataFromCookies } from "@/app/lib/action";
import ParentSchedule from "@/app/ui/components/user/parent/schedule/ParentSchedule";

export default async function Schedule() {
  const defaultRoute = (await getUserDataFromCookies())?.role.defaultRoute;
  if (defaultRoute === "STUDENT") {
  }
  if (defaultRoute === "PARENT") {
    return <ParentSchedule />;
  }
}
