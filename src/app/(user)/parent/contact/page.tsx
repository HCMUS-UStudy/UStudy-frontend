"use client";

import React, { useEffect, useRef, useState } from "react";

import { useSearchParams } from "next/navigation";
import TeacherList from "@/app/ui/components/user/parent/contact/TeacherList";
import ChatMessage from "@/app/ui/components/user/parent/contact/ChatMessage";

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
        <TeacherList
          teachers={teachers}
          selectedTeacher={selectedTeacher}
          setSelectedTeacher={setSelectedTeacher}
        />

        {/* Khu vực chat */}
        <ChatMessage
          selectedTeacher={selectedTeacher}
          conversationHistory={conversationHistory}
          teachers={teachers}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          emojiRef={emojiRef}
          messagesEndRef={messagesEndRef}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}
