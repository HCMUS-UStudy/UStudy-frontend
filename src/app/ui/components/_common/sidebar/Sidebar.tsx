"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { routeMap } from "@/app/menu-constants";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPermissions } from "@/app/lib/services/permission";
import { RxCross2 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import Tooltip from "../Tooltip";

const Sidebar = ({
  isOpen,
  handleClose,
  collapsed,
}: {
  isOpen: boolean;
  handleClose: (isOpen: boolean) => void;
  collapsed: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { data: permissions, status } = useQuery({
    queryKey: ["Permissions"],
    queryFn: () => getPermissions(),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mounted]);

  // Create an ordered list of all menu paths
  const allMenuPaths = Object.keys(routeMap);

  // Sort permissions according to the order in allMenuPaths
  const sortedPermissions = permissions
    ?.slice()
    .sort((a: string, b: string) => {
      return allMenuPaths.indexOf(a) - allMenuPaths.indexOf(b);
    });

  if (!mounted) {
    return null; // Return null during SSR to prevent hydration mismatch
  }

  return (
    <>
      {isMobile ? (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={isMobile ? { x: "-100%" } : { x: 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={isMobile ? { x: "-100%" } : { x: 0, opacity: 0 }}
              transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
              className={`fixed transition-all duration-300 bg-foreground h-full z-40 w-sidebar-width`}
            >
              <div
                className="absolute top-1 right-1 z-50 cursor-pointer p-1 rounded-full hover:bg-primary-light"
                onClick={() => handleClose(false)}
              >
                <RxCross2 className="text-primary-darker" />
              </div>
              <div className="flex items-center justify-center pt-5 pb-6">
                <Image src="/logo.png" alt="Logo" width={100} height={100} />
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
                          <div className="flex items-center gap-2">
                            <div className="mt-[2px] w-6 h-6">{route.icon}</div>
                            <div className="text-[14px] font-[500]">
                              {route.title}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <div
          className={`fixed transition-all duration-300 bg-foreground h-full
            ${collapsed ? "w-sidebar-collapsed" : " w-sidebar-width"}`}
        >
          <div className="flex items-center justify-center pt-5 pb-6">
            {collapsed ? (
              <Image src="/UstudyIcon.png" alt="Logo" width={25} height={25} />
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
        </div>
      )}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-30 bg-gray-900 bg-opacity-40"
            onClick={() => handleClose(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
