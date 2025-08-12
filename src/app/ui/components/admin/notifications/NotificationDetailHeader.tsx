"use client";
import React from "react";
import { IoReturnUpBack, IoMenu, IoClose } from "react-icons/io5";

interface NotificationDetailHeaderProps {
  onBack: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const NotificationDetailHeader: React.FC<NotificationDetailHeaderProps> = ({
  onBack,
  sidebarOpen,
  onToggleSidebar,
}) => {
  return (
    <div className="bg-white border-b border-primary-light pb-2">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-3 px-4 py-2.5 text-primary-darkest hover:text-primary-dark transition-all duration-300 group"
        >
          <IoReturnUpBack className="text-xl group-hover:scale-110 transition-transform duration-300" />
          <span className="font-semibold text-sm hidden sm:inline">
            Trở về danh sách
          </span>
        </button>

        {/* Mobile Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden sidebar-toggle flex items-center justify-center w-10 h-10 text-primary-darkest rounded-lg hover:from-primary-light hover:to-primary transition-all duration-300 shadow-sm hover:shadow-md"
        >
          {sidebarOpen ? (
            <IoClose className="text-xl" />
          ) : (
            <IoMenu className="text-xl" />
          )}
        </button>
      </div>
    </div>
  );
};

export default NotificationDetailHeader;
