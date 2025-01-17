"use client";
import { useSideBarToggle } from "@/app/hooks/use-sidebar-toggle";
import classNames from "classnames";
import { ReactNode } from "react";

//bọc nội dung trang
export default function PageWrapper({ children }: { children: ReactNode }) {
  const { toggleCollapse } = useSideBarToggle();
  const bodyStyle = classNames(
    "bg-background flex flex-col p-4 min-h-screen mt-3 mr-4",
    {
      ["pl-[280px]"]: !toggleCollapse,
      ["pl-[150px]"]: toggleCollapse,
    },
  );

  return <div className={bodyStyle}>{children}</div>;
}
