import React, { useEffect, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { getAllMessages } from "@/app/lib/services/chat";
import { RoomChatItem } from "@/app/types";

// type Message = {
//   id: number;
//   sender: string;
//   content: string;
//   timestamp: string;
//   isParent: boolean;
// };

// interface Teacher {
//   id: number;
//   name: string;
//   avatar: string;
//   classes: string[];
// }

type ChatMessageProps = {
  selectedRoom: RoomChatItem | null;
  // conversationHistory: { [key: string]: Message[] };
  // teachers: Teacher[];
  messageInput: string;
  setMessageInput: React.Dispatch<React.SetStateAction<string>>;
  showEmojiPicker: boolean;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
  emojiRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  handleSendMessage: () => void;
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  selectedRoom,
  // conversationHistory,
  // teachers,
  messageInput,
  setMessageInput,
  showEmojiPicker,
  setShowEmojiPicker,
  emojiRef,
  messagesEndRef,
  handleSendMessage,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: messages, status } = useQuery({
    queryKey: ["Messages", selectedRoom, currentPage - 1],
    queryFn: () =>
      getAllMessages(selectedRoom?.roomChatId, currentPage - 1, 10),
    enabled: !!selectedRoom?.roomChatId,
  });

  return (
    <div className="md:col-span-3">
      <Card className="border-2 border-black h-full flex flex-col rounded shadow-md bg-white min-h-[500px]">
        <CardHeader className="border-b bg-primary-lighter h-sub-header-height">
          {selectedRoom ? (
            <div className="flex items-center">
              <div className="relative w-11 h-11 mr-3">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100 flex items-center justify-center">
                  {/*{teachers.find((t) => t.name === selectedRoom)?.avatar ? (*/}
                  {/*  <Image*/}
                  {/*    width={36}*/}
                  {/*    height={36}*/}
                  {/*    src={*/}
                  {/*      teachers.find((t) => t.name === selectedRoom)?.avatar ||*/}
                  {/*      "/default-avatar.jpg"*/}
                  {/*    }*/}
                  {/*    alt={selectedRoom}*/}
                  {/*    className="w-full h-full object-cover"*/}
                  {/*  />*/}
                  {/*) : (*/}
                  {/*  <BsPerson size={24} className="text-primary-dark" />*/}
                  {/*)}*/}
                  {selectedRoom.user?.avatar ? (
                    <Image
                      width={36}
                      height={36}
                      src={selectedRoom.user.avatar}
                      alt={selectedRoom.user.name}
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
                  {selectedRoom?.user?.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Lớp phụ trách: {/*{teachers*/}
                  {/*  .find((t) => t.name === selectedRoom)*/}
                  {/*  ?.classes.join(", ")}*/}
                  {selectedRoom?.listClassName.length > 0 &&
                    selectedRoom.listClassName.join(", ")}
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
          {selectedRoom && messages && messages.totalElements > 0 ? (
            messages.content
              .slice()
              .reverse()
              .map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isSender ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
                      message.isSender
                        ? "bg-primary-dark text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${message.isSender ? "text-primary-lighter" : "text-gray-500"}`}
                    >
                      {new Date(message.sendTime).toLocaleTimeString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
          ) : selectedRoom ? (
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

        {selectedRoom && (
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
