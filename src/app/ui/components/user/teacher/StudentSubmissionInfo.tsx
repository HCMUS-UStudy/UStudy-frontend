import React, { useEffect, useState } from "react";
import { SubmissionDetail, SubmissionItem } from "@/app/types";
import { FaExclamationTriangle } from "react-icons/fa";

type StudentSubmissionInfoProps = {
  student: SubmissionItem["student"];
  submissionDetail: SubmissionDetail;
  onClose: () => void;
};

const StudentSubmissionInfo: React.FC<StudentSubmissionInfoProps> = ({
  student,
  submissionDetail,
  onClose,
}) => {
  const [questionsData, setQuestionsData] = useState(() =>
    submissionDetail.questions.filter((q) => q.questionType === "ESSAY"),
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const essayQuestions = submissionDetail.questions.filter(
      (q) => q.questionType === "ESSAY",
    );
    setQuestionsData(essayQuestions);
    setCurrentIndex(0);
  }, [submissionDetail]);

  if (!student || questionsData.length === 0) {
    return (
      <div className="col-span-2 bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center justify-center space-y-6 min-h-[300px] max-w-xl mx-auto">
        <FaExclamationTriangle className="text-6xl text-yellow-500" />
        <h3 className="text-2xl font-semibold text-gray-900 text-center">
          Thông tin bài làm
        </h3>
        <p className="text-gray-700 text-center">
          <strong>Học sinh:</strong>{" "}
          {student?.name || "Không có thông tin học sinh"}
        </p>
        <p className="text-center text-red-600 font-medium text-lg max-w-xs">
          Chưa nộp bài hoặc không có câu hỏi tự luận để chấm điểm.
        </p>
        <button
          onClick={onClose}
          className="mt-2 px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded font-semibold transition"
        >
          Đóng
        </button>
      </div>
    );
  }
  const currentQuestion = questionsData[currentIndex];

  const handleScoreChange = (value: number) => {
    const updated = [...questionsData];
    updated[currentIndex] = { ...updated[currentIndex], score: value };
    setQuestionsData(updated);
  };

  const handleFeedbackChange = (value: string) => {
    submissionDetail.feedback = value;
  };

  const goPrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const goNext = () => {
    if (currentIndex < questionsData.length - 1)
      setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="col-span-2 bg-white p-4 sm:p-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h3 className="text-2xl font-semibold text-gray-900 flex-grow min-w-[200px]">
          Thông tin bài làm
        </h3>
        <button
          onClick={onClose}
          className="text-sm text-red-500 hover:underline shrink-0"
        >
          Đóng
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-gray-800">
        <p className="text-lg">
          <strong>Học sinh:</strong> {student.name}
        </p>
        <p className="text-gray-600">
          <strong>Câu hỏi:</strong> {currentIndex + 1} / {questionsData.length}
        </p>
      </div>

      <div className="p-4 sm:p-6 border rounded-lg bg-gray-50 shadow-sm overflow-auto max-h-[320px]">
        <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          🧑‍🎓 Câu hỏi & Đáp án
        </h4>

        <div className="mb-4">
          <p className="font-medium text-gray-700 mb-1">Đề bài:</p>
          <p className="whitespace-pre-wrap text-gray-800 bg-white p-3 rounded-md border max-w-full">
            {currentQuestion.description}
          </p>
        </div>

        <div className="mb-4">
          <p className="font-medium text-gray-700 mb-1">Câu trả lời:</p>
          <p className="whitespace-pre-wrap text-gray-800 bg-white p-3 rounded-md border max-w-full">
            {currentQuestion.content || (
              <em className="text-gray-400">Chưa có đáp án</em>
            )}
          </p>
        </div>

        {currentQuestion.files && currentQuestion.files.length > 0 && (
          <div>
            <p className="font-medium text-gray-700 mb-1">File đính kèm:</p>
            <ul className="list-disc list-inside text-primary-darker text-sm space-y-1">
              {currentQuestion.files.map((file) => (
                <li key={file.id}>
                  <a
                    href={file.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline break-all"
                  >
                    {file.fileName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 border rounded-lg bg-primary-lighter shadow-sm">
        <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          📝 Chấm điểm & Phản hồi
        </h4>

        <div className="mb-4 max-w-xs">
          <label
            htmlFor="score-input"
            className="block font-medium text-gray-700 mb-1"
          >
            Điểm (tối đa {currentQuestion.score}):
          </label>
          <input
            id="score-input"
            type="number"
            min={0}
            max={currentQuestion.score}
            value={currentQuestion.score ?? ""}
            onChange={(e) => handleScoreChange(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Nhập điểm"
          />
        </div>

        <div>
          <label
            htmlFor="feedback-textarea"
            className="block font-medium text-gray-700 mb-1"
          >
            Phản hồi giáo viên:
          </label>
          <textarea
            id="feedback-textarea"
            rows={4}
            value={submissionDetail.feedback || ""}
            onChange={(e) => handleFeedbackChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Nhập phản hồi cho học sinh"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t flex-wrap gap-2">
        <button
          onClick={goPrevious}
          disabled={currentIndex === 0}
          className="flex-grow sm:flex-grow-0 px-5 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 transition"
        >
          ← Trước
        </button>
        <button
          onClick={goNext}
          disabled={currentIndex === questionsData.length - 1}
          className="flex-grow sm:flex-grow-0 px-5 py-2 bg-primary-dark text-white rounded-lg font-medium hover:bg-primary-darker disabled:opacity-50 transition"
        >
          Tiếp theo →
        </button>
      </div>
    </div>
  );
};

export default StudentSubmissionInfo;
