"use client";
import { usePathname } from "next/navigation";
import React from "react";

export default function ClassLayoutWrapper({
  children,
  layout,
}: {
  children: React.ReactNode;
  layout: React.ReactNode;
}) {
  const pathname = usePathname();

  // Kiểm tra nếu đường dẫn có chứa "forum"
  if (pathname.includes("/forum") || pathname.includes("/assignment/")) {
    return <>{children}</>;
  }

  return <>{layout}</>;
}
