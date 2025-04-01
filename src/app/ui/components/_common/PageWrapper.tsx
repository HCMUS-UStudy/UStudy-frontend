"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

//bọc nội dung trang
export default function PageWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard =
    pathname.includes("dashboard") || pathname.includes("home");
  return (
    <div className="ml-from-sidebar bg-background p-4 h-[calc(100vh-var(--header-height))]">
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
