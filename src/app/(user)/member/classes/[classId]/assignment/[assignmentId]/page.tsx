"use client";
import {
  getQnAListByAssignmentId,
  handleDownloadFile,
} from "@/app/lib/services/question";
import { createNewSubmission } from "@/app/lib/services/submission";
import { QnA } from "@/app/types";
import QuizLoading from "@/app/ui/components/_common/loading/QuizLoading";
import LoadingOverlay from "@/app/ui/components/user/student/classes/assignment/LoadingOverlay";
import QuestionCard from "@/app/ui/components/user/student/classes/assignment/QuestionCard";
import QuestionReview from "@/app/ui/components/user/student/classes/assignment/QuestionReview";
import QuestionSidebar from "@/app/ui/components/user/student/classes/assignment/QuestionSidebar";
import ReviewAnswers from "@/app/ui/components/user/student/classes/assignment/ReviewAnswers";
import ScoreModal from "@/app/ui/components/user/student/classes/quiz/ScoreModal";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useCustomToast } from "@/app/lib/hooks/useToast";

const AssignmentPage = () => {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params?.assignmentId;
  const searchParams = useSearchParams();
  const duration = searchParams?.get("duration");

  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const [questions, setQuestions] = useState<QnA[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // const [selectedAnswers, setSelectedAnswers] = useState<{
  //   [key: string]: string;
  // }>({});
  const [selectedQuestion, setSelectedQuestion] = useState<QnA | null>(null);

  const [fileNames, setFileNames] = useState<string[]>([]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<{ [key: string]: File[] }>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<{
    [questionId: string]: {
      optionId?: string; // dành cho trắc nghiệm
      content?: string; // dành cho tự luận
      files?: File[]; // đính kèm
    };
  }>({});
  // const [submissionDetail, setSubmissionDetail] = useState<SubmissionDetail[]>(
  //   [],
  // );

  const { addToast } = useCustomToast();

  // Hàm đóng modal
  const closeModal = () => {
    setModalOpen(false);
    router.back(); // Trở về trang trước đó
  };

  const handleSubmitAssignment = useCallback(() => {
    console.log(answers);
    console.log(attachments);

    if (currentQuestionIndex === questions.length - 1) {
      setShowReview(true);
    }
  }, [answers, attachments, currentQuestionIndex, questions.length]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getQnAListByAssignmentId(
          assignmentId as string,
          0,
          100,
        );
        setQuestions(response.content || []);
        setFileNames(
          response.content.map((q: QnA) =>
            q.fileName && q.fileName.trim() !== "" ? q.fileName : "",
          ),
        );
        setTimeLeft(Number(duration)); // giả sử mỗi câu 1 phút
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };
    fetchQuestions();
  }, [assignmentId, duration, handleSubmitAssignment]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleSubmitAssignment();
    }
  }, [timeLeft, showResult, handleSubmitAssignment]);

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setSubmittedAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        optionId,
      },
    }));
    setTimeout(() => {
      setCurrentQuestionIndex((prev) =>
        Math.min(prev + 1, questions.length - 1),
      );
    }, 500);
  };

  const handleFinishAssignment = async () => {
    if (!currentQuestion) return;
    setShowResult(true);
    setShowReview(false);
    setIsSubmit(true);

    // const durationInMinutes = Math.round(
    //   (questions.length * 60 - timeLeft) / 60,
    // );

    const body = {
      duration: timeLeft,
      answers: questions.map((q) => ({
        questionId: q.id,
        optionId: submittedAnswers[q.id].optionId || "",
        content: submittedAnswers[q.id]?.content || "",
        files: submittedAnswers[q.id]?.files || [], // Attach files if any
      })),
    };

    console.log(JSON.stringify(body, null, 2));

    setIsLoading(true);
    try {
      // Call createNewSubmission with correctly formatted body
      const result = await createNewSubmission(assignmentId as string, body);

      if (result?.statusCode === "CREATED") {
        console.log("Asssignment submitted successfully:", result);
        setModalOpen(true);
      } else {
        addToast.error("Failed to submit Asssignment!");
      }
    } catch (error) {
      console.error("Error submitting Asssignment:", error);
      addToast.error(
        "An error occurred while submitting the Asssignment. Please try again!",
      );
    } finally {
      setIsLoading(false); // Disable loading after the result
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleAnswerChange = (
    questionId: string,
    message: {
      content: string;
      files: File[];
      deletedFileIds?: string[];
    },
  ) => {
    setAnswers((prev) => ({ ...prev, [questionId]: message.content }));
    setAttachments((prev) => ({ ...prev, [questionId]: message.files }));
    setSubmittedAnswers((prev) => ({ ...prev, [questionId]: message }));
  };

  const downloadFile = async (fileName: string, questionId: string) => {
    try {
      const response = await handleDownloadFile(questionId as string);
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Lỗi khi tải file:", error);
      addToast.error("Tải file thất bại!");
    }
  };

  const handleDeleteAnswer = (questionId: string) => {
    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });

    setAttachments((prev) => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });

    setSubmittedAnswers((prev) => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
  };

  if (!questions) {
    return <QuizLoading />;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentFileName = fileNames[currentQuestionIndex];
  const hasFile = Boolean(currentFileName && currentFileName.trim() !== "");

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const optionLabels = ["A", "B", "C", "D", "E", "F"];

  if (showReview) {
    if (selectedQuestion) {
      return (
        <QuestionReview
          selectedQuestion={selectedQuestion}
          answers={submittedAnswers}
          setSelectedQuestion={setSelectedQuestion}
        />
      );
    }

    // Giao diện xem lại câu trả lời
    return (
      <ReviewAnswers
        questions={questions}
        submittedAnswers={submittedAnswers}
        setSelectedQuestion={setSelectedQuestion}
        setShowReview={setShowReview}
        handleFinishAssignment={handleFinishAssignment}
      />
    );
  }

  if (isModalOpen) {
    return (
      <ScoreModal
        assignmentId={assignmentId as string}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-2">
      {isLoading && <LoadingOverlay />}

      {!isSubmit && (
        <div className="flex w-full max-w-6xl gap-6">
          <QuestionCard
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            questionsLength={questions.length}
            progress={progress}
            hasFile={hasFile}
            answers={submittedAnswers}
            optionLabels={optionLabels}
            handleAnswerSelect={handleAnswerSelect}
            handleAnswerChange={handleAnswerChange}
            downloadFile={downloadFile}
            handleDeleteAnswer={handleDeleteAnswer}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            handleSubmitAssignment={handleSubmitAssignment}
          />

          {/* Assignment Navigation */}
          <QuestionSidebar
            questions={questions}
            answers={submittedAnswers}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            timeLeft={timeLeft}
            formatTime={formatTime}
          />
        </div>
      )}
    </div>
  );
};

export default AssignmentPage;
