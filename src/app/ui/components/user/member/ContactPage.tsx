"use client";

import React, { useEffect, useRef, useState } from "react";

import { useSearchParams } from "next/navigation";
import RoomChatList from "@/app/ui/components/user/parent/contact/RoomChatList";
import ChatMessage from "@/app/ui/components/user/parent/contact/ChatMessage";
import { RoomChatItem } from "@/app/types";
import { useWebSocketService } from "@/app/hooks/use-web-socket";

// interface Message {
//   id: number;
//   sender: string;
//   content: string;
//   timestamp: string;
//   isParent: boolean;
// }
//
// interface Teacher {
//   id: number;
//   name: string;
//   avatar: string;
//   classes: string[];
// }

export default function ParentContactPage() {
  const searchParams = useSearchParams();
  const teacherParam = searchParams?.get("teacher");

  // const [selectedRoom, setSelectedRoom] = useState<RoomChatItem>(
  //   teacherParam ?? "",
  // );
  const [selectedRoom, setSelectedRoom] = useState<RoomChatItem | null>(null);
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

  // // Mock data
  // const teachers: Teacher[] = [
  //   {
  //     id: 1,
  //     name: "Nguyễn Văn A",
  //     avatar: "/student.png",
  //     classes: ["10T1", "10L1", "10H1"],
  //   },
  //   {
  //     id: 2,
  //     name: "Trần Văn C",
  //     avatar: "/teacher.png",
  //     classes: ["10T2", "10L2", "10H2"],
  //   },
  //   {
  //     id: 3,
  //     name: "Phạm Thị D",
  //     avatar: "/student.png",
  //     classes: ["10T3", "10L3", "10H3"],
  //   },
  //   {
  //     id: 4,
  //     name: "Lê Thị B",
  //     avatar: "/teacher.png",
  //     classes: ["10T4", "10L4", "10H4"],
  //   },
  //   {
  //     id: 5,
  //     name: "Ngô Văn E",
  //     avatar: "/student.png",
  //     classes: ["10T5", "10L5", "10H5"],
  //   },
  //   {
  //     id: 6,
  //     name: "Hoàng Thị F",
  //     avatar: "/teacher.png",
  //     classes: ["10T6", "10L6", "10H6"],
  //   },
  //   {
  //     id: 7,
  //     name: "Đỗ Văn G",
  //     avatar: "/student.png",
  //     classes: ["10T7", "10L7", "10H7"],
  //   },
  //   {
  //     id: 8,
  //     name: "Nguyễn Thị H",
  //     avatar: "/teacher.png",
  //     classes: ["10T8", "10L8", "10H8"],
  //   },
  //   {
  //     id: 9,
  //     name: "Phan Văn I",
  //     avatar: "/student.png",
  //     classes: ["10T9", "10L9", "10H9"],
  //   },
  //   {
  //     id: 10,
  //     name: "Vũ Thị K",
  //     avatar: "/teacher.png",
  //     classes: ["10T10", "10L10", "10H10"],
  //   },
  //   {
  //     id: 11,
  //     name: "Nguyễn Văn A",
  //     avatar: "/student.png",
  //     classes: ["10T1", "10L1", "10H1"],
  //   },
  //   {
  //     id: 12,
  //     name: "Trần Văn C",
  //     avatar: "/teacher.png",
  //     classes: ["10T2", "10L2", "10H2"],
  //   },
  //   {
  //     id: 13,
  //     name: "Phạm Thị D",
  //     avatar: "/student.png",
  //     classes: ["10T3", "10L3", "10H3"],
  //   },
  //   {
  //     id: 14,
  //     name: "Lê Thị B",
  //     avatar: "/teacher.png",
  //     classes: ["10T4", "10L4", "10H4"],
  //   },
  //   {
  //     id: 15,
  //     name: "Ngô Văn E",
  //     avatar: "/student.png",
  //     classes: ["10T5", "10L5", "10H5"],
  //   },
  // ];
  //
  // const conversationHistory: { [key: string]: Message[] } = {
  //   "Nguyễn Văn A": [
  //     {
  //       id: 1,
  //       sender: "Nguyễn Văn A",
  //       content:
  //         "Chào phụ huynh, tôi là giáo viên môn Toán của bạn Bình. Có điều gì tôi có thể giúp được không?",
  //       timestamp: "20/04/2025 10:30",
  //       isParent: false,
  //     },
  //     {
  //       id: 2,
  //       sender: "Phụ huynh",
  //       content:
  //         "Chào thầy, tôi muốn hỏi về tình hình học tập của cháu Bình trong thời gian gần đây.",
  //       timestamp: "20/04/2025 10:45",
  //       isParent: true,
  //     },
  //     {
  //       id: 3,
  //       sender: "Nguyễn Văn A",
  //       content:
  //         "Bình đang học tập rất tốt, đặc biệt là phần hình học không gian. Tuy nhiên, cháu còn hơi yếu ở phần Đại số, cụ thể là giải phương trình mũ và logarit.",
  //       timestamp: "20/04/2025 11:00",
  //       isParent: false,
  //     },
  //     {
  //       id: 4,
  //       sender: "Nguyễn Văn A",
  //       content:
  //         "Chào phụ huynh, tôi là giáo viên môn Toán của bạn Bình. Có điều gì tôi có thể giúp được không?",
  //       timestamp: "20/04/2025 10:30",
  //       isParent: false,
  //     },
  //     {
  //       id: 5,
  //       sender: "Phụ huynh",
  //       content:
  //         "Chào thầy, tôi muốn hỏi về tình hình học tập của cháu Bình trong thời gian gần đây.",
  //       timestamp: "20/04/2025 10:45",
  //       isParent: true,
  //     },
  //     {
  //       id: 6,
  //       sender: "Nguyễn Văn A",
  //       content:
  //         "Bình đang học tập rất tốt, đặc biệt là phần hình học không gian. Tuy nhiên, cháu còn hơi yếu ở phần Đại số, cụ thể là giải phương trình mũ và logarit.",
  //       timestamp: "20/04/2025 11:00",
  //       isParent: false,
  //     },
  //     {
  //       id: 7,
  //       sender: "Nguyễn Văn A",
  //       content:
  //         "Chào phụ huynh, tôi là giáo viên môn Toán của bạn Bình. Có điều gì tôi có thể giúp được không?",
  //       timestamp: "20/04/2025 10:30",
  //       isParent: false,
  //     },
  //     {
  //       id: 8,
  //       sender: "Phụ huynh",
  //       content:
  //         "Chào thầy, tôi muốn hỏi về tình hình học tập của cháu Bình trong thời gian gần đây.",
  //       timestamp: "20/04/2025 10:45",
  //       isParent: true,
  //     },
  //     {
  //       id: 9,
  //       sender: "Nguyễn Văn A",
  //       content:
  //         "Bình đang học tập rất tốt, đặc biệt là phần hình học không gian. Tuy nhiên, cháu còn hơi yếu ở phần Đại số, cụ thể là giải phương trình mũ và logarit.",
  //       timestamp: "20/04/2025 11:00",
  //       isParent: false,
  //     },
  //   ],
  //   "Trần Văn C": [
  //     {
  //       id: 1,
  //       sender: "Trần Văn C",
  //       content:
  //         "Xin chào phụ huynh, tôi là giáo viên môn Vật lý của bạn Bình.",
  //       timestamp: "19/04/2025 09:15",
  //       isParent: false,
  //     },
  //   ],
  //   "Phạm Thị D": [],
  // };

  useEffect(() => {
    if (selectedRoom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedRoom]); //, conversationHistory[selectedRoom ?? ""]

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedRoom) return;

    // Trong ứng dụng thực tế, bạn sẽ gửi tin nhắn tới API
    console.log("Gửi tin nhắn:", messageInput, "tới giáo viên:", selectedRoom);

    send("/app/chat", {
      roomId: selectedRoom.roomChatId,
      content: messageInput,
      receiverId: selectedRoom.user?.id,
    });

    // Clear input sau khi gửi
    setMessageInput("");
  };

  const { connect, subscribe, send, unsubscribe, disconnect } =
    useWebSocketService(
      () => console.log("Connected!"),
      (error) => console.log("WebSocket Error:", error),
    );

  useEffect(() => {
    connect();

    subscribe("/topic/chat", (message) => {
      // setMessages((prevMessages) => [...prevMessages, message.text]);
      console.log("New message received:", message);
    });

    return () => {
      unsubscribe("/topic/chat");
      disconnect();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {/* Danh sách giáo viên */}
      <RoomChatList
        // roomChats={teachers}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        searchQuery={""}
      />

      {/* Khu vực chat */}
      <ChatMessage
        selectedRoom={selectedRoom}
        // conversationHistory={conversationHistory}
        // teachers={teachers}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        emojiRef={emojiRef}
        messagesEndRef={messagesEndRef}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
}
