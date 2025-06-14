"use client";
import React, { useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { BsEmojiSmile, BsPerson } from "react-icons/bs";
import { CardHeader, CardTitle, CardDescription } from "../_common/Card";
import Image from "next/image";
import EmojiPicker from "emoji-picker-react";
import { Button } from "../_common/Button";
import { FaPaperPlane } from "react-icons/fa6";
import { RoomChatItem } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { getAllMessages } from "@/app/lib/services/chat";

// Sample message data
const sampleMessages = {
  content: [
    {
      id: "1",
      content:
        "Xin chào! Tôi là giáo viên chủ nhiệm lớp 10A1. Tôi muốn trao đổi về tình hình học tập của học sinh.",
      isSender: false,
      sendTime: "2024-03-15T08:30:00Z",
    },
    {
      id: "2",
      content:
        "Chào cô! Vâng, tôi rất sẵn lòng trao đổi. Cô có thể cho biết cụ thể về vấn đề gì không?",
      isSender: true,
      sendTime: "2024-03-15T08:32:00Z",
    },
    {
      id: "3",
      content:
        "Tôi thấy một số học sinh trong lớp có dấu hiệu chưa tập trung trong giờ học. Đặc biệt là môn Toán.",
      isSender: false,
      sendTime: "2024-03-15T08:33:00Z",
    },
    {
      id: "4",
      content:
        "Tôi hiểu rồi. Tôi sẽ trao đổi với phụ huynh và có biện pháp hỗ trợ thêm cho các em. Cô có thể cho biết cụ thể những học sinh nào không?",
      isSender: true,
      sendTime: "2024-03-15T08:35:00Z",
    },
    {
      id: "5",
      content:
        "Vâng, tôi sẽ gửi danh sách chi tiết cho anh/chị qua email. Cảm ơn sự hợp tác của anh/chị!",
      isSender: false,
      sendTime: "2024-03-15T08:36:00Z",
    },
    {
      id: "6",
      content:
        "Tôi đã nhận được email của cô. Tôi thấy có 5 học sinh cần được quan tâm đặc biệt. Cô có thể cho biết thêm về biểu hiện cụ thể của các em không?",
      isSender: true,
      sendTime: "2024-03-15T09:15:00Z",
    },
    {
      id: "7",
      content:
        "Vâng, tôi nhận thấy các em thường xuyên không làm bài tập về nhà, hay ngủ gật trong giờ học, và điểm kiểm tra 15 phút gần đây đều dưới trung bình.",
      isSender: false,
      sendTime: "2024-03-15T09:17:00Z",
    },
    {
      id: "8",
      content:
        "Tôi hiểu rồi. Tôi sẽ trao đổi với phụ huynh của từng em và đề xuất một số biện pháp hỗ trợ. Cô có gợi ý gì thêm không?",
      isSender: true,
      sendTime: "2024-03-15T09:20:00Z",
    },
    {
      id: "9",
      content:
        "Tôi nghĩ chúng ta nên tổ chức buổi họp phụ huynh sớm để trao đổi trực tiếp. Đồng thời, tôi sẽ tăng cường kiểm tra bài tập và có biện pháp nhắc nhở kịp thời.",
      isSender: false,
      sendTime: "2024-03-15T09:22:00Z",
    },
    {
      id: "10",
      content:
        "Đồng ý với cô. Tôi sẽ lên lịch họp phụ huynh vào tuần sau. Cô có thể cho biết thời gian nào phù hợp với cô không?",
      isSender: true,
      sendTime: "2024-03-15T09:25:00Z",
    },
    {
      id: "11",
      content:
        "Tôi có thể sắp xếp vào chiều thứ 4 hoặc thứ 6 tuần sau. Cô thấy thời gian nào phù hợp hơn?",
      isSender: false,
      sendTime: "2024-03-15T09:27:00Z",
    },
    {
      id: "12",
      content:
        "Chiều thứ 4 sẽ phù hợp hơn với tôi. Tôi sẽ gửi thông báo cho phụ huynh ngay bây giờ. Cảm ơn cô đã phối hợp!",
      isSender: true,
      sendTime: "2024-03-15T09:30:00Z",
    },
    {
      id: "13",
      content:
        "Vâng, tôi cũng sẽ chuẩn bị báo cáo chi tiết về tình hình học tập của từng em để trình bày trong buổi họp.",
      isSender: false,
      sendTime: "2024-03-15T09:32:00Z",
    },
    {
      id: "14",
      content:
        "Tuyệt vời! Tôi sẽ chuẩn bị các tài liệu hỗ trợ và đề xuất phương pháp học tập hiệu quả để chia sẻ với phụ huynh.",
      isSender: true,
      sendTime: "2024-03-15T09:35:00Z",
    },
    {
      id: "15",
      content:
        "Cảm ơn sự hợp tác của anh/chị. Tôi tin rằng với sự phối hợp chặt chẽ giữa nhà trường và gia đình, các em sẽ tiến bộ nhanh chóng.",
      isSender: false,
      sendTime: "2024-03-15T09:37:00Z",
    },
  ],
  totalElements: 15,
};

type ChatMessageProps = {
  selectedRoom: RoomChatItem | null;
  // conversationHistory: { [key: string]: Message[] };
  // teachers: Teacher[];
  messageInput: string;
  setMessageInput: React.Dispatch<React.SetStateAction<string>>;
  showEmojiPicker: boolean;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
  emojiRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  handleSendMessage: () => void;
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  selectedRoom,
  messageInput,
  setMessageInput,
  showEmojiPicker,
  setShowEmojiPicker,
  emojiRef,
  messagesEndRef,
  handleSendMessage,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: messages, status } = useQuery({
    queryKey: ["Messages", selectedRoom, currentPage - 1],
    queryFn: () =>
      getAllMessages(selectedRoom?.roomChatId, currentPage - 1, 10),
    enabled: !!selectedRoom?.roomChatId,
  });

  return (
    <div className="relative w-full lg:w-[calc(100%-270px)] h-full md:col-span-3 bg-white">
      <CardHeader className="w-full flex-none border-b bg-primary-lighter md:h-[60px] lg:h-[80px]">
        {selectedRoom ? (
          <div className="flex items-center">
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
                {selectedRoom?.listClassName.length > 0 &&
                  selectedRoom.listClassName.join(", ")}
              </CardDescription>
            </div>
          </div>
        ) : (
          <>
            <CardTitle className="text-primary-darkest text-sm lg:text-base">
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
          {selectedRoom &&
          (messages || sampleMessages) &&
          ((messages?.totalElements ?? 0) > 0 ||
            sampleMessages.totalElements > 0) ? (
            (messages?.content || sampleMessages.content)
              .slice()
              .reverse()
              .map((message) => (
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
                      {new Date(message.sendTime).toLocaleTimeString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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

          <div className="" ref={messagesEndRef}></div>
        </div>
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
