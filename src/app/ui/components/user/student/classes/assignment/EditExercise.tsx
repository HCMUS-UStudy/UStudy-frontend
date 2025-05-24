/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  getSubmissionDetails,
  updateSubmission,
} from "@/app/lib/services/submission";
import { SubmissionDetail } from "@/app/types";
import { Button } from "@/app/ui/components/_common/Button";
import ChatInput from "@/app/ui/components/_common/ChatInput";
import ReviewQuizLoading from "@/app/ui/components/_common/loading/ReviewQuizLoading";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaSave, FaTimesCircle } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { toast } from "react-toastify";

interface EditExerciseProps {
  submissionId: string;
}

export default function EditExercise({ submissionId }: EditExerciseProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [reviewData, setReviewData] = useState<SubmissionDetail>();
  const [submittedAnswers, setSubmittedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [deletedFiles, setDeletedFiles] = useState<{ [key: string]: string[] }>(
    {},
  );
  const [updatedFiles, setUpdatedFiles] = useState<{ [key: string]: File[] }>(
    {},
  );

  const fetchEditExercise = async () => {
    try {
      setLoading(true);
      const reviewData = await getSubmissionDetails(submissionId, true);
      setReviewData(reviewData);

      // Build the initial submitted answers from the fetched review data
      const initialAnswers = reviewData.questions.reduce(
        (acc, question) => {
          if (
            question.questionType === "MULTIPLE_CHOICE" &&
            question.selectedOption
          ) {
            acc[question.questionId] = question.selectedOption.description;
          } else if (question.questionType === "ESSAY" && question.content) {
            acc[question.questionId] = question.content;
          }
          return acc;
        },
        {} as { [key: string]: string },
      );

      setSubmittedAnswers(initialAnswers);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu bài nộp:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditExercise();
  }, [submissionId]);

  const currentQuestion = reviewData?.questions[currentIndex];

  if (loading || !currentQuestion) return <ReviewQuizLoading />;

  const isMultipleChoice = currentQuestion.questionType === "MULTIPLE_CHOICE";
  const isEssay = currentQuestion.questionType === "ESSAY";

  const handleSendMessage = (
    questionId: string,
    message: { content: string; files: File[] },
  ) => {
    const updatedAnswer = message.content;
    setSubmittedAnswers((prev) => ({
      ...prev,
      [questionId]: updatedAnswer,
    }));
    setUpdatedFiles((prev) => ({
      ...prev,
      [questionId]: message.files,
    }));

    setIsEditing(false);
    console.log("Updated Answer:", updatedAnswer);
  };

  const handleSave = () => {
    setIsConfirmModalOpen(true);
  };

  const handleEditAnswer = () => {
    setIsEditing(true); // Show ChatInput for editing
  };

  const handleDeleteAnswer = (questionId: string) => {
    setSubmittedAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });

    // Track the file IDs that need to be deleted
    const fileIdsToDelete =
      reviewData?.questions
        .find((q) => q.questionId === questionId)
        ?.files?.map((f) => f.id) || [];

    setDeletedFiles((prev) => ({
      ...prev,
      [questionId]: fileIdsToDelete,
    }));
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);

      // Only include the questions with type 'ESSAY'
      const answers = reviewData?.questions
        ?.map((question) => {
          // Only handle "ESSAY" questions
          if (question.questionType !== "ESSAY") {
            return null; // Skip other types
          }

          const currentContent = submittedAnswers[question.questionId] || "";
          const originalContent = question.content || "";

          const hasChanged = currentContent !== originalContent;

          const addedFiles = updatedFiles[question.questionId] || [];
          const deletedFilesForQuestion =
            deletedFiles[question.questionId] || []; // Get deleted files for this question

          return {
            questionId: question.questionId,
            content: hasChanged ? currentContent : originalContent,
            addedFiles,
            deletedFiles: deletedFilesForQuestion,
          };
        })
        .filter((answer) => answer !== null) as {
        questionId: string;
        content: string;
        addedFiles: File[];
        deletedFiles: string[];
      }[]; // Filter out null values

      console.log(answers);

      if (answers.length > 0) {
        await updateSubmission(submissionId, { answers });
        toast.success("Cập nhật bài làm thành công!");
        setIsConfirmModalOpen(false);

        window.location.reload();
      } else {
        toast.error("Không có câu trả lời nào để cập nhật.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Đã có lỗi xảy ra khi cập nhật bài làm.");
    } finally {
      setLoading(false);
    }
  };

  const uploadedFiles = updatedFiles[currentQuestion.questionId] ?? [];
  const deletedFileIds = deletedFiles[currentQuestion.questionId] ?? [];

  // Safely check if currentQuestion.files exists and filter out deleted files
  const combinedFiles = [
    ...uploadedFiles,
    ...(currentQuestion.files?.filter(
      (file) => !deletedFileIds.includes(file.id ?? ""),
    ) ?? []),
  ];

  // Ensure displayedFiles is always an array
  const displayedFiles = combinedFiles ?? [];

  const handleFileRemove = (fileIds: string[]) => {
    setDeletedFiles((prev) => {
      const updatedDeletedFiles = { ...prev };
      // Update the deleted files for the specific question
      updatedDeletedFiles[currentQuestion.questionId] = [
        ...(updatedDeletedFiles[currentQuestion.questionId] || []),
        ...fileIds,
      ];
      return updatedDeletedFiles;
    });
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

        {isEssay &&
          submittedAnswers[currentQuestion.questionId] &&
          !isEditing && (
            <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-300 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                ✍ Câu trả lời của bạn:
              </h4>
              <p className="text-gray-800 mb-4">
                {submittedAnswers[currentQuestion.questionId]}
              </p>

              {(uploadedFiles.length > 0 ||
                (currentQuestion.files &&
                  currentQuestion.files.length > 0)) && (
                <div className="mt-2">
                  <h5 className="text-md font-semibold text-gray-700 mb-1">
                    📎 File đã đính kèm:
                  </h5>
                  <ul className="list-disc list-inside text-blue-700">
                    {displayedFiles.map((file, index) => {
                      const isServerFile = "filePath" in file;
                      const key = isServerFile
                        ? ((file as any).id ?? `${file.fileName}-${index}`)
                        : `${file.name}-${index}`;
                      const href = isServerFile ? (file as any).filePath : "#";
                      const label = isServerFile
                        ? (file as any).fileName
                        : file.name;

                      return (
                        <li key={key}>
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-blue-900"
                          >
                            {label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <Button
                  className="px-4 py-2 bg-primary-dark text-white rounded-md shadow-md hover:bg-primary-darker transition-all"
                  onClick={() => handleEditAnswer()}
                >
                  ✏ Chỉnh sửa
                </Button>
                <Button
                  className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-primary-darkest transition-all"
                  onClick={() => handleDeleteAnswer(currentQuestion.questionId)}
                >
                  🗑 Xóa câu trả lời
                </Button>
              </div>
            </div>
          )}

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
        {isEssay && isEditing && (
          <div className="space-y-6 mb-8">
            <div>
              <p className="text-lg font-semibold text-gray-800 mb-3">
                Chỉnh sửa câu trả lời:
              </p>
              <ChatInput
                currentQuestionId={currentQuestion.questionId}
                initialMessage={
                  submittedAnswers[currentQuestion.questionId] ||
                  currentQuestion.content ||
                  ""
                }
                initialAttachments={
                  currentQuestion.files?.map((file) => {
                    return new File([], file.fileName || "unknown", {
                      type: "application/octet-stream",
                    });
                  }) || []
                }
                submissionData={reviewData || null}
                onSendMessage={handleSendMessage}
                onFileRemove={(fileIds) => handleFileRemove(fileIds)}
              />
            </div>
          </div>
        )}

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
            onClick={() => {
              if (currentIndex === (reviewData?.questions.length ?? 1) - 1) {
                handleSave(); // Gọi hàm lưu
              } else {
                setCurrentIndex((prev) =>
                  Math.min(prev + 1, (reviewData?.questions.length ?? 1) - 1),
                );
              }
            }}
          >
            {currentIndex === (reviewData?.questions.length ?? 1) - 1 ? (
              <>
                Lưu <FaSave className="ml-2" />
              </>
            ) : (
              <>
                Tiếp theo <FaChevronRight className="ml-1" />
              </>
            )}
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

      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Xác nhận lưu thay đổi
            </h3>
            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn lưu những câu trả lời đã chỉnh sửa?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Hủy
              </Button>
              <Button
                className="px-4 py-2 bg-primary-dark text-white rounded-md shadow-md hover:bg-primary-darker"
                onClick={handleConfirm}
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
