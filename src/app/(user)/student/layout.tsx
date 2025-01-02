import { SIDENAV_ITEMS_STUDENT } from "@/app/menu_constants";
import PageWrapper from "@/app/ui/components/common/PageWrapper";
import Sidebar from "@/app/ui/sidebar/sidebar";
import React from "react";
import HeaderStuTeach from "@/app/(user)/_components/Header";

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
