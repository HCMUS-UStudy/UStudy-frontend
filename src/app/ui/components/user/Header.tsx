"use client";
import React, { useEffect, useState } from "react";
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
import { UserData, SideNavItem } from "@/app/types";
import {
  SIDENAV_ITEMS_STUDENT,
  SIDENAV_ITEMS_TEACHER,
} from "@/app/menu-constants";
import { usePathname, useRouter } from "next/navigation";
import DropdownProfile from "../_common/DropdownProfile";
import { handleLogoutCookies } from "@/app/lib/action";
import { getUserDataFromCookies } from "@/app/lib/action";
import { Select, SelectItem } from "../_common/Select";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { setSelectedChild } from "@/app/store/ChildrenSlice";
import Tooltip from "../_common/Tooltip";

const Header = ({ role }: { role: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [SIDENAV_ITEMS, setSIDENAV_ITEMS] = useState<SideNavItem[]>([]);

  const [toggleCollapse, setToggleCollapse] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const { selectedId, children } = useAppSelector((state) => state.children);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getUserDataFromCookies();
      setUserInfo(userInfo);
    };
    console.log(children.at(0));
    fetchData();
  }, [children]);

  useEffect(() => {
    if (role === "student") {
      setSIDENAV_ITEMS(SIDENAV_ITEMS_STUDENT);
    } else if (role === "teacher") {
      setSIDENAV_ITEMS(SIDENAV_ITEMS_TEACHER);
    }
  }, [role]);

  const handleProfileClick = () => {
    console.log(`${pathname?.split("/")[1]}/profile`);
    router.push(`${pathname?.split("/")[1]}/profile`);
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
      className={`h-header-height min-h-header-height flex px-5 sm:px-8 justify-between items-center bg-foreground 
        ${isMobile ? "ml-from-sidebar-mobile" : "ml-from-sidebar"}`}
    >
      <div className="hidden md:inline text-xl font-bold mt-1">
        {SIDENAV_ITEMS.find((item) => pathname?.includes(item.path))?.title}
      </div>
      <div className="flex flex-1 gap-6 justify-end md:justify-end items-center">
        <div className="flex gap-3 items-center" ref={dropdownRef}>
          {userInfo?.role.defaultRoute === "PARENT" &&
            pathname?.includes("/member/tuition") && (
              <Select
                defaultValue={selectedId}
                label="Chọn tài khoản"
                defaultLabel={selectedId}
                onValueChange={(id) => dispatch(setSelectedChild(id as string))}
              >
                {children.map((child) => (
                  <SelectItem key={child} value={child}>
                    {child}
                  </SelectItem>
                ))}
              </Select>
            )}
          <Tooltip text="Thông báo" position="bottom">
            <div className="p-2 hidden md:flex rounded-3xl bg-primary cursor-pointer hover:shadow-md hover:bg-hover-primary transition-all">
              <IoNotificationsOutline size={24} />
            </div>
          </Tooltip>
          <Tooltip text="Thông báo" position="bottom">
            <IoNotifications className="size-8 flex md:hidden text-primary-dark hover:text-primary-darkest transition-all cursor-pointer" />
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
