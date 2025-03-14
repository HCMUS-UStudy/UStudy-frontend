"use client";
import PageWrapper from "@/app/ui/components/_common/PageWrapper";
import Sidebar from "@/app/ui/components/_common/sidebar/Sidebar";
import Header from "@/app/ui/components/user/Header";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      <Sidebar role="teacher" />
      <div className="flex flex-col h-full w-full">
        <Header role="teacher" />
        <PageWrapper> {children} </PageWrapper>
      </div>
    </div>
  );
}
