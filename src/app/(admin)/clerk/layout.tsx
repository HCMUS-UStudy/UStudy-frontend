import Header from "@/app/(admin)/_components/Header";
import { SIDENAV_ITEMS_CLERK } from "@/app/menu_constants";
import PageWrapper from "@/app/ui/components/common/PageWrapper";
import Sidebar from "@/app/ui/sidebar/sidebar";
import React from "react";
import { SpecificNameProvider } from "@/app/context/context";

export default function ClerkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SpecificNameProvider>
      <Sidebar menuItems={SIDENAV_ITEMS_CLERK} />
      <div className="flex flex-col h-full w-full">
        <Header />
        <PageWrapper>{children}</PageWrapper>
      </div>
    </SpecificNameProvider>
  );
}
