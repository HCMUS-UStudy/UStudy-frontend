"use client";
import PageWrapper from "@/app/ui/components/_common/PageWrapper";
import Sidebar from "@/app/ui/components/_common/sidebar/Sidebar";
import { SIDENAV_ITEMS_TEACHER } from "@/app/menu-constants";
import HeaderStuTeach from "@/app/ui/components/user/Header";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      <Sidebar menuItems={SIDENAV_ITEMS_TEACHER} />
      <div className="flex flex-col h-full w-full">
        <HeaderStuTeach />
        <PageWrapper> {children} </PageWrapper>
      </div>
    </div>
  );
}
