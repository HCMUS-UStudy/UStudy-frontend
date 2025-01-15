import Header from "@/app/ui/components/admin/Header";
import { SIDENAV_ITEMS_CLERK } from "@/app/menu-constants";
import PageWrapper from "@/app/ui/components/_common/PageWrapper";
import Sidebar from "@/app/ui/components/_common/sidebar/Sidebar";
import React from "react";

export default function ClerkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar menuItems={SIDENAV_ITEMS_CLERK} />
      <div className="flex flex-col h-full w-full">
        <Header />
        <PageWrapper>{children}</PageWrapper>
      </div>
    </>
  );
}
