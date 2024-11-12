import Header from "@/app/ui/components/header";
import { SIDENAV_ITEMS_STAFF } from "@/app/menu_constants";
import PageWrapper from "@/app/ui/components/pagewrapper";
import Sidebar from "@/app/ui/sidebar/sidebar";
import React from "react";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar menuItems={SIDENAV_ITEMS_STAFF}/>
      <div className="flex flex-col h-full w-full">
        <Header />
        <PageWrapper>{children}</PageWrapper>
      </div>
    </>
  );
}
