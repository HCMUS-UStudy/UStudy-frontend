import React from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";

interface ScoreModalProps {
  isOpen: boolean;
  score: number | null;
  onClose: () => void;
}

const ScoreModal: React.FC<ScoreModalProps> = ({ isOpen, score, onClose }) => {
  if (!isOpen) return null;

  // Làm tròn điểm nếu không phải null
  const roundedScore = score !== null ? Math.round(score) : null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300">
      <div className="bg-gradient-to-b from-white to-gray-100 rounded-2xl p-8 w-96 text-center shadow-2xl transform transition-transform duration-300 scale-105">
        <AiOutlineCheckCircle className="text-green-500 text-5xl mx-auto mb-4 animate-bounce" />
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Kết Quả</h2>
        <p className="text-lg mb-6 text-gray-700">
          {roundedScore !== null
            ? `Nộp bài thành công! Điểm của bạn là: ${roundedScore}`
            : "Đang tải..."}
        </p>
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-indigo-600 transition-colors shadow-md"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default ScoreModal;
