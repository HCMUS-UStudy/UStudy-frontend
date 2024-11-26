import { SIDENAV_ITEMS_STUDENT } from "@/app/menu_constants";
import PageWrapper from "@/app/ui/components/pagewrapper";
import Sidebar from "@/app/ui/sidebar/sidebar";
import React from "react";
import HeaderStudent from "@/app/ui/components/headerStudent";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar menuItems={SIDENAV_ITEMS_STUDENT} />
      <div className="flex flex-col h-full w-full">
        <HeaderStudent />
        <PageWrapper>{children}</PageWrapper>
      </div>
    </>
  );
}
