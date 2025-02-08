import { TimeItem } from "@/app/types/type";
import axiosInstance from "@/app/lib/axios";

export const getAvailableRooms = async (
  branchId: string,
  times: TimeItem[],
  startDate: string,
  endDate: string,
) => {
  const body = {
    branchId: branchId,
    times: times,
    startDate: startDate,
    endDate: endDate,
  };
  const response = await axiosInstance.post("/room/clerk/available", body, {
    params: {
      branchId: branchId,
      page: 0,
      limit: 10,
    },
  });
  return response;
};
