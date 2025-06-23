import {
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getPersonalClassSchedule } from "@/app/lib/services/classSchedule";
import { ClassSchedule } from "@/app/types";
import { format, startOfWeek, addDays } from "date-fns";
import { vi } from "date-fns/locale";

export default function Schedule() {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const currentDate = new Date();
  const [displayDate, setDisplayDate] = useState<string>(
    new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(currentDate),
  );

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await getPersonalClassSchedule(
          currentDate.getMonth() + 1,
          currentDate.getFullYear(),
        );
        // console.log("API Response:", response.data.data);
        setSchedules(response.data.data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // Update display date when selected day changes
  useEffect(() => {
    setDisplayDate(
      new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(selectedDay),
    );
  }, [selectedDay]);

  // Transform API data to match display format
  const transformedSchedules = schedules
    .map((schedule) => {
      // console.log("Processing schedule:", schedule);
      // console.log("Teacher data:", schedule.classSession?.clazz.teacher);
      return {
        subject:
          schedule.classSession?.clazz.course.name || "Không có tên môn học",
        grade: schedule.classSession?.clazz.grade.name || "Không có lớp",
        date: format(new Date(schedule.date), "yyyy-MM-dd"),
        time: schedule.classSession
          ? `${format(new Date(`2000-01-01T${schedule.classSession.session.startTime}`), "HH:mm")} - ${format(
              new Date(`2000-01-01T${schedule.classSession.session.endTime}`),
              "HH:mm",
            )}`
          : "Không có giờ học",
        teacher:
          schedule.classSession?.clazz.teacher?.name || "Chưa có giáo viên",
        location: schedule.classSession?.room?.name || "Chưa có phòng học",
        status:
          new Date(schedule.date) < currentDate ? "completed" : "upcoming",
        detail: schedule.classSession?.session.name || "Không có mô tả",
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get schedules for selected day
  const selectedDaySchedules = transformedSchedules.filter(
    (schedule) => schedule.date === format(selectedDay, "yyyy-MM-dd"),
  );

  // Calculate weekly summary
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start from Monday
  const weeklySummary = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(weekStart, i);
    const count = transformedSchedules.filter(
      (schedule) => schedule.date === format(day, "yyyy-MM-dd"),
    ).length;
    return {
      day: format(day, "EEEE", { locale: vi }).replace("Thứ ", "Thứ "),
      date: day,
      count,
    };
  });

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border mt-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-7 gap-2 mb-6">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white p-6 rounded-xl border hover:shadow-xl transition-shadow mt-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-1">
            Lịch học
          </h3>
          <p className="text-sm text-gray-500">{displayDate}</p>
        </div>
        <div className="flex items-center mt-3 sm:mt-0">
          <div className="mr-4 flex items-center">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-1">
              {selectedDaySchedules.length}
            </span>
            <span className="text-sm text-gray-600">lớp trong ngày</span>
          </div>
          <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center">
            Xem tất cả
            <FaArrowRight className="ml-1 h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Tóm tắt theo ngày trong tuần */}
      <div className="grid grid-cols-7 gap-2 mb-6 bg-gray-50 p-3 rounded-lg">
        {weeklySummary.map((day, index) => (
          <div
            key={index}
            onClick={() => setSelectedDay(day.date)}
            className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer transition-colors ${
              format(day.date, "yyyy-MM-dd") ===
              format(selectedDay, "yyyy-MM-dd")
                ? "bg-blue-100 border border-blue-200"
                : "hover:bg-gray-100"
            }`}
          >
            <span
              className={`text-sm font-medium ${
                format(day.date, "yyyy-MM-dd") ===
                format(selectedDay, "yyyy-MM-dd")
                  ? "text-blue-800"
                  : "text-gray-500"
              }`}
            >
              {day.day}
            </span>
            <span
              className={`text-xl font-bold ${
                format(day.date, "yyyy-MM-dd") ===
                format(selectedDay, "yyyy-MM-dd")
                  ? "text-blue-800"
                  : "text-gray-700"
              }`}
            >
              {day.count}
            </span>
            <span className="text-xs text-gray-400">lớp</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {selectedDaySchedules.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300"
          >
            <FaCalendarAlt className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Không có lịch học
            </h3>
            <p className="text-sm text-gray-500 text-center">
              Không có lớp học nào được lên lịch cho ngày {displayDate}
            </p>
          </motion.div>
        ) : (
          selectedDaySchedules.map((schedule, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ scale: 1.01 }}
              className="flex flex-col sm:flex-row p-4 border rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors duration-300 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start flex-1 mb-3 sm:mb-0">
                {/* Số thứ tự */}
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold mr-3">
                  {index + 1}
                </div>

                {/* Màu sắc theo môn học */}
                <div
                  className={`w-2 h-full self-stretch rounded-l-lg mr-3 ${
                    schedule.subject.includes("Toán")
                      ? "bg-blue-500"
                      : schedule.subject.includes("Lý")
                        ? "bg-purple-500"
                        : schedule.subject.includes("Hóa")
                          ? "bg-green-500"
                          : "bg-red-500"
                  }`}
                ></div>

                <div className="flex flex-col w-full space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-gray-800 mr-2">
                        {schedule.subject}
                      </span>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                        {schedule.grade}
                      </span>
                    </div>

                    <div className="sm:hidden flex items-center gap-1 ml-auto">
                      <FaClock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-800">
                        {schedule.time}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 sm:pr-2">
                    {schedule.detail}
                  </p>

                  <div className="flex flex-wrap justify-between items-center mt-1">
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
                      <div className="flex items-center">
                        <FaUser className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-600">
                          {schedule.teacher}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-600">
                          {schedule.location}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 sm:mt-0 flex items-center sm:hidden">
                      <FaCalendarAlt className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-600">
                        {schedule.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex flex-col justify-between text-right sm:min-w-[130px] sm:border-l sm:border-gray-200 sm:pl-4 sm:ml-2">
                <div>
                  <div className="flex items-center justify-end">
                    <FaCalendarAlt className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">
                      {schedule.date}
                    </span>
                  </div>
                  <div className="flex items-center justify-end mt-1">
                    <FaClock className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-sm font-semibold text-gray-800">
                      {schedule.time}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center transition-all duration-200 px-2 py-1 hover:bg-blue-100 rounded">
                    Chi tiết <FaArrowRight className="ml-1 h-2 w-2" />
                  </button>
                </div>
              </div>

              <div className="sm:hidden flex justify-end mt-2 pt-2 border-t border-gray-200 w-full">
                <button className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center transition-all duration-200 px-2 py-1 hover:bg-blue-100 rounded">
                  Chi tiết <FaArrowRight className="ml-1 h-2 w-2" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
