"use client";
import React, { memo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../_common/Card";
import { BsPerson } from "react-icons/bs";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllRooms, markMessageAsRead } from "@/app/lib/services/chat";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { setRoom } from "@/app/store/ChatSlice";
import { ContactsLoading } from "../_common/loading";
import { SearchField } from "../_common/text-field";
import { useSearchParams } from "next/navigation";
import { getUserDataFromCookies } from "@/app/lib/action";
import PlayAnimation from "../../../ui/lotties/animation";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import { markAsRead, setRoomChat } from "@/app/store/RoomChatSlice";

interface Props {
  closeList?: () => void;
}

const ContactList = ({ closeList }: Props) => {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedRoom = useAppSelector((state: any) => state.chat.room);
  const roomChats = useAppSelector((state) => state.roomChat.rooms);

  const params = useSearchParams();
  const name = params?.get("name") as string;

  const { addToast } = useCustomToast();

  const selectedChildId = useAppSelector(
    (state) => state.children.selectedChild?.id,
  );

  const { data: userData } = useQuery({
    queryKey: ["UserData"],
    queryFn: () => getUserDataFromCookies(),
    refetchOnWindowFocus: false,
  });

  const isParent = userData?.role.defaultRoute === "PARENT";

  const { data: rooms, status } = useQuery({
    queryKey: ["RoomChats", 0, name, selectedChildId || ""],
    queryFn: () => getAllRooms(0, 100, name, isParent ? selectedChildId : ""),
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (status === "success") {
      dispatch(setRoomChat(rooms.content));
    }
  }, [rooms, status]);

  const queryClient = useQueryClient();
  const markAsReadMutation = useMutation({
    mutationFn: (roomId: string) => markMessageAsRead(roomId),
    onError: () => {
      addToast.error("Không thể đánh dấu tin nhắn đã đọc");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["RoomChats"] });
    },
  });

  return (
    <Card className="h-full shadow-none hover:shadow-none bg-white border flex flex-col">
      <CardHeader className="h-[80px]">
        <CardTitle className="flex items-center text-primary-darkest text-sm lg:text-base">
          <BsPerson className="mr-2 hidden lg:flex" />
          Danh sách giáo vụ
        </CardTitle>
        <CardDescription className="text-gray-500 text-xs lg:text-sm">
          Chọn giáo vụ để nhắn tin
        </CardDescription>
        <SearchField placeholder="Tìm theo tên..." queryKey={["name"]} />
      </CardHeader>
      <CardContent className="space-y-2 py-2 flex-1 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 mt-5">
        {status === "pending" ? (
          <ContactsLoading />
        ) : (
          <>
            {rooms?.totalElements === 0 ? (
              <div className="w-full h-full flex justify-center items-center  rounded-lg  bg-primary-lighter border-2 border-dashed border-primary-dark">
                <div className="w-36">
                  <PlayAnimation animationKey="xIcon" loop={false} />
                  <div className="text-primary-darker font-bold w-full text-center">
                    Không có giáo vụ nào được tìm thấy
                  </div>
                </div>
                {/* <EmptyListOrTable
                  message="Không có giáo vụ nào được tìm thấy"
                  className="md:text-sm"
                /> */}
                {/* <div className="text-primary-darkest text-base text-center">
                  Không có giáo vụ nào được tìm thấy
                </div> */}
              </div>
            ) : (
              <>
                {roomChats.map((room) => (
                  <div
                    key={room.user.id}
                    className={`relative flex items-center p-3 border rounded cursor-pointer transition-all duration-200 ease-in-out hover:shadow-sm ${
                      selectedRoom?.user.id === room.user.id
                        ? "border-primary-dark bg-primary-lighter"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      // setSelectedRoom(room);
                      dispatch(setRoom(room));
                      markAsReadMutation.mutate(room.user.id);
                      dispatch(markAsRead(room.user.id));
                      if (closeList) closeList();
                    }}
                  >
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
                            src={`/userAvatars/${room.user.avatar || "cat"}.png`}
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
                      {room.listClassName && room.listClassName.length > 0 && (
                        <p className="text-xs text-gray-500">
                          Lớp phụ trách: {room.listClassName.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(ContactList);
