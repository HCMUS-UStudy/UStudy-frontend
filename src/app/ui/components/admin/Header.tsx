"use client";
import React, { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
// import BranchSelector from "./BranchSelector";
import { UserData } from "@/app/types";
import { SIDENAV_ITEMS_ADMIN } from "@/app/menu-constants";
import { usePathname, useRouter } from "next/navigation";
import DropdownProfile from "../_common/DropdownProfile";
import { handleLogoutCookies } from "@/app/lib/action";
import { getUserDataFromCookies } from "@/app/lib/action";
import Tooltip from "../_common/Tooltip";

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserData | null>(null);

  const [toggleCollapse, setToggleCollapse] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getUserDataFromCookies();
      setUserInfo(userInfo);
    };
    fetchData();
  }, []);

  const handleProfileClick = () => {
    router.push("/admin/profile");
  };

  const handleToggle = () => {
    setToggleCollapse(!toggleCollapse);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setToggleCollapse(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      className={`h-header-height flex px-2 sm:px-8 justify-between items-center bg-foreground 
        ${isMobile ? "ml-from-sidebar-mobile" : "ml-from-sidebar"}`}
    >
      <div className="text-[15px] sm:text-lg font-bold mt-1">
        {SIDENAV_ITEMS_ADMIN.find((item) => item.submenu)?.subMenuItems?.find(
          (subItem) => pathname?.includes(subItem.path),
        )?.title ||
          SIDENAV_ITEMS_ADMIN.find((item) => pathname?.includes(item.path))
            ?.title}
      </div>
      <div className="flex gap-6 items-center">
        {/* {!pathname.includes("/admin/branches") &&
          !pathname.includes("/admin/sessions") &&
          !pathname.includes("/admin/profile") && <BranchSelector />} */}
        <div className="flex gap-3 items-center" ref={dropdownRef}>
          <Tooltip text="Thông báo" position="bottom">
            <div className="p-2 rounded-3xl bg-primary cursor-pointer hover:shadow-md hover:bg-hover-primary">
              <IoNotificationsOutline size={24} />
            </div>
          </Tooltip>
          <DropdownProfile
            userInfo={userInfo}
            handleToggle={handleToggle}
            toggleCollapse={toggleCollapse}
            handleProfileClick={handleProfileClick}
            handleLogout={handleLogoutCookies}
            dropdownRef={dropdownRef}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Header);
