"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { routeMap } from "@/app/menu-constants";
import { useRouter, usePathname } from "next/navigation";
import Tooltip from "../Tooltip";
import { useQuery } from "@tanstack/react-query";
import { getPermissions } from "@/app/lib/services/permission";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: permissions, status } = useQuery({
    queryKey: ["Permissions"],
    queryFn: () => getPermissions(),
  });
  // const permissions = useAppSelector(
  //   (state: RootState) => state.permission.screens,
  // );

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

  // useEffect(() => {
  //   const merged = isMobile
  //     ? SIDENAV_ITEMS.flatMap((item) =>
  //         item.submenu && item.subMenuItems ? item.subMenuItems : [item],
  //       )
  //     : SIDENAV_ITEMS;
  //   setMergedItems(merged);
  // }, [isMobile, SIDENAV_ITEMS]);

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
      {status === "pending" ? (
        <div className="flex flex-col gap-3 px-4">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="h-[42px] rounded-2xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-[11px] px-4">
            {permissions?.map((item: string) => {
              const route = routeMap[item];
              if (!route) {
                return null;
              }
              return (
                <div
                  key={item}
                  className={`flex items-center px-[14px] py-[10px] rounded-2xl cursor-pointer transition-colors duration-200 ${
                    pathname?.includes(item)
                      ? "bg-primary hover:bg-hover-primary"
                      : "hover:bg-primary-light"
                  }`}
                  onClick={() => router.push(item)}
                >
                  {!isMobile ? (
                    <div className="flex items-center gap-2">
                      <div className="mt-[2px] w-6 h-6">{route.icon}</div>
                      <div className="text-[14px] font-[500]">
                        {route.title}
                      </div>
                    </div>
                  ) : (
                    <Tooltip text={route.title} position="right">
                      <div className="mt-[2px] w-6 h-6">{route.icon}</div>
                    </Tooltip>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
