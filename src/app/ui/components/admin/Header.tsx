"use client";
import React, { useEffect, useState } from "react";
// import classNames from "classnames";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import BranchSelector from "./BranchSelector";
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

import { SIDENAV_ITEMS_ADMIN } from "@/app/menu-constants";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { handleLogoutCookies } from "@/app/lib/action";

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  // const { specificName } = useBreadcrumbContext();

  useEffect(() => {
    setUserInfo(JSON.parse(localStorage.getItem("userData") || "{}"));
  }, []);

  const handleProfileClick = () => {
    router.push("/admin/profile");
  };

  // const handleLogout = () => {
  //   // Xóa token và các thông tin khác trong localStorage
  //   localStorage.removeItem("accessToken");
  //   localStorage.removeItem("refreshToken");
  //   localStorage.removeItem("creator");
  //   localStorage.removeItem("userData");

  //   // Hiển thị thông báo thành công
  //   // Swal.fire({
  //   //   icon: "success",
  //   //   title: "Logout Successful",
  //   //   text: "You have been logged out successfully.",
  //   //   timer: 8000,
  //   //   showConfirmButton: false,
  //   // });

  //   // Chuyển hướng người dùng về trang đăng nhập
  //   router.push("/login");
  // };

  // const renderTitle = (): React.ReactNode => {
  //   if (pathname.startsWith("/clerk")) {
  //     if (pathname.includes("classes-management")) {
  //       return <div>Quản lý lớp học</div>;
  //     }
  //     return <div>Trang chủ lớp học</div>;
  //   }
  // };
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
    <div className="h-header-height flex ml-from-sidebar px-12 justify-between items-center bg-foreground">
      <div className="text-2xl font-bold">
        {
          SIDENAV_ITEMS_ADMIN.find((item) => pathname.includes(item.path))
            ?.title
        }
      </div>
      {!pathname.includes("/admin/branches") && <BranchSelector />}
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
