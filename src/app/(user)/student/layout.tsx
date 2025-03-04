import React from "react";
import HeaderStuTeach from "@/app/ui/components/user/Header";
import { BreadcrumbProvider } from "@/app/context/BreadcrumbContext";
import PageWrapperStu from "@/app/ui/components/user/PageWrapperStu";
import SidebarStu from "@/app/ui/components/_common/sidebar/SidebarStu";

export default function ClerkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Sidebar menuItems={SIDENAV_ITEMS_STUDENT} />
      <div className="flex flex-col h-full w-full">
        <HeaderStuTeach />
        <PageWrapper>{children}</PageWrapper>
      </div> */}
      <BreadcrumbProvider>
        <div>
          <SidebarStu />
          <div>
            <HeaderStuTeach />
            <PageWrapperStu>{children}</PageWrapperStu>
          </div>
        </div>
      </BreadcrumbProvider>
    </>
  );
}
