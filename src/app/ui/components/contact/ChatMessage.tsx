"use client";
import React from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { BsEmojiSmile, BsPerson } from "react-icons/bs";
import { CardHeader, CardTitle, CardDescription } from "../_common/Card";
import Image from "next/image";
import EmojiPicker from "emoji-picker-react";
import { Button } from "../_common/Button";
import { FaPaperPlane } from "react-icons/fa6";

type Message = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isParent: boolean;
};

type Teacher = {
  id: number;
  name: string;
  subject: string;
  avatar: string;
  lastActive: string;
};

type ChatMessageProps = {
  selectedTeacher: string | null;
  conversationHistory: { [key: string]: Message[] };
  teachers: Teacher[];
  messageInput: string;
  setMessageInput: React.Dispatch<React.SetStateAction<string>>;
  showEmojiPicker: boolean;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
  emojiRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  handleSendMessage: () => void;
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  selectedTeacher,
  conversationHistory,
  teachers,
  messageInput,
  setMessageInput,
  showEmojiPicker,
  setShowEmojiPicker,
  emojiRef,
  messagesEndRef,
  handleSendMessage,
}) => {
  return (
    <div className="relative w-full lg;w-[calc(100%-270px)] h-full md:col-span-3 bg-white">
      <CardHeader className="w-full flex-none border-b bg-primary-lighter md:h-[60px] lg:h-[80px]">
        {selectedTeacher ? (
          <div className="flex items-center">
            <div className="relative size-9 lg:size-11 mr-3">
              <div className="size-9 lg:size-11 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100 flex items-center justify-center">
                {teachers.find((t) => t.name === selectedTeacher)?.avatar ? (
                  <Image
                    width={36}
                    height={36}
                    src={
                      teachers.find((t) => t.name === selectedTeacher)
                        ?.avatar || "/default-avatar.jpg"
                    }
                    alt={selectedTeacher}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BsPerson size={24} className="text-primary-dark" />
                )}
              </div>
              <span className="absolute md:bottom-1 md:right-1 lg:-bottom-1 lg:-right-1 md:size-3 lg:w-3.5 lg:h-3.5 bg-green-500 rounded-full border-2 border-white shadow-md"></span>
            </div>

            <div>
              <CardTitle className="text-primary-darkest text-sm lg:text-base">
                {selectedTeacher}
              </CardTitle>
              <CardDescription className="text-gray-500 text-xs lg:text-sm">
                {teachers.find((t) => t.name === selectedTeacher)?.subject}
              </CardDescription>
            </div>
          </div>
        ) : (
          <>
            <CardTitle className="text-primary-darkest text-sm lg:text-base">
              Tin nhắn
            </CardTitle>
            <CardDescription className=" text-gray-500 text-sm lg:text-base">
              Chọn một giáo viên để bắt đầu cuộc trò chuyện
            </CardDescription>
          </>
        )}
      </CardHeader>
      <div className="relative min-h-[65vh] max-h-[65vh] overflow-auto">
        <div className="space-y-4 py-4 px-4   bg-white  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {selectedTeacher &&
          conversationHistory[selectedTeacher]?.length > 0 ? (
            conversationHistory[selectedTeacher].map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isParent ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
                    message.isParent
                      ? "bg-primary-dark text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="text-xs lg:text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${message.isParent ? "text-primary-lighter" : "text-gray-500"}`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))
          ) : selectedTeacher ? (
            <div className="flex items-center justify-center flex-1 h-64">
              <div className="text-center text-gray-500">
                <FaRegCommentDots className="size-10 lg:size-16 mx-auto mb-2" />
                <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-1 h-64">
              <div className="text-center text-gray-500">
                <FaRegCommentDots className="size-10 lg:size-16 mx-auto mb-2" />
                <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
              </div>
            </div>
          )}
          <div className="pb-10" ref={messagesEndRef}></div>
        </div>
      </div>
      <div className="sticky right-0  bottom-0  w-full">
        {selectedTeacher && (
          // lg:mx-1 xl:mx-2 left-[19vw] md:left-[33vw] lg:left-[41vw] xl:left-[36vw]
          <div className=" w-full bg-primary-lighter backdrop-blur-sm border-t-2 border-slate-200 ">
            <div className="py-4 px-4">
              <div className="flex flex-col gap-2 relative max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    rows={2}
                    className="flex-grow w-full text-xs md:text-sm xl:text-base md:w-auto resize-none p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    className="text-2xl text-gray-500 hover:text-primary-dark transition flex-shrink-0"
                    title="Chèn emoji"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <BsEmojiSmile className="size-5 md:size-7" />
                  </button>
                  {showEmojiPicker && (
                    <div
                      ref={emojiRef}
                      className="absolute bottom-16 right-0 z-10"
                    >
                      <EmojiPicker
                        className="h-20"
                        onEmojiClick={(emojiData) =>
                          setMessageInput((prev) => prev + emojiData.emoji)
                        }
                      />
                    </div>
                  )}
                  <Button
                    onClick={handleSendMessage}
                    className="p-3 bg-primary-dark text-white rounded-full hover:bg-primary-darker transition duration-200 flex-shrink-0"
                    title="Gửi tin nhắn"
                  >
                    <FaPaperPlane className="size-3 md:size-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { ChatMessage };
