"use client";
import PageWrapper from "@/app/ui/components/common/PageWrapper";
import Sidebar from "@/app/ui/sidebar/sidebar";
import { SIDENAV_ITEMS_TEACHER } from "@/app/menu_constants";
import HeaderStuTeach from "@/app/(user)/_components/Header";

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
