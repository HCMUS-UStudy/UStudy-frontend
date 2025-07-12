"use client";

import Link from "next/link";
import { SiGoogleclassroom } from "react-icons/si";
import {
  BsPerson,
  BsCalendar,
  BsPersonWorkspace,
  BsBook,
} from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";
import { Card } from "../../../_common/Card";
import { ChildClass } from "@/app/types";
import { getListChildClasses } from "@/app/lib/services/childClasses";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/app/store/store";
import CompletedSkeleton from "./CompletedSkeleton ";

export default function CompletedClass() {
  const selectedChild = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.children.selectedChild,
  );

  const {
    data: classes = [],
    isLoading,
    error,
  } = useQuery<ChildClass[]>({
    queryKey: ["endedChildClasses", selectedChild?.id],
    queryFn: async () => {
      if (!selectedChild?.id) return [];
      const data = await getListChildClasses(selectedChild.id, 0, 10, "");

      const now = new Date(); // phải đặt trong queryFn
      return data.content.filter((classItem: ChildClass) => {
        const endDate = new Date(classItem.endDate);
        return endDate < now;
      });
    },
    enabled: !!selectedChild?.id,
    placeholderData: (prev) => prev,
  });

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

  // Show loading state if no child is selected
  if (!selectedChild?.id) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <div className="mb-4">
          <SiGoogleclassroom className="text-gray-300 text-6xl mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Chưa chọn học sinh
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Vui lòng chọn học sinh từ danh sách để xem thông tin lớp học đã hoàn
          thành
        </p>
      </div>
    );
  }

  if (isLoading) return <CompletedSkeleton />;

  if (error) return <div>Lỗi: {(error as Error).message}</div>;

  return (
    <div className="grid grid-cols-1 gap-6">
      {classes.map((classItem) => (
        <Card
          key={classItem.id}
          className="overflow-hidden rounded-2xl hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex flex-col md:flex-row">
            <div className="bg-gray-100 p-6 flex items-center justify-center md:w-1/4">
              <div className="text-center">
                <SiGoogleclassroom
                  size={60}
                  className="mx-auto mb-3 text-gray-600"
                />
                <h3 className="text-xl font-bold text-gray-800">
                  {classItem.course?.name || "Chưa có môn học"}
                </h3>
                <p className="text-sm text-gray-500">
                  {classItem.grade?.name || "Chưa có khối lớp"}
                </p>
              </div>
            </div>

            <div className="p-6 flex-1">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Thông tin lớp học
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <BsPerson className="mr-3 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Giáo viên:</p>
                      <p className="font-medium text-gray-800">
                        {classItem.teacherName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BsCalendar className="mr-3 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Ngày hoàn thành:</p>
                      <p className="font-medium text-gray-800">
                        {formatDate(classItem.endDate)}
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
                  href={`/parent/results?class=${classItem.id}`}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <BsPersonWorkspace className="mr-2" /> Xem kết quả chi tiết
                </Link>
                <Link
                  href={`/parent/contact?teacher=${classItem.teacherName}`}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center transition-colors"
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
