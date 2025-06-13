"use client";
import PageWrapper from "@/app/ui/components/_common/PageWrapper";
import Sidebar from "@/app/ui/components/_common/sidebar/Sidebar";
import Header from "@/app/ui/components/user/Header";
import { useState, useEffect } from "react";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setCollapsed(false);
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="bg-background">
      <Sidebar
        isOpen={isMenuOpen}
        handleClose={() => setIsMenuOpen(false)}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="flex flex-col h-full w-full">
        <Header
          role="member"
          handleMenuOpen={setIsMenuOpen}
          collapsed={collapsed}
        />
        <PageWrapper collapsed={collapsed}> {children} </PageWrapper>
      </div>
    </div>
  );
}
