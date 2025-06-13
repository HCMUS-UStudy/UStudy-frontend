import axiosInstance from "@/app/lib/axios";
import { MessageList, RoomChat } from "@/app/types";

export const getAllRooms = async (
  currentPage: number,
  limit: number,
  filter?: string,
  userId?: string,
): Promise<RoomChat> => {
  try {
    const response = await axiosInstance.get(`/room-chat/list`, {
      params: {
        page: currentPage,
        limit: limit,
        filter: filter,
        userId: userId,
      },
    });
    console.log("getAllRooms response", response.data.data);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getAllMessages = async (
  roomId: string | null | undefined,
  currentPage: number,
  limit: number,
): Promise<MessageList> => {
  try {
    if (!roomId) {
      return {
        content: [],
        pageNumber: 0,
        pageSize: limit,
        last: true,
        totalElements: 0,
        totalPages: 1,
      };
    }

    const response = await axiosInstance.get(`/message/list/${roomId}`, {
      params: {
        page: currentPage,
        limit: limit,
      },
    });
    console.log("getAllMessages response", response.data.data);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
