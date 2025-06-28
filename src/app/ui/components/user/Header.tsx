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
import { setChildren, setSelectedChild } from "@/app/store/ChildrenSlice";
import { Notification } from "../_common/Notification";
import { IoMenuOutline } from "react-icons/io5";
import Image from "next/image";

const Header = ({
  role,
  handleMenuOpen,
  collapsed,
  setCollapsed,
}: {
  role: string;
  handleMenuOpen: (isOpen: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userInfoWithChildren = userInfo as UserData & { children?: any[] };
      if (
        userInfoWithChildren?.role.defaultRoute === "PARENT" &&
        userInfoWithChildren.children &&
        userInfoWithChildren.children.length > 0 &&
        children.length === 0
      ) {
        dispatch(setChildren(userInfoWithChildren.children));
        dispatch(setSelectedChild(userInfoWithChildren.children[0]));
      }
    };
    console.log(children.at(0));
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
      <div className="text-md sm:text-lg font-bold mt-[1px] md:mt-0">
        {SIDENAV_ITEMS.find((item) => pathname?.includes(item.path))?.title ??
          "Thông tin cá nhân"}
      </div>
      <div className="flex flex-1 gap-6 justify-end md:justify-end items-center">
        <div className="flex gap-2 sm:gap-3 items-center">
          {userInfo?.role.defaultRoute === "PARENT" &&
            (pathname?.includes("/member/tuition") ||
              pathname?.includes("/member/schedule") ||
              pathname?.includes("/member/academic-result")) &&
            (children.length === 1 ? (
              <div className="flex flex-col items-start gap-0.5">
                <label className="block text-xs font-medium text-primary-darkest mb-0.5">
                  Chọn học sinh
                </label>
                <div className="flex items-center gap-1 border border-gray-200 rounded-md bg-white px-1.5 py-0.5 text-sm max-w-[140px]">
                  {children[0].avatar ? (
                    <Image
                      src={children[0].avatar}
                      alt="avatar"
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg">👦</span>
                  )}
                  <span className="font-medium">{children[0].name}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-1">
                <label className="block text-xs font-medium text-primary-darkest">
                  Chọn học sinh
                </label>
                <Select
                  className="min-w-[160px] w-auto max-w-none rounded-lg border border-primary-light bg-white shadow text-sm px-2 py-1"
                  defaultLabel={selectedChild?.name}
                  showClearButton={false}
                  onValueChange={(value) => {
                    if (typeof value === "string" && value.trim() !== "") {
                      try {
                        const child = JSON.parse(value);
                        dispatch(setSelectedChild(child));
                      } catch (e) {
                        console.log(e);
                      }
                    }
                  }}
                >
                  {children.map((child) => {
                    const content = (
                      <span className="flex items-center gap-2">
                        {child.avatar ? (
                          <Image
                            src={child.avatar}
                            alt="avatar"
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xl">👦</span>
                        )}
                        <span className="font-medium">{child.name}</span>
                      </span>
                    );
                    return (
                      <SelectItem
                        key={child.id}
                        value={JSON.stringify(child)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-light/30 focus:bg-primary-light/50 transition-all text-sm"
                      >
                        {content}
                      </SelectItem>
                    );
                  })}
                </Select>
              </div>
            ))}
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
