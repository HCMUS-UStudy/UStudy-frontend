"use client";

import { getSubmissionDetails } from "@/app/lib/services/submission";
import { SubmissionDetail } from "@/app/types";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface Props {
  show: boolean;
  submissionId: string | null;
  onClose: () => void;
  onReview: (id: string) => void;
}

const QuestionOverviewModal: React.FC<Props> = ({
  show,
  submissionId,
  onClose,
  onReview,
}) => {
  const [submissionDetail, setSubmissionDetail] =
    useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(false);

  // internal state to control visibility for animation
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      if (submissionId) {
        setLoading(true);
        getSubmissionDetails(submissionId, false)
          .then((data) => {
            setSubmissionDetail(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Failed to fetch submission details:", error);
            setLoading(false);
          });
      }
    } else {
      // delay unmount to let animation play
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [show, submissionId]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center p-4
        transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[80vh] overflow-y-auto p-6 relative
          transform transition-transform duration-300 ${
            show ? "scale-100" : "scale-95"
          }`}
      >
        <h3
          id="modal-title"
          className="text-2xl font-extrabold text-gray-900 mb-6 text-center tracking-wide"
        >
          Tổng quan câu trả lời
        </h3>

        <div className="flex flex-col gap-5">
          {loading
            ? // Hiển thị các khối placeholder với hiệu ứng pulse
              Array(3)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-200 rounded-xl p-4 animate-pulse h-12"
                  />
                ))
            : submissionDetail?.questions.map((q, idx) => (
                <div
                  key={q.questionId}
                  className="grid grid-cols-[1fr_auto] items-center bg-gray-50 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-default select-text gap-x-4"
                >
                  <p className="text-gray-800 font-semibold text-base leading-relaxed">
                    {idx + 1}. {q.description.replace(/:$/, "")}
                  </p>
                  <div
                    className={`flex items-center gap-2 text-sm font-bold px-3 py-1 rounded-full select-none whitespace-nowrap ${
                      q.isCorrect === true
                        ? "bg-green-100 text-green-800"
                        : q.isCorrect === false
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {q.isCorrect === true ? (
                      <>
                        <FaCheckCircle className="text-green-600" />
                        Đúng
                      </>
                    ) : q.isCorrect === false ? (
                      <>
                        <FaTimesCircle className="text-red-600" />
                        Sai
                      </>
                    ) : (
                      <span>Chưa có kết quả</span>
                    )}
                  </div>
                </div>
              ))}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
          >
            Đóng
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (submissionId) onReview(submissionId);
            }}
            className="px-5 py-2 rounded-full bg-primary text-white font-semibold hover:bg-primary-darker transition"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionOverviewModal;
