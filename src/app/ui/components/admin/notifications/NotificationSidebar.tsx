"use client";
import React from "react";
import { Card } from "@/app/ui/components/_common/Card";
import { NotificationItem } from "@/app/types";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

interface NotificationSidebarProps {
  sidebarOpen: boolean;
  allNotifications: NotificationItem[];
  currentNotificationId: string;
  navigating: boolean;
  onNotificationClick: (notificationId: string) => void;
  onCloseSidebar: () => void;
}

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({
  sidebarOpen,
  allNotifications,
  currentNotificationId,
  navigating,
  onNotificationClick,
  onCloseSidebar,
}) => {
  // const getTypeIcon = (type: string) => {
  //   switch (type) {
  //     case "SYSTEM":
  //       return (
  //         <svg
  //           className="w-5 h-5 text-white animate-pulse"
  //           fill="none"
  //           stroke="currentColor"
  //           strokeWidth="2"
  //           viewBox="0 0 24 24"
  //         >
  //           <circle cx="12" cy="12" r="10" />
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             d="M12 8v4l3 3"
  //           />
  //         </svg>
  //       );
  //     case "CLASS":
  //       return (
  //         <svg
  //           className="w-5 h-5 text-white"
  //           fill="none"
  //           stroke="currentColor"
  //           strokeWidth="2"
  //           viewBox="0 0 24 24"
  //         >
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7"
  //           />
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             d="M16 3H8a2 2 0 00-2 2v0a2 2 0 002 2h8a2 2 0 002-2v0a2 2 0 00-2-2z"
  //           />
  //         </svg>
  //       );
  //     default:
  //       return (
  //         <svg
  //           className="w-5 h-5 text-white animate-pulse"
  //           fill="none"
  //           stroke="currentColor"
  //           strokeWidth="2"
  //           viewBox="0 0 24 24"
  //         >
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.797.657 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
  //           />
  //         </svg>
  //       );
  //   }
  // };

  // const getTypeLabel = (type: string) => {
  //   switch (type) {
  //     case "SYSTEM":
  //       return "Hệ thống";
  //     case "CLASS":
  //       return `Lớp ${allNotifications.find((n) => n.receiverType === type)?.className || ""}`;
  //     case "USER":
  //       return "Cá nhân";
  //     default:
  //       return type;
  //   }
  // };

  // const getTypeBadgeColor = (type: string) => {
  //   switch (type) {
  //     case "SYSTEM":
  //       return "bg-primary-lighter text-primary-darkest border-primary-light";
  //     case "CLASS":
  //       return "bg-primary-lighter text-primary-darkest border-primary-light";
  //     default:
  //       return "bg-primary-lighter text-primary-darkest border-primary-light";
  //   }
  // };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(diffInHours * 60);
        return `${diffInMinutes} phút trước`;
      }
      return `${Math.floor(diffInHours)} giờ trước`;
    } else if (diffInHours < 48) {
      return `Hôm qua lúc ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    } else {
      return ` ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}
      ${date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}`;
    }
  };

  return (
    <div
      className={`sidebar fixed lg:relative inset-y-0 left-0 z-40 w-80 lg:w-1/3 border-r border-primary-light bg-white overflow-y-auto ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <h2 className="text-lg font-bold text-primary-darkest flex items-center gap-2">
            Danh sách thông báo
          </h2>
          <button
            onClick={onCloseSidebar}
            className="lg:hidden p-2 text-primary-dark hover:text-primary-darkest transition-colors"
          >
            <IoClose className="text-xl" />
          </button>
        </div>
        <h2 className="text-lg font-bold text-primary-darkest mb-4 items-center gap-2 hidden lg:flex">
          Danh sách thông báo
        </h2>
        <div className="space-y-3">
          {allNotifications.map((item) => {
            const isUnread = !item.read;
            const isActive = item.id === currentNotificationId;
            return (
              <Card
                key={item.id}
                className={`cursor-pointer transition-all duration-300 group ${
                  isActive
                    ? "border-2 border-primary bg-primary-lighter shadow-lg scale-[1.02] ring-2 ring-primary/50"
                    : isUnread
                      ? "border-l-4 border-l-red-500 bg-red-50 hover:shadow-md"
                      : "hover:border-primary-light bg-white hover:shadow-md"
                } ${navigating ? "pointer-events-none opacity-75" : ""}`}
                style={{}}
                onClick={() => {
                  if (!navigating) {
                    onNotificationClick(item.id);
                  }
                }}
              >
                <div className="flex items-start gap-3 p-3">
                  {/* Icon */}
                  {isUnread && !isActive ? (
                    <span className="inline-flex items-center self-center">
                      <div className="w-1 h-1 sm:w-2 sm:h-2 bg-primary-darkest rounded-full animate-pulse"></div>
                      {/* Chưa đọc */}
                    </span>
                  ) : (
                    <>
                      <span className="inline-flex items-center self-center">
                        <div className="w-0.5 h-0.5 sm:w-1 sm:h-1"></div>
                      </span>
                    </>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold border ${item.receiverType === "SYSTEM" || item.receiverType === "CLASS" ? "bg-primary-lighter text-primary-darkest border-primary-light" : "bg-primary-lighter text-primary-darkest border-primary-light"}`}
                      >
                        {item.receiverType === "SYSTEM"
                          ? "Hệ thống"
                          : item.receiverType === "CLASS"
                            ? `Lớp ${item.className || ""}`
                            : item.receiverType === "USER"
                              ? "Cá nhân"
                              : item.receiverType}
                      </span>
                      {/* Hide badge if this is the active notification */}
                      {/* {isUnread && !isActive && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                          Chưa đọc
                        </span>
                      )} */}
                    </div>
                    <h3
                      className={`font-semibold text-primary-darkest mb-1 truncate ${
                        isActive ? "text-lg" : "text-sm"
                      } ${navigating ? "animate-pulse" : ""}`}
                    >
                      {item.title}
                    </h3>
                    {item.content && (
                      <p className="text-xs text-black line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Image
                          src={`/userAvatars/${item.sender.avatar}.png`}
                          alt={item.sender.name}
                          width={20}
                          height={20}
                          className="rounded-full w-5 h-5 shadow-sm object-cover"
                        />
                        <span className="text-xs font-medium text-black">
                          {item.sender.name}
                        </span>
                      </div>
                      <span className="text-xs text-black">
                        {formatDate(item.sendDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NotificationSidebar;
