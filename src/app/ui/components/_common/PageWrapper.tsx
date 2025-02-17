"use client";

import { ReactNode } from "react";

//bọc nội dung trang
export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="ml-from-sidebar bg-background p-[26px] h-[calc(100vh-var(--header-height))]">
      <div className="h-full bg-foreground rounded-[22px] pt-9 pb-6 px-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
