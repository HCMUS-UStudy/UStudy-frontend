"use client";

import React from "react";
import { FaBookOpen, FaBullhorn, FaComments } from "react-icons/fa6";
import { usePathname, useRouter } from "next/navigation";

export default function ClassOverview() {
  const router = useRouter();
  const pathname = usePathname();
  const classId = pathname.split("/")[3]; // Lấy classId từ URL

  const sections = [
    {
      title: "Thông báo",
      icon: <FaBullhorn size={24} />,
      path: "",
    },
    {
      title: "Diễn đàn thảo luận",
      icon: <FaComments size={24} />,
      path: "forum",
    },
    {
      title: "Giáo trình khóa học",
      icon: <FaBookOpen size={24} />,
      path: "",
    },
  ];

  const handleNavigate = (path: string) => {
    if (path) {
      router.push(`/member/classes/${classId}/overview/${path}`);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-primary-dark mb-4 flex items-center">
        📌 Thông tin lớp học
      </h2>
      <p className="text-gray-600 text-sm mb-6">
        Đây là tổng quan về lớp học, bao gồm các thông tin quan trọng như thông
        báo, diễn đàn và giáo trình khóa học.
      </p>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <div
            key={index}
            onClick={() => handleNavigate(section.path)}
            className={`flex items-center p-4 rounded-lg border border-gray-200 bg-gray-100 hover:bg-gray-200 transition shadow-sm cursor-pointer ${
              section.path && "hover:shadow-md"
            }`}
          >
            <div className="p-3 rounded-full bg-primary-light text-white shadow-md">
              {section.icon}
            </div>
            <span className="text-lg font-medium text-gray-800 ml-4">
              {section.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
