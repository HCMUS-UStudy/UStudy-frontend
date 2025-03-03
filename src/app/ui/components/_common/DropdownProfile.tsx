"use client";

import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";

const DropdownProfile = ({
  userInfo,
  handleToggle,
  toggleCollapse,
  handleProfileClick,
  handleLogout,
  dropdownRef,
}: {
  userInfo: any;
  handleToggle: () => void;
  toggleCollapse: boolean;
  handleProfileClick: () => void;
  handleLogout: () => void;
  dropdownRef: any;
}) => {
  return (
    <div className="flex items-center" ref={dropdownRef}>
      <div
        className={`flex py-1 px-2 items-center border border-foreground gap-3 cursor-pointer
        hover:shadow-md rounded-2xl hover:border hover:border-gray-100 ${
          toggleCollapse ? "shadow-md border-gray-100" : ""
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
        <div className="text-[15px]">
          {" "}
          {userInfo?.name?.split(" ").slice(-2).join(" ")}
        </div>
      </div>
      {toggleCollapse && (
        <div
          className="absolute w-40 right-10 top-[76px] bg-white border border-gray-200
            shadow-lg rounded-xl text-[15px] z-50"
        >
          <div
            className="py-2 px-4 hover:bg-primary-light cursor-pointer rounded-t-xl"
            onClick={handleProfileClick}
          >
            <div className="flex gap-3 items-center">
              <FaUserCircle size={18} className="" /> Hồ sơ
            </div>
          </div>
          <div
            className="py-2 px-4 hover:bg-primary-light cursor-pointer rounded-b-xl"
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
