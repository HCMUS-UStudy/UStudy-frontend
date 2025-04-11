"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  SIDENAV_ITEMS_ADMIN,
  SIDENAV_ITEMS_STUDENT,
  SIDENAV_ITEMS_TEACHER,
} from "@/app/menu-constants";
import { useRouter, usePathname } from "next/navigation";
import { SideNavItem } from "@/app/types/type";
import Tooltip from "../Tooltip";

const Sidebar = ({ role }: { role: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [SIDENAV_ITEMS, setSIDENAV_ITEMS] = useState<SideNavItem[]>(
    role === "admin"
      ? SIDENAV_ITEMS_ADMIN
      : role === "teacher"
        ? SIDENAV_ITEMS_TEACHER
        : SIDENAV_ITEMS_STUDENT,
  );

  useEffect(() => {
    setSIDENAV_ITEMS(
      role === "admin"
        ? SIDENAV_ITEMS_ADMIN
        : role === "teacher"
          ? SIDENAV_ITEMS_TEACHER
          : SIDENAV_ITEMS_STUDENT,
    );
  }, [role]);

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
      className={`fixed transition-all duration-300 bg-foreground h-full
        ${isMobile ? "w-sidebar-mobile" : "w-sidebar-width"}`}
    >
      {!isMobile ? (
        <div className="flex items-center justify-center py-10">
          <Image src="/logo.png" alt="Logo" width={135} height={135} />
        </div>
      ) : (
        <div className="flex items-center justify-center py-10">
          <Image src="/UstudyIcon.png" alt="Logo" width={30} height={30} />
        </div>
      )}

      <div className="flex flex-col gap-[11px] px-4">
        {SIDENAV_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center px-[14px] py-[10px] rounded-2xl cursor-pointer transition-colors duration-200 ${
              pathname.includes(item.path)
                ? "bg-primary hover:bg-hover-primary"
                : "hover:bg-primary-light"
            }`}
            onClick={() => router.push(item.path)}
          >
            {!isMobile ? (
              <div className="flex items-center gap-2">
                <div className="mt-[2px] w-6 h-6">{item.icon}</div>
                <div className="text-[14px] font-[500]">{item.title}</div>
              </div>
            ) : (
              <Tooltip text={item.title} position="right">
                <div className="mt-[2px] w-6 h-6">{item.icon}</div>
              </Tooltip>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
