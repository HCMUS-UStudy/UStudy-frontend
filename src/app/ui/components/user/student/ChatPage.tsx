"use client";

import React, { useEffect, useState } from "react";
import PageWrapperStu from "../PageWrapperStu";
import ChatComponent from "../ChatComponent";
import { UserData } from "@/app/types";
import { getUserDataFromCookies } from "@/app/lib/action";
import { Contact, allContacts, mockTeachers, mockStudents, mockAdmins } from "./mockContacts";
import { FiSearch } from "react-icons/fi";
import { BiUser } from "react-icons/bi";
import { IoSchoolOutline } from "react-icons/io5";
import { BsPersonWorkspace } from "react-icons/bs";
import { PiUserGearLight } from "react-icons/pi";

const ChatPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "teachers" | "students" | "admins">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const userData = await getUserDataFromCookies();
      setUserInfo(userData);
      
      // Sử dụng dữ liệu giả định
      setContacts(allContacts);
      
      // Mặc định chọn liên hệ đầu tiên
      if (allContacts.length > 0) {
        setSelectedContact(allContacts[0]);
      }
      
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Lọc danh sách liên hệ theo tab đang kích hoạt
  useEffect(() => {
    switch(activeTab) {
      case "teachers":
        setContacts(mockTeachers);
        break;
      case "students":
        setContacts(mockStudents);
        break;
      case "admins":
        setContacts(mockAdmins);
        break;
      default:
        setContacts(allContacts);
    }
  }, [activeTab]);

  // Lọc danh sách liên hệ theo từ khóa tìm kiếm
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format thời gian tin nhắn cuối cùng
  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    }
  };

  // Icon cho trạng thái trực tuyến
  const getStatusIcon = (status: string) => {
    switch(status) {
      case "online":
        return <span className="w-3 h-3 bg-green-500 rounded-full"></span>;
      case "busy":
        return <span className="w-3 h-3 bg-red-500 rounded-full"></span>;
      case "away":
        return <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>;
      default:
        return <span className="w-3 h-3 bg-gray-500 rounded-full"></span>;
    }
  };

  return (
    <PageWrapperStu>
      <div className="flex h-full">
        {/* Sidebar danh sách người dùng */}
        <div className="w-1/3 pr-4 border-r overflow-y-auto">
          <div className="sticky top-0 bg-foreground z-10 pt-1 pb-3">
            <h2 className="text-xl font-bold mb-3">Tin nhắn</h2>
            
            {/* Thanh tìm kiếm */}
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Tìm kiếm liên hệ..." 
                className="w-full py-2 pl-9 pr-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Tabs */}
            <div className="flex justify-between mb-4 bg-gray-100 rounded-lg p-1">
              <button 
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 text-sm ${activeTab === "all" ? "bg-white shadow-sm" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                <BiUser /> Tất cả
              </button>
              <button 
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 text-sm ${activeTab === "teachers" ? "bg-white shadow-sm" : ""}`}
                onClick={() => setActiveTab("teachers")}
              >
                <BsPersonWorkspace /> Giáo viên
              </button>
              <button 
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 text-sm ${activeTab === "students" ? "bg-white shadow-sm" : ""}`}
                onClick={() => setActiveTab("students")}
              >
                <IoSchoolOutline /> Học sinh
              </button>
              <button 
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 text-sm ${activeTab === "admins" ? "bg-white shadow-sm" : ""}`}
                onClick={() => setActiveTab("admins")}
              >
                <PiUserGearLight /> Admin
              </button>
            </div>
          </div>
          
          {/* Danh sách liên hệ */}
          <div className="space-y-1">
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse flex p-3 rounded-md">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`flex p-3 rounded-md cursor-pointer transition-colors ${
                    selectedContact?.id === contact.id
                      ? "bg-primary/10"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 relative rounded-full overflow-hidden mr-3">
                      <img 
                        src={contact.avatar} 
                        alt={contact.name} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute bottom-0 right-2">
                      {getStatusIcon(contact.status)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium truncate">{contact.name}</p>
                      {contact.lastMessage && (
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-1">
                          {formatLastMessageTime(contact.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {contact.lastMessage && (
                        <p className="text-sm text-gray-600 truncate max-w-[180px]">
                          {contact.lastMessage.content}
                        </p>
                      )}
                      
                      {contact.unreadCount && contact.unreadCount > 0 && (
                        <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                Không tìm thấy liên hệ nào
              </div>
            )}
          </div>
        </div>

        {/* Khu vực chat */}
        <div className="w-2/3 pl-4">
          {selectedContact ? (
            <ChatComponent
              receiverId={selectedContact.id}
              receiverName={selectedContact.name}
              receiverAvatar={selectedContact.avatar}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <img 
                src="https://i.pravatar.cc/150?img=20" 
                alt="Chat illustration" 
                className="w-40 h-40 rounded-full mb-4 opacity-50"
              />
              <p className="text-gray-500 text-lg">Vui lòng chọn một liên hệ để bắt đầu cuộc trò chuyện</p>
            </div>
          )}
        </div>
      </div>
    </PageWrapperStu>
  );
};

export default ChatPage; 