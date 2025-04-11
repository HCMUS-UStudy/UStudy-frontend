"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard =
    pathname.includes("dashboard") || pathname.includes("home");

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
      className={`bg-background p-4 h-[calc(100vh-var(--header-height))]
      ${isMobile ? "ml-from-sidebar-mobile" : "ml-from-sidebar"}`}
    >
      {isDashboard ? (
        <div className="h-full p-1 overflow-y-auto">{children}</div>
      ) : (
        <div className="h-full bg-foreground rounded-lg pt-6 pb-6 px-8 overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
}
