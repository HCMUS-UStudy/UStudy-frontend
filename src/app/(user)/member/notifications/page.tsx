"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { getListNotification } from "@/app/lib/services/notification";
import { NotificationItem } from "@/app/types";
import Image from "next/image";
import Loading from "@/app/ui/components/_common/loading/Loading";

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const router = useRouter();
  const [popupId, setPopupId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getListNotification();
      setNotifications(
        data.sort(
          (a: NotificationItem, b: NotificationItem) =>
            new Date(b.sendDate).getTime() - new Date(a.sendDate).getTime(),
        ),
      );
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setPopupId(null);
    }
  };

  useEffect(() => {
    if (popupId) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupId]);

  return (
    <div className="flex flex-col px-3 mt-4">
      {isLoading ? (
        <Loading />
      ) : notifications.length === 0 ? (
        <div className="flex justify-center items-center py-10 text-gray-500 text-lg">
          Không có thông báo nào
        </div>
      ) : (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-primary-dark text-white">
                <th className="pl-2 rounded-tl-lg"></th>
                <th className="text-left text-[14px] sm:text-[16px] px-3 py-2 w-4/9 lg:w-2/3 xl:w-3/4">
                  Tiêu đề
                </th>
                <th className="rounded-tr-lg text-left text-[14px] sm:text-[16px] px-3 py-2">
                  Thông tin
                </th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification) => (
                <tr
                  key={notification.id}
                  className={`cursor-pointer border border-primary-light ${
                    popupId === notification.id
                      ? !notification.read
                        ? "bg-primary-lighter"
                        : ""
                      : !notification.read
                        ? "bg-primary-lighter hover:bg-primary-light"
                        : "hover:bg-primary-lighter"
                  }`}
                  onClick={() => {
                    if (!notification.read) {
                      notification.read = true;
                    }
                    router.push(`/member/notifications/${notification.id}`);
                  }}
                >
                  <td className="pl-2"></td>
                  <td className="px-3 py-3 text-left">
                    <span className="text-[13px] sm:text-[15px] text-primary-darkest">
                      {notification.receiverType === "SYSTEM" ? (
                        "Thông báo hệ thống"
                      ) : notification.receiverType === "CLASS" ? (
                        <span> Lớp {notification.className} </span>
                      ) : notification.receiverType === "USER" ? (
                        "Thông báo cá nhân"
                      ) : (
                        notification.receiverType
                      )}
                    </span>
                    <br />
                    <span className="text-[13px] sm:text-[15px]">
                      {notification.title}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src={notification.sender.avatar}
                          alt="notification"
                          width={35}
                          height={35}
                          className="rounded-full w-6 h-6 sm:w-8 sm:h-8"
                        />
                        <div className="flex flex-col">
                          <div className="text-[12px] sm:text-[14px]">
                            {notification.sender.name}
                          </div>
                          <div className="text-[12px] sm:text-[14px]">
                            {new Date(notification.sendDate).toLocaleString(
                              "vi-VN",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Notification;
