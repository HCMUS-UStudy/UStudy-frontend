"use client";

import React, { useEffect, useRef, useState } from "react";

import { ChatMessage } from "./ChatMessage";
import { useWebSocketService } from "@/app/hooks/use-web-socket";
import { Dialog } from "../_common/Dialog";
import { ContactList } from "./ContactList";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { MessageItem } from "@/app/types";
import { addMessage } from "@/app/store/ChatSlice";

const ContactPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const room = useAppSelector((state: any) => state.chat.room);
  const dispatch = useAppDispatch();
  // const [selectedRoom, setSelectedRoom] = useState<RoomChatItem>(
  //   teacherParam ?? "",
  // );
  // const [selectedRoom, setSelectedRoom] = useState<RoomChatItem | null>(null);
  const [messageInput, setMessageInput] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = useAppSelector((state: any) => state.chat.userId);

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

  const handleSendMessage = () => {
    if (!messageInput.trim() || !room) return;

    // Trong ứng dụng thực tế, bạn sẽ gửi tin nhắn tới API
    console.log("Gửi tin nhắn:", messageInput, "tới:", room);

    send("/app/chat", {
      roomId: room.roomChatId,
      content: messageInput,
      receiverId: room.user?.id,
    });
    dispatch(addMessage({ content: messageInput, isSender: true }));
    // Clear input sau khi gửi
    setMessageInput("");
  };

  const { connect, subscribe, send, unsubscribe, disconnect } =
    useWebSocketService(
      () => {
        // /user/{userId}/topic/messages
        console.log(`/user/${userId}/topic/messages`);
        subscribe(`/user/${userId}/topic/messages`, (_message) => {
          // setMessages((prevMessages) => [...prevMessages, message.text]);
          console.log("New message received:", _message);
          const message = _message as MessageItem;
          dispatch(
            addMessage({
              content: message.content,
              isSender: message.isSender,
            }),
          );
        });
      },
      (error) => console.log("WebSocket Error:", error),
    );

  useEffect(() => {
    connect();
    return () => {
      // /user/{userId}/topic/messages
      unsubscribe(`/user/${userId}/topic/messages`);
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
          <ContactList searchQuery="" />
        </div>

        <ChatMessage
          // selectedRoom={selectedRoom}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          emojiRef={emojiRef}
          handleSendMessage={handleSendMessage}
          openList={() => setDisplayList(true)}
        />
      </div>
      <Dialog isOpen={displayList} onClose={() => setDisplayList(false)}>
        <ContactList searchQuery="" closeList={() => setDisplayList(false)} />
      </Dialog>
    </>
  );
};

export { ContactPage };
