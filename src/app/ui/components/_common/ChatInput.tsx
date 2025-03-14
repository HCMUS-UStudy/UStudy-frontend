"use client";

import { useState } from "react";
import { FaPaperclip, FaSmile, FaTimes } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

interface ChatInputProps {
  currentQuestionId: string;
  onSendMessage: (
    questionId: string,
    message: { text: string; files: File[] },
  ) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  currentQuestionId,
  onSendMessage,
}) => {
  const [message, setMessage] = useState<{ [key: string]: string }>({});
  const [attachments, setAttachments] = useState<{ [key: string]: File[] }>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setMessage((prev) => ({ ...prev, [currentQuestionId]: text }));

    if (typingTimeout) clearTimeout(typingTimeout);

    const newTimeout = setTimeout(() => {
      onSendMessage(currentQuestionId, {
        text,
        files: attachments[currentQuestionId] || [],
      });
    }, 500); // Gửi sau 500ms nếu không nhập thêm

    setTypingTimeout(newTimeout);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => ({
        ...prev,
        [currentQuestionId]: [...(prev[currentQuestionId] || []), ...newFiles],
      }));
    }
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => ({
      ...prev,
      [currentQuestionId]:
        prev[currentQuestionId]?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <div className="relative w-full p-4 border border-gray-300 rounded-2xl shadow-lg bg-white flex flex-col">
      <div className="flex items-center">
        <button
          className="text-gray-500 hover:text-gray-700 transition-all duration-200"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <FaSmile size={22} />
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-14 left-3 z-50 bg-white shadow-lg rounded-lg p-2">
            <EmojiPicker
              onEmojiClick={(e) =>
                setMessage((prev) => ({
                  ...prev,
                  [currentQuestionId]:
                    (prev[currentQuestionId] || "") + e.emoji,
                }))
              }
            />
          </div>
        )}

        <textarea
          className="flex-1 mx-3 p-3 border border-gray-200 rounded-lg min-h-[50px] resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
          rows={2}
          placeholder="Nhập tin nhắn..."
          value={message[currentQuestionId] || ""}
          onChange={handleChange}
        />

        <label className="cursor-pointer text-gray-500 hover:text-gray-700 mx-2 transition-all duration-200">
          <FaPaperclip size={22} />
          <input
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* Hiển thị danh sách tệp đính kèm */}
      {attachments[currentQuestionId]?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {attachments[currentQuestionId].map((file, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-100 p-2 rounded-md"
            >
              <span className="text-xs truncate max-w-[100px]">
                {file.name}
              </span>
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeFile(index)}
              >
                <FaTimes size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatInput;
