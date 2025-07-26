"use client";

import { getAIAssignment } from "@/app/lib/services/AI";
import React, { useEffect, useState } from "react";

interface AIExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
}

const AIExplainModal: React.FC<AIExplainModalProps> = ({
  isOpen,
  onClose,
  questionId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    if (isOpen && questionId) {
      setIsLoading(true);
      setExplanation("");

      const fetchExplanation = async () => {
        try {
          const response = await getAIAssignment(questionId);
          setExplanation(
            response.generatedText || "Không có nội dung giải thích.",
          );
        } catch (error) {
          console.log(error);
          setExplanation("Đã xảy ra lỗi khi lấy giải thích.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchExplanation();
    }
  }, [isOpen, questionId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative transition-all duration-300">
        {/* Nút đóng */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl transition"
          onClick={onClose}
          aria-label="Đóng"
        >
          &times;
        </button>

        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          💡 Giải thích đáp án bằng AI
        </h2>

        <div className="text-gray-700 whitespace-pre-wrap space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-12 space-y-2">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-500">
                Đang tạo giải thích thông minh...
              </span>
            </div>
          ) : (
            <div className="prose max-w-none text-gray-800 text-base leading-loose">
              {explanation?.split("\n").map((line, index) => {
                let displayLine = line;
                // Nếu dòng bắt đầu bằng 1 dấu * (và không phải **)
                if (/^\*[^*]/.test(displayLine)) {
                  displayLine = "•" + displayLine.slice(1);
                }
                // Chuyển các đoạn **text** thành <strong>text</strong>
                const parts = displayLine.split(/(\*\*[^*]+\*\*)/g);
                return (
                  <p key={index} className="mb-3">
                    {parts.map((part, i) => {
                      if (/^\*\*[^*]+\*\*$/.test(part)) {
                        return <strong key={i}>{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    })}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIExplainModal;
