"use client";

import { useEffect, useState } from "react";
import {
  getListTeacherRatings,
  getListCourseGradeRatings,
} from "@/app/lib/services/rating";
import { FaChalkboardTeacher, FaBookOpen } from "react-icons/fa";

interface RatingsNumberProps {
  searchQuery?: string;
}

export default function RatingsNumber({ searchQuery }: RatingsNumberProps) {
  const [teacherCount, setTeacherCount] = useState(0);
  const [courseGradeCount, setCourseGradeCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const teacherRes = await getListTeacherRatings(0, 1);
        setTeacherCount(teacherRes.data.totalElements);

        const courseGradeRes = await getListCourseGradeRatings(0, 1);
        setCourseGradeCount(courseGradeRes.data.totalElements);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCounts();
  }, [searchQuery]);

  const stats = [
    {
      label: "Giáo viên",
      count: teacherCount,
      icon: <FaChalkboardTeacher className="text-blue-500 w-6 h-6" />,
      bg: "bg-blue-50",
    },
    {
      label: "Môn + Khối",
      count: courseGradeCount,
      icon: <FaBookOpen className="text-green-500 w-6 h-6" />,
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="flex gap-6 w-full">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`flex items-center gap-4 p-5 rounded-xl shadow-sm ${stat.bg} hover:shadow-md transition-shadow duration-200 flex-1`}
        >
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm">
            {stat.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-xl font-bold">{stat.count} đánh giá</p>
          </div>
        </div>
      ))}
    </div>
  );
}
