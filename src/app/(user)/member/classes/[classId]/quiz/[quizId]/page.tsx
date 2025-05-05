// "use client";
// import { getQnAListByAssignmentId } from "@/app/lib/services/question";
// import { getDetailQuiz, submitQuiz } from "@/app/lib/services/quiz";
// import { QnA } from "@/app/types";
// import QuizLoading from "@/app/ui/components/_common/loading/QuizLoading";
// import ScoreModal from "@/app/ui/components/user/student/classes/quiz/ScoreModal";
// import { useParams, useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import {
//   FaChevronLeft,
//   FaChevronRight,
//   FaClock,
//   FaCheckCircle,
// } from "react-icons/fa";

// const QuizPage = () => {
//   const params = useParams();
//   const router = useRouter();
//   const { assignmentId } = params;
//   const [isLoading, setIsLoading] = useState(false);
//   const [showResult, setShowResult] = useState(false);
//   const [showReview, setShowReview] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(0);

//   const [questions, setQuestions] = useState<QnA[]>([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<{
//     [key: string]: string;
//   }>({});
//   const [selectedQuestion, setSelectedQuestion] = useState<QnA | null>(null);

//   const [isModalOpen, setModalOpen] = useState(false);
//   const [isSubmit, setIsSubmit] = useState(false);
//   const [finalScore, setFinalScore] = useState<number | null>(null);

