"use client";

import { ReactNode } from "react";

//bọc nội dung trang
export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="ml-from-sidebar bg-background p-6 h-[calc(100vh-var(--header-height))]">
      <div className="h-full bg-foreground rounded-2xl p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
