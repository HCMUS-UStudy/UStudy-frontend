"use client";
import { getClassById } from "@/app/lib/services/class";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ClassDetail } from "@/app/types/class";
import { FaCalendarAlt, FaClock, FaInfoCircle } from "react-icons/fa";

// Simple component for consistent info row layout
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-gray-500 w-20">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default function ClassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { classId } = await params;
  // const classDetail = await getClassById(classId);

  const params = useParams<{ classId: string }>();
  const classId = params?.classId as string;

  // State for selected day tab
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const router = useRouter();

  const { data: classDetail } = useQuery<ClassDetail>({
    queryKey: ["ClassDetails", classId],
    queryFn: () => getClassById(classId),
    refetchOnWindowFocus: false,
  });
  // const [currentTab, setCurrentTab] = useState<keyof typeof tabs>("overview");
  const pathname = usePathname();

  useEffect(() => {}, [pathname]);

  const tabs = {
    // overview: "Tổng quan",
    assignment: "Bài tập & Kiểm tra",
    material: "Tài liệu",
    participant: "Thành viên",
    ...(classDetail?.status === "COMPLETED"
      ? { review: "Đánh giá lớp học" }
      : {}),
  };

  // Get current tab from pathname, default to assignment if not found
  // const currentTab = (() => {
  //   const tabFromPath = pathname?.split("/").pop();
  //   return tabFromPath && tabFromPath in tabs ? tabFromPath : "assignment";
  // })();

  const handleTabChange = (id: string) => {
    router.push(`/member/classes/${classId}/${id}`);
  };

  // Format date to display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Mock class sessions data
  const mockClassSessions = [
    {
      id: "1",
      day: "THURSDAY",
      session: {
        id: "s1",
        name: "Sáng",
        startTime: "08:00:00",
        endTime: "10:30:00",
      },
      room: {
        id: "r1",
        name: "A1.201",
      },
    },
    {
      id: "2",
      day: "SATURDAY",
      session: {
        id: "s2",
        name: "Chiều",
        startTime: "13:30:00",
        endTime: "16:00:00",
      },
      room: {
        id: "r2",
        name: "B2.105",
      },
    },
    {
      id: "3",
      day: "SUNDAY",
      session: {
        id: "s3",
        name: "Tối",
        startTime: "18:00:00",
        endTime: "20:30:00",
      },
      room: {
        id: "r3",
        name: "C3.308",
      },
    },
  ];
  const allSessions = classDetail?.classSessions?.length
    ? classDetail.classSessions
    : mockClassSessions;
  const days = useMemo(() => {
    const uniqueDays = Array.from(
      new Set(allSessions.map((session) => session.day)),
    );
    return uniqueDays.sort((a, b) => {
      const daysOrder = [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ];
      return daysOrder.indexOf(a) - daysOrder.indexOf(b);
    });
  }, [allSessions]);

  // Set first day as selected by default
  useEffect(() => {
    if (days.length > 0 && !selectedDay) {
      setSelectedDay(days[0]);
    }
  }, [days, selectedDay]);

  // Format time to display
  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  // Translate day to Vietnamese
  const translateDay = (day: string) => {
    const daysMap: Record<string, string> = {
      MONDAY: "Thứ 2",
      TUESDAY: "Thứ 3",
      WEDNESDAY: "Thứ 4",
      THURSDAY: "Thứ 5",
      FRIDAY: "Thứ 6",
      SATURDAY: "Thứ 7",
      SUNDAY: "Chủ nhật",
    };
    return daysMap[day] || day;
  };

  // Translate status to Vietnamese
  const translateStatus = (status?: string) => {
    switch (status) {
      case "OPEN":
        return "Sắp mở";
      case "PROGRESS":
        return "Đang học";
      case "COMPLETED":
        return "Đã kết thúc";
      default:
        return "Không xác định";
    }
  };

  if (
    pathname?.includes("/forum") ||
    pathname?.includes("/assignment/") ||
    pathname?.includes("/exercise/") ||
    pathname?.includes("/editExercise/") ||
    pathname?.includes("/review/")
  ) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-primary-lighter p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h1 className="text-2xl font-bold text-primary-darkest">
              {classDetail?.name}
            </h1>
            {classDetail?.description && (
              <p className="text-primary-dark text-sm bg-white/50 rounded-lg px-3 py-1.5">
                {classDetail.description}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* Class Time */}
          <div className="p-4">
            <h3 className="text-gray-700 font-medium mb-3 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-600" />
              Thời gian học
            </h3>
            <div className="space-y-2 pl-7">
              <InfoRow
                label="Bắt đầu:"
                value={
                  classDetail?.startDate
                    ? formatDate(classDetail.startDate)
                    : "N/A"
                }
              />
              <InfoRow
                label="Kết thúc:"
                value={
                  classDetail?.endDate ? formatDate(classDetail.endDate) : "N/A"
                }
              />
            </div>
          </div>

          {/* Class Schedule */}
          <div className="p-4">
            <h3 className="text-gray-700 font-medium mb-3 flex items-center gap-2">
              <FaClock className="text-green-600" />
              Lịch học
            </h3>

            {/* Day Tabs with Horizontal Scroll */}
            <div className="relative mb-4">
              <div className="overflow-x-auto pb-2 -mx-1">
                <div className="flex gap-2 px-1">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`flex-shrink-0 px-3 py-1.5 text-sm rounded-md transition-colors ${
                        selectedDay === day
                          ? "bg-primary-dark text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {translateDay(day)}
                    </button>
                  ))}
                </div>
              </div>
              {/* Fade effect for right edge */}
              <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
            </div>

            {/* Session Details */}
            <div className="space-y-2">
              {selectedDay &&
                allSessions
                  .filter((session) => session.day === selectedDay)
                  .map((session, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md">
                          {session.session.name && (
                            <span className="text-sm font-medium text-gray-700">
                              {session.session.name}:
                            </span>
                          )}
                          <span className="font-medium text-primary-darkest whitespace-nowrap">
                            {formatTime(session.session.startTime)} -{" "}
                            {formatTime(session.session.endTime)}
                          </span>
                        </div>

                        {session.room && (
                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md">
                            <span className="text-sm text-gray-500">
                              Phòng:
                            </span>
                            <span className="font-medium text-gray-800">
                              {session.room.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

              {selectedDay &&
                !allSessions.some((s) => s.day === selectedDay) && (
                  <div className="text-gray-500 text-sm italic p-3 bg-gray-50 rounded-lg">
                    Không có lịch học vào{" "}
                    {translateDay(selectedDay).toLowerCase()}
                  </div>
                )}
            </div>
          </div>

          {/* Class Info */}
          <div className="p-4">
            <h3 className="text-gray-700 font-medium mb-3 flex items-center gap-2">
              <FaInfoCircle className="text-purple-600" />
              Thông tin khác
            </h3>
            <div className="space-y-2 pl-7">
              <InfoRow
                label="Khóa học:"
                value={classDetail?.course?.name || "N/A"}
              />
              <InfoRow
                label="Khối:"
                value={classDetail?.grade?.name || "N/A"}
              />
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-20">Trạng thái:</span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                    classDetail?.status === "PROGRESS"
                      ? "bg-primary-lighter text-primary-darkest"
                      : classDetail?.status === "COMPLETED"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-primary-lighter text-primary-darkest" // OPEN
                  }`}
                >
                  {translateStatus(classDetail?.status)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 flex gap-5 text-primary-dark text-sm md:text-[16px] font-medium">
          {Object.entries(tabs).map(([id, label]) => (
            <label
              key={id}
              htmlFor={id}
              className="relative group cursor-pointer hover:text-primary-darker has-[:checked]:hover:text-primary-darker transition-all duration-300 py-1.5 px-4 has-[:checked]:text-primary-darkest has-[:checked]:font-bold"
            >
              <input
                id={id}
                type="radio"
                name="ClassTabs"
                className="hidden peer"
                onChange={() => handleTabChange(id)}
                checked={pathname?.split("/")[4] === id}
              />
              {label}
              <span className="absolute inset-0 border-b-2 border-primary scale-x-0 group-hover:scale-x-100 transition-all duration-300 peer-checked:border-primary-darkest peer-checked:scale-x-100"></span>
            </label>
          ))}
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
