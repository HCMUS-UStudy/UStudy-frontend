"use client";

import React from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { BsEmojiSmile, BsPerson } from "react-icons/bs";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../../../_common/Card";
import Image from "next/image";
import EmojiPicker from "emoji-picker-react";
import { Button } from "../../../_common/Button";
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
    <div className="md:col-span-3">
      <Card className="h-full flex flex-col rounded shadow-md bg-white border min-h-[500px]">
        <CardHeader className="border-b bg-primary-lighter h-sub-header-height">
          {selectedTeacher ? (
            <div className="flex items-center">
              <div className="relative w-11 h-11 mr-3">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100 flex items-center justify-center">
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
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-md"></span>
              </div>

              <div>
                <CardTitle className="text-primary-darkest">
                  {selectedTeacher}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  {teachers.find((t) => t.name === selectedTeacher)?.subject}
                </CardDescription>
              </div>
            </div>
          ) : (
            <>
              <CardTitle className="text-primary-darkest">Tin nhắn</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Chọn một giáo viên để bắt đầu cuộc trò chuyện
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="flex-grow px-4 py-4 space-y-4 max-h-chat-screen bg-white overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
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
                  <p>{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${message.isParent ? "text-primary-lighter" : "text-gray-500"}`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))
          ) : selectedTeacher ? (
            <div className="flex items-center justify-center h-4/5">
              <div className="text-center text-gray-500">
                <FaRegCommentDots size={40} className="mx-auto mb-2" />
                <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <FaRegCommentDots size={40} className="mx-auto mb-2" />
                <p>Chọn một giáo viên để bắt đầu cuộc trò chuyện.</p>
              </div>
            </div>
          )}

          {/* This is the scroll-to point */}
          <div ref={messagesEndRef} />
        </CardContent>

        {selectedTeacher && (
          <div className="min-h-chat-input-area">
            <div>
              <div className="py-4 px-3 border-t bg-background h-full">
                <div className="flex flex-col gap-2 relative">
                  <div className="flex items-center gap-2">
                    {/* Textarea */}
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Nhập tin nhắn..."
                      rows={2}
                      className="flex-grow resize-none p-3 rounded-2xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    {/* Emoji Button */}
                    <button
                      className="text-2xl text-gray-500 hover:text-primary-dark transition"
                      title="Chèn emoji"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <BsEmojiSmile />
                    </button>
                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                      <div
                        ref={emojiRef}
                        className="absolute bottom-16 left-0 z-10"
                      >
                        <EmojiPicker
                          onEmojiClick={(emojiData) =>
                            setMessageInput((prev) => prev + emojiData.emoji)
                          }
                          height={350}
                        />
                      </div>
                    )}
                    {/* Send Button */}
                    <Button
                      onClick={handleSendMessage}
                      className="p-3 bg-primary-dark text-white rounded-full hover:bg-primary-darker transition duration-200"
                      title="Gửi tin nhắn"
                    >
                      <FaPaperPlane size={20} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChatMessage;
