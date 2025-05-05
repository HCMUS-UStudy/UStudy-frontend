import { QnA } from "@/app/types";
import React from "react";
import { FaClock, FaCheckCircle } from "react-icons/fa";

interface QuestionSidebarProps {
  questions: QnA[];
  answers: Record<
    string,
    { optionId?: string; content?: string; files?: File[] }
  >;
  setCurrentQuestionIndex: (index: number) => void;
  timeLeft: number;
  formatTime: (time: number) => string;
}

const QuestionSidebar: React.FC<QuestionSidebarProps> = ({
  questions,
  answers,
  setCurrentQuestionIndex,
  timeLeft,
  formatTime,
}) => {
  return (
    <div className="w-1/4 bg-primary-lighter shadow-lg rounded-3xl p-6 backdrop-blur-md border border-primary-light">
      <div className="flex items-center justify-center text-sm text-highlight-text mb-4 bg-primary-light py-2 rounded-md">
        <FaClock className="mr-2 text-highlight-text" />
        <span>{formatTime(timeLeft)}</span>
      </div>

      <h4 className="text-xl font-bold mb-4 text-center text-primary-darkest">
        Danh sách câu hỏi
      </h4>

      <div className="grid grid-cols-4 gap-3">
        {questions.map((q, index) => {
          const isAnswered =
            q.questionType === "MULTIPLE_CHOICE"
              ? !!answers[q.id]?.optionId
              : q.questionType === "ESSAY"
                ? !!answers[q.id]?.content
                : false;

          return (
            <button
              key={q.id}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isAnswered
                  ? "bg-primary-darker text-white"
                  : "bg-primary-light text-primary-dark hover:bg-hover-primary"
              }`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {isAnswered && <FaCheckCircle className="text-white mr-1" />}
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionSidebar;
