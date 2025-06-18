"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getListNotification } from "@/app/lib/services/notification";
import { NotificationItem } from "@/app/types";
import Image from "next/image";
import Loading from "@/app/ui/components/_common/loading/Loading";
import { Button } from "@/app/ui/components/_common/Button";
import { Select, SelectItem } from "@/app/ui/components/_common/Select";
import { Card } from "@/app/ui/components/_common/Card";
import Pagination from "@/app/ui/components/_common/Pagination";

const Notification = () => {
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

  const fetchData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter and search logic
  useEffect(() => {
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
  }, [notifications, searchTerm, filterType, filterStatus]);

  // Pagination logic
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = filteredNotifications.slice(
    startIndex,
    endIndex,
  );

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SYSTEM":
        return (
          <svg
            className="w-4 h-4 sm:w-6 sm:h-6 text-white animate-pulse"
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
            className="w-4 h-4 sm:w-6 sm:h-6 text-white animate-bounce"
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
            className="w-4 h-4 sm:w-6 sm:h-6 text-white animate-pulse"
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
        return `Lớp ${notifications.find((n) => n.receiverType === type)?.className || ""}`;
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
      {/* Header with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-dark via-primary-darker to-primary-darkest shadow-xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-white">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm animate-pulse">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8"
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
                </div>
                Thông báo
              </h1>
              <p className="text-primary-lighter text-base sm:text-lg">
                Quản lý và xem tất cả thông báo của bạn
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="basic"
                onClick={() => fetchData()}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300 text-sm sm:text-base"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 animate-spin"
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
                <span className="hidden sm:inline">Làm mới</span>
                <span className="sm:hidden">Làm mới</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="relative -mt-4 sm:-mt-6 mx-4 sm:mx-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-2xl shadow-xl border border-primary-light p-4 sm:p-6 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-primary-darkest mb-2">
                Tìm kiếm
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5 text-primary-dark animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tiêu đề, nội dung hoặc người gửi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-primary-light rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all duration-200 bg-primary-lighter focus:bg-white"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 sm:flex-none">
                <label className="block text-sm font-semibold text-primary-darkest mb-2">
                  Loại thông báo
                </label>
                <Select
                  defaultValue={filterType}
                  defaultLabel="Tất cả loại"
                  onValueChange={(value: string | number) =>
                    setFilterType(value as string)
                  }
                  className="w-full sm:w-48"
                >
                  <SelectItem value="ALL">Tất cả loại</SelectItem>
                  <SelectItem value="SYSTEM">Hệ thống</SelectItem>
                  <SelectItem value="CLASS">Lớp học</SelectItem>
                  <SelectItem value="USER">Cá nhân</SelectItem>
                </Select>
              </div>
              <div className="flex-1 sm:flex-none">
                <label className="block text-sm font-semibold text-primary-darkest mb-2">
                  Trạng thái
                </label>
                <Select
                  defaultValue={filterStatus}
                  defaultLabel="Tất cả trạng thái"
                  onValueChange={(value: string | number) =>
                    setFilterStatus(value as string)
                  }
                  className="w-full sm:w-48"
                >
                  <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                  <SelectItem value="UNREAD">Chưa đọc</SelectItem>
                  <SelectItem value="READ">Đã đọc</SelectItem>
                </Select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-primary-light">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-lighter rounded-lg">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-primary-dark animate-bounce"
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
              <div>
                <span className="text-xs sm:text-sm text-primary-dark">
                  Tổng cộng
                </span>
                <div className="text-lg sm:text-xl font-bold text-primary-darkest">
                  {filteredNotifications.length}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 animate-pulse"
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
              </div>
              <div>
                <span className="text-xs sm:text-sm text-primary-dark">
                  Chưa đọc
                </span>
                <div className="text-lg sm:text-xl font-bold text-red-600">
                  {filteredNotifications.filter((n) => !n.read).length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 pb-6 sm:pb-8">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400"
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
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Không có thông báo nào
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
              {searchTerm || filterType !== "ALL" || filterStatus !== "ALL"
                ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem kết quả khác"
                : "Bạn chưa có thông báo nào. Các thông báo mới sẽ xuất hiện ở đây."}
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {currentNotifications.map((notification, index) => {
              const isUnread = !notification.read;
              return (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group ${
                    isUnread
                      ? "border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white shadow-lg"
                      : "hover:border-primary bg-white shadow-md"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationName: "slideInUp",
                    animationDuration: "0.5s",
                    animationTimingFunction: "ease-out",
                    animationFillMode: "forwards",
                  }}
                  onClick={() => {
                    if (!notification.read) {
                      notification.read = true;
                    }
                    router.push(`/admin/notifications/${notification.id}`);
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 p-4 sm:p-6">
                    {/* Icon with gradient */}
                    <div
                      className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${getTypeGradient(notification.receiverType)} shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300 self-start`}
                    >
                      {getTypeIcon(notification.receiverType)}
                    </div>

                    {/* Content - Main section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          <span
                            className={`text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-semibold border ${getTypeBadgeColor(notification.receiverType)}`}
                          >
                            {getTypeLabel(notification.receiverType)}
                          </span>
                          {isUnread && (
                            <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mr-1.5 sm:mr-2 animate-pulse"></div>
                              Chưa đọc
                            </span>
                          )}
                        </div>
                      </div>

                      <h3
                        className={`font-bold text-primary-darkest mb-2 group-hover:text-primary-dark transition-colors duration-200 leading-tight ${
                          isUnread
                            ? "text-lg sm:text-xl"
                            : "text-base sm:text-lg"
                        }`}
                      >
                        {notification.title}
                      </h3>

                      {notification.content && (
                        <p className="text-primary-dark leading-relaxed text-sm line-clamp-2 font-medium mb-3 sm:mb-0">
                          {notification.content}
                        </p>
                      )}
                    </div>

                    {/* Right side - Sender and Time */}
                    <div className="flex flex-row sm:flex-col items-start sm:items-end gap-3 sm:gap-3 flex-shrink-0 min-w-0">
                      {/* Sender info */}
                      <div className="flex items-center gap-2 p-1.5 sm:p-2 bg-primary-lighter rounded-lg">
                        <Image
                          src={notification.sender.avatar}
                          alt={notification.sender.name}
                          width={24}
                          height={24}
                          className="rounded-full w-6 h-6 sm:w-7 sm:h-7 shadow-sm object-cover ring-2 ring-white"
                        />
                        <div className="text-right hidden sm:block">
                          <div className="text-xs font-semibold text-primary-darkest truncate max-w-20 sm:max-w-24">
                            {notification.sender.name}
                          </div>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-primary-dark">
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
                      <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-primary-dark">
                        <svg
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-bounce"
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
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
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
