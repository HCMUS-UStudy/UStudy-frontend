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
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SYSTEM":
        return (
          <svg
            className="w-5 h-5 text-white animate-pulse"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3"
            />
          </svg>
        );
      case "CLASS":
        return (
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 3H8a2 2 0 00-2 2v0a2 2 0 002 2h8a2 2 0 002-2v0a2 2 0 00-2-2z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5 text-white animate-pulse"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.797.657 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        );
    }
  };

  const getTypeGradient = (type: string) => {
    switch (type) {
      case "SYSTEM":
        return "from-primary-dark to-primary-darker";
      case "CLASS":
        return "from-primary to-primary-dark";
      default:
        return "from-primary-light to-primary";
    }
  };

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
      return "Hôm qua";
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  return (
    <div
      className={`sidebar fixed lg:relative inset-y-0 left-0 z-40 w-80 lg:w-1/3 border-r border-primary-light bg-white overflow-y-auto transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <h2 className="text-lg font-bold text-primary-darkest flex items-center gap-2">
            <svg
              className="w-5 h-5 text-primary-dark"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
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
          <svg
            className="w-5 h-5 text-primary-dark"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Danh sách thông báo
        </h2>
        <div className="space-y-3">
          {allNotifications.map((item, index) => {
            const isUnread = !item.read;
            const isActive = item.id === currentNotificationId;
            return (
              <Card
                key={item.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg group ${
                  isActive
                    ? "border-2 border-primary-dark bg-primary-lighter shadow-lg scale-[1.02]"
                    : isUnread
                      ? "border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white"
                      : "hover:border-primary-light bg-white"
                } ${navigating ? "pointer-events-none opacity-75" : ""}`}
                style={{
                  animationDelay: `${index * 30}ms`,
                  animationName: "slideInLeft",
                  animationDuration: "0.4s",
                  animationTimingFunction: "ease-out",
                  animationFillMode: "forwards",
                }}
                onClick={() => {
                  if (!navigating) {
                    onNotificationClick(item.id);
                  }
                }}
              >
                <div className="flex items-start gap-3 p-3">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${getTypeGradient(item.receiverType)} shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ${navigating ? "animate-pulse" : ""}`}
                  >
                    {getTypeIcon(item.receiverType)}
                  </div>

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
                      {isUnread && !isActive && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                          Chưa đọc
                        </span>
                      )}
                    </div>
                    <h3
                      className={`font-semibold text-primary-darkest mb-1 truncate ${
                        isActive ? "text-lg" : "text-sm"
                      } ${navigating ? "animate-pulse" : ""}`}
                    >
                      {item.title}
                    </h3>
                    {item.content && (
                      <p className="text-xs text-primary-dark line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Image
                          src={item.sender.avatar}
                          alt={item.sender.name}
                          width={20}
                          height={20}
                          className="rounded-full w-5 h-5 shadow-sm object-cover"
                        />
                        <span className="text-xs font-medium text-primary-darkest">
                          {item.sender.name}
                        </span>
                      </div>
                      <span className="text-xs text-primary-dark">
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
