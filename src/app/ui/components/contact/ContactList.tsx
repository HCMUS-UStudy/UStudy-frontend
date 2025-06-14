"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../_common/Card";
import { BsPerson } from "react-icons/bs";
import Image from "next/image";
import { RoomChatItem } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { getAllRooms } from "@/app/lib/services/chat";

export const sampleRoomChats: RoomChatItem[] = [
  {
    roomChatId: "1",
    user: {
      id: "1",
      genId: "T001",
      email: "nguyenvana@example.com",
      name: "Nguyễn Văn A",
      avatar: "/avatars/teacher1.jpg",
    },
    listClassName: ["10A1", "10A2", "11A1"],
    unreadCount: 3,
  },
  {
    roomChatId: "2",
    user: {
      id: "2",
      genId: "T002",
      email: "tranthib@example.com",
      name: "Trần Thị B",
      avatar: "",
    },
    listClassName: ["9A1", "9A2"],
    unreadCount: 0,
  },
  {
    roomChatId: "3",
    user: {
      id: "3",
      genId: "T003",
      email: "levanc@example.com",
      name: "Lê Văn C",
      avatar: "",
    },
    listClassName: ["12A1", "12A2", "12A3"],
    unreadCount: 1,
  },
  {
    roomChatId: "4",
    user: {
      id: "4",
      genId: "T004",
      email: "phamthid@example.com",
      name: "Phạm Thị D",
      avatar: "/avatars/teacher4.jpg",
    },
    listClassName: ["8A1", "8A2"],
    unreadCount: 5,
  },
  {
    roomChatId: "5",
    user: {
      id: "5",
      genId: "T005",
      email: "hoangvane@example.com",
      name: "Hoàng Văn E",
      avatar: "",
    },
    listClassName: ["7A1", "7A2", "7A3"],
    unreadCount: 0,
  },
];

interface Props {
  selectedRoom: RoomChatItem | null;
  setSelectedRoom: React.Dispatch<React.SetStateAction<RoomChatItem | null>>;
  searchQuery: string;
}

export const ContactList = ({
  selectedRoom,
  setSelectedRoom,
  searchQuery,
}: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: rooms, status } = useQuery({
    queryKey: ["RoomChats", currentPage - 1, searchQuery],
    queryFn: () => getAllRooms(currentPage - 1, 10, searchQuery, ""),
  });
  return (
    <Card className="h-full shadow-md bg-white border flex flex-col">
      <CardHeader className="h-[80px]">
        <CardTitle className="flex items-center text-primary-darkest text-sm lg:text-base">
          <BsPerson className="mr-2 hidden lg:flex" />
          Danh sách giáo vụ
        </CardTitle>
        <CardDescription className="text-gray-500 text-xs lg:text-sm">
          Chọn giáo vụ để nhắn tin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 py-2 flex-1 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        {sampleRoomChats.map((room) => (
          <div
            key={room.roomChatId}
            className={`relative flex items-center p-3 border rounded cursor-pointer transition-all duration-200 ease-in-out hover:shadow-sm ${
              selectedRoom?.roomChatId === room.roomChatId
                ? "border-primary-dark bg-primary-lighter"
                : "hover:bg-gray-50"
            }`}
            onClick={() => setSelectedRoom(room)}
          >
            {/*Show num un-read message*/}
            <div className="absolute -top-2 -right-2">
              {room.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {room.unreadCount}
                </span>
              )}
            </div>
            <div className="relative w-11 h-11 mr-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100 flex items-center justify-center">
                {room.user.avatar ? (
                  <Image
                    width={36}
                    height={36}
                    src={room.user.avatar}
                    alt={room.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BsPerson size={24} className="text-primary-dark" />
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-md"></span>
            </div>
            <div className="text-sm">
              <p className="font-semibold text-primary-dark">
                {room.user.name}
              </p>
              {room.listClassName.length > 0 && (
                <p className="text-xs text-gray-500">
                  Lớp phụ trách: {room.listClassName.join(", ")}
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
