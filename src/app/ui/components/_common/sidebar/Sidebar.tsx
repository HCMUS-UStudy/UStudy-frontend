"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  SIDENAV_ITEMS_ADMIN,
  SIDENAV_ITEMS_PARENT,
  SIDENAV_ITEMS_STUDENT,
  SIDENAV_ITEMS_TEACHER,
} from "@/app/menu-constants";
import { useRouter, usePathname } from "next/navigation";
import Tooltip from "../Tooltip";
import { SideNavItem } from "@/app/types/common";
import { RootState, useAppSelector } from "@/app/store/store";
import { IoMdArrowDropdown } from "react-icons/io";

const Sidebar = ({ role }: { role: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const permissions = useAppSelector(
    (state: RootState) => state.permission.screens,
  );
  const [openSubMenu, setOpenSubMenu] = useState<SideNavItem>();
  const [subMenuItems, setSubMenuItems] = useState<SideNavItem[] | undefined>(
    [],
  );
  const [activeSidebarItem, setActiveSidebarItem] = useState<boolean>(false);

  const [SIDENAV_ITEMS, setSIDENAV_ITEMS] = useState<SideNavItem[]>(
    role === "admin"
      ? SIDENAV_ITEMS_ADMIN
      : role === "teacher"
        ? SIDENAV_ITEMS_TEACHER
        : role === "parent"
          ? SIDENAV_ITEMS_PARENT
          : SIDENAV_ITEMS_STUDENT,
  );

  const [mergedItems, setMergedItems] = useState<SideNavItem[]>([]);

  useEffect(() => {
    setSIDENAV_ITEMS(
      role === "admin"
        ? SIDENAV_ITEMS_ADMIN
        : role === "teacher"
          ? SIDENAV_ITEMS_TEACHER
          : role === "parent"
            ? SIDENAV_ITEMS_PARENT
            : SIDENAV_ITEMS_STUDENT,
    );
  }, [role]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    console.log(permissions);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [permissions]);

  // const mergedItems = isMobile
  //   ? SIDENAV_ITEMS.flatMap((item) =>
  //       item.submenu && item.subMenuItems
  //         ? [
  //             { ...item, submenu: false, subMenuItems: undefined }, // item chính
  //             ...item.subMenuItems, // gộp các submenu
  //           ]
  //         : [item],
  //     )
  //   : SIDENAV_ITEMS;

  useEffect(() => {
    const merged = isMobile
      ? SIDENAV_ITEMS.flatMap((item) =>
          item.submenu && item.subMenuItems ? item.subMenuItems : [item],
        )
      : SIDENAV_ITEMS;
    setMergedItems(merged);
  }, [isMobile, SIDENAV_ITEMS]);

  return (
    <div
      className={`fixed transition-all duration-300 bg-foreground h-full
        ${isMobile ? "w-sidebar-mobile" : "w-sidebar-width"}`}
    >
      {!isMobile ? (
        <div className="flex items-center justify-center pt-8 pb-6">
          <Image src="/logo.png" alt="Logo" width={135} height={135} />
        </div>
      ) : (
        <div className="flex items-center justify-center pt-8 pb-6">
          <Image src="/UstudyIcon.png" alt="Logo" width={30} height={30} />
        </div>
      )}

      <div className="flex flex-col gap-[6px] px-4">
        {mergedItems.map((item, idx) => (
          <div key={idx}>
            {item.submenu && item.subMenuItems && !isMobile ? (
              <div
                className={`w-full ${openSubMenu === item ? "border-b border-gray-300 pb-1 -mt-1" : ""}`}
              >
                <button
                  className={`flex items-center justify-between pl-[14px] pr-[10px] py-[9px] rounded-2xl w-full
                    ${
                      activeSidebarItem && !openSubMenu
                        ? "bg-primary-light"
                        : "hover:bg-primary-lighter"
                    }`}
                  onClick={() => {
                    if (openSubMenu === item) {
                      setOpenSubMenu(undefined);
                      setSubMenuItems([]);
                      const isActiveItem = subMenuItems?.some((subItem) =>
                        pathname.includes(subItem.path),
                      );
                      setActiveSidebarItem(isActiveItem || false);
                    } else {
                      setOpenSubMenu(item);
                      setSubMenuItems(item.subMenuItems);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="mt-[2px] w-6 h-6">{item.icon}</div>
                    <div className="text-[14px] font-[500]">{item.title}</div>
                  </div>
                  <div
                    className={`cursor-pointer p-[2px] rounded-full 
                      ${activeSidebarItem && !openSubMenu ? "hover:bg-hover-primary" : "hover:bg-primary"}`}
                  >
                    <IoMdArrowDropdown
                      size={20}
                      className={` ${
                        openSubMenu === item ? "" : "-rotate-180"
                      } transition-transform duration-200`}
                    />
                  </div>
                </button>
                {openSubMenu === item && subMenuItems && (
                  <div className="flex flex-col gap-[6px] ml-3 mt-[8px]">
                    {subMenuItems.map((subItem, subIdx) => (
                      <button
                        key={subIdx}
                        className={`flex gap-2 items-center px-[12px] py-[9px] rounded-2xl w-full
                        transition-colors duration-200 
                        ${
                          pathname.includes(subItem.path)
                            ? "bg-primary hover:bg-hover-primary"
                            : "hover:bg-primary-light"
                        }`}
                        onClick={() => {
                          router.push(subItem.path);
                        }}
                      >
                        <div className="mt-[2px] w-6 h-6">{subItem.icon}</div>
                        <div className="text-[14px] font-[500]">
                          {subItem.title}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                className={`flex items-center px-[14px] py-[10px] rounded-2xl w-full
                  transition-colors duration-200 
                  ${
                    pathname.includes(item.path)
                      ? "bg-primary hover:bg-hover-primary"
                      : "hover:bg-primary-light"
                  }`}
                onClick={() => {
                  setActiveSidebarItem(false);
                  router.push(item.path);
                }}
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
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
