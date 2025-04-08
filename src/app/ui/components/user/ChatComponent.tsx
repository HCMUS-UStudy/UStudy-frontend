"use client";

import React, { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { FiPaperclip } from "react-icons/fi";
import { UserData } from "@/app/types";
import { getUserDataFromCookies } from "@/app/lib/action";
import EmojiPicker from 'emoji-picker-react';
import { MdEmojiEmotions } from "react-icons/md";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatComponentProps {
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  receiverId,
  receiverName,
  receiverAvatar,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUserDataFromCookies();
      setUserInfo(userData);
      
      // Ở đây sẽ có API để lấy lịch sử chat giữa hai người dùng
      // Mô phỏng dữ liệu để demo
      const demoMessages: Message[] = [
        {
          id: "1",
          senderId: userData?.genId || "",
          content: "Xin chào, bạn khỏe không?",
          timestamp: new Date(Date.now() - 60 * 60000),
          isRead: true,
        },
        {
          id: "2",
          senderId: receiverId,
          content: "Tôi khỏe, cảm ơn bạn đã hỏi!",
          timestamp: new Date(Date.now() - 55 * 60000),
          isRead: true,
        },
        {
          id: "3",
          senderId: userData?.genId || "",
          content: "Bạn đã làm bài tập về nhà chưa?",
          timestamp: new Date(Date.now() - 30 * 60000),
          isRead: true,
        },
        {
          id: "4",
          senderId: receiverId,
          content: "Tôi đang làm. Còn một vài câu hỏi khó.",
          timestamp: new Date(Date.now() - 25 * 60000),
          isRead: true,
        },
      ];
      
      setMessages(demoMessages);
    };
    
    fetchData();
  }, [receiverId]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "" && userInfo) {
      const newMsg: Message = {
        id: Date.now().toString(),
        senderId: userInfo.genId,
        content: newMessage,
        timestamp: new Date(),
        isRead: false,
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage("");
      
      // Ở đây sẽ có API để gửi tin nhắn đến server
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleEmojiClick = (emojiData: any) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setIsEmojiPickerOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-foreground rounded-[22px] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex items-center bg-primary/5">
        <div className="w-10 h-10 relative rounded-full overflow-hidden mr-3">
          {receiverAvatar ? (
            <img
              src={receiverAvatar}
              alt={receiverName}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-lg font-semibold">
                {receiverName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div>
          <h3 className="font-semibold">{receiverName}</h3>
          <p className="text-xs text-gray-500">
            {/* status sẽ được cập nhật từ API */}
            Trực tuyến
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto"
        style={{ minHeight: 0 }} // Fix cho Firefox
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.senderId === userInfo?.genId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.senderId === userInfo?.genId
                  ? "bg-primary text-white rounded-tr-none"
                  : "bg-gray-200 text-gray-800 rounded-tl-none"
              }`}
            >
              <p className="break-words">{message.content}</p>
              <div
                className={`text-xs mt-1 ${
                  message.senderId === userInfo?.genId
                    ? "text-primary-foreground/80"
                    : "text-gray-500"
                }`}
              >
                {formatTime(message.timestamp)}
                {message.senderId === userInfo?.genId && (
                  <span className="ml-1">
                    {message.isRead ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 border-t flex items-end gap-2">
        <button 
          className="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100"
        >
          <FiPaperclip size={20} />
        </button>
        
        <div className="relative flex-1">
          {isEmojiPickerOpen && (
            <div className="absolute bottom-12 left-0">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
          
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            placeholder="Nhập tin nhắn..."
            rows={1}
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />
          
          <button 
            className="absolute bottom-2 right-12 p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100"
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
          >
            <MdEmojiEmotions size={20} />
          </button>
        </div>
        
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className={`p-3 rounded-full ${
            newMessage.trim()
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          <IoSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(ChatComponent); 