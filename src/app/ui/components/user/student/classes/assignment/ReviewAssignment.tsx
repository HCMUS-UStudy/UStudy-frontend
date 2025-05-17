"use client";
import { getSubmissionDetails } from "@/app/lib/services/submission";
import { SubmissionDetail } from "@/app/types";
import { Button } from "@/app/ui/components/_common/Button";
import ReviewQuizLoading from "@/app/ui/components/_common/loading/ReviewQuizLoading";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface ReviewAssignmentProps {
  submissionId: string;
}

export default function ReviewAssignment({
  submissionId,
}: ReviewAssignmentProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [reviewData, setReviewData] = useState<SubmissionDetail>();

  useEffect(() => {
    console.log("Đã chuyển");
    const fetchReviewAssignment = async () => {
      try {
        setLoading(true);
        const reviewData = await getSubmissionDetails(submissionId);
        setReviewData(reviewData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu bài nộp:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviewAssignment();
  }, [submissionId]);

  const currentQuestion = reviewData?.questions[currentIndex];

  if (loading || !currentQuestion) return <ReviewQuizLoading />;

  const isMultipleChoice = currentQuestion.questionType === "MULTIPLE_CHOICE";
  const isEssay = currentQuestion.questionType === "ESSAY";

  const handleExplainAnswer = async (questionId: string) => {
    try {
      // Call the AI explanation API here
      // This is just a placeholder for the AI explanation call
      // const explanation = await fetchExplanationFromAI(questionId);
      // alert(`AI Explanation for Question ${questionId}: ${explanation}`);
      console.log(questionId);
    } catch (error) {
      console.error("Error fetching AI explanation:", error);
    }
  };

  return (
    <div className="flex w-full gap-6">
      {/* Nội dung chính */}
      <div className="bg-white shadow-lg rounded-3xl w-full p-8 border border-gray-300">
        <h3 className="text-3xl font-bold mb-6 text-center text-primary-darkest">
          {reviewData?.title}
        </h3>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            Câu {currentIndex + 1}/{reviewData?.questions.length}
          </span>
        </div>

        <p className="text-lg font-medium mb-4">
          {currentQuestion.description}
        </p>

        {/* MULTIPLE CHOICE */}
        {isMultipleChoice && currentQuestion.allOptions && (
          <div className="space-y-3 mb-6">
            {currentQuestion.allOptions.map((opt) => {
              const selectedOption = currentQuestion.selectedOption;
              const isSelected = selectedOption?.optionId === opt.optionId;
              const isCorrect = opt.isCorrect;

              let borderColor = "border-gray-300";
              let bgColor = "bg-white";
              let icon = null;

              if (selectedOption?.isCorrect) {
                // Người dùng chọn đúng → tô xanh đáp án được chọn
                if (isSelected) {
                  borderColor = "border-green-500";
                  bgColor = "bg-green-100";
                  icon = <FaCheckCircle className="text-green-500 text-xl" />;
                }
              } else {
                // Người dùng chọn sai
                if (isSelected) {
                  // Tô đỏ đáp án được chọn sai
                  borderColor = "border-red-500";
                  bgColor = "bg-red-100";
                  icon = <FaTimesCircle className="text-red-500 text-xl" />;
                }
                if (isCorrect) {
                  // Tô xanh đáp án đúng
                  borderColor = "border-green-500";
                  bgColor = "bg-green-100";
                  icon = <FaCheckCircle className="text-green-500 text-xl" />;
                }
              }

              return (
                <div
                  key={opt.optionId}
                  className={`block border p-3 rounded-lg transition-all shadow-sm ${borderColor} ${bgColor}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1">{opt.description}</span>
                    {icon}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ESSAY */}
        {isEssay && (
          <div className="space-y-6 mb-8">
            <div>
              <p className="text-lg font-semibold text-gray-800 mb-3">
                Câu trả lời của bạn:
              </p>
              <p className="bg-gray-50 p-4 rounded-lg shadow-md whitespace-pre-wrap text-gray-700">
                {currentQuestion.content || "Không có nội dung"}
              </p>
            </div>
            {currentQuestion?.files && currentQuestion.files.length > 0 && (
              <div>
                <p className="text-lg font-semibold text-gray-800 mb-3">
                  Tệp đính kèm:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {currentQuestion.files.map((file) => (
                    <li key={file.id} className="flex items-center">
                      <a
                        href={file.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 hover:underline transition duration-300 ease-in-out"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 14l2-2m0 0l2 2m-2-2v6m3-10h5a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h5"
                          />
                        </svg>
                        <span>{file.fileName}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Giải thích đáp án bằng AI */}
        {/* Giải thích đáp án bằng AI */}
        <div className="flex justify-end mb-6">
          <Button
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md flex items-center gap-2 transition duration-300 ease-in-out"
            onClick={() => handleExplainAnswer(currentQuestion.questionId)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 11V9a4 4 0 018 0v2a4 4 0 01-8 0zm-5 0V9a4 4 0 118 0v2a4 4 0 01-8 0zm7 6v1a2 2 0 01-2 2H9m6-3v1a2 2 0 01-2 2h-1"
              />
            </svg>
            Giải thích đáp án bằng AI
          </Button>
        </div>

        {/* Điều hướng */}
        <div className="flex justify-between">
          <Button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg flex items-center"
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentIndex === 0}
          >
            <FaChevronLeft className="mr-1" />
            Trước
          </Button>
          <Button
            className="px-4 py-2 bg-primary-darker text-white shadow-md hover:bg-primary-darkest rounded-lg flex items-center"
            onClick={() =>
              setCurrentIndex((prev) =>
                Math.min(prev + 1, (reviewData?.questions.length ?? 1) - 1),
              )
            }
            disabled={currentIndex === (reviewData?.questions.length ?? 1) - 1}
          >
            Tiếp theo
            <FaChevronRight className="ml-1" />
          </Button>
        </div>
      </div>

      {/* Danh sách câu hỏi */}
      <div className="w-1/4 bg-gray-100 shadow-lg rounded-3xl p-6">
        <h4 className="text-xl font-bold mb-4 text-center text-gray-800">
          Danh sách câu hỏi
        </h4>
        <div className="grid grid-cols-4 gap-3">
          {reviewData?.questions.map((q, index) => {
            const isCorrect = q.selectedOption?.isCorrect;
            let bgColor = "bg-gray-400"; // mặc định nếu chưa chọn
            if (isCorrect === true) bgColor = "bg-green-500";
            else if (isCorrect === false) bgColor = "bg-red-500";

            return (
              <Button
                key={q.questionId}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColor} text-white`}
                onClick={() => setCurrentIndex(index)}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
