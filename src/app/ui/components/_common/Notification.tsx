"use client";

import { useQuery } from "@tanstack/react-query";
import { getListNotification } from "@/app/lib/services/notification";
import { IoNotifications } from "react-icons/io5";
import Tooltip from "./Tooltip";
import { useRef, useEffect, useState } from "react";
import { NotificationItem } from "@/app/types";
import { useRouter } from "next/navigation";

export const Notification = ({ role }: { role: string }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch notifications
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getListNotification(),
    refetchOnWindowFocus: false,
  });

  const notifications = query.data || [];
  const isLoading = query.isLoading;

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="relative" ref={ref}>
      <Tooltip text="Thông báo" position="bottom">
        <div
          className={`flex items-center border-2 p-[10px] rounded-full shadow-sm cursor-pointer transition-colors
            ${showDropdown ? "bg-gray-50 border-gray-200" : "bg-white hover:shadow-md hover:bg-gray-50"}`}
          onClick={() => setShowDropdown((v) => !v)}
        >
          <IoNotifications
            className={`size-5 md:size-6 opacity-85
            ${showDropdown ? "text-primary-darkest" : "text-primary-dark"}`}
          />
        </div>
      </Tooltip>
      {showDropdown && (
        <div
          className="absolute -right-2 mt-[3px] w-[270px] sm:w-[350px] max-h-[70vh] bg-white shadow-lg border border-gray-200
          rounded-xl z-50 overflow-y-auto"
        >
          <div className="p-3 flex justify-between items-center border-b">
            <div className="font-bold text-primary-darkest text-md">
              Thông báo
            </div>
          </div>
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Đang tải...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Không có thông báo nào.
            </div>
          ) : (
            <ul>
              {notifications.map((item: NotificationItem, idx: number) => {
                // Tính số ngày trước
                let daysAgoLabel = "";
                if (item.sendDate) {
                  const createdDate = new Date(item.sendDate);
                  const now = new Date();
                  // Đặt giờ về 0 để chỉ so sánh ngày
                  createdDate.setHours(0, 0, 0, 0);
                  now.setHours(0, 0, 0, 0);
                  const diffTime = now.getTime() - createdDate.getTime();
                  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays === 0) daysAgoLabel = "Hôm nay";
                  else if (diffDays === 1) daysAgoLabel = "1 ngày trước";
                  else daysAgoLabel = `${diffDays} ngày trước`;
                }
                return (
                  <li
                    key={item.id || idx}
                    onClick={() => {
                      if (!item.read) {
                        item.read = true;
                      }
                      setShowDropdown(false);
                      router.push(`/${role}/notifications/${item.id}`);
                    }}
                    className={`px-3 py-2 border-b last:border-b-0 text-sm cursor-pointer
                      ${item.read ? "hover:bg-primary-light hover:opacity-90" : "bg-primary-light opacity-80 hover:bg-primary"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-primary-darkest text-[13px] sm:text-[14px]">
                        {item.receiverType === "CLASS" ? (
                          <span> Lớp {item.className}</span>
                        ) : item.receiverType === "SYSTEM" ? (
                          "Thông báo hệ thống"
                        ) : item.receiverType === "USER" ? (
                          "Thông báo cá nhân"
                        ) : (
                          item.receiverType
                        )}
                      </span>
                      {daysAgoLabel && (
                        <span className="ml-2 text-xs text-gray-600 whitespace-nowrap">
                          {daysAgoLabel}
                        </span>
                      )}
                    </div>
                    <div className="mt-[1px] text-gray-800 text-[13px] sm:text-[14px]">
                      {item.title}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
