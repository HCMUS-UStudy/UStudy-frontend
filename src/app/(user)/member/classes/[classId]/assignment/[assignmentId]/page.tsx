/* eslint-disable @typescript-eslint/no-explicit-any */
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
import BlockingOverlay from "@/app/ui/components/user/student/classes/assignment/BlockingOverlay";
import ConfirmModal from "@/app/ui/components/_common/ConfirmModal";

// Key for session storage to track assignment attempt
const ASSIGNMENT_ATTEMPT_KEY = "assignment_attempt_active";
const ASSIGNMENT_ID_KEY = "current_assignment_id";

const AssignmentPage = () => {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params?.assignmentId as string;
  const searchParams = useSearchParams();
  const duration = searchParams?.get("duration");

  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [questions, setQuestions] = useState<QnA[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // const [selectedAnswers, setSelectedAnswers] = useState<{
  //   [key: string]: string;
  // }>({});
  const [selectedQuestion, setSelectedQuestion] = useState<QnA | null>(null);

  const [fileNames, setFileNames] = useState<string[]>([]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);

  // Check if browser supports fullscreen API
  const isFullScreenAPISupported = () => {
    return (
      document.fullscreenEnabled ||
      (document as any).webkitFullscreenEnabled ||
      (document as any).mozFullScreenEnabled ||
      (document as any).msFullscreenEnabled
    );
  };

  // Block keyboard shortcuts
  const blockKeyboardShortcuts = (e: KeyboardEvent) => {
    // Block F11, Esc, Alt+Tab, etc.
    if (
      e.key === "F11" ||
      e.key === "Escape" ||
      (e.altKey && e.key === "Tab") ||
      (e.ctrlKey && e.key.toLowerCase() === "f")
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  // Fullscreen entry component
  const FullscreenEntry = React.memo(
    ({ onEnterFullscreen }: { onEnterFullscreen: () => void }) => {
      const buttonRef = React.useRef<HTMLButtonElement>(null);

      // Auto-focus the button when component mounts or updates
      React.useEffect(() => {
        if (buttonRef.current) {
          buttonRef.current.focus();
        }
      }, []);

      // Handle keyboard events
      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEnterFullscreen();
        }
      };

      return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Chuẩn bị làm bài
            </h2>
            <p className="text-gray-600 mb-6">
              Vui lòng bật chế độ toàn màn hình để bắt đầu làm bài.
            </p>
            <button
              ref={buttonRef}
              onClick={onEnterFullscreen}
              onKeyDown={handleKeyDown}
              className="px-6 py-3 bg-primary-dark text-white rounded-lg font-medium hover:bg-primary-light transition-colors focus:outline-none focus:ring-2 focus:ring-primary-lighter focus:ring-offset-2"
              autoFocus
            >
              Bật chế độ toàn màn hình
            </button>
          </div>
        </div>
      );
    },
  );

  // Add display name for better debugging
  FullscreenEntry.displayName = "FullscreenEntry";

  // Request fullscreen
  const requestFullScreen = async () => {
    try {
      const element = document.documentElement;

      // Add event listeners to prevent exiting
      document.addEventListener("keydown", blockKeyboardShortcuts, true);

      // Try to enter fullscreen
      const fullscreenPromise = (
        element.requestFullscreen ||
        (element as any).webkitRequestFullscreen ||
        (element as any).mozRequestFullScreen ||
        (element as any).msRequestFullscreen
      )?.call(element);

      if (fullscreenPromise) {
        await fullscreenPromise.catch((err) => {
          console.warn("Fullscreen request failed:", err);
          return Promise.resolve();
        });
      }

      setIsFullScreen(true);
      setShowFullscreenWarning(false);
      return true;
    } catch (err) {
      console.warn("Error in fullscreen request:", err);
      return false;
    }
  };

  // Exit fullscreen
  const exitFullScreen = async () => {
    try {
      const doc = document as any;
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
    } catch (err) {
      console.warn("Error exiting fullscreen:", err);
    }
  };

  // Check fullscreen state
  const checkFullScreen = () => {
    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );

    // If we were in fullscreen but now we're not
    if (isFullScreen && !isCurrentlyFullscreen) {
      setShowFullscreenWarning(true);
      // Remove keyboard shortcuts when not in fullscreen
      document.removeEventListener("keydown", blockKeyboardShortcuts, true);
      // Force exit fullscreen to ensure consistent state
      if (document.fullscreenElement) {
        exitFullScreen();
      }
    }

    setIsFullScreen(isCurrentlyFullscreen);
    return isCurrentlyFullscreen;
  };

  // Set up event listeners for fullscreen changes
  useEffect(() => {
    if (!isFullScreenAPISupported()) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // When tab becomes visible, check fullscreen state
        const isInFullscreen = checkFullScreen();
        if (!isInFullscreen) {
          setShowFullscreenWarning(true);
        }
      }
    };

    const handleFocus = () => {
      // When window regains focus, check fullscreen state
      const isInFullscreen = checkFullScreen();
      if (!isInFullscreen) {
        setShowFullscreenWarning(true);
      }
    };

    // Add event listeners
    document.addEventListener("fullscreenchange", checkFullScreen);
    document.addEventListener("webkitfullscreenchange", checkFullScreen);
    document.addEventListener("mozfullscreenchange", checkFullScreen);
    document.addEventListener("MSFullscreenChange", checkFullScreen);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    // Request fullscreen when component mounts
    requestFullScreen();

    // Cleanup function
    return () => {
      document.removeEventListener("fullscreenchange", checkFullScreen);
      document.removeEventListener("webkitfullscreenchange", checkFullScreen);
      document.removeEventListener("mozfullscreenchange", checkFullScreen);
      document.removeEventListener("MSFullscreenChange", checkFullScreen);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("keydown", blockKeyboardShortcuts, true);
    };
  }, []);

  // Effect to handle fullscreen warning
  useEffect(() => {
    if (showFullscreenWarning) {
      // Only disable pointer events for elements behind the modal
      const mainContent = document.querySelector("main");
      if (mainContent) {
        mainContent.style.pointerEvents = "none";
      }
    } else {
      const mainContent = document.querySelector("main");
      if (mainContent) {
        mainContent.style.pointerEvents = "auto";
      }
    }

    // Cleanup function
    return () => {
      const mainContent = document.querySelector("main");
      if (mainContent) {
        mainContent.style.pointerEvents = "auto";
      }
    };
  }, [showFullscreenWarning]);

  // Handle fullscreen entry button click
  const handleFullscreenClick = async () => {
    try {
      setShowFullscreenWarning(false);
      const success = await requestFullScreen();
      if (success) {
        // Re-add keyboard shortcuts when entering fullscreen
        document.addEventListener("keydown", blockKeyboardShortcuts, true);
      } else {
        // If fullscreen request fails, show warning again
        setShowFullscreenWarning(true);
      }
    } catch (error) {
      console.warn("Error in handleFullscreenClick:", error);
      setShowFullscreenWarning(true);
    }
  };

  useEffect(() => {
    // Hàm xử lý sự kiện beforeunload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    // Hàm xử lý sự kiện keydown để ngăn phím tắt
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ngăn Ctrl+T, Ctrl+N, Ctrl+Shift+N, F5, Ctrl+R, Ctrl+Tab, Alt+Tab
      if (
        (e.ctrlKey && ["t", "T", "n", "N", "Tab"].includes(e.key)) ||
        e.key === "F5" ||
        (e.ctrlKey && e.key === "r") ||
        (e.altKey && e.key === "Tab")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Thêm các event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown, { capture: true });

    // Cleanup function
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    if (currentQuestionIndex === questions.length - 1) {
      setShowReview(true);
    }
  }, [currentQuestionIndex, questions.length]);

  // Check for existing assignment attempt on mount
  useEffect(() => {
    const checkExistingAttempt = () => {
      const existingAttempt = sessionStorage.getItem(ASSIGNMENT_ATTEMPT_KEY);
      const existingAssignmentId = sessionStorage.getItem(ASSIGNMENT_ID_KEY);

      if (
        existingAttempt === "true" &&
        existingAssignmentId &&
        existingAssignmentId !== assignmentId
      ) {
        // Another assignment is already in progress
        alert(
          "Bạn đang có bài kiểm tra khác đang mở. Vui lòng hoàn thành hoặc đóng bài kiểm tra đó trước.",
        );
        router.push(`/member/classes/${params.classId}/assignment`);
        return false;
      }

      // Mark this assignment as active
      sessionStorage.setItem(ASSIGNMENT_ATTEMPT_KEY, "true");
      sessionStorage.setItem(ASSIGNMENT_ID_KEY, assignmentId);
      return true;
    };

    if (!checkExistingAttempt()) {
      return;
    }

    const fetchQuestions = async () => {
      try {
        const response = await getQnAListByAssignmentId(assignmentId, 0, 100);
        setQuestions(response.content || []);
        setFileNames(
          response.content.map((q: QnA) =>
            q.fileName && q.fileName.trim() !== "" ? q.fileName : "",
          ),
        );
        setTimeLeft(Number(duration));
        // Enable full screen mode when questions are loaded
        setIsFullScreen(true);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();

    // Clean up on unmount
    return () => {
      if (!isSubmit) {
        sessionStorage.removeItem(ASSIGNMENT_ATTEMPT_KEY);
        sessionStorage.removeItem(ASSIGNMENT_ID_KEY);
      }
    };
  }, [assignmentId, duration, isSubmit, params.classId, router]);

  // Prevent tab switching and show warning
  // State for violation modal
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [violationMessage, setViolationMessage] = useState("");
  const [isModalConfirmed, setIsModalConfirmed] = useState(false);
  const [isCheckingViolation, setIsCheckingViolation] = useState(false);

  useEffect(() => {
    if (!isFullScreen) return;

    const handleViolation = (message: string) => {
      if (!isCheckingViolation) {
        setIsCheckingViolation(true);
        setViolationMessage(message);
        setShowViolationModal(true);
        // Force focus back to the test
        window.focus();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !isModalConfirmed) {
        // User switched tabs or minimized window
        handleViolation(
          "Vui lòng không chuyển tab trong khi làm bài kiểm tra!",
        );
      }
    };

    const handleBlur = () => {
      // Show warning when window loses focus
      if (!isModalConfirmed) {
        handleViolation(
          "Vui lòng không chuyển cửa sổ trong khi làm bài kiểm tra!",
        );
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      // Prevent right-click context menu
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("contextmenu", handleContextMenu);

    // Timer for the test
    let timer: NodeJS.Timeout;
    if (Number(duration) > 0 && timeLeft > 0 && !showResult) {
      timer = setInterval(
        () =>
          setTimeLeft((prev) => {
            // Only decrement if timeLeft is greater than 0
            if (prev > 0) {
              return prev - 1;
            }
            return 0; // Keep it at 0 if it reaches 0
          }),
        1000,
      );
    }

    // Clean up
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [
    timeLeft,
    showResult,
    handleSubmitAssignment,
    duration,
    isFullScreen,
    isModalConfirmed,
    isCheckingViolation,
  ]);

  const handleViolationConfirm = () => {
    setShowViolationModal(false);
    setIsModalConfirmed(true);
    // Allow some time before resetting the confirmation state
    setTimeout(() => {
      setIsModalConfirmed(false);
      setIsCheckingViolation(false);
    }, 1000);
  };

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
    setIsBlocking(true); // Block UI during submission

    // Release the assignment lock when submitting
    sessionStorage.removeItem(ASSIGNMENT_ATTEMPT_KEY);
    sessionStorage.removeItem(ASSIGNMENT_ID_KEY);

    // Exit fullscreen when submitting
    try {
      await exitFullScreen();
      setIsFullScreen(false);
      setShowFullscreenWarning(false); // Hide the fullscreen warning
    } catch (error) {
      console.warn("Error exiting fullscreen:", error);
      setIsFullScreen(false);
      setShowFullscreenWarning(false); // Ensure warning is hidden even if fullscreen exit fails
    }

    // Remove keyboard shortcuts
    document.removeEventListener("keydown", blockKeyboardShortcuts, true);

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

    setIsLoading(true);
    try {
      // Call createNewSubmission with correctly formatted body
      const result = await createNewSubmission(assignmentId as string, body);

      if (result?.statusCode === "CREATED") {
        addToast.success("Bài tập đã nộp thành công:", result);
        setModalOpen(true);
      } else {
        addToast.error("Nộp bài thất bại!");
      }
    } catch (error) {
      console.error("Error submitting Asssignment:", error);
      addToast.error("Đã xảy ra lỗi khi nộp bài. Vui lòng thử lại!");
    } finally {
      setIsLoading(false); // Disable loading after the result
      setIsBlocking(false); // Unblock UI after submission is complete
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

  // Fullscreen warning modal
  const FullscreenWarningModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Cảnh báo</h2>
        <p className="mb-6">
          Vui lòng bật chế độ toàn màn hình để tiếp tục làm bài.
        </p>
        <div className="flex justify-end">
          <button
            onClick={requestFullScreen}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Bật toàn màn hình
          </button>
        </div>
      </div>
    </div>
  );

  if (isModalOpen) {
    return (
      <div className="relative min-h-screen bg-gray-50">
        <ScoreModal
          assignmentId={assignmentId}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    );
  }

  // Show fullscreen entry screen if not in fullscreen and not submitted
  if (!isFullScreen && !isSubmit) {
    return <FullscreenEntry onEnterFullscreen={handleFullscreenClick} />;
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <ConfirmModal
        isOpen={showViolationModal}
        onClose={handleViolationConfirm}
        onConfirm={handleViolationConfirm}
        title="Cảnh báo"
        message={violationMessage}
        type="warning"
        confirmText="Tôi đã hiểu"
      />
      {showFullscreenWarning && <FullscreenWarningModal />}
      <div className="flex-1 overflow-auto flex items-center justify-center min-h-[calc(100vh-64px)]">
        {isLoading && <LoadingOverlay />}
        <BlockingOverlay
          isVisible={isBlocking}
          message="Đang xử lý, vui lòng đợi trong giây lát..."
        />
        {showFullscreenWarning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
        )}

        {!isSubmit && (
          <div className="flex w-full max-w-6xl gap-6 mx-4 p-6 bg-white rounded-lg shadow-lg">
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
              {...(timeLeft === 0 && { isUnlimitedTime: true })}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentPage;
