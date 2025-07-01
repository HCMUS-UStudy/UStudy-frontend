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
import { useRouter, useParams, usePathname } from "next/navigation";
import { useCustomToast } from "@/app/lib/hooks/useToast";

export const Notification = ({ role }: { role: string }) => {
  const { addToast } = useCustomToast();
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
  const params = useParams();
  const pathname = usePathname();
  const currentNotificationId = params?.notificationId as string | undefined;

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
    },
    onError: () => {
      addToast.error("Có lỗi xảy ra");
    },
  });

  const notifications = useMemo(() => query.data || [], [query.data]);
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

  // Add pathname as a dependency to force re-render when URL changes
  useEffect(() => {}, [pathname]);

  return (
    <div className="relative" ref={ref}>
      <Tooltip text="Thông báo" position="bottom">
        <div
          className={`relative flex items-center border-2 p-[10px] rounded-full shadow-sm cursor-pointer transition-all duration-200
            ${
              showDropdown
                ? "bg-primary-lighter border-primary-light shadow-md"
                : "bg-white hover:shadow-md hover:bg-gray-50 border-gray-200"
            }`}
          onClick={() => setShowDropdown((v) => !v)}
        >
          <IoNotifications
            className={`size-5 md:size-6 transition-colors duration-200
            ${showDropdown ? "text-primary-darker" : "text-primary-dark"}`}
          />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium">
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
          <div className="p-3 flex justify-between items-center border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="font-bold ml-1 text-primary-darkest text-lg">
                Thông báo
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                className="flex items-center gap-1.5 text-[10px] sm:text-[12px] transition-all duration-200 disabled:opacity-50
                  hover:text-primary-darkest disabled:cursor-not-allowed"
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
              <div className="flex flex-col">
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

                    return (
                      <div
                        key={item.id || idx}
                        onClick={() => {
                          // Đánh dấu đã đọc khi click vào notification
                          if (!isItemRead) {
                            markAsRead(item.id);
                          }
                          setShowDropdown(false);
                          // Convert student and parent roles to member
                          const navigationRole =
                            role === "student" || role === "parent"
                              ? "member"
                              : role;
                          router.push(
                            `/${navigationRole}/notifications/${item.id}`,
                          );
                        }}
                        className={`relative flex items-start gap-3 px-4 py-[10px] transition-all shadow-sm cursor-pointer border-b
                        border-gray-200 bg-white hover:shadow-md hover:bg-primary-lighter group`}
                      >
                        {/* Dot chưa đọc ở góc phải trên */}
                        {!isItemRead && item.id !== currentNotificationId && (
                          <span className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse z-10 bg-primary-dark"></span>
                        )}
                        <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
                          <div className="flex items-center gap-2">
                            <span className="text-[15px] text-primary-darkest truncate">
                              {item.receiverType === "CLASS"
                                ? "Lớp " + item.className || "Lớp học"
                                : item.receiverType === "SYSTEM"
                                  ? "Hệ thống"
                                  : "Cá nhân"}
                            </span>
                          </div>
                          {item.title && (
                            <div className="text-[13px] text-gray-800">
                              {item.title}
                            </div>
                          )}
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-[11px] italic text-gray-500">
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
                  <div className="text-center py-2 text-xs text-gray-400 border-t border-gray-100">
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
            <div className="p-2 border-t border-gray-100 bg-gradient-to-r from-white to-gray-50">
              <div className="text-center">
                <button
                  onClick={() => {
                    // Convert student and parent roles to member
                    const navigationRole =
                      role === "student" || role === "parent" ? "member" : role;
                    setShowDropdown(false);
                    router.push(`/${navigationRole}/notifications`);
                  }}
                  className="inline-flex items-center gap-1 text-[13px] transition-colors duration-200 group
                   text-gray-700 hover:text-primary-darkest"
                >
                  <span>Xem tất cả thông báo</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
