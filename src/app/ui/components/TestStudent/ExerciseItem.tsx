import React from "react";
import { FiMoreVertical } from "react-icons/fi";
import Dropdown from "../Dropdown";

interface ExerciseItemProps {
  image: string;
  id: string;
  title: string;
  status: string;
  deadline: string;
  completedQuestions: number;
  totalQuestions: number;
  grade: string;
  subject: string;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({
  image,
  id,
  title,
  status,
  deadline,
  completedQuestions,
  totalQuestions,
  grade,
  subject,
}) => {
  const progress = (completedQuestions / totalQuestions) * 100;

  return (
    <div className="relative flex flex-col md:flex-row items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2 mb-2 mt-2">
      {/* Image */}
      <img
        src={image || "https://via.placeholder.com/64"}
        alt={title}
        className="w-16 h-16 rounded-full object-cover mb-4 md:mb-0 md:mr-6 shadow-sm"
      />

      {/* Content */}
      <div className="flex-1">
        {/* Title with Status */}
        <div className="flex items-center mb-5">
          <h3 className="text-xl font-semibold text-gray-800 truncate mr-4">
            {title}
          </h3>
          <span
            className={`text-sm font-medium px-2 py-1 rounded ${status === "Hoàn thành"
                ? "bg-green-100 text-green-700"
                : status === "Chưa hoàn thành"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
          >
            {status}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:gap-6">
          {/* Column 2: Deadline and Progress */}
          <div className="flex-1 mb-4 md:mb-0">
            <div className="flex justify-between mb-2">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700 mr-2">Hạn nộp:</span>
                {new Date(deadline).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Tiến độ:</span>
              </p>
              <div className="w-36 bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-blue-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">
                {completedQuestions}/{totalQuestions}
              </p>
            </div>
          </div>

          {/* Column 3: Grade and Subject */}
          <div className="flex-1 mb-4 md:mb-0">
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium text-gray-700 mr-3">Lớp:</span>
              {grade}
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700 mr-2">Môn:</span>
              {subject}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative flex items-center gap-4 mt-4 md:mt-0 md:ml-4">
        <button className="px-5 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all shadow-md transform hover:scale-105 w-full md:w-auto"
          onClick={() =>
            window.location.href = `/student/study/test/${encodeURIComponent(id)}`
          }>
          Làm bài
        </button>

        {/* Dropdown Menu */}
        <Dropdown
          id={`menu-${title}`}
          triggerContent={<FiMoreVertical size={20} />}
          dropdownItems={[
            "Tải về máy",
            "Đánh dấu hoàn thành",
            "Lịch sử làm bài",
          ]}
        />
      </div>
    </div>
  );
};

export default ExerciseItem;
