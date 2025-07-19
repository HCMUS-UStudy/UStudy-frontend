"use client";
import { useRouter, useParams } from "next/navigation";
import { IoReturnUpBack } from "react-icons/io5";
import { useState } from "react";
import { getDetailAssignment } from "@/app/lib/services/assignment";
import { AssignmentItem, Question } from "@/app/types";
import { useQueries } from "@tanstack/react-query";
import { getQnAListByAssignmentId } from "@/app/lib/services/question";
import Loading from "@/app/ui/components/_common/loading/Loading";

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAssignmentFormat = (format: string) => {
  switch (format) {
    case "MULTIPLE_CHOICE":
    case "multiple_choice":
      return "Trắc nghiệm";
    case "ESSAY":
    case "essay":
      return "Tự luận";
    case "MIXED":
    case "mixed":
      return "Tổng hợp";
    default:
      return format;
  }
};

const formatAssignmentMode = (mode: string) => {
  switch (mode) {
    case "PRACTICE":
    case "practice":
      return "Luyện tập";
    case "TEST":
    case "test":
      return "Kiểm tra";
    default:
      return mode;
  }
};

const formatDuration = (seconds: number) => {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h} giờ${m > 0 ? ` ${m} phút` : ""}`;
  } else if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} phút${s > 0 ? ` ${s} giây` : ""}`;
  } else {
    return `${seconds} giây`;
  }
};

const AssignmentPage = () => {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params?.assignmentId as string;

  const [openIdxs, setOpenIdxs] = useState<number[]>([]);

  const results = useQueries({
    queries: [
      {
        queryKey: ["assignment-detail", assignmentId],
        queryFn: () => getDetailAssignment(assignmentId),
        enabled: !!assignmentId,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["assignment-questions", assignmentId],
        queryFn: () => getQnAListByAssignmentId(assignmentId),
        enabled: !!assignmentId,
        refetchOnWindowFocus: false,
      },
    ],
  });

  if (results.some((result) => result.isLoading)) {
    return (
      <div className="flex mt-10 justify-center">
        <Loading />
      </div>
    );
  }
  const data = results[0].data.assignment as AssignmentItem;
  const subcount = results[0].data.subCount;
  const questions = (results[1].data.content as Question[]) || [];
  const totalScore = questions.reduce((sum, q) => sum + (q.score || 0), 0);

  return (
    <div className="p-4">
      <button
        className="mb-4 px-2 py-1 rounded-lg hover:bg-primary-lighter text-primary-darkest border border-gray-200"
        onClick={() => router.back()}
      >
        <IoReturnUpBack className="inline-block mr-2" />
        Trở về
      </button>

      <div className="px-4">
        <h1 className="text-2xl text-primary-darker font-bold mb-3">
          {data.title}
        </h1>
        <div className="flex gap-6 mb-4 text-primary-darkest">
          <span>Đã nộp: {subcount}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <span className="font-semibold">Thời lượng:</span>{" "}
            {formatDuration(data.duration)}
          </div>
          <div>
            <span className="font-semibold">Thời gian bắt đầu:</span>{" "}
            {formatDateTime(data.startTime)}
          </div>
          <div>
            <span className="font-semibold">Hình thức:</span>{" "}
            {formatAssignmentFormat(data.format)}
          </div>
          <div>
            <span className="font-semibold">Thời gian kết thúc:</span>{" "}
            {formatDateTime(data.endTime)}
          </div>
          <div>
            <span className="font-semibold">Chế độ:</span>{" "}
            {formatAssignmentMode(data.mode)}
          </div>
          <div>
            <span className="font-semibold">Số lần làm tối đa:</span>{" "}
            {data.numAttempts}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-primary-darker">
              Danh sách câu hỏi
            </h2>
            <div className="mb-2 mr-3 text-base text-primary-darker font-semibold">
              Tổng điểm: {totalScore}
            </div>
          </div>
          {questions.length === 0 ? (
            <div className="text-gray-500">Chưa có câu hỏi nào.</div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, idx) => {
                const isOpen = openIdxs.includes(idx);
                return (
                  <div key={q.id} className="border rounded-lg">
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-primary-lighter focus:outline-none"
                      onClick={() => {
                        setOpenIdxs((prev) =>
                          isOpen
                            ? prev.filter((i) => i !== idx)
                            : [...prev, idx],
                        );
                      }}
                    >
                      <span>
                        Câu {idx + 1}: {q.description}
                        <span className="ml-3 text-xs text-gray-500">
                          {q.questionType === "MULTIPLE_CHOICE"
                            ? "Trắc nghiệm"
                            : q.questionType === "ESSAY"
                              ? "Tự luận"
                              : q.questionType}
                        </span>
                      </span>
                      <div className="flex items-center">
                        <span className="ml-2 text-sm">{q.score}đ</span>
                        <svg
                          className={`ml-2 w-4 h-4 transition-transform ${
                            isOpen ? "rotate-90" : "rotate-0"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 mt-2">
                        {q.fileName && (
                          <div className="flex gap-2">
                            File đính kèm:{" "}
                            <span className="text-primary-darkest cursor-pointer underline">
                              {q.fileName}
                            </span>
                          </div>
                        )}
                        {q.questionType === "MULTIPLE_CHOICE" &&
                          q.options &&
                          q.options.length > 0 && (
                            <div>
                              <ul className="list-none pl-0">
                                {q.options.map((opt, i) => (
                                  <li
                                    key={i}
                                    className={
                                      opt.isCorrect
                                        ? "text-primary-darkest font-semibold"
                                        : ""
                                    }
                                  >
                                    <span className="inline-block w-6 font-bold">
                                      {String.fromCharCode(65 + i)}.
                                    </span>{" "}
                                    {opt.description}{" "}
                                    {opt.isCorrect && (
                                      <span className="ml-2 text-xs text-primary-dark">
                                        Đáp án đúng
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        {q.questionType === "ESSAY" && q.scoringCriteria && (
                          <div className="flex gap-2">
                            Tiêu chí chấm điểm:{" "}
                            <span className="text-primary-darkest">
                              {q.scoringCriteria}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;
