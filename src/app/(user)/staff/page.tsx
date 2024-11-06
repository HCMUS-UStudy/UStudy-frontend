import Header from "@/app/ui/components/header";
import PageWrapper from "@/app/ui/components/pagewrapper";
import { SideBar } from "@/app/ui/sidebar/sidebar";
import React from "react";

export default function Staff({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SideBar />
      <div className="flex flex-col h-full w-full">
        <Header />
        <PageWrapper>{children}</PageWrapper>
      </div>
    </>
  );
}
