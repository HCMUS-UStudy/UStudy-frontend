// import { QnA } from "@/app/types";
// import React from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// interface QuestionCardProps {
//   currentQuestion: QnA;
//   currentQuestionIndex: number;
//   questionsLength: number;
//   progress: number;
//   selectedAnswers: Record<string, string>;
//   optionLabels: string[];
//   handleAnswerSelect: (questionId: string, optionId: string) => void;
//   setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
//   handleSubmitAssignment: () => void;
// }

// const QuestionCard: React.FC<QuestionCardProps> = ({
//   currentQuestion,
//   currentQuestionIndex,
//   questionsLength,
//   progress,
//   selectedAnswers,
//   optionLabels,
//   handleAnswerSelect,
//   setCurrentQuestionIndex,
//   handleSubmitAssignment,
// }) => {
//   return (
//     <div className="bg-primary-lighter shadow-lg rounded-3xl max-w-4xl w-full p-8 backdrop-blur-md border border-primary-light">
//       <h3 className="text-3xl font-bold mb-6 text-center text-primary-darkest">
//         {currentQuestion?.description}
//       </h3>

//       <div className="flex justify-between items-center mb-4">
//         <span className="text-sm text-highlight-text">
//           Câu {currentQuestionIndex + 1}/{questionsLength}
//         </span>
//       </div>

//       <div className="w-full bg-primary-light rounded-full h-2 mb-6">
//         <div
//           className="bg-primary-darker h-2 rounded-full transition-all duration-500"
//           style={{ width: `${progress}%` }}
//         ></div>
//       </div>

//       <div>
//         <p className="text-lg text-highlight-text mb-4">
//           Câu hỏi: {currentQuestion?.description}
//         </p>
//         <div className="space-y-3 mb-6">
//           {currentQuestion?.options?.map((opt, index) => (
//             <label
//               key={opt.id}
//               className={`block border p-3 rounded-lg cursor-pointer transition-all shadow-sm ${
//                 selectedAnswers[currentQuestion.id] === opt.id
//                   ? "bg-primary-darker text-white border-primary-darker scale-105"
//                   : "bg-white text-primary-dark border-primary-light hover:bg-primary-light"
//               }`}
//             >
//               <input
//                 type="radio"
//                 name={currentQuestion.id}
//                 value={opt.id}
//                 className="hidden"
//                 onChange={() => handleAnswerSelect(currentQuestion.id, opt.id)}
//               />
//               <span className="font-bold mr-2 text-highlight-text">
//                 {optionLabels[index]}.
//               </span>
//               {opt.description}
//             </label>
//           ))}
//         </div>

//         <div className="flex justify-between">
//           <button
//             className="px-4 py-2 bg-primary-light text-primary-dark rounded-lg shadow-md hover:bg-hover-primary transition-all flex items-center"
//             onClick={() =>
//               setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
//             }
//           >
//             <FaChevronLeft className="mr-1" />
//             Trước
//           </button>
//           <button
//             className="px-4 py-2 bg-primary-darker text-white rounded-lg shadow-md hover:bg-primary-darkest transition-all flex items-center"
//             onClick={() => {
//               if (currentQuestionIndex === questionsLength - 1) {
//                 handleSubmitAssignment();
//               } else {
//                 setCurrentQuestionIndex((prev) =>
//                   Math.min(prev + 1, questionsLength - 1),
//                 );
//               }
//             }}
//           >
//             {currentQuestionIndex === questionsLength - 1
//               ? "Hoàn thành"
//               : "Tiếp theo"}
//             <FaChevronRight className="ml-1" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuestionCard;

"use client";
import { QnA } from "@/app/types";
import { Button } from "@/app/ui/components/_common/Button";
import ChatInput from "@/app/ui/components/_common/ChatInput";
import React from "react";
import { FaFileAlt } from "react-icons/fa";

