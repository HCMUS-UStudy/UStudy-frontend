"use client";
import PageWrapper from "@/app/ui/components/_common/PageWrapper";
import Sidebar from "@/app/ui/components/_common/sidebar/Sidebar";
import Header from "@/app/ui/components/user/Header";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background h-screen">
      <Sidebar role="parent" />
      <div className="flex flex-col h-full w-full">
        <Header role="parent" />
        <PageWrapper>{children}</PageWrapper>
      </div>
    </div>
  );
}
