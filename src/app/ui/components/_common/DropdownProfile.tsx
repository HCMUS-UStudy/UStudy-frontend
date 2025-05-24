"use client";

import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";
import { UserData } from "@/app/types";

const DropdownProfile = ({
  userInfo,
  handleToggle,
  toggleCollapse,
  handleProfileClick,
  handleLogout,
  dropdownRef,
}: {
  userInfo: UserData | null;
  handleToggle: () => void;
  toggleCollapse: boolean;
  handleProfileClick: () => void;
  handleLogout: () => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}) => {
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
            src={userInfo.avatar}
            alt="User Avatar"
            width={40}
            height={60}
            className="rounded-full w-10 h-10"
          />
        ) : (
          <FaUserCircle size={40} className="rounded-full" />
        )}
        <div className="hidden sm:flex flex-col justify-center items-center">
          <div className="text-[13px]">
            {userInfo?.name?.split(" ").slice(-2).join(" ")}
          </div>
          <div className="text-[13px] text-gray-600">{userInfo?.genId}</div>
        </div>
      </div>
      {toggleCollapse && (
        <div
          className="absolute w-40 right-10 top-[60px] bg-white border border-gray-200
            shadow-lg rounded-lg text-[15px] z-50"
        >
          <div
            className="py-2 px-4 hover:bg-primary-light cursor-pointer rounded-t-lg transition-all"
            onClick={handleProfileClick}
          >
            <div className="flex gap-3 items-center">
              <FaUserCircle size={18} className="" /> Hồ sơ
            </div>
          </div>
          <div
            className="py-2 px-4 hover:bg-primary-light cursor-pointer rounded-b-lg"
            onClick={handleLogout}
          >
            <div className="flex gap-3 items-center">
              <FaSignOutAlt size={18} className="" /> Đăng xuất
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownProfile;
