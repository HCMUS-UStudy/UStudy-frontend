"use client";
import React, { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import BranchSelector from "./BranchSelector";
import { UserData } from "@/app/types";
import { SIDENAV_ITEMS_ADMIN } from "@/app/menu-constants";
import { usePathname, useRouter } from "next/navigation";
import DropdownProfile from "../_common/DropdownProfile";
import { handleLogoutCookies } from "@/app/lib/action";
import { getUserDataFromCookies } from "@/app/lib/action";

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

  return (
    <div className="h-header-height flex ml-from-sidebar px-12 justify-between items-center bg-foreground">
      <div className="text-2xl font-bold mt-1">
        {
          SIDENAV_ITEMS_ADMIN.find((item) => pathname.includes(item.path))
            ?.title
        }
      </div>
      <div className="flex gap-6 items-center">
        {!pathname.includes("/admin/branches") &&
          !pathname.includes("/admin/sessions") &&
          !pathname.includes("/admin/profile") && <BranchSelector />}
        <div className="flex gap-3 items-center" ref={dropdownRef}>
          <div className="p-2 rounded-3xl bg-primary cursor-pointer hover:shadow-md hover:bg-hover-primary">
            <IoNotificationsOutline size={24} />
          </div>
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
