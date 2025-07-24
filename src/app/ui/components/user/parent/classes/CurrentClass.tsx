"use client";

import { useRouter } from "next/navigation";
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
import { AiOutlineCalendar } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/app/store/store";
import ClassCardSkeleton from "./ClassCardSkeleton";

export default function CurrentClass() {
  const router = useRouter();
  const now = new Date();
  const selectedChild = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.children.selectedChild,
  );

  const {
    data: classes = [],
    isLoading,
    error,
  } = useQuery<ChildClass[]>({
    queryKey: ["childClasses", selectedChild?.id],
    queryFn: async () => {
      if (!selectedChild?.id) return [];
      try {
        const data = await getListChildClasses(selectedChild.id, 0, 10, "");
        // Ensure data.content exists and is an array
        if (!data || !Array.isArray(data.content)) {
          console.warn(
            "Invalid data structure from getListChildClasses:",
            data,
          );
          return [];
        }
        return data.content.filter((classItem: ChildClass) => {
          const endDate = new Date(classItem.endDate);
          return endDate >= now;
        });
      } catch (error) {
        console.error("Error fetching child classes:", error);
        return [];
      }
    },
    enabled: !!selectedChild?.id,
    placeholderData: (prevData) => prevData,
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
          Vui lòng chọn học sinh từ danh sách để xem thông tin lớp học
        </p>
      </div>
    );
  }

  if (isLoading) return <ClassCardSkeleton />;

  if (error) return <div>Lỗi: {(error as Error).message}</div>;

  // Show empty state when no classes are available
  if (classes.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-200">
        <div className="mb-6">
          <SiGoogleclassroom className="text-blue-300 text-8xl mx-auto" />
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-3">
          Chưa có lớp học hiện tại
        </h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
          {selectedChild?.name} hiện tại chưa tham gia lớp học nào. Hãy đăng ký
          lớp học phù hợp.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <div className="flex items-center gap-2 text-blue-600">
            <AiOutlineCalendar className="text-lg" />
            <span className="text-sm font-medium">
              Sẵn sàng học tập mọi lúc
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Ensure classes is always an array before mapping
  const safeClasses = Array.isArray(classes) ? classes : [];

  return (
    <div className="grid grid-cols-1 gap-6">
      {safeClasses.map((classItem) => (
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
                {/* <Link
                  href={`/parent/assignments?class=${classItem.id}`}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <MdOutlineAssignment className="mr-2" /> Bài tập
                </Link> */}
                <button
                  onClick={() =>
                    router.push(`/member/academic-result?class=${classItem.id}`)
                  }
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <BsPersonWorkspace className="mr-2" /> Kết quả học tập
                </button>
                <button
                  onClick={() =>
                    router.push(
                      `/member/contact?teacher=${classItem.teacherName}`,
                    )
                  }
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <FaRegCommentDots className="mr-2" /> Liên hệ giáo viên
                </button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
