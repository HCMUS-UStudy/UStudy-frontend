"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getListNotification,
  markAllNotificationsAsRead,
} from "@/app/lib/services/notification";
import { IoNotifications, IoCheckmarkDone } from "react-icons/io5";
import Tooltip from "./Tooltip";
import { useRef, useEffect, useState, useMemo } from "react";
import { NotificationItem } from "@/app/types";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const Notification = ({ role }: { role: string }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [readNotifications, setReadNotifications] = useState<
    Set<string | number>
  >(new Set());
  const [displayCount, setDisplayCount] = useState(3); // Số lượng notifications hiển thị ban đầu
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch notifications
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getListNotification(),
    refetchOnWindowFocus: false,
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      // Invalidate and refetch notifications to get updated read status
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      // Clear local read notifications state since all are now read
      setReadNotifications(new Set());

      // Show success toast
      toast.success(
        <div className="flex items-center gap-2">
          <IoCheckmarkDone className="text-green-500" size={16} />
          <span>Đã đánh dấu tất cả thông báo là đã đọc</span>
        </div>,
        {
          position: "bottom-right",
          style: {
            background: "#f0fdf4",
            color: "#166534",
            border: "1px solid #bbf7d0",
          },
        },
      );
    },
    onError: (error) => {
      console.error("Error marking all notifications as read:", error);

      // Show error toast
      toast.error(
        <div className="flex items-center gap-2">
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Có lỗi xảy ra khi đánh dấu thông báo</span>
        </div>,
        {
          position: "bottom-right",
          style: {
            background: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #fecaca",
          },
        },
      );
    },
  });

  const notifications = query.data || [];
  const isLoading = query.isLoading;

  // Tính số thông báo chưa đọc
  const unreadCount = useMemo(() => {
    return notifications.filter(
      (item: NotificationItem) => !item.read && !readNotifications.has(item.id),
    ).length;
  }, [notifications, readNotifications]);

  // Lấy notifications để hiển thị (có giới hạn số lượng)
  const displayedNotifications = useMemo(() => {
    return notifications.slice(0, displayCount);
  }, [notifications, displayCount]);

  // Kiểm tra xem còn notifications để load không
  const hasMoreNotifications = displayCount < notifications.length;

  // Load thêm notifications
  const loadMoreNotifications = () => {
    if (hasMoreNotifications && !isLoadingMore) {
      setIsLoadingMore(true);
      // Simulate loading delay
      setTimeout(() => {
        setDisplayCount((prev) => Math.min(prev + 5, notifications.length));
        setIsLoadingMore(false);
      }, 800);
    }
  };

  // Handle scroll để load more
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Load more khi scroll đến 80% cuối
    if (
      scrollTop + clientHeight >= scrollHeight * 0.8 &&
      hasMoreNotifications &&
      !isLoadingMore
    ) {
      loadMoreNotifications();
    }
  };

  // Đánh dấu một thông báo đã đọc
  const markAsRead = (id: string | number) => {
    setReadNotifications((prev) => new Set([...prev, id]));
  };

  // Kiểm tra thông báo đã đọc
  const isRead = (id: string | number) => {
    return readNotifications.has(id);
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      markAllAsReadMutation.mutate();
    }
  };

  // Reset display count khi mở dropdown
  useEffect(() => {
    if (showDropdown) {
      setDisplayCount(5);
    }
  }, [showDropdown]);

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
          className={`relative flex items-center border-2 p-[10px] rounded-full shadow-sm cursor-pointer transition-all duration-200
            ${
              showDropdown
                ? "bg-primary-light border-primary shadow-md"
                : "bg-white hover:shadow-md hover:bg-gray-50 border-gray-200"
            }`}
          onClick={() => setShowDropdown((v) => !v)}
        >
          <IoNotifications
            className={`size-5 md:size-6 transition-colors duration-200
            ${showDropdown ? "text-primary-darkest" : "text-primary-dark"}`}
          />
          {/* Badge hiển thị số thông báo chưa đọc */}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </div>
          )}
        </div>
      </Tooltip>

      {showDropdown && (
        <div
          className="absolute -right-2 mt-[3px] w-[320px] sm:w-[370px] max-h-[65vh] bg-white shadow-2xl border border-gray-200
          rounded-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200"
        >
          {/* Header */}
          <div className="p-4 flex justify-between items-center border-b border-gray-100 bg-gradient-to-r from-primary-light to-primary-lighter">
            <div className="flex items-center gap-2">
              <IoNotifications className="text-primary-darkest size-5 animate-bounce" />
              <div className="font-bold text-primary-darkest text-lg tracking-wide">
                Thông báo
              </div>
              {unreadCount > 0 && (
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md border border-white">
                  {unreadCount} mới
                </div>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs sm:text-sm rounded-lg hover:bg-primary-dark shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {markAllAsReadMutation.isPending ? (
                  <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                ) : (
                  <IoCheckmarkDone size={14} />
                )}
                <span className="hidden sm:inline">Đánh dấu đã đọc</span>
                <span className="sm:hidden">Đã đọc</span>
              </button>
            )}
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="max-h-[50vh] overflow-y-auto bg-gradient-to-b from-white to-gray-50"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#cbd5e1 #f1f5f9",
            }}
          >
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                <div className="text-gray-500">Đang tải thông báo...</div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <IoNotifications className="text-gray-300 size-12 mx-auto mb-3" />
                <div className="text-gray-500 font-medium">
                  Không có thông báo nào
                </div>
                <div className="text-gray-400 text-sm mt-1">
                  Bạn sẽ nhận được thông báo ở đây
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-3">
                {displayedNotifications.map(
                  (item: NotificationItem, idx: number) => {
                    // Tính số ngày trước
                    let daysAgoLabel = "";
                    if (item.sendDate) {
                      const createdDate = new Date(item.sendDate);
                      const now = new Date();
                      createdDate.setHours(0, 0, 0, 0);
                      now.setHours(0, 0, 0, 0);
                      const diffTime = now.getTime() - createdDate.getTime();
                      const diffDays = Math.floor(
                        diffTime / (1000 * 60 * 60 * 24),
                      );
                      if (diffDays === 0) daysAgoLabel = "Hôm nay";
                      else if (diffDays === 1) daysAgoLabel = "1 ngày trước";
                      else daysAgoLabel = `${diffDays} ngày trước`;
                    }

                    const isItemRead = item.read || isRead(item.id);

                    let typeIcon = null;
                    if (item.receiverType === "CLASS")
                      typeIcon = (
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
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 3H8a2 2 0 00-2 2v0a2 2 0 002 2h8a2 2 0 002-2v0a2 2 0 00-2-2z"
                          />
                        </svg>
                      );
                    else if (item.receiverType === "SYSTEM")
                      typeIcon = (
                        <svg
                          className="w-4 h-4"
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
                    else if (item.receiverType === "USER")
                      typeIcon = (
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
                            d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.797.657 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      );

                    return (
                      <div
                        key={item.id || idx}
                        onClick={() => {
                          // Đánh dấu đã đọc khi click vào notification
                          if (!isItemRead) {
                            markAsRead(item.id);
                          }
                          setShowDropdown(false);
                          router.push(`/${role}/notifications/${item.id}`);
                        }}
                        className={`relative flex items-start gap-3 p-3 rounded-xl border-l-4 transition-all shadow-sm cursor-pointer
                        ${!isItemRead ? "border-primary-dark bg-primary-lighter shadow-md" : "border-gray-200 bg-white hover:shadow-md"}
                        hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-primary-light group`}
                      >
                        {/* Dot chưa đọc ở góc phải trên */}
                        {!isItemRead && (
                          <span className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse z-10 bg-primary-dark"></span>
                        )}
                        {/* Icon loại thông báo trong vòng tròn màu nhỏ */}
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm
                          ${item.receiverType === "CLASS" ? "bg-green-100" : item.receiverType === "SYSTEM" ? "bg-purple-100" : "bg-blue-100"}`}
                          >
                            {typeIcon}
                          </div>
                        </div>
                        {/* Nội dung */}
                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[15px] text-primary-darkest truncate leading-tight">
                              {item.title}
                            </span>
                          </div>
                          {item.content && (
                            <div className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-snug">
                              {item.content}
                            </div>
                          )}
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <svg
                              className="w-3 h-3 text-gray-300"
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
                            <span className="text-[11px] italic text-gray-400">
                              {daysAgoLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}

                {/* Loading indicator ở cuối */}
                {isLoadingMore && (
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center gap-2 text-primary-dark">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                      <span className="text-sm">Đang tải thêm...</span>
                    </div>
                  </div>
                )}

                {/* Thông báo đã load hết */}
                {!hasMoreNotifications && displayedNotifications.length > 0 && (
                  <div className="text-center py-3 text-xs text-gray-400 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Đã hiển thị tất cả thông báo
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 bg-gradient-to-r from-white to-gray-50">
              <div className="text-center">
                <button
                  onClick={() => router.push(`/${role}/notifications`)}
                  className="inline-flex items-center gap-1 text-primary-dark hover:text-primary-darkest text-sm font-semibold transition-colors duration-200 group"
                >
                  <span>Xem tất cả thông báo</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
