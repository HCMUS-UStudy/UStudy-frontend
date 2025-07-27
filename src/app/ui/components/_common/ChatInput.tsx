// import React from "react";

// export default function ChatInput() {
//   return <div>ChatInput</div>;
// }

"use client";

import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FaPaperclip, FaSmile, FaTimes } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { FaPaperPlane } from "react-icons/fa6";
import { SubmissionDetail } from "@/app/types";

interface ChatInputProps {
  currentQuestionId: string;
  initialMessage?: string;
  initialAttachments?: File[];
  submissionData?: SubmissionDetail | null;
  onSendMessage: (
    questionId: string,
    message: { content: string; files: File[]; deletedFileIds?: string[] },
  ) => void;
  onFileRemove?: (fileId: string[]) => void;
}

export interface ChatInputRef {
  hasUnsentMessage: () => boolean;
  sendMessage: () => void;
}

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(
  (
    {
      currentQuestionId,
      initialMessage = "",
      initialAttachments = [],
      submissionData = null,
      onSendMessage,
      onFileRemove,
    },
    ref,
  ) => {
    const [message, setMessage] = useState<{ [key: string]: string }>({});
    const [attachments, setAttachments] = useState<{ [key: string]: File[] }>(
      {},
    );
    const [removedFileIds, setRemovedFileIds] = useState<string[]>([]);

    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const emojiRef = useRef<HTMLDivElement | null>(null);
    // const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    //   null,
    // );

    // const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    //   const text = e.target.value;
    //   setMessage((prev) => ({ ...prev, [currentQuestionId]: text }));

    //   if (typingTimeout) clearTimeout(typingTimeout);

    //   const newTimeout = setTimeout(() => {
    //     onSendMessage(currentQuestionId, {
    //       text,
    //       files: attachments[currentQuestionId] || [],
    //     });
    //   }, 500); // Gửi sau 500ms nếu không nhập thêm

    //   setTypingTimeout(newTimeout);
    // };

    useEffect(() => {
      setMessage((prev) => {
        if (prev[currentQuestionId] === undefined) {
          return { ...prev, [currentQuestionId]: initialMessage };
        }
        return prev;
      });

      setAttachments((prev) => {
        if (prev[currentQuestionId] === undefined) {
          return { ...prev, [currentQuestionId]: initialAttachments };
        }
        return prev;
      });
    }, [initialMessage, initialAttachments, currentQuestionId]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          emojiRef.current &&
          !emojiRef.current.contains(event.target as Node)
        ) {
          setShowEmojiPicker(false);
        }
      };

      if (showEmojiPicker) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showEmojiPicker]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setMessage((prev) => ({ ...prev, [currentQuestionId]: text }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files);
        setAttachments((prev) => ({
          ...prev,
          [currentQuestionId]: [
            ...(prev[currentQuestionId] || []),
            ...newFiles,
          ],
        }));
      }
    };

    const removeFile = (index: number) => {
      const files = attachments[currentQuestionId] || [];
      if (!files.length) return;

      const fileToRemove = files[index];

      // Nếu file đã tồn tại trong submissionData, lưu id vào danh sách xóa
      const submissionFiles =
        submissionData?.questions.find(
          (question) => question.questionId === currentQuestionId,
        )?.files || [];

      const fileIdsToRemove = submissionFiles
        .filter((file) => file.fileName === fileToRemove.name)
        .map((file) => file.id);

      if (fileIdsToRemove.length > 0) {
        // Add file IDs to the removed file list
        setRemovedFileIds((prev) => [...prev, ...fileIdsToRemove]);

        // Notify the parent component (callback) with the array of file IDs
        if (onFileRemove) {
          onFileRemove(fileIdsToRemove); // Trigger callback with the array of file IDs
        }
      }

      // Cập nhật danh sách file đính kèm
      setAttachments((prev) => ({
        ...prev,
        [currentQuestionId]:
          prev[currentQuestionId]?.filter((_, i) => i !== index) || [],
      }));
    };

    const handleSendMessage = () => {
      if (
        !message[currentQuestionId] &&
        !attachments[currentQuestionId]?.length
      )
        return;

      const submissionFileNames = new Set(
        Array.isArray(submissionData?.questions)
          ? submissionData.questions
              .filter((question) => question.questionId === currentQuestionId)
              .flatMap(
                (question) =>
                  question.files?.map((file) => file.fileName) || [],
              )
          : [],
      );

      const newFiles = (attachments[currentQuestionId] || []).filter(
        (file) => !submissionFileNames.has(file.name),
      );

      onSendMessage(currentQuestionId, {
        content: message[currentQuestionId] || "",
        files: newFiles, // Chỉ gửi tệp mới
        deletedFileIds: removedFileIds.length > 0 ? removedFileIds : undefined, // Chỉ gửi nếu có tệp bị xóa
      });

      // Reset input
      setMessage((prev) => ({ ...prev, [currentQuestionId]: "" }));
      setAttachments((prev) => ({ ...prev, [currentQuestionId]: [] }));
      setRemovedFileIds([]); // Reset danh sách tệp đã xóa sau khi gửi
    };

    // Expose methods to parent component via ref
    useImperativeHandle(ref, () => ({
      hasUnsentMessage: () => {
        const currentMessage = message[currentQuestionId] || "";
        const currentAttachmentsList = attachments[currentQuestionId] || [];
        return (
          currentMessage.trim().length > 0 || currentAttachmentsList.length > 0
        );
      },
      sendMessage: () => {
        if (
          message[currentQuestionId]?.trim() ||
          attachments[currentQuestionId]?.length
        ) {
          handleSendMessage();
        }
      },
    }));

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
            <div
              ref={emojiRef}
              className="absolute bottom-14 left-3 z-50 bg-white shadow-lg rounded-lg p-2"
            >
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
            className="flex-1 mx-3 p-3 border border-gray-200 rounded-lg min-h-[50px] resize-none focus:ring-2 focus:ring-primary-light focus:outline-none transition-all"
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

          <button
            className="ml-2 text-primary-dark hover:text-hover-primary transition-all"
            onClick={handleSendMessage}
          >
            <FaPaperPlane size={22} />
          </button>
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
  },
);

ChatInput.displayName = "ChatInput";

export default ChatInput;
