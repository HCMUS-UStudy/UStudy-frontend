"use client";
import {
  getDetailAssignment,
  handleDownloadFile,
} from "@/app/lib/services/assignment";
import {
  createNewSubmission,
  deleteSubmission,
  getSubmissionDetails,
  updateSubmission,
} from "@/app/lib/services/submission";
import { AssignmentDetails, SubmissionItem } from "@/app/types/type";
import { Button } from "@/app/ui/components/_common/Button";
import ChatInput from "@/app/ui/components/_common/ChatInput";
import ConfirmModal from "@/app/ui/components/_common/ConfirmModal";
import ScoreModal from "@/app/ui/components/user/student/classes/quiz/ScoreModal";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
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
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isSubmit] = useState(false);
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});
  const [finalScore] = useState<number | null>(null);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<{ [key: string]: File[] }>({});
  const [submissionData, setSubmissionData] = useState<SubmissionItem | null>(
    null,
  );
  const [submittedAnswers, setSubmittedAnswers] = useState<{
    [key: string]: { content: string; files: File[] };
  }>({});
  const [message, setMessage] = useState<{ [key: string]: string }>({});
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchSubmissionData = async () => {
      try {
        const response = await getSubmissionDetails(exerciseId as string);
        if (response) {
          setSubmissionData(response);
          setSubmittedAnswers({
            [exerciseId as string]: {
              content: response.content,
              files: response.files.map(
                (file) => new File([], file.fileName), // Tạo File giả
              ),
            },
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu bài nộp:", error);
      }
    };

    fetchSubmissionData();
  }, [exerciseId]);

  const downloadFile = async (filePath: string) => {
    try {
      const response = await handleDownloadFile(exerciseId as string);

      // Tạo URL từ Blob
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);

      // Lấy tên file từ header (nếu có)
      const contentDisposition = response.headers["content-disposition"];
      let filename = "downloaded_file"; // Tên mặc định

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match.length > 1) {
          filename = match[1];
        }
      } else {
        // Nếu không có, lấy từ filePath
        const urlParts = filePath.split("/");
        filename = urlParts[urlParts.length - 1]; // Lấy phần cuối cùng của đường dẫn
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Dọn dẹp URL sau khi tải xong
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Tải file thành công!", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: false,
        closeOnClick: true,
      });
    } catch (error) {
      console.error("Lỗi khi tải file:", error);
      toast.error("Tải file thất bại!", {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: false,
        closeOnClick: true,
      });
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

  const handleAnswerChange = async (
    questionId: string,
    message: { content: string; files: File[] },
  ) => {
    setAnswers((prev) => ({ ...prev, [questionId]: message.content }));
    setAttachments((prev) => ({ ...prev, [questionId]: message.files }));
    setSubmittedAnswers((prev) => ({ ...prev, [questionId]: message }));

    try {
      let response;
      if (submissionData) {
        // Nếu đã có submission trước đó -> Update submission
        response = await updateSubmission(
          submissionData.id, // ID của bài nộp trước đó
          exerciseId as string,
          {
            content: message.content,
            files: message.files,
          },
        );
        console.log(response);
        toast.success("Cập nhật câu trả lời thành công!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      } else {
        // Nếu chưa có submission -> Tạo mới
        await createNewSubmission(questionId, message);
        toast.success("Gửi câu trả lời thành công!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }

    setIsEditing((prev) => ({ ...prev, [questionId]: false }));
  };

  const editAnswer = (questionId: string) => {
    console.log(message);
    console.log(attachments);
    if (!submittedAnswers[questionId]) {
      console.warn("No submitted answer found for question:", questionId);
      return;
    }

    setMessage((prev) => ({
      ...prev,
      [questionId]: submittedAnswers[questionId]?.content || "",
    }));
    setAttachments((prev) => ({
      ...prev,
      [questionId]: submittedAnswers[questionId]?.files || [],
    }));
    setIsEditing((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleDelete = (submissionId: string) => {
    setSelectedExercise(submissionId);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedExercise || !submissionData?.id) return;

    try {
      const response = await deleteSubmission(submissionData?.id);
      console.log(response);
      toast.success("Xóa thành công!", {
        position: "bottom-right",
        autoClose: 3000,
      });

      // Cập nhật lại danh sách bài nộp sau khi xóa
      setSubmissionData(null);
      setSubmittedAnswers((prev) => {
        const updatedAnswers = { ...prev };
        delete updatedAnswers[selectedExercise];
        return updatedAnswers;
      });

      setSelectedExercise(null);
    } catch (error) {
      console.error("Lỗi khi xóa bài nộp:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }

    setDeleteOpen(false);
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

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa bài tập"
        message="Bạn có chắc chắn muốn xóa bài tập này không?"
      />

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
              {!isEditing[currentExercise.id] &&
              submissionData &&
              submittedAnswers[currentExercise.id]?.content ? (
                <div className="mt-6 mb-6 p-6 bg-gray-50 rounded-lg border border-gray-300 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">
                    ✍ Câu trả lời của bạn:
                  </h4>
                  <p className="text-gray-800">
                    {submittedAnswers[currentExercise.id].content}
                  </p>

                  {submittedAnswers[currentExercise.id]?.files.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {submittedAnswers[currentExercise.id]?.files.map(
                        (file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all"
                          >
                            {/* Icon file */}
                            <FaFileAlt className="text-gray-500 text-lg" />

                            {/* Tên file */}
                            <span className="text-sm font-medium truncate max-w-[150px]">
                              {file.name}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {/* Nút chỉnh sửa hoặc xóa */}
                  <div className="mt-4 flex gap-3">
                    <Button
                      className="px-4 py-2 bg-primary-dark text-white rounded-md shadow-md hover:bg-primary-darker transition-all"
                      onClick={() => editAnswer(currentExercise.id)}
                    >
                      ✏ Chỉnh sửa
                    </Button>
                    <Button
                      className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-primary-darkest transition-all"
                      onClick={() => handleDelete(currentExercise.id)}
                    >
                      🗑 Xóa câu trả lời
                    </Button>
                  </div>
                </div>
              ) : (
                <ChatInput
                  currentQuestionId={currentExercise.id}
                  initialMessage={
                    isEditing[currentExercise.id]
                      ? submittedAnswers[currentExercise.id]?.content || ""
                      : ""
                  }
                  initialAttachments={
                    isEditing[currentExercise.id]
                      ? submittedAnswers[currentExercise.id]?.files || []
                      : []
                  }
                  onSendMessage={(questionId, message) =>
                    handleAnswerChange(questionId, message)
                  }
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExercisePage;
