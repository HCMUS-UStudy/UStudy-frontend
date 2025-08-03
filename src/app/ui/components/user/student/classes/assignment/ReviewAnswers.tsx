import { QnA } from "@/app/types";
import React from "react";

type Props = {
  questions: QnA[];
  submittedAnswers: {
    [questionId: string]: {
      optionId?: string; // Multiple Choice answer
      content?: string; // Essay answer content
      files?: File[]; // Files attached for essay answers
    };
  };
  setSelectedQuestion: (q: QnA) => void;
  setShowReview: (value: boolean) => void;
  handleFinishAssignment: () => void;
};

const ReviewAnswers: React.FC<Props> = ({
  questions,
  submittedAnswers,
  setSelectedQuestion,
  setShowReview,
  handleFinishAssignment,
}) => {
  return (
    <div className="text-center py-8 bg-gray-50 min-h-screen">
      <h3 className="text-3xl font-bold mb-8 text-primary-darkest">
        📝 Xem lại câu trả lời
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-10 auto-rows-fr">
        {questions.map((q, index) => {
          const isEssay = q.questionType === "ESSAY";
          const isMC = q.questionType === "MULTIPLE_CHOICE";

          // Get submitted content or optionId based on the question type
          const submittedContent =
            submittedAnswers[q.id]?.content?.trim() || "";
          const answerOptionId = submittedAnswers[q.id]?.optionId;
          const selectedOption = q.options.find(
            (opt) => opt.id === answerOptionId,
          );

          // Determine if the question is answered based on its type
          const isAnswered = isEssay
            ? submittedContent !== ""
            : isMC
              ? !!answerOptionId
              : false;

          return (
            <div
              key={q.id}
              className={`p-5 rounded-xl shadow-lg transition-transform transform hover:scale-105 cursor-pointer flex h-full items-center justify-center text-center ${
                isAnswered ? "bg-green-50" : "bg-red-50"
              }`}
              onClick={() => setSelectedQuestion(q)}
            >
              <div className="flex-1 flex flex-col justify-center items-center">
                <p className="font-semibold text-lg text-gray-800">
                  Câu {index + 1}: {q.description}
                </p>

                <div
                  className={`pt-4 text-base ${
                    isAnswered ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isAnswered ? (
                    isEssay ? (
                      <>
                        <div className="w-full">
                          <span className="font-semibold">Tự luận:</span>
                          <div className="mt-1 w-full max-w-[400px] min-w-[150px] whitespace-pre-wrap max-h-20 overflow-y-auto p-3 bg-white rounded-lg border border-gray-200 shadow-sm text-gray-800 leading-relaxed">
                            {submittedContent}
                          </div>
                        </div>
                        {submittedAnswers[q.id]?.files?.length ? (
                          <ul className="mt-2 space-y-1 text-sm text-blue-600 underline">
                            {submittedAnswers[q.id]?.files?.map((file, idx) => (
                              <li key={idx}>{file.name}</li>
                            ))}
                          </ul>
                        ) : null}
                      </>
                    ) : (
                      <>
                        Đã trả lời:{" "}
                        <span className="font-semibold">
                          {selectedOption?.description || "Không rõ lựa chọn"}
                        </span>
                      </>
                    )
                  ) : (
                    "Chưa trả lời"
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-6">
        <button
          className="px-6 py-2 rounded-full bg-gray-300 text-gray-800 shadow-md hover:bg-gray-400 transition-colors transform hover:scale-105"
          onClick={() => setShowReview(false)}
        >
          🔙 Trở về
        </button>
        <button
          className="px-6 py-2 rounded-full bg-primary-dark text-white shadow-md hover:bg-hover-primary transition-colors transform hover:scale-105"
          onClick={handleFinishAssignment}
        >
          📤 Nộp bài
        </button>
      </div>
    </div>
  );
};

export default ReviewAnswers;
