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

  // Create an ordered list of all menu paths
  const allMenuPaths = Object.keys(routeMap);

  // Sort permissions according to the order in allMenuPaths
  const sortedPermissions = permissions
    ?.slice()
    .sort((a: string, b: string) => {
      return allMenuPaths.indexOf(a) - allMenuPaths.indexOf(b);
    });

  return (
    <div
      className={`fixed transition-all duration-300 bg-foreground h-full
        ${isMobile ? "w-sidebar-mobile" : "w-sidebar-width"}`}
    >
      {!isMobile ? (
        <div className="flex items-center justify-center pt-8 pb-7">
          <Image src="/logo.png" alt="Logo" width={135} height={135} />
        </div>
      ) : (
        <div className="flex items-center justify-center pt-6 pb-6">
          <Image src="/UstudyIcon.png" alt="Logo" width={28} height={28} />
        </div>
      )}
      {status === "pending" ? (
        <div className="flex flex-col gap-2 px-4 mt-2">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="h-[42px] rounded-2xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-[6px] px-3">
            {(sortedPermissions || []).map((item: string) => {
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
