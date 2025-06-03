"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard =
    pathname?.includes("dashboard") || pathname?.includes("home");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div
      className={`bg-background p-4 h-screen-height
      ${isMobile ? "ml-from-sidebar-mobile" : "ml-from-sidebar"}`}
    >
      {isDashboard ? (
        <div className="h-full p-3 bg-foreground overflow-y-auto">
          {children}
        </div>
      ) : (
        <div
          className={`h-full px-1 py-2 md:px-6 md:py-4 bg-foreground rounded-lg ${pathname === "/member/contact" ? "overflow-y-hidden" : "overflow-y-auto"}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
