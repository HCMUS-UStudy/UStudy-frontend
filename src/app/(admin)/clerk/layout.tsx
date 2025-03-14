import Header from "@/app/ui/components/admin/Header";
// import { SIDENAV_ITEMS_CLERK } from "@/app/menu-constants";
import PageWrapper from "@/app/ui/components/_common/PageWrapper";
// import Sidebar from "@/app/ui/components/_common/sidebar/Sidebar";
import React from "react";
import { BreadcrumbProvider } from "@/app/context/BreadcrumbContext";

export default function ClerkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BreadcrumbProvider>
      {/* <Sidebar menuItems={SIDENAV_ITEMS_CLERK} /> */}
      <div className="flex flex-col h-full w-full">
        <Header />
        <PageWrapper>{children}</PageWrapper>
      </div>
    </BreadcrumbProvider>
  );
}
