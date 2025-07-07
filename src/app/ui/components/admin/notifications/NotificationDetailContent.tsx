"use client";
import React from "react";
import { NotificationItem } from "@/app/types";
import Image from "next/image";

interface NotificationDetailContentProps {
  notification: NotificationItem;
}

const NotificationDetailContent: React.FC<NotificationDetailContentProps> = ({
  notification,
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SYSTEM":
        return (
          <svg
            className="w-5 h-5 text-white"
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
            className="w-5 h-5 text-white"
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
        return "bg-primary-lighter text-primary-darkest border-primary-light";
      case "CLASS":
        return "bg-primary-lighter text-primary-darkest border-primary-light";
      default:
        return "bg-primary-lighter text-primary-darkest border-primary-light";
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
    <div className="p-4 lg:p-6 animate-fadeIn">
      {/* Header with gradient background */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/5 via-primary/8 to-primary-light/12 rounded-xl"></div>
        <div className="relative p-4">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${getTypeGradient(notification.receiverType)} shadow-lg group-hover:scale-105 transition-transform duration-300`}
            >
              {getTypeIcon(notification.receiverType)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${getTypeBadgeColor(notification.receiverType)} shadow-sm`}
                >
                  {getTypeLabel(notification.receiverType)}
                </span>
                {!notification.read && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-300 shadow-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></div>
                    Chưa đọc
                  </span>
                )}
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-primary-darkest mb-3 leading-tight">
                {notification.title}
              </h1>
            </div>
          </div>

          {/* Sender and Time Info */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-primary-light/40 shadow-sm gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={notification.sender.avatar}
                  alt={notification.sender.name}
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10 shadow-md object-cover ring-2 ring-white"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <div className="font-semibold text-primary-darkest text-base">
                  {notification.sender.name}
                </div>
                <div className="text-xs text-primary-dark">Người gửi</div>
              </div>
            </div>
            <div className="flex items-center gap-2 lg:justify-end">
              <div className="text-right">
                <div className="text-xs text-primary-dark">Gửi lúc</div>
                <div className="font-semibold text-primary-darkest text-sm">
                  {formatDate(notification.sendDate)}
                </div>
              </div>
              <div className="p-2 bg-primary-lighter rounded-lg">
                <svg
                  className="w-4 h-4 text-primary-dark"
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary-dark rounded-full"></div>
          <h2 className="text-lg font-bold text-primary-darkest">
            Nội dung thông báo
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-primary-light/40 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-lighter to-primary-light/40 px-4 py-3 border-b border-primary-light/30">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-primary-dark"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="font-semibold text-primary-darkest text-sm">
                Chi tiết
              </span>
            </div>
          </div>

          <div className="p-4 lg:p-5">
            {notification.content ? (
              <div className="prose prose-sm max-w-none">
                <div className="text-primary-darkest leading-relaxed space-y-3">
                  {notification.content.split("\\n").map((line, index) => (
                    <p
                      key={index}
                      className="mb-3 last:mb-0 p-3 bg-primary-lighter/40 rounded-lg border-l-3 border-primary-light text-sm"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-primary-lighter to-primary-light rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-primary-dark"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-primary-dark text-sm italic">
                  Không có nội dung
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {/* <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-primary-light/40 shadow-sm gap-3">
          <div className="flex items-center gap-2 text-primary-dark">
            <svg
              className="w-4 h-4"
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
            <span className="text-xs">
              Gửi {formatDate(notification.sendDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-lighter text-primary-darkest rounded-md hover:bg-primary-light transition-colors duration-200 text-sm">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Lưu
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200 text-sm">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              Chia sẻ
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default NotificationDetailContent;
