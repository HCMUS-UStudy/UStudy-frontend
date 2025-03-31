"use client";
import React, { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { UserData, SideNavItem } from "@/app/types/type";
import {
  SIDENAV_ITEMS_STUDENT,
  SIDENAV_ITEMS_TEACHER,
} from "@/app/menu-constants";
import { usePathname, useRouter } from "next/navigation";
import DropdownProfile from "../_common/DropdownProfile";
import { handleLogoutCookies } from "@/app/lib/action";
import { getUserDataFromCookies } from "@/app/lib/action";

const Header = ({ role }: { role: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [SIDENAV_ITEMS, setSIDENAV_ITEMS] = useState<SideNavItem[]>([]);

  const [toggleCollapse, setToggleCollapse] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getUserDataFromCookies();
      setUserInfo(userInfo);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (role === "student") {
      setSIDENAV_ITEMS(SIDENAV_ITEMS_STUDENT);
    } else if (role === "teacher") {
      setSIDENAV_ITEMS(SIDENAV_ITEMS_TEACHER);
    }
  }, [role]);

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
      <div className="text-xl font-bold mt-1">
        {SIDENAV_ITEMS.find((item) => pathname.includes(item.path))?.title}
      </div>
      <div className="flex gap-6 items-center">
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