interface QuestionCardProps {
  currentQuestion: QnA;
  currentQuestionIndex: number;
  questionsLength: number;
  progress: number;
  hasFile: boolean;
  answers: Record<
    string,
    { optionId?: string; content?: string; files?: File[] }
  >;
  optionLabels: string[];
  handleAnswerSelect: (questionId: string, optionId: string) => void;
  handleAnswerChange: (
    questionId: string,
    message: {
      content: string;
      files: File[];
      deletedFileIds?: string[];
    },
  ) => void;
  downloadFile: (fileName: string, questionId: string) => Promise<void>;
  handleDeleteAnswer: (questionId: string) => void;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  handleSubmitAssignment: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  currentQuestion,
  currentQuestionIndex,
  questionsLength,
  progress,
  hasFile,
  answers,
  optionLabels,
  handleAnswerSelect,
  handleAnswerChange,
  downloadFile,
  handleDeleteAnswer,
  setCurrentQuestionIndex,
  handleSubmitAssignment,
}) => {
  // const isAnswered =
  //   currentQuestion?.questionType === "MULTIPLE_CHOICE"
  //     ? !!answers[currentQuestion?.id]?.optionId
  //     : currentQuestion?.questionType === "ESSAY"
  //       ? !!answers[currentQuestion?.id]?.content
  //       : false;

  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <div className="bg-primary-lighter shadow-lg rounded-3xl max-w-4xl w-full p-8 backdrop-blur-md border border-primary-light">
      <h3 className="text-3xl font-bold mb-6 text-center text-primary-darkest">
        {currentQuestion?.description}
      </h3>

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-highlight-text">
          Câu {currentQuestionIndex + 1}/{questionsLength}
        </span>
      </div>

      <div className="w-full bg-primary-light rounded-full h-2 mb-6">
        <div
          className="bg-primary-darker h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div>
        {currentQuestion?.questionType === "MULTIPLE_CHOICE" && (
          <div>
            <p className="text-lg text-highlight-text mb-4">
              Chọn một câu trả lời:
            </p>
            <div className="space-y-3 mb-6">
              {currentQuestion?.options?.map((opt, index) => (
                <label
                  key={opt.id}
                  className={`block border p-3 rounded-lg cursor-pointer transition-all shadow-sm ${
                    answers[currentQuestion.id]?.optionId === opt.id
                      ? "bg-primary-darker text-white border-primary-darker scale-105"
                      : "bg-white text-primary-dark border-primary-light hover:bg-primary-light"
                  }`}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={opt.id}
                    className="hidden"
                    onChange={() =>
                      handleAnswerSelect(currentQuestion.id, opt.id)
                    }
                  />
                  <span className="font-bold mr-2 text-highlight-text">
                    {optionLabels[index]}.
                  </span>
                  {opt.description}
                </label>
              ))}
            </div>
          </div>
        )}

        {currentQuestion?.questionType === "ESSAY" && (
          <div>
            <p
              className={`p-6 bg-white rounded-lg shadow-md border border-gray-200 ${!hasFile ? "mb-4" : ""}`}
            >
              Yêu cầu:{" "}
              <span className="text-primary-dark">
                {currentQuestion?.description}
              </span>
            </p>

            {hasFile && (
              <div className="p-6 bg-primary-light border border-primary-darkest rounded-lg shadow-md mt-2 mb-6">
                <h4 className="text-xl font-semibold text-primary-darker mb-3">
                  📄 Tệp bài tập
                </h4>
                <Button
                  onClick={() =>
                    downloadFile(
                      currentQuestion?.fileName || "default.txt",
                      currentQuestion?.id,
                    )
                  }
                  className="px-4 py-2 bg-primary-darker text-white font-medium rounded-md transition-all duration-300 ease-in-out shadow-md hover:bg-hover-primary hover:text-primary-darkest"
                >
                  ⬇ Bấm vào đây để tải file về
                </Button>
              </div>
            )}

            {/* Answer input */}
            <div className="space-y-4">
              {answers[currentQuestion.id]?.content && !isEditing ? (
                <div className="mt-6 mb-6 p-6 bg-gray-50 rounded-lg border border-gray-300 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">
                    ✍ Câu trả lời của bạn:
                  </h4>
                  <p className="text-gray-800">
                    {answers[currentQuestion.id]?.content}
                  </p>

                  {(answers[currentQuestion.id]?.files ?? []).length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {answers[currentQuestion.id]?.files?.map(
                        (file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all"
                          >
                            <FaFileAlt className="text-gray-500 text-lg" />
                            <span className="text-sm font-medium truncate max-w-[150px]">
                              {file.name}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex gap-3">
                    <Button
                      className="px-4 py-2 bg-primary-dark text-white rounded-md shadow-md hover:bg-primary-darker transition-all"
                      onClick={() => setIsEditing(true)}
                    >
                      ✏ Chỉnh sửa
                    </Button>
                    <Button
                      className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-primary-darkest transition-all"
                      onClick={() => handleDeleteAnswer(currentQuestion.id)}
                    >
                      🗑 Xóa câu trả lời
                    </Button>
                  </div>
                </div>
              ) : isEditing ? (
                <ChatInput
                  currentQuestionId={currentQuestion.id}
                  initialMessage={answers[currentQuestion.id]?.content || ""}
                  initialAttachments={answers[currentQuestion.id]?.files || []}
                  onSendMessage={(questionId, message) => {
                    handleAnswerChange(questionId, message);
                    setIsEditing(false);
                  }}
                />
              ) : (
                <ChatInput
                  currentQuestionId={currentQuestion.id}
                  initialMessage=""
                  initialAttachments={[]}
                  onSendMessage={(questionId, message) =>
                    handleAnswerChange(questionId, message)
                  }
                />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 bg-primary-light text-primary-dark rounded-lg shadow-md hover:bg-hover-primary transition-all"
          onClick={() =>
            currentQuestionIndex > 0 &&
            setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
          }
        >
          Trước
        </button>
        <button
          className="px-4 py-2 bg-primary-darker text-white rounded-lg shadow-md hover:bg-primary-darkest transition-all"
          onClick={() => {
            if (currentQuestionIndex === questionsLength - 1) {
              handleSubmitAssignment();
            } else {
              setCurrentQuestionIndex((prev) =>
                Math.min(prev + 1, questionsLength - 1),
              );
            }
          }}
        >
          {currentQuestionIndex === questionsLength - 1
            ? "Hoàn thành"
            : "Tiếp theo"}
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
