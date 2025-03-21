import axiosInstance from "@/app/lib/axios";
import { AttendaceData } from "@/app/types/type";

export const getAllAttendances = async (
  currentPage: number,
  limit: number,
  classScheduleId: string,
  status: string,
): Promise<AttendaceData> => {
  const response = await axiosInstance.get(
    `/attendance/list/${classScheduleId}`,
    {
      params: {
        page: currentPage,
        limit: limit,
        classScheduleId: classScheduleId,
        status: status,
      },
    },
  );
  return response.data.data;
};
