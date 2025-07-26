"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationItem } from "@/app/types";
import {
  getNotificationDetails,
  getListNotification,
} from "@/app/lib/services/notification";
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
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [navigating, setNavigating] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const params = useParams();
  const notificationId = Array.isArray(params?.notificationId)
    ? params.notificationId[0]
    : (params?.notificationId ?? "");
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
      try {
        // Load all notifications if not already loaded
        const cachedNotifications = queryClient.getQueryData(["notifications"]);
        if (cachedNotifications) {
          setAllNotifications(
            (cachedNotifications as NotificationItem[]).sort(
              (a: NotificationItem, b: NotificationItem) =>
                new Date(b.sendDate).getTime() - new Date(a.sendDate).getTime(),
            ),
          );
        } else {
          const allData = await getListNotification();
          const sortedData = allData.sort(
            (a: NotificationItem, b: NotificationItem) =>
              new Date(b.sendDate).getTime() - new Date(a.sendDate).getTime(),
          );
          setAllNotifications(sortedData);
          // Cache the notifications
          queryClient.setQueryData(["notifications"], sortedData);
        }

        // Load current notification
        if (notificationId) {
          const currentData = await getNotificationDetails(notificationId);
          setNotification(currentData);
          // Mark as read in the cache
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
      }
    };
    fetchData();
  }, [notificationId, queryClient, mounted]);

  const handleNotificationClick = async (clickedNotificationId: string) => {
    if (!mounted || isAnimating || clickedNotificationId === notificationId)
      return;

    setIsAnimating(true);
    setSidebarOpen(false); // Close sidebar on mobile when selecting notification
    try {
      // Update the URL and let Next.js handle the route change
      await router.push(`/teacher/notifications/${clickedNotificationId}`);

      // Update the notification state with the new data
      const currentData = await getNotificationDetails(clickedNotificationId);

      // Update the local state and cache
      setAllNotifications((prev) => {
        const updated = prev.map((item) =>
          item.id === clickedNotificationId ? { ...item, read: true } : item,
        );
        queryClient.setQueryData(["notifications"], updated);
        return updated;
      });

      // Update the current notification
      setNotification(currentData);
    } catch (error) {
      console.error("Failed to fetch notification details:", error);
    } finally {
      // Reset animation state
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
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

  // if (!mounted) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-primary-lighter via-primary-light to-primary flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-pulse">
  //           <Loading />
  //         </div>
  //         <p className="mt-4 text-primary-darkest font-medium animate-pulse">
  //           Đang tải thông báo...
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-primary-lighter via-primary-light to-primary flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-pulse">
  //           <Loading />
  //         </div>
  //         <p className="mt-4 text-primary-darkest font-medium animate-pulse">
  //           Đang tải thông báo...
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-lighter via-primary-light to-primary">
      {/* Navigation Loading Overlay */}
      {/* {navigating && (
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
      )} */}

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
        <div className="flex-1 bg-gradient-to-br from-white via-primary-lighter/20 to-primary-light/10 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            {notification ? (
              <motion.div
                key={notificationId}
                initial={{ opacity: 0, x: 50, filter: "blur(5px)" }}
                animate={{
                  opacity: 1,
                  x: 0,
                  filter: "blur(0)",
                  transition: {
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                    x: { duration: 0.3 },
                    opacity: { duration: 0.25 },
                    filter: { duration: 0.4 },
                  },
                }}
                exit={{
                  opacity: 0,
                  x: -50,
                  filter: "blur(5px)",
                  transition: {
                    duration: 0.2,
                    ease: [0.4, 0, 0.6, 1],
                    x: { duration: 0.2 },
                    opacity: { duration: 0.2 },
                    filter: { duration: 0.2 },
                  },
                }}
                className="h-full w-full absolute inset-0"
              >
                <div className="p-6 h-full overflow-y-auto">
                  <NotificationDetailContent notification={notification} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="not-found"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.2 } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="h-full w-full absolute inset-0"
              >
                <div className="p-6 h-full overflow-y-auto">
                  <NotificationNotFound onBackToList={handleBackToList} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
