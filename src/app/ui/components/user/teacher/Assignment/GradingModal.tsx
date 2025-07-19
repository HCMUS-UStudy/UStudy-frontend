"use client";

import {
  getSubmissionDetails,
  gradeSubmission,
  AIGradeSubmission,
} from "@/app/lib/services/submission";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Loading from "../../../_common/loading/Loading";
import { SubmissionDetail, SubmissionItem } from "@/app/types";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import { Button } from "../../../_common/Button";

const GradingModal = ({
  assignmentId,
  submissionItem,
  setGradingItem,
}: {
  assignmentId: string;
  submissionItem: SubmissionItem;
  setGradingItem: (submissionItem: SubmissionItem | null) => void;
}) => {
  const { data: gradingData, isLoading } = useQuery({
    queryKey: ["gradingModal", submissionItem.id],
    queryFn: () => getSubmissionDetails(submissionItem.id, true),
    enabled: !!submissionItem.id,
  });

  const [isGraded, setIsGraded] = useState(submissionItem.gradedBy !== null);

  const gradingModal = gradingData as SubmissionDetail | undefined;

  // State for overall feedback and per-question grading
  const [overallFeedback, setOverallFeedback] = useState<string>(
    gradingModal?.feedback ?? "",
  );
  const [questionGrades, setQuestionGrades] = useState(
    () =>
      gradingModal?.questions.map((q) => ({
        questionId: q.questionId,
        score: q.score ?? 0,
        feedback: "",
      })) ?? [],
  );
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();
  const { addToast } = useCustomToast();

  // Mutation for grading
  const mutation = useMutation({
    mutationFn: async (payload: {
      feedback: string;
      questions: { questionId: string; feedback: string; score: number }[];
    }) => {
      // Chỉ gửi các câu ESSAY vào mutation
      const essayQuestions = payload.questions.filter((q) => {
        const questionDetail = gradingModal?.questions.find(
          (qd) => qd.questionId === q.questionId,
        );
        return questionDetail?.questionType === "ESSAY";
      });
      return gradeSubmission(
        submissionItem.id,
        payload.feedback,
        essayQuestions,
      );
    },
    onSuccess: async () => {
      addToast.success("Chấm điểm thành công!");
      queryClient.invalidateQueries({
        queryKey: ["submissions", assignmentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["assignment-questions", assignmentId],
      });
      // Wait before refetching to allow backend to update
      await new Promise((resolve) => setTimeout(resolve, 400));
      queryClient.invalidateQueries({
        queryKey: ["gradingModal", submissionItem.id],
      });
      // Get the latest grading data and update fields
      const updatedData = await getSubmissionDetails(submissionItem.id, true);
      setQuestionGrades(
        updatedData?.questions.map((q) => ({
          questionId: q.questionId,
          score: q.score ?? 0,
          feedback: q.feedback ?? "",
        })) ?? [],
      );
      setOverallFeedback(updatedData?.feedback ?? "");
      setIsGraded(true);
      setIsEditing(false);
    },
    onError: () => {
      addToast.error("Chấm điểm thất bại!");
    },
  });

  // Mutation for AI grading
  const aiMutation = useMutation({
    mutationFn: async () => {
      return AIGradeSubmission(submissionItem.id);
    },
    onSuccess: async () => {
      addToast.success("Hãy xác nhận hoặc chỉnh sửa.");
      // Refetch grading data and wait for completion
      queryClient.invalidateQueries({
        queryKey: ["gradingModal", submissionItem.id],
      });
      // Get the latest grading data
      const updatedData = await getSubmissionDetails(submissionItem.id, true);
      setQuestionGrades(
        updatedData?.questions.map((q) => ({
          questionId: q.questionId,
          score: q.score ?? 0,
          feedback: q.feedback ?? "",
        })) ?? [],
      );
      setOverallFeedback(updatedData?.feedback ?? "");
      setIsGraded(true);
      setIsEditing(true);
    },
    onError: () => {
      addToast.error("Chấm điểm tự động thất bại!");
    },
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
          <div className="flex flex-col justify-center items-center h-40">
            <Loading />
            <span className="mt-4 text-primary-dark font-semibold text-lg">
              Đang tải dữ liệu bài nộp...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full p-6 relative max-h-[90vh]">
        {/* Loading overlay when AI grading is pending */}
        {aiMutation.isPending && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-white bg-opacity-80 pointer-events-auto">
            <div className="flex flex-col items-center">
              <Loading />
              <span className="mt-4 text-primary-dark font-semibold text-lg">
                Đang chấm bài, vui lòng đợi...
              </span>
            </div>
          </div>
        )}
        {/* Modal content below overlay */}
        <button
          className="absolute top-4 right-5 text-xl text-gray-500 hover:text-primary-dark"
          onClick={() => setGradingItem(null)}
          disabled={aiMutation.isPending} // Disable close when loading
        >
          x
        </button>
        <div className="flex flex-col">
          <h3 className="text-primary-darker text-[18px] font-bold mb-2">
            {gradingModal?.title}
          </h3>
          <div className="mb-2">
            Học sinh:{" "}
            <span className="text-primary-darkest">
              {submissionItem.student.name} - {submissionItem.student.genId}
            </span>
          </div>
          {(isGraded || isEditing) && (
            <div className="mb-2">
              Tổng điểm:{" "}
              <span className="text-primary-darkest">
                {isEditing
                  ? questionGrades.reduce((acc, q) => acc + (q.score ?? 0), 0)
                  : gradingModal?.score}{" "}
                /{" "}
                {gradingModal?.questions.reduce(
                  (acc, q) => acc + (q.maxScore ?? q.score),
                  0,
                )}
              </span>
            </div>
          )}
          {(isGraded || isEditing) && (
            <div className="mb-2 flex w-full gap-[6px]">
              <span className="whitespace-nowrap">Nhận xét: </span>
              {isEditing ? (
                <textarea
                  value={overallFeedback}
                  onChange={(e) => setOverallFeedback(e.target.value)}
                  className={`border rounded w-full px-1 ${gradingModal?.feedback ? "h-fit" : "h-[30px]"} min-h-[30px] max-h-[80px] 
                    focus:outline-none focus:ring-1 focus:ring-primary-darkest`}
                />
              ) : (
                <span className="text-primary-darkest">
                  {gradingModal?.feedback || "---"}
                </span>
              )}
            </div>
          )}

          <div className="mb-2 flex flex-col overflow-y-auto max-h-[50vh] py-3">
            {gradingModal?.questions.map((q, idx) => (
              <div key={q.questionId} className="mb-4 border rounded p-3">
                <div className="mb-1 border-b pb-2 border-gray-100">
                  <span className="font-semibold">Câu {idx + 1}:</span>{" "}
                  {q.description}
                </div>
                {q.questionType === "MULTIPLE_CHOICE" && (
                  <div>
                    <div className="mb-1">
                      <ul className="list-disc ml-2">
                        {q.allOptions?.map((opt) => (
                          <li
                            key={opt.optionId}
                            className={
                              opt.optionId === q.correctOption?.optionId
                                ? "font-semibold text-primary-darker"
                                : opt.optionId === q.selectedOption?.optionId &&
                                    !opt.isCorrect
                                  ? "font-semibold text-red-600"
                                  : ""
                            }
                            style={{ listStyleType: "none" }}
                          >
                            <span className="mr-2">
                              {q.allOptions &&
                                String.fromCharCode(
                                  65 + q.allOptions.indexOf(opt),
                                )}
                              .
                            </span>
                            {opt.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {q.questionType === "ESSAY" && (
                  <div className="pt-1 pb-2">
                    <div className="flex gap-[6px]">
                      <span className="text-gray-800 italic">Trả lời:</span>
                      <span>{q.content}</span>
                    </div>
                    {q.files && q.files.length > 0 && (
                      <div className="mb-1">
                        File đính kèm:
                        <ul className="list-disc ml-6">
                          {q.files.map((f) => (
                            <li key={f.id}>
                              <a
                                href={f.filePath}
                                className="underline text-primary-dark"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {f.fileName}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                {(isGraded || isEditing) && (
                  <div className="border-t border-gray-100 pt-2">
                    <div className="italic text-gray-700">
                      Điểm:{" "}
                      {isEditing && q.questionType === "ESSAY" ? (
                        <input
                          type="number"
                          min={0}
                          max={q.maxScore ?? q.score}
                          value={questionGrades[idx]?.score}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setQuestionGrades((grades) =>
                              grades.map((g, i) =>
                                i === idx ? { ...g, score: val } : g,
                              ),
                            );
                          }}
                          className="border rounded pl-2 w-14 focus:outline-none focus:ring-1 focus:ring-primary-darkest"
                        />
                      ) : (
                        <span>{q.score}</span>
                      )}{" "}
                      / {q.maxScore ?? q.score}
                    </div>
                    {q.questionType === "ESSAY" && (
                      <div className="mt-1 flex italic text-gray-700">
                        <span className="whitespace-nowrap mr-[6px]">
                          Nhận xét:
                        </span>
                        {isEditing ? (
                          <textarea
                            value={questionGrades[idx]?.feedback}
                            onChange={(e) => {
                              const val = e.target.value;
                              setQuestionGrades((grades) =>
                                grades.map((g, i) =>
                                  i === idx ? { ...g, feedback: val } : g,
                                ),
                              );
                            }}
                            className={`border rounded w-full px-1 ${q.feedback ? "h-fit" : "h-[30px]"} min-h-[30px] max-h-[80px] 
                          focus:outline-none focus:ring-1 focus:ring-primary-darkest`}
                          />
                        ) : (
                          <span className="text-gray-700">
                            {q.feedback ?? "---"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            {!isEditing ? (
              <>
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setQuestionGrades(
                      gradingModal?.questions.map((q) => ({
                        questionId: q.questionId,
                        score: q.score ?? 0,
                        feedback: q.feedback ?? "",
                      })) ?? [],
                    );
                    setOverallFeedback(gradingModal?.feedback ?? "");
                  }}
                >
                  {isGraded ? "Chấm lại" : "Chấm bài"}
                </Button>
                {!isGraded && (
                  <Button
                    type="button"
                    className="bg-slate-500 text-white px-4 py-2 rounded-lg hover:bg-slate-600"
                    onClick={() => {
                      aiMutation.mutate();
                    }}
                    disabled={mutation.isPending}
                  >
                    Chấm bài tự động
                  </Button>
                )}
              </>
            ) : (
              <>
                {/* Only show 'Xác nhận' if AI grading was used */}
                {!(aiMutation.isSuccess && isEditing) && (
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-300"
                    onClick={() => setIsEditing(false)}
                  >
                    Hủy
                  </button>
                )}
                <Button
                  disabled={mutation.isPending}
                  onClick={() => {
                    mutation.mutate({
                      feedback: overallFeedback,
                      questions: questionGrades,
                    });
                  }}
                >
                  Xác nhận
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradingModal;
