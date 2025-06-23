"use client";
import React, { useEffect, useRef } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { BsEmojiSmile, BsPerson } from "react-icons/bs";
import { CardHeader, CardTitle, CardDescription } from "../_common/Card";
import Image from "next/image";
import EmojiPicker from "emoji-picker-react";
import { Button } from "../_common/Button";
import { FaListUl, FaPaperPlane } from "react-icons/fa6";
import { useAppSelector } from "@/app/store/store";
import Loading from "../_common/loading/Loading";

type ChatMessageProps = {
  messageInput: string;
  setMessageInput: React.Dispatch<React.SetStateAction<string>>;
  showEmojiPicker: boolean;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
  emojiRef: React.RefObject<HTMLDivElement>;
  handleSendMessage: () => void;
  openList: () => void;
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  // selectedRoom,
  messageInput,
  setMessageInput,
  showEmojiPicker,
  setShowEmojiPicker,
  emojiRef,
  handleSendMessage,
  openList,
}) => {
  const messages = useAppSelector((state) => state.chat.chatHistory);
  const status = useAppSelector((state) => state.chat.status);
  const selectedRoom = useAppSelector((state) => state.chat.room);

  const ref = useRef<HTMLDivElement | null>(null);

  // console.log(messages);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  return (
    <div className="relative w-full lg:w-[calc(100%-270px)] h-full md:col-span-3 bg-white">
      <CardHeader className="w-full flex-none border-b bg-primary-lighter md:h-[60px] lg:h-[80px]">
        {selectedRoom ? (
          <div className="flex items-center">
            <FaListUl
              onClick={openList}
              className="flex lg:hidden mr-3 size-5 text-primary-darker hover:text-primary-darkest transition-all cursor-pointer"
            />
            <div className="relative size-9 lg:size-11 mr-3">
              <div className="size-9 lg:size-11 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100 flex items-center justify-center">
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
              <span className="absolute md:bottom-1 md:right-1 lg:-bottom-1 lg:-right-1 md:size-3 lg:w-3.5 lg:h-3.5 bg-green-500 rounded-full border-2 border-white shadow-md"></span>
            </div>

            <div>
              <CardTitle className="text-primary-darkest text-sm lg:text-base">
                {selectedRoom?.user?.name}
              </CardTitle>
              <CardDescription className="text-gray-500 text-xs lg:text-sm">
                {selectedRoom.listClassName &&
                  selectedRoom?.listClassName.length > 0 &&
                  selectedRoom.listClassName.join(", ")}
              </CardDescription>
            </div>
          </div>
        ) : (
          <>
            <CardTitle className="flex text-primary-darkest text-sm lg:text-base">
              <FaListUl
                onClick={openList}
                className="flex lg:hidden mr-3 size-5 text-primary-darker hover:text-primary-darkest transition-all cursor-pointer"
              />
              Tin nhắn
            </CardTitle>
            <CardDescription className=" text-gray-500 text-sm lg:text-base">
              Chọn một giáo viên để bắt đầu cuộc trò chuyện
            </CardDescription>
          </>
        )}
      </CardHeader>
      <div className="relative min-h-[65vh] max-h-[65vh] overflow-auto">
        <div className="space-y-4 py-4 px-4   bg-white  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {status === "pending" ? (
            <Loading />
          ) : (
            <>
              {selectedRoom && messages && (messages.length ?? 0) > 0 ? (
                messages.map((message) => (
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
                        {new Date(message.sendTime).toLocaleTimeString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : selectedRoom ? (
                <div className="flex items-center justify-center flex-1 h-64">
                  <div className="text-center text-primary-darkest">
                    <FaRegCommentDots className="size-10 lg:size-16 mx-auto mb-2" />
                    <p className="font-semibold">
                      Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center flex-1 h-64">
                  <div className="text-center text-primary-darkest">
                    <FaRegCommentDots className="size-10 lg:size-16 mx-auto mb-2" />
                    <p className="font-semibold">
                      Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="" ref={ref}></div>
      </div>
      <div className="sticky right-0  bottom-0  w-full">
        {selectedRoom && (
          // lg:mx-1 xl:mx-2 left-[19vw] md:left-[33vw] lg:left-[41vw] xl:left-[36vw]
          <div className=" w-full bg-primary-lighter backdrop-blur-sm border-t-2 border-slate-200 ">
            <div className="py-4 px-4">
              <div className="flex flex-col gap-2 relative max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    rows={2}
                    className="flex-grow w-full text-xs md:text-sm xl:text-base md:w-auto resize-none p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    className="text-2xl text-gray-500 hover:text-primary-dark transition flex-shrink-0"
                    title="Chèn emoji"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <BsEmojiSmile className="size-5 md:size-7" />
                  </button>
                  {showEmojiPicker && (
                    <div
                      ref={emojiRef}
                      className="absolute bottom-16 right-0 z-10"
                    >
                      <EmojiPicker
                        className="h-20"
                        onEmojiClick={(emojiData) =>
                          setMessageInput((prev) => prev + emojiData.emoji)
                        }
                      />
                    </div>
                  )}
                  <Button
                    onClick={handleSendMessage}
                    className="p-3 bg-primary-dark text-white rounded-full hover:bg-primary-darker transition duration-200 flex-shrink-0"
                    title="Gửi tin nhắn"
                  >
                    <FaPaperPlane className="size-3 md:size-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { ChatMessage };
