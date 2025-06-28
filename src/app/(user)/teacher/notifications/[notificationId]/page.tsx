"use client";

import { useState, useEffect } from "react";
import { NotificationItem } from "@/app/types";
import {
  getNotificationDetails,
  getListNotification,
} from "@/app/lib/services/notification";
import Loading from "@/app/ui/components/_common/loading/Loading";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import NotificationDetailHeader from "@/app/ui/components/admin/notifications/NotificationDetailHeader";
import NotificationSidebar from "@/app/ui/components/admin/notifications/NotificationSidebar";
import NotificationDetailContent from "@/app/ui/components/admin/notifications/NotificationDetailContent";
import NotificationNotFound from "@/app/ui/components/admin/notifications/NotificationNotFound";

const SingleNotification = () => {
  const [mounted, setMounted] = useState(false);
  const [notification, setNotification] = useState<NotificationItem | null>(
    null,
  );
  const [allNotifications, setAllNotifications] = useState<NotificationItem[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [navigating, setNavigating] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const params = useParams();
  const notificationId = params?.notificationId ?? "";
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!mounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        window.innerWidth < 1024 &&
        sidebarOpen &&
        !target.closest(".sidebar") &&
        !target.closest(".sidebar-toggle")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [sidebarOpen, mounted]);

  // Close sidebar on window resize
  useEffect(() => {
    if (!mounted) return;

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Only fetch current notification details
        const currentData = await getNotificationDetails(
          notificationId as string,
        );
        setNotification(currentData);

        // Try to get notifications from cache first, only fetch if not available
        const cachedNotifications = queryClient.getQueryData(["notifications"]);
        if (cachedNotifications) {
          setAllNotifications(
            (cachedNotifications as NotificationItem[]).sort(
              (a: NotificationItem, b: NotificationItem) =>
                new Date(b.sendDate).getTime() - new Date(a.sendDate).getTime(),
            ),
          );
        } else {
          // Only fetch all notifications if not in cache
          const allData = await getListNotification();
          setAllNotifications(
            allData.sort(
              (a: NotificationItem, b: NotificationItem) =>
                new Date(b.sendDate).getTime() - new Date(a.sendDate).getTime(),
            ),
          );
        }

        // Mark current notification as read if it's not already read
        if (currentData && !currentData.read) {
          // Update the notification in cache to mark as read
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          queryClient.setQueryData(["notifications"], (oldData: any) => {
            if (!oldData) return oldData;
            return oldData.map((item: NotificationItem) =>
              item.id === notificationId ? { ...item, read: true } : item,
            );
          });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [notificationId, queryClient, mounted]);

  const handleNotificationClick = (notificationId: string) => {
    if (!mounted) return;

    setNavigating(true);
    setSidebarOpen(false); // Close sidebar on mobile when selecting notification
    router.push(`/teacher/notifications/${notificationId}`);
  };

  const handleBackToList = () => {
    if (mounted) {
      router.push("/teacher/notifications");
    }
  };

  const handleToggleSidebar = () => {
    if (mounted) {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleCloseSidebar = () => {
    if (mounted) {
      setSidebarOpen(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-lighter via-primary-light to-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <Loading />
          </div>
          <p className="mt-4 text-primary-darkest font-medium animate-pulse">
            Đang tải thông báo...
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-lighter via-primary-light to-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <Loading />
          </div>
          <p className="mt-4 text-primary-darkest font-medium animate-pulse">
            Đang tải thông báo...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-lighter via-primary-light to-primary">
      {/* Navigation Loading Overlay */}
      {navigating && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-2xl flex items-center gap-4">
            <div className="animate-spin">
              <svg
                className="w-6 h-6 text-primary-dark"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <span className="text-primary-darkest font-medium animate-pulse">
              Đang chuyển trang...
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <NotificationDetailHeader
        onBack={handleBackToList}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />

      <div className="flex h-screen-minus-header">
        {/* Left Side - Notification List */}
        <NotificationSidebar
          sidebarOpen={sidebarOpen}
          allNotifications={allNotifications}
          currentNotificationId={notificationId as string}
          navigating={navigating}
          onNotificationClick={handleNotificationClick}
          onCloseSidebar={handleCloseSidebar}
        />

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={handleCloseSidebar}
          />
        )}

        {/* Right Side - Notification Detail */}
        <div className="flex-1 bg-gradient-to-br from-white via-primary-lighter/20 to-primary-light/10 overflow-y-auto">
          {notification ? (
            <NotificationDetailContent notification={notification} />
          ) : (
            <NotificationNotFound onBackToList={handleBackToList} />
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .h-screen-minus-header {
          height: calc(100vh - 80px);
        }
      `}</style>
    </div>
  );
};

export default SingleNotification;
