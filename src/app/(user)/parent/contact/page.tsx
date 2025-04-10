"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/ui/components/_common/Card";
import { BsPerson } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa6";
import { Button } from "@/app/ui/components/_common/Button";
import { useSearchParams } from "next/navigation";

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
  
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(teacherParam);
  const [messageInput, setMessageInput] = useState("");
  
  // Mock data
  const teachers: Teacher[] = [
    { 
      id: 1, 
      name: "Nguyễn Văn A", 
      subject: "Toán học", 
      avatar: "/avatar1.png", 
      lastActive: "Hoạt động 5 phút trước" 
    },
    { 
      id: 2, 
      name: "Trần Văn C", 
      subject: "Vật lý", 
      avatar: "/avatar2.png", 
      lastActive: "Hoạt động 30 phút trước" 
    },
    { 
      id: 3, 
      name: "Phạm Thị D", 
      subject: "Hóa học", 
      avatar: "/avatar3.png", 
      lastActive: "Hoạt động 2 giờ trước" 
    },
  ];

  const conversationHistory: { [key: string]: Message[] } = {
    "Nguyễn Văn A": [
      { 
        id: 1, 
        sender: "Nguyễn Văn A", 
        content: "Chào phụ huynh, tôi là giáo viên môn Toán của bạn Bình. Có điều gì tôi có thể giúp được không?", 
        timestamp: "20/04/2025 10:30", 
        isParent: false 
      },
      { 
        id: 2, 
        sender: "Phụ huynh", 
        content: "Chào thầy, tôi muốn hỏi về tình hình học tập của cháu Bình trong thời gian gần đây.", 
        timestamp: "20/04/2025 10:45", 
        isParent: true 
      },
      { 
        id: 3, 
        sender: "Nguyễn Văn A", 
        content: "Bình đang học tập rất tốt, đặc biệt là phần hình học không gian. Tuy nhiên, cháu còn hơi yếu ở phần Đại số, cụ thể là giải phương trình mũ và logarit.", 
        timestamp: "20/04/2025 11:00", 
        isParent: false 
      },
    ],
    "Trần Văn C": [
      { 
        id: 1, 
        sender: "Trần Văn C", 
        content: "Xin chào phụ huynh, tôi là giáo viên môn Vật lý của bạn Bình.", 
        timestamp: "19/04/2025 09:15", 
        isParent: false 
      },
    ],
    "Phạm Thị D": [],
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedTeacher) return;
    
    // Trong ứng dụng thực tế, bạn sẽ gửi tin nhắn tới API
    console.log("Gửi tin nhắn:", messageInput, "tới giáo viên:", selectedTeacher);
    
    // Clear input sau khi gửi
    setMessageInput("");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Liên hệ với giáo viên</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Danh sách giáo viên */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BsPerson className="mr-2" />
                Danh sách giáo viên
              </CardTitle>
              <CardDescription>Chọn giáo viên để nhắn tin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teachers.map((teacher) => (
                  <div 
                    key={teacher.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTeacher === teacher.name 
                        ? "border-primary bg-primary/10" 
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedTeacher(teacher.name)}
                  >
                    <div className="flex items-center">
                      <div className="relative w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        {teacher.avatar ? (
                          <img 
                            src={teacher.avatar} 
                            alt={teacher.name} 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <BsPerson size={20} />
                        )}
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                      </div>
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-xs text-gray-500">{teacher.subject}</p>
                        <p className="text-xs text-gray-400">{teacher.lastActive}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Khu vực chat */}
        <div className="md:col-span-3">
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              {selectedTeacher ? (
                <div className="flex items-center">
                  <div className="relative w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <BsPerson size={20} />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  </div>
                  <div>
                    <CardTitle>{selectedTeacher}</CardTitle>
                    <CardDescription>
                      {teachers.find(t => t.name === selectedTeacher)?.subject}
                    </CardDescription>
                  </div>
                </div>
              ) : (
                <div>
                  <CardTitle>Tin nhắn</CardTitle>
                  <CardDescription>Chọn một giáo viên để bắt đầu cuộc trò chuyện</CardDescription>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
              {selectedTeacher && conversationHistory[selectedTeacher]?.length > 0 ? (
                conversationHistory[selectedTeacher].map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.isParent ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.isParent 
                          ? "bg-primary text-white rounded-br-none" 
                          : "bg-gray-100 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.isParent ? "text-primary-light" : "text-gray-500"}`}>
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
            </CardContent>
            
            {selectedTeacher && (
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button
                    variant="primary"
                    onClick={handleSendMessage}
                    className="px-4"
                  >
                    Gửi
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
} 