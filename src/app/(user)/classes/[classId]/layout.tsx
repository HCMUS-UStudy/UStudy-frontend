import Header from "@/app/ui/components/header";
import { SIDENAV_ITEMS_CLERK } from "@/app/menu_constants";
import PageWrapper from "@/app/ui/components/pagewrapper";
import Sidebar from "@/app/ui/sidebar/sidebar";
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
