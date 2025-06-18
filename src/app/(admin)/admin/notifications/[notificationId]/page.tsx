"use client";

import { useState, useEffect } from "react";
import { NotificationItem } from "@/app/types";
import { getNotificationDetails, getListNotification } from "@/app/lib/services/notification";
import Loading from "@/app/ui/components/_common/loading/Loading";
import { useParams, useRouter } from "next/navigation";
import { IoReturnUpBack, IoMenu, IoClose } from "react-icons/io5";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/app/ui/components/_common/Card";
import Image from "next/image";

const SingleNotification = () => {
  const [notification, setNotification] = useState<NotificationItem | null>(null);
  const [allNotifications, setAllNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [navigating, setNavigating] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const params = useParams();
  const notificationId = params?.notificationId ?? "";
  const router = useRouter();

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (window.innerWidth < 1024 && sidebarOpen && !target.closest('.sidebar') && !target.closest('.sidebar-toggle')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [sidebarOpen]);

  // Close sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch both current notification and all notifications
        const [currentData, allData] = await Promise.all([
          getNotificationDetails(notificationId as string),
          getListNotification()
        ]);
        
        setNotification(currentData);
        setAllNotifications(allData.sort((a: NotificationItem, b: NotificationItem) => 
          new Date(b.sendDate).getTime() - new Date(a.sendDate).getTime()
        ));
        
      // Invalidate the query to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
      setLoading(false);
      }
    };
    fetchData();
  }, [notificationId, queryClient]);

  const handleNotificationClick = (notificationId: string) => {
    setNavigating(true);
    setSidebarOpen(false); // Close sidebar on mobile when selecting notification
    router.push(`/admin/notifications/${notificationId}`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SYSTEM":
        return (
          <svg className="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
          </svg>
        );
      case "CLASS":
        return (
          <svg className="w-5 h-5 text-white animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 3H8a2 2 0 00-2 2v0a2 2 0 002 2h8a2 2 0 002-2v0a2 2 0 00-2-2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.797.657 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
    }
  };

  const getTypeGradient = (type: string) => {
    switch (type) {
      case "SYSTEM": return "from-primary-dark to-primary-darker";
      case "CLASS": return "from-primary to-primary-dark";
      default: return "from-primary-light to-primary";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "SYSTEM": return "Hệ thống";
      case "CLASS": return `Lớp ${allNotifications.find(n => n.receiverType === type)?.className || ''}`;
      case "USER": return "Cá nhân";
      default: return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "SYSTEM": return "bg-primary-lighter text-primary-darkest border-primary-light";
      case "CLASS": return "bg-primary-lighter text-primary-darkest border-primary-light";
      default: return "bg-primary-lighter text-primary-darkest border-primary-light";
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
        year: "numeric"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-lighter via-primary-light to-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <Loading />
          </div>
          <p className="mt-4 text-primary-darkest font-medium animate-pulse">Đang tải thông báo...</p>
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
              <svg className="w-6 h-6 text-primary-dark" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span className="text-primary-darkest font-medium animate-pulse">Đang chuyển trang...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-primary-light px-4 lg:px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push(`/admin/notifications`)}
            className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-primary-lighter to-primary-light text-primary-darkest rounded-lg hover:from-primary-light hover:to-primary transition-all duration-300 shadow-sm hover:shadow-md group"
          >
            <IoReturnUpBack className="text-xl group-hover:scale-110 transition-transform duration-300" />
            <span className="font-semibold text-sm hidden sm:inline">Trở về danh sách</span>
          </button>
          
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden sidebar-toggle flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-lighter to-primary-light text-primary-darkest rounded-lg hover:from-primary-light hover:to-primary transition-all duration-300 shadow-sm hover:shadow-md"
          >
            {sidebarOpen ? (
              <IoClose className="text-xl" />
            ) : (
              <IoMenu className="text-xl" />
            )}
          </button>
        </div>
      </div>

      <div className="flex h-screen-minus-header">
        {/* Left Side - Notification List */}
        <div className={`sidebar fixed lg:relative inset-y-0 left-0 z-40 w-80 lg:w-1/3 border-r border-primary-light bg-white overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h2 className="text-lg font-bold text-primary-darkest flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-dark animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Danh sách thông báo
              </h2>
      <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-primary-dark hover:text-primary-darkest transition-colors"
              >
                <IoClose className="text-xl" />
              </button>
            </div>
            <h2 className="text-lg font-bold text-primary-darkest mb-4 flex items-center gap-2 hidden lg:flex">
              <svg className="w-5 h-5 text-primary-dark animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Danh sách thông báo
            </h2>
            <div className="space-y-3">
              {allNotifications.map((item, index) => {
                const isUnread = !item.read;
                const isActive = item.id === notificationId;
                return (
                  <Card
                    key={item.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg group ${
                      isActive 
                        ? 'border-2 border-primary-dark bg-primary-lighter shadow-lg scale-[1.02]' 
                        : isUnread 
                        ? 'border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white' 
                        : 'hover:border-primary-light bg-white'
                    } ${navigating ? 'pointer-events-none opacity-75' : ''}`}
                    style={{
                      animationDelay: `${index * 30}ms`,
                      animationName: 'slideInLeft',
                      animationDuration: '0.4s',
                      animationTimingFunction: 'ease-out',
                      animationFillMode: 'forwards'
                    }}
        onClick={() => {
                      if (!navigating) {
                        handleNotificationClick(item.id);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3 p-3">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${getTypeGradient(item.receiverType)} shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ${navigating ? 'animate-pulse' : ''}`}>
                        {getTypeIcon(item.receiverType)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${getTypeBadgeColor(item.receiverType)}`}>
                            {getTypeLabel(item.receiverType)}
                          </span>
                          {isUnread && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse"></div>
                              Chưa đọc
                            </span>
                          )}
                        </div>
                        <h3 className={`font-semibold text-primary-darkest mb-1 truncate ${
                          isActive ? 'text-lg' : 'text-sm'
                        } ${navigating ? 'animate-pulse' : ''}`}>
                          {item.title}
                        </h3>
                        {item.content && (
                          <p className="text-xs text-primary-dark line-clamp-2 leading-relaxed">
                            {item.content}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Image
                              src={item.sender.avatar}
                              alt={item.sender.name}
                              width={20}
                              height={20}
                              className="rounded-full w-5 h-5 shadow-sm object-cover"
                            />
                            <span className="text-xs font-medium text-primary-darkest">
                              {item.sender.name}
                            </span>
                          </div>
                          <span className="text-xs text-primary-dark">
                            {formatDate(item.sendDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Right Side - Notification Detail */}
        <div className="flex-1 bg-gradient-to-br from-white via-primary-lighter/20 to-primary-light/10 overflow-y-auto">
          {notification ? (
            <div className="p-4 lg:p-6 animate-fadeIn">
              {/* Header with gradient background */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/5 via-primary/8 to-primary-light/12 rounded-xl"></div>
                <div className="relative p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${getTypeGradient(notification.receiverType)} shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                      {getTypeIcon(notification.receiverType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${getTypeBadgeColor(notification.receiverType)} shadow-sm`}>
                          {getTypeLabel(notification.receiverType)}
                        </span>
                        {!notification.read && (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-300 shadow-sm">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5 animate-pulse"></div>
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
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
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
                        <svg className="w-4 h-4 text-primary-dark animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3"/>
                          <circle cx="12" cy="12" r="10"/>
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
                  <h2 className="text-lg font-bold text-primary-darkest">Nội dung thông báo</h2>
                </div>
                
                <div className="bg-white rounded-xl shadow-md border border-primary-light/40 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-lighter to-primary-light/40 px-4 py-3 border-b border-primary-light/30">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary-dark animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-semibold text-primary-darkest text-sm">Chi tiết</span>
                    </div>
                  </div>
                  
                  <div className="p-4 lg:p-5">
                    {notification.content ? (
                      <div className="prose prose-sm max-w-none">
                        <div className="text-primary-darkest leading-relaxed space-y-3">
                          {notification.content.split("\\n").map((line, index) => (
                            <p key={index} className="mb-3 last:mb-0 p-3 bg-primary-lighter/40 rounded-lg border-l-3 border-primary-light text-sm">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-primary-lighter to-primary-light rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-primary-dark animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-primary-dark text-sm italic">Không có nội dung</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-primary-light/40 shadow-sm gap-3">
                  <div className="flex items-center gap-2 text-primary-dark">
                    <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3"/>
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <span className="text-xs">Gửi {formatDate(notification.sendDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-lighter text-primary-darkest rounded-md hover:bg-primary-light transition-colors duration-200 text-sm">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Lưu
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200 text-sm">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      Chia sẻ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-lighter to-primary-light rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-12 h-12 text-primary-dark animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
          </div>
                <h3 className="text-xl font-bold text-primary-darkest mb-3">Không tìm thấy thông báo</h3>
                <p className="text-primary-dark text-base max-w-sm mx-auto mb-4">
                  Thông báo này có thể đã bị xóa hoặc không tồn tại trong hệ thống.
                </p>
                <button 
                  onClick={() => router.push('/admin/notifications')}
                  className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center gap-2 mx-auto text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Quay lại danh sách
                </button>
              </div>
            </div>
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
