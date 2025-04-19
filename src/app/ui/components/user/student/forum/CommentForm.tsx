"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "../../../_common/Button";
import EmojiPicker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";

interface CommentFormProps {
  onSubmit: (comment: string) => void;
}

export default function CommentForm({ onSubmit }: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSubmit(comment);
    setComment("");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEmojiClick = (emojiData: any) => {
    setComment((prev) => prev + emojiData.emoji);
  };

  // 👇 Close Emoji Picker when clicking outside
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

  return (
    <div className="mb-6 p-6 bg-white shadow-md border border-gray-200 rounded-lg">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 items-start"
      >
        {/* Avatar bên trái */}
        <div className="flex-shrink-0">
          <Image
            src="/student.png"
            alt="Avatar"
            width={48}
            height={48}
            className="rounded-full object-cover border"
          />
        </div>

        {/* Textarea và nút submit */}
        <div className="w-full relative">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Bạn nghĩ gì về bài viết này?"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark min-h-[120px] bg-gray-50 transition-all"
            required
          />

          <div className="flex items-center justify-between mt-2">
            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="text-gray-500 hover:text-primary-dark transition-all"
            >
              <FaSmile size={22} />
            </button>

            <Button
              type="submit"
              className="bg-primary-darker text-white hover:bg-hover-primary transition-all px-6 py-2 rounded-lg shadow-sm"
            >
              Đăng bình luận
            </Button>
          </div>

          {/* Emoji Picker container */}
          {showEmojiPicker && (
            <div ref={emojiRef} className="absolute z-10 mt-2">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
