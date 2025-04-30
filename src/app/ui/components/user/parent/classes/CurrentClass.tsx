"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiGoogleclassroom } from "react-icons/si";
import {
  BsPerson,
  BsCalendar,
  BsPersonWorkspace,
  BsBook,
} from "react-icons/bs";
import { MdOutlineAssignment } from "react-icons/md";
import { FaRegCommentDots } from "react-icons/fa";
import { Card } from "../../../_common/Card";
import { ChildClass } from "@/app/types";
import { getListChildClasses } from "@/app/lib/services/childClasses";
import { AiOutlineCalendar } from "react-icons/ai";

export default function CurrentClass() {
  const [classes, setClasses] = useState<ChildClass[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getListChildClasses(
          "6619a4e4-b268-4b86-9b5f-929cbb69c871",
          0,
          10,
          "",
        );

        const now = new Date();
        const filteredClasses = data.content.filter((classItem: ChildClass) => {
          const endDate = new Date(classItem.endDate);
          return endDate >= now;
        });

        setClasses(filteredClasses);
      } catch (error) {
        console.error("Error fetching classes", error);
      }
    };

    fetchClasses();
  }, []);

  const dayOfWeekMapping: Record<string, string> = {
    MONDAY: "Thứ Hai",
    TUESDAY: "Thứ Ba",
    WEDNESDAY: "Thứ Tư",
    THURSDAY: "Thứ Năm",
    FRIDAY: "Thứ Sáu",
    SATURDAY: "Thứ Bảy",
    SUNDAY: "Chủ Nhật",
  };

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function getScheduleForAllDays(classItem: ChildClass) {
    const allDays = classItem.scheduleInfo.map(
      (schedule) => dayOfWeekMapping[schedule.dayOfWeek],
    );
    return allDays.length ? allDays.join(", ") : "Chưa có lịch học";
  }

  function calculateProgress(startDate: string, endDate: string) {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return 0;
    }

    if (now > end) {
      return 100;
    }

    const totalDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    const daysPassed = (now.getTime() - start.getTime()) / (1000 * 3600 * 24);

    const progress = (daysPassed / totalDays) * 100;
    return progress;
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {classes.map((classItem) => (
        <Card
          key={classItem.id}
          className="overflow-hidden rounded-2xl hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex flex-col md:flex-row">
            <div className="bg-primary/10 p-6 flex items-center justify-center md:w-1/4">
              <div className="text-center">
                <SiGoogleclassroom
                  size={64}
                  className="mx-auto mb-3 text-primary"
                />
                <h3 className="text-xl font-semibold">
                  {classItem.course?.name || "Chưa có môn học"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {classItem.grade?.name || "Chưa có khối lớp"}
                </p>
              </div>
            </div>

            <div className="p-6 flex-1">
              {/* Class Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Thông tin lớp học
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <BsPerson className="text-gray-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Giáo viên:</p>
                      <p className="font-medium text-gray-900">
                        {classItem.teacherName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BsCalendar className="text-gray-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Lịch học:</p>
                      <p className="font-medium text-gray-900">
                        {getScheduleForAllDays(classItem)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AiOutlineCalendar className="text-gray-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">
                        Thời gian lớp học:
                      </p>
                      <p className="font-medium text-gray-900">
                        {formatDate(classItem.startDate)} -{" "}
                        {formatDate(classItem.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BsBook className="text-gray-500" size={20} />
                    <div className="max-w-[200px] w-full">
                      <p className="text-sm text-gray-600">Tiến độ:</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div
                          className="bg-primary h-2.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${calculateProgress(
                              classItem.startDate,
                              classItem.endDate,
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
                <Link
                  href={`/parent/assignments?class=${classItem.id}`}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <MdOutlineAssignment className="mr-2" /> Bài tập
                </Link>
                <Link
                  href={`/parent/results?class=${classItem.id}`}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <BsPersonWorkspace className="mr-2" /> Kết quả học tập
                </Link>
                <Link
                  href={`/parent/contact?teacher=${classItem.teacherName}`}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <FaRegCommentDots className="mr-2" /> Liên hệ giáo viên
                </Link>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
