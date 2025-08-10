"use client";
import React from "react";
import { Card } from "@/app/ui/components/_common/Card";
import { NotificationItem } from "@/app/types";
import Image from "next/image";

interface NotificationCardProps {
  notification: NotificationItem;
  index: number;
  onClick: (notification: NotificationItem) => void;
  currentNotificationId?: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  index,
  onClick,
  currentNotificationId,
}) => {
  const isUnread = !notification.read;

  // const getTypeIcon = (type: string) => {
  //   switch (type) {
  //     case "SYSTEM":
  //       return (
  //         <svg
  //           className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse"
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
  //           className="w-3 h-3 sm:w-4 sm:h-4"
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
  //           className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse"
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "SYSTEM":
        return "Hệ thống";
      case "CLASS":
        return `Lớp ${notification.className || ""}`;
      case "USER":
        return "Cá nhân";
      default:
        return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "SYSTEM":
        return "bg-primary-light text-primary-darkest";
      case "CLASS":
        return "bg-primary-light text-primary-darkest";
      default:
        return "bg-primary-light text-primary-darkest";
    }
  };

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
    <Card
      className={`cursor-pointer rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] group ${
        isUnread
          ? "border-l-4 border-l-primary-dark bg-primary-lighter"
          : "hover:border-primary bg-white"
      }`}
      style={{
        animationDelay: `${index * 50}ms`,
        animationName: "slideInUp",
        animationDuration: "0.5s",
        animationTimingFunction: "ease-out",
        animationFillMode: "forwards",
      }}
      onClick={() => onClick(notification)}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-4">
        {/* Icon with gradient */}
        {/* <div
          className={`hidden w-8 h-8 sm:w-10 sm:h-10 rounded-2xl sm:flex items-center justify-center bg-primary-light shadow-sm flex-shrink-0 transition-transform duration-300 self-start`}
        >
          {getTypeIcon(notification.receiverType)}
        </div> */}
        {isUnread && notification.id !== currentNotificationId ? (
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

        {/* Content - Main section */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span
                className={`text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-semibold ${getTypeBadgeColor(notification.receiverType)}`}
              >
                {getTypeLabel(notification.receiverType)}
              </span>
            </div>
          </div>

          <h3
            className={`font-bold text-primary-darkest mb-2 group-hover:text-primary-dark transition-colors duration-200 leading-tight ${
              isUnread ? "text-lg sm:text-xl" : "text-base sm:text-lg"
            }`}
          >
            {notification.title}
          </h3>

          {notification.content && (
            <p className="text-black leading-relaxed text-sm line-clamp-2 font-medium mb-1 sm:mb-0">
              {notification.content}
            </p>
          )}
        </div>

        {/* Right side - Sender and Time */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 flex-shrink-0 min-w-0">
          {/* Sender info */}
          <div className="flex items-center gap-2 p-1.5 sm:p-2">
            <Image
              src={`/userAvatars/${notification.sender.avatar}.png`}
              alt={notification.sender.name}
              width={24}
              height={24}
              className="rounded-full w-6 h-6 sm:w-7 sm:h-7 shadow-sm object-cover ring-2 ring-white flex-shrink-0"
            />
            <div className="text-right hidden sm:block min-w-0">
              <div className="text-xs font-semibold text-black break-words">
                {notification.sender.name}
              </div>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-black">
            <svg
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3"
              />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span className="whitespace-nowrap">
              {formatDate(notification.sendDate)}
            </span>
          </div>

          {/* View details hint */}
          {/* <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-primary-dark">
            <svg
              className="w-3 h-3 sm:w-3.5 sm:h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="hidden sm:inline">Chi tiết</span>
          </div> */}
        </div>
      </div>
    </Card>
  );
};

export default NotificationCard;
