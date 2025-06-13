"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { routeMap } from "@/app/menu-constants";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPermissions } from "@/app/lib/services/permission";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowBack } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import Tooltip from "../Tooltip";

const Sidebar = ({
  isOpen,
  handleClose,
  collapsed,
  setCollapsed,
}: {
  isOpen: boolean;
  handleClose: (isOpen: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: permissions, status } = useQuery({
    queryKey: ["Permissions"],
    queryFn: () => getPermissions(),
  });

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

  // Create an ordered list of all menu paths
  const allMenuPaths = Object.keys(routeMap);

  // Sort permissions according to the order in allMenuPaths
  const sortedPermissions = permissions
    ?.slice()
    .sort((a: string, b: string) => {
      return allMenuPaths.indexOf(a) - allMenuPaths.indexOf(b);
    });

  return (
    <>
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.div
            initial={isMobile ? { x: "-100%" } : { x: 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={isMobile ? { x: "-100%" } : { x: 0, opacity: 0 }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className={`fixed transition-all duration-300 bg-foreground h-full z-50
              ${collapsed ? "w-sidebar-mobile" : " w-sidebar-width"}`}
          >
            {isMobile && (
              <div
                className="absolute top-1 right-1 z-50 cursor-pointer p-1 rounded-full hover:bg-primary-light"
                onClick={() => handleClose(false)}
              >
                <RxCross2 className="text-primary-darker" />
              </div>
            )}
            {!isMobile && (
              <div
                className={`absolute top-1/3 -right-2 transform -translate-y-1/2 cursor-pointer p-1
                  rounded-full text-primary-darker bg-primary-light hover:bg-primary
                  hover:text-primary-darkest transition-all duration-200 select-none
                  ${collapsed ? "rotate-180" : ""}`}
                onClick={() => setCollapsed(!collapsed)}
              >
                <IoIosArrowBack size={12} />
              </div>
            )}
            <div className="flex items-center justify-center pt-7 pb-7">
              {isMobile ? (
                <Image src="/logo.png" alt="Logo" width={100} height={100} />
              ) : collapsed ? (
                <Image
                  src="/UstudyIcon.png"
                  alt="Logo"
                  width={26}
                  height={26}
                />
              ) : (
                <Image src="/logo.png" alt="Logo" width={120} height={120} />
              )}
            </div>
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
                    if (!route) return null;
                    return (
                      <div
                        key={item}
                        className={`flex items-center px-[14px] py-[10px] rounded-2xl cursor-pointer transition-colors duration-200 ${
                          pathname?.includes(item)
                            ? "bg-primary hover:bg-hover-primary"
                            : "hover:bg-primary-light"
                        }`}
                        onClick={() => {
                          router.push(item);
                          handleClose(false);
                        }}
                      >
                        {collapsed ? (
                          <Tooltip text={route.title} position="right">
                            <div className="mt-[2px] w-6 h-6">{route.icon}</div>
                          </Tooltip>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="mt-[2px] w-6 h-6">{route.icon}</div>
                            <div className="text-[14px] font-[500]">
                              {route.title}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Overlay mờ khi sidebar mở ở mobile */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-gray-900 bg-opacity-40"
            onClick={() => handleClose(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
