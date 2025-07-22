import { useEffect, useState } from "react";
import { getStudentClassesWithStats } from "@/app/lib/services/class";
import { StudentClassWithStats } from "@/app/types/class";
import {
  FaClock,
  FaCalendar,
  FaBook,
  FaGraduationCap,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Homework() {
  const router = useRouter();
  const [homeworkList, setHomeworkList] = useState<StudentClassWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStudentClassesWithStats();
        setHomeworkList(data);
      } catch (err) {
        console.log(err);
        setError("Không thể tải dữ liệu bài tập.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusInfo = (status: string, completionRate: number) => {
    if (completionRate === 100) {
      return {
        text: "Hoàn thành",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: <FaCheckCircle className="text-green-500" />,
      };
    } else if (status === "OVERDUE") {
      return {
        text: "Quá hạn",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: <FaExclamationTriangle className="text-red-500" />,
      };
    } else {
      return {
        text: "Đang học",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        icon: <FaClock className="text-blue-500" />,
      };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getProgressColor = (rate: number) => {
    if (rate >= 80) return "#10B981";
    if (rate >= 60) return "#F59E0B";
    if (rate >= 40) return "#F97316";
    return "#EF4444";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-4 rounded-xl border hover:shadow-xl transition-shadow flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <FaBook className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Bài tập về nhà</h3>
            <p className="text-xs text-gray-500">Theo dõi tiến độ học tập</p>
          </div>
        </div>
        <button
          className="text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 text-sm"
          onClick={() => router.push("/member/classes")}
        >
          <span>Xem tất cả</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-500 text-sm">Đang tải...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="text-red-500 text-4xl mb-2">⚠️</div>
            <p className="text-red-500 text-center text-sm">{error}</p>
          </div>
        ) : (
          <ul className="space-y-3 max-h-90 overflow-y-auto pr-1">
            {homeworkList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="text-gray-400 text-4xl mb-2">📚</div>
                <p className="text-gray-500 text-center text-sm">
                  Chưa có bài tập nào
                </p>
              </div>
            ) : (
              homeworkList.slice(0, 3).map((homework) => {
                const statusInfo = getStatusInfo(
                  homework.status,
                  homework.completionRate,
                );
                const progressColor = getProgressColor(homework.completionRate);

                return (
                  <motion.li
                    key={homework.id}
                    className={`flex flex-col py-3 px-4 rounded-lg border ${statusInfo.borderColor} ${statusInfo.bgColor} hover:bg-blue-100 hover:shadow-md transition-all duration-200 overflow-hidden`}
                  >
                    <div className="flex items-start justify-between w-full mb-2">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          {statusInfo.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-bold text-gray-800 truncate mb-1">
                            {homework.name}
                          </h4>
                          <div className="flex items-center space-x-1 text-xs text-gray-600">
                            <FaBook className="text-gray-400" />
                            <span className="truncate">
                              {homework.course?.name}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1 ml-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.bgColor} flex-shrink-0`}
                        >
                          {statusInfo.text}
                        </span>
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <FaGraduationCap className="text-gray-400" />
                          <span>{homework.grade?.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700">
                          Tiến độ
                        </span>
                        <span
                          className="text-xs font-bold"
                          style={{ color: progressColor }}
                        >
                          {homework.completionRate}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${homework.completionRate}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ backgroundColor: progressColor }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1">
                          <FaCalendar className="text-gray-400" />
                          <span className="text-gray-600">
                            {formatDate(homework.startDate)} -{" "}
                            {formatDate(homework.endDate)}
                          </span>
                        </div>
                        <div className="text-gray-600 font-medium">
                          {homework.completedAssignments}/
                          {homework.totalAssignments}
                        </div>
                      </div>
                    </div>
                  </motion.li>
                );
              })
            )}
          </ul>
        )}
      </div>

      <div className="pt-3 border-t border-gray-100 mt-3">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Tổng bài tập:{" "}
            <span className="font-semibold text-gray-700">
              {homeworkList.reduce((acc, cur) => acc + cur.totalAssignments, 0)}
            </span>
          </p>
          <p className="text-xs text-gray-500">
            Hoàn thành:{" "}
            <span className="font-semibold text-green-600">
              {homeworkList.length > 0
                ? Math.round(
                    homeworkList.reduce(
                      (acc, cur) => acc + cur.completionRate,
                      0,
                    ) / homeworkList.length,
                  )
                : 0}
              %
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
