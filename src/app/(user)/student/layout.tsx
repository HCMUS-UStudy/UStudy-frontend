import { SIDENAV_ITEMS_STUDENT } from "@/app/menu-constants";
import PageWrapper from "@/app/ui/components/_common/PageWrapper";
import Sidebar from "@/app/ui/components/_common/sidebar/Sidebar";
import React from "react";
import HeaderStuTeach from "@/app/ui/components/user/Header";

export default function ClerkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar menuItems={SIDENAV_ITEMS_STUDENT} />
      <div className="flex flex-col h-full w-full">
        <HeaderStuTeach />
        <PageWrapper>{children}</PageWrapper>
      </div>
    </>
  );
}
