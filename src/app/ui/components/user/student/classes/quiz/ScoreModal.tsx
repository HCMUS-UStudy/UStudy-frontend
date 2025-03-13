"use client";
import { getReviewQuiz } from "@/app/lib/services/quiz";
import { QuizReview } from "@/app/types/type";
import React, { useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import ReviewQuiz from "./ReviewQuiz";

interface ScoreModalProps {
  quizId: string;
  isOpen: boolean;
  score: number | null;
  onClose: () => void;
  onReview?: () => void;
}

const ScoreModal: React.FC<ScoreModalProps> = ({
  quizId,
  isOpen,
  score,
  onClose,
}) => {
  const [reviewQuiz, setReviewQuiz] = useState<QuizReview>();
  const [isReviewing, setIsReviewing] = useState(false);
  if (!isOpen) return null;

  // Làm tròn điểm nếu không phải null
  const roundedScore = score !== null ? Math.round(score) : null;

  const handleReviewQuiz = async () => {
    try {
      const reviewData = await getReviewQuiz(quizId);

      setReviewQuiz(reviewData);
      setIsReviewing(true);
    } catch (error) {
      console.error("Error fetching review quiz:", error);
    }
  };

  return (
    <>
      {isReviewing ? (
        <ReviewQuiz
          reviewData={
            reviewQuiz ?? { quizId: "", title: "", score: 0, questions: [] }
          }
          onClose={() => setIsReviewing(false)}
        />
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300">
          <div className="bg-gradient-to-b from-white to-gray-100 rounded-2xl p-8 w-96 text-center shadow-2xl transform transition-transform duration-300 scale-105">
            <AiOutlineCheckCircle className="text-green-500 text-5xl mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Kết Quả
            </h2>
            <p className="text-lg mb-6 text-gray-700">
              {roundedScore !== null
                ? `Nộp bài thành công! Điểm của bạn là: ${roundedScore}`
                : "Đang tải..."}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-2 rounded-full hover:from-gray-500 hover:to-gray-600 transition-colors shadow-md"
              >
                Đóng
              </button>
              <button
                onClick={() => handleReviewQuiz()}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-indigo-600 transition-colors shadow-md"
              >
                Xem Review
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScoreModal;
