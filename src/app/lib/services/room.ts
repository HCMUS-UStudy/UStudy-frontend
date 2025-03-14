import { DaysInWeek, RoomData } from "@/app/types/type";
import axiosInstance from "@/app/lib/axios";

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
      {
        cache: {
          methods: ["post"],
        },
      },
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
