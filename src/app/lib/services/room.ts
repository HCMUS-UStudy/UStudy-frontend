import { SessionTimeItem } from "@/app/types/type";
import axiosInstance from "@/app/lib/axios";

export const getAvailableRooms = async (
  branchId: string,
  times: SessionTimeItem[],
  startDate: string,
  endDate: string,
) => {
  const body = {
    times: times,
    startDate: startDate,
    endDate: endDate,
  };
  try {
    const response = await axiosInstance.post(
      `/room/list-available/${branchId}`,
      body,
      {
        params: {
          page: 0,
          limit: 10,
        },
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};
