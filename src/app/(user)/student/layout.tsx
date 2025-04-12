"use client";

import { PropsWithChildren } from "react";
import Sidebar from "@/app/ui/components/_common/sidebar/Sidebar";
import Header from "@/app/ui/components/user/Header";
import PageWrapper from "@/app/ui/components/_common/PageWrapper";

interface StudentLayoutProps extends PropsWithChildren {}

export default function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <div className="bg-background">
      <Sidebar role="student" />
      <div className="flex flex-col h-full w-full">
        <Header role="student" />
        <PageWrapper>{children}</PageWrapper>
      </div>
    </div>
  );
}
