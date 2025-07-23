"use client";
import React, { useEffect, useState } from "react";
// import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
// import BranchSelector from "./BranchSelector";
import { Notification } from "../_common/Notification";
import { UserData } from "@/app/types";
import { SIDENAV_ITEMS_ADMIN } from "@/app/menu-constants";
import { usePathname, useRouter } from "next/navigation";
import DropdownProfile from "../_common/DropdownProfile";
import { handleLogoutCookies } from "@/app/lib/action";
import { getUserDataFromCookies } from "@/app/lib/action";
// import Tooltip from "../_common/Tooltip";
import BranchSelector from "./BranchSelector";
import { IoMenuOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";

const Header = ({
  handleMenuOpen,
  collapsed,
  setCollapsed,
}: {
  handleMenuOpen: (isOpen: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserData | null>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const userInfo = await getUserDataFromCookies();
  //     setUserInfo(userInfo);
  //   };
  //   fetchData();
  // }, []);

  const { data: userData, isSuccess } = useQuery({
    queryKey: ["UserData"],
    queryFn: () => getUserDataFromCookies(),
    staleTime: 0,
  });

  useEffect(() => {
    if (userData) {
      setUserInfo(userData);
    }
  }, [isSuccess, userData]);

  const handleProfileClick = () => {
    router.push("/admin/profile");
  };

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
      className={`h-[50px] md:h-header-height flex pl-2 md:pl-1 pr-3 md:pr-7 justify-between items-center bg-foreground 
        ${isMobile ? "" : collapsed ? "ml-from-sidebar-collapsed" : "ml-from-sidebar"}`}
    >
      <div
        className="flex items-center mr-2 select-none p-2 hover:bg-primary-lighter rounded-full
          transition-all cursor-pointer"
        onClick={() => {
          if (isMobile) {
            handleMenuOpen(true);
          } else {
            setCollapsed(!collapsed);
          }
        }}
      >
        <IoMenuOutline className="text-primary-darkest" size={20} />
      </div>
      <div className="text-md font-bold sm:text-lg mt-[1px] md:mt-0">
        {SIDENAV_ITEMS_ADMIN.find((item) => item.submenu)?.subMenuItems?.find(
          (subItem) => pathname?.includes(subItem.path),
        )?.title ||
          SIDENAV_ITEMS_ADMIN.find((item) => pathname?.includes(item.path))
            ?.title}
      </div>
      <div className="flex flex-1 gap-4 sm:gap-6 justify-end items-center">
        {!pathname?.includes("/admin/branches") &&
          !pathname?.includes("/admin/sessions") &&
          !pathname?.includes("/admin/profile") && <BranchSelector />}
        <div className="flex gap-2 sm:gap-3 items-center">
          {/* <Tooltip text="Thông báo" position="bottom">
            <div className="p-2 hidden md:flex rounded-3xl bg-primary cursor-pointer hover:shadow-md hover:bg-hover-primary transition-all">
              <IoNotificationsOutline size={24} />
            </div>
          </Tooltip>
          <Tooltip text="Thông báo" position="bottom">
            <IoNotifications className="size-8 flex md:hidden text-primary-dark hover:text-primary-darkest transition-all cursor-pointer" />
          </Tooltip> */}
          <Notification
            role={userInfo?.role.defaultRoute.toLowerCase() as string}
          />
          <DropdownProfile
            userInfo={userInfo}
            handleProfileClick={handleProfileClick}
            handleLogout={handleLogoutCookies}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Header);
