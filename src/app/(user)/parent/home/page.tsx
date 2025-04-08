"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/ui/components/_common/Card";
import { BsBook, BsCreditCard, BsCalendar, BsPersonWorkspace } from "react-icons/bs";
import { SiGoogleclassroom } from "react-icons/si";
import { Tabs, TabList, Tab, TabPanel } from "@/app/ui/components/_common/Tabs";
import { Button } from "@/app/ui/components/_common/Button";
import { FaRegCommentDots } from "react-icons/fa6";
import { MdOutlineNotificationsActive } from "react-icons/md";
import Link from "next/link";

export default function ParentHomePage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  const notifications = [
    { id: 1, title: "Thông báo học phí tháng 5", date: "20/04/2025", content: "Kính gửi quý phụ huynh, trung tâm thông báo học phí tháng 5 sẽ được thu từ ngày 25/04 đến 05/05." },
    { id: 2, title: "Lịch nghỉ lễ 30/4 - 1/5", date: "15/04/2025", content: "Trung tâm thông báo lịch nghỉ lễ 30/4 - 1/5 như sau: Các lớp sẽ nghỉ từ ngày 30/4 đến hết ngày 03/5." },
    { id: 3, title: "Thông báo kiểm tra định kỳ", date: "10/04/2025", content: "Các em học sinh sẽ có bài kiểm tra định kỳ vào ngày 15/05, đề nghị phụ huynh nhắc nhở các em ôn tập." },
  ];

  const childrenProgress = [
    { id: 1, name: "Nguyễn Văn A", grade: "Lớp 10", subject: "Toán", attendance: "90%", performance: "Khá" },
    { id: 2, name: "Nguyễn Văn A", grade: "Lớp 10", subject: "Lý", attendance: "85%", performance: "Giỏi" },
    { id: 3, name: "Nguyễn Văn A", grade: "Lớp 10", subject: "Hóa", attendance: "95%", performance: "Khá" },
  ];

  const upcomingEvents = [
    { id: 1, title: "Kiểm tra 45 phút môn Toán", date: "25/04/2025", time: "17:30 - 19:00" },
    { id: 2, title: "Họp phụ huynh học kỳ 2", date: "28/04/2025", time: "19:30 - 21:00" },
    { id: 3, title: "Bài kiểm tra cuối kỳ môn Lý", date: "10/05/2025", time: "17:30 - 19:00" },
  ];

  const quickLinks = [
    { title: "Lớp học", icon: <SiGoogleclassroom size={24} />, path: "/parent/classes" },
    { title: "Lịch học", icon: <BsCalendar size={24} />, path: "/parent/schedule" },
    { title: "Học phí", icon: <BsCreditCard size={24} />, path: "/parent/tuition" },
    { title: "Kết quả học tập", icon: <BsPersonWorkspace size={24} />, path: "/parent/results" },
    { title: "Liên hệ giáo viên", icon: <FaRegCommentDots size={24} />, path: "/parent/contact" },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Trang chủ phụ huynh</h1>
      
      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {quickLinks.map((link, index) => (
          <Link href={link.path} key={index}>
            <Card className="hover:bg-gray-50 transition-all cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className="mb-2 text-primary">{link.icon}</div>
                <p className="text-center">{link.title}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Tabs value={activeTab} onTabChange={setActiveTab} className="mb-6">
        <TabList className="mb-4">
          <Tab label="Tổng quan" value="overview" />
          <Tab label="Thông báo" value="notifications" />
          <Tab label="Sự kiện sắp tới" value="events" />
        </TabList>
        
        <TabPanel value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BsPersonWorkspace className="mr-2" />
                  Tiến độ học tập của con
                </CardTitle>
                <CardDescription>Tổng quan về tình hình học tập của học sinh</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {childrenProgress.map((child) => (
                    <div key={child.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{child.subject}</span>
                        <span className={`font-medium ${
                          child.performance === "Giỏi" ? "text-green-600" : 
                          child.performance === "Khá" ? "text-blue-600" : "text-yellow-600"
                        }`}>{child.performance}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Điểm danh: {child.attendance}</span>
                      </div>
                    </div>
                  ))}
                  <Button variant="outlined" className="w-full mt-2">
                    Xem chi tiết
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MdOutlineNotificationsActive className="mr-2" />
                  Thông báo mới nhất
                </CardTitle>
                <CardDescription>Các thông báo quan trọng từ trung tâm</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.slice(0, 2).map((notification) => (
                    <div key={notification.id} className="p-3 border rounded-lg">
                      <div className="font-medium mb-1">{notification.title}</div>
                      <div className="text-sm text-gray-500 mb-1">Ngày: {notification.date}</div>
                      <div className="text-sm line-clamp-2">{notification.content}</div>
                    </div>
                  ))}
                  <Button variant="outlined" className="w-full mt-2">
                    Xem tất cả thông báo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabPanel>
        
        <TabPanel value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Tất cả thông báo</CardTitle>
              <CardDescription>Danh sách các thông báo từ trung tâm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 border rounded-lg">
                    <div className="font-medium text-lg mb-1">{notification.title}</div>
                    <div className="text-sm text-gray-500 mb-2">Ngày: {notification.date}</div>
                    <div className="text-sm">{notification.content}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabPanel>
        
        <TabPanel value="events">
          <Card>
            <CardHeader>
              <CardTitle>Sự kiện sắp tới</CardTitle>
              <CardDescription>Lịch sự kiện sắp diễn ra</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-4 border rounded-lg">
                    <div className="font-medium text-lg mb-1">{event.title}</div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Ngày: {event.date}</span>
                      <span>Thời gian: {event.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabPanel>
      </Tabs>
    </div>
  );
} 