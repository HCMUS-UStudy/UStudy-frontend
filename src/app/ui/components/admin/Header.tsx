"use client";
import React, { useEffect, useState } from "react";
// import classNames from "classnames";
import { IoNotificationsOutline } from "react-icons/io5";
// import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import BranchSelector from "./BranchSelector";
import { User } from "@/app/types/type";
// import Breadcrumb from "@/app/ui/components/_common/Breadcrumb";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/app/ui/components/_common/DropdownMenu";

import { SIDENAV_ITEMS_ADMIN } from "@/app/menu-constants";
import { usePathname, useRouter } from "next/navigation";
import DropdownProfile from "../_common/DropdownProfile";

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const [toggleCollapse, setToggleCollapse] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserInfo(JSON.parse(localStorage.getItem("userData") || "{}"));
  }, []);

  const handleProfileClick = () => {
    router.push("/admin/profile");
  };

  const handleToggle = () => {
    setToggleCollapse(!toggleCollapse);
  };

  const handleLogout = () => {
    // Xóa token và các thông tin khác trong localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("creator");
    localStorage.removeItem("userData");
    router.push("/admin/login");
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
      <div className="text-2xl font-bold">
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
          <div className="p-2 rounded-3xl bg-primary cursor-pointer">
            <IoNotificationsOutline size={24} />
          </div>
          <DropdownProfile
            userInfo={userInfo}
            handleToggle={handleToggle}
            toggleCollapse={toggleCollapse}
            handleProfileClick={handleProfileClick}
            handleLogout={handleLogout}
            dropdownRef={dropdownRef}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Header);
