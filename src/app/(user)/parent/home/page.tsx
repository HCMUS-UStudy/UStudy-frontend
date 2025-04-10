"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/ui/components/_common/Card";
import { BsPersonWorkspace, BsJournalBookmarkFill } from "react-icons/bs";
import { Button } from "@/app/ui/components/_common/Button";
import { MdOutlineNotificationsActive } from "react-icons/md";

export default function ParentHomePage() {
  // Mock data
  const notifications = [
    {
      id: 1,
      title: "Thông báo học phí tháng 5",
      date: "20/04/2025",
      content:
        "Kính gửi quý phụ huynh, trung tâm thông báo học phí tháng 5 sẽ được thu từ ngày 25/04 đến 05/05.",
    },
    {
      id: 2,
      title: "Lịch nghỉ lễ 30/4 - 1/5",
      date: "15/04/2025",
      content:
        "Trung tâm thông báo lịch nghỉ lễ 30/4 - 1/5 như sau: Các lớp sẽ nghỉ từ ngày 30/4 đến hết ngày 03/5.",
    },
    {
      id: 3,
      title: "Thông báo kiểm tra định kỳ",
      date: "10/04/2025",
      content:
        "Các em học sinh sẽ có bài kiểm tra định kỳ vào ngày 15/05, đề nghị phụ huynh nhắc nhở các em ôn tập.",
    },
  ];

  const childrenProgress = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      grade: "Lớp 10",
      subject: "Toán",
      attendance: "90",
      performance: "Khá",
    },
    {
      id: 2,
      name: "Nguyễn Văn A",
      grade: "Lớp 10",
      subject: "Lý",
      attendance: "55",
      performance: "Giỏi",
    },
    {
      id: 3,
      name: "Nguyễn Văn A",
      grade: "Lớp 10",
      subject: "Hóa",
      attendance: "95",
      performance: "Khá",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Kiểm tra 45 phút môn Toán",
      date: "25/04/2025",
      time: "17:30 - 19:00",
    },
    {
      id: 2,
      title: "Họp phụ huynh học kỳ 2",
      date: "28/04/2025",
      time: "19:30 - 21:00",
    },
    {
      id: 3,
      title: "Bài kiểm tra cuối kỳ môn Lý",
      date: "10/05/2025",
      time: "17:30 - 19:00",
    },
  ];

  const registeredClasses = [
    {
      id: 1,
      name: "Toán nâng cao lớp 6",
      schedule: "Thứ 2 & Thứ 5, 17:00 - 18:30",
    },
    { id: 2, name: "Ngữ văn sáng tạo lớp 6", schedule: "Thứ 4, 19:00 - 20:30" },
    {
      id: 3,
      name: "Tiếng Anh giao tiếp lớp 6",
      schedule: "Thứ 7, 9:00 - 10:30",
    },
  ];

  // const quickLinks = [
  //   {
  //     title: "Lớp học",
  //     icon: <SiGoogleclassroom size={24} />,
  //     path: "/parent/classes",
  //   },
  //   {
  //     title: "Lịch học",
  //     icon: <BsCalendar size={24} />,
  //     path: "/parent/schedule",
  //   },
  //   {
  //     title: "Học phí",
  //     icon: <BsCreditCard size={24} />,
  //     path: "/parent/tuition",
  //   },
  //   {
  //     title: "Kết quả học tập",
  //     icon: <BsPersonWorkspace size={24} />,
  //     path: "/parent/results",
  //   },
  //   {
  //     title: "Liên hệ giáo viên",
  //     icon: <FaRegCommentDots size={24} />,
  //     path: "/parent/contact",
  //   },
  // ];

  return (
    <div className="px-2">
      {/* Quick Access Links */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10">
        {quickLinks.map((link, index) => (
          <Link href={link.path} key={index}>
            <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <div className="text-2xl text-blue-600 mb-2">{link.icon}</div>
                <p className="text-sm font-medium text-center">{link.title}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div> */}

      {/* Main Content */}
      <div className="h-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full items-stretch">
          <div className="lg:col-span-2 flex flex-col gap-6 h-full">
            <Card className="lg:col-span-2 bg-white border border-primary-light shadow-md h-full">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="flex items-center text-xl text-primary-darkest">
                    <BsPersonWorkspace className="mr-2 text-primary-dark" />
                    Tiến độ học tập của con
                  </CardTitle>
                  <CardDescription className="text-primary-dark text-sm">
                    Tổng quan tình hình học tập của học sinh
                  </CardDescription>
                </div>
                <Button
                  variant="outlined"
                  className="border-primary-dark text-primary-dark hover:bg-hover-primary text-sm"
                >
                  Xem chi tiết
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {childrenProgress.map((child) => (
                    <div
                      key={child.id}
                      className="border-primary-light bg-primary-lighter hover:bg-hover-primary p-4 rounded-xl shadow-sm transition"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-primary-darkest">
                          {child.subject}
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            child.performance === "Giỏi"
                              ? "text-green-600"
                              : child.performance === "Khá"
                                ? "text-blue-600"
                                : "text-yellow-600"
                          }`}
                        >
                          {child.performance}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2 justify-between">
                        <span>Điểm danh</span>
                        <div className="relative group w-full max-w-[180px] h-2 rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className="h-2 bg-primary-dark rounded-full transition-all duration-300"
                            style={{ width: `${child.attendance}%` }}
                          />
                          <span className="absolute left-1/2 -translate-x-1/2 -top-6 text-xs text-primary-darkest bg-white border border-primary-light rounded px-2 py-0.5 opacity-0 group-hover:opacity-100 transition">
                            {child.attendance}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-white border border-primary-light shadow-md h-full">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="flex items-center text-xl text-primary-darkest">
                    <BsJournalBookmarkFill className="mr-2 text-primary-dark" />
                    Các lớp đã đăng ký
                  </CardTitle>
                  <CardDescription className="text-primary-dark text-sm">
                    Danh sách các lớp học mà con bạn đã tham gia
                  </CardDescription>
                </div>
                <Button
                  variant="outlined"
                  className="border-primary-dark text-primary-dark hover:bg-hover-primary text-sm"
                >
                  Xem tất cả lớp
                </Button>
              </CardHeader>

              <CardContent className="grid sm:grid-cols-2 gap-4">
                {registeredClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="border border-primary-light bg-primary-lighter p-4 rounded-xl hover:bg-hover-primary transition"
                  >
                    <div className="font-semibold text-primary-darkest mb-1">
                      {cls.name}
                    </div>
                    <div className="text-sm text-gray-600">{cls.schedule}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-6 h-full">
            {/* Thông báo */}
            <Card className="bg-white border border-primary-light shadow-md h-full">
              <div className="flex items-center justify-between px-6 pt-6">
                <div className="flex items-center text-primary-darkest text-xl font-semibold">
                  <MdOutlineNotificationsActive className="mr-2 text-highlight-text" />
                  Thông báo
                </div>
                <Button
                  variant="outlined"
                  className="border-primary-dark text-primary-dark hover:bg-hover-primary px-3 py-1 text-sm"
                >
                  Xem tất cả
                </Button>
              </div>
              <CardContent className="space-y-3 pt-4">
                {notifications.slice(0, 2).map((noti) => (
                  <div
                    key={noti.id}
                    className="text-sm border border-primary-light bg-primary-lighter p-3 rounded-lg hover:bg-hover-primary transition"
                  >
                    <div className="font-medium text-primary-darkest mb-1">
                      {noti.title}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      Ngày: {noti.date}
                    </div>
                    <p className="line-clamp-2 text-gray-700">{noti.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sự kiện */}
            <Card className="bg-white border border-primary-light shadow-md h-full">
              <div className="flex items-center justify-between px-6 pt-6">
                <div className="text-primary-darkest text-xl font-semibold flex items-center">
                  📅 Sự kiện
                </div>
                <Button
                  variant="outlined"
                  className="border-primary-dark text-primary-dark hover:bg-hover-primary px-3 py-1 text-sm"
                >
                  Xem tất cả
                </Button>
              </div>
              <CardContent className="space-y-3 pt-4">
                {upcomingEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="text-sm border border-primary-light bg-primary-lighter p-3 rounded-lg hover:bg-hover-primary transition"
                  >
                    <div className="font-medium text-primary-darkest mb-1">
                      {event.title}
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Ngày: {event.date}</span>
                      <span>Giờ: {event.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
