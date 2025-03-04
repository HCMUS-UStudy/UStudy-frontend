"use client";
import React, { useEffect, useState } from "react";
// import classNames from "classnames";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import "../../styles/header.css";
import { User } from "@/app/types/type";
// import Breadcrumb from "@/app/ui/components/_common/Breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/ui/components/_common/DropdownMenu";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { handleLogoutCookies } from "@/app/lib/action";
import { SIDENAV_ITEMS_STUDENT } from "@/app/menu-constants";

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  // const { specificName } = useBreadcrumbContext();

  useEffect(() => {
    setUserInfo(JSON.parse(localStorage.getItem("userData") || "{}"));
  }, []);

  const handleProfileClick = () => {
    router.push("/student/profile");
  };

  return (
    <div className="h-header-height flex ml-from-sidebar px-12 justify-between items-center bg-foreground">
      <div className="text-2xl font-bold">
        {
          SIDENAV_ITEMS_STUDENT.find((item) =>
            item.menuList.some((menu) => pathname.includes(menu.path)),
          )?.title
        }
      </div>

      <div className="flex gap-6 items-center">
        <div className="p-2 rounded-3xl bg-primary cursor-pointer">
          <IoNotificationsOutline size={24} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3">
            {/* <FaUserCircle size={18} /> */}
            {userInfo?.avatar ? (
              <Image
                src={userInfo.avatar}
                alt="User Avatar"
                width={40}
                height={60}
                className="rounded-full w-10 h-10"
              />
            ) : (
              <FaUserCircle size={40} className="rounded-full" />
            )}
            <div className="text-[15px]">
              {" "}
              {userInfo?.name?.split(" ").slice(-2).join(" ")}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleProfileClick}>
              <div className="flex gap-3 items-center">
                <FaUserCircle size={18} className="" /> Trang cá nhân
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogoutCookies}>
              <div className="flex gap-3 items-center">
                <FaSignOutAlt size={18} className="" /> Đăng xuất
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default React.memo(Header);
