"use client";
import { useSideBarToggle } from "@/app/hooks/use-sidebar-toggle";
import classNames from "classnames";
import { ReactNode } from "react";

//bọc nội dung trang
export default function PageWrapper({ children }: { children: ReactNode }) {
  const { toggleCollapse } = useSideBarToggle();
  const bodyStyle = classNames(
    "bg-background flex flex-col py-4 p-4 h-full overflow-y-auto mt-3 mr-4",
    {
      ["pl-[18.4rem]"]: !toggleCollapse,
      ["pl-[9.7rem]"]: toggleCollapse,
    }
  );

  return <div className={bodyStyle}>{children}</div>;
}
