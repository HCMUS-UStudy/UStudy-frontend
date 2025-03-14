"use client";
import { getDetailQuiz } from "@/app/lib/services/quiz";
import { QnA } from "@/app/types/type";
import ChatInput from "@/app/ui/components/_common/ChatInput";
import ScoreModal from "@/app/ui/components/user/student/classes/quiz/ScoreModal";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

const ExercisePage = () => {
  const params = useParams();
  const router = useRouter();
  const { exerciseId } = params;
  const [isLoading, setIsLoading] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<QnA | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [showResult, setShowResult] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  // State để quản lý câu hỏi đang được chọn
  type Question = QnA["questions"][0]; // Lấy kiểu của một câu hỏi từ QnA

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );

  const [isModalOpen, setModalOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<{ [key: string]: File[] }>({});

  // Hàm đóng modal
  const closeModal = () => {
    setModalOpen(false);
    router.back(); // Trở về trang trước đó
  };

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await getDetailQuiz(exerciseId as string);
        setCurrentExercise(response);
        setTimeLeft((response.duration || 0) * 60);
      } catch (error) {
        console.error("Failed to fetch quiz data:", error);
      }
    };
    fetchQuizData();
  }, [exerciseId]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleSubmitQuiz();
    }
  }, [timeLeft, showResult]);

  // const handleAnswerSelect = (questionId: string) => {
  //   //setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));

  //   console.log(questionId);
  //   setTimeout(() => {
  //     if (currentExercise && currentExercise.questions.length > 0) {
  //       // Kiểm tra an toàn
  //       setCurrentQuestionIndex((prev) =>
  //         Math.min(prev + 1, currentExercise.questions.length - 1),
  //       );
  //     }
  //   }, 500);
  // };

  const handleSubmitQuiz = () => {
    if (
      currentExercise &&
      currentQuestionIndex === currentExercise.questions.length - 1
    ) {
      setShowReview(true);
    }
  };

  const handleFinishQuiz = async () => {
    if (!currentExercise) return;

    setShowResult(true);
    setShowReview(false);
    setIsSubmit(true);

    const durationInMinutes = Math.round(
      (currentExercise.duration * 60 - timeLeft) / 60,
    );
    const body = {
      quizId: currentExercise.id,
      duration: durationInMinutes,
      answers: currentExercise.questions.map((q) => ({
        questionId: q.id,
      })),
    };

    console.log(body);

    setIsLoading(true);
    // try {
    //   const result = await submitQuiz(body);
    //   if (result?.statusCode === "OK") {
    //     console.log("Quiz submitted successfully:", result);
    //     setModalOpen(true);
    //     setFinalScore(result.data.score); // Cập nhật điểm vào state
    //   } else {
    //     alert("Failed to submit quiz!");
    //   }
    // } catch (error) {
    //   console.error("Error submitting quiz:", error);
    //   alert("An error occurred while submitting the quiz. Please try again!");
    // } finally {
    //   setIsLoading(false); // Tắt loading sau khi có kết quả
    // }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (!currentExercise) {
    return (
      <div className="text-center text-gray-600 mt-10">Đang tải dữ liệu...</div>
    );
  }

  const currentQuestion = currentExercise.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / currentExercise.questions.length) * 100;

  // Phần giao diện review
  if (showReview) {
    // Nếu có câu hỏi được chọn thì hiển thị giao diện chi tiết câu hỏi
    if (selectedQuestion) {
      return (
        <div className="text-center py-8 bg-gray-50 min-h-screen">
          <h3 className="text-3xl font-bold mb-6 text-primary-darkest">
            📝 Chi tiết câu hỏi
          </h3>
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
            <p className="font-semibold text-lg mb-4 text-gray-800">
              Câu hỏi: {selectedQuestion.description}
            </p>
            <button
              className="px-4 py-2 rounded-full bg-gray-300 text-gray-800 shadow-md hover:bg-gray-400 transition-colors"
              onClick={() => setSelectedQuestion(null)}
            >
              🔙 Quay lại
            </button>
          </div>
        </div>
      );
    }

    // Giao diện xem lại câu trả lời
    return (
      <div className="text-center py-8 bg-gray-50 min-h-screen">
        <h3 className="text-3xl font-bold mb-8 text-primary-darkest">
          📝 Xem lại câu trả lời
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-10">
          {/* {currentExercise.questions.map((q, index) => (
            <div
              key={q.id}
              className={`p-5 rounded-xl shadow-lg transition-transform transform hover:scale-105 cursor-pointer ${
                selectedAnswers[q.id] ? "bg-green-50" : "bg-red-50"
              }`}
              onClick={() => setSelectedQuestion(q)} // Cập nhật state khi click vào câu hỏi
            >
              <p className="font-semibold mb-3 text-lg text-gray-800">
                Câu {index + 1}: {q.description}
              </p>
              <p
                className={`text-base ${
                  selectedAnswers[q.id] ? "text-green-600" : "text-red-600"
                }`}
              >
                {selectedAnswers[q.id]
                  ? `Đã trả lời: ${
                      q.options?.find((opt) => opt.id === selectedAnswers[q.id])
                        ?.description
                    }`
                  : "Chưa trả lời"}
              </p>
            </div>
          ))} */}
        </div>
        <div className="flex justify-center gap-6">
          <button
            className="px-6 py-2 rounded-full bg-gray-300 text-gray-800 shadow-md hover:bg-gray-400 transition-colors transform hover:scale-105"
            onClick={() => setShowReview(false)}
          >
            🔙 Trở về
          </button>
          <button
            className="px-6 py-2 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors transform hover:scale-105"
            onClick={handleFinishQuiz}
          >
            📤 Nộp bài
          </button>
        </div>
      </div>
    );
  }

  if (isModalOpen) {
    return (
      <ScoreModal
        quizId={exerciseId as string}
        isOpen={isModalOpen}
        score={finalScore}
        onClose={closeModal}
      />
    );
  }

  const handleAnswerChange = (
    questionId: string,
    message: { text: string; files: File[] },
  ) => {
    setAnswers((prev) => ({ ...prev, [questionId]: message.text }));
    setAttachments((prev) => ({ ...prev, [questionId]: message.files }));
  };

  // const handleFileUpload = (questionId: string, file: File) => {
  //   setAttachments((prev) => ({ ...prev, [questionId]: file }));
  // };

  return (
    <div className="flex flex-col items-center justify-center py-2">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center justify-center">
            <svg
              className="animate-spin h-12 w-12 text-white mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            <p className="text-white text-lg">Đang nộp bài, vui lòng đợi...</p>
          </div>
        </div>
      )}

      {!isSubmit && (
        <div className="flex w-full max-w-6xl gap-6">
          {/* Quiz Content */}
          <div className="bg-primary-lighter shadow-lg rounded-3xl max-w-4xl w-full p-8 backdrop-blur-md border border-primary-light">
            <h3 className="text-3xl font-bold mb-6 text-center text-primary-darkest">
              {currentExercise.title}
            </h3>

            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-highlight-text">
                Câu {currentQuestionIndex + 1}/
                {currentExercise.questions.length}
              </span>
            </div>

            <div className="w-full bg-primary-light rounded-full h-2 mb-6">
              <div
                className="bg-primary-darker h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
              {/* Câu hỏi */}
              <p className="text-xl font-semibold text-gray-800 mb-6">
                Câu hỏi:{" "}
                <span className="text-primary-dark">
                  {currentQuestion.description}
                </span>
              </p>

              {/* Khu vực nhập câu trả lời */}
              <div className="space-y-4">
                <ChatInput
                  currentQuestionId={currentQuestion.id}
                  onSendMessage={(questionId, message) =>
                    handleAnswerChange(questionId, message)
                  }
                />

                {/* Danh sách tệp đính kèm */}
                {attachments[currentQuestion.id]?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {attachments[currentQuestion.id]?.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all"
                      >
                        <span className="text-sm font-medium text-green-700 truncate max-w-[150px]">
                          {file.name}
                        </span>
                        <button
                          onClick={() => {
                            setAttachments((prev) => ({
                              ...prev,
                              [currentQuestion.id]:
                                prev[currentQuestion.id]?.filter(
                                  (_, i) => i !== index,
                                ) || [],
                            }));
                          }}
                          className="text-red-500 hover:text-red-700 transition-all"
                        >
                          ❌
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Điều hướng câu hỏi */}
              <div className="flex justify-between mt-6">
                <button
                  className="px-5 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all flex items-center shadow-sm"
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
                  }
                >
                  <FaChevronLeft className="mr-2" />
                  Trước
                </button>
                <button
                  className={`px-5 py-2 rounded-lg text-white shadow-md transition-all flex items-center ${
                    currentQuestionIndex ===
                    currentExercise.questions.length - 1
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  onClick={() => {
                    if (
                      currentQuestionIndex ===
                      currentExercise.questions.length - 1
                    ) {
                      handleSubmitQuiz();
                    } else {
                      setCurrentQuestionIndex((prev) =>
                        Math.min(
                          prev + 1,
                          currentExercise.questions.length - 1,
                        ),
                      );
                    }
                  }}
                >
                  {currentQuestionIndex === currentExercise.questions.length - 1
                    ? "Hoàn thành"
                    : "Tiếp theo"}
                  <FaChevronRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Quiz Navigation */}
          <div className="w-1/4 bg-primary-lighter shadow-lg rounded-3xl p-6 backdrop-blur-md border border-primary-light">
            <div className="flex items-center justify-center text-sm text-highlight-text mb-4 bg-primary-light py-2 rounded-md">
              <FaClock className="mr-2 text-highlight-text" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <h4 className="text-xl font-bold mb-4 text-center text-primary-darkest">
              Danh sách câu hỏi
            </h4>
            <div className="grid grid-cols-4 gap-3">
              {currentExercise.questions.map((_, index) => (
                <button
                  key={index}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    answers[currentExercise.questions[index].id]
                      ? "bg-primary-darker text-white"
                      : "bg-primary-light text-primary-dark hover:bg-hover-primary"
                  }`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {answers[currentExercise.questions[index].id] && (
                    <FaCheckCircle className="text-white mr-1" />
                  )}
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExercisePage;
