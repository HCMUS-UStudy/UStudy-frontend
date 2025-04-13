import { FaClipboardList, FaClock } from "react-icons/fa6";
import { FaCalendar } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Homework() {
  const homeworkList = [
    {
      id: 1,
      subject: "Toán học",
      title: "Đạo hàm và ứng dụng",
      icon: <FaClipboardList className="h-5 w-5 text-blue-500" />,
      progress: 80,
      dueDate: "28/11/2023",
      timeRemaining: "2 ngày",
      totalExercises: 10,
      completedExercises: 8,
    },
    {
      id: 2,
      subject: "Lý học",
      title: "Điện từ trường",
      icon: <FaClipboardList className="h-5 w-5 text-green-500" />,
      progress: 60,
      dueDate: "30/11/2023",
      timeRemaining: "4 ngày",
      totalExercises: 15,
      completedExercises: 9,
    },
    {
      id: 3,
      subject: "Hóa học",
      title: "Hóa hữu cơ",
      icon: <FaClipboardList className="h-5 w-5 text-red-500" />,
      progress: 40,
      dueDate: "25/11/2023",
      timeRemaining: "Đã quá hạn",
      totalExercises: 8,
      completedExercises: 3,
      isOverdue: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-xl border hover:shadow-xl transition-shadow"
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

      <ul className="space-y-4">
        {homeworkList.slice(0, 3).map((homework) => (
          <motion.li
            key={homework.id}
            whileHover={{ scale: 1.02 }}
            className={`flex flex-col py-4 px-5 rounded-lg ${
              homework.isOverdue
                ? "bg-red-50 border border-red-200"
                : "bg-gray-50 hover:bg-gray-100"
            } transition-colors`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div
                  className={`text-2xl ${
                    homework.isOverdue ? "text-red-500" : "text-blue-500"
                  }`}
                >
                  {homework.icon}
                </div>
                <div className="ml-3">
                  <p className="text-lg font-medium text-gray-700">
                    {homework.subject}
                  </p>
                  <p className="text-sm text-gray-500">{homework.title}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 h-2 rounded-full">
                  <div
                    className={`h-2 rounded-full transition-all duration-300`}
                    style={{
                      width: `${homework.progress}%`,
                      backgroundColor:
                        homework.progress > 50 ? "#4CAF50" : "#FF6F61",
                    }}
                  />
                </div>
                <span
                  className={`text-sm font-medium ${
                    homework.progress < 50 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {homework.progress}%
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <div className="flex items-center">
                <FaClock className="text-gray-400 mr-1" />
                <span
                  className={`${
                    homework.isOverdue
                      ? "text-red-500 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {homework.timeRemaining}
                </span>
              </div>
              <div className="flex items-center">
                <FaCalendar className="text-gray-400 mr-1" />
                <span className="text-gray-500">
                  Hạn nộp: {homework.dueDate}
                </span>
              </div>
              <div className="text-gray-500">
                {homework.completedExercises}/{homework.totalExercises} bài tập
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Tổng số bài tập:{" "}
            <span className="font-semibold text-gray-700">15</span>
          </p>
          <p className="text-sm text-gray-500">
            Hoàn thành:{" "}
            <span className="font-semibold text-green-600">60%</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
