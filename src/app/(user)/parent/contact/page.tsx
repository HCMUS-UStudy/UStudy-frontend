"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/ui/components/_common/Card";
import { BsEmojiSmile, BsPerson } from "react-icons/bs";
import { FaPaperPlane, FaRegCommentDots } from "react-icons/fa6";
import { Button } from "@/app/ui/components/_common/Button";
import { useSearchParams } from "next/navigation";
import EmojiPicker from "emoji-picker-react";
import Image from "next/image";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isParent: boolean;
}

interface Teacher {
  id: number;
  name: string;
  subject: string;
  avatar: string;
  lastActive: string;
}

export default function ParentContactPage() {
  const searchParams = useSearchParams();
  const teacherParam = searchParams?.get("teacher");

  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(
    teacherParam,
  );
  const [messageInput, setMessageInput] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

  // Mock data
  const teachers: Teacher[] = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      subject: "Toán học",
      avatar: "/student.png",
      lastActive: "Hoạt động 5 phút trước",
    },
    {
      id: 2,
      name: "Trần Văn C",
      subject: "Vật lý",
      avatar: "/teacher.png",
      lastActive: "Hoạt động 30 phút trước",
    },
    {
      id: 3,
      name: "Phạm Thị D",
      subject: "Hóa học",
      avatar: "/student.png",
      lastActive: "Hoạt động 2 giờ trước",
    },
    {
      id: 4,
      name: "Nguyễn Văn A",
      subject: "Toán học",
      avatar: "/student.png",
      lastActive: "Hoạt động 5 phút trước",
    },
    {
      id: 5,
      name: "Trần Văn C",
      subject: "Vật lý",
      avatar: "/teacher.png",
      lastActive: "Hoạt động 30 phút trước",
    },
    {
      id: 6,
      name: "Phạm Thị D",
      subject: "Hóa học",
      avatar: "/student.png",
      lastActive: "Hoạt động 2 giờ trước",
    },
  ];

  const conversationHistory: { [key: string]: Message[] } = {
    "Nguyễn Văn A": [
      {
        id: 1,
        sender: "Nguyễn Văn A",
        content:
          "Chào phụ huynh, tôi là giáo viên môn Toán của bạn Bình. Có điều gì tôi có thể giúp được không?",
        timestamp: "20/04/2025 10:30",
        isParent: false,
      },
      {
        id: 2,
        sender: "Phụ huynh",
        content:
          "Chào thầy, tôi muốn hỏi về tình hình học tập của cháu Bình trong thời gian gần đây.",
        timestamp: "20/04/2025 10:45",
        isParent: true,
      },
      {
        id: 3,
        sender: "Nguyễn Văn A",
        content:
          "Bình đang học tập rất tốt, đặc biệt là phần hình học không gian. Tuy nhiên, cháu còn hơi yếu ở phần Đại số, cụ thể là giải phương trình mũ và logarit.",
        timestamp: "20/04/2025 11:00",
        isParent: false,
      },
      {
        id: 4,
        sender: "Nguyễn Văn A",
        content:
          "Chào phụ huynh, tôi là giáo viên môn Toán của bạn Bình. Có điều gì tôi có thể giúp được không?",
        timestamp: "20/04/2025 10:30",
        isParent: false,
      },
      {
        id: 5,
        sender: "Phụ huynh",
        content:
          "Chào thầy, tôi muốn hỏi về tình hình học tập của cháu Bình trong thời gian gần đây.",
        timestamp: "20/04/2025 10:45",
        isParent: true,
      },
      {
        id: 6,
        sender: "Nguyễn Văn A",
        content:
          "Bình đang học tập rất tốt, đặc biệt là phần hình học không gian. Tuy nhiên, cháu còn hơi yếu ở phần Đại số, cụ thể là giải phương trình mũ và logarit.",
        timestamp: "20/04/2025 11:00",
        isParent: false,
      },
      {
        id: 7,
        sender: "Nguyễn Văn A",
        content:
          "Chào phụ huynh, tôi là giáo viên môn Toán của bạn Bình. Có điều gì tôi có thể giúp được không?",
        timestamp: "20/04/2025 10:30",
        isParent: false,
      },
      {
        id: 8,
        sender: "Phụ huynh",
        content:
          "Chào thầy, tôi muốn hỏi về tình hình học tập của cháu Bình trong thời gian gần đây.",
        timestamp: "20/04/2025 10:45",
        isParent: true,
      },
      {
        id: 9,
        sender: "Nguyễn Văn A",
        content:
          "Bình đang học tập rất tốt, đặc biệt là phần hình học không gian. Tuy nhiên, cháu còn hơi yếu ở phần Đại số, cụ thể là giải phương trình mũ và logarit.",
        timestamp: "20/04/2025 11:00",
        isParent: false,
      },
    ],
    "Trần Văn C": [
      {
        id: 1,
        sender: "Trần Văn C",
        content:
          "Xin chào phụ huynh, tôi là giáo viên môn Vật lý của bạn Bình.",
        timestamp: "19/04/2025 09:15",
        isParent: false,
      },
    ],
    "Phạm Thị D": [],
  };

  useEffect(() => {
    if (selectedTeacher && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedTeacher, conversationHistory[selectedTeacher ?? ""]]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedTeacher) return;

    // Trong ứng dụng thực tế, bạn sẽ gửi tin nhắn tới API
    console.log(
      "Gửi tin nhắn:",
      messageInput,
      "tới giáo viên:",
      selectedTeacher,
    );

    // Clear input sau khi gửi
    setMessageInput("");
  };

  return (
    <div className="px-2 md:px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Danh sách giáo viên */}
        <div className="md:col-span-1 h-full">
          <Card className="h-full rounded-2xl shadow-md bg-white border min-h-[500px]">
            <CardHeader>
              <CardTitle className="flex items-center text-primary-dark">
                <BsPerson className="mr-2" />
                Danh sách giáo viên
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Chọn giáo viên để nhắn tin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-thin scrollbar-thumb-gray-300">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all duration-200 ease-in-out hover:shadow-sm ${
                    selectedTeacher === teacher.name
                      ? "border-primary-dark bg-primary-lighter"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedTeacher(teacher.name)}
                >
                  <div className="relative w-11 h-11 mr-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100 flex items-center justify-center">
                      {teacher.avatar ? (
                        <Image
                          width={36}
                          height={36}
                          src={teacher.avatar}
                          alt={teacher.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BsPerson size={24} className="text-primary-dark" />
                      )}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-md"></span>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-primary-dark">
                      {teacher.name}
                    </p>
                    <p className="text-xs text-gray-500">{teacher.subject}</p>
                    <p className="text-xs text-gray-400">
                      {teacher.lastActive}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Khu vực chat */}
        <div className="md:col-span-3">
          <Card className="h-full flex flex-col rounded-2xl shadow-md bg-white border min-h-[500px]">
            <CardHeader className="border-b bg-primary-lighter rounded-t-2xl px-4 py-3">
              {selectedTeacher ? (
                <div className="flex items-center">
                  <div className="relative w-11 h-11 mr-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100 flex items-center justify-center">
                      {teachers.find((t) => t.name === selectedTeacher)
                        ?.avatar ? (
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
                      {
                        teachers.find((t) => t.name === selectedTeacher)
                          ?.subject
                      }
                    </CardDescription>
                  </div>
                </div>
              ) : (
                <div>
                  <CardTitle className="text-primary-darkest">
                    Tin nhắn
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Chọn một giáo viên để bắt đầu cuộc trò chuyện
                  </CardDescription>
                </div>
              )}
            </CardHeader>

            <CardContent className="flex-grow px-4 py-4 space-y-4 bg-white overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
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
                        className={`text-xs mt-1 ${
                          message.isParent
                            ? "text-primary-lighter"
                            : "text-gray-500"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))
              ) : selectedTeacher ? (
                <div className="flex items-center justify-center h-full">
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

              {/* Đây là điểm cuộn */}
              <div ref={messagesEndRef} />
            </CardContent>

            {selectedTeacher && (
              <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
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

                    {/* Nút emoji */}
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

                    {/* Nút gửi */}
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
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