//   // Hàm đóng modal
//   const closeModal = () => {
//     setModalOpen(false);
//     router.back(); // Trở về trang trước đó
//   };

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const response = await getQnAListByAssignmentId(
//           0,
//           100,
//           assignmentId as string,
//         );
//         setQuestions(response.content || []);
//         setTimeLeft((response.length || 0) * 60); // giả sử mỗi câu 1 phút
//       } catch (error) {
//         console.error("Failed to fetch questions:", error);
//       }
//     };
//     fetchQuestions();
//   }, [assignmentId]);

//   useEffect(() => {
//     if (timeLeft > 0 && !showResult) {
//       const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
//       return () => clearInterval(timer);
//     } else if (timeLeft === 0 && !showResult) {
//       handleSubmitQuiz();
//     }
//   }, [timeLeft, showResult]);

//   const handleAnswerSelect = (questionId: string, optionId: string) => {
//     setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
//     setTimeout(() => {
//       setCurrentQuestionIndex((prev) =>
//         Math.min(prev + 1, questions.length - 1),
//       );
//     }, 500);
//   };

//   const handleSubmitQuiz = () => {
//     if (currentQuestionIndex === questions.length - 1) {
//       setShowReview(true);
//     }
//   };

//   const handleFinishQuiz = async () => {
//     // if (!currentQuiz) return;
//     // setShowResult(true);
//     // setShowReview(false);
//     // setIsSubmit(true);
//     // const durationInMinutes = Math.round(
//     //   (questions.length * 60 - timeLeft) / 60,
//     // );
//     // const body = {
//     //   assignmentId: currentQuiz.id,
//     //   duration: durationInMinutes,
//     //   answers: questions.map((q) => ({
//     //     questionId: q.id,
//     //     optionId: selectedAnswers[q.id] || "",
//     //   })),
//     // };
//     // setIsLoading(true);
//     // try {
//     //   const result = await submitQuiz(body);
//     //   if (result?.statusCode === "OK") {
//     //     console.log("Quiz submitted successfully:", result);
//     //     setModalOpen(true);
//     //     setFinalScore(result.data.score); // Cập nhật điểm vào state
//     //   } else {
//     //     alert("Failed to submit quiz!");
//     //   }
//     // } catch (error) {
//     //   console.error("Error submitting quiz:", error);
//     //   alert("An error occurred while submitting the quiz. Please try again!");
//     // } finally {
//     //   setIsLoading(false); // Tắt loading sau khi có kết quả
//     // }
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
//   };

//   if (!questions) {
//     return <QuizLoading />;
//   }

//   const currentQuestion = questions[currentQuestionIndex];

//   const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

//   const optionLabels = ["A", "B", "C", "D", "E", "F"];

//   // Phần giao diện review
//   if (showReview) {
//     // Nếu có câu hỏi được chọn thì hiển thị giao diện chi tiết câu hỏi
//     if (selectedQuestion) {
//       return (
//         <div className="text-center py-8 bg-gray-50 min-h-screen">
//           <h3 className="text-3xl font-bold mb-6 text-primary-darkest">
//             📝 Chi tiết câu hỏi
//           </h3>
//           <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
//             <p className="font-semibold text-lg mb-4 text-gray-800">
//               Câu hỏi: {selectedQuestion.description}
//             </p>
//             <ul className="space-y-2 mb-6">
//               {selectedQuestion.options?.map((opt) => (
//                 <li
//                   key={opt.id}
//                   className={`p-2 rounded-md border ${
//                     selectedAnswers[selectedQuestion.id] === opt.id
//                       ? "bg-primary-lighter border-primary-light"
//                       : "bg-gray-50 border-gray-300"
//                   }`}
//                 >
//                   {opt.description}
//                 </li>
//               ))}
//             </ul>
//             <button
//               className="px-4 py-2 rounded-full bg-gray-300 text-gray-800 shadow-md hover:bg-gray-400 transition-colors"
//               onClick={() => setSelectedQuestion(null)}
//             >
//               🔙 Quay lại
//             </button>
//           </div>
//         </div>
//       );
//     }

//     // Giao diện xem lại câu trả lời
//     return (
//       <div className="text-center py-8 bg-gray-50 min-h-screen">
//         <h3 className="text-3xl font-bold mb-8 text-primary-darkest">
//           📝 Xem lại câu trả lời
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-10 auto-rows-fr">
//           {questions.map((q, index) => (
//             <div
//               key={q.id}
//               className={`p-5 rounded-xl shadow-lg transition-transform transform hover:scale-105 cursor-pointer flex h-full items-center justify-center text-center ${
//                 selectedAnswers[q.id] ? "bg-green-50" : "bg-red-50"
//               }`}
//               onClick={() => setSelectedQuestion(q)}
//             >
//               <div className="flex-1 flex flex-col justify-center items-center">
//                 <p className="font-semibold text-lg text-gray-800">
//                   Câu {index + 1}: {q.description}
//                 </p>
//                 <p
//                   className={`pt-4 text-base ${
//                     selectedAnswers[q.id] ? "text-green-600" : "text-red-600"
//                   }`}
//                 >
//                   {selectedAnswers[q.id]
//                     ? `Đã trả lời: ${
//                         q.options?.find(
//                           (opt) => opt.id === selectedAnswers[q.id],
//                         )?.description
//                       }`
//                     : "Chưa trả lời"}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-center gap-6">
//           <button
//             className="px-6 py-2 rounded-full bg-gray-300 text-gray-800 shadow-md hover:bg-gray-400 transition-colors transform hover:scale-105"
//             onClick={() => setShowReview(false)}
//           >
//             🔙 Trở về
//           </button>
//           <button
//             className="px-6 py-2 rounded-full bg-primary-dark text-white shadow-md hover:bg-hover-primary transition-colors transform hover:scale-105"
//             onClick={handleFinishQuiz}
//           >
//             📤 Nộp bài
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // if (isModalOpen) {
//   //   return (
//   //     <ScoreModal
//   //       assignmentId={assignmentId as string}
//   //       isOpen={isModalOpen}
//   //       score={finalScore}
//   //       onClose={closeModal}
//   //     />
//   //   );
//   // }

//   return (
//     <div className="flex flex-col items-center justify-center py-2">
//       {isLoading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="flex flex-col items-center justify-center">
//             <svg
//               className="animate-spin h-12 w-12 text-white mb-4"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               ></circle>
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//               ></path>
//             </svg>
//             <p className="text-white text-lg">Đang nộp bài, vui lòng đợi...</p>
//           </div>
//         </div>
//       )}

//       {!isSubmit && (
//         <div className="flex w-full max-w-6xl gap-6">
//           {/* Quiz Content */}
//           <div className="bg-primary-lighter shadow-lg rounded-3xl max-w-4xl w-full p-8 backdrop-blur-md border border-primary-light">
//             <h3 className="text-3xl font-bold mb-6 text-center text-primary-darkest">
//               {currentQuestion?.description}
//             </h3>

//             <div className="flex justify-between items-center mb-4">
//               <span className="text-sm text-highlight-text">
//                 Câu {currentQuestionIndex + 1}/{questions.length}
//               </span>
//             </div>

//             <div className="w-full bg-primary-light rounded-full h-2 mb-6">
//               <div
//                 className="bg-primary-darker h-2 rounded-full transition-all duration-500"
//                 style={{ width: `${progress}%` }}
//               ></div>
//             </div>

//             <div>
//               <p className="text-lg text-highlight-text mb-4">
//                 Câu hỏi: {currentQuestion.description}
//               </p>
//               <div className="space-y-3 mb-6">
//                 {currentQuestion.options?.map((opt, index) => (
//                   <label
//                     key={opt.id}
//                     className={`block border p-3 rounded-lg cursor-pointer transition-all shadow-sm ${
//                       selectedAnswers[currentQuestion.id] === opt.id
//                         ? "bg-primary-darker text-white border-primary-darker scale-105"
//                         : "bg-white text-primary-dark border-primary-light hover:bg-primary-light"
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name={currentQuestion.id}
//                       value={opt.id}
//                       className="hidden"
//                       onChange={() =>
//                         handleAnswerSelect(currentQuestion.id, opt.id)
//                       }
//                     />
//                     <span className="font-bold mr-2 text-highlight-text">
//                       {optionLabels[index]}.
//                     </span>
//                     {opt.description}
//                   </label>
//                 ))}
//               </div>

//               <div className="flex justify-between">
//                 <button
//                   className="px-4 py-2 bg-primary-light text-primary-dark rounded-lg shadow-md hover:bg-hover-primary transition-all flex items-center"
//                   onClick={() =>
//                     setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
//                   }
//                 >
//                   <FaChevronLeft className="mr-1" />
//                   Trước
//                 </button>
//                 <button
//                   className="px-4 py-2 bg-primary-darker text-white rounded-lg shadow-md hover:bg-primary-darkest transition-all flex items-center"
//                   onClick={() => {
//                     if (currentQuestionIndex === questions.length - 1) {
//                       handleFinishQuiz();
//                     } else {
//                       setCurrentQuestionIndex((prev) =>
//                         Math.min(prev + 1, questions.length - 1),
//                       );
//                     }
//                   }}
//                 >
//                   {currentQuestionIndex === questions.length - 1
//                     ? "Hoàn thành"
//                     : "Tiếp theo"}
//                   <FaChevronRight className="ml-1" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Quiz Navigation */}
//           <div className="w-1/4 bg-primary-lighter shadow-lg rounded-3xl p-6 backdrop-blur-md border border-primary-light">
//             <div className="flex items-center justify-center text-sm text-highlight-text mb-4 bg-primary-light py-2 rounded-md">
//               <FaClock className="mr-2 text-highlight-text" />
//               <span>{formatTime(timeLeft)}</span>
//             </div>
//             <h4 className="text-xl font-bold mb-4 text-center text-primary-darkest">
//               Danh sách câu hỏi
//             </h4>
//             <div className="grid grid-cols-4 gap-3">
//               {questions.map((_, index) => (
//                 <button
//                   key={index}
//                   className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
//                     selectedAnswers[questions[index].id]
//                       ? "bg-primary-darker text-white"
//                       : "bg-primary-light text-primary-dark hover:bg-hover-primary"
//                   }`}
//                   onClick={() => setCurrentQuestionIndex(index)}
//                 >
//                   {selectedAnswers[questions[index].id] && (
//                     <FaCheckCircle className="text-white mr-1" />
//                   )}
//                   {index + 1}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizPage;
