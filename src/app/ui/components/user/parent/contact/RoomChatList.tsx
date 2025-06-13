"use client";

import { BsPerson } from "react-icons/bs";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { useQuery } from "@tanstack/react-query";
import { getAllRooms } from "@/app/lib/services/chat";
import React, { useState } from "react";
import SearchField from "@/app/ui/components/_common/text-field/SearchField";
import { RoomChatItem } from "@/app/types";
// import { RoomChat } from "@/app/types";

// interface Teacher {
//   id: number;
//   name: string;
//   avatar: string;
//   classes: string[];
// }

interface RoomChatListProps {
  // roomChats: RoomChat[];
  selectedRoom: RoomChatItem | null;
  setSelectedRoom: React.Dispatch<React.SetStateAction<RoomChatItem | null>>;
  searchQuery: string;
}

const RoomChatList: React.FC<RoomChatListProps> = ({
  // roomChats,
  selectedRoom,
  setSelectedRoom,
  searchQuery,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: rooms, status } = useQuery({
    queryKey: ["RoomChats", currentPage - 1, searchQuery],
    queryFn: () => getAllRooms(currentPage - 1, 10, searchQuery, ""),
  });

  return (
    <div className="md:col-span-1 h-sub-screen-height">
      <Card className="h-full shadow-md bg-white border flex flex-col">
        <CardHeader className="">
          <CardTitle className="flex items-center text-primary-dark">
            <BsPerson className="mr-2" />
            Danh sách giáo vụ
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Chọn giáo vụ để nhắn tin
          </CardDescription>
          <SearchField className="w-full" placeholder="Tìm kiếm giáo vụ..." />
        </CardHeader>
        <CardContent className="space-y-2 py-2 max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          {rooms?.content.map((room) => (
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
    </div>
  );
};

export default RoomChatList;
