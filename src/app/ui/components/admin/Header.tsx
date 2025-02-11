"use client";
import React, { useEffect, useState } from "react";
import { useSideBarToggle } from "@/app/hooks/use-sidebar-toggle";
import classNames from "classnames";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import BranchSelector from "./BranchSelector";
import "../../styles/header.css";
import { User } from "@/app/types/type";
import Breadcrumb from "@/app/ui/components/_common/Breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/ui/components/_common/DropdownMenu";

import { SIDENAV_ITEMS_ADMIN } from "@/app/menu-constants";
import { usePathname } from "next/navigation";

const Header: React.FC = () => {
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  // const { specificName } = useBreadcrumbContext();

  useEffect(() => {
    setUserInfo(JSON.parse(localStorage.getItem("userData") || "{}"));
  }, []);

  const handleProfileClick = () => {
    window.location.href = "/admin/profile"; // Chuyển hướng tới trang profile
  };

  const handleLogout = () => {
    // Xóa token và các thông tin khác trong localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("creator");
    localStorage.removeItem("userData");

    // Hiển thị thông báo thành công
    // Swal.fire({
    //   icon: "success",
    //   title: "Logout Successful",
    //   text: "You have been logged out successfully.",
    //   timer: 8000,
    //   showConfirmButton: false,
    // });

    // Chuyển hướng người dùng về trang đăng nhập
    window.location.href = "/admin/login";
  };

  const renderTitle = (): React.ReactNode => {
    if (pathname.startsWith("/clerk")) {
      if (pathname.includes("classes-management")) {
        return <div>Quản lý lớp học</div>;
      }
      return <div>Trang chủ lớp học</div>;
    }
  };

  return (
    // <div className="flex">
    //   <div className="gap-6 justify-between items-center">
    //     <div className="first-line text-xl font-bold tracking-wide mb-4">
    //       {renderTitle()}
    //       {/* Xin chào{" "}
    //       <span className="font-bold bg-gradient-to-r from-blue-800 to-blue-400 inline-block text-transparent bg-clip-text">
    //         {userInfo?.name}!
    //       </span>{" "} */}
    //       {/* {<PiHandWavingThin className="icon" size={25} />} */}
    //     </div>
    //     {/*<Breadcrumb specificName={specificName ? specificName : ""} />*/}
    //     {/* <Breadcrumb /> */}
    //     {pathname.includes("/admin") && (
    //       <div className="second-line">Chào mừng đến với trang Admin!</div>
    //     )}
    //   </div>

    //   <div className="right-items">
    //     {pathname !== "/admin/branches" && <BranchSelector />}

    //     <div className="notification">
    //       <IoNotificationsOutline size={20} />
    //     </div>

    //     <div className="user-setting">
    //       <DropdownMenu>
    //         <DropdownMenuTrigger>
    //           <FaUserCircle size={35} />
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent>
    //           <DropdownMenuItem onClick={handleProfileClick}>
    //             <div className="flex gap-3 items-center">
    //               <FaUserCircle size={18} className="" /> Profile
    //             </div>
    //           </DropdownMenuItem>
    //           <DropdownMenuSeparator />
    //           <DropdownMenuItem onClick={handleLogout}>
    //             <div className="flex gap-3 items-center">
    //               <FaSignOutAlt size={18} className="" /> Logout
    //             </div>
    //           </DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     </div>
    //   </div>
    // </div>
    <div className="flex ml-[230px] px-12 pt-8 pb-6 justify-between items-center bg-foreground">
      <div className="text-xl">
        {SIDENAV_ITEMS_ADMIN.find((item) => item.path === pathname)?.title}
      </div>
      <BranchSelector />
      <div className="flex gap-8">
        <div className="p-3 rounded-3xl bg-primary">
          <IoNotificationsOutline size={22} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2">
            {/* <FaUserCircle size={18} /> */}
            {userInfo?.avatar ? (
              <img
                src={userInfo.avatar}
                alt="User Avatar"
                className="w-11 h-11 rounded-full"
              />
            ) : (
              <FaUserCircle size={35} />
            )}
            <div> {userInfo?.name?.split(" ").slice(-2).join(" ")}</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleProfileClick}>
              <div className="flex gap-3 items-center">
                <FaUserCircle size={18} className="" /> Profile
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <div className="flex gap-3 items-center">
                <FaSignOutAlt size={18} className="" /> Logout
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default React.memo(Header);
