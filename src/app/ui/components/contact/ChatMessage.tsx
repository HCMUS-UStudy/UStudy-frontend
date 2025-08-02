"use client";
import React, { memo, useEffect, useRef } from "react";
import { BsPerson } from "react-icons/bs";
import { CardHeader, CardTitle, CardDescription } from "../_common/Card";
import Image from "next/image";
import { Button } from "../_common/Button";
import { FaListUl, FaPaperPlane } from "react-icons/fa6";
import { useAppSelector } from "@/app/store/store";
import PlayAnimation from "../../lotties/animation";

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
  handleSendMessage,
  openList,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages = useAppSelector((state: any) => state.chat.chatHistory);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const status = useAppSelector((state: any) => state.chat.status);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedRoom = useAppSelector((state: any) => state.chat.room);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  return (
    <div className="relative w-full lg:w-[calc(100%-270px)] h-full md:col-span-3 bg-primary-lighter">
      <CardHeader className="w-full flex-none border-b bg-primary md:h-[60px] lg:h-[80px] ">
        {selectedRoom ? (
          <div className="flex items-center">
            <FaListUl
              onClick={openList}
              className="flex lg:hidden mr-3 size-5 text-primary-darker hover:text-primary-darkest transition-all cursor-pointer"
              title="Open List"
            />
            <div className="relative size-9 lg:size-11 mr-3">
              <div className="size-9 lg:size-11 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100 flex items-center justify-center">
                {selectedRoom.user?.avatar ? (
                  <Image
                    width={36}
                    height={36}
                    src={`/userAvatars/${selectedRoom.user.avatar}.png`}
                    alt={selectedRoom.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BsPerson
                    size={24}
                    className="text-primary-dark"
                    data-testid="person-icon"
                  />
                )}
              </div>
              <span
                className="absolute md:bottom-1 md:right-1 lg:-bottom-1 lg:-right-1 md:size-3 lg:w-3.5 lg:h-3.5 bg-green-500 rounded-full border-2 border-white shadow-md"
                data-testid="online-indicator"
              ></span>
            </div>

            <div>
              <CardTitle className="text-primary-darkest text-sm lg:text-base">
                {selectedRoom?.user?.name}
              </CardTitle>
              <CardDescription className="text-gray-900 text-xs lg:text-sm">
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
                className="flex lg:hidden mr-3 size-5 text-primary-darker hover:text-primary-darkest transition-all cursor-pointer lg:text-xl"
                title="Open List"
              />
              Tin nhắn
            </CardTitle>
            <CardDescription className=" text-gray-700 text-sm lg:text-base">
              Chọn một giáo viên để bắt đầu cuộc trò chuyện
            </CardDescription>
          </>
        )}
      </CardHeader>
      <div className="relative min-h-[65vh] max-h-[65vh] overflow-auto">
        <div className="space-y-4 py-4 px-4   bg-primary-lighter  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {status === "pending" ? (
            <div className="w-1/3 mx-auto bg-primary-lighter rounded-full p-10 mt-5">
              <PlayAnimation animationKey="chatLoading" />
              <div className="text-center font-semibold text-primary-darkest">
                Đang tải tin nhắn...
              </div>
            </div>
          ) : (
            <>
              {selectedRoom && messages && (messages.length ?? 0) > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                messages.map((message: any) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isSender ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
                        message.isSender
                          ? "bg-primary-dark text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p>
                        {message.content === "" ? "\u00A0" : message.content}
                      </p>
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
                <div className="flex items-center justify-center flex-1 h-64 lg:text-xl bg-primary-lighter">
                  <div className="flex flex-col w-2/5 pt-40">
                    <PlayAnimation animationKey={"chat"} loop={true} />
                    <p className="font-semibold text-primary-darkest text-center text-nowrap">
                      Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center flex-1 h-64 lg:text-xl ">
                  <div className="flex flex-col w-2/5 pt-40">
                    <PlayAnimation animationKey={"chat"} loop={true} />
                    <p className="font-semibold text-primary-darkest text-center text-nowrap">
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
      <div className="sticky right-0 bottom-0 w-full">
        {selectedRoom && (
          // lg:mx-1 xl:mx-2 left-[19vw] md:left-[33vw] lg:left-[41vw] xl:left-[36vw]
          <div className=" w-full bg-primary-lighter backdrop-blur-sm border-t-2 border-slate-200 ">
            <div className="py-4 px-4">
              <div className="flex flex-col relative max-w-7xl mx-auto">
                <div className="flex items-center gap-8 justify-between">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    rows={2}
                    className="flex-grow w-full text-xs md:text-sm xl:text-base placeholder:text-gray-700 md:w-auto resize-none p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark transition-all"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  {/* <button
                    className="text-2xl text-gray-500 hover:text-primary-dark transition flex-shrink-0"
                    title="Chèn emoji"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <BsEmojiSmile className="size-5 md:size-7" />
                  </button> */}
                  {/* {showEmojiPicker && (
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
                  )} */}
                  <Button
                    onClick={handleSendMessage}
                    className="p-8 bg-primary-darker text-white rounded-lg hover:bg-primary-darkest transition duration-200 flex-shrink-0"
                    title="Gửi tin nhắn"
                  >
                    <FaPaperPlane className="size-3 md:size-8" />
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

export default memo(ChatMessage);
