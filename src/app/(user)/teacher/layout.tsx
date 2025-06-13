"use client";
import PageWrapper from "@/app/ui/components/_common/PageWrapper";
import Sidebar from "@/app/ui/components/_common/sidebar/Sidebar";
import Header from "@/app/ui/components/user/Header";
import { useState } from "react";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="bg-background">
      <Sidebar isOpen={isMenuOpen} handleClose={() => setIsMenuOpen(false)} />

      <div className="flex flex-col h-full w-full">
        <Header role="teacher" handleMenuOpen={setIsMenuOpen} />
        <PageWrapper> {children} </PageWrapper>
      </div>
    </div>
  );
}
