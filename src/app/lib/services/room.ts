import { DaysInWeek, RoomData } from "@/app/types";
import { RoomListResponse, RoomResponse, RoomRequest } from "@/app/types/room";
import axiosInstance from "@/app/lib/axios";

/**
 * Get available rooms for scheduling
 * @param branchId - ID of the branch
 * @param day - Day of the week
 * @param branchSessionId - Branch session ID
 * @param startDate - Start date
 * @param numLessons - Number of lessons
 * @returns Promise<RoomData>
 */
export const getAvailableRooms = async (
  branchId: string,
  day: DaysInWeek,
  branchSessionId: string,
  startDate: string,
  numLessons: number,
): Promise<RoomData> => {
  const body = {
    day,
    branchSessionId,
    startDate,
    numLessons,
  };
  try {
    const response = await axiosInstance.post(
      `/room/list-available/${branchId}`,
      body,
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get branch rooms with pagination
 * @param branchId - ID of the branch
 * @param page - Page number (default: 0)
 * @param limit - Page size (default: 10)
 * @returns Promise<RoomListResponse>
 */
export const getBranchRooms = async (
  branchId: string,
  page: number = 0,
  limit: number = 10,
): Promise<RoomListResponse> => {
  try {
    const response = await axiosInstance.get(`/room/list/${branchId}`, {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new room
 * @param branchId - ID of the branch
 * @param roomData - Room data (name)
 * @returns Promise<RoomResponse>
 */
export const createRoom = async (
  branchId: string,
  roomData: RoomRequest,
): Promise<RoomResponse> => {
  try {
    const response = await axiosInstance.post(
      `/room/create/${branchId}`,
      roomData,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing room
 * @param roomId - ID of the room to update
 * @param roomData - Updated room data (name)
 * @returns Promise<RoomResponse>
 */
export const updateRoom = async (
  roomId: string,
  roomData: RoomRequest,
): Promise<RoomResponse> => {
  try {
    const response = await axiosInstance.put(
      `/room/update/${roomId}`,
      roomData,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a room
 * @param roomId - ID of the room to delete
 * @returns Promise<RoomResponse>
 */
export const deleteRoom = async (roomId: string): Promise<RoomResponse> => {
  try {
    const response = await axiosInstance.delete(`/room/delete/${roomId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a single room by ID
 * @param roomId - ID of the room
 * @returns Promise<RoomResponse>
 */
export const getRoomById = async (roomId: string): Promise<RoomResponse> => {
  try {
    const response = await axiosInstance.get(`/room/${roomId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
