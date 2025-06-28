import { useEffect, useState } from "react";
import { getStudentClassesWithStats } from "@/app/lib/services/class";
import { StudentClassWithStats } from "@/app/types/class";
import { FaClipboardList, FaClock } from "react-icons/fa6";
import { FaCalendar } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Homework() {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-xl border hover:shadow-xl transition-shadow flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">Bài tập về nhà</h3>
        <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center">
          <span>Xem thêm</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
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
          <div className="text-center text-gray-500 py-8">
            Đang tải dữ liệu...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <ul className="space-y-4 max-h-72 overflow-y-auto pr-2">
            {homeworkList.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Không có bài tập nào.
              </div>
            ) : (
              homeworkList.slice(0, 3).map((homework) => {
                const isOverdue = homework.status === "OVERDUE";
                return (
                  <motion.li
                    key={homework.id}
                    whileHover={{ scale: 1.02 }}
                    className={`flex flex-col py-4 px-5 rounded-lg ${
                      isOverdue
                        ? "bg-red-50 border border-red-200"
                        : "bg-gray-50 hover:bg-gray-100"
                    } transition-colors`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <div
                          className={`text-2xl ${
                            isOverdue ? "text-red-500" : "text-blue-500"
                          }`}
                        >
                          <FaClipboardList className="h-5 w-5" />
                        </div>
                        <div className="ml-3">
                          <p className="text-lg font-medium text-gray-700">
                            {homework.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {homework.course?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-gray-200 h-2 rounded-full">
                          <div
                            className={`h-2 rounded-full transition-all duration-300`}
                            style={{
                              width: `${homework.completionRate}%`,
                              backgroundColor:
                                homework.completionRate > 50
                                  ? "#4CAF50"
                                  : "#FF6F61",
                            }}
                          />
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            homework.completionRate < 50
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {homework.completionRate}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <FaClock className="text-gray-400 mr-1" />
                        <span
                          className={
                            isOverdue
                              ? "text-red-500 font-semibold"
                              : "text-gray-500"
                          }
                        >
                          {isOverdue ? "Đã quá hạn" : homework.status}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaCalendar className="text-gray-400 mr-1" />
                        <span className="text-gray-500">
                          {/* Hạn nộp: {homework.dueDate} */}
                          {/* No dueDate in API, so leave blank or add logic if available */}
                        </span>
                      </div>
                      <div className="text-gray-500">
                        {homework.completedAssignments}/
                        {homework.totalAssignments} bài tập
                      </div>
                    </div>
                  </motion.li>
                );
              })
            )}
          </ul>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100 mt-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Tổng số bài tập:{" "}
            <span className="font-semibold text-gray-700">
              {homeworkList.reduce((acc, cur) => acc + cur.totalAssignments, 0)}
            </span>
          </p>
          <p className="text-sm text-gray-500">
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
