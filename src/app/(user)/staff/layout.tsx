import Header from "@/app/ui/components/header";
import PageWrapper from "@/app/ui/components/pagewrapper";
import { SideBar, SideBarStaff } from "@/app/ui/sidebar/sidebar";
import React from "react";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SideBarStaff />
      <div className="flex flex-col h-full w-full">
        <Header />
        <PageWrapper>{children}</PageWrapper>
      </div>
    </>
  );
}
