"use client";

import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";
import { UserData } from "@/app/types";
import { useRef, useEffect, useState } from "react";

const DropdownProfile = ({
  userInfo,
  handleProfileClick,
  handleLogout,
}: {
  userInfo: UserData | null;
  handleProfileClick: () => void;
  handleLogout: () => void;
}) => {
  const [toggleCollapse, setToggleCollapse] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setToggleCollapse((prev) => !prev);

  useEffect(() => {
    if (!toggleCollapse) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setToggleCollapse(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleCollapse]);

  return (
    <div className="flex items-center" ref={dropdownRef}>
      <div
        className={`flex py-1 px-2 items-center border-2 border-slate-200 gap-3 cursor-pointer
          rounded-lg transition-all select-none ${
            toggleCollapse ? "shadow-md border-slate-200" : "hover:shadow-md"
          }`}
        onClick={handleToggle}
      >
        {userInfo?.avatar ? (
          <Image
            src={`/userAvatars/${userInfo.avatar}.png`}
            alt="User Avatar"
            width={40}
            height={60}
            className="rounded-full size-8 md:w-10 md:h-10"
          />
        ) : (
          <FaUserCircle size={40} className="rounded-full" />
        )}
        <div className="hidden md:flex flex-col justify-center items-center">
          <div className="text-[13px]">
            {userInfo?.name?.split(" ").slice(-2).join(" ")}
          </div>
          <div className="text-[13px] text-gray-600">{userInfo?.genId}</div>
        </div>
      </div>
      {toggleCollapse && (
        <div
          className="absolute w-40 right-8 top-12 md:top-[70px] bg-white border border-gray-200
            shadow-lg rounded-lg text-sm md:text-[15px] z-50"
        >
          <div
            className="py-2 px-4 hover:bg-primary-light cursor-pointer rounded-t-lg transition-all"
            onClick={handleProfileClick}
          >
            <div className="flex gap-3 items-center text-gray-800">
              <FaUserCircle size={18} /> Hồ sơ
            </div>
          </div>
          <div
            className="py-2 px-4 hover:bg-primary-light cursor-pointer rounded-b-lg"
            onClick={handleLogout}
          >
            <div className="flex gap-3 items-center text-gray-800">
              <FaSignOutAlt size={18} /> Đăng xuất
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownProfile;
