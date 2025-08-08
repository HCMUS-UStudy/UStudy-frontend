"use client";
import PageWrapper from "@/app/ui/components/_common/PageWrapper";
import Sidebar from "@/app/ui/components/_common/sidebar/Sidebar";
import Header from "@/app/ui/components/user/Header";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [shouldHideLayout, setShouldHideLayout] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const hideLayout =
      pathname.includes("/assignment/") &&
      searchParams?.has("duration") &&
      searchParams?.has("format");

    setShouldHideLayout(hideLayout);
  }, [isClient, pathname, searchParams]);

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

  if (shouldHideLayout) {
    return (
      <div className="bg-background h-screen w-full overflow-auto">
        {children}
      </div>
    );
  }

  return (
    <div className="bg-background">
      <Sidebar
        isOpen={isMenuOpen}
        handleClose={() => setIsMenuOpen(false)}
        collapsed={collapsed}
      />

      <div className="flex flex-col h-full w-full">
        <Header
          role="member"
          handleMenuOpen={setIsMenuOpen}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <PageWrapper collapsed={collapsed}>{children}</PageWrapper>
      </div>
    </div>
  );
}
