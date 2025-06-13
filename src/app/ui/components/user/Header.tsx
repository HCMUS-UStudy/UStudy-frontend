"use client";
import React, { useEffect, useState } from "react";
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
import { Notification } from "../_common/Notification";
import { IoMenuOutline } from "react-icons/io5";

const Header = ({
  role,
  handleMenuOpen,
  collapsed,
}: {
  role: string;
  handleMenuOpen: (isOpen: boolean) => void;
  collapsed: boolean;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [SIDENAV_ITEMS, setSIDENAV_ITEMS] = useState<SideNavItem[]>([]);

  const { children, selectedChild } = useAppSelector((state) => state.children);
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
    router.push(`/${pathname?.split("/")[1]}/profile`);
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
      className={`h-[50px] md:h-header-height flex px-4 md:px-8 justify-between items-center bg-foreground 
        ${isMobile ? "" : collapsed ? "ml-from-sidebar-collapsed" : "ml-from-sidebar"}`}
    >
      <div
        className="flex md:hidden items-center mr-2 select-none p-2 hover:bg-primary-lighter rounded-full
        transition-all cursor-pointer"
        onClick={() => handleMenuOpen(true)}
      >
        <IoMenuOutline className="text-primary-darkest" size={20} />
      </div>
      <div className="text-md sm:text-lg font-bold">
        {SIDENAV_ITEMS.find((item) => pathname?.includes(item.path))?.title}
      </div>
      <div className="flex flex-1 gap-6 justify-end md:justify-end items-center">
        <div className="flex gap-2 sm:gap-3 items-center">
          {userInfo?.role.defaultRoute === "PARENT" &&
            pathname?.includes("/member/tuition") && (
              <Select
                defaultValue={selectedChild?.id}
                label="Chọn tài khoản"
                defaultLabel={selectedChild?.name}
                showClearButton={false}
                onValueChange={(child) => {
                  console.log(child);
                  dispatch(setSelectedChild(selectedChild));
                }}
              >
                {children.map((child) => (
                  <SelectItem key={child.id} value={JSON.stringify(child)}>
                    {child.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          {/* <Tooltip text="Thông báo" position="bottom">
            <div className="p-2 hidden md:flex rounded-3xl bg-primary cursor-pointer hover:shadow-md hover:bg-hover-primary transition-all">
              <IoNotificationsOutline size={24} />
            </div>
          </Tooltip> */}
          {/* <Tooltip text="Thông báo" position="bottom">
            <IoNotifications
              className="size-8 flex text-primary-dark hover:text-primary-darkest transition-all cursor-pointer"
              onClick={() => setShowNotification(!showNotification)}
            />
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
