"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getListNotification } from "@/app/lib/services/notification";
import { NotificationItem } from "@/app/types";
import Loading from "@/app/ui/components/_common/loading/Loading";
import Pagination from "@/app/ui/components/_common/Pagination";
import NotificationHeader from "@/app/ui/components/admin/notifications/NotificationHeader";
import NotificationSearchFilter from "@/app/ui/components/admin/notifications/NotificationSearchFilter";
import NotificationCard from "@/app/ui/components/admin/notifications/NotificationCard";
import NotificationEmptyState from "@/app/ui/components/admin/notifications/NotificationEmptyState";

const Notification = () => {
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    NotificationItem[]
  >([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async () => {
    if (!mounted) return;

    setIsLoading(true);
    try {
      const data = await getListNotification();
      const sortedData = data.sort(
        (a: NotificationItem, b: NotificationItem) =>
          new Date(b.sendDate).getTime() - new Date(a.sendDate).getTime(),
      );
      setNotifications(sortedData);
      setFilteredNotifications(sortedData);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [mounted]);

  useEffect(() => {
    if (mounted) {
      fetchData();
    }
  }, [fetchData, mounted]);

  // Filter and search logic
  useEffect(() => {
    if (!mounted) return;

    let filtered = notifications;

    // Filter by type
    if (filterType !== "ALL") {
      filtered = filtered.filter(
        (notification) => notification.receiverType === filterType,
      );
    }

    // Filter by status
    if (filterStatus !== "ALL") {
      filtered = filtered.filter((notification) =>
        filterStatus === "UNREAD" ? !notification.read : notification.read,
      );
    }

    // Search by title or content
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(term) ||
          (notification.content &&
            notification.content.toLowerCase().includes(term)) ||
          notification.sender.name.toLowerCase().includes(term),
      );
    }

    setFilteredNotifications(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [notifications, searchTerm, filterType, filterStatus, mounted]);

  // Pagination logic
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = filteredNotifications.slice(
    startIndex,
    endIndex,
  );

  const handlePageClick = (page: number) => {
    if (mounted) {
      setCurrentPage(page);
    }
  };

  const handlePreviousPage = () => {
    if (mounted && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (mounted && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!mounted) return;

    if (!notification.read) {
      notification.read = true;
    }
    router.push(`/admin/notifications/${notification.id}`);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-lighter via-primary-light to-primary flex items-center justify-center">
        <div className="text-center">
          <Loading />
          <p className="mt-4 text-primary-darkest font-medium">
            Đang tải thông báo...
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-lighter via-primary-light to-primary flex items-center justify-center">
        <div className="text-center">
          <Loading />
          <p className="mt-4 text-primary-darkest font-medium">
            Đang tải thông báo...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-lighter via-primary-light to-primary">
      {/* Header */}
      <NotificationHeader onRefresh={fetchData} />

      {/* Search and Filter */}
      <NotificationSearchFilter
        searchTerm={searchTerm}
        filterType={filterType}
        filterStatus={filterStatus}
        totalCount={filteredNotifications.length}
        unreadCount={filteredNotifications.filter((n) => !n.read).length}
        onSearchChange={setSearchTerm}
        onFilterTypeChange={setFilterType}
        onFilterStatusChange={setFilterStatus}
      />

      {/* Content */}
      <div className="px-4 sm:px-6 pb-6 sm:pb-8">
        {filteredNotifications.length === 0 ? (
          <NotificationEmptyState
            searchTerm={searchTerm}
            filterType={filterType}
            filterStatus={filterStatus}
          />
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {currentNotifications.map((notification, index) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                index={index}
                onClick={handleNotificationClick}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredNotifications.length > itemsPerPage && (
          <div className="mt-4 sm:mt-6 flex justify-center sm:justify-end">
            <div className="rounded-xl p-2 sm:p-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageClick={handlePageClick}
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
              />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Notification;
