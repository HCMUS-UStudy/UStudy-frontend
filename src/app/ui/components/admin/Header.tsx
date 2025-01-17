"use client";
import React, { useEffect, useState } from "react";
import { useSideBarToggle } from "@/app/hooks/use-sidebar-toggle";
import classNames from "classnames";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { usePathname } from "next/navigation";
import BranchSelector from "./BranchSelector";
import "../../styles/header.css";
import Swal from "sweetalert2";
import { getUserInfo } from "@/app/lib/storage";
import { User } from "@/app/types/type";
import Breadcrumb from "@/app/ui/components/_common/Breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/ui/components/_common/DropdownMenu";

const Header: React.FC = () => {
  const { toggleCollapse } = useSideBarToggle();
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  // const { specificName } = useBreadcrumbContext();

  useEffect(() => {
    setUserInfo(getUserInfo());
  }, []);

  const handleProfileClick = () => {
    window.location.href = "/admin/profile"; // Chuyển hướng tới trang profile
  };

  const handleLogout = () => {
    console.log(userInfo);
    // Xóa token và các thông tin khác trong localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("creator");
    localStorage.removeItem("userData");

    // Hiển thị thông báo thành công
    Swal.fire({
      icon: "success",
      title: "Logout Successful",
      text: "You have been logged out successfully.",
      timer: 8000,
      showConfirmButton: false,
    });

    // Chuyển hướng người dùng về trang đăng nhập
    window.location.href = "/admin/login";
  };

  const headerStyle = classNames({
    ["header isWide"]: !toggleCollapse,
    ["header isNarrow"]: toggleCollapse,
  });

  const renderTitle = (): React.ReactNode => {
    if (pathname.startsWith("/clerk")) {
      if (pathname.includes("classes-management")) {
        return <div>Quản lý lớp học</div>;
      }
      return <div>Trang chủ lớp học</div>;
    }
  };

  return (
    <div className={headerStyle}>
      <div className="gap-6 justify-between items-center">
        <div className="first-line text-xl font-bold tracking-wide mb-4">
          {renderTitle()}
          {/* Xin chào{" "}
          <span className="font-bold bg-gradient-to-r from-blue-800 to-blue-400 inline-block text-transparent bg-clip-text">
            {userInfo?.name}!
          </span>{" "} */}
          {/* {<PiHandWavingThin className="icon" size={25} />} */}
        </div>
        {/*<Breadcrumb specificName={specificName ? specificName : ""} />*/}
        <Breadcrumb />
        {pathname.includes("/admin") && (
          <div className="second-line">Chào mừng đến với trang Admin!</div>
        )}
      </div>

      <div className="right-items">
        {pathname !== "/admin/branches" && <BranchSelector />}

        <div className="notification">
          <IoNotificationsOutline size={20} />
        </div>

        <div className="user-setting">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <FaUserCircle size={35} />
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
    </div>
  );
};

export default React.memo(Header);
