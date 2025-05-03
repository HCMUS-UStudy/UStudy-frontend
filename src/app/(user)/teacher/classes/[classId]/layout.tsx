"use client";

import TeacherNavigation from "@/app/ui/components/user/teacher/TeacherNavigation";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  let activeTab = "";
  if (segments.length >= 4) {
    activeTab = segments[3];
  }

  return (
    <>
      <TeacherNavigation activeTab={activeTab} />
      <main>{children}</main>
    </>
  );
}
