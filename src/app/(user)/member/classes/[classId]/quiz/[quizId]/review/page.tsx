"use client";
import { getReviewQuiz } from "@/app/lib/services/quiz";
import { QuizReviewData } from "@/app/types/quiz";
import { Button } from "@/app/ui/components/_common/Button";
import ReviewQuizLoading from "@/app/ui/components/_common/loading/ReviewQuizLoading";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function QuizReview() {
  const params = useParams<{ quizId: string }>();
  const quizId = params?.quizId;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [reviewData, setReviewData] = useState<QuizReviewData>();

  useEffect(() => {
    const fetchReviewQuiz = async () => {
      try {
        setLoading(true);
        const reviewData = await getReviewQuiz(quizId ?? "");
        setReviewData(reviewData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchReviewQuiz();
    return;
  }, [quizId]);

  const currentQuestion = reviewData?.questions[currentIndex];

  if (loading) {
    return <ReviewQuizLoading />;
  }

  return (
    <div className="flex w-full max-w-6xl gap-6">
      {/* Nội dung câu hỏi */}
      <div className="bg-white shadow-lg rounded-3xl w-full p-8 border border-gray-300">
        <h3 className="text-3xl font-bold mb-6 text-center text-primary-darkest">
          {reviewData?.title}
        </h3>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            Câu {currentIndex + 1}/{reviewData?.questions.length}
          </span>
        </div>

        {/* Nội dung câu hỏi */}
        <p className="text-lg mb-4">{currentQuestion?.description}</p>

        <div className="space-y-3 mb-6">
          {currentQuestion?.allOptions.map((opt) => (
            <div
              key={opt.optionId}
              className={`block border p-3 rounded-lg cursor-pointer transition-all shadow-sm 
                  ${opt.correct ? "border-green-500 bg-green-100" : ""}
                  ${currentQuestion.selectedOption.optionId === opt.optionId && !opt.correct ? "border-red-500 bg-red-100" : ""}
                `}
            >
              <div className="flex items-center justify-between">
                <span className="flex-1">{opt.description}</span>
                {opt.correct ? (
                  <FaCheckCircle className="text-green-500 text-lg" />
                ) : currentQuestion.selectedOption.optionId === opt.optionId ? (
                  <FaTimesCircle className="text-red-500 text-lg" />
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* Nút điều hướng */}
        <div className="flex justify-between">
          <Button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg flex items-center"
            onClick={() => setCurrentIndex(Math.max(currentIndex - 1, 0))}
          >
            <FaChevronLeft className="mr-1" />
            Trước
          </Button>
          <Button
            className="px-4 py-2 bg-primary-darker text-white shadow-md hover:bg-primary-darkest rounded-lg flex items-center"
            onClick={() =>
              setCurrentIndex(
                Math.min(
                  currentIndex + 1,
                  (reviewData?.questions.length !== undefined
                    ? reviewData?.questions.length
                    : 1) - 1,
                ),
              )
            }
          >
            Tiếp theo
            <FaChevronRight className="ml-1" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="w-1/4 bg-gray-100 shadow-lg rounded-3xl p-6">
        <h4 className="text-xl font-bold mb-4 text-center text-gray-800">
          Danh sách câu hỏi
        </h4>
        <div className="grid grid-cols-4 gap-3">
          {reviewData?.questions.map((q, index) => (
            <Button
              key={index}
              className={`w-10 h-10 rounded-full flex items-center justify-center 
                  ${q.correct ? "bg-green-500 text-white" : "bg-red-500 text-white"}
                `}
              onClick={() => setCurrentIndex(index)}
            >
              {!q.correct && <FaTimesCircle className="text-white mr-1" />}
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
