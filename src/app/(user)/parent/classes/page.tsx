"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/ui/components/_common/Card";
import { Tabs, TabList, Tab, TabPanel } from "@/app/ui/components/_common/Tabs";
import { BsBook, BsCalendar, BsPersonWorkspace, BsPerson } from "react-icons/bs";
import { SiGoogleclassroom } from "react-icons/si";
import { FaRegCommentDots, FaClipboardList } from "react-icons/fa6";
import { MdOutlineAssignment } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";

export default function ParentClassesPage() {
  const [activeTab, setActiveTab] = useState("current");

  // Mock data
  const currentClasses = [
    {
      id: 1,
      subject: "Toán học",
      grade: "Lớp 10",
      teacher: "Nguyễn Văn A",
      schedule: "Thứ 2, 4, 6 (17:30 - 19:00)",
      progress: 70,
      student: "Nguyễn Văn B",
    },
    {
      id: 2,
      subject: "Vật lý",
      grade: "Lớp 10",
      teacher: "Trần Văn C",
      schedule: "Thứ 3, 5, 7 (19:30 - 21:00)",
      progress: 60,
      student: "Nguyễn Văn B",
    },
    {
      id: 3,
      subject: "Hóa học",
      grade: "Lớp 10",
      teacher: "Phạm Thị D",
      schedule: "Thứ 2, 4, 6 (19:30 - 21:00)",
      progress: 80,
      student: "Nguyễn Văn B",
    },
  ];

  const completedClasses = [
    {
      id: 4,
      subject: "Toán học nâng cao",
      grade: "Lớp 9",
      teacher: "Lê Văn E",
      completedDate: "20/12/2024",
      student: "Nguyễn Văn B",
      finalScore: "9.0/10",
    },
    {
      id: 5,
      subject: "Tiếng Anh cơ bản",
      grade: "Lớp 9",
      teacher: "Hoàng Thị F",
      completedDate: "10/12/2024",
      student: "Nguyễn Văn B",
      finalScore: "8.5/10",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Lớp học của con</h1>

      <Tabs value={activeTab} onTabChange={setActiveTab} className="mb-6">
        <TabList className="mb-4">
          <Tab label="Lớp học hiện tại" value="current" />
          <Tab label="Lớp học đã hoàn thành" value="completed" />
        </TabList>

        <TabPanel value="current">
          <div className="grid grid-cols-1 gap-6">
            {currentClasses.map((classItem) => (
              <Card key={classItem.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-primary/10 p-4 flex items-center justify-center md:w-1/4">
                    <div className="text-center">
                      <SiGoogleclassroom size={60} className="mx-auto mb-2 text-primary" />
                      <h3 className="text-lg font-semibold">{classItem.subject}</h3>
                      <p className="text-sm text-gray-600">{classItem.grade}</p>
                    </div>
                  </div>
                  <div className="p-4 flex-1">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Thông tin lớp học</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="flex items-center">
                          <BsPerson className="mr-2 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Giáo viên:</p>
                            <p className="font-medium">{classItem.teacher}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <BsCalendar className="mr-2 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Lịch học:</p>
                            <p className="font-medium">{classItem.schedule}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <BsPerson className="mr-2 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Học sinh:</p>
                            <p className="font-medium">{classItem.student}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <BsBook className="mr-2 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Tiến độ:</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                              <div
                                className="bg-primary h-2.5 rounded-full"
                                style={{ width: `${classItem.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                      <Link
                        href={`/parent/schedule?class=${classItem.id}`}
                        className="px-4 py-2 bg-primary text-white rounded-md flex items-center justify-center"
                      >
                        <BsCalendar className="mr-2" /> Xem lịch học
                      </Link>
                      <Link
                        href={`/parent/assignments?class=${classItem.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center justify-center"
                      >
                        <MdOutlineAssignment className="mr-2" /> Bài tập
                      </Link>
                      <Link
                        href={`/parent/results?class=${classItem.id}`}
                        className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center justify-center"
                      >
                        <BsPersonWorkspace className="mr-2" /> Kết quả học tập
                      </Link>
                      <Link
                        href={`/parent/contact?teacher=${classItem.teacher}`}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md flex items-center justify-center"
                      >
                        <FaRegCommentDots className="mr-2" /> Liên hệ giáo viên
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabPanel>

        <TabPanel value="completed">
          <div className="grid grid-cols-1 gap-6">
            {completedClasses.map((classItem) => (
              <Card key={classItem.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-gray-100 p-4 flex items-center justify-center md:w-1/4">
                    <div className="text-center">
                      <SiGoogleclassroom size={60} className="mx-auto mb-2 text-gray-600" />
                      <h3 className="text-lg font-semibold">{classItem.subject}</h3>
                      <p className="text-sm text-gray-600">{classItem.grade}</p>
                    </div>
                  </div>
                  <div className="p-4 flex-1">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Thông tin lớp học</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="flex items-center">
                          <BsPerson className="mr-2 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Giáo viên:</p>
                            <p className="font-medium">{classItem.teacher}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <BsCalendar className="mr-2 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Ngày hoàn thành:</p>
                            <p className="font-medium">{classItem.completedDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <BsPerson className="mr-2 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Học sinh:</p>
                            <p className="font-medium">{classItem.student}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <BsPersonWorkspace className="mr-2 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Điểm tổng kết:</p>
                            <p className="font-medium text-green-600">{classItem.finalScore}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                      <Link
                        href={`/parent/results?class=${classItem.id}`}
                        className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center justify-center"
                      >
                        <BsPersonWorkspace className="mr-2" /> Xem kết quả chi tiết
                      </Link>
                      <Link
                        href={`/parent/contact?teacher=${classItem.teacher}`}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md flex items-center justify-center"
                      >
                        <FaRegCommentDots className="mr-2" /> Liên hệ giáo viên
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
} 