import { QnA } from "@/app/types";
import React from "react";

interface QuestionReviewProps {
  selectedQuestion: QnA;
  answers: {
    [questionId: string]: {
      optionId?: string;
      content?: string;
      files?: File[];
    };
  };
  setSelectedQuestion: (q: QnA | null) => void;
}

const QuestionReview: React.FC<QuestionReviewProps> = ({
  selectedQuestion,
  answers,
  setSelectedQuestion,
}) => {
  const answer = answers[selectedQuestion.id];

  return (
    <div className="text-center py-8 bg-gray-50 min-h-screen">
      <h3 className="text-3xl font-bold mb-6 text-primary-darkest">
        📝 Chi tiết câu hỏi
      </h3>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <p className="font-semibold text-lg mb-4 text-gray-800">
          Câu hỏi: {selectedQuestion.description}
        </p>

        {selectedQuestion.options?.length ? (
          <ul className="space-y-2 mb-6">
            {selectedQuestion.options.map((opt) => (
              <li
                key={opt.id}
                className={`p-2 rounded-md border ${
                  answers[selectedQuestion.id]?.optionId === opt.id
                    ? "bg-primary-lighter border-primary-light"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                {opt.description}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mb-6 text-left">
            <p className="mb-2 text-gray-700 font-medium">Câu trả lời:</p>
            <p className="bg-gray-100 p-3 rounded-md text-left whitespace-pre-line">
              {answers[selectedQuestion.id]?.content || "Chưa có câu trả lời"}
            </p>
            {answer?.files && answer.files.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold mb-1">Tệp đính kèm:</p>
                <ul className="list-disc list-inside text-left">
                  {answer.files.map((file, i) => (
                    <li key={i}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          className="px-4 py-2 rounded-full bg-gray-300 text-gray-800 shadow-md hover:bg-gray-400 transition-colors"
          onClick={() => setSelectedQuestion(null)}
        >
          🔙 Quay lại
        </button>
      </div>
    </div>
  );
};

export default QuestionReview;
