"use client";
import { getDetailAssignment } from "@/app/lib/services/assignment";
import { AssignmentDetails } from "@/app/types/type";
import { Button } from "@/app/ui/components/_common/Button";
import ChatInput from "@/app/ui/components/_common/ChatInput";
import ScoreModal from "@/app/ui/components/user/student/classes/quiz/ScoreModal";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ExercisePage = () => {
  const params = useParams();
  const router = useRouter();
  const { exerciseId } = params;
  const [isLoading] = useState(false);
  const [currentExercise, setCurrentExercise] =
    useState<AssignmentDetails | null>(null);

  const [filePath, setFilePath] = useState<string | null>(null);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isSubmit] = useState(false);
  const [finalScore] = useState<number | null>(null);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<{ [key: string]: File[] }>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<{
    [key: string]: { text: string; files: File[] };
  }>({});
  const [message, setMessage] = useState<{ [key: string]: string }>({});

  // Hàm đóng modal
  const closeModal = () => {
    setModalOpen(false);
    router.back(); // Trở về trang trước đó
  };

  useEffect(() => {
    const fetchAssignmentData = async () => {
      console.log(answers);
      try {
        const response = await getDetailAssignment(exerciseId as string);
        setFilePath(response.filePath);
        setCurrentExercise(response);
      } catch (error) {
        console.error("Failed to fetch exercise data:", error);
      }
    };
    fetchAssignmentData();
  }, [exerciseId]);

  // const handleFinishQuiz = async () => {
  //   if (!currentExercise) return;

  //   console.log(showResult);
  //   console.log(answers);

  //   setShowResult(true);
  //   setShowReview(false);
  //   setIsSubmit(true);

  //   setIsLoading(true);
  //   // try {
  //   //   const result = await submitQuiz(body);
  //   //   if (result?.statusCode === "OK") {
  //   //     console.log("Quiz submitted successfully:", result);
  //   //     setModalOpen(true);
  //   //     setFinalScore(result.data.score); // Cập nhật điểm vào state
  //   //   } else {
  //   //     alert("Failed to submit quiz!");
  //   //   }
  //   // } catch (error) {
  //   //   console.error("Error submitting quiz:", error);
  //   //   alert("An error occurred while submitting the quiz. Please try again!");
  //   // } finally {
  //   //   setIsLoading(false); // Tắt loading sau khi có kết quả
  //   // }
  // };

  const downloadFile = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Tạo Blob từ dữ liệu tải về
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Tạo thẻ a để tải file
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = url.split("/").pop() || "downloaded_file"; // Lấy tên file từ URL
      document.body.appendChild(link);
      link.click();

      // Xóa link sau khi tải xong
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Lỗi khi tải file:", error);
    }
  };

  if (!currentExercise) {
    return (
      <div className="text-center text-gray-600 mt-10">Đang tải dữ liệu...</div>
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
    setSubmittedAnswers((prev) => ({
      ...prev,
      [questionId]: message,
    }));
  };

  const editAnswer = (questionId: string) => {
    console.log(message);
    console.log(attachments);
    setMessage((prev) => ({
      ...prev,
      [questionId]: submittedAnswers[questionId].text,
    }));
    setAttachments((prev) => ({
      ...prev,
      [questionId]: submittedAnswers[questionId].files,
    }));
  };

  const handleDelete = async (exerciseId: string) => {
    console.log(exerciseId);
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa bài tập này?",
    );
    if (!isConfirmed) return;

    try {
      toast.success("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa bài tập:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const removeSubmittedFile = (questionId: string, fileIndex: number) => {
    setSubmittedAnswers((prev) => {
      const updatedFiles =
        prev[questionId]?.files.filter((_, i) => i !== fileIndex) || [];
      return {
        ...prev,
        [questionId]: {
          ...prev[questionId],
          files: updatedFiles,
        },
      };
    });
  };

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
        <div className="bg-primary-lighter rounded-xl w-full p-8 backdrop-blur-md shadow-lg">
          <h3 className="text-3xl font-bold mb-6 text-center text-primary-darkest">
            {currentExercise?.title}
          </h3>

          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            {/* Yêu cầu bài tập */}
            <p className="text-xl font-semibold text-gray-800 mb-6">
              Yêu cầu:{" "}
              <span className="text-primary-dark">
                {currentExercise?.description}
              </span>
            </p>

            {/* Hiển thị file bài tập nếu có */}
            {filePath && (
              <div className="p-6 bg-primary-light border border-primary-darkest rounded-lg shadow-md mb-6">
                <h4 className="text-xl font-semibold text-primary-darker mb-3">
                  📄 Tệp bài tập
                </h4>
                <Button
                  onClick={() => downloadFile(filePath)}
                  className="px-4 py-2 bg-primary-darker text-white font-medium rounded-md transition-all duration-300 ease-in-out shadow-md hover:bg-hover-primary hover:text-primary-darkest"
                >
                  ⬇ Bấm vào đây để tải file về
                </Button>
              </div>
            )}

            {/* Khu vực nhập câu trả lời */}
            <div className="space-y-4">
              {/* Hiển thị câu trả lời đã gửi */}
              {submittedAnswers[currentExercise.id] && (
                <div className="mt-6 mb-6 p-6 bg-gray-50 rounded-lg border border-gray-300 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">
                    ✍ Câu trả lời của bạn:
                  </h4>
                  <p className="text-gray-800">
                    {submittedAnswers[currentExercise.id].text}
                  </p>

                  {/* Hiển thị file đã gửi nếu có */}
                  {submittedAnswers[currentExercise.id]?.files.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {submittedAnswers[currentExercise.id]?.files.map(
                        (file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all"
                          >
                            <span className="text-sm font-medium text-green-700 truncate max-w-[150px]">
                              {file.name}
                            </span>
                            <Button
                              onClick={() =>
                                removeSubmittedFile(currentExercise.id, index)
                              }
                              className="text-red-500 hover:text-red-700 transition-all"
                            >
                              ❌
                            </Button>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {/* Nút chỉnh sửa hoặc gửi thêm */}
                  <div className="mt-4 flex gap-3">
                    <Button
                      className="px-4 py-2 bg-primary-dark text-white rounded-md shadow-md hover:bg-primary-darker transition-all"
                      onClick={() => editAnswer(currentExercise.id)}
                    >
                      ✏ Chỉnh sửa
                    </Button>
                    <Button
                      className="px-4 py-2 bg-primary-darker text-white rounded-md shadow-md hover:bg-primary-darkest transition-all"
                      onClick={() => handleDelete(currentExercise.id)}
                    >
                      🗑 Xóa
                    </Button>
                  </div>
                </div>
              )}
              <ChatInput
                currentQuestionId={currentExercise.id}
                onSendMessage={(questionId, message) =>
                  handleAnswerChange(questionId, message)
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExercisePage;
