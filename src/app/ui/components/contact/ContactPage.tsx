"use client";

import React, { useEffect, useRef, useState } from "react";

import { ChatMessage } from "./ChatMessage";
import { RoomChatItem } from "@/app/types";
import { useWebSocketService } from "@/app/hooks/use-web-socket";
import { Dialog } from "../_common/Dialog";
import { ContactList } from "./ContactList";

const ContactPage = () => {
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

  const [displayList, setDisplayList] = useState<boolean>(false);

  return (
    <>
      <div className="flex h-full">
        <div
          className={`w-[270px] min-w-[270px] hidden lg:flex flex-col h-full`}
        >
          <ContactList
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
            searchQuery=""
          />
        </div>

        <ChatMessage
          selectedRoom={selectedRoom}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          emojiRef={emojiRef}
          messagesEndRef={messagesEndRef}
          handleSendMessage={handleSendMessage}
        />
      </div>
      <Dialog isOpen={displayList} onClose={() => setDisplayList(false)}>
        <ContactList
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          searchQuery=""
        />
      </Dialog>
    </>
  );
};

export { ContactPage };
