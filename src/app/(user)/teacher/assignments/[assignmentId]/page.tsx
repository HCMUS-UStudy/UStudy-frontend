"use client";
import { useRouter, useParams } from "next/navigation";
import { IoReturnUpBack } from "react-icons/io5";
import { useState, useEffect } from "react";
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
      },
      {
        queryKey: ["assignment-questions", assignmentId],
        queryFn: () => getQnAListByAssignmentId(assignmentId),
      },
    ],
  });

  // Mock submissions data
  const [submissions, setSubmissions] = useState([
    {
      id: "sub1",
      student: {
        id: "stu1",
        genId: "HS001",
        email: "hs1@example.com",
        name: "Nguyễn Văn A",
        gender: "MALE",
      },
      submissionDate: "2025-07-06T14:30:00Z",
      score: null,
      feedback: "",
      gradedBy: null,
    },
    {
      id: "sub2",
      student: {
        id: "stu2",
        genId: "HS002",
        email: "hs2@example.com",
        name: "Trần Thị B",
        gender: "FEMALE",
      },
      submissionDate: "2025-07-06T15:00:00Z",
      score: 8,
      feedback: "Làm tốt!",
      gradedBy: {
        id: "gv1",
        genId: "GV001",
        email: "gv1@example.com",
        name: "Thầy Cô Giáo",
        gender: "MALE",
      },
    },
  ]);

  // State for editing grading
  const [grading, setGrading] = useState<Record<string, any>>({});

  // Modal state
  const [gradingModal, setGradingModal] = useState<{
    open: boolean;
    subId: string | null;
    detail: any | null;
  }>({ open: false, subId: null, detail: null });

  // Mock API for submission detail
  const mockSubmissionDetails: Record<string, any> = {
    sub1: {
      assignmentId: "assignment-1",
      title: "Bài tập Toán",
      score: 7.5,
      feedback: "Bài làm ổn!",
      questions: [
        {
          questionId: "question-1",
          questionType: "MULTIPLE_CHOICE",
          description: "Nội dung câu hỏi 1",
          fileName: null,
          score: 1,
          isCorrect: true,
          selectedOption: {
            optionId: "option-1",
            description: "Đáp án 1",
            isCorrect: true,
          },
          correctOption: {
            optionId: "option-1",
            description: "Đáp án 1",
            isCorrect: true,
          },
          allOptions: [
            { optionId: "option-1", description: "Đáp án 1", isCorrect: true },
            { optionId: "option-2", description: "Đáp án 2", isCorrect: false },
            { optionId: "option-3", description: "Đáp án 3", isCorrect: false },
            { optionId: "option-4", description: "Đáp án 4", isCorrect: false },
          ],
        },
        {
          questionId: "question-2",
          questionType: "ESSAY",
          description: "Nội dung câu hỏi 2",
          fileName: null,
          score: 0.5,
          content: "Bài làm câu 2",
          files: [
            {
              id: "file-1",
              fileName: "file1.txt",
              filePath: "/path/to/file1.txt",
            },
          ],
        },
      ],
    },
    sub2: {
      assignmentId: "assignment-1",
      title: "Bài tập Toán",
      score: 8,
      feedback: "Làm tốt!",
      questions: [
        {
          questionId: "question-1",
          questionType: "MULTIPLE_CHOICE",
          description: "Nội dung câu hỏi 1",
          fileName: null,
          score: 1,
          isCorrect: true,
          selectedOption: {
            optionId: "option-1",
            description: "Đáp án 1",
            isCorrect: true,
          },
          correctOption: {
            optionId: "option-1",
            description: "Đáp án 1",
            isCorrect: true,
          },
          allOptions: [
            { optionId: "option-1", description: "Đáp án 1", isCorrect: true },
            { optionId: "option-2", description: "Đáp án 2", isCorrect: false },
            { optionId: "option-3", description: "Đáp án 3", isCorrect: false },
            { optionId: "option-4", description: "Đáp án 4", isCorrect: false },
          ],
        },
        {
          questionId: "question-2",
          questionType: "ESSAY",
          description: "Nội dung câu hỏi 2",
          fileName: null,
          score: 0.5,
          content: "Bài làm câu 2",
          files: [
            {
              id: "file-1",
              fileName: "file1.txt",
              filePath: "/path/to/file1.txt",
            },
          ],
        },
      ],
    },
  };

  function fetchSubmissionDetail(subId: string) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockSubmissionDetails[subId]), 400);
    });
  }

  useEffect(() => {
    if (gradingModal.open && gradingModal.subId) {
      fetchSubmissionDetail(gradingModal.subId).then((detail) => {
        setGradingModal((prev) => ({ ...prev, detail }));
      });
    }
  }, [gradingModal.open, gradingModal.subId]);

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
        <div className="flex gap-3 items-center justify-between">
          <h1 className="text-2xl text-primary-darker font-bold">
            {data.title}
          </h1>
          <button
            className="mb-4 ml-3 px-3 py-1 rounded-lg bg-primary-dark text-white hover:bg-primary-darker transition"
            onClick={() => router.push(`${assignmentId}/grading`)}
          >
            Chấm bài
          </button>
        </div>
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
            <h2 className="text-xl font-bold text-primary-darker">
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
                      <div className="px-4 pb-4 mt-1">
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

      {/* SUBMISSION GRADING SECTION */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-primary-darker mb-4">
          Danh sách bài nộp
        </h2>
        {submissions.length === 0 ? (
          <div className="text-gray-500">Chưa có học sinh nào nộp bài.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-primary-lighter">
                <tr>
                  <th className="px-3 py-2 border">STT</th>
                  <th className="px-3 py-2 border">Học sinh</th>
                  <th className="px-3 py-2 border">Ngày nộp</th>
                  <th className="px-3 py-2 border">Điểm</th>
                  <th className="px-3 py-2 border">Feedback</th>
                  <th className="px-3 py-2 border">Trạng thái</th>
                  <th className="px-3 py-2 border">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, idx) => (
                  <tr key={sub.id} className="text-center">
                    <td className="border px-2 py-1">{idx + 1}</td>
                    <td className="border px-2 py-1">{sub.student.name}</td>
                    <td className="border px-2 py-1">
                      {formatDateTime(sub.submissionDate)}
                    </td>
                    <td className="border px-2 py-1">
                      {grading[sub.id]?.editing ? (
                        <input
                          type="number"
                          min={0}
                          max={totalScore}
                          value={grading[sub.id]?.score ?? ""}
                          onChange={(e) =>
                            setGrading((g) => ({
                              ...g,
                              [sub.id]: {
                                ...g[sub.id],
                                score: e.target.value,
                              },
                            }))
                          }
                          className="w-16 border rounded px-1 text-center"
                        />
                      ) : sub.score !== null && sub.score !== undefined ? (
                        sub.score
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="border px-2 py-1">
                      {grading[sub.id]?.editing ? (
                        <input
                          type="text"
                          value={grading[sub.id]?.feedback ?? ""}
                          onChange={(e) =>
                            setGrading((g) => ({
                              ...g,
                              [sub.id]: {
                                ...g[sub.id],
                                feedback: e.target.value,
                              },
                            }))
                          }
                          className="border rounded px-1 w-32"
                        />
                      ) : sub.feedback ? (
                        sub.feedback
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="border px-2 py-1">
                      {sub.score !== null && sub.score !== undefined ? (
                        <span className="text-green-700 font-semibold">
                          Đã chấm
                        </span>
                      ) : (
                        <span className="text-yellow-700">Chưa chấm</span>
                      )}
                    </td>
                    <td className="border px-2 py-1">
                      {grading[sub.id]?.editing ? (
                        <>
                          <button
                            className="px-2 py-1 bg-primary-dark text-white rounded mr-1"
                            onClick={() => {
                              setGradingModal({
                                open: true,
                                subId: sub.id,
                                detail: null,
                              });
                            }}
                          >
                            Chấm chi tiết
                          </button>
                          <button
                            className="px-2 py-1 bg-gray-300 rounded"
                            onClick={() =>
                              setGrading((g) => ({
                                ...g,
                                [sub.id]: { editing: false },
                              }))
                            }
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <button
                          className="px-2 py-1 bg-primary-lighter rounded"
                          onClick={() =>
                            setGrading((g) => ({
                              ...g,
                              [sub.id]: {
                                editing: true,
                                score: sub.score ?? "",
                                feedback: sub.feedback ?? "",
                              },
                            }))
                          }
                        >
                          Chấm điểm
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grading Modal */}
      {gradingModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-primary-dark"
              onClick={() =>
                setGradingModal({ open: false, subId: null, detail: null })
              }
            >
              ×
            </button>
            {!gradingModal.detail ? (
              <div className="flex justify-center items-center h-40">
                <Loading />
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold mb-2">
                  Chấm bài: {gradingModal.detail.title}
                </h3>
                <div className="mb-2">
                  Tổng điểm:{" "}
                  <span className="font-semibold">
                    {gradingModal.detail.score}
                  </span>
                </div>
                <div className="mb-2">
                  Feedback:{" "}
                  <span className="font-semibold">
                    {gradingModal.detail.feedback}
                  </span>
                </div>
                <div className="mb-4">
                  {gradingModal.detail.questions.map((q: any, idx: number) => (
                    <div key={q.questionId} className="mb-4 border rounded p-3">
                      <div className="font-semibold mb-1">
                        Câu {idx + 1}: {q.description}
                      </div>
                      <div className="mb-1 text-xs text-primary-dark font-semibold">
                        {q.questionType === "MULTIPLE_CHOICE"
                          ? "Trắc nghiệm"
                          : q.questionType === "ESSAY"
                            ? "Tự luận"
                            : q.questionType}
                      </div>
                      {q.questionType === "MULTIPLE_CHOICE" && (
                        <div>
                          <div className="mb-1">
                            Đáp án đã chọn:{" "}
                            <span
                              className={
                                q.isCorrect ? "text-green-700" : "text-red-700"
                              }
                            >
                              {q.selectedOption?.description ?? "-"}
                            </span>
                          </div>
                          <div className="mb-1">
                            Đáp án đúng:{" "}
                            <span className="text-primary-darkest">
                              {q.correctOption?.description ?? "-"}
                            </span>
                          </div>
                          <div className="mb-1">
                            Tất cả đáp án:
                            <ul className="list-disc ml-6">
                              {q.allOptions?.map((opt: any) => (
                                <li
                                  key={opt.optionId}
                                  className={
                                    opt.isCorrect
                                      ? "font-semibold text-primary-dark"
                                      : ""
                                  }
                                >
                                  {opt.description}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      {q.questionType === "ESSAY" && (
                        <div>
                          <div className="mb-1">
                            Bài làm:{" "}
                            <span className="text-primary-darkest">
                              {q.content}
                            </span>
                          </div>
                          {q.files && q.files.length > 0 && (
                            <div className="mb-1">
                              File đính kèm:
                              <ul className="list-disc ml-6">
                                {q.files.map((f: any) => (
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
                      <div className="mt-2">
                        Điểm: <span className="font-semibold">{q.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentPage;
